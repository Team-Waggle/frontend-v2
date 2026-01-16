import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import App from './App';
import MainPage from './pages/MainPage';
import './styles/global.css';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      <Route path="/" element={<MainPage />} />
    </Route>,
  ),
);
