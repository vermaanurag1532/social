import React, { useEffect, useState } from 'react';
import { Skeleton } from '@mantine/core';
import { useRouter } from 'next/router';
import styles from './Videos.module.css';
import { app } from '../../../firebase/config/Firebase';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const db = getFirestore(app);

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  uploadedBy: string;
  category: string;
}

interface Category {
  name: string;
  videos: Video[];
}

const Videos: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const videoCategoriesRef = collection(db, 'videosCategories');
        const snapshot = await getDocs(videoCategoriesRef);

        if (snapshot.empty) {
          throw new Error('No video categories found.');
        }

        const fetchedCategories = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const videosCollectionRef = collection(db, `videos/${doc.id}/${doc.id}`);
            const videosSnapshot = await getDocs(videosCollectionRef);

            const videos: Video[] = videosSnapshot.docs.map((videoDoc) => ({
              id: videoDoc.id,
              category: doc.id as string,
              title: videoDoc.data().title as string,
              description: videoDoc.data().description as string,
              thumbnail: videoDoc.data().thumbnail as string,
              url: videoDoc.data().videoUrl as string,
              uploadedBy: videoDoc.data().uploadedBy as string,
            }));

            return { name: doc.id, videos };
          })
        );

        const nonEmptyCategories = fetchedCategories.filter(category => category.videos.length > 0);
        setCategories(nonEmptyCategories);
      } catch (err) {
        setError('Error fetching video categories: ' + (err as Error).message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const filterCategories = () => {
      if (!searchQuery) {
        setFilteredCategories(categories);
      } else {
        const filtered = categories.map((category) => ({
          ...category,
          videos: category.videos.filter((video) =>
            video.title.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        })).filter((category) => category.videos.length > 0);
        setFilteredCategories(filtered);
      }
    };

    filterCategories();
  }, [searchQuery, categories]);

  const handleVideoSelect = (video: Video) => {
    router.push({
      pathname: '/videos',
      query: { id: video.id, category: video.category }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search Videos..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {loading ? (
        <>
          {[...Array(3)].map((_, index) => (
            <div key={index}>
              <Skeleton height={20} mt={6} width="70%" radius="xl" />
              <div className={styles.carousel}>
                {[...Array(3)].map((_, index) => (
                  <Skeleton
                    key={index}
                    height={200}  // Matches the height of the video card
                    width={200}   // Matches the width of the video card
                    mt={6}
                    radius="xl"
                  />
                ))}
              </div>
            </div>
          ))}
        </>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <>
          {filteredCategories.map((category) => (
            <div key={category.name} className={styles.category}>
              <h2 className={styles.categoryTitle}>{category.name}</h2>
              <div className={styles.carousel}>
                {category.videos.map((video, index) => (
                  <div
                    key={index}
                    className={styles.videoCard}
                    onClick={() => handleVideoSelect({ ...video, category: category.name })}
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className={styles.thumbnail}
                    />
                    <div className={styles.videoInfo}>
                      <h3 className={styles.videoTitle}>{video.title}</h3>
                      <p className={styles.videoDescription}>{video.description}</p>
                      <p className={styles.uploadedBy}>Uploaded by: {video.uploadedBy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Videos;
