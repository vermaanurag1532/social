// components/Profile.tsx
import React, { useEffect, useState } from 'react';
import { app } from '../../../firebase/config/Firebase';
import styles from './Profile.module.css';
import { User } from '../../../firebase/Models/User';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const db = getFirestore(app);

interface ProfileProps {
  authId: string;
}

const Profile: React.FC<ProfileProps> = ({ authId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = doc(db, 'users', authId);
        const userSnap = await getDoc(userDoc);

        if (userSnap.exists()) {
          setUser(userSnap.data() as User);
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <img src={user.image} alt={user.name} className={styles.profileImage} />
        <div className={styles.profileDetails}>
          <h2>{user.name} <span className={styles.verifiedIcon}>✔️</span></h2>
          <p>{user.email}</p>
          <p>{user.about}</p>
        </div>
      </div>
      <div className={styles.profileStats}>
        <div className={styles.statItem}>
          <strong>{user.follower}</strong>
          <span>Followers</span>
        </div>
        <div className={styles.statItem}>
          <strong>{user.following}</strong>
          <span>Following</span>
        </div>
        <div className={styles.statItem}>
          <strong>{user.easyQuestions}</strong>
          <span>Easy Questions</span>
        </div>
      </div>
      <button className={styles.editProfileButton}>Edit Profile</button>
      <h3 className={styles.suggestionsHeader}>Profiles you may like</h3>
      <div className={styles.suggestions}>
        <div className={styles.suggestionItem}>
          <img src="https://via.placeholder.com/50" alt="Suggested User" />
          <p>Jane Cooper</p>
        </div>
        <div className={styles.suggestionItem}>
          <img src="https://via.placeholder.com/50" alt="Suggested User" />
          <p>John Doe</p>
        </div>
        <div className={styles.suggestionItem}>
          <img src="https://via.placeholder.com/50" alt="Suggested User" />
          <p>Jane Smith</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
