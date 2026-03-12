export type UserMeResponse = {
  userId: string;
  username: string;
  email: string;
  temperature: number;
  profileImageUrl: string;
  position: string;
  bio: string;
  skills: string[];
  portfolioUrls: string[];
  topLikeTags: {
    tag: string;
    count: number;
  }[];
  createdAt: string;
  updatedAt: string;
};
