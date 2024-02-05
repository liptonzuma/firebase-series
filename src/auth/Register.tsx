import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { LoginProps } from './Login';
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from 'firebase/auth';
import app from '../../firebaseConfig';

export default function Register({ navigation }: LoginProps) {
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');

  async function registerUser() {
    setLoading(true);

    try {
      const auth = getAuth(app);
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(response.user, { displayName: userName });
      setLoading(false);
      Alert.alert(
        'Success',
        'Account created successfully please login to continue.',
        [
          {
            text: 'Okay',
            onPress: () => navigation.navigate('login'),
          },
        ]
      );
    } catch (error: any) {
      setLoading(false);
      Alert.alert('Something went wrong', error.message);
    }
  }
  return (
    <View style={styles.container}>
      {/* <StatusBar style="auto" /> */}
      <Image
        source={require('../../assets/firebase.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        inputMode="email"
        autoCapitalize={'none'}
      />
      <TextInput
        style={[styles.input, { marginTop: 15 }]}
        placeholder="Username"
        onChangeText={setUserName}
      />
      <TextInput
        style={[styles.input, { marginTop: 15 }]}
        placeholder="Password"
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={registerUser}>
        {loading ? (
          <ActivityIndicator
            size={'small'}
            color={'white'}
            animating={loading}
          />
        ) : (
          <Text style={{ color: 'white' }}>Register</Text>
        )}
      </TouchableOpacity>

      <View style={styles.register}>
        <Text style={styles.link}>Have an account already? </Text>
        <Text
          style={[styles.link, { color: 'teal' }]}
          onPress={() => navigation.navigate('login')}
        >
          login
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  link: {
    fontSize: 15,
    color: 'gray',
  },
  register: {
    marginTop: 25,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    marginBottom: 40,
    width: 80,
    height: 80,
    alignSelf: 'center',
  },
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
