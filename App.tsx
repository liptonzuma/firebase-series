import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigation from './src/navigation/StackNavigation';
import { DataContext } from './src/app/utils/Context';
import { TodoItemProps } from './src/app/todo/TodoItem';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CloudImage } from './src/app/firebase/storage/uploadMedia';

export interface MediaItemShape extends CloudImage {
  docId: string;
}

export default function App() {
  const [tasks, setTasks] = useState<TodoItemProps[]>([]);
  const [media, setMedia] = useState<MediaItemShape[]>([]);
  return (
    <SafeAreaProvider>
      <DataContext.Provider value={{ tasks, setTasks, media, setMedia }}>
        <NavigationContainer>
          <StackNavigation />
        </NavigationContainer>
      </DataContext.Provider>
    </SafeAreaProvider>
  );
}
