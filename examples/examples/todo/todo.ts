import { state, selector } from 'reactish-state';

let todoId = 0;

interface Todo {
  id: number;
  text: string;
  isCompleted: boolean;
}

const todoListState = state([] as Todo[], (set, get) => ({
  addItem: (text: string) => set((todos) => [...todos, { id: todoId++, text, isCompleted: false }]),
  toggleItem: (id: number) =>
    set(get().map((item) => (item.id === id ? { ...item, isCompleted: !item.isCompleted } : item)))
}));

type VisibilityFilter = 'ALL' | 'COMPLETED' | 'IN_PROGRESS';
const visibilityFilterState = state('IN_PROGRESS' as VisibilityFilter);

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
export { todoListState, visibilityFilterState, visibleTodoList, statsSelector };
