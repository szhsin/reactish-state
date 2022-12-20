import { useSnapshot } from 'reactish-state';
import { todoListState, visibleTodoList } from './todo';
import styles from './styles.module.css';

const TodoList = () => {
  const todos = useSnapshot(visibleTodoList);
  const { toggleItem, deleteItem } = todoListState.actions;

  return (
    <ul>
      {todos.map(({ id, text, isCompleted: isDone }) => (
        <li key={id} className={styles.todo}>
          <label>
            <input type="checkbox" checked={isDone} onChange={() => toggleItem(id)} />
            {text}
          </label>
          <button onClick={() => deleteItem(id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export { TodoList };
