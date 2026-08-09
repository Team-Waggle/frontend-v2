import { lazy } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import './styles/global.css';
import App from './App';
import {
  partnerLoader,
  postCreateLoader,
  postEditLoader,
  postLoader,
  teamManageLoader,
  teamLoader,
  userLoader,
  withAuth,
} from './loaders/routeLoaders';

// Pages — 즉시 필요한 페이지만 eager import, 나머지는 방문 시점에 청크 로드
import RouteErrorPage from './pages/RouteErrorPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfileRedirect from './components/Profile/ProfileRedirect';

const MainPage = lazy(() => import('./pages/MainPage'));
const TeamFormPage = lazy(() => import('./pages/TeamFormPage'));
const TeamHomePage = lazy(() => import('./pages/TeamHomePage'));
const TeamPostManagementPage = lazy(
  () => import('./pages/TeamPostManagementPage'),
);
const TeamApplicantPage = lazy(() => import('./pages/TeamApplicantPage'));
const TeamStatusPage = lazy(() => import('./pages/TeamStatusPage'));
const PostFormPage = lazy(() => import('./pages/PostFormPage'));
const PostDetailPage = lazy(() => import('./pages/PostDetailPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const MessagePage = lazy(() => import('./pages/MessagePage'));

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<App />} errorElement={<RouteErrorPage />}>
        <Route path="/" element={<MainPage />} />
        <Route
          path="/team/new"
          element={<TeamFormPage />}
          loader={withAuth()}
        />
        <Route path="/team/:teamId" loader={teamLoader}>
          <Route index element={<TeamHomePage />} />
          <Route
            path="edit"
            element={<TeamFormPage />}
            loader={teamManageLoader}
          />
          <Route
            path="posts"
            element={<TeamPostManagementPage />}
            loader={teamManageLoader}
          />
          <Route
            path="applicants"
            element={<TeamApplicantPage />}
            loader={teamManageLoader}
          />
          <Route
            path="status"
            element={<TeamStatusPage />}
            loader={teamManageLoader}
          />
        </Route>
        <Route
          path="/post/new"
          element={<PostFormPage />}
          loader={postCreateLoader}
        />
        <Route path="/post/:postId" loader={postLoader}>
          <Route index element={<PostDetailPage />} />
          <Route
            path="edit"
            element={<PostFormPage />}
            loader={postEditLoader}
          />
        </Route>
        <Route
          path="/profile"
          element={<ProfileRedirect />}
          loader={withAuth()}
        />
        <Route
          path="/profile/:userId"
          element={<ProfilePage />}
          loader={userLoader}
        />
        <Route
          path="/profile/:userId/applications"
          element={<ProfilePage />}
          loader={userLoader}
        />
        <Route path="/message" element={<MessagePage />} loader={withAuth()} />
        <Route
          path="/message/:partnerId"
          element={<MessagePage />}
          loader={withAuth(partnerLoader)}
        />
      </Route>
      <Route path="/oauth/callback" element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </>,
  ),
);
