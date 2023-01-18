import { useState } from 'react';
import { todoListState } from './store';
import styles from './styles.module.css';

const AddTodo = () => {
  const [text, setText] = useState('');

  return (
    <div>
      <input
        type="text"
        placeholder="Add an item"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        className={styles.add}
        disabled={!text.trim().length}
        onClick={() => {
          todoListState.actions.addItem(text.trim());
          setText('');
        }}
      >
        Add
      </button>
    </div>
  );
};

export { AddTodo };
