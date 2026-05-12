import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ProfileApplicationItem from './ProfileApplicationItem';
import ProfileApplicationStats from './ProfileApplicationStats';
import PostEmptyPage from '../common/empty/PostEmptyPage';
import type { ApplicationStat } from './ProfileApplicationStats';
import type { ApplicationStatus } from '../../types/api/user';
import { useGetMyApplications, useDeleteApplication } from '../../hooks/useUser';
import { POSITION_CONVERTER } from '../../utils/position';

const HEADER_COLUMNS: { label: string; width: string; className?: string }[] = [
  { label: '내용', width: 'w-[40rem]' },
  { label: '직무', width: 'w-[7.7rem]' },
  { label: '상태', width: 'w-[6.2rem]' },
  { label: '지원일', width: 'w-[9.6rem]' },
  { label: '취소', width: 'w-[12rem]', className: 'px-[2.8rem]' },
];

const HeaderCell = ({ label, width, className = '' }: { label: string; width: string; className?: string }) => (
  <div className={`flex ${width} items-center justify-center gap-[1rem] ${className}`}>
    <span className="text-[1.8rem] font-[500] leading-[1.5] tracking-[-0.036rem] text-black-90">
      {label}
    </span>
  </div>
);

const STATUS_MAP: Record<ApplicationStatus, Exclude<ApplicationStat, '전체'>> = {
  PENDING: '검토중',
  APPROVED: '합류확정',
  REJECTED: '불합격',
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

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
      {/** 지원한 팀 */}
      <div className="flex flex-col items-center self-stretch">
        {/** 내가 지원한 팀 Header */}
        <div className="flex items-center justify-between self-stretch rounded-[1.2rem] bg-black-20 px-[2rem] py-[1.2rem]">
          {HEADER_COLUMNS.map(({ label, width, className }) => (
            <HeaderCell key={label} label={label} width={width} className={className} />
          ))}
        </div>
        {filtered.length === 0 ? (
          <PostEmptyPage
            className="h-[auto] pt-[11rem] pb-[4rem] whitespace-nowrap"
            title="아직 지원한 팀이 없어요"
            subTitle="관심 있는 모집글을 찾아 지원해보세요."
            btnText="새로운 팀 찾기"
            onBtnClick={() => navigate('/')}
          />
        ) : (
          <div className="flex flex-col items-start self-stretch border-b border-solid border-black-30 px-[2rem]">
            {filtered.map((application) => (
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileApplicationSection;
