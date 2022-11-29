import { useState } from 'react';
import { todoListState } from './todo';

const AddTodo = () => {
  const [text, setText] = useState('');

  return (
    <div>
      <input type="text" value={text} onChange={(e) => setText(e.currentTarget.value.trim())} />
      <button
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
