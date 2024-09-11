import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import Videos from '../component1/Video/Videos';
import HomeProfile from '../component1/Profile/HomeProfile';
import { Herobox, Stats, Goals, About, Features, RedirectToPlayStore } from '../component2';
import styles from '../styles/HomePages.module.css';

const HomePage = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <>
      {!user ? (
        <>
          <Herobox />
          <Stats />
          <About />
          <Goals />
          <Features />
          <RedirectToPlayStore />
        </>
      ) : (
        <div className={styles.home}>
          <Videos />
          <div className={styles.homeProfile}>
            <HomeProfile />
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
