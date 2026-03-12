export type TeamResponse = {
  teamId: number;
  name: string;
  description: string;
  status: string;
  workMode: string;
  profileImageUrl: string;
  memberCount: number;
  position: string;
  role: string;
  isVisible: boolean;
  createdAt?: string;
  updatedAt?: string;
};