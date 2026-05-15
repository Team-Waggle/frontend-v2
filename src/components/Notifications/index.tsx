import { useNavigate } from 'react-router';
import BaseButton from '../common/Button';
import {
  useGetNotifications,
  usePatchNotificationsRead,
  usePatchNotificationsReadAll,
} from '../../hooks/useUser';
import type {
  NotificationResponse,
  NotificationType,
} from '../../types/api/team';
import { POSITION_CONVERTER } from '../../utils/position';
import { formatPostListCreatedAt } from '../../utils/kst-time';

// Icons
import CloseIcon from '../../assets/icons/normal/ic_close.svg?react';
import CheckIcon from '../../assets/icons/normal/ic_check.svg?react';
import DocumentIcon from '../../assets/icons/normal/ic_document.svg?react';
import CicleCheckIcon from '../../assets/icons/normal/ic_circleCheck.svg?react';
import PersonsPlusIcon from '../../assets/icons/normal/ic_personsPlus.svg?react';
import ReviewIcon from '../../assets/icons/normal/ic_review.svg?react';
import NoNotificaitionIcon from '../../assets/icons/ic_character_main_page.svg?react';

type NotificationConfig = {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  getMessage: (data: NotificationResponse) => string;
  getRoute: (data: NotificationResponse) => string;
};

const NOTIFICATION_CONFIG: Record<NotificationType, NotificationConfig> = {
  APPLICATION_RECEIVED: {
    Icon: DocumentIcon,
    title: '지원서가 도착했어요',
    getMessage: (data) =>
      `${data?.metadata.triggeredBy.username}님이 ${data?.metadata.team.name}의
    ${data?.metadata.post.title}/${POSITION_CONVERTER[data?.metadata.position]}에 지원했어요. 지원서를 확인해 주세요.`,
    getRoute: (data) =>
      `/team/${data?.metadata.team.id}/applicants?postId=${data?.metadata.post.id}`,
  },
  APPLICATION_REJECTED: {
    Icon: CicleCheckIcon,
    title: '지원 결과 안내',
    getMessage: () =>
      '아쉽게도 이번 지원은 승인되지 않았어요. 다른 팀에도 지원해 보세요.',
    getRoute: () => '/',
  },
  APPLICATION_REMIND: {
    Icon: DocumentIcon,
    title: '아직 확인하지 않은 지원서가 있어요',
    getMessage: (data) =>
      `${data?.metadata.team.name}에 확인이 필요한 지원서가 ${data?.metadata.unreadApplicationCount}건 있어요.`,
    getRoute: (data) => `/team/${data?.metadata.team.id}/applicants`,
  },
  TEAM_JOINED: {
    Icon: PersonsPlusIcon,
    title: '팀 합류가 완료됐어요',
    getMessage: (data) =>
      `이제 ${data?.metadata.team.name} 팀원이에요. 팀 공간에서 활동을 시작해 보세요.`,
    getRoute: (data) => `/team/${data?.metadata.team.id}`,
  },
  MEMBER_JOINED: {
    Icon: PersonsPlusIcon,
    title: '팀원 합류',
    getMessage: (data) =>
      `${data?.metadata.triggeredBy.username}님이 ${data?.metadata.team.name}에 합류했습니다. 프로필을 확인해보세요.`,
    getRoute: (data) => `/team/${data?.metadata.team.id}`,
  },
  MEMBER_LEFT: {
    Icon: PersonsPlusIcon,
    title: '팀 상태 변경 안내',
    getMessage: (data) =>
      `${data?.metadata.triggeredBy.username}님이 ${data?.metadata.team.name}에서 나갔어요.`,
    getRoute: (data) => `/team/${data?.metadata.team.id}`,
  },
  MEMBER_REMOVED: {
    Icon: PersonsPlusIcon,
    title: '팀 상태 변경 안내',
    getMessage: (data) => `${data.metadata.team.name}에서 추방됐어요.`,
    getRoute: (data) => `/team/${data.metadata.team.id}`,
  },
  REVIEW_REQUESTED: {
    Icon: ReviewIcon,
    title: '리뷰를 작성해 주세요',
    getMessage: () =>
      '프로젝트가 종료되었어요. 팀원들과의 협업 경험을 평가해 주세요.',
    getRoute: (data) => `/team/${data.metadata.team.id}`,
  },
  REVIEW_RECEIVED: {
    Icon: ReviewIcon,
    title: '리뷰가 도착했어요',
    getMessage: (data) =>
      `${data?.metadata.team.name}에서 익명의와글님이 리뷰를 남겼어요.`,
    getRoute: (data) => `/team/${data.metadata.team.id}`,
  },
};

