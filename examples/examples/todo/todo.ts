import { createState, selector } from 'reactish-state';
import { persist, reduxDevtools, applyMiddleware, immer } from 'reactish-state/middleware';

const persistMiddleware = persist({ prefix: 'todoApp-' });
const state = createState({
  middleware: applyMiddleware(immer, persistMiddleware, reduxDevtools)
});

interface Todo {
  id: number;
  text: string;
  isCompleted: boolean;
}

const todoListState = state(
  [] as Todo[],
  (set, get) => ({
    addItem: (text: string) =>
      set((todos) => [...todos, { id: Date.now(), text, isCompleted: false }], 'todos/addItem'),
    toggleItem: (id: number) =>
      set(
        get().map((item) => (item.id === id ? { ...item, isCompleted: !item.isCompleted } : item)),
        { type: 'todos/toggleItem', id }
      ),
    deleteItem: (id: number) =>
      set(
        (todos) => {
          const index = todos.findIndex((item) => item.id === id);
          if (index >= 0) todos.splice(index, 1);
          return todos;
        },
        { type: 'todos/deleteItem', id }
      )
  }),
  { key: 'todo-list' }
);

type VisibilityFilter = 'ALL' | 'COMPLETED' | 'IN_PROGRESS';
const visibilityFilterState = state('IN_PROGRESS' as VisibilityFilter, null, { key: 'filter' });

const visibleTodoList = selector(
  todoListState,
  visibilityFilterState,
  (todoList, visibilityFilter) => {
    switch (visibilityFilter) {
      case 'ALL':
        return todoList;
      case 'COMPLETED':
        return todoList.filter(({ isCompleted }) => isCompleted);
      case 'IN_PROGRESS':
        return todoList.filter(({ isCompleted }) => !isCompleted);
    }
  }
);

const statsSelector = selector(todoListState, (todoList) => {
  const totalNum = todoList.length;
  const completedNum = todoList.filter((item) => item.isCompleted).length;
  const uncompletedNum = totalNum - completedNum;
  const percentCompleted = totalNum === 0 ? 0 : (completedNum / totalNum) * 100;

  return {
    totalNum,
    completedNum,
    uncompletedNum,
    percentCompleted
  };
});

export type { VisibilityFilter };
export const { hydrate: hydrateStore } = persistMiddleware;
export { todoListState, visibilityFilterState, visibleTodoList, statsSelector };
