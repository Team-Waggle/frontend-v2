import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import './styles/global.css';
import App from './App';
import {
  partnerLoader,
  postLoader,
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
import MyPage from './pages/MyPage';
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
          <Route path="edit" element={<TeamFormPage />} loader={withAuth()} />
          <Route
            path="posts"
            element={<TeamPostManagementPage />}
            loader={withAuth()}
          />
          <Route
            path="applicants"
            element={<TeamApplicantPage />}
            loader={withAuth()}
          />
          <Route
            path="status"
            element={<TeamStatusPage />}
            loader={withAuth()}
          />
        </Route>
        <Route
          path="/post/new"
          element={<PostFormPage />}
          loader={withAuth()}
        />
        <Route path="/post/:postId" loader={postLoader}>
          <Route index element={<PostDetailPage />} />
          <Route path="edit" element={<PostFormPage />} loader={withAuth()} />
        </Route>
        <Route
          path="/profile"
          element={<ProfileRedirect />}
          loader={withAuth()}
        />
        <Route
          path="/profile/:userId"
          element={<MyPage />}
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
