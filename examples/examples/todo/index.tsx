import { useEffect } from 'react';
import { hydrateStore } from './store';
import { AddTodo } from './AddTodo';
import { VisibleTodoList } from './VisibleTodoList';
import { Filters } from './Filters';
import { Stats } from './Stats';
import { TodoList } from './TodoList';
import styles from './styles.module.css';

export default function App() {
  useEffect(() => {
    hydrateStore();
  }, []);

  return (
    <div className={styles.app}>
      <AddTodo />
      <VisibleTodoList />
      <Filters />
      <Stats />
      <TodoList filter="ACTIVE" />
      <TodoList filter="COMPLETED" />
    </div>
  );
}
