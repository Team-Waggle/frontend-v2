import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ProfileApplicationItem from './ProfileApplicationItem';
import ProfileApplicationStats from './ProfileApplicationStats';
import PostEmptyPage from '../common/empty/PostEmptyPage';
import type { ApplicationStat, ApplicationStatus, ApplicationStatusLabel } from '../../types/api/user';
import { useGetMyApplications, useDeleteApplication } from '../../hooks/useUser';
import { POSITION_CONVERTER } from '../../utils/position';

const STATUS_MAP: Record<ApplicationStatus, ApplicationStatusLabel> = {
  PENDING: '검토중',
  APPROVED: '합류확정',
  REJECTED: '불합격',
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

const TH_TEXT = 'text-[1.8rem] font-[500] leading-[1.5] tracking-[-0.036rem] text-black-90';

const ProfileApplicationSection = () => {
  const [activeFilter, setActiveFilter] = useState<ApplicationStat>('전체');
  const navigate = useNavigate();
  const { data } = useGetMyApplications();
  const { mutate: cancelApplication } = useDeleteApplication();

  const applications = data?.data ?? [];

  const stats: Record<ApplicationStat, number> = {
    전체: applications.length,
    검토중: applications.filter((a) => a.status === 'PENDING').length,
    합류확정: applications.filter((a) => a.status === 'APPROVED').length,
    불합격: applications.filter((a) => a.status === 'REJECTED').length,
  };

  const filtered = activeFilter === '전체'
    ? applications
    : applications.filter((a) => STATUS_MAP[a.status] === activeFilter);

  return (
    <div className="flex flex-col items-center gap-[7rem] self-stretch">
      <ProfileApplicationStats
        stats={stats}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      <div className="flex flex-col items-center self-stretch">
        <table className="w-full">
          <caption className="sr-only">지원 내역</caption>
          <thead>
            <tr className="flex items-center justify-between rounded-[1.2rem] bg-black-20 px-[2rem] py-[1.2rem]">
              <th scope="col" className={`${TH_TEXT} w-[40rem] text-center`}>내용</th>
              <th scope="col" className={`${TH_TEXT} w-[7.7rem] text-center`}>직무</th>
              <th scope="col" className={`${TH_TEXT} w-[6.2rem] text-center`}>상태</th>
              <th scope="col" className={`${TH_TEXT} w-[9.6rem] text-center`}>지원일</th>
              <th scope="col" className={`${TH_TEXT} w-[12rem] px-[2.8rem] text-center`}>취소</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <PostEmptyPage
                    className="h-[auto] pt-[11rem] pb-[4rem] whitespace-nowrap"
                    title="아직 지원한 팀이 없어요"
                    subTitle="관심 있는 모집글을 찾아 지원해보세요."
                    btnText="새로운 팀 찾기"
                    onBtnClick={() => navigate('/')}
                  />
                </td>
              </tr>
            ) : (
              filtered.map((application) => (
                <ProfileApplicationItem
                  key={application.id}
                  postId={application.post.id}
                  teamName={application.team.name}
                  title={application.post.title}
                  position={POSITION_CONVERTER[application.position] ?? application.position}
                  status={STATUS_MAP[application.status]}
                  appliedAt={formatDate(application.createdAt)}
                  onCancel={() => cancelApplication(application.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfileApplicationSection;
