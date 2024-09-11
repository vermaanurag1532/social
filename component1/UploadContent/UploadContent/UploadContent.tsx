import React from 'react';
import styles from './UploadContent.module.css';
import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import Link from 'next/link';

const UploadOptions: React.FC = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={styles.title}>Choose Upload Option</h2>
        <div className={styles.buttonContainer}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/UploadVideo">
            <button className={`${styles.button} ${isMobile ? styles.smaller : ''}`}>
              Upload Video
            </button>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button className={`${styles.button} ${isMobile ? styles.smaller : ''}`}>
              Upload Loops
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default UploadOptions;
