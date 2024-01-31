import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import app from './firebaseConfig';

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

export default function App() {
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function registerAndLogin() {
    setLoading(true);
    try {
      const auth = getAuth(app);
      await createUserWithEmailAndPassword(auth, email, password);
      const response = await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      Alert.alert('Success', response.user.uid);
      return;
    } catch (error) {
      setLoading(false);
      Alert.alert('Ooops', 'something went wrong');
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, { marginTop: 15 }]}
        placeholder="Password"
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={registerAndLogin}>
        {loading ? (
          <ActivityIndicator
            size={'small'}
            color={'white'}
            animating={loading}
          />
        ) : (
          <Text style={{ color: 'white' }}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '90%',
    height: 45,
    backgroundColor: 'teal',
    borderRadius: 6,
    marginTop: 25,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '90%',
    height: 45,
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});
