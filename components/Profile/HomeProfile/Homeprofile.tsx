import { Card, Avatar, Text, Group, Button } from '@mantine/core';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, app } from '../../../firebase/config/Firebase';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import classes from './HomeProfile.module.css';

const db = getFirestore(app);

const stats = [
  { value: '34K', label: 'Followers' }, // Example hardcoded stats
  { value: '187', label: 'Follows' },
  { value: '1.6K', label: 'Posts' },
];

const HomeProfile = () => {
  const [user, loading, error] = useAuthState(auth);
  const [profileData, setProfileData] = useState({
    name: '',
    about: '',
    image: '',
    posts: 0,
    followers: 0,
    following: 0,
    designation: '',
  });

  useEffect(() => {
    // Fetch profile data only if the user is authenticated
    const fetchProfileData = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            setProfileData({
              ...profileData,
              name: data.name || '',
              about: data.about || '',
              image: data.image || '',
              designation: data.designation || '',
            });

            const followersQuery  = await getDocs(collection(userDocRef , 'follower'));
            const followersCount = followersQuery.size;
            setProfileData(prevState => ({ ...prevState, followers: followersCount }));

            // Fetch following count
            const followingQuery = await getDocs(collection(userDocRef , 'following'));
            const followingCount = followingQuery.size;
            setProfileData(prevState => ({ ...prevState, following: followingCount }));

            const videosQuery = await getDocs(collection(userDocRef , 'videos'));
            const videosCount = videosQuery.size;

            const loopsQuery = await getDocs(collection(userDocRef , 'loops'));
            const loopsCount = loopsQuery.size;
            setProfileData(prevState => ({...prevState, posts: videosCount+loopsCount}));
          }
        } catch (e) {
          console.error('Error fetching profile data:', e);
        }
      }
    };

    fetchProfileData();
  }, [user]);

  const stats = [
    { value: profileData.followers, label: 'Followers' }, // Example hardcoded stats
    { value: profileData.following, label: 'Follows' },
    { value: profileData.posts, label: 'Posts' },
  ];

  const items = stats.map((stat) => (
    <div key={stat.label}>
      <Text ta="center" size="lg" fw={500}>
        {stat.value}
      </Text>
      <Text ta="center" size="sm" color="dimmed" lh={1}>
        {stat.label}
      </Text>
    </div>
  ));

  return (
    <Card withBorder padding="xl" radius="md" className={classes.card}>
      <Card.Section
        style={{
          backgroundImage: 'url(assets/Images/logo1.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '140px',
        }}
      />
      <Avatar
        src={profileData.image || 'https://via.placeholder.com/80'}
        size={80}
        radius={80}
        mx="auto"
        mt={-30}
        className={classes.avatar}
      />
      <Text ta="center" size="lg" fw={500} mt="sm">
        {profileData.name || 'Anonymous'}
      </Text>
      <Text ta="center" size="sm" color="dimmed">
        {profileData.about || 'No bio available'}
      </Text>
      <Group mt="md" justify="center" gap={30}>
        {items}
      </Group>
      <Button fullWidth radius="md" mt="xl" size="md" variant="default">
        {profileData.designation}
      </Button>
    </Card>
  );
};

export default HomeProfile;
