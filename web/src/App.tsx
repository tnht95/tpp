import { createSignal } from 'solid-js';

export const App = () => {
  const [count, setCount] = createSignal<number>(0);

  return (
    <>
      <h1>TPP</h1>
      <div>
        <button onClick={() => setCount(count => count + 1)}>
          count is {count()}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p>Click on the Vite and Solid logos to learn more</p>
    </>
  );
};
