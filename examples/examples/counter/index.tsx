import { useEffect } from 'react';
import { Counter, persistMiddleware } from './Counter';

export default function Example() {
  useEffect(() => {
    persistMiddleware.hydrate();
  }, []);

  return (
    <div>
      <Counter id="1" />
      <Counter id="2" />
    </div>
  );
}
