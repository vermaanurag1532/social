import React from 'react';
import { useRouter } from 'next/router';
import { app } from '../../firebase/config/Firebase';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import styles from './Video.module.css';

const db = getFirestore(app);

const Video: React.FC = () => {
  const router = useRouter();
  const { id, category } = router.query;
  const [video, setVideo] = React.useState<any>(null);
  const [relatedVideos, setRelatedVideos] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [uploader, setUploader] = React.useState({
    name: '',
    image: '',
  });

  React.useEffect(() => {
    if (!id || !category) return;

    const fetchVideoData = async () => {
      setLoading(true);
      try {
        const videoRef = doc(db, `videos/${category}/${category}`, id as string);
        const videoDoc = await getDoc(videoRef);

        if (!videoDoc.exists()) {
          throw new Error('Video not found.');
        }

        const videoData = videoDoc.data();
        setVideo(videoData);

        // Fetch uploader info
        console.log(videoData.uploadedBy);
        const uploadDocRef = doc(db, 'users', videoData.uploadedBy);
        const uploadDocSnapShot = await getDoc(uploadDocRef);
        if (uploadDocSnapShot.exists()) {
          const data = uploadDocSnapShot.data();
          console.log(data.name)
          setUploader({
            name: data.name,
            image: data.image,
          });
        }

        // Fetch related videos
        const relatedVideosRef = collection(db, `videos/${category}/${category}`);
        const relatedVideosQuery = query(relatedVideosRef, where('id', '!=', id));
        const relatedVideosSnapshot = await getDocs(relatedVideosQuery);

        const relatedVideosData = relatedVideosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setRelatedVideos(relatedVideosData);
      } catch (err) {
        setError('Error fetching video: ' + (err as Error).message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [id, category]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!video) {
    return <div className={styles.error}>Video not found.</div>;
  }
  console.log(uploader.name);

  return (
    <div className={styles.videoContainer}>
      <div className={styles.mainContent}>
        <div className={styles.videoSection}>
          <div className={styles.uploaderProfile}>
            <div className={styles.uploaderInfo}>
              <img src={uploader.image} alt={video.uploadedBy} className={styles.uploaderAvatar} />
              <p className={styles.uploaderName}>{uploader.name}</p>
            </div>
            <button className={styles.followButton}>Follow</button>
          </div>
          <video controls autoPlay className={styles.videoPlayer}>
            <source src={video.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className={styles.videoDetails}>
            <h1 className={styles.videoTitle}>{video.title}</h1>
            <p className={styles.videoDescription}>{video.description}</p>
          </div>
        </div>
        <div className={styles.relatedVideosSection}>
          <h2 className={styles.relatedVideosHeading}>Related Videos</h2>
          <div className={styles.relatedVideos}>
            {relatedVideos.map((relatedVideo) => (
              <div
                key={relatedVideo.id}
                className={styles.relatedVideoCard}
                onClick={() => router.push(`/videos?id=${relatedVideo.id}&category=${category}`)}
              >
                <img
                  src={relatedVideo.thumbnail}
                  alt={relatedVideo.title}
                  className={styles.relatedVideoThumbnail}
                />
                <p className={styles.relatedVideoTitle}>{relatedVideo.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;