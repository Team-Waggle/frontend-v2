export type CommentResponse = {
  id: number;
  postId: number;
  content: string;
  user: {
    id: number;
    username: string;
    profileImageUrl?: string;
  };
  createdAt: string;
  likeCount: number;
  liked: boolean;
};
