import { collection, deleteDoc, doc, getFirestore } from 'firebase/firestore';
import app from '../../../../firebaseConfig';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const db = getFirestore(app);
const storage = getStorage(app);

const mediaCollections = collection(db, 'media');

export async function deleteFileFromDB(docId: string, fileName: string) {
  const user = getAuth(app).currentUser;

  if (!user) return;

  const mediaStorageRef = ref(storage, `media/${user.uid}/`);

  await deleteObject(ref(storage, `${mediaStorageRef}/${fileName}`));

  return await deleteDoc(doc(mediaCollections, docId));
}
