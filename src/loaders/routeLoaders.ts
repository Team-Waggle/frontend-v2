import type { LoaderFunctionArgs } from 'react-router-dom';
import { postRefresh } from '../api/auth';
import { getPostDetail } from '../api/post';
import { GetTeamDetail } from '../api/team';
import { getUserDetail } from '../api/user';
import { useAuthStore } from '../stores/authStore';
import { isAccessTokenExpired } from '../utils/authToken';

type RouteLoader = (args: LoaderFunctionArgs) => Promise<unknown> | unknown;

const notFoundResponse = (): never => {
  throw new Response(null, { status: 404 });
};

const unAuthorizedResponse = (): never => {
  throw new Response(null, { status: 401 });
};

const isNotFoundError = (error: unknown) => {
  if (!error || typeof error !== 'object') {
    return false;
  }

  if ('response' in error) {
    const response = error.response as { status?: number } | undefined;
    return response?.status === 404;
  }

  return false;
};

const parsePositiveIntegerParam = (value: string | undefined) => {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    notFoundResponse();
  }

  return parsedValue;
};

const parseRequiredStringParam = (value: string | undefined) => {
  return value ?? notFoundResponse();
};

const validateEntity = async (request: () => Promise<unknown>) => {
  try {
    await request();
    return null;
  } catch (error) {
    if (isNotFoundError(error)) {
      notFoundResponse();
    }

    throw error;
  }
};

export const requireAuthLoader = async () => {
  const { accessToken, setAccessToken } = useAuthStore.getState();

  if (accessToken && !isAccessTokenExpired(accessToken)) {
    return null;
  }

  try {
    const data = await postRefresh();
    setAccessToken(data.accessToken);
    return null;
  } catch {
    unAuthorizedResponse();
  }
};

export const withAuth = (loader?: RouteLoader) => {
  return async (args: LoaderFunctionArgs) => {
    await requireAuthLoader();

    return loader ? loader(args) : null;
  };
};

export const teamLoader = ({ params }: LoaderFunctionArgs) => {
  const teamId = parsePositiveIntegerParam(params.teamId);

  return validateEntity(() => GetTeamDetail(teamId));
};

export const postLoader = ({ params }: LoaderFunctionArgs) => {
  const postId = parsePositiveIntegerParam(params.postId);

  return validateEntity(() => getPostDetail(postId));
};

export const userLoader = ({ params }: LoaderFunctionArgs) => {
  const userId = parseRequiredStringParam(params.userId);

  return validateEntity(() => getUserDetail(userId));
};

export const partnerLoader = ({ params }: LoaderFunctionArgs) => {
  const partnerId = parseRequiredStringParam(params.partnerId);

  return validateEntity(() => getUserDetail(partnerId));
};
