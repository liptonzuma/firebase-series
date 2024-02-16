import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../auth/Login';
import Register from '../auth/Register';
import HomeScreen from '../app/HomeScreen';
import ChooseImages from '../app/upload/ChooseImages';
import Preview from '../app/upload/Preview';
import DisplayCloudMedia from '../app/media/DisplayCloudMedia';

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
      <Stack.Screen name="choose image" component={ChooseImages} />
      <Stack.Screen name="preview" component={Preview} />
      <Stack.Screen name="display cloud media" component={DisplayCloudMedia} />
    </Stack.Navigator>
  );
}
