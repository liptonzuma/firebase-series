import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useContext, useRef, useState } from 'react';
import { CloudImage } from '../firebase/storage/uploadMedia';
import { ResizeMode, Video } from 'expo-av';
import { deleteFileFromDB } from '../firebase/storage/deleteFile';
import { DataContext } from '../utils/Context';

interface MediaItemProps extends CloudImage {
  docId: string;
}

export default function MediaItem({
  fileType,
  fileUrl,
  fileName,
  docId,
}: MediaItemProps) {
  const videoPlayer = useRef<Video>(null);
  function playVideo() {
    videoPlayer.current?.playAsync();
  }

  const [deleting, setDeleting] = useState(false);
  const { media, setMedia } = useContext(DataContext);

  async function deleteFile() {
    try {
      setDeleting(true);
      await deleteFileFromDB(docId, fileName);
      const remainingData = media.filter((m) => m.fileName !== fileName);
      setMedia(remainingData);
    } catch (error: any) {
      Alert.alert('Something went wrong', error.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <View style={styles.row}>
      {fileType === 'video' ? (
        <Pressable onPress={playVideo}>
          <Video
            source={{ uri: fileUrl }}
            style={styles.video}
            resizeMode={ResizeMode.STRETCH}
            ref={videoPlayer}
            useNativeControls={true}
            isMuted={true}
          />
        </Pressable>
      ) : (
        <Image
          source={{ uri: fileUrl }}
          style={styles.video}
          resizeMode="cover"
        />
      )}
      <View style={styles.content}>
        <Pressable style={styles.delete} onPress={deleteFile}>
          <Text style={{ color: 'teal' }}>
            {deleting ? (
              <ActivityIndicator animating={deleting} color="teal" />
            ) : (
              `Delete this ${fileType}`
            )}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  delete: {
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderColor: 'teal',
    borderRadius: 8,
  },
  content: {
    marginTop: 10,
  },
  video: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    backgroundColor: 'silver',
  },
  row: {
    // paddingBottom: 10,
  },
});
