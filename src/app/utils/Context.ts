import { createContext } from 'react';
import { TodoItemProps } from '../todo/TodoItem';
import { MediaItemShape } from '../../../App';

interface DataContextProps {
  tasks: TodoItemProps[];
  setTasks: React.Dispatch<React.SetStateAction<any[]>>;
  media: MediaItemShape[];
  setMedia: React.Dispatch<React.SetStateAction<MediaItemShape[]>>;
}

export const DataContext = createContext<DataContextProps>({
  setTasks: () => {},
  tasks: [],
  media: [],
  setMedia: () => {},
});
