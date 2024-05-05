import {
  AppShell,
  Burger,
  Group,
  Stack,
  Tooltip,
  UnstyledButton,
  rem
} from '@mantine/core';
import Link from 'next/link';
import { useDisclosure } from '@mantine/hooks';
import styles from './Header.module.css';
import { useState } from 'react';
import { auth } from '../../firebase/config/Firebase';
import Videos from '../Video/Videos';
import HomeProfile from '../Profile/HomeProfile';
import {
  IconHome2,
  IconDeviceDesktopAnalytics,
  IconFingerprint,
  IconCalendarStats,
  IconUser,
  IconSettings,
  IconLogout,
  IconSwitchHorizontal
} from '@tabler/icons-react';

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  href?: string; // Optional if we're using click handlers
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, href, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      {href ? (
        <Link href={href}>
          <UnstyledButton onClick={onClick} className={styles.link} data-active={active || undefined}>
            <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
          </UnstyledButton>
        </Link>
      ) : (
        <UnstyledButton onClick={onClick} className={styles.link} data-active={active || undefined}>
          <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
        </UnstyledButton>
      )}
    </Tooltip>
  );
}

const mockdata = [
  {
    icon: IconHome2,
    label: 'Home',
    component: (
      <div className={styles.home}>
        <Videos />
        <div className={styles.homeProfile}>
          <HomeProfile />
        </div>
      </div>
    )
  },
  { icon: IconDeviceDesktopAnalytics, label: 'Loops', component: <div>Loops Component</div> },
  { icon: IconCalendarStats, label: 'Create', component: <div>Create Component</div> },
  { icon: IconUser, label: 'Profile', component: <HomeProfile /> },
  { icon: IconSettings, label: 'Settings', component: <div>Settings Component</div> }
];

const Header = () => {
  const [opened, { toggle }] = useDisclosure();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNavItemClick = (index: number) => {
    setActiveIndex(index); // Update the active index to render a new component
  };

  const links = mockdata.map((link, index) => (
    <NavbarLink
      key={link.label}
      icon={link.icon}
      label={link.label}
      active={index === activeIndex}
      onClick={() => handleNavItemClick(index)}
    />
  ));

  const handleLogout = async () => {
    try {
      await auth.signOut();
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
          <NavbarLink href="#" icon={IconSwitchHorizontal} label="Change account" />
          <NavbarLink href="#" onClick={handleLogout} icon={IconLogout} label="Logout" />
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>
        {/* Render the active component based on the active index */}
        {mockdata[activeIndex]?.component}
      </AppShell.Main>
    </AppShell>
  );
};

export default Header;
