# Reactish-State

> Simple, decentralized (atomic) state management for React.

[![NPM](https://img.shields.io/npm/v/reactish-state.svg)](https://www.npmjs.com/package/reactish-state) [![NPM](https://img.shields.io/bundlephobia/minzip/reactish-state)](https://bundlephobia.com/package/reactish-state) [![bundlejs](https://img.shields.io/badge/bundlejs-.com-blue.svg)](https://bundlejs.com/?q=reactish-state&treeshake=%5B*%5D&config=%7B%22esbuild%22%3A%7B%22external%22%3A%5B%22react%22%5D%7D%7D)

💡 [Quick examples](#examples) &nbsp;&nbsp; 🔧 [TypeScript usage](#typescript-usage)

## ✨Highlights✨

- Decentralized state management
- Unopinionated and easy-to-use API
- No need to wrap app in Context or prop drilling
- React components re-render only on changes
- Compatible with React 18/19 concurrent rendering
- Selectors are memoized by default
- Feature extensible with middleware or plugins
- State persistable to browser storage
- Support for Redux dev tools via middleware
- [Less than 1KB](https://bundlejs.com/?q=reactish-state&treeshake=%5B*%5D&config=%7B%22esbuild%22%3A%7B%22external%22%3A%5B%22react%22%5D%7D%7D): simple and small

## Install

```bash
npm install reactish-state
```

## Quick start

### We begin by creating some state

```js
import { state } from "reactish-state";

// `state` can hold anything: primitives, arrays, objects, etc.
const countState = state(0);
const todos = state([
  { task: "Shop groceries", completed: false },
  { task: "Clean the house", completed: true }
]);

// Update the state
countState.set(10);
// Read from the state
console.log(countState.get()); // Print 10
```

### A state can also have custom actions bound to it

```js
const countState = state(0, (set, get) => ({
  // Set a new state value
  reset: () => set(0),
  // Or use the functional update of `set`
  increase: () => set((count) => count + 1),
  // State can still be read using `get`
  decrease: () => set(get() - 1)
}));

// Use the custom actions
countState.increase();
```

### `selector` can create derived state

```js
import { selector } from "reactish-state";

// Derive from another state
const doubleSelector = selector(countState, (count) => count * 2);

// Can also derive from both states and selectors
const tripleSelector = selector(
  countState,
  doubleSelector,
  (count, double) => count + double
);
```

A selector will re-compute only when one of the states it depends on has changed.

### Use the state and selectors in your React components

You can read state and selectors for rendering with the `useSnapshot` hook, and write to state with `set` or actions. _Rule of thumb_: always read from `useSnapshot` in the render function; otherwise, use the `get` method of state or selector (in event handlers or even outside of React components).

```jsx
import { useSnapshot } from "reactish-state";

const Example = () => {
  const count = useSnapshot(countState);
  const triple = useSnapshot(tripleSelector);

  return (
    <h1>
      {/* The return values of `useSnapshot` are used for rendering */}
      {count} {triple}
      {/* Update the state using the custom actions bound to it */}
      <button onClick={() => countState.increase()}>Increase</button>
      {/* Or update the state using the `set` method directly */}
      <button onClick={() => countState.set((i) => i - 1)}>Decrease</button>
      <button onClick={() => countState.set(0)}>Reset</button>
    </h1>
  );
};
```

The component will re-render when states or selectors change. No provider or context is needed!

**[Try a sandbox demo!](https://codesandbox.io/p/sandbox/reactish-counter-z42qt7)**

## Why another state management library?

State management solutions in the React ecosystem have popularized two state models:

- **Centralized**: a single store that combines the entire app's state, with slices of the store connected to React components via selectors. Examples: React-Redux, Zustand.

- **Decentralized**: composed of many small (atomic) states that build state dependency trees using a bottom-up approach. React components only connect to the states they need. Examples: Recoil, Jotai.

This library adopts the decentralized state model, offering a _Recoil-like_ API with a much smaller implementation (similar to Zustand). This makes it one of the smallest state management solutions, with a gzipped bundle size of less than 1KB.

|  | State model | Bundle size |
| --- | --- | --- |
| Reactish-State | decentralized | [![NPM](https://img.shields.io/bundlephobia/minzip/reactish-state)](https://bundlephobia.com/package/reactish-state) |
| Recoil | decentralized | [![NPM](https://img.shields.io/bundlephobia/minzip/recoil)](https://bundlephobia.com/package/recoil) |
| Jotai | decentralized | [![NPM](https://img.shields.io/bundlephobia/minzip/jotai)](https://bundlephobia.com/package/jotai) |
| React-Redux | centralized | [![NPM](https://img.shields.io/bundlephobia/minzip/react-redux)](https://bundlephobia.com/package/react-redux) |
| Zustand | centralized | [![NPM](https://img.shields.io/bundlephobia/minzip/zustand)](https://bundlephobia.com/package/zustand) |

## Why decentralized state management?

Centralized state management typically combines the entire app's state into a single store. To optimize rendering, selectors are used to subscribe React components to slices of the store. Taking the classic [Redux todo example](https://redux.js.org/introduction/examples#todos), the store has the following shape:

```js
{
  visibilityFilter: "ALL", // ALL, ACTIVE, COMPLETED
  todos: [{ task: "Shop groceries", completed: false } /* ...and more items */]
}
```

We have a `<Filter/>` component that connects to the store with a selector `(state) => state.visibilityFilter`.

When any action updates the `todos` slice, the selector in the `<Filter/>` component needs to re-run to determine if a re-render is required. This is not optimal, as the `<Filter/>` component should not be affected when todos are added, removed, or updated.

In contrast, decentralized state management may approach the same problem with two separate states:

```js
const visibilityFilter = state("ALL"); // ALL, ACTIVE, COMPLETED
const todos = state([
  { task: "Shop groceries", completed: false }
  /* ...and more items */
]);
```

An update to `todos`, which is localized and isolated from other states, does not affect components connected to `visibilityFilter` and vice versa.

While the difference might seem insignificant, imagine that every small state update could cause every selector in every component across the entire app to re-run. This suggests that the decentralized state model scales better for large apps. Additionally, benefits like code-splitting are easier to implement with this state model.

## Why choose this over Zustand?

- State updates are localized and isolated from other irrelevant states.
- No potential naming conflicts among states/actions within a large store.
- No need to use a React Hook to extract actions from the store.
- Actions are external to React, eliminating the need to add them to the `useCallback/useEffect` dep array.

# Recipes

## State should be updated immutably

```js
import { state } from "reactish-state";

const todosState = state([{ task: "Clean the house", completed: true }]);
todosState.set((todos) => [
  ...todos,
  { task: "Shop groceries", completed: false }
]);
```

You can use the `immer` package to reduce boilerplate code:

```js
import produce from "immer";

todosState.set(
  produce((todos) => {
    todos.push({ task: "Shop groceries", completed: false });
  })
);
```

Or, simply use the [immer middleware](#immer-middleware).

## Selectors are memoized

Selector has an API similar to the [reselect](https://github.com/reduxjs/reselect#readme) package. You pass in one or more 'input' states or selectors, along with an 'output' selector function that receives the extracted values and returns a derived value. The return value is memoized, ensuring that React components won’t re-render even if a non-primitive value is returned.

```js
import { selector } from "reactish-state";

// Return a number
const totalNumSelector = selector(todosState, (todos) => todos.length);

// Return a new array
const completedTodosSelector = selector(todosState, (todos) =>
  todos.filter((todo) => todo.completed)
);

// Return an object
const todoStats = selector(
  totalNumSelector,
  completedTodosSelector,
  (totalNum, completedTodos) => ({
    completedNum: completedTodos.length,
    percentCompleted: (completedTodos.length / totalNum) * 100
  })
);
```

The only difference between state and selector is that selectors are read-only and don’t have a `set` method.

## Async state updates

Just call `set` when your data is ready:

```js
const todosState = state([]);

async function fetchTodos(url) {
  const response = await fetch(url);
  todosState.set(await response.json());
}
```

You can also create async actions bound to a state:

```js
const todosState = state([], (set) => ({
  fetchData: async () => {
    const response = await fetch(/* some url */);
    set(await response.json());
  }
}));

// Use the async action
await todosState.fetchData();
```

## Accessing other state or selectors inside actions

You might not need it, but nothing prevents you from reading or writing to other state inside an action.

```js
const inputState = state("New item");
const todosState = state(
  [{ task: "Shop groceries", completed: false }],
  (set) => ({
    add: () => {
      set((todos) => [...todos, { task: inputState.get(), completed: false }]);
      inputState.set(""); // Reset input after adding a todo
    }
  })
);
```

## Interacting with state or selectors outside React

```js
const countState = state(0);
const tripleSelector = selector(countState, (count) => count * 3);

// Get a non-reactish fresh value
const count = countState.get();
const triple = tripleSelector.get();

// Listen for updates
const unsub1 = countState.subscribe(() => console.log(countState.get()));
const unsub2 = tripleSelector.subscribe(() =>
  console.log(tripleSelector.get())
);

// Updating `countState` will trigger both listeners
countState.set(10);

// Unsubscribe from listeners
unsub1();
unsub2();
```

## Destructuring actions for easier access

The `set` or actions of a state don't rely on `this` to work, so you can destructure them for easier reference.

_TIP_: Destructure the actions outside of React components to avoid adding them to the `useCallback/useEffect` dependency array.

```jsx
import { state, useSnapshot } from "reactish-state";

const countState = state(0, (set) => ({
  increase: () => set((count) => count + 1),
  reset: () => set(0)
}));
const { increase, reset } = countState;

const Example = () => {
  const count = useSnapshot(countState);
  return (
    <h1>
      {count}
      <button onClick={() => increase()}>Increase</button>
      <button onClick={() => reset()}>Reset</button>
    </h1>
  );
};
```

## Selector that depends on props or local state

The `selector` function allows us to create reusable derived states outside of React components. In contrast, component-scoped derived states that depend on props or local state can be created using the `useSelector` hook.

```jsx
import { state, useSelector } from "reactish-state";

const todosState = state([{ task: "Shop groceries", completed: false }]);

const FilteredTodoList = ({ filter = "ALL" }) => {
  const filteredTodos = useSelector(
    () => [
      todosState,
      (todos) => {
        switch (filter) {
          case "ALL":
            return todos;
          case "COMPLETED":
            return todos.filter((todo) => todo.completed);
          case "ACTIVE":
            return todos.filter((todo) => !todo.completed);
        }
      }
    ],
    [filter]
  );
  // Render the filtered todos...
};
```

The second parameter of `useSelector` is a dependency array (similar to React's `useMemo` hook), where you can specify which props or local state the selector depends on. In the example above, the `FilteredTodoList` component will re-render only if the global `todosState` or the local `filter` prop is updated.

### Linting the dependency array of useSelector

You can take advantage of the [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks) package to lint the dependency array of `useSelector`. Simply add the following configuration to your ESLint config file:

```json
{
  "rules": {
    "react-hooks/exhaustive-deps": [
      "error",
      {
        "additionalHooks": "useSelector"
      }
    ]
  }
}
```

## Still perfer Redux-like reducers?

```js
const reducer = (state, { type, by = 1 }) => {
  switch (type) {
    case "INCREASE":
      return state + by;
    case "DECREASE":
      return state - by;
  }
};

const countState = state(0, (set) => ({
  dispatch: (action) => set((state) => reducer(state, action), action)
}));

const { dispatch } = countState;
dispatch({ type: "INCREASE", by: 10 });
dispatch({ type: "DECREASE", by: 7 });
console.log(countState.get()); // Print 3
```

## Middleware

You can enhance the functionality of state with middleware. Instead of using the `state` export, use the `createState` export from the library. Middleware is a function that receives `set`, `get`, and `subscribe`, and should return a new set function.

```js
import { createState } from "reactish-state";

const state = createState({
  middleware:
    ({ set, get }) =>
    (...args) => {
      set(...args);
      // Log the state every time after calling `set`
      console.log("New state", get());
    }
});

// Now the `state` function has middleware wired up
const countState = state(0, (set) => ({
  increase: () => set((count) => count + 1)
}));

countState.set(99); // Print "New state 99"
countState.increase(); // Print "New state 100"

// The same `state` function can be reused,
// so you don't need to set up the middleware again
const filterState = state("ALL");
filterState.set("COMPLETED"); // Print "New state 'COMPLETED'"
```

## Persist middleware

You can save the state to browser storage using the `persist` middleware.

```js
import { createState } from "reactish-state";
import { persist } from "reactish-state/middleware";

// Create the persist middleware,
// optionally provide a `prefix` to prepend to the keys in storage
const persistMiddleware = persist({ prefix: "myApp-" });
const state = createState({ middleware: persistMiddleware });

const countState = state(
  0,
  (set) => ({
    increase: () => set((count) => count + 1)
  }),
  { key: "count" } // In the third parameter, assign each state a unique key
);
const filterState = state("ALL", null, { key: "filter" });

// Hydrate all the states created with this middleware from storage
useEffect(() => {
  // Call `hydrate` in a `useEffect` to avoid client-side mismatch,
  // if React components are also server-rendered
  persistMiddleware.hydrate();
}, []);
// You can add the `useEffect` once in your root component
```

By default, `localStorage` is used to persist states. You can switch to `sessionStorage` or other implementations by using the `getStorage` option.

```js
const persistMiddleware = persist({ getStorage: () => sessionStorage });
```

## Immer middleware

You can update state mutably using the `immer` middleware.

```js
import { createState } from "reactish-state";
import { immer } from "reactish-state/middleware/immer";

const state = createState({ middleware: immer });

let todoId = 1;
const todos = state([], (set) => ({
  add: (task) =>
    set((todos) => {
      todos.push({ id: todoId++, task, completed: false });
      // Return the draft state for correct typing in TypeScript
      return todos;
    }),

  toggle: (id) =>
    set((todos) => {
      const todo = todos.find((todo) => todo.id === id);
      if (todo) todo.completed = !todo.completed;
    })
}));

// Use the actions
todos.add("Shop groceries");
todos.toggle(1);
```

## Redux devtools middleware

This middleware provides integration with the Redux DevTools browser extension. Individual states are combined into a single object in Redux DevTools for easy inspection.

```js
import { createState } from "reactish-state";
import { reduxDevtools } from "reactish-state/middleware";

const state = createState({ middleware: reduxDevtools({ name: "todoApp" }) });

const todos = state(
  [],
  (set) => ({
    add: (task) =>
      set(
        (todos) => {
          /* Add todo */
        },
        // Log the action type in the second parameter of `set`
        "todo/add"
      ),
    toggle: (id) =>
      set(
        (todos) => {
          /* Toggle todo */
        },
        // You can also log the action type along with its payload
        { type: "todo/toggle", id }
      )
  }),
  // Similar to the persist middleware, assign each state a unique key
  { key: "todos" }
);

// `todos` and `filter` will be combined into a single object in Redux DevTools
const filter = state("ALL", null, { key: "filter" });
```

## Using multiple middleware

Middleware is chainable. You can use the `applyMiddleware` utility to chain multiple middleware and pass the result to `createState`.

```js
import { applyMiddleware } from "reactish-state/middleware";

const state = createState({
  middleware: applyMiddleware([immer, reduxDevtools(), persist()])
});
```

## Using different middleware in different states

This is naturally achievable thanks to the decentralized state model.

```js
const persistState = createState({ middleware: persist() });
const immerState = createState({ middleware: immer });

const visibilityFilter = persistState("ALL"); // Will be persisted
const todos = immerState([]); // Can be mutated
```

This also eliminates the need to implement a whitelist or blacklist in the persist middleware.

## Plugins

While middleware enhances state, plugins allow you to hook into selectors. The key difference is that plugins don’t return a `set` function, as selectors are read-only. Similarly, you use the `createSelector` export from the library instead of `selector`.

```js
import { state, createSelector } from "reactish-state";

const selector = createSelector({
  plugin: ({ get, subscribe }, config) => {
    subscribe(() => {
      // Log the selector value every time it changes
      // `config` can hold contextual data from the selector
      console.log(`${config?.key} selector:`, get());
    });
  }
});

const countState = state(0);
const doubleSelector = selector(
  countState,
  (count) => count * 2,
  // Provide contextual data in the last parameter to identify the selector
  {
    key: "double"
  }
);
const squareSelector = selector(countState, (count) => count * count, {
  key: "square"
});

countState.set(5); // Logs - double selector: 10, square selector: 25
```

Likewise, there is an `applyPlugin` function for applying multiple plugins.

## Redux devtools plugin

Individual selectors are combined into a single object in Redux DevTools for easy inspection.

```js
import { createSelector } from "reactish-state";
import { reduxDevtools } from "reactish-state/plugin";

const selector = createSelector({ plugin: reduxDevtools() });
// Then use the `selector` as usual...
```

# TypeScript usage

The API relies on type inference to correctly infer the types for both the value and actions of the state. There are two scenarios:

## I. The type of state can be inferred from its initial value

In this case, the usage in TypeScript should be identical to JavaScript. You don't need to make any specific effort regarding typing. This is true when the state holds simple or primitive values.

```ts
const countState = state(0, (set) => ({
  increase: (by: number) =>
    set(
      (count) => count + by
      // The `count` is inferred as a number type from the initial value.
    )
}));
```

## II. The type of state cannot be inferred from its initial value

In this case, you have three options:

### 1. Use a type assertion to specify a more specific type for the initial value:

```ts
const myTodos = state([] as string[], (set) => ({
  add: (newTodo: string) => set((todos) => [...todos, newTodo])
}));
```

This is the simplest approach since the types for custom actions will be automatically inferred.

### 2. Declare the initial value separately with a specific type:

```ts
const initialValue: string[] = [];
const myTodos = state(initialValue, (set) => ({
  add: (newTodo: string) => set((todos) => [...todos, newTodo])
}));
```

This is basically very similar to the first method, except you need to write an additional line of code. The types for actions will be automatically inferred.

### 3. Specify type parameters explicitly:

```ts
const myTodos = state<string[], { add: (newTodo: string) => void }>(
  [],
  (set) => ({
    add: (newTodo) => set((todos) => [...todos, newTodo])
  })
);
```

# Examples

- Counter – [sandbox](https://codesandbox.io/p/sandbox/reactish-counter-z42qt7) | [source](https://github.com/szhsin/reactish-state/tree/master/examples/examples/counter)
- Todo app – [sandbox](https://codesandbox.io/s/reactish-todo-thyhbl) | [source](https://github.com/szhsin/reactish-state/tree/master/examples/examples/todo)
- Async – [sandbox](https://codesandbox.io/s/reactish-async-2cghkg) | [source](https://github.com/szhsin/reactish-state/tree/master/examples/examples/async)

# React 16/17 setup

When using this library with React 16/17, you must set up a shim since it doesn't include a native [useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore). We don't set up the shim by default to minimize the bundle size for React 18/19 users.

```js
import { setReactShim } from "reactish-state";
import { reactShim } from "reactish-state/shim";
setReactShim(reactShim);
```

You only need to set it up once after your app launches, outside of React code. DO NOT call `setReactShim` within any React components.
