import { getAuth } from 'firebase/auth';
import app from '../../../../firebaseConfig';
import dayjs from 'dayjs';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { ImagePickerAsset } from 'expo-image-picker';

const storage = getStorage(app);
const db = getFirestore(app);

async function uploadMediaToStorageBucket(uri: string) {
  const user = getAuth(app).currentUser;
  if (!user) return;

  const fileName = dayjs().format('YYYY-MM-DD_HH-mm-ss');

  const mediaStorageRef = ref(storage, `media/${user.uid}/${fileName}`);

  try {
    const response = await fetch(uri);
    const mediaBlob = await response.blob();
    const upload = uploadBytesResumable(mediaStorageRef, mediaBlob);

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
              resolve({ fileUrl: url, fileName, ownerId: user.uid })
            )
            .catch((error) => reject(error));
        }
      );
    });
  } catch (error) {
    return error;
  }
}

interface CloudImage {
  fileUrl: string;
  fileName: string;
  ownerId: string;
}
export async function bulkMediaUpload(images: ImagePickerAsset[]) {
  const cloudImages: CloudImage[] = [];
  for (let i = 0; i < images.length; i++) {
    const data = (await uploadMediaToStorageBucket(
      images[i].uri
    )) as CloudImage;
    cloudImages.push(data);
  }
  return cloudImages;
}

export async function saveUploadMediaData(data: CloudImage[]) {
  const mediaDataRef = collection(db, 'media');
  for (let i = 0; i < data.length; i++) {
    await addDoc(mediaDataRef, data[i]);
  }
}
