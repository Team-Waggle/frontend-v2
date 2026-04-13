import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import LoginModal from '../Modal/LoginModal';
import BaseButton from '../common/Button';
import IconWrapper from '../common/IconWrapper';
import {
  useGetIsUserProfileComplete,
  useGetUserMe,
  useGetUserMeTeam,
} from '../../hooks/useUser';

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

  const breakpoint = useBreakpoint();
  const isDesktop = breakpoint === 'desktop';

  const [isFolded, setIsFolded] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // 모바일/태블릿에서는 항상 접힌 상태 유지
  useEffect(() => {
    if (!isDesktop) setIsFolded(true);
  }, [isDesktop]);

  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = !!accessToken;

  const isProfileComplete = isLoggedIn && isProfileCompleteData?.isComplete;

  return (
    <>
      <aside
        className={`flex flex-col gap-[1.6rem] border-r border-black-20 bg-black-5 pt-[2.8rem] ${
          isFolded ? 'w-[8.8rem]' : 'w-[29.8rem]'
        }`}
      >
        {/* 로고 */}
        <SidebarLogo
          isFolded={isFolded}
          onToggle={() => setIsFolded(!isFolded)}
          showToggle={isDesktop}
        />

        {/* middle content */}
        <div className="flex flex-1 flex-col gap-[1.2rem] px-[2rem]">
          {/* 프로필 및 모집글 작성 버튼 */}
          <div className="flex flex-col gap-[1.8rem] py-[2rem]">
            <SidebarProfile
              data={myData}
              isFolded={isFolded}
              isLoggedIn={isProfileComplete}
            />

            {isFolded ? (
              <IconWrapper
                onClick={() => {
                  if (!isLoggedIn) setIsLoginModalOpen(true);
                  navigate('/post/new');
                }}
              >
                {isLoggedIn ? <PencilIcon /> : <LogInIcon />}
              </IconWrapper>
            ) : isProfileComplete ? (
              myteamData?.length === 0 ? (
                <BaseButton onClick={() => navigate('/team/new')}>
                  새 팀 만들기
                </BaseButton>
              ) : myteamData && myteamData?.length >= 1 ? (
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
              ) : (
                <BaseButton onClick={() => navigate('/post/new')}>
                  모집글 작성
                </BaseButton>
              )
            ) : (
              <BaseButton onClick={() => setIsLoginModalOpen(true)}>
                로그인
              </BaseButton>
            )}
          </div>

          <SidebarMenu
            isLoggedIn={isProfileComplete}
            setIsLoginModalOpen={() => setIsLoginModalOpen(true)}
            isFolded={isFolded}
            teamData={isProfileComplete ? (myteamData ?? []) : []}
            userId={myData?.userId}
          />
        </div>

        {/* 고객지원 문의 */}
        {!isFolded && (
          <div className="flex h-[17.1rem] flex-col gap-[2.4rem] pb-[2.8rem]">
            <div className="h-[0.1rem] bg-black-10" />
            <div className="flex flex-col gap-[0.8rem] px-[2rem]">
              <div className="flex flex-col gap-[0.4rem]">
                <LogoIcon className="text-black-50" />
                <span className="text-[1.4rem] font-normal text-black-60">
                  waggle.offcial@gmaill.com
                </span>
              </div>
              <div className="flex flex-col gap-[0.2rem] text-[1.4rem] font-medium text-black-60">
                <a
                  href="https://satin-mint-d68.notion.site/a5520f189e0d4386ab7288f9425d53e6"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  고객지원/문의
                </a>
                <span>서비스 이용약관</span>
                <span>개인정보 취급 방침</span>
              </div>
            </div>
          </div>
        )}
      </aside>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default Sidebar;
