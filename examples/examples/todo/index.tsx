import { AddTodo } from './AddTodo';
import { TodoList } from './TodoList';
import { Filters } from './Filters';
import { Stats } from './Stats';

export default function Todo() {
  return (
    <div>
      <AddTodo />
      <TodoList />
      <Filters />
      <Stats />
    </div>
  );
}
