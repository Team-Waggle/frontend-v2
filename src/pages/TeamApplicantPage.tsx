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
import RefreshIcon from '../assets/icons/normal/ic_refresh.svg?react';

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
      <div className="flex h-full flex-col items-center gap-[6rem] pb-[15.8rem] pt-[5.4rem]">
        <TeamNav />
        <div className="flex w-full max-w-[clamp(98.2rem,70vw,130rem)] justify-between gap-[clamp(5rem,calc(-7.3rem+6.875vw),6.2rem)] max-sm:flex-col max-sm:gap-[3.2rem]">
          {/* 프로젝트 목록 */}
          <div className="flex flex-col gap-[1rem] max-sm:gap-0 max-sm:px-[2rem]">
            <div className="flex justify-between py-[0.4rem] pl-[1.1rem] max-sm:pb-[1.1rem] max-sm:pt-0">
              <span className="text-[1.6rem] font-bold">작성 글 목록</span>
              <BaseButton
                size="sm"
                color="secondary"
                rightIcon={<RefreshIcon className="h-[1.6rem] w-[1.6rem]" />}
                onClick={() => {
                  setSearchParams(undefined);
                  setExpandedAppIds(new Set());
                }}
                className="hidden max-sm:flex"
              >
                지원자 전체 보기
              </BaseButton>
            </div>
            <div className="flex h-[71.2rem] w-[36.3rem] flex-col overflow-y-scroll rounded-[0.8rem] border border-black-20 p-[1rem] scrollbar-hide max-1440:w-[25.6rem] max-sm:h-[12.6rem] max-sm:w-full max-sm:flex-row max-sm:gap-[0.8rem] max-sm:overflow-y-hidden max-sm:overflow-x-scroll max-sm:border-0 max-sm:p-0">
              {!postData || postData.length === 0 ? (
                <div className="flex h-[8.2rem] cursor-pointer items-center border-b border-black-20 py-[1.8rem] pl-[1.1rem] text-[1.5rem] font-medium text-black-100 hover:bg-black-10 max-sm:h-[12.6rem] max-sm:w-[29rem] max-sm:rounded-[0.8rem] max-sm:border">
                  등록된 모집글이 없어요.
                </div>
              ) : (
                postData?.map((data) => (
                  <div
                    key={data.id}
                    onClick={() => {
                      setSearchParams((prev) => {
                        const newParams = new URLSearchParams(prev);
                        newParams.set('postId', String(data.id));
                        newParams.delete('applicationId');
                        return newParams;
                      });
                      setExpandedAppIds(new Set());
                    }}
                    className="flex h-[8.2rem] min-w-[23.6rem] max-w-[34.3rem] cursor-pointer items-center gap-[1.6rem] border-b border-black-20 py-[1.8rem] pl-[1.1rem] hover:bg-black-10 max-sm:h-[12.6rem] max-sm:w-[29rem] max-sm:shrink-0 max-sm:rounded-[0.8rem] max-sm:border max-sm:py-[2.8rem] max-sm:pl-[1.1rem] max-sm:pr-[2rem]"
                  >
                    <div className="line-clamp-2 w-[30.8rem] text-[1.5rem] font-medium text-black-100 max-1440:w-[20.1rem] max-sm:w-[23.5rem]">
                      {data.title}
                    </div>
                    {hasUnreadApplicantByPost(data.id) && (
                      <div className="h-[0.8rem] w-[0.8rem] shrink-0 rounded-full bg-blue-80" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          {/* 지원자 목록 */}
          <div className="flex w-full flex-col gap-[1rem] max-sm:gap-0">
            <div className="flex items-center justify-between py-[0.4rem] pl-[1.1rem] max-sm:py-[1.2rem] max-sm:pl-[3.1rem]">
              <span className="text-[1.6rem] font-bold">
                총{' '}
                {applicantData?.pages.reduce(
                  (acc, page) => acc + page.data.length,
                  0,
                )}
                명의 지원자
              </span>
              <BaseButton
                size="sm"
                color="secondary"
                rightIcon={<RefreshIcon className="h-[1.6rem] w-[1.6rem]" />}
                onClick={() => {
                  setSearchParams(undefined);
                  setExpandedAppIds(new Set());
                }}
                className="flex max-sm:hidden"
              >
                지원자 전체 보기
              </BaseButton>
            </div>

            {/* 1440 이상 */}
            <div className="flex h-[70.4rem] w-full flex-col overflow-y-auto rounded-[0.8rem] py-[1rem] shadow-applicants-card max-sm:hidden max-sm:h-full max-sm:px-[1.4rem] max-sm:py-[0.8rem]">
              {!applicantData ||
              applicantData.pages.every((page) => page.data.length === 0) ? (
                <div className="my-auto flex flex-col items-center gap-[1.8rem]">
                  <NoApplicantIcon />
                  <div className="flex flex-col items-center gap-[0.8rem]">
                    <span className="text-[2rem] font-semibold text-black-90">
                      지원한 동료가 아직 없어요.
                    </span>
                    <span className="text-center text-[1.6rem] font-medium text-black-80">
                      우리 팀에 딱 맞는 동료를 기다리고 있어요.
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
                    const isExpanded = expandedAppIds.has(applicant.id);

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
                                      navigate(`/profile/${applicant.user.id}`)
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
                                      navigate(`/message/${applicant.user.id}`)
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
                                  {(
                                    applicant?.user.temperature ?? 36.5
                                  ).toFixed(1)}
                                  °
                                </BaseTag>
                              </div>
                              <span
                                className={`whitespace-nowrap text-[1.5rem] font-semibold ${
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
                                      setSelectedApplicantId(applicant.id);
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
                                      setSelectedApplicantId(applicant.id);
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
                                  className={`h-[1.6rem] w-[1.6rem] text-black-50 transition-transform ${
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
                          <div className="flex flex-col gap-[1.2rem] pb-[2rem]">
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
                                  className="truncate text-[1.3rem] font-medium text-blue-60"
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
                <div className="relative flex h-full flex-col items-center justify-end max-sm:hidden">
                  <ApplicantIcon className="absolute bottom-[2.269rem] w-full" />
                  <div className="h-[3.2rem] w-full bg-black-30" />
                </div>
              )}
            </div>
            {/* max-sm 이하 사이즈 */}
            <div className="hidden max-sm:block max-sm:px-[2rem] max-sm:pb-[3.2rem]">
              <div className="flex h-[70.4rem] w-full flex-col overflow-y-auto rounded-[0.8rem] py-[1rem] shadow-applicants-card max-sm:h-[54.4rem] max-sm:px-[1.4rem] max-sm:py-[0.8rem]">
                {!applicantData ||
                applicantData.pages.every((page) => page.data.length === 0) ? (
                  <div className="my-auto flex flex-col items-center gap-[1.8rem]">
                    <NoApplicantIcon className="h-[5.175rem] w-[5.55rem]" />
                    <div className="flex flex-col items-center gap-[0.8rem]">
                      <span className="text-[2rem] font-semibold text-black-90 max-sm:text-[1.8rem]">
                        지원한 동료가 아직 없어요.
                      </span>
                      <span className="text-center text-[1.6rem] font-medium text-black-80 max-sm:text-[1.4rem]">
                        우리 팀에 딱 맞는 동료를 기다리고 있어요.
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
                      const isExpanded = expandedAppIds.has(applicant.id);

                      return (
                        <>
                          {/* sm 사이즈 */}
                          <div
                            key={applicant.id}
                            className="flex flex-col gap-[2.4rem] py-[1.6rem] max-xs:hidden"
                          >
                            <div className="flex items-center justify-between">
                              {/* 유저 정보 */}
                              <div className="flex items-center gap-[2.4rem]">
                                <div className="flex items-center gap-[1.4rem]">
                                  <div className="flex w-[15rem] items-center justify-between">
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
                                        className={`w-[7.5rem] truncate text-[1.6rem] font-semibold ${
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
                                    {(
                                      applicant?.user.temperature ?? 36.5
                                    ).toFixed(1)}
                                    °
                                  </BaseTag>
                                </div>
                                <span
                                  className={`whitespace-nowrap text-[1.5rem] font-semibold ${
                                    applicant.status !== 'PENDING'
                                      ? 'text-black-40'
                                      : 'text-black-90'
                                  }`}
                                >
                                  {POSITION_CONVERTER[applicant?.position]}
                                </span>
                              </div>
                              <span
                                className={`w-[8rem] text-[1.3rem] font-medium ${
                                  applicant.status !== 'PENDING'
                                    ? 'text-black-40'
                                    : 'text-black-60'
                                }`}
                              >
                                {formatKstYyyyMmDd(applicant?.createdAt ?? '')}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-[2rem]">
                              <div className="flex gap-[0.8rem]">
                                <BaseButton
                                  size="sm"
                                  color="tertiary"
                                  disabled={applicant.status !== 'PENDING'}
                                  onClick={() => {
                                    setSelectedApplicantId(applicant.id);
                                    setIsApproveModalOpen(true);
                                  }}
                                  className="w-[10rem] whitespace-nowrap"
                                >
                                  승인
                                </BaseButton>
                                <BaseButton
                                  size="sm"
                                  color="secondary"
                                  disabled={applicant.status !== 'PENDING'}
                                  onClick={() => {
                                    setSelectedApplicantId(applicant.id);
                                    setIsRejectModalOpen(true);
                                  }}
                                  className="w-[10rem] whitespace-nowrap"
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
                                className={`h-[1.6rem] w-[1.6rem] text-black-50 transition-transform ${
                                  canExpandApplicant || !applicant.read
                                    ? 'cursor-pointer'
                                    : 'cursor-default'
                                } ${isExpanded ? 'rotate-180' : ''}`}
                              />
                            </div>
                            {isExpanded && (
                              <div className="flex flex-col gap-[1.2rem] pb-[2rem]">
                                {applicant.detail.trim().length > 0 && (
                                  <div className="text-[1.3rem] font-medium text-black-90">
                                    {applicant.detail}
                                  </div>
                                )}
                                {applicant?.portfolioUrls.length !== 0 && (
                                  <div className="flex gap-[0.4rem] rounded-[0.6rem] bg-blue-5 px-[0.8rem] py-[1rem]">
                                    <div className="flex items-center gap-[0.2rem]">
                                      <LinkIcon className="h-[1.2rem] w-[1.2rem]" />
                                      <span className="whitespace-nowrap text-[1.3rem] font-medium text-black-90">
                                        첨부링크:
                                      </span>
                                    </div>
                                    <a
                                      href={applicant?.portfolioUrls[0]}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="truncate text-[1.3rem] font-medium text-blue-60"
                                    >
                                      {applicant?.portfolioUrls[0]}
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* xs 사이즈 */}
                          <div
                            key={applicant.id}
                            className="hidden flex-col gap-[1.2rem] py-[1.6rem] max-xs:flex"
                          >
                            <div className="flex items-center justify-between">
                              {/* 유저 정보 */}
                              <div className="flex items-center gap-[1.4rem]">
                                <div className="flex w-[15rem] items-center justify-between">
                                  <div
                                    onClick={() =>
                                      navigate(`/profile/${applicant.user.id}`)
                                    }
                                    className="flex cursor-pointer gap-[0.7rem]"
                                  >
                                    <CharacterIcon className="-scale-x-100" />
                                    <span
                                      className={`w-[7.5rem] truncate text-[1.6rem] font-semibold ${
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
                                      navigate(`/message/${applicant.user.id}`)
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
                                  {(
                                    applicant?.user.temperature ?? 36.5
                                  ).toFixed(1)}
                                  °
                                </BaseTag>
                              </div>
                              <span
                                className={`whitespace-nowrap text-[1.5rem] font-semibold ${
                                  applicant.status !== 'PENDING'
                                    ? 'text-black-40'
                                    : 'text-black-90'
                                }`}
                              >
                                {POSITION_CONVERTER[applicant?.position]}
                              </span>
                            </div>
                            <span
                              className={`w-[8rem] text-[1.3rem] font-medium ${
                                applicant.status !== 'PENDING'
                                  ? 'text-black-40'
                                  : 'text-black-60'
                              }`}
                            >
                              {formatKstYyyyMmDd(applicant?.createdAt ?? '')}
                            </span>
                            <div className="flex items-center justify-between gap-[2rem]">
                              <div className="flex gap-[0.8rem]">
                                <BaseButton
                                  size="sm"
                                  color="tertiary"
                                  disabled={applicant.status !== 'PENDING'}
                                  onClick={() => {
                                    setSelectedApplicantId(applicant.id);
                                    setIsApproveModalOpen(true);
                                  }}
                                  className="w-[10rem] whitespace-nowrap"
                                >
                                  승인
                                </BaseButton>
                                <BaseButton
                                  size="sm"
                                  color="secondary"
                                  disabled={applicant.status !== 'PENDING'}
                                  onClick={() => {
                                    setSelectedApplicantId(applicant.id);
                                    setIsRejectModalOpen(true);
                                  }}
                                  className="w-[10rem] whitespace-nowrap"
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
                                className={`h-[1.6rem] w-[1.6rem] text-black-50 transition-transform ${
                                  canExpandApplicant || !applicant.read
                                    ? 'cursor-pointer'
                                    : 'cursor-default'
                                } ${isExpanded ? 'rotate-180' : ''}`}
                              />
                            </div>
                            {isExpanded && (
                              <div className="flex flex-col gap-[1.2rem] pb-[2rem]">
                                {applicant.detail.trim().length > 0 && (
                                  <div className="text-[1.3rem] font-medium text-black-90">
                                    {applicant.detail}
                                  </div>
                                )}
                                {applicant?.portfolioUrls.length !== 0 && (
                                  <div className="flex gap-[0.4rem] rounded-[0.6rem] bg-blue-5 px-[0.8rem] py-[1rem]">
                                    <div className="flex items-center gap-[0.2rem]">
                                      <LinkIcon className="h-[1.2rem] w-[1.2rem]" />
                                      <span className="whitespace-nowrap text-[1.3rem] font-medium text-black-90">
                                        첨부링크:
                                      </span>
                                    </div>
                                    <a
                                      href={applicant?.portfolioUrls[0]}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="truncate text-[1.3rem] font-medium text-blue-60"
                                    >
                                      {applicant?.portfolioUrls[0]}
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </>
                      );
                    }),
                  )
                )}
                {totalApplicants !== 0 && totalApplicants <= 4 && (
                  <div className="relative flex h-full flex-col items-center justify-end max-sm:hidden">
                    <ApplicantIcon className="absolute bottom-[2.269rem] w-full" />
                    <div className="h-[3.2rem] w-full bg-black-30" />
                  </div>
                )}
              </div>
            </div>
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
