import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import MyPageCard from '../common/Cards/MyPageCard/MyPageCard';
import PostEmptyPage from '../common/empty/PostEmptyPage';

import {
  useGetUserDetail,
  useGetUserMeTeam,
  useGetUserTeams,
  usePatchTeamVisibility,
} from '../../hooks/useUser';
import { useLeaveTeam } from '../../hooks/useTeam';
import { POSITION_CONVERTER } from '../../utils/position';

type ProfileTeamSectionProps = {
  userId: string;
  isMyProfile: boolean;
};

const ProfileTeamSection = ({ userId, isMyProfile }: ProfileTeamSectionProps) => {
  const navigate = useNavigate();
  const { data: myTeams } = useGetUserMeTeam();
  const { data: otherTeams } = useGetUserTeams(userId);
  const { mutate: patchVisibility } = usePatchTeamVisibility();
  const { mutate: leaveTeam } = useLeaveTeam();
  const { data: userDetail } = useGetUserDetail(userId);

  const userTeams = isMyProfile ? myTeams : otherTeams;

  if (!userTeams || userTeams.length === 0) {
    if (isMyProfile) {
      return (
        <PostEmptyPage
          className="h-[auto] py-[5rem]"
          title="참여 중인 팀이 없습니다."
          subTitle="새로운 팀을 찾아보세요!"
          btnText="새 팀 찾기"
          onBtnClick={() => navigate('/')}
        />
      );
    }
    return (
      <PostEmptyPage
        className="h-[auto] py-[5rem] whitespace-nowrap"
        title={`${userDetail?.username ?? ''}님이 현재 참여 중인 팀이 없어요.`}
      />
    );
  }

  return (
    <div className="grid grid-cols-3 flex-wrap content-start items-start gap-[1.4rem] self-stretch max-1440:grid-cols-2 max-sm:grid-cols-1">
      {isMyProfile
        ? myTeams?.map((team) => (
            <MyPageCard
              key={team.id}
              title={team.name}
              position={POSITION_CONVERTER[team.position] ?? team.position}
              memberCount={team.memberCount}
              isLeader={team.role === 'LEADER'}
              profileImageUrl={team.profileImageUrl}
              status={team.status}
              isMyProfile
              visible={team.visible}
              teamId={team.id}
              onVisibilityToggle={(teamId, visible) => {
                patchVisibility({ teamId, visible });
                if (!visible) toast('프로젝트가 숨김처리 되었습니다.');
              }}
              onLeaveTeam={(teamId) => leaveTeam(teamId)}
            />
          ))
        : otherTeams?.map((team) => (
            <MyPageCard
              key={team.id}
              title={team.name}
              position={POSITION_CONVERTER[team.position] ?? team.position}
              memberCount={team.memberCount}
              isLeader={team.role === 'LEADER'}
              profileImageUrl={team.profileImageUrl}
              status={team.status}
              teamId={team.id}
            />
          ))}
    </div>
  );
};

export default ProfileTeamSection;
