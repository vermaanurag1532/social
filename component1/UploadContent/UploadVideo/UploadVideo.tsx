import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { doc, setDoc, getFirestore, getDoc, collection, getDocs } from 'firebase/firestore';
import { app, auth } from '../../../firebase/config/Firebase';
import styles from './UploadVideo.module.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Upload as TusUpload } from 'tus-js-client';
import crypto from 'crypto';

// Initialize Firestore
const db = getFirestore(app);

// Define the Category type
type Category = {
  category: string;
};

const UploadVideo = () => {
  const [user, loading, error] = useAuthState(auth);
  const [userName, setUserName] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const snapshot = await getDocs(collection(db, "videosCategories"));
      const fetchedCategories = snapshot.docs.map(doc => ({ category: doc.data().category as string }));
      setCategories(fetchedCategories);
      if (fetchedCategories.length > 0) {
        setSelectedCategory(fetchedCategories[0].category);
      }
    };

    const fetchUserName = async () => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserName(userSnap.data().name as string);
        }
      }
    };

    fetchCategories();
    if (!loading && user) {
      fetchUserName();
    }
  }, [user, loading]);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!videoFile || title.trim() === '' || description.trim() === '' || !userName) {
      alert('Please fill in all fields and select a video to upload.');
      return;
    }

    const createVideo = async () => {
      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          AccessKey: '6973830f-6890-472d-b8e3b813c493-5c4d-4c50'
        },
        body: JSON.stringify({ title: title, description: description })
      };
  
      const response = await fetch('https://video.bunnycdn.com/library/243538/videos', options);
      const data = await response.json();
      if (response.ok) {
        return data.guid; // Assuming the API returns a 'guid' as the video ID
      } else {
        throw new Error(data.message || "Failed to create video");
      }
    };

    const generateSignature = (videoId: string) => {
      const libraryId = '243538';
      const apiKey = '6973830f-6890-472d-b8e3b813c493-5c4d-4c50';
      const expirationTime = Math.floor(Date.now() / 1000) + 3600;
      const signatureString = `${libraryId}${apiKey}${expirationTime}${videoId}`;
      const hash = crypto.createHash('sha256').update(signatureString).digest('hex');
      return `${hash},${expirationTime}`;
    };

    setUploading(true);

    try {
      const videoId = await createVideo();
      if (!videoId) {
        alert('Failed to obtain video ID.');
        return;
      }

      const signatureParts = generateSignature(videoId).split(',');
      const signature = signatureParts[0];
      const expirationTime = signatureParts[1];

      const tusEndpointUrl = 'https://video.bunnycdn.com/tusupload';
      const upload = new TusUpload(videoFile, {
        endpoint: tusEndpointUrl,
        headers: {
          'AuthorizationSignature': signature,
          'AuthorizationExpire': expirationTime,
          'VideoId': videoId,
          'LibraryId': '243538'
        },
        metadata: {
          filename: videoFile.name,
          filetype: videoFile.type
        },
        onError: (error: any) => {
          console.error('Failed to upload video:', error);
          alert('Failed to upload video: ' + error.message);
          setUploading(false);
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          const percentage = (bytesUploaded / bytesTotal * 100).toFixed(2);
          console.log(`${bytesUploaded} / ${bytesTotal} (${percentage}%)`);
        },
        onSuccess: async () => {
          const videoData = {
            id: videoId,
            category: selectedCategory,
            creatorName: userName,
            title,
            description,
            maxVideoRes: "1080",
            Likes: [],
            views: 0,
            uploadedBy: user!.uid,
            videoUrl: `https://vz-f0994fc7-d98.b-cdn.net/${videoId}/play_360p.mp4`,
            thumbnail: `https://vz-f0994fc7-d98.b-cdn.net/${videoId}/thumbnail.jpg`
          };

          await setDoc(doc(db, `videos/${selectedCategory}/${selectedCategory}/${videoId}`), videoData);
          await setDoc(doc(db, `users/${user!.uid}/videos`, videoId), videoData);

          alert('Video uploaded successfully!');
          setUploading(false);
        }
      });

      upload.start();

    } catch (error: any) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video: ' + error.message);
      setUploading(false);
    }
  };

  return (
    <div className={styles.uploadStack}>
      <h2 className={styles.uploadText}>Upload your content</h2>
      <input className={styles.inputField} type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className={styles.textArea} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <select className={styles.dropdown} value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
        {categories.map(category => (
          <option key={category.category} value={category.category}>{category.category}</option>
        ))}
      </select>
      <input className={styles.fileInput} type="file" accept="video/*" onChange={handleVideoChange} />
      <button className={styles.uploadButton} onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Video'}
      </button>
    </div>
  );
};

export default UploadVideo;
