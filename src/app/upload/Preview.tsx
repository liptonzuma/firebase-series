import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { ImagePickerAsset } from 'expo-image-picker';
import { ResizeMode, Video } from 'expo-av';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../shared/Button';
import {
  CloudImage,
  bulkMediaUpload,
  saveUploadedMediaData,
} from '../firebase/storage/uploadMedia';

export interface CommonScreenProps {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}

const { width, height } = Dimensions.get('screen');

export default function Preview({ navigation, route }: CommonScreenProps) {
  const assets = route.params as ImagePickerAsset[];

  const insets = useSafeAreaInsets();

  const goBack = () => navigation.goBack();

  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);

  const smallScrollRef = useRef<FlatList>(null);
  const bigScrollRef = useRef<FlatList>(null);

  const scrollToItem = (index: number) => {
    setActive(index);
    bigScrollRef.current?.scrollToIndex({ index, animated: true });
  };

  async function uploadMedia() {
    try {
      setLoading(true);
      const cloudImages = await bulkMediaUpload(assets);
      await saveUploadedMediaData(cloudImages);
      Alert.alert('Great', 'Media uploaded successfully', [
        {
          text: 'Okay',
          onPress: () => navigation.navigate('display cloud media'),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Something went wrong', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top || 15,
            justifyContent: 'space-between',
          },
          styles.row,
        ]}
      >
        <Pressable style={styles.row} onPress={goBack}>
          <Ionicons name="chevron-back" size={24} color="teal" />
          <Text style={{ color: 'teal', fontWeight: '600' }}>Choose files</Text>
        </Pressable>
        <View style={{ width: '30%', height: 40 }}>
          <Button
            containerProps={{
              onPress: uploadMedia,
            }}
            childProps={{
              children: loading ? (
                <ActivityIndicator animating={loading} color="#ddd" />
              ) : (
                'Upload'
              ),
            }}
          />
        </View>
      </View>
      <FlatList
        horizontal
        data={assets}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={({ viewableItems }) => {
          setActive(viewableItems[0].index || 0);
          smallScrollRef.current?.scrollToIndex({
            index: viewableItems[0].index || 0,
            animated: true,
          });
        }}
        ref={bigScrollRef}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        renderItem={({ item, index }) => (
          <View key={item.fileName}>
            {item.type === 'image' ? (
              <Image
                source={{ uri: item.uri }}
                width={width}
                height={height - 250}
                resizeMode="contain"
              />
            ) : (
              <Video
                source={{ uri: item.uri }}
                style={{ width, height: height - 250, backgroundColor: '#ddd' }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay={active === index}
                isMuted={false}
              />
            )}
          </View>
        )}
      />

      <FlatList
        data={assets}
        horizontal
        contentContainerStyle={{ paddingHorizontal: 15 }}
        ref={smallScrollRef}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => scrollToItem(index)}
            key={item.fileName}
            style={{
              width: 110,
              height: 110,
              borderWidth: 3,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 4,
              borderColor: active === index ? 'teal' : 'transparent',
            }}
          >
            {item.type === 'image' ? (
              <Image
                source={{ uri: item.uri }}
                width={100}
                height={100}
                resizeMode="cover"
              />
            ) : (
              <Video
                source={{ uri: item.uri }}
                style={{ width: 100, height: 100, backgroundColor: '#ddd' }}
                resizeMode={ResizeMode.COVER}
              />
            )}
          </Pressable>
        )}
        style={{ marginTop: 20 }}
        ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
});
