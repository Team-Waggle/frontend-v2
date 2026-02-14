import { Link } from 'react-router';
import { useState } from 'react';
import BaseButton from '../common/BaseButton';
import LoginModal from '../Modal/LoginModal';

// Sidebar Components
import SidebarLogo from './SidebarLogo';
import SidebarProfile from './SidebarProfile';
import SidebarMenu from './SidebarMenu';

// Icons
import PersonPlusIcon from '../../assets/icons/normal/ic_personPlus.svg?react';
import LogInIcon from '../../assets/icons/normal/ic_login.svg?react';
import LogoIcon from '../../assets/icons/ic_logo.svg?react';

const Sidebar = () => {
  const [isFolded, setIsFolded] = useState(false);
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [isLogInModalOpen, setIsLogInModalOpen] = useState(false);

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
        />

        {/* middle content */}
        <div className="flex flex-1 flex-col gap-[1.2rem] px-[2rem]">
          {/* 프로필 및 모집글 작성 버튼 */}
          <div
            className={`flex flex-col ${
              isLoggedin ? 'gap-[1.8rem] py-[2rem]' : 'gap-[1rem] py-[2rem]'
            } `}
          >
            <SidebarProfile isFolded={isFolded} isLoggedIn={isLoggedin} />

            {isFolded ? (
              <button className="flex h-[4.4rem] w-[4.4rem] items-center justify-center rounded-[0.8rem] bg-blue-80 hover:bg-[#0057d9]">
                {isLoggedin ? (
                  <PersonPlusIcon className="text-black-5" />
                ) : (
                  <LogInIcon
                    onClick={() => setIsLogInModalOpen(true)}
                    className="text-black-5"
                  />
                )}
              </button>
            ) : isLoggedin ? (
              <Link
                to="/team/new"
                className="flex h-[4.4rem] w-full items-center justify-center rounded-[0.8rem] bg-blue-80 px-[3.7rem] py-[1.2rem] text-[1.8rem] font-bold text-white"
              >
                팀 만들기
              </Link>
            ) : (
              <BaseButton onClick={() => setIsLogInModalOpen(true)}>
                로그인
              </BaseButton>
            )}

            {/* 팀 만들기 & 모집글 작성 사이드 바 접을 때 버튼 정하기 */}

            {/* <div className="flex w-[25.8rem] gap-[1.2rem]">
              <button className="flex h-[4.4rem] w-[12.3rem] items-center justify-center whitespace-nowrap rounded-[0.8rem] border border-solid border-black-30 px-[4rem] py-[1.2rem] text-[1.6rem] font-semibold text-black-100 hover:bg-hover-5">
                팀 만들기
              </button>
              <button className="flex h-[4.4rem] w-[12.3rem] items-center justify-center whitespace-nowrap rounded-[0.8rem] bg-blue-80 px-[4rem] py-[1.2rem] text-[1.6rem] font-bold text-black-5 hover:bg-hover-80">
                모집글 작성
              </button>
            </div> */}
          </div>

          <SidebarMenu isFolded={isFolded} />
        </div>

        {/* 로그아웃 및 고객지원 문의 */}
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
                <span>고객지원/문의</span>
                <span>서비스 이용약관</span>
                <span>개인정보 취급 방침</span>
              </div>
            </div>
          </div>
        )}
      </aside>
      <LoginModal
        isOpen={isLogInModalOpen}
        onClose={() => setIsLogInModalOpen(false)}
      />
    </>
  );
};

export default Sidebar;
