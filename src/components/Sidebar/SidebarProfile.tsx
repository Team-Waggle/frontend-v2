import { useNavigate } from 'react-router';
import { usePostLogout } from '../../hooks/useAuth';
import { POSITION_CONVERTER } from '../../utils/position';
import type { UserMeResponse } from '../../types/api/user';

// Icons
import BaicProfileIcon from '../../assets/icons/ic_profile_basic.svg?react';
import LogoutIcon from '../../assets/icons/normal/ic_logout.svg?react';

type ProfileDisplay = {
  title: string;
  subtitle: string;
  subtitleColorClass: string;
};

const getProfileDisplay = ({
  isLoggedIn,
  isLoadingProfile,
  isProfileComplete,
  data,
}: {
  isLoggedIn: boolean;
  isLoadingProfile: boolean;
  isProfileComplete: boolean;
  data: UserMeResponse | undefined;
}): ProfileDisplay => {
  if (!isLoggedIn || isLoadingProfile) {
    return {
      title: '게스트',
      subtitle: '로그인해주세요',
      subtitleColorClass: 'text-blue-60',
    };
  }
  if (isProfileComplete && data?.position) {
    return {
      title: data.username || '',
      subtitle: POSITION_CONVERTER[data.position],
      subtitleColorClass: 'text-black-60',
    };
  }
  return {
    title: '게스트',
    subtitle: '프로필을 완성해주세요',
    subtitleColorClass: 'text-blue-60',
  };
};

const SidebarProfile = ({
  data,
  isFolded,
  isLoggedIn,
  isProfileComplete,
  setIsNotificationOpen,
}: {
  data: UserMeResponse | undefined;
  isFolded: boolean;
  isLoggedIn: boolean;
  isProfileComplete: boolean;
  setIsNotificationOpen: (v: boolean) => void;
}) => {
  const navigate = useNavigate();
  const { mutate: logout } = usePostLogout();

  // 토큰은 있지만 /users/me 응답이 아직 도착 전 — 비로그인 UI로 떨어뜨리지 않는다
  const isLoadingProfile = isLoggedIn && !data;

  const profileImage = data?.profileImageUrl ? (
    <img
      src={data.profileImageUrl}
      alt=""
      className="h-[4.4rem] w-[4.4rem] rounded-[0.6rem] object-cover"
    />
  ) : (
    <BaicProfileIcon />
  );

  if (isFolded) return profileImage;

  const { title, subtitle, subtitleColorClass } = getProfileDisplay({
    isLoggedIn,
    isLoadingProfile,
    isProfileComplete,
    data,
  });

  return (
    <div className="flex w-[25.8rem] items-center gap-[1rem] pr-[1rem]">
      <div
        onClick={() => {
          if (data) navigate(`/profile/${data.id}`);
        }}
        className="flex cursor-pointer gap-[1rem]"
      >
        {profileImage}
        <div className="flex w-[15.2rem] flex-col justify-center">
          <span className="text-[1.6rem] font-semibold text-black-100">
            {title}
          </span>
          <span
            className={`h-[2rem] text-[1.3rem] font-medium ${subtitleColorClass}`}
          >
            {subtitle}
          </span>
        </div>
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
