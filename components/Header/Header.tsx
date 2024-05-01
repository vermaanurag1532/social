import { useState } from 'react';
import { auth } from '../../firebase/config/Firebase'; 
import { Center, Tooltip, UnstyledButton, Stack, rem, Avatar } from '@mantine/core';
import {
  IconHome2,
  IconGauge,
  IconDeviceDesktopAnalytics,
  IconFingerprint,
  IconUser,
  IconSettings,
  IconLogout,
  IconSwitchHorizontal,
  IconCirclePlus,
} from '@tabler/icons-react';
import classes from './Header.module.css';

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
        <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconHome2, label: 'Home' },
  { icon: IconGauge, label: 'Dashboard' },
  { icon: IconDeviceDesktopAnalytics, label: 'Analytics' },
  { icon: IconCirclePlus, label: 'Create' },
  { icon: IconUser, label: 'Profile' },
  { icon: IconFingerprint, label: 'Security' },
  { icon: IconSettings, label: 'Settings' },
];

const Header = () => {
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
        await auth.signOut(); 
        console.log("Logged out successfully");
    } catch (error) {
        console.error('Error logging out:', (error as Error).message);
    }
};

  return (
    <nav className={classes.navbar}>
        <img  src="assets/Images/WL.png" alt="" />

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        <NavbarLink icon={IconSwitchHorizontal} label="Change account" />
        <NavbarLink onClick={handleLogout} icon={IconLogout} label="Logout" />
      </Stack>
    </nav>
  );
};

export default Header;
