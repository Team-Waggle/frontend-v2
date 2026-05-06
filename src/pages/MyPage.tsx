import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import IcWrite from '../assets/icons/normal/ic_write.svg?react';
import IcInfo from '../assets/icons/normal/ic_circleInfo.svg?react';
import IcPolygon from '../assets/icons/ic_polygon.svg?react';
import IcVerticalBar from '../assets/icons/ic_mypage_vertical_bar.svg?react';
import IcCamera from '../assets/icons/normal/ic_camera_fill.svg?react';
import IcProfileImg from '../assets/icons/image/ic_character_circle_gray_40.svg?react';
import IcCharacterNoReviews from '../assets/icons/ic_character_main_page.svg?react';
import IcLink from '../assets/icons/normal/ic_link.svg?react';

import Tag from '../components/common/Tag/index';
import MyPageCard from '../components/common/Cards/MyPageCard/MyPageCard';
import PostEmptyPage from '../components/common/empty/PostEmptyPage';
import Tooltip from '../components/common/Tooltip';
import ProfileModal from '../components/Modal/ProfileModal';

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
import { formatReviewTag } from '../utils/review-tag';

const getTemperatureGradient = (temp: number): string => {
  if (temp <= 36.5) {
    return 'linear-gradient(270deg, #9FA2AB 39.42%, #F2F3F4 100%)';
  }

  const t = Math.min((temp - 36.5) / (100 - 36.5), 1);
  const hex = (n: number) => Math.round(n).toString(16).padStart(2, '0');

  const r1 = 0xfe + (0xf5 - 0xfe) * t;
  const g1 = 0x99 + (0x55 - 0x99) * t;
  const b1 = 0x1d + (0x2d - 0x1d) * t;

  const g2 = 0xf5 + (0xee - 0xf5) * t;
  const b2 = 0xe9 + (0xea - 0xe9) * t;

  return `linear-gradient(270deg, #${hex(r1)}${hex(g1)}${hex(b1)} 0%, #ff${hex(g2)}${hex(b2)} 100%)`;
};

const getReviewTagStyle = (isTop: boolean) => ({
  barColor: isTop ? 'bg-blue-40' : 'bg-blue-10',
  labelColor: isTop ? 'text-blue-100' : 'text-blue-70',
  countColor: isTop ? 'text-blue-100' : 'text-black-60',
});

const MyPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const { data: me, isPending: isMePending } = useGetUserMe();
  const isMyProfile = !isMePending && !!me?.userId && me.userId === userId;
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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
    <>
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
                <div
                  onClick={() => setIsProfileModalOpen(true)}
                  className="absolute right-[0.4rem] top-[1rem] cursor-pointer"
                >
                  <IcWrite className="h-[2rem] w-[2rem] text-black-50" />
                </div>
              )}

              {/** 프로필 상세설명 */}
              <div className="flex flex-col items-center gap-[1.4rem] self-stretch">
                {/** 프로필 이름 / 직무 */}
                <div className="flex flex-col items-center gap-[0.3rem] self-stretch">
                  {/** 프로필 이름 */}
                  <h1 className="self-stretch text-[2rem] font-[700] leading-[1.5] tracking-[-0.04rem] text-black-100">
                    {userDetail?.username}
                  </h1>
                  {/** 직무 */}
                  <div className="flex flex-col items-start justify-center gap-[0.7rem] self-stretch">
                    <span className="self-stretch text-[1.6rem] font-[600] leading-[1.5] tracking-[-0.032rem] text-black-90">
                      {userDetail?.position
                        ? POSITION_CONVERTER[userDetail.position]
                        : ''}
                    </span>
                    {/** 포트폴리오 */}
                    {userDetail?.portfolioUrls && userDetail.portfolioUrls.length > 0 && (
                      <div className="flex items-center gap-[0.4rem] self-stretch pr-[0.8rem]">
                        <div className="flex items-center gap-[0.2rem]">
                          <IcLink className="text-black-90 w-[1.2rem] h-[1.2rem] aspect-square" />
                          <span className="overflow-hidden text-black-90 text-ellipsis text-[1.3rem] font-[500] leading-[1.5]"> 포트폴리오 </span>
                        </div>
                        <div className="flex flex-col gap-[0.2rem] overflow-hidden">
                          {userDetail.portfolioUrls.map((url) => (
                            <a
                              key={url}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="overflow-hidden text-ellipsis text-[1.3rem] font-[500] tracking-[-0.026rem] text-blue-60 underline"
                            >
                              {url}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/** 스킬 / 한 줄 소개 */}
                <div className="flex flex-col items-center gap-[4.5rem] self-stretch">
                  {/** 스킬 */}
                  <div className="flex items-start gap-[0.8rem] self-stretch">
                    {userDetail?.skills?.slice(0, 3).map((skill: string) => (
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
                    left: `36.5%`,
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
                    <Tooltip
                      id="collab-temp-tooltip"
                      content="팀 활동 및 팀원 피드백 기반으로 변동되는 지표입니다."
                    >
                      <IcInfo className="h-[2rem] w-[2rem] text-black-60" />
                    </Tooltip>
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
                          background: getTemperatureGradient(
                            userDetail?.temperature ?? 36.5,
                          ),
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
                    const reviews = (userDetail?.topLikeTags ?? []).map(
                      ({ tag, count }, index) => ({
                        label: formatReviewTag(tag),
                        ...getReviewTagStyle(index === 0),
                        count,
                      }),
                    );

                    if (reviews.length === 0) {
                      return (
                        <div className="flex min-h-[12rem] flex-1 flex-col items-center justify-center gap-[1.2rem] self-stretch">
                          <p className="overflow-hidden text-ellipsis text-center text-[1.4rem] font-[600] leading-[1.5] tracking-[-0.028rem] text-black-60">
                            아직 받은 평판이 없어요.
                          </p>
                        </div>
                      );
                    }

                    const maxCount = Math.max(...reviews.map((r) => r.count));

                    return reviews.map(
                      ({ label, barColor, labelColor, countColor, count }) => (
                        <div
                          key={label}
                          className="relative flex h-[4rem] items-center self-stretch rounded-[0.6rem] bg-black-10"
                        >
                          <div
                            className={`${barColor} flex items-center gap-[1rem] self-stretch rounded-l-[0.6rem] px-[1rem] ${count === maxCount ? 'rounded-r-[0.6rem]' : ''}`}
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
                        teamId={team.teamId}
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
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        myData={me}
        mode="edit"
      />
    </>
  );
};

export default MyPage;