type NotificationCountDataType = {
  total: number;
  unread: number;
};

interface NotificationsProps {
  isFolded: boolean;
  onClose: () => void;
  notificationCountData: NotificationCountDataType;
}

const Notifications = ({
  isFolded,
  onClose,
  notificationCountData,
}: NotificationsProps) => {
  const navigate = useNavigate();
  const { data: mynotificationsData } = useGetNotifications();
  const { mutate: patchRead } = usePatchNotificationsRead();
  const { mutate: patchReadAll } = usePatchNotificationsReadAll();

  return (
    <>
      <div className="fixed inset-0 z-30 bg-[#12141A40]" onClick={onClose} />
      <div
        className={`fixed top-0 z-40 flex h-full w-[38rem] flex-col bg-black-5 ${
          isFolded ? 'left-[8.8rem]' : 'left-[29.8rem]'
        }`}
      >
        <div className="flex flex-col gap-[1.6rem] px-[2.2rem] pb-[1.6rem] pt-[2.8rem]">
          <div className="flex items-center justify-between">
            <div className="flex gap-[0.8rem] text-[1.6rem] font-bold">
              <span className="text-black-100">전체 알림</span>
              <span className="text-blue-80">
                {notificationCountData?.total}
              </span>
            </div>
            <CloseIcon onClick={onClose} className="cursor-pointer" />
          </div>
          <BaseButton
            color="secondary"
            leftIcon={
              <CheckIcon
                className={
                  notificationCountData?.unread
                    ? 'text-black-80'
                    : 'text-black-40'
                }
              />
            }
            onClick={() => patchReadAll()}
            disabled={!notificationCountData?.unread}
          >
            모두 읽음 처리
          </BaseButton>
        </div>
        {mynotificationsData?.data?.length !== 0 && (
          <div className="flex h-full justify-between overflow-y-scroll pl-[2.2rem] pr-[0.8rem]">
            <div className="flex flex-col gap-[1rem]">
              {mynotificationsData?.data?.map((data) => {
                const config = NOTIFICATION_CONFIG[data.type];
                const Icon = config.Icon;
                return (
                  <div
                    key={data.id}
                    onClick={() => {
                      patchRead([data.id], {
                        onSuccess: () => {
                          const route = config.getRoute?.(data);
                          if (route) navigate(route);
                          onClose();
                        },
                      });
                    }}
                    className="cursor-pointer rounded-[0.8rem] bg-black-5 px-[2.4rem] hover:bg-black-10"
                  >
                    <div className="flex flex-col gap-[1rem] border-b border-black-20 py-[2.4rem]">
                      <div className="flex flex-col gap-[0.8rem]">
                        <div className="flex items-center gap-[0.8rem]">
                          <div className="flex h-[2.4rem] w-[2.4rem] items-center justify-center rounded-[4.569rem] bg-blue-5">
                            <Icon
                              className={`h-[1.6rem] w-[1.6rem] ${data.readAt ? 'text-black-40' : 'text-blue-40'}`}
                            />
                          </div>
                          <div
                            className={`text-[1.4rem] font-semibold ${data.readAt ? 'text-black-40' : 'text-blue-70'}`}
                          >
                            {config.title}
                          </div>
                        </div>
                        <div className="flex items-center gap-[1rem]">
                          <span
                            className={`line-clamp-2 w-[27rem] text-[1.6rem] font-medium ${data.readAt ? 'text-black-40' : 'text-black-100'}`}
                          >
                            {config.getMessage(data)}
                          </span>
                          {!data.readAt && (
                            <div className="h-[0.8rem] w-[0.8rem] rounded-full bg-blue-80" />
                          )}
                        </div>
                      </div>
                      <div className="pr-[0.6rem]">
                        <span
                          className={`text-[1.4rem] font-medium ${data.readAt ? 'text-black-40' : 'text-black-60'}`}
                        >
                          {formatPostListCreatedAt(data.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {mynotificationsData?.data?.length === 0 && (
          <div className="flex h-full flex-col justify-center px-[2.2rem]">
            <div className="flex flex-col items-center gap-[1.8rem]">
              <NoNotificaitionIcon width={55} height={53} />
              <div className="flex w-full flex-col items-center gap-[0.4rem]">
                <span className="text-[1.8rem] font-semibold text-black-90">
                  새로운 알림이 없어요
                </span>
                <span className="text-[1.6rem] font-medium text-black-80">
                  모집글에 지원하면 알림을 받을 수 있어요
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Notifications;
