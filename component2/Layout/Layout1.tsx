import { ReactElement } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

interface LayoutProps {
  children: ReactElement[] | ReactElement | string;
}

const Layout1: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
  return (
    <>
      <header>
        <Header />
      </header>
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout1;
