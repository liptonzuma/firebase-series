import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import app from '../../../../firebaseConfig';
import { getAuth } from 'firebase/auth';
import dayjs from 'dayjs';
import { ImagePickerAsset } from 'expo-image-picker';
import { addDoc, collection, getFirestore } from 'firebase/firestore';

const storage = getStorage(app);
const db = getFirestore(app);

async function uploadMediaToStorageBucket(
  uri: string,
  fileType: 'video' | 'image' | undefined
) {
  const user = getAuth(app).currentUser;
  if (!user) return;

  const fileName = dayjs().format('YYYY-MM-DD_HH-mm-ss');

  const storageRef = ref(storage, `media/${user.uid}/${fileName}`);

  try {
    const response = await fetch(uri);

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const mediaBlob = await response.blob();
    const upload = uploadBytesResumable(storageRef, mediaBlob);

    return new Promise((resolve, reject) => {
      upload.on(
        'state_changed',
        (snapshot) => {
          console.log(snapshot.bytesTransferred, '/', snapshot.totalBytes);
        },
        (error) => reject(error),
        () => {
          getDownloadURL(upload.snapshot.ref)
            .then((url) =>
              resolve({ fileName, fileUrl: url, ownerId: user.uid, fileType })
            )
            .catch((error) => reject(error));
        }
      );
    });
  } catch (error: any) {
    throw new Error(error);
  }
}

export interface CloudImage {
  fileUrl: string;
  fileName: string;
  ownerId: string;
  fileType: 'video' | 'image' | undefined;
}

export async function bulkMediaUpload(media: ImagePickerAsset[]) {
  const cloudImages: CloudImage[] = [];

  for (let i = 0; i < media.length; i++) {
    try {
      const data = (await uploadMediaToStorageBucket(
        media[i].uri,
        media[i].type
      )) as CloudImage;
      cloudImages.push(data);
    } catch (error: any) {
      throw new Error(error);
    }
  }
  return cloudImages;
}

export async function saveUploadedMediaData(data: CloudImage[]) {
  const mediaRef = collection(db, 'media');
  for (let i = 0; i < data.length; i++) {
    try {
      await addDoc(mediaRef, data[i]);
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
