import { useEffect } from 'react';
import { hydrateStore } from './todo';
import { AddTodo } from './AddTodo';
import { TodoList } from './TodoList';
import { Filters } from './Filters';
import { Stats } from './Stats';
import styles from './styles.module.css';

export default function Todo() {
  useEffect(() => {
    hydrateStore();
  }, []);

  return (
    <div className={styles.app}>
      <AddTodo />
      <TodoList />
      <Filters />
      <Stats />
    </div>
  );
}
