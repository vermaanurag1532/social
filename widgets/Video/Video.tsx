import React from 'react';
import { useRouter } from 'next/router';
import { app } from '../../firebase/config/Firebase';
import { getFirestore, doc, getDoc, collection } from 'firebase/firestore';
import styles from './Video.module.css';

const db = getFirestore(app);

const Video: React.FC = () => {
  const router = useRouter();
  const { id, category } = router.query;
  const [video, setVideo] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (!id) return;

    const fetchVideo = async () => {
      setLoading(true);
      try {
        const videoRef = doc(db, `videos/${category}/${category}`, id as string);
        const videoDoc = await getDoc(videoRef);

        if (!videoDoc.exists()) {
          throw new Error('Video not found.');
        }

        setVideo(videoDoc.data());
      } catch (err) {
        setError('Error fetching video: ' + (err as Error).message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!video) {
    return <div className={styles.error}>Video not found.</div>;
  }

  return (
    <div className={styles.videoContainer}>
      <video controls autoPlay className={styles.videoPlayer}>
        <source src={video.videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className={styles.videoDetails}>
        <h1 className={styles.videoTitle}>{video.title}</h1>
        <p className={styles.videoDescription}>{video.description}</p>
        <p className={styles.uploadedBy}>Uploaded by: {video.uploadedBy}</p>
      </div>
    </div>
  );
};

export default Video;
