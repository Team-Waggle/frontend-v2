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

// Pages
import RouteErrorPage from './pages/RouteErrorPage';
import MainPage from './pages/MainPage';
import TeamFormPage from './pages/TeamFormPage';
import TeamHomePage from './pages/TeamHomePage';
import TeamPostManagementPage from './pages/TeamPostManagementPage';
import TeamApplicantPage from './pages/TeamApplicantPage';
import TeamStatusPage from './pages/TeamStatusPage';
import PostFormPage from './pages/PostFormPage';
import PostDetailPage from './pages/PostDetailPage';
import ProfileRedirect from './components/Profile/ProfileRedirect';
import ProfilePage from './pages/ProfilePage';
import MessagePage from './pages/MessagePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

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
