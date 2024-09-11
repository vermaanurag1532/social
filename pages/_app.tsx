// pages/_app.tsx
import { AuthProvider, useAuth } from '../Context/AuthContext';
import { Layout as Layout1, AOS } from '../component2';
import { Layout as Layout2 } from '@/component1';
import { AppProps } from 'next/app';
import '../styles/globals.css';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <MantineProvider defaultColorScheme="light">
      <AOS>
        {user ? (
          <Layout2>
            <Component {...pageProps} />
          </Layout2>
        ) : (
          <Layout1>
            <Component {...pageProps} />
          </Layout1>
        )}
      </AOS>
    </MantineProvider>
  );
};

const App = (props: AppProps) => {
  return (
    <AuthProvider>
      <MyApp {...props} />
    </AuthProvider>
  );
};

export default App;
