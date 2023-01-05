import { useState } from 'react';
import { todoListState } from './todo';
import styles from './styles.module.css';

const AddTodo = () => {
  const [text, setText] = useState('');

  return (
    <div>
      <input
        type="text"
        placeholder="Add an item"
        value={text}
        onChange={(e) => setText(e.currentTarget.value.trim())}
      />
      <button
        className={styles.add}
        disabled={!text.trim().length}
        onClick={() => {
          todoListState.actions.addItem(text);
          setText('');
        }}
      >
        Add
      </button>
    </div>
  );
};

export { AddTodo };
