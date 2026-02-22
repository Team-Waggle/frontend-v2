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
import RecruitmentDetailPage from './pages/RecruitmentDetailPage';
// import PostFormPage from './pages/PostFormPage';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      <Route path="/" element={<MainPage />} />
      <Route path="/oauth/callback" element={<LoginPage />} />
      <Route path="/recruitment" element={<RecruitmentDetailPage />} />
      <Route path="/team/new" element={<TeamNewPage />} />
      <Route path="/team/home" element={<TeamHomePage />} />
      {/* <Route path="/post/new" element={<PostFormPage />} /> */}
    </Route>,
  ),
);
