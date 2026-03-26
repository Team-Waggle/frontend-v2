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
import NotFoundPage from './pages/NotFoundPage';
import TeamStatusPage from './pages/TeamStatusPage';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<App />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/team/new" element={<TeamNewPage />} />
        <Route path="/team/:teamId" element={<TeamHomePage />} />
        <Route
          path="/team/:teamId/recruitments"
          element={<TeamPostManagementPage />}
        />
        <Route path="/team/:teamId/status" element={<TeamStatusPage />} />
        <Route path="/post/new" element={<PostFormPage />} />
        <Route path="/post/:postId" element={<PostDetailPage />} />
      </Route>
      <Route path="/oauth/callback" element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </>,
  ),
);

// 내팀/모집글 관리 /team/:teamId/posts
// 내팀/지원자 관리 /team/:teamId/applicants
// 내팀/팀상태 관리 /team/:teamId/status
// 알림 /notification
// 메시지 /message
// 유저 정보 및 마이페이지 /profile/:userId
