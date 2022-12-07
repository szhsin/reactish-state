import { useEffect } from 'react';
import { hydrateStore } from './todo';
import { AddTodo } from './AddTodo';
import { TodoList } from './TodoList';
import { Filters } from './Filters';
import { Stats } from './Stats';

export default function Todo() {
  useEffect(() => {
    hydrateStore();
  }, []);
  return (
    <div>
      <AddTodo />
      <TodoList />
      <Filters />
      <Stats />
    </div>
  );
}
