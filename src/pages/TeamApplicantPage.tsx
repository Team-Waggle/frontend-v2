import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import {
  useGetTeamApplications,
  useGetTeamPosts,
  usePatchTeamApplicationStatus,
  usePostTeamApplicationRead,
} from '../hooks/useTeam';
import TeamNav from '../components/Team/TeamNav';
import IconWrapper from '../components/common/IconWrapper';
import BaseButton from '../components/common/Button';
import BaseTag from '../components/common/Tag';
import ApproveModal from '../components/Modal/ApproveModal';
import RejectModal from '../components/Modal/RejectModal';
import { POSITION_CONVERTER } from '../utils/position';
import { formatKstYyyyMmDd } from '../utils/kst-time';

// Icons
import MessageIcon from '../assets/icons/normal/ic_message.svg?react';
import CharacterIcon from '../assets/icons/image/ic_character_circle_gray_40.svg?react';
import ChevronDownIcon from '../assets/icons/normal/chevron/ic_chevronDown.svg?react';
import LinkIcon from '../assets/icons/normal/ic_link.svg?react';
import ApplicantIcon from '../assets/icons/ic_applicant_waiting.svg?react';
import NoApplicantIcon from '../assets/icons/ic_character_main_page.svg?react';

const TeamApplicantPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedPostId = searchParams.get('postId')
    ? Number(searchParams.get('postId'))
    : undefined;

  const [selectedApplicantId, setSelectedApplicantId] = useState<number | null>(
    null,
  );
  const [expandedAppIds, setExpandedAppIds] = useState<Set<number>>(
    () => new Set(),
  );
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const { teamId } = useParams<{ teamId: string }>();
  const numericTeamId = Number(teamId);
  const shouldFetchAllApplicantsForUnread = selectedPostId !== undefined;

  const { data: postData } = useGetTeamPosts(Number(teamId));
  const { data: applicantData } = useGetTeamApplications({
    teamId: numericTeamId,
    postId: selectedPostId,
    size: 9,
  });
  const {
    data: allApplicantsForUnreadData,
    fetchNextPage: fetchNextUnreadApplicantsPage,
    hasNextPage: hasNextUnreadApplicantsPage,
    isFetchingNextPage: isFetchingNextUnreadApplicantsPage,
  } = useGetTeamApplications(
    {
      teamId: numericTeamId,
      size: 30,
    },
    { enabled: shouldFetchAllApplicantsForUnread },
  );

  const { mutate: markAsRead } = usePostTeamApplicationRead();
  const { mutate: decideApplicant } = usePatchTeamApplicationStatus();

  const totalApplicants =
    applicantData?.pages.reduce((acc, page) => acc + page.data.length, 0) ?? 0;
  const applicantsForUnreadIndicator = shouldFetchAllApplicantsForUnread
    ? allApplicantsForUnreadData
    : applicantData;

  useEffect(() => {
    if (
      !shouldFetchAllApplicantsForUnread ||
      !hasNextUnreadApplicantsPage ||
      isFetchingNextUnreadApplicantsPage
    ) {
      return;
    }

    fetchNextUnreadApplicantsPage();
  }, [
    fetchNextUnreadApplicantsPage,
    hasNextUnreadApplicantsPage,
    isFetchingNextUnreadApplicantsPage,
    shouldFetchAllApplicantsForUnread,
  ]);

  const hasUnreadApplicantByPost = (postId: number) =>
    applicantsForUnreadIndicator?.pages.some((page) =>
      page.data.some(
        (applicant) => applicant.postId === postId && !applicant.read,
      ),
    );

  const hasApplicantContent = (detail: string, portfolioUrls: string[]) =>
    detail.trim().length > 0 ||
    portfolioUrls.some((url) => url.trim().length > 0);

  const handleDecideApplicant = (
    status: 'APPROVED' | 'REJECTED',
    onClose: () => void,
  ) => {
    if (selectedApplicantId === null) return;

    decideApplicant(
      {
        applicantId: selectedApplicantId,
        status,
      },
      {
        onSuccess: () => {
          queryClient.refetchQueries({
            queryKey: ['my-notifications-count'],
          });
          onClose();
        },
      },
    );
  };

  return (
    <>
      <div className="flex flex-col items-center gap-[6rem] pt-[5.4rem]">
        <TeamNav />
        <div className="flex w-full max-w-[clamp(98.2rem,70vw,130rem)] justify-between gap-[clamp(5rem,calc(-7.3rem+6.875vw),6.2rem)]">
          {/* 프로젝트 목록 */}
          <div className="h-full max-h-[40.7rem] min-h-[16.1rem] w-full min-w-[25.6rem] max-w-[36.3rem] rounded-[0.8rem] border border-black-20 p-[1rem]">
            <div
              onClick={() => {
                setSearchParams(undefined);
                setExpandedAppIds(new Set());
              }}
              className="h-[5.9rem] w-full min-w-[23.6rem] max-w-[34.3rem] cursor-pointer py-[1.8rem] pl-[1.1rem]"
            >
              <span className="text-[1.5rem] font-semibold text-blue-70">
                지원자 전체 보기
              </span>
            </div>
            <div className="h-full max-h-[32.8rem] min-h-[8.2rem] overflow-y-auto">
              {!postData || postData.length === 0 ? (
                <div className="flex h-[8.2rem] cursor-pointer items-center py-[1.8rem] pl-[1.1rem] text-[1.5rem] font-medium text-black-100 hover:bg-black-10">
                  등록된 모집글이 없습니다.
                </div>
              ) : (
                postData?.map((data) => (
                  <div
                    key={data.id}
                    onClick={() => {
                      setSearchParams((prev) => {
                        const newParams = new URLSearchParams(prev);
                        newParams.set('postId', String(data.id));
                        newParams.delete('applicationId'); // 같이 초기화 추천
                        return newParams;
                      });
                      setExpandedAppIds(new Set());
                    }}
                    className="flex h-[8.2rem] min-w-[23.6rem] max-w-[34.3rem] cursor-pointer items-center gap-[1.6rem] border-t border-black-20 py-[1.8rem] pl-[1.1rem] hover:bg-black-10"
                  >
                    <div className="line-clamp-2 flex h-[4.6rem] w-[30.8rem] items-center text-[1.5rem] font-medium text-black-100">
                      {data.title}
                    </div>
                    {hasUnreadApplicantByPost(data.id) && (
                      <div className="h-[0.8rem] w-[0.8rem] rounded-full bg-blue-80" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          {/* 지원자 목록 */}
          <div className="flex aspect-[676/544] w-full min-w-[67.6rem] max-w-[87.5rem] flex-col overflow-y-auto rounded-[0.8rem] py-[1rem] shadow-applicants-card">
            {!applicantData ||
            applicantData.pages.every((page) => page.data.length === 0) ? (
              <div className="my-auto flex flex-col items-center gap-[1.8rem]">
                <NoApplicantIcon />
                <div className="flex flex-col items-center gap-[0.8rem]">
                  <span className="text-[2rem] font-semibold text-black-90">
                    지원한 지원자가 없습니다.
                  </span>
                  <span className="whitespace-pre-line text-center text-[1.6rem] font-medium text-black-80">
                    {`우리 팀에 딱 맞는 동료를 기다리고 있어요.\n모집글을 수정하거나 조금 더 기다려볼까요?`}
                  </span>
                </div>
              </div>
            ) : (
              applicantData?.pages.map((page) =>
                page.data.map((applicant, index) => {
                  const canExpandApplicant = hasApplicantContent(
                    applicant.detail,
                    applicant.portfolioUrls,
                  );
                  const isExpanded = expandedAppIds.has(
                    applicant.id,
                  );

                  return (
                    <div key={applicant.id} className="px-[2.4rem]">
                      <div
                        className={`${index === 0 ? '' : 'border-t border-black-10'}`}
                      >
                        <div className="flex justify-between py-[2.2rem]">
                          {/* 유저 정보 */}
                          <div className="flex items-center gap-[5.5rem]">
                            <div className="flex items-center gap-[1.4rem]">
                              <div className="flex items-center gap-[0.5rem]">
                                <div
                                  onClick={() =>
                                    navigate(
                                      `/profile/${applicant.user.id}`,
                                    )
                                  }
                                  className="flex cursor-pointer gap-[0.7rem]"
                                >
                                  <CharacterIcon className="-scale-x-100" />
                                  <span
                                    className={`w-[11.6rem] text-[1.6rem] font-semibold ${
                                      applicant.status !== 'PENDING'
                                        ? 'text-black-40'
                                        : 'text-black-100'
                                    }`}
                                  >
                                    {applicant?.user.username}
                                  </span>
                                </div>
                                <IconWrapper
                                  color="outline"
                                  shape="circle"
                                  onClick={() =>
                                    navigate(
                                      `/message/${applicant.user.id}`,
                                    )
                                  }
                                  className="!h-[2.8rem] !w-[2.8rem]"
                                >
                                  <MessageIcon
                                    className={`h-[1.527rem] w-[1.527rem] ${
                                      applicant.status !== 'PENDING'
                                        ? 'text-black-40'
                                        : 'text-black-80'
                                    }`}
                                  />
                                </IconWrapper>
                              </div>
                              <BaseTag
                                size="xs"
                                shape="circle"
                                color="black80"
                                isInverted
                                className={`!h-[2.4rem] ${
                                  applicant.status !== 'PENDING'
                                    ? 'bg-black-20 text-black-40'
                                    : 'bg-black-10 text-black-100'
                                }`}
                              >
                                {(applicant?.user.temperature ?? 36.5).toFixed(
                                  1,
                                )}
                                °
                              </BaseTag>
                            </div>
                            <span
                              className={`text-[1.5rem] font-semibold ${
                                applicant.status !== 'PENDING'
                                  ? 'text-black-40'
                                  : 'text-black-90'
                              }`}
                            >
                              {POSITION_CONVERTER[applicant?.position]}
                            </span>
                          </div>
                          <div className="flex items-center gap-[4.2rem]">
                            <span
                              className={`text-[1.3rem] font-medium ${
                                applicant.status !== 'PENDING'
                                  ? 'text-black-40'
                                  : 'text-black-60'
                              }`}
                            >
                              {formatKstYyyyMmDd(applicant?.createdAt ?? '')}
                            </span>
                            <div className="flex items-center gap-[2.4rem]">
                              <div className="flex gap-[0.8rem]">
                                <BaseButton
                                  size="sm"
                                  color="tertiary"
                                  disabled={applicant.status !== 'PENDING'}
                                  onClick={() => {
                                    setSelectedApplicantId(
                                      applicant.id,
                                    );
                                    setIsApproveModalOpen(true);
                                  }}
                                  className="w-[5.7rem] whitespace-nowrap"
                                >
                                  승인
                                </BaseButton>
                                <BaseButton
                                  size="sm"
                                  color="secondary"
                                  disabled={applicant.status !== 'PENDING'}
                                  onClick={() => {
                                    setSelectedApplicantId(
                                      applicant.id,
                                    );
                                    setIsRejectModalOpen(true);
                                  }}
                                  className="w-[5.7rem] whitespace-nowrap"
                                >
                                  거절
                                </BaseButton>
                              </div>
                              <ChevronDownIcon
                                onClick={() => {
                                  if (!applicant.read) {
                                    markAsRead(applicant.id);
                                  }

                                  if (!canExpandApplicant) return;

                                  setExpandedAppIds((prev) => {
                                    const next = new Set(prev);

                                    if (next.has(applicant.id)) {
                                      next.delete(applicant.id);
                                    } else {
                                      next.add(applicant.id);
                                    }

                                    return next;
                                  });
                                }}
                                className={`text-black-50 transition-transform ${
                                  canExpandApplicant || !applicant.read
                                    ? 'cursor-pointer'
                                    : 'cursor-default'
                                } ${isExpanded ? 'rotate-180' : ''}`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="flex flex-col gap-[1.2rem] px-[2.4rem] pb-[2rem]">
                          {applicant.detail.trim().length > 0 && (
                            <div className="text-[1.3rem] font-medium text-black-90">
                              {applicant.detail}
                            </div>
                          )}
                          {applicant?.portfolioUrls.length !== 0 && (
                            <div className="flex gap-[0.4rem] rounded-[0.6rem] bg-blue-5 px-[0.8rem] py-[1rem]">
                              <div className="flex items-center gap-[0.2rem]">
                                <LinkIcon className="h-[1.2rem] w-[1.2rem]" />
                                <span className="text-[1.3rem] font-medium text-black-90">
                                  첨부링크:
                                </span>
                              </div>
                              <a
                                href={applicant?.portfolioUrls[0]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[1.3rem] font-medium text-blue-60"
                              >
                                {applicant?.portfolioUrls[0]}
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }),
              )
            )}
            {totalApplicants !== 0 && totalApplicants <= 4 && (
              <div className="max-1440: relative flex h-full flex-col items-center justify-end">
                <ApplicantIcon className="absolute bottom-[2.269rem] w-full" />
                <div className="h-[3.2rem] w-full bg-black-30" />
              </div>
            )}
          </div>
        </div>
      </div>
      <ApproveModal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        handleDone={() =>
          handleDecideApplicant('APPROVED', () => setIsApproveModalOpen(false))
        }
      />
      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        handleDone={() =>
          handleDecideApplicant('REJECTED', () => setIsRejectModalOpen(false))
        }
      />
    </>
  );
};

export default TeamApplicantPage;
