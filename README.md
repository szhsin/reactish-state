# Reactish-State

> Simple, decentralized(atomic) state management for React.

## ✨Highlights✨

- Decentralized state management
- Un-opinionated and easy-to-use API
- No need of wrapping app in Context or prop drilling
- React components re-render only on changes
- Compatible with React 18 concurrent rendering
- Selectors are memoized by default
- Feature extensible with middleware or plugins
- States persistable to browser storage
- Support Redux dev tools via middleware
- [~1KB](https://bundlephobia.com/package/reactish-state): simple and small

## Install

`npm install reactish-state` or `yarn add reactish-state`

## Quick start

### We begin by creating some states

```js
import { state } from "reactish-state";

// `state` can hold anything: primitives, arrays, objects...
const countState = state(0);
const todos = state([
  { task: "Shop groceries", completed: false },
  { task: "Clean the house", completed: true }
]);

// Update state
countState.set(10);
// Read from state
console.log(countState.get()); // Print 10
```

### A state can also have actions bound to it

```js
const countState = state(0, (set, get) => ({
  // Set a new state
  reset: () => set(0),
  // or using the functional update of `set`
  increase: () => set((count) => count + 1),
  // State can still be read using `get`
  decrease: () => set(get() - 1)
}));

// Using the actions
countState.actions.increase();
```

### `selector` can create derived states

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

A selector will re-compute only when any of the states it depends on have changed.

### Use the state and selector in your React components

You can read state and selector for rendering with the `useSnapshot` hook, and write to state with `set` or actions. _Rule of thumb_: always read from `useSnapshot` in render function, otherwise use the `get` method of state or selector.

```jsx
import { useSnapshot } from "reactish-state";

const Example = () => {
  const count = useSnapshot(countState);
  const triple = useSnapshot(tripleSelector);

  return (
    <h1>
      {count} {triple}
      {/* Update state using the actions bound to it */}
      <button onClick={() => countState.actions.increase()}>Increase</button>
      {/* Or update state using the `set` method directly */}
      <button onClick={() => countState.set((i) => i - 1)}>Decrease</button>
      <button onClick={() => countState.set(0)}>Reset</button>
    </h1>
  );
};
```

The component will re-render when states or selectors have changed. No provider or context are needed!

**[Try a sandbox demo!](https://codesandbox.io/s/reactish-counter-3let0o)**

## Why another state management library?

The state management solutions in the React ecosystem have popularized two state models:

- **Centralized**: a single store that combines entire app states together and slices of the store are connected to React components through selectors. Examples: react-redux, Zustand.

- **Decentralized**: consisting of many small(atomic) states which can build up state dependency trees using a bottom-up approach. React components only need to connect with the states that they use. Examples: Recoil, Jotai.

This library adopts the decentralized state model, offering a _Recoil-like_ API, but with a much simpler and smaller implementation(similar to Zustand), which makes it the one of the smallest state management solutions with gzipped bundle size around 1KB.

|  | State model | Bundle size |
| --- | --- | --- |
| Reactish-State | decentralized | [![NPM](https://img.shields.io/bundlephobia/minzip/reactish-state)](https://bundlephobia.com/package/reactish-state) |
| Recoil | decentralized | [![NPM](https://img.shields.io/bundlephobia/minzip/recoil)](https://bundlephobia.com/package/recoil) |
| Jotai | decentralized | [![NPM](https://img.shields.io/bundlephobia/minzip/jotai)](https://bundlephobia.com/package/jotai) |
| React-Redux | centralized | [![NPM](https://img.shields.io/bundlephobia/minzip/react-redux)](https://bundlephobia.com/package/react-redux) |
| Zustand | centralized | [![NPM](https://img.shields.io/bundlephobia/minzip/zustand)](https://bundlephobia.com/package/zustand) |

## Why decentralized state management?

Centralized state management usually combines the entire app states into a single store. To achieve render optimization, selectors are used to subscribe React components to slices of the store. Taking the classic [Redux todo example](https://redux.js.org/introduction/examples#todos), the store has the following shape:

```js
{
  visibilityFilter: "ALL", // ALL, ACTIVE, COMPLETED
  todos: [{ task: "Shop groceries", completed: false } /* ...more items */]
}
```

We have a `<Filter/>` component that connects to the store with a selector `(state) => state.visibilityFilter`.

When any action updates the `todos` slice, the selector in the `<Filter/>` component needs to re-run to determine if a re-rendering of the component is required. This is not optimal as `<Filter/>` component should not even be bothered when the todos are added/removed/updated.

In contrast, decentralized state management may approach the same problem with two separate states:

```js
const visibilityFilter = state("ALL"); // ALL, ACTIVE, COMPLETED
const todos = state([
  { task: "Shop groceries", completed: false }
  /* ...more items */
]);
```

An update of `todos`, which is localized and isolated from other states, does not affect the components connected to `visibilityFilter` and vice versa.

The difference might sound insignificant, but imaging every single state update could cause every selector in every component in the entire app to run again, it suggests that decentralized state model scales better for large apps. In addition, some other benefits such as code-splitting are made easier by this state model.

## Why this over Zustand?

- State updates localized and isolated from other irrelevant states.
- No potential naming conflicts among states/actions within the big store.
- No need to use a React Hook to extract actions from the store.
- Actions come from outside React and no need to add them into the `useCallback/useEffect` dep array.

# Recipes

## States should be updated immutably

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

Selector has an API that is similar to the [reselect](https://github.com/reduxjs/reselect#readme) package. You pass in one or more "input" states or selectors, and an "output" selector function that receives the extracted values and should return a derived value. The return value is memoized so that it won't cause React components to re-render even if non-primitive value is returned.

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

## Async state updates

Just call `set` when you're ready:

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
  fetch: async (url) => {
    const response = await fetch(url);
    set(await response.json());
  }
}));
```

## Accessing other state or selector inside actions

You might not need it, but nothing stops you from reading or writing to other state inside an action.

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

## Interacting with state or selector outside React

```js
const countState = state(0);
const tripleSelector = selector(countState, (count) => count * 3);

// Get a non-reactish fresh value
const count = countState.get();
const triple = tripleSelector.get();

// Listen to updates
const unsub1 = countState.subscribe(() => console.log(countState.get()));
const unsub2 = tripleSelector.subscribe(() =>
  console.log(tripleSelector.get())
);

// Update `countState`, will trigger both listeners
countState.set(10);

// Unsubscribe listeners
unsub1();
unsub2();
```

The only difference between state and selector is that selectors are read-only which don't have a `set` method.

## Destructuring actions for easier reference

The `set` or actions of a state don't rely on `this` to work, thus you are free to destructure them for easier reference.

_TIP_: destructure the actions outside React components so that you don't need to add them into the `useCallback/useEffect` dependency array.

```jsx
import { state, useSnapshot } from "reactish-state";

const countState = state(0, (set) => ({
  increase: () => set((count) => count + 1),
  reset: () => set(0)
}));
const { increase, reset } = countState.actions;

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

## Selector that depends on props or local states

The `selector` function allows us to create reusable derived states outside React components. In contrast, component-scoped derived states which depend on props or local states can be created by the `useSelector` hook.

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
  // Render filtered todos...
};
```

The second parameter of `useSelector` is a dependency array (similar to React's `useMemo` hook), in which you can specify what props or local states the selector depends on. In the above example, `FilteredTodoList` component will re-render only if the global `todosState` state or local `filter` prop have been updated.

### Linting the dependency array of useSelector

You can take advantage of the [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks) package to lint the dependency array of `useSelector`. Add the following configuration into your ESLint config file:

```json
{
  "rules": {
    "react-hooks/exhaustive-deps": [
      "warn",
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

const { dispatch } = countState.actions;
dispatch({ type: "INCREASE", by: 10 });
dispatch({ type: "DECREASE", by: 7 });
console.log(countState.get()); // Print 3
```

## Middleware

You can enhance the functionalities of state with middleware. Instead of using the `state` export, you use the `createState` export from the library. Middleware is a function which receives `set`, `get` and `subscribe` and should return a new set function.

```js
import { createState } from "reactish-state";

const state = createState({
  middleware:
    ({ set, get }) =>
    (...args) => {
      set(...args);
      // Log state every time after calling `set`
      console.log("New state", get());
    }
});

// Now the `state` function has wired up a middleware
const countState = state(0, (set) => ({
  increase: () => set((count) => count + 1)
}));

countState.set(99); // Print "New state 99"
countState.actions.increase(); // Print "New state 100"

// The same `state` function can be reused,
// thus you don't need to set up the middleware again
const filterState = state("ALL");
filterState.set("COMPLETED"); // Print "New state 'COMPLETED'"
```

## Persist middleware

You can save state in browser storage with the `persist` middleware.

```js
import { createState } from "reactish-state";
import { persist } from "reactish-state/middleware";

// Create the persist middleware,
// you can optionally provide a `prefix` prepended to the keys in storage
const persistMiddleware = persist({ prefix: "myApp-" });
const state = createState({ middleware: persistMiddleware });

const countState = state(
  0,
  (set) => ({
    increase: () => set((count) => count + 1)
  }),
  { key: "count" } // In the third parameter, give each state a unique key
);
const filterState = state("ALL", null, { key: "filter" });

// Hydrate all the states created with this middleware from storage
useEffect(() => {
  // Call `hydrate` in an useEffect to avoid client-side mismatch
  // if React components are also server-rendered
  persistMiddleware.hydrate();
}, []);
// You can add the `useEffect` once into your root component
```

By default `localStorage` is used to persist states. You can change it to `sessionStorage` or other implementations using the `getStorage` option.

```js
const persistMiddleware = persist({ getStorage: () => sessionStorage });
```

## Immer middleware

You can mutably update state with the `immer` middleware.

```js
import { createState } from "reactish-state";
import { immer } from "reactish-state/middleware/immer";

const state = createState({ middleware: immer });

let todoId = 1;
const todos = state([], (set) => ({
  add: (task) =>
    set((todos) => {
      todos.push({ id: todoId++, task, completed: false });
      // Need to return the draft state for correct typing in TypeScript code
      // return todos;
    }),

  toggle: (id) =>
    set((todos) => {
      const todo = todos.find((todo) => todo.id === id);
      if (todo) todo.completed = !todo.completed;
    })
}));

// Using the actions
todos.actions.add("Shop groceries");
todos.actions.toggle(1);
```

## Redux devtools middleware

Individual state will be combined into one big object in the Redux devtools for easy inspection.

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
        // Log action type in the second parameter of `set`
        "todo/add"
      ),
    toggle: (id) =>
      set(
        (todos) => {
          /* Toggle todo */
        },
        // You can also log action type along with its payload
        { type: "todo/toggle", id }
      )
  }),
  // Similar to the persist middleware, give each state a unique key
  { key: "todos" }
);

// `todos` and `filter` will be combined into one state in the Redux devtools
const filter = state("ALL", null, { key: "filter" });
```

## Using multiple middleware

Middleware is chain-able. You can use the `applyMiddleware` utility to chain multiple middleware and supply the result to `createState`.

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

It also helps eliminate the need for implementing whitelist/blacklist in a persist middleware.

## Plugins

While the middleware is used to enhance state, you can hook into selectors using the plugins. The main difference is that plugins don't return a `set` function because selectors are read-only. Similarly, you use the `createSelector` export from the library rather than `selector`.

```js
import { state, createSelector } from "reactish-state";

const selector = createSelector({
  plugin: ({ get, subscribe }, config) => {
    subscribe(() => {
      // Log selector value every time after it has changed
      // `config` can hold contextual data from a selector
      console.log(`${config?.key} selector:`, get());
    });
  }
});

const countState = state(0);
const doubleSelector = selector(
  countState,
  (count) => count * 2,
  // Provide contextual data in the last parameter to identity selector
  {
    key: "double"
  }
);
const squareSelector = selector(countState, (count) => count * count, {
  key: "square"
});

countState.set(5); // Will log - double selector: 10, square selector: 25
```

Likewise, there is an `applyPlugin` function for applying multiple plugins.

## Redux devtools plugin

Individual selector will be combined into one big object in the Redux devtools for easy inspection.

```js
import { createSelector } from "reactish-state";
import { reduxDevtools } from "reactish-state/plugin";

const selector = createSelector({ plugin: reduxDevtools() });
// Then use the `selector` as always...
```

# Examples

- Counter – [sandbox](https://codesandbox.io/s/reactish-counter-3let0o) | [source](https://github.com/szhsin/reactish-state/tree/master/examples/examples/counter)
- Todo app – [sandbox](https://codesandbox.io/s/reactish-todo-thyhbl) | [source](https://github.com/szhsin/reactish-state/tree/master/examples/examples/todo)
- Async – [sandbox](https://codesandbox.io/s/reactish-async-2cghkg) | [source](https://github.com/szhsin/reactish-state/tree/master/examples/examples/async)
