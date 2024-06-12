import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../../firebase/config/Firebase';
import styles from './ProfileVideos.module.css';
import VideoModal from '@/widgets/VideoModal';

const db = getFirestore(app);

interface Video {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    videoUrl: string;
    views: number;
    likes: string[];
}

interface ProfileVideosProps {
    uid: string;
}

const ProfileVideos: React.FC<ProfileVideosProps> = ({ uid }) => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

    useEffect(() => {
        const fetchVideos = async () => {
            const ref = collection(db, 'users', uid, 'videos');
            const snap = await getDocs(ref);
            const data = snap.docs.map(doc => ({
                id: doc.id,
                title: doc.data().title,
                description: doc.data().description,
                thumbnail: doc.data().thumbnail,
                videoUrl: doc.data().videoUrl,
                views: doc.data().views,
                likes: doc.data().likes,
            })) as Video[]; // Type assertion
            setVideos(data);
        };

        fetchVideos();
    }, [uid]);

    const handleItemClick = (id: string) => {
        setSelectedVideoId(id);
    };

    const handleCloseModal = () => {
        setSelectedVideoId(null);
    };

    return (
        <div className={styles.videoContainer}>
            {videos.map(video => (
                <div key={video.id} className={styles.videoCard} onClick={() => handleItemClick(video.id)}>
                    <img src={video.thumbnail} alt={video.title} className={styles.thumbnail} />
                    <div className={styles.videoInfo}>
                        <h3>{video.title}</h3>
                        <p>{video.description}</p>
                        <div className={styles.videoStats}>
                            <span>{video.views} views</span>
                            <span>{video.likes.length} likes</span>
                        </div>
                    </div>
                </div>
            ))}
            {selectedVideoId && (
                <VideoModal videoId={selectedVideoId} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default ProfileVideos;
