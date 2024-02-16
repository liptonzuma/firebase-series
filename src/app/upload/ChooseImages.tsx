import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../shared/Button';
import { MediaTypeOptions, launchImageLibraryAsync } from 'expo-image-picker';
import { NavigationProp } from '@react-navigation/native';

export default function ChooseImages({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) {
  const [loading, setLoading] = useState(false);

  async function selectImagesHandler() {
    try {
      setLoading(true);
      let result = await launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.All,
        quality: 0.5,
        allowsMultipleSelection: true,
      });
      if (result.assets) {
        console.log(result.assets.map((e, i) => e.type));
        navigation.navigate('preview', result.assets);
        return;
      }
      Alert.alert('Oops', 'You did not select any image');
    } catch (error: any) {
      Alert.alert('Something went wrong', error.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <View style={styles.container}>
      <Ionicons name="images-outline" size={84} color="#c4c4c4" />
      <Button
        containerProps={{
          onPress: selectImagesHandler,
          style: { marginTop: 30 },
        }}
        childProps={{
          children: loading ? (
            <ActivityIndicator animating={loading} color="#ddd" />
          ) : (
            'Select files'
          ),
        }}
      />
      <Text
        style={styles.link}
        onPress={() => navigation.navigate('display cloud media')}
      >
        View uploaded media{' '}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  link: {
    marginTop: 30,
    fontSize: 16,
    color: 'teal',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});
