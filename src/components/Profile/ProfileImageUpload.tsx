import { useRef, useState } from 'react';

import IcCamera from '../../assets/icons/normal/ic_camera_fill.svg?react';
import IcProfileImg from '../../assets/icons/image/ic_character_circle_gray_40.svg?react';

import { useUpdateProfileImage } from '../../hooks/useUser';

interface ProfileImageUploadProps {
  isMyProfile: boolean;
  profileImageUrl?: string;
  username?: string;
}

const ProfileImageUpload = ({ isMyProfile, profileImageUrl, username }: ProfileImageUploadProps) => {
  const { mutate: updateProfileImage } = useUpdateProfileImage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imgError, setImgError] = useState(false);

  const handleClick = () => {
    if (isMyProfile) fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    updateProfileImage(file);
    e.target.value = '';
  };

  return (
    <div className="relative flex aspect-square h-[5.6rem] w-[5.6rem]">
      <div
        className="h-full w-full overflow-hidden rounded-[9.9rem]"
        onClick={handleClick}
        style={isMyProfile ? { cursor: 'pointer' } : undefined}
        role={isMyProfile ? 'button' : undefined}
        tabIndex={isMyProfile ? 0 : undefined}
      >
        {profileImageUrl && !imgError ? (
          <img
            src={profileImageUrl}
            alt={username ?? '프로필 이미지'}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <IcProfileImg className="h-full w-full" />
        )}
      </div>
      {isMyProfile && (
        <button
          type="button"
          className="absolute bottom-[-0.0001rem] right-[-0.0392rem] flex aspect-square h-[1.9649rem] w-[1.9649rem] cursor-pointer flex-col items-center justify-center rounded-[9.9rem] border border-solid border-black-30 bg-black-5"
          onClick={handleClick}
        >
          <IcCamera className="flex aspect-square h-[1.0718rem] w-[1.0718rem] items-center justify-center text-black-60" />
        </button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ProfileImageUpload;
