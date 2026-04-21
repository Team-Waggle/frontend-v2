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
import MyPage from './pages/MyPage';
import ProfileRedirect from './components/Profile/ProfileRedirect';
import MessagePage from './pages/MessagePage';
import TeamApplicantPage from './pages/TeamApplicantPage';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<App />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/team/new" element={<TeamNewPage />} />
        <Route path="/team/:teamId">
          <Route index element={<TeamHomePage />} />
          <Route path="posts" element={<TeamPostManagementPage />} />
          <Route path="applicants" element={<TeamApplicantPage />} />
          <Route path="status" element={<TeamStatusPage />} />
        </Route>
        <Route path="/post/new" element={<PostFormPage />} />
        <Route path="/post/:postId" element={<PostDetailPage />} />
        <Route path="/post/:postId/edit" element={<PostFormPage />} />
        <Route path="/profile" element={<ProfileRedirect />} />
        <Route path="/profile/:userId" element={<MyPage />} />
        <Route path="/message" element={<MessagePage />} />
        <Route path="/message/:partnerId" element={<MessagePage />} />
      </Route>
      <Route path="/oauth/callback" element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </>,
  ),
);

// 내팀/모집글 관리 /team/:teamId/posts
// 메시지 /message
