//Icons
import BaicProfileIcon from '../../assets/icons/ic_profile_basic.svg?react';
import LogoutIcon from '../../assets/icons/normal/ic_logout.svg?react';
import CharacterGrayIcon from '../../assets/icons/ic_character_gray.svg?react';

const SidebarProfile = ({
  isFolded,
  isLoggedIn,
}: {
  isFolded: boolean;
  isLoggedIn: boolean;
}) => {
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
              일이삼사오육칠팔구십
            </span>
            <span className="h-[2rem] text-[1.3rem] font-medium text-black-60">
              프론트엔드
            </span>
          </div>
          <button className="h-[3.2rem] w-[3.2rem] rounded-full px-[0.8rem] py-[0.8rem] hover:bg-black-10">
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
