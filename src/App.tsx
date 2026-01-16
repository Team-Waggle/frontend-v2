import { Outlet, ScrollRestoration } from 'react-router-dom';

function App() {
  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  );
}

export default App;
