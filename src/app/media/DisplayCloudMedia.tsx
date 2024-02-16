import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CommonScreenProps } from '../upload/Preview';
import MediaItem from './MediaItem';
import { fetchItemsBasedOnType } from '../firebase/firestore/read';
import { getAuth } from 'firebase/auth';
import app from '../../../firebaseConfig';
import { MediaItemShape } from '../../../App';
import { DataContext } from '../utils/Context';

export default function DisplayCloudMedia({
  navigation,
  route,
}: CommonScreenProps) {
  const user = getAuth(app).currentUser;
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');

  const [loading, setLoading] = useState(false);

  const navItems: {
    name: 'images' | 'videos';
    key: string;
    type: 'image' | 'video';
  }[] = [
    { name: 'images', key: 'cloud-images', type: 'image' },
    { name: 'videos', key: 'cloud-videos', type: 'video' },
  ];
  const goBack = () => navigation.goBack();

  const { media, setMedia } = useContext(DataContext);

  async function getMyDocs() {
    try {
      setLoading(true);
      if (!user) return;
      const result = await fetchItemsBasedOnType(user?.uid, activeTab);
      const data = result.docs.map((med) => ({
        docId: med.id,
        ...med.data(),
      })) as MediaItemShape[];
      return setMedia(data);
    } catch (error: any) {
      Alert.alert('Something went wrong', error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let flag = false;
    getMyDocs();
    return () => {
      flag = true;
    };
  }, [activeTab]);
  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top || 15 }]}>
        <TouchableOpacity
          onPress={goBack}
          style={[styles.back, { top: insets.top || 15 }]}
        >
          <Ionicons name="chevron-back" size={24} color="teal" />
        </TouchableOpacity>
        <Text style={styles.routeName}>{route.name}</Text>
      </View>

      <View style={styles.navContainer}>
        <View style={styles.nav}>
          {navItems.map((nI, i) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActiveTab(nI.type)}
              key={nI.key}
              style={[
                styles.navButton,
                {
                  backgroundColor:
                    activeTab === nI.type ? 'white' : 'transparent',
                },
              ]}
            >
              <Text style={styles.tab}>{nI.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={media}
        renderItem={({ item, index }) => <MediaItem {...item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={getMyDocs}
        ItemSeparatorComponent={() => (
          <View
            style={{
              width: '100%',
              height: 1.5,
              backgroundColor: '#ddd',
              marginVertical: 20,
            }}
          />
        )}
        ListEmptyComponent={
          <Text
            style={{
              textAlign: 'center',
              marginTop: '30%',
              color: 'silver',
            }}
          >
            No {activeTab} in your storage bucket.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    width: 50,
    height: 50,
    backgroundColor: 'teal',
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  tab: {
    fontSize: 15,
    fontWeight: '600',
    textTransform: 'capitalize',
    color: 'gray',
  },
  navButton: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
  },
  nav: {
    padding: 8,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    width: '65%',
  },
  navContainer: {
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  back: {
    position: 'absolute',
    left: 15,
  },
  routeName: {
    textTransform: 'capitalize',
    alignSelf: 'center',
    textAlign: 'center',
    color: 'teal',
    fontWeight: '600',
    fontSize: 16,
  },
  header: {
    backgroundColor: 'white',
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#f5f5f5',
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
});
