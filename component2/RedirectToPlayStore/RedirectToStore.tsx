// components/DownloadAppBanner.tsx
import React from 'react';
import { Button, Container, Group, Text, Paper } from '@mantine/core';
import { IconBrandGooglePlay } from '@tabler/icons-react';
import classes from './RedirectToStore.module.css';

const DownloadAppBanner: React.FC = () => {
  return (
    <Paper  radius="md" shadow="sm" className={classes.downloadAppBanner}>
      <Container>
        <Group p="apart" align="center">
          <Text className={classes.downloadText}  >
            For a better experience, Download the WHILE app now
          </Text>
          <Button
          className={classes.downloadAppButton}
            component="a"
            href="https://play.google.com/store/apps/details?id=com.while.while_app" // Replace with your app's Play Store URL
            target="_blank"
            rel="noopener noreferrer"
            variant="light"
            color="blue"
          >
            <IconBrandGooglePlay size={20} />
            Google Play Store
          </Button>
        </Group>
      </Container>
    </Paper>
  );
};

export default DownloadAppBanner;
