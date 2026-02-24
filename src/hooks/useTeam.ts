import { useMutation } from '@tanstack/react-query';
import { PostTeamImage } from '../api/team';

export const useCreateTeamImage = () => {
  return useMutation({
    mutationFn: (contentType: string) => PostTeamImage(contentType),
  });
};
