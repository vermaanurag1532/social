// components/CustomAlert.tsx
import React, { useEffect, useState } from 'react';
import { Alert, Container } from '@mantine/core';
import './CustomAlert.module.css'; // Import the CSS file for animations

interface CustomAlertProps {
  title: string;
  message: string;
  color: 'green' | 'red' | 'blue';
  onClose: () => void;
  duration?: number; // Duration in milliseconds
}

const CustomAlert: React.FC<CustomAlertProps> = ({ title, message, color, onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Set up a timer to auto-dismiss the alert
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Ensure onClose is called after fade-out
      setTimeout(() => onClose(), 300); // Match this timeout with the fade-out duration
    }, duration);

    // Clean up timer on component unmount
    return () => {
      clearTimeout(timer);
      setIsVisible(true); // Reset visibility if component unmounts
    };
  }, [duration, onClose]);

  return (
    <Container className={`custom-alert ${isVisible ? 'fade-in' : 'fade-out'}`} style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000 }}>
      <Alert color={color} onClose={() => setIsVisible(false)} title={title}>
        {message}
      </Alert>
    </Container>
  );
};

export default CustomAlert;
