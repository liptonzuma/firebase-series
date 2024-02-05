import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../auth/Login';
import Register from '../auth/Register';
import HomeScreen from '../app/HomeScreen';

const Stack = createNativeStackNavigator();

export default function StackNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="login" component={Login} />

      <Stack.Screen
        name="register"
        component={Register}
        options={{ presentation: 'modal' }}
      />

      <Stack.Screen name="home" component={HomeScreen} />
    </Stack.Navigator>
  );
}
