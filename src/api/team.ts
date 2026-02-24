import { TEAMS_PRESIGNED_URL } from '../constants/endpoint';
import axiosInstance from './axiosInstance';

export const PostTeamImage = async (contentType: string) => {
  const { data } = await axiosInstance.post(TEAMS_PRESIGNED_URL, {
    contentType: contentType,
  });
  return data;
};
