type Listener = () => void;

const state = <T>(initialValue: T) => {
  let value = initialValue;
  const listeners = new Set<Listener>();

  const set = (newValue: T) => {
    value = newValue;
    listeners.forEach((listener) => listener());
  };

  return {
    get: () => value,
    set,
    subscribe: (listener: Listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    }
  };
};

export { state };
