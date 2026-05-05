import { useState } from 'react';
import { useNavigate } from 'react-router';
import Notifications from '../Notifications';
import { useAuthStore } from '../../stores/authStore';
import LoginModal from '../Modal/LoginModal';
import BaseButton from '../common/Button';
import IconWrapper from '../common/IconWrapper';
import {
  useGetIsUserProfileComplete,
  useGetNotificationsCount,
  useGetUserMe,
  useGetUserMeTeam,
} from '../../hooks/useUser';
import { useModal } from '../../hooks/useModal';

// Sidebar Components
import SidebarLogo from './SidebarLogo';
import SidebarProfile from './SidebarProfile';
import SidebarMenu from './SidebarMenu';

// Icons
import PencilIcon from '../../assets/icons/normal/ic_pencil.svg?react';
import LogInIcon from '../../assets/icons/normal/ic_login.svg?react';
import LogoIcon from '../../assets/icons/ic_logo.svg?react';

const Sidebar = () => {
  const navigate = useNavigate();
  const { data: isProfileCompleteData } = useGetIsUserProfileComplete();
  const { data: myData } = useGetUserMe();
  const { data: myteamData } = useGetUserMeTeam();
  const { data: notificationCountData } = useGetNotificationsCount();

  const [isFolded, setIsFolded] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = !!accessToken;

  const isProfileComplete =
    isLoggedIn && isProfileCompleteData?.isComplete === true;

  useModal({
    isOpen: isNotificationOpen,
    onClose: () => setIsNotificationOpen(false),
  });

  return (
    <>
      <aside
        className={`z-50 flex flex-col gap-[1.6rem] border-r border-black-20 bg-black-5 pt-[2.8rem] ${
          isFolded ? 'w-[8.8rem]' : 'w-[29.8rem]'
        }`}
      >
        {/* 로고 */}
        <SidebarLogo
          isFolded={isFolded}
          onToggle={() => setIsFolded(!isFolded)}
        />

        {/* middle content */}
        <div className="flex flex-1 flex-col gap-[1.2rem] px-[2rem]">
          {/* 프로필 및 모집글 작성 버튼 */}
          <div className="flex flex-col gap-[1.8rem] py-[2rem]">
            <SidebarProfile
              data={myData}
              isFolded={isFolded}
              isLoggedIn={isProfileComplete}
              setIsNotificationOpen={setIsNotificationOpen}
            />

            {isFolded ? (
              <IconWrapper
                onClick={() => {
                  if (!isLoggedIn) return setIsLoginModalOpen(true);
                  if (myteamData?.length === 0) navigate('/team/new');
                  else navigate('/post/new');
                }}
              >
                {isLoggedIn ? <PencilIcon /> : <LogInIcon />}
              </IconWrapper>
            ) : isProfileComplete ? (
              myteamData?.length === 0 ? (
                <BaseButton onClick={() => navigate('/team/new')}>
                  새 팀 만들기
                </BaseButton>
              ) : (
                <div className="flex gap-[1.2rem]">
                  <BaseButton
                    color="secondary"
                    onClick={() => navigate('/team/new')}
                    className="w-[12.3rem] whitespace-nowrap"
                  >
                    새 팀 만들기
                  </BaseButton>
                  <BaseButton
                    onClick={() => navigate('/post/new')}
                    className="w-[12.3rem] whitespace-nowrap"
                  >
                    모집글 작성
                  </BaseButton>
                </div>
              )
            ) : (
              <BaseButton
                onClick={() =>
                  isLoggedIn ? navigate('/post/new') : setIsLoginModalOpen(true)
                }
              >
                {isLoggedIn ? '모집글 작성' : '로그인'}
              </BaseButton>
            )}
          </div>

          <SidebarMenu
            isLoggedIn={isProfileComplete}
            setIsLoginModalOpen={() => setIsLoginModalOpen(true)}
            isFolded={isFolded}
            teamData={isProfileComplete ? (myteamData ?? []) : []}
            userId={myData?.userId}
            notificationCountData={notificationCountData}
            isNotificationOpen={isNotificationOpen}
            setIsNotificationOpen={setIsNotificationOpen}
          />
        </div>

        {/* 고객지원 문의 */}
        {!isFolded && (
          <div className="flex h-[17.1rem] flex-col gap-[2.4rem] pb-[2.8rem]">
            <div className="h-[0.1rem] bg-black-10" />
            <div className="flex flex-col gap-[0.8rem] px-[2rem]">
              <div className="flex flex-col gap-[0.4rem]">
                <LogoIcon className="text-black-50" />
                <a
                  href="mailto:team.waggle.offcial@gmaill.com"
                  className="text-[1.4rem] font-normal text-black-60"
                >
                  team.waggle.offcial@gmaill.com
                </a>
              </div>
              <div className="flex flex-col gap-[0.2rem] text-[1.4rem] font-medium text-black-60">
                <a
                  href="https://satin-mint-d68.notion.site/a5520f189e0d4386ab7288f9425d53e6"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  고객지원/문의
                </a>
                <a
                  href="https://satin-mint-d68.notion.site/34738daa31cd80af8a40cfab76a855d0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  와글 정책 안내
                </a>
              </div>
              <span className="text-[1.4rem] font-normal text-black-60">
                © 2026 Waggle Inc. All rights reserved.
              </span>
            </div>
          </div>
        )}
      </aside>
      {isNotificationOpen && (
        <Notifications
          isFolded={isFolded}
          onClose={() => setIsNotificationOpen(false)}
          notificationCountData={notificationCountData}
        />
      )}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default Sidebar;
