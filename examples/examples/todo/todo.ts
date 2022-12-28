import { createState, createSelector } from 'reactish-state';
import { persist, reduxDevtools, applyMiddleware, immer } from 'reactish-state/middleware';
import { reduxDevtools as devtoolsPlugin } from 'reactish-state/plugin';

const persistMiddleware = persist({ prefix: 'todoApp-' });
const state = createState({
  middleware: applyMiddleware(immer, persistMiddleware, reduxDevtools({ name: 'todoApp-state' }))
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
  { key: 'todoList' }
);

type VisibilityFilter = 'ALL' | 'COMPLETED' | 'IN_PROGRESS';
const visibilityFilterState = state('IN_PROGRESS' as VisibilityFilter, null, { key: 'filter' });

const selector = createSelector({ plugin: devtoolsPlugin({ name: 'todoApp-selector' }) });
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
  },
  { key: 'visibleTodos' }
);

const statsSelector = selector(
  todoListState,
  (todoList) => {
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
  },
  { key: 'stats' }
);

export type { VisibilityFilter };
export const { hydrate: hydrateStore } = persistMiddleware;
export { todoListState, visibilityFilterState, visibleTodoList, statsSelector };
