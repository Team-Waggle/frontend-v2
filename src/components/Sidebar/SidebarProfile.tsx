import { usePostLogout } from '../../hooks/useAuth';
import { POSITION_CONVERTER } from '../../utils/position';
import type { UserMeResponse } from '../../types/api/user';

// Icons
import BaicProfileIcon from '../../assets/icons/ic_profile_basic.svg?react';
import LogoutIcon from '../../assets/icons/normal/ic_logout.svg?react';
import CharacterGrayIcon from '../../assets/icons/ic_character_gray.svg?react';

const SidebarProfile = ({
  data,
  isFolded,
  isLoggedIn,
}: {
  data: UserMeResponse;
  isFolded: boolean;
  isLoggedIn: boolean;
}) => {
  const { mutate: logout } = usePostLogout();

  if (isFolded) return <BaicProfileIcon />;

  return (
    <div
      className={`flex w-[25.8rem] items-center justify-center gap-[1rem] ${!isLoggedIn && 'pt-[0.2rem]'}`}
    >
      {isLoggedIn ? (
        <>
          <BaicProfileIcon />
          <div className="flex w-[14.8rem] flex-col justify-center">
            <span className="text-[1.6rem] font-semibold text-black-100">
              {data?.username || '닉네임'}
            </span>
            <span className="h-[2rem] text-[1.3rem] font-medium text-black-60">
              {POSITION_CONVERTER[data?.position] || '포지션'}
            </span>
          </div>
          <button
            onClick={() => logout()}
            className="h-[3.2rem] w-[3.2rem] rounded-full px-[0.8rem] py-[0.8rem] hover:bg-black-10"
          >
            <LogoutIcon className="h-[1.6rem] w-[1.6rem] text-black-40" />
          </button>
        </>
      ) : (
        <CharacterGrayIcon />
      )}
    </div>
  );
};

export default SidebarProfile;
