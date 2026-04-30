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

  const profileImage = data?.profileImageUrl ? (
    <img
      src={data.profileImageUrl}
      alt=""
      className="h-[4.4rem] w-[4.4rem] rounded-[0.6rem]"
    />
  ) : (
    <BaicProfileIcon />
  );

  if (isFolded) return profileImage;

  return (
    <div className="flex w-[25.8rem] items-center gap-[1rem] pr-[1rem]">
      {profileImage}
      <div className="flex w-[15.2rem] flex-col justify-center">
        <span className="text-[1.6rem] font-semibold text-black-100">
          {isLoggedIn ? data?.username || '게스트' : '게스트'}
        </span>
        <span
          className={`h-[2rem] text-[1.3rem] font-medium ${isLoggedIn ? 'text-black-60' : 'text-blue-60'}`}
        >
          {isLoggedIn && data?.position
            ? POSITION_CONVERTER[data?.position] || '로그인해주세요'
            : '로그인해주세요'}
        </span>
      </div>
      {isLoggedIn && (
        <button
          onClick={() => {
            setIsNotificationOpen(false);
            logout();
          }}
          className="h-[3.2rem] w-[3.2rem] rounded-full px-[0.8rem] py-[0.8rem] hover:bg-black-10"
        >
          <LogoutIcon className="h-[1.6rem] w-[1.6rem] text-black-40" />
        </button>
      )}
    </div>
  );
};

export default SidebarProfile;
