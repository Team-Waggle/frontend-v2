import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getTerms, postTerms } from '../api/terms';
import { useAuthStore } from '../stores/authStore';
import { useOnboardingStore } from '../stores/onboardingStore';

// 약관 목록 조회
export const useGetTerms = (options: { enabled?: boolean } = {}) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ['terms'],
    queryFn: getTerms,
    enabled: !!accessToken && (options.enabled ?? true),
    refetchOnWindowFocus: false,
  });
};

// 약관 동의
export const usePostTerms = () => {
  const queryClient = useQueryClient();
  const setPendingTermsAfterProfileCreation = useOnboardingStore(
    (state) => state.setPendingTermsAfterProfileCreation,
  );
  return useMutation({
    mutationFn: postTerms,
    onSuccess: () => {
      setPendingTermsAfterProfileCreation(false);
      queryClient.invalidateQueries({ queryKey: ['terms'] });
    },
  });
};
