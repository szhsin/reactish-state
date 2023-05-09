import { useSelector } from 'reactish-state';
import { todoListState, getTodoListByFilter, VisibilityFilter } from './store';
import styles from './styles.module.css';

// Component-scoped derived states which depend on props or local states can be created by the `useSelector` hook
const TodoList = ({ filter = 'ALL' }: { filter?: VisibilityFilter }) => {
  const todos = useSelector(
    () => [todoListState, (todos) => getTodoListByFilter(todos, filter)],
    [filter]
  );

  return (
    <>
      <hr />
      <h2>{filter} todos</h2>
      {todos.length ? (
        <ul className={styles.todos}>
          {todos.map(({ id, text, isCompleted }) => (
            <li key={id} className={`${styles.todoItem} ${isCompleted && styles.completed}`}>
              {text}
            </li>
          ))}
        </ul>
      ) : (
        <p>There are no {filter} todos to display.</p>
      )}
    </>
  );
};

export { TodoList };
