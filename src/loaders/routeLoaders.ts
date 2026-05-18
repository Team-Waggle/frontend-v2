import { redirect, type LoaderFunctionArgs } from 'react-router-dom';
import { postRefresh } from '../api/auth';
import { getPostDetail } from '../api/post';
import { GetTeamDetail } from '../api/team';
import { getUserDetail, getUserMe, getUserMeTeam } from '../api/user';
import { useAuthStore } from '../stores/authStore';
import type { TeamResponse } from '../types/api/team';
import { isAccessTokenExpired } from '../utils/authToken';

type RouteLoader = (args: LoaderFunctionArgs) => Promise<unknown> | unknown;

const notFoundResponse = (): never => {
  throw new Response(null, { status: 404 });
};

const unAuthorizedResponse = (): never => {
  throw new Response(null, { status: 401 });
};

const forbiddenResponse = (): never => {
  throw new Response(null, { status: 403 });
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

const validateWritableTeam = async (teamId: number): Promise<TeamResponse> => {
  const myTeams = await getUserMeTeam();
  const team = myTeams.find((myTeam) => myTeam.id === teamId);

  if (!team) {
    return forbiddenResponse();
  }

  if (team.role === 'MEMBER') {
    return forbiddenResponse();
  }

  return team;
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

export const postCreateLoader = async () => {
  await requireAuthLoader();

  const myTeams = await getUserMeTeam();
  const hasWritableTeam = myTeams.some(
    (team) => team.role !== 'MEMBER' && team.status !== 'COMPLETED',
  );

  if (!hasWritableTeam) {
    forbiddenResponse();
  }

  return null;
};

export const postEditLoader = async ({ params }: LoaderFunctionArgs) => {
  const postId = parsePositiveIntegerParam(params.postId);

  const post = await getPostDetail(postId).catch((error) => {
    if (isNotFoundError(error)) {
      notFoundResponse();
    }

    throw error;
  });

  await requireAuthLoader();

  const team = await validateWritableTeam(post.team.id);

  if (team.status === 'COMPLETED') {
    forbiddenResponse();
  }

  return null;
};

export const teamManageLoader = async ({ params }: LoaderFunctionArgs) => {
  const teamId = parsePositiveIntegerParam(params.teamId);

  await validateEntity(() => GetTeamDetail(teamId));
  await requireAuthLoader();
  await validateWritableTeam(teamId);

  return null;
};

export const userLoader = ({ params }: LoaderFunctionArgs) => {
  const userId = parseRequiredStringParam(params.userId);

  return validateEntity(() => getUserDetail(userId));
};

export const partnerLoader = async ({ params }: LoaderFunctionArgs) => {
  const partnerId = parseRequiredStringParam(params.partnerId);
  const me = await getUserMe();

  if (partnerId === me.id) {
    return redirect('/message');
  }

  return validateEntity(() => getUserDetail(partnerId));
};
