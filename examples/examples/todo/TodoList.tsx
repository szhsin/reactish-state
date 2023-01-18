import { useSnapshot } from 'reactish-state';
import { todoListState, visibleTodoList } from './store';
import styles from './styles.module.css';

const TodoList = () => {
  const todos = useSnapshot(visibleTodoList);
  const { toggleItem, deleteItem } = todoListState.actions;

  return (
    <ul className={styles.todos}>
      {todos.map(({ id, text, isCompleted }) => (
        <li key={id} className={styles.todo}>
          <label className={styles.todoLabel}>
            <input type="checkbox" checked={isCompleted} onChange={() => toggleItem(id)} />
            <span className={isCompleted ? styles.completed : ''}>{text}</span>
          </label>
          <button className={styles.delete} onClick={() => deleteItem(id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};

export { TodoList };
