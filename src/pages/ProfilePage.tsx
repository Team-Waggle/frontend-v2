import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import IcWrite from '../assets/icons/normal/ic_write.svg?react';
import IcVerticalBar from '../assets/icons/ic_mypage_vertical_bar.svg?react';
import IcLink from '../assets/icons/normal/ic_link.svg?react';

import Tag from '../components/common/Tag/index';
import ProfileModal from '../components/Modal/ProfileModal';
import ProfileNav from '../components/Profile/ProfileNav';
import ProfileTeamSection from '../components/Profile/ProfileTeamSection';
import ProfileApplicationSection from '../components/Profile/ProfileApplicationSection';
import ProfileImageUpload from '../components/Profile/ProfileImageUpload';
import CollabTemperatureBar from '../components/Profile/CollabTemperatureBar';
import ReviewTagList from '../components/Profile/ReviewTagList';

import { useGetUserDetail, useGetUserMe } from '../hooks/useUser';

import { POSITION_CONVERTER } from '../utils/position';
import { SkillIcon } from '../utils/SkillIcon';
import { toSkillLabel } from '../utils/skill';

const MyPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { pathname } = useLocation();
  const isApplicationsTab = pathname.endsWith('/applications');
  const { data: me, isPending: isMePending } = useGetUserMe();
  const isMyProfile = !isMePending && !!me?.id && me.id === userId;
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const { data: userDetail } = useGetUserDetail(userId!);

  return (
    <>
      <div className="mb-[16rem] flex h-full w-full justify-center">
        <div className="mt-[9.2rem] flex w-[clamp(98.2rem,2.8rem_+_66.25vw,130rem)] flex-col items-start gap-[7.2rem] max-sm:mt-[1rem] max-sm:w-full max-sm:gap-[2rem]">
          {/** 프로필 및 온도 */}
          <div className="relative flex items-start gap-[3rem] self-stretch rounded-[1.6rem] border border-solid border-black-30 bg-black-5 p-[3rem] max-sm:flex-col max-sm:gap-[2rem] max-sm:rounded-none max-sm:border-0 max-sm:px-[2rem] max-sm:pt-0 max-sm:pb-[3rem]">
            {/** 프로필 정보 */}
            <div className="relative flex w-[clamp(27.7rem,3.97rem_+_16.48vw,36.6rem)] flex-col items-start gap-[1.2rem] pt-[1rem] max-sm:w-full">
              {/** 프로필 아이콘 */}
              <ProfileImageUpload
                isMyProfile={isMyProfile}
                profileImageUrl={userDetail?.profileImageUrl}
                username={userDetail?.username}
              />
              {isMyProfile && (
                <div
                  onClick={() => setIsProfileModalOpen(true)}
                  className="absolute right-[0.4rem] top-[1rem] cursor-pointer"
                >
                  <IcWrite className="h-[2rem] w-[2rem] text-black-50" />
                </div>
              )}

              {/** 프로필 상세설명 */}
              <div className="flex flex-col items-center gap-[1.4rem] self-stretch max-sm:items-start">
                {/** 프로필 이름 / 직무 */}
                <div className="flex flex-col items-center gap-[0.3rem] self-stretch max-sm:items-start">
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
                              href={/^https?:\/\//i.test(url) ? url : `https://${url}`}
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
                <div className="flex flex-col items-center gap-[4.5rem] self-stretch max-sm:items-start max-sm:gap-[3.2rem]">
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

            <IcVerticalBar className="max-sm:hidden" />
            <div className="hidden max-sm:block h-px self-stretch bg-black-20" />

            {/** 온도 및 해시태그 */}
            <div className="flex flex-1 flex-col items-start gap-[4rem] pt-[1rem] max-sm:flex-none max-sm:w-full max-sm:gap-[3rem]">
              <CollabTemperatureBar temperature={userDetail?.temperature} />
              <ReviewTagList topLikeTags={userDetail?.topLikeTags} />
            </div>
          </div>
          {/** 참여 중인 팀, 지원 목록 */}
          <div className="flex flex-col items-start gap-[2.4rem] self-stretch max-sm:px-[2rem]">
            {isMyProfile ? (
              <>
                <ProfileNav />
                {isApplicationsTab
                  ? <ProfileApplicationSection />
                  : <ProfileTeamSection userId={userId!} isMyProfile />
                }
              </>
            ) : (
              <>
                <div className="flex items-center self-stretch py-[1.2rem]">
                  <h2 className="overflow-hidden text-ellipsis text-[1.8rem] font-[700] leading-[1.5] tracking-[-0.036rem] text-black-100">
                    참여 중인 팀
                  </h2>
                </div>
                <ProfileTeamSection userId={userId!} isMyProfile={false} />
              </>
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
