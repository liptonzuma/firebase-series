import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigation from './src/navigation/StackNavigation';
import { TodosContext } from './src/app/utils/Context';
import { TodoItemProps } from './src/app/todo/TodoItem';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const [tasks, setTasks] = useState<TodoItemProps[]>([]);
  return (
    <SafeAreaProvider>
      <TodosContext.Provider value={{ tasks, setTasks }}>
        <NavigationContainer>
          <StackNavigation />
        </NavigationContainer>
      </TodosContext.Provider>
    </SafeAreaProvider>
  );
}
