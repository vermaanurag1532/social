// Explore.tsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, getFirestore, DocumentData } from 'firebase/firestore';
import { app } from '../../firebase/config/Firebase';
import styles from "./Explore.module.css";
import { Button } from '@nextui-org/react';

const db = getFirestore(app);

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [peopleResults, setPeopleResults] = useState<DocumentData[]>([]);
  const [communitiesResults, setCommunitiesResults] = useState<DocumentData[]>([]);
  const [selectedTab, setSelectedTab] = useState('People');
  const [following, setFollowing] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      handleSearch();
    } else {
      setPeopleResults([]);
      setCommunitiesResults([]);
    }
  }, [searchQuery]);

  const handleSearch = async () => {
    try {
      const usersQuery = collection(db, 'users');
      const usersSnapshot = await getDocs(usersQuery);
      const usersData = usersSnapshot.docs
        .filter(doc => {
          const userData = doc.data();
          return userData.name && userData.name.toLowerCase().includes(searchQuery.toLowerCase());
        })
        .map(doc => ({ id: doc.id, ...doc.data() }));
      setPeopleResults(usersData);

      const communitiesQuery = collection(db, 'communities');
      const communitiesSnapshot = await getDocs(communitiesQuery);
      const communitiesData = communitiesSnapshot.docs
        .filter(doc => {
          const communityData = doc.data();
          return communityData.name && communityData.name.toLowerCase().includes(searchQuery.toLowerCase());
        })
        .map(doc => ({ id: doc.id, ...doc.data() }));
      setCommunitiesResults(communitiesData);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

  const handleFollowToggle = (id: string) => {
    setFollowing(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={styles.exploreContainer}>
      <div className={styles.searchContainer}>
        <input 
          type="text" 
          className={styles.searchInput}
          placeholder="Search" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
      </div>
      <div className={styles.categoryButtons}>
        <button className={`${styles.categoryButton} ${selectedTab === 'People' ? styles.activeTab : ''}`} onClick={() => handleTabChange('People')}>
          People
        </button>
        <button className={`${styles.categoryButton} ${selectedTab === 'Communities' ? styles.activeTab : ''}`} onClick={() => handleTabChange('Communities')}>
          Communities
        </button>
      </div>
      <div>
        {searchQuery.trim() !== '' && (
          <>
            <h2 className={styles.selectedTab}>{selectedTab}</h2>
            <div className={styles.searchResults}>
              {selectedTab === 'People' && peopleResults.map((result: DocumentData) => (
                <div 
                  className={styles.resultCard} 
                  key={result.id} 
                >
                  <img src={result.image} alt="Profile" className={styles.profileImage} />
                  <div className={styles.infoContainer}>
                    <p className={styles.name}>{result.name}</p>
                    <p className={styles.bio}>{result.bio || "Bio not available"}</p>
                  </div>
                  <Button
                    className={following[result.id] ? styles.unfollowButton : styles.followButton}
                    size="sm"
                    onPress={() => handleFollowToggle(result.id)}
                  >
                    {following[result.id] ? "Unfollow" : "Follow"}
                  </Button>
                </div>
              ))}
              {selectedTab === 'Communities' && communitiesResults.map((result: DocumentData) => (
                <div className={styles.resultCard} key={result.id}>
                  <img src={result.image} alt="Profile" className={styles.profileImage} />
                  <div className={styles.infoContainer}>
                    <p className={styles.name}>{result.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Explore;
