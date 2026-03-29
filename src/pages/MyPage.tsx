import { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import IcWrite from '../assets/icons/normal/ic_write.svg?react';
import IcInfo from '../assets/icons/normal/ic_circleInfo.svg?react';
import IcPolygon from '../assets/icons/ic_polygon.svg?react';
import IcVerticalBar from '../assets/icons/ic_mypage_vertical_bar.svg?react';
import IcCamera from '../assets/icons/normal/ic_camera_fill.svg?react';
import IcProfileImg from '../assets/icons/image/ic_character_circle_gray_40.svg?react';

import Tag from '../components/common/Tag/index';
import MyPageCard from '../components/common/Cards/MyPageCard/MyPageCard';
import PostEmptyPage from '../components/common/empty/PostEmptyPage';

import {
  useGetUserDetail,
  useGetUserMe,
  useGetUserMeTeam,
  useGetUserTeams,
  usePatchTeamVisibility,
  useUpdateProfileImage,
} from '../hooks/useUser';

import { POSITION_CONVERTER } from '../utils/position';
import { SkillIcon } from '../utils/SkillIcon';
import { toSkillLabel } from '../utils/skill';

const getTemperatureRGB = (temp: number): [number, number, number] => {
  if (temp <= 50) {
    const t = temp / 50;
    return [
      Math.round(0x9f + (0xfe - 0x9f) * t),
      Math.round(0xa2 + (0x99 - 0xa2) * t),
      Math.round(0xab + (0x1d - 0xab) * t),
    ];
  } else {
    const t = (temp - 50) / 50;
    return [
      Math.round(0xfe + (0xf5 - 0xfe) * t),
      Math.round(0x99 + (0x55 - 0x99) * t),
      Math.round(0x1d + (0x2d - 0x1d) * t),
    ];
  }
};

const getTemperatureColor = (temp: number, whiteBlend = 0): string => {
  const [r, g, b] = getTemperatureRGB(temp);
  if (whiteBlend > 0) {
    return `rgb(${Math.round(r + (255 - r) * whiteBlend)}, ${Math.round(g + (255 - g) * whiteBlend)}, ${Math.round(b + (255 - b) * whiteBlend)})`;
  }
  return `rgb(${r}, ${g}, ${b})`;
};

const MyPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const { data: me, isPending: isMePending } = useGetUserMe();
  const isMyProfile = !isMePending && !!me?.userId && me.userId === userId;

  const { data: userDetail } = useGetUserDetail(userId!);
  const { data: myTeams } = useGetUserMeTeam();
  const { data: otherTeams } = useGetUserTeams(userId!);
  const userTeams = isMyProfile ? myTeams : otherTeams;

  const { mutate: patchVisibility } = usePatchTeamVisibility();
  const { mutate: updateProfileImage } = useUpdateProfileImage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileImageClick = () => {
    if (isMyProfile) fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    updateProfileImage(file, {
      // onSuccess: () => toast('프로필 이미지가 변경되었습니다.'),
      // onError: () => toast('이미지 변경에 실패했습니다.'),
    });
    e.target.value = '';
  };

  return (
    <div className="mb-[16rem] flex h-full w-full justify-center">
      <div className="mt-[9.2rem] flex w-[clamp(98.2rem,2.8rem_+_66.25vw,130rem)] flex-col items-start gap-[7.2rem]">
        {/** 프로필 및 온도 */}
        <div className="relative flex items-start gap-[3rem] self-stretch rounded-[1.6rem] border border-solid border-black-30 bg-black-5 p-[3rem]">
          {/** 프로필 정보 */}
          <div className="relative flex w-[clamp(27.7rem,3.97rem_+_16.48vw,36.6rem)] flex-col items-start gap-[1.2rem] pt-[1rem]">
            {/** 프로필 아이콘 */}
            <div className="relative flex aspect-square h-[5.6rem] w-[5.6rem]">
              <div
                className="h-full w-full overflow-hidden rounded-[9.9rem]"
                onClick={handleProfileImageClick}
                style={isMyProfile ? { cursor: 'pointer' } : undefined}
                role={isMyProfile ? 'button' : undefined}
                tabIndex={isMyProfile ? 0 : undefined}
              >
                {userDetail?.profileImageUrl ? (
                  <img
                    src={userDetail.profileImageUrl}
                    alt={userDetail?.username ?? '프로필 이미지'}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <IcProfileImg className="h-full w-full" />
                )}
              </div>
              {isMyProfile && (
                <button
                  type="button"
                  className="absolute bottom-[-0.0001rem] right-[-0.0392rem] flex aspect-square h-[1.9649rem] w-[1.9649rem] cursor-pointer flex-col items-center justify-center rounded-[9.9rem] border border-solid border-black-30 bg-black-5"
                  onClick={handleProfileImageClick}
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
            {isMyProfile && (
              <div className="absolute right-[0.4rem] top-[1rem] cursor-pointer">
                <IcWrite className="h-[2rem] w-[2rem] text-black-50" />
              </div>
            )}

            {/** 프로필 상세설명 */}
            <div className="flex flex-col items-center gap-[1.4rem] self-stretch">
              {/** 프로필 이름 / 직무 / 연차 */}
              <div className="flex flex-col items-center gap-[0.3rem] self-stretch">
                <h1 className="self-stretch text-[2rem] font-[700] leading-[1.5] tracking-[-0.04rem] text-black-100">
                  {userDetail?.username}
                </h1>
                <span className="self-stretch text-[1.6rem] font-[600] leading-[1.5] tracking-[-0.032rem] text-black-90">
                  {userDetail?.position
                    ? POSITION_CONVERTER[userDetail.position]
                    : ''}
                </span>
              </div>
              {/** 스킬 / 한 줄 소개 */}
              <div className="flex flex-col items-center gap-[3rem] self-stretch">
                {/** 스킬 */}
                <div className="flex items-start gap-[0.8rem] self-stretch">
                  {userDetail?.skills?.map((skill: string) => (
                    <Tag
                      key={skill}
                      size="xs"
                      shape="circle"
                      color="black90"
                      isInverted
                    >
                      <SkillIcon
                        name={toSkillLabel(skill)}
                        className="h-[1.2rem] w-[1.2rem]"
                      />
                      {toSkillLabel(skill)}
                    </Tag>
                  ))}
                </div>
                <p className="self-stretch text-[1.4rem] font-[500] leading-[1.5] tracking-[-0.028rem] text-black-90">
                  {userDetail?.bio}
                </p>
              </div>
            </div>
          </div>

          <IcVerticalBar />

          {/** 온도 및 해시태그 */}
          <div className="flex flex-1 flex-col items-start gap-[4rem] pt-[1rem]">
            {/** 협업 온도 */}
            <div className="relative flex h-[9.7rem] flex-col items-start gap-[1.2rem] self-stretch">
              {/** 기본 온도 프레임 */}
              <div
                className="absolute bottom-[2.4rem] flex flex-col items-center justify-center pl-[1.0835rem] pr-[1.0165rem]"
                style={{
                  left: `${userDetail?.temperature}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                <span className="text-[1.2rem] font-[500] leading-[1.5] tracking-[-0.024rem] text-black-80">
                  기본 온도
                </span>
                <IcPolygon />
              </div>
              {/** 협업온도 */}
              <div className="flex flex-col items-start gap-[1.2rem] self-stretch">
                {/** 타이틀 */}
                <div className="flex items-center gap-[0.4rem] self-stretch">
                  <p className="text-[1.4rem] font-[600] leading-[1.5] tracking-[-0.028rem] text-black-90">
                    협업온도
                  </p>
                  <IcInfo className="h-[2rem] w-[2rem] text-black-60" />
                </div>
                {/** 온도 바 */}
                <div className="flex h-[6.4rem] flex-col items-start gap-[0.8rem] self-stretch">
                  <div className="flex items-center self-stretch">
                    <span className="text-[2.8rem] font-[800] leading-[1.5] tracking-[-0.056rem] text-black-100">
                      {(userDetail?.temperature ?? 36.5).toFixed(1)}°C
                    </span>
                  </div>
                  <div className="flex h-[1.4rem] flex-shrink flex-col items-start self-stretch rounded-[9.9rem] bg-black-10">
                    <div
                      className="h-[1.4rem] rounded-l-[9.9rem]"
                      style={{
                        width: `${userDetail?.temperature ?? 36.5}%`,
                        background: `linear-gradient(270deg, ${getTemperatureColor(userDetail?.temperature ?? 36.5)} 39.42%, #F2F3F4 100%)`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/** 이런 점이 좋았어요 */}
            <div className="flex flex-col items-start gap-[1.2rem] self-stretch">
              <h3 className="self-stretch text-[1.4rem] font-[700] leading-[1.5] tracking-[-0.028rem] text-black-90">
                이런점이 좋았어요!
              </h3>
              {/** 이런 점이 좋았어요 바 */}
              <div className="flex flex-col items-start gap-[0.8rem] self-stretch">
                {(() => {
                  const reviews = [
                    {
                      label: '꼼꼼함',
                      barColor: 'bg-blue-40',
                      labelColor: 'text-blue-100',
                      countColor: 'text-blue-100',
                      count: 380,
                    },
                    {
                      label: '책임감',
                      barColor: 'bg-blue-10',
                      labelColor: 'text-blue-70',
                      countColor: 'text-black-60',
                      count: 400,
                    },
                    {
                      label: '시간엄수',
                      barColor: 'bg-blue-10',
                      labelColor: 'text-blue-70',
                      countColor: 'text-black-60',
                      count: 335,
                    },
                  ];
                  const maxCount = Math.max(...reviews.map((r) => r.count));

                  return reviews.map(
                    ({ label, barColor, labelColor, countColor, count }) => (
                      <div
                        key={label}
                        className="relative flex h-[4rem] items-center self-stretch rounded-[0.6rem] bg-black-10"
                      >
                        <div
                          className={`${barColor} flex items-center gap-[1rem] self-stretch rounded-l-[0.6rem] px-[1rem]`}
                          style={{
                            width: `${Math.max((count / maxCount) * 100, 15)}%`,
                          }}
                        >
                          <span
                            className={`${labelColor} text-[1.5rem] font-[800] leading-[1.5] tracking-[-0.03rem]`}
                          >
                            # {label}
                          </span>
                        </div>
                        <span
                          className={`${countColor} absolute right-[1rem] whitespace-nowrap text-[1.3rem] font-[700] leading-[1.5] tracking-[-0.026rem]`}
                        >
                          {count}명
                        </span>
                      </div>
                    ),
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
        {/** 참여 중인 팀 */}
        <div className="flex flex-col items-start self-stretch">
          <div className="flex items-center self-stretch py-[1.2rem]">
            <h2 className="overflow-hidden text-ellipsis text-[1.8rem] font-[700] leading-[1.5] tracking-[-0.036rem] text-black-100">
              참여 중인 팀
            </h2>
          </div>
          {userTeams && userTeams.length > 0 ? (
            <div className="grid grid-cols-3 flex-wrap content-start items-start gap-[1.4rem] self-stretch max-1440:grid-cols-2">
              {isMyProfile
                ? myTeams?.map((team) => (
                    <MyPageCard
                      key={team.teamId}
                      title={team.name}
                      position={
                        POSITION_CONVERTER[team.position] ?? team.position
                      }
                      memberCount={team.memberCount}
                      isLeader={team.role === 'LEADER'}
                      profileImageUrl={team.profileImageUrl}
                      status={team.status}
                      isMyProfile
                      isVisible={team.isVisible}
                      teamId={team.teamId}
                      onVisibilityToggle={(teamId, isVisible) => {
                        patchVisibility({ teamId, isVisible });
                        if (!isVisible)
                          toast('프로젝트가 숨김처리 되었습니다.');
                      }}
                    />
                  ))
                : otherTeams?.map((team) => (
                    <MyPageCard
                      key={team.teamId}
                      title={team.name}
                      position={
                        POSITION_CONVERTER[team.position] ?? team.position
                      }
                      memberCount={team.memberCount}
                      isLeader={team.role === 'LEADER'}
                      profileImageUrl={team.profileImageUrl}
                      status={team.status}
                    />
                  ))}
            </div>
          ) : (
            <PostEmptyPage
              className="h-[auto] py-[5rem]"
              title="참여 중인 팀이 없습니다."
              subTitle="새로운 팀을 찾아보세요!"
              btnText="새 팀 찾기"
              onBtnClick={() => navigate('/')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
