import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import ForbiddenPage from './ForbiddenPage';
import NotFoundPage from './NotFoundPage';
import UnAuthorizedPage from './UnAuthorizedPage';

const getErrorStatus = (error: unknown) => {
  if (isRouteErrorResponse(error)) {
    return error.status;
  }

  if (error && typeof error === 'object' && 'response' in error) {
    const response = error.response as { status?: number } | undefined;
    return response?.status;
  }

  return undefined;
};

const RouteErrorPage = () => {
  const error = useRouteError();
  const status = getErrorStatus(error);

  if (status === 401) {
    return <UnAuthorizedPage />;
  }

  if (status === 403) {
    return <ForbiddenPage />;
  }

  return <NotFoundPage />;
};

export default RouteErrorPage;
