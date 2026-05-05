import { useState } from 'react';
import { useParams } from 'react-router';
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
  const [selectedPostId, setSelectedPostId] = useState<number | undefined>(
    undefined,
  );
  const [selectedApplicantId, setSelectedApplicantId] = useState<number | null>(
    null,
  );
  const [expandedAppIds, setExpandedAppIds] = useState<Set<number>>(new Set());
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const { teamId } = useParams<{ teamId: string }>();
  const numericTeamId = Number(teamId);
  const { data: postData } = useGetTeamPosts(Number(teamId));
  const { data: applicantData } = useGetTeamApplications({
    teamId: numericTeamId,
    postId: selectedPostId,
    size: 9,
  });

  const { mutate: markAsRead } = usePostTeamApplicationRead();
  const { mutate: decideApplicant } = usePatchTeamApplicationStatus();

  const totalApplicants =
    applicantData?.pages.reduce((acc, page) => acc + page.data.length, 0) ?? 0;

  const hasUnreadApplicantByPost = (postId: number) =>
    applicantData?.pages.some((page) =>
      page.data.some(
        (applicant) => applicant.postId === postId && !applicant.isRead,
      ),
    );

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
          queryClient.invalidateQueries({
            queryKey: ['my-notifications-count'],
          });
          onClose();
        },
      },
    );
  };

  return (
    <>
      <div className="@container flex h-screen flex-col items-center gap-[6rem] overflow-hidden px-[2rem] pt-[5.4rem]">
        <TeamNav />
        <div className="grid w-full min-h-0 max-w-[clamp(98.2rem,70vw,130rem)] flex-1 grid-cols-1 grid-rows-[20rem_1fr] gap-[2rem] pb-[4rem] @[80rem]:grid-cols-[36.3rem_1fr] @[80rem]:grid-rows-1 @[80rem]:gap-[clamp(5rem,calc(-7.3rem+6.875vw),6.2rem)]">
          {/* 프로젝트 목록 */}
          <div className="h-full min-h-0 w-full overflow-x-hidden overflow-y-auto rounded-[0.8rem] border border-black-20 p-[1rem]">
            <div
              onClick={() => {
                setSelectedPostId(undefined);
              }}
              className="h-[5.9rem] w-full cursor-pointer py-[1.8rem] pl-[1.1rem]"
            >
              <span className="text-[1.5rem] font-semibold text-blue-70">
                지원자 전체 보기
              </span>
            </div>
            {!postData || postData.length === 0 ? (
              <div className="flex h-[8.2rem] cursor-pointer items-center py-[1.8rem] pl-[1.1rem] text-[1.5rem] font-medium text-black-100 hover:bg-black-10">
                등록된 모집글이 없습니다.
              </div>
            ) : (
              postData?.map((data) => (
                <div
                  key={data.postId}
                  onClick={() => {
                    setSelectedPostId(data?.postId);
                  }}
                  className="flex h-[8.2rem] w-full cursor-pointer items-center gap-[1.6rem] border-t border-black-20 py-[1.8rem] pl-[1.1rem] hover:bg-black-10"
                >
                  <div className="line-clamp-2 flex h-[4.6rem] flex-1 items-center text-[1.5rem] font-medium text-black-100">
                    {data.title}
                  </div>
                  {hasUnreadApplicantByPost(data.postId) && (
                    <div className="h-[0.8rem] w-[0.8rem] rounded-full bg-blue-80" />
                  )}
                </div>
              ))
            )}
          </div>
          {/* 지원자 목록 */}
          <div className="@container flex h-full w-full max-w-[87.5rem] flex-1 flex-col overflow-x-hidden overflow-y-auto rounded-[0.8rem] py-[1rem] shadow-applicants-card">
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
                page.data.map((applicant, index) => (
                  <div key={applicant.applicationId} className="px-[2.4rem]">
                    <div
                      className={`${index === 0 ? '' : 'border-t border-black-10'}`}
                    >
                      <div className="flex flex-col gap-[1.2rem] py-[2.2rem] @[60rem]:flex-row @[60rem]:items-center @[60rem]:justify-between @[60rem]:gap-[2rem]">
                        {/* 유저 정보 */}
                        <div className="flex flex-wrap items-center gap-[1.4rem] @[60rem]:gap-[5.5rem]">
                          <div className="flex items-center gap-[1.4rem]">
                            <div className="flex items-center gap-[0.5rem]">
                              <div className="flex items-center gap-[0.7rem]">
                                <CharacterIcon className="-scale-x-100 shrink-0" />
                                <span
                                  className={`text-[1.6rem] font-semibold @[60rem]:w-[11.6rem] ${
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
                              className={`${
                                applicant.status !== 'PENDING'
                                  ? 'bg-black-20 text-black-40'
                                  : 'bg-black-10 text-black-100'
                              }`}
                            >
                              {applicant?.user.temperature}°
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
                        <div className="flex items-center justify-between gap-[2rem] @[60rem]:justify-start @[60rem]:gap-[4.2rem]">
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
                                    applicant.applicationId,
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
                                    applicant.applicationId,
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
                                const isOpening = !expandedAppIds.has(
                                  applicant.applicationId,
                                );

                                setExpandedAppIds((prev) => {
                                  const next = new Set(prev);
                                  if (next.has(applicant.applicationId)) {
                                    next.delete(applicant.applicationId);
                                  } else {
                                    next.add(applicant.applicationId);
                                  }
                                  return next;
                                });

                                if (isOpening && !applicant.isRead) {
                                  markAsRead(applicant.applicationId);
                                }
                              }}
                              className={`cursor-pointer text-black-50 transition-transform ${
                                expandedAppIds.has(applicant.applicationId)
                                  ? 'rotate-180'
                                  : ''
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {expandedAppIds.has(applicant.applicationId) && (
                      <div className="flex flex-col gap-[1.2rem] px-[2.4rem] pb-[2rem]">
                        <div className="text-[1.3rem] font-medium text-black-90">
                          {applicant?.detail}
                        </div>
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
                )),
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
