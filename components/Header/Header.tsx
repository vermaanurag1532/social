import { AppShell, Burger, Group, Skeleton, Tooltip, UnstyledButton, rem, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import styles from './Header.module.css'
import { useState } from 'react';
import { auth } from '../../firebase/config/Firebase';
import Videos from '../Video/Videos';
import {
  IconHome2,
  IconGauge,
  IconDeviceDesktopAnalytics,
  IconFingerprint,
  IconCalendarStats,
  IconUser,
  IconSettings,
  IconLogout,
  IconSwitchHorizontal,
} from '@tabler/icons-react';

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton onClick={onClick} className={styles.link} data-active={active || undefined}>
        <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconHome2, label: 'Home' },
  { icon: IconGauge, label: 'Dashboard' },
  { icon: IconDeviceDesktopAnalytics, label: 'Analytics' },
  { icon: IconCalendarStats, label: 'Releases' },
  { icon: IconUser, label: 'Account' },
  { icon: IconFingerprint, label: 'Security' },
  { icon: IconSettings, label: 'Settings' },
];

const Header = () => {
  const [opened, { toggle }] = useDisclosure();
  const [active, setActive] = useState(0);

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ));

  const handleLogout = async () => {
    try {
        await auth.signOut(); // Sign out the user using Firebase authentication
        // You can add additional logic here such as clearing local storage, redirecting, etc.
        console.log("Logged out successfully");
    } catch (error) {
        console.error('Error logging out:', (error as Error).message);
    }
};

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 200, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <img className={styles.logoImage} src="assets/Images/logo.png" alt="" />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <div className={styles.navbarMain}>
          <Stack justify="center" gap={0}>
            {links}
          </Stack>
        </div>

        <Stack justify="center" gap={0}>
          <NavbarLink icon={IconSwitchHorizontal} label="Change account" />
          <NavbarLink onClick={handleLogout} icon={IconLogout} label="Logout" />
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main><Videos /></AppShell.Main>
    </AppShell>
  );
};

export default Header;