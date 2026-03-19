import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import './styles/global.css';
import App from './App';

// Pages
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import TeamNewPage from './pages/TeamNewPage';
import TeamHomePage from './pages/TeamHomePage';
import TeamPostManagementPage from './pages/TeamPostManagementPage';
import PostDetailPage from './pages/PostDetailPage';
import PostFormPage from './pages/PostFormPage';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      <Route path="/" element={<MainPage />} />
      <Route path="/oauth/callback" element={<LoginPage />} />
      <Route path="/team/new" element={<TeamNewPage />} />
      <Route path="/team/:teamId" element={<TeamHomePage />} />
      <Route path="/team/:teamId/recruitments" element={<TeamPostManagementPage />} />
      <Route path="/post/new" element={<PostFormPage />} />
      <Route path="/post/:postId" element={<PostDetailPage />} />
    </Route>,
  ),
);
