import { useNavigate, useParams } from 'react-router-dom';

import { useGetTeamPosts } from '../hooks/useTeam';

import TeamNav from '../components/Team/TeamNav';
import TeamPostItem from '../components/Team/TeamPostItem';
import PostEmptyPage from '../components/common/empty/PostEmptyPage';

const TeamPostManagementPage = () => {
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId: string }>();
  const { data: posts = [] } = useGetTeamPosts(Number(teamId));

  return (
    <div className="flex flex-col items-center gap-[6rem] self-stretch px-[2rem] pt-[5.4rem]">
      <TeamNav />
      <div className="flex w-[clamp(98.2rem,70vw,130rem)] flex-col items-start">
        {posts.length > 0 && (
          <div className="flex items-center gap-[1rem] self-stretch border-b border-solid border-black-40 py-[1rem]">
            <span className="text-[2rem] font-[600] leading-[1.5] tracking-[-0.04rem] text-black-100">
              총 {posts.length}개의 글
            </span>
          </div>
        )}
        <div className={`mb-[29.1rem] flex flex-col items-start self-stretch`}>
          {posts.length === 0 ? (
            <PostEmptyPage title="등록된 모집글이 없습니다." subTitle="새로운 팀원을 찾아보세요!" btnText="모집글 작성" onBtnClick={() => navigate('/post/new')} />
          ) : (
            posts.map((post) => (
              <TeamPostItem
                key={post.postId}
                {...post}
                onClick={() => navigate(`/post/${post.postId}`)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamPostManagementPage;
