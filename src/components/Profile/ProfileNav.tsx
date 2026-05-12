import { useParams } from 'react-router';
import PageNav from '../common/Tap/PageNav';

const ProfileNav = () => {
  const { userId } = useParams<{ userId: string }>();

  const tabs = [
    { label: '참여 중인 팀', to: `/profile/${userId}` },
    { label: '지원 목록', to: `/profile/${userId}/applications` },
  ];

  return <PageNav tabs={tabs} />;
};

export default ProfileNav;
