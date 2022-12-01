import { useSnapshot } from 'reactish-state';
import { todoListState, visibleTodoList } from './todo';

const TodoList = () => {
  const todos = useSnapshot(visibleTodoList);

  return (
    <ul>
      {todos.map(({ id, text, isCompleted: isDone }) => (
        <li key={id}>
          <label>
            <input
              type="checkbox"
              checked={isDone}
              onChange={() => todoListState.actions.toggleItem(id)}
            />
            {text}
          </label>
        </li>
      ))}
    </ul>
  );
};

export { TodoList };
