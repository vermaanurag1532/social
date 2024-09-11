// utils/deleteUser.ts
import { auth, app} from '../firebase/config/Firebase';
import { doc, getDoc, deleteDoc , getFirestore } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';

const db = getFirestore(app);

export const deleteAccount = async (uid: string, email: string) => {
  const userDocRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    throw new Error('User does not exist.');
  }

  const userData = userDoc.data();
  if (userData.email !== email) {
    throw new Error('Email does not match.');
  }

  await deleteDoc(userDocRef);
  const user = auth.currentUser;
  if (user) {
    await deleteUser(user);
  }
};
