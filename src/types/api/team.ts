export type TeamResponse = {
  teamId: number;
  name: string;
  description: string;
  status: 'ACTIVE' | 'COMPLETED';
  workMode: 'ONLINE' | 'OFFLINE';
  profileImageUrl: string;
  memberCount: number;
  position: string;
  role: 'LEADER' | 'MANAGER' | 'MEMBER';
  isVisible: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type MemberResponse = {
  memberId: number;
  teamId: number;
  userId: number;
  role: 'LEADER' | 'MANAGER' | 'MEMBER';
  position: string;
  username: string;
  profileImageUrl: string;
  skills: string[];
  createAt: string;
  updateAt: string;
  deletedAt: string | null;
};
