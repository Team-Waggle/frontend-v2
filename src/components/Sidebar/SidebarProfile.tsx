import { usePostLogout } from '../../hooks/useAuth';
import { POSITION_CONVERTER } from '../../utils/position';
import type { UserMeResponse } from '../../types/api/user';

// Icons
import BaicProfileIcon from '../../assets/icons/ic_profile_basic.svg?react';
import LogoutIcon from '../../assets/icons/normal/ic_logout.svg?react';

const SidebarProfile = ({
  data,
  isFolded,
  isLoggedIn,
  setIsNotificationOpen,
}: {
  data: UserMeResponse;
  isFolded: boolean;
  isLoggedIn: boolean;
  setIsNotificationOpen: (v: boolean) => void;
}) => {
  const { mutate: logout } = usePostLogout();

  const hasToken = !!data;

  const profileImage = data?.profileImageUrl ? (
    <img
      src={data.profileImageUrl}
      alt=""
      className="h-[4.4rem] w-[4.4rem] shrink-0 rounded-[0.6rem] object-cover"
    />
  ) : (
    <BaicProfileIcon className="shrink-0" />
  );

  return (
    <div className="flex items-center">
      {profileImage}
      <div
        className={`overflow-hidden transition-[max-width,opacity,margin-left] duration-sidebar ease-sidebar ${
          isFolded
            ? 'ml-0 max-w-0 opacity-0'
            : 'ml-[1rem] max-w-[15.2rem] opacity-100'
        }`}
      >
        <div className="flex w-[15.2rem] flex-col justify-center">
          <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[1.6rem] font-semibold text-black-100">
            {hasToken ? data?.username || '게스트' : '게스트'}
          </span>
          <span
            className={`h-[2rem] whitespace-nowrap text-[1.3rem] font-medium ${isLoggedIn ? 'text-black-60' : 'text-blue-60'}`}
          >
            {isLoggedIn && data?.position
              ? POSITION_CONVERTER[data?.position]
              : hasToken
                ? '프로필을 완성해주세요'
                : '로그인해주세요'}
          </span>
        </div>
      </div>
      {isLoggedIn && (
        <button
          onClick={() => {
            setIsNotificationOpen(false);
            logout();
          }}
          className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full transition-[max-width,opacity] duration-sidebar ease-sidebar hover:bg-black-10 ${
            isFolded
              ? 'max-w-0 opacity-0'
              : 'max-w-[3.6rem] px-[0.8rem] py-[0.8rem] opacity-100'
          } h-[3.6rem]`}
        >
          <LogoutIcon className="h-[2rem] w-[2rem] shrink-0 text-black-40" />
        </button>
      )}
    </div>
  );
};

export default SidebarProfile;
