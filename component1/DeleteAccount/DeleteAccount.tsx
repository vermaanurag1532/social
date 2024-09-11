// components/EmailForm.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { deleteAccount } from '../../utils/deleteUser';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config/Firebase';

const FormContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f0f0f0;
  padding: 20px;
`;

const Input = styled(motion.input)`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  max-width: 400px;
  margin: 10px 0;
`;

const Button = styled(motion.button)`
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  background-color: #0070f3;
  color: white;
  cursor: pointer;
  width: 100%;
  max-width: 400px;
  margin: 10px 0;

  &:hover {
    background-color: #005bb5;
  }
`;

const EmailForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const { authId, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) {
      alert('Loading...');
      return;
    }

    if (!authId) {
      alert('User is not logged in.');
      return;
    }

    try {
      await deleteAccount(authId, email);
      await signOut(auth);
      alert('Account deleted successfully.');
    } catch (error) {
      alert((error as Error).message);
    }
  };

  return (
    <FormContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        <Button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Delete Account
        </Button>
      </form>
    </FormContainer>
  );
};

export default EmailForm;
