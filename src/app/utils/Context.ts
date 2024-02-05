import { createContext } from 'react';
import { TodoItemProps } from '../todo/TodoItem';

interface TodosContextProps {
  tasks: TodoItemProps[];
  setTasks: React.Dispatch<React.SetStateAction<any[]>>;
}

export const TodosContext = createContext<TodosContextProps>({
  setTasks: () => {},
  tasks: [],
});
