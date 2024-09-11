// Layout.tsx
import React, { ReactElement } from 'react';
import Header from '../Header/Header';

interface LayoutProps {
  children: ReactElement[] | ReactElement | string;
}

const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
};

export default Layout;
