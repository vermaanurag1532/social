import React, { useState } from 'react';
import { Button, Container, Paper, Stack, Text, Title } from '@mantine/core';
import { useRouter } from 'next/router';
import { getAuth, deleteUser } from 'firebase/auth';
import { IconLogout, IconTrash, IconUserPlus } from '@tabler/icons-react';
import CustomAlert from '../../widgets/CustomAlert/CustomAlert'; // Adjust the path if needed
import classes from './Setting.module.css';

const Settings: React.FC = () => {
  const [alert, setAlert] = useState<{ title: string; message: string; color: 'green' | 'red' | 'blue' } | null>(null);
  const router = useRouter();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/signin');
      setAlert({
        title: 'Logged Out',
        message: 'You have been logged out successfully.',
        color: 'green',
      });
    } catch (error) {
      setAlert({
        title: 'Logout Failed',
        message: (error as Error).message,
        color: 'red',
      });
    }
  };

  const handleDeleteAccount = async () => {
      try {
        router.push('/delete_account');
        setAlert({
          title: 'Account Deleted',
          message: 'Your account has been successfully deleted.',
          color: 'green',
        });
      } catch (error) {
        setAlert({
          title: 'Deletion Failed',
          message: (error as Error).message,
          color: 'red',
        });
    }
  };

  const handleReferFriend = () => {
    // Add your referral logic here
    setAlert({
      title: 'Referral Sent',
      message: 'A referral link has been sent to your friend!',
      color: 'blue',
    });
  };

  return (
    <Container className={classes.settingsContainer} size="sm" my="xl">
      <Paper shadow="md" p="xl" withBorder>
        <Title order={2} mb="md" style={{ textAlign: 'center' }}>
          Settings
        </Title>
        <Stack>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Logout from your account</Text>
            <Button
              onClick={handleLogout}
              color="red"
              variant="light"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <IconLogout size={16} style={{ marginRight: 8 }} />
              Logout
            </Button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Delete your account</Text>
            <Button
              onClick={handleDeleteAccount}
              color="red"
              variant="light"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <IconTrash size={16} style={{ marginRight: 8 }} />
              Delete Account
            </Button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Refer a friend</Text>
            <Button
              onClick={handleReferFriend}
              color="blue"
              variant="light"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <IconUserPlus size={16} style={{ marginRight: 8 }} />
              Refer Friend
            </Button>
          </div>
        </Stack>
      </Paper>
      {alert && (
        <CustomAlert
          title={alert.title}
          message={alert.message}
          color={alert.color}
          onClose={() => setAlert(null)}
        />
      )}
    </Container>
  );
};

export default Settings;
