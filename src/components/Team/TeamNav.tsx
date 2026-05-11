import { useParams } from 'react-router';
import PageNav from '../common/Tap/PageNav';

const TeamNav = () => {
  const { teamId } = useParams<{ teamId: string }>();

  const tabs = [
    { label: '메인 홈', to: `/team/${teamId}` },
    { label: '모집글 관리', to: `/team/${teamId}/posts` },
    { label: '지원자 관리', to: `/team/${teamId}/applicants` },
    { label: '팀 상태 관리', to: `/team/${teamId}/status` },
  ];

  return <PageNav tabs={tabs} />;
};

export default TeamNav;
