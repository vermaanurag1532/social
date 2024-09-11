import React, { useState, useEffect } from 'react';
import { Container, Group, Button, Text, Transition } from '@mantine/core';
import { IconBrandLinkedin, IconBrandInstagram } from '@tabler/icons-react';
import classes from './Footer.module.css'; // Import CSS for custom styling

const Footer: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer className={classes.footer}>
      <Container>
        <Group  align="center" className={classes.footerGroup}>
          <Text className={classes.footerText}>&copy; 2024 WHILE Network Private Limites. All rights reserved.</Text>
          <Group>
            <Transition transition="fade" duration={500} timingFunction="ease" mounted={mounted}>
              {(styles) => (
                <Button
                  component="a"
                  href="https://www.linkedin.com/company/while-network-private-limited/"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  color="blue"
                  style={styles}
                >
                  <IconBrandLinkedin size={20} />
                  LinkedIn
                </Button>
              )}
            </Transition>
            <Transition transition="fade" duration={500} timingFunction="ease" mounted={mounted}>
              {(styles) => (
                <Button
                  component="a"
                  href="https://www.instagram.com/while.co.in?igsh=MWtjMHNicWZsY2hycg=="
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  color="pink"
                  style={styles}
                >
                  <IconBrandInstagram size={20} />
                  Instagram
                </Button>
              )}
            </Transition>
          </Group>
        </Group>
      </Container>
    </footer>
  );
};

export default Footer;
