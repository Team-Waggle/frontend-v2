import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';
import UnAuthorizedPage from './UnAuthorizedPage';

const RouteErrorPage = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 401) {
    return <UnAuthorizedPage />;
  }

  return <NotFoundPage />;
};

export default RouteErrorPage;
