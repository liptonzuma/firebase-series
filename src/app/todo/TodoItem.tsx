import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useContext, useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TodosContext } from '../utils/Context';
import { updateTodoItem } from '../firebase/update';
import { deleteMyTodoItem } from '../firebase/delete';

export interface TodoItemProps {
  createdAt?: Timestamp;
  completedAt?: Timestamp | string;
  docId: string;
  todo: string;
  isCompleted: boolean;
  ownerId: string;
}

export default function TodoItem({ data }: { data: TodoItemProps }) {
  const { todo, isCompleted, docId } = data;
  const [completed, setCompleted] = useState<boolean>(isCompleted);

  const { tasks, setTasks } = useContext(TodosContext);

  const checkAsCompleted = async () => {
    try {
      const index = tasks.findIndex((task) => task.docId === docId);
      const updatedTasks = [...tasks];
      updatedTasks[index].isCompleted = !updatedTasks[index].isCompleted;
      setTasks(updatedTasks);
      setCompleted(!completed);
      await updateTodoItem(docId, !isCompleted);
    } catch (error: any) {
      Alert.alert('Something went wrong', error.message);
    }
  };

  const deleteMyTodo = async () => {
    try {
      const updatedTasks = tasks.filter((t) => t.docId !== docId);
      setTasks(updatedTasks);
      await deleteMyTodoItem(docId);
    } catch (error: any) {
      Alert.alert('Something went wrong', error.message);
    }
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.row}
        onLongPress={() => {
          Alert.alert(
            'Alert',
            'You are trying to delete this todo, Would you like to continue?',
            [
              { text: 'Cancel', onPress: () => null },
              { text: 'Delete', style: 'destructive', onPress: deleteMyTodo },
            ]
          );
        }}
      >
        <Pressable onPress={checkAsCompleted}>
          <MaterialCommunityIcons
            name={completed ? 'checkbox-marked' : 'checkbox-blank-outline'}
            size={28}
            color={completed ? 'teal' : 'gray'}
          />
        </Pressable>
        <Text style={styles.todo}>{todo}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  todo: {},

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  card: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 4,
  },
});
