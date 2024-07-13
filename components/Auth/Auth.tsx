import { useToggle, upperFirst } from '@mantine/hooks';
import React, { useState } from 'react';
import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
} from '@mantine/core';
import classes from './Auth.module.css';
import { GoogleButton } from './GoogleButton';
import { auth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from "../../firebase/config/Firebase";
import { collection, doc, setDoc, getFirestore, getDoc } from 'firebase/firestore';
import { User } from '../../firebase/Models/User';
import { Request } from '@/firebase/Models/Request';

const db = getFirestore();

const Auth = (props: PaperProps) => {
  const [type, toggle] = useToggle(['login', 'register']);
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
  
      const email = result.user?.email; // Use optional chaining to safely access email
  
      if (email) {
        const response = await fetch('/api/send-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
  
        if (response.ok) {
          setOtpSent(true);
          setUserEmail(email);
        } else {
          console.error('Failed to send OTP');
        }
      } else {
        console.error('Email not found for the authenticated user.');
      }
    } catch (error) {
      console.error('Error signing in with Google:', (error as Error).message);
    }
  };
  
  const verifyOtp = async () => {
    const response = await fetch(`/api/send-otp?email=${userEmail}&otp=${otp}`);
    if (response.ok) {
      alert('OTP verified. Login successful.');
      // Redirect or show the main content upon successful login
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  const handleEmailRegister = async () => {
    try {
      const { email, password } = form.values;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      alert('A verification email has been sent to your email address. Please verify your email before logging in.');

      // Clear form fields
      form.reset();
    } catch (error) {
      console.error('Error registering with email:', (error as Error).message);
    }
  };

  const handleEmailLogin = async () => {
    try {
      const { email, password } = form.values;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        alert('Please verify your email address before logging in.');
        return;
      }

      // Redirect or show the main content upon successful login
    } catch (error) {
      console.error('Error logging in with email:', (error as Error).message);
    }
  };

  const handleSubmit = async () => {
    if (type === 'register') {
      handleEmailRegister();
    } else {
      handleEmailLogin();
    }
  };

  return (
    <Paper className={classes.authForm} radius="md" p="xl" withBorder {...props}>
      <Text size="lg" fw={500}>
        Welcome to WHILE, {type} with
      </Text>

      <Group grow mb="md" mt="md">
        <GoogleButton onClick={handleGoogleLogin} radius="xl">Google</GoogleButton>
      </Group>

      <Divider label="Or continue with email" labelPosition="center" my="lg" />

      {otpSent ? (
        <div>
          <TextInput
            label="OTP"
            placeholder="Enter OTP"
            value={otp}
            onChange={(event) => setOtp(event.currentTarget.value)}
            radius="md"
          />
          <Button onClick={verifyOtp} radius="xl">Verify OTP</Button>
        </div>
      ) : (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            {type === 'register' && (
              <TextInput
                label="Name"
                placeholder="Your name"
                value={form.values.name}
                onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                radius="md"
              />
            )}

            <TextInput
              required
              label="Email"
              placeholder="hello@mantine.dev"
              value={form.values.email}
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
              error={form.errors.email && 'Invalid email'}
              radius="md"
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
              error={form.errors.password && 'Password should include at least 6 characters'}
              radius="md"
            />

            {type === 'register' && (
              <Checkbox
                label="I accept terms and conditions"
                checked={form.values.terms}
                onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
              />
            )}
          </Stack>

          <Group justify="space-between" mt="xl">
            <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
              {type === 'register'
                ? 'Already have an account? Login'
                : "Don't have an account? Register"}
            </Anchor>
            <Button type="submit" radius="xl">
              {upperFirst(type)}
            </Button>
          </Group>
        </form>
      )}
    </Paper>
  );
};

export default Auth;
