import { useForm } from 'react-hook-form';
import { useCreateComment, useGetComment } from '../../hooks/useComment';
import CommentItem from './CommentItem';
import type { CommentResponse } from '../../types/api/comment';
import IconWrapper from '../common/IconWrapper';

// Icons
import SendIcon from '../../assets/icons/normal/ic_send.svg?react';

interface CommentProps {
  postId?: number;
  myUserId?: number;
  commentCount?: number;
}

interface FormValues {
  content: string;
}

const Comment = ({ postId, myUserId, commentCount }: CommentProps) => {
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const { data: commentData } = useGetComment(postId!);

  const { mutate: createComment } = useCreateComment();

  const onSubmit = (data: FormValues) => {
    createComment(
      {
        postId: postId!,
        commentData: { content: data.content },
      },
      {
        onSuccess: () => {
          reset();
        },
      },
    );
  };

  return (
    <div className="flex flex-col items-start self-stretch">
      <div className="w-full border-b border-black-30 py-[1.2rem]">
        <span className="text-[1.6rem] font-medium text-black-90">
          댓글 {commentCount ? (commentCount > 99 ? '99+' : commentCount) : 0}
        </span>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full px-[1.2rem] py-[2.4rem]"
      >
        <div className="flex gap-[2rem]">
          <input
            {...register('content')}
            placeholder="메시지를 입력해주세요."
            className="h-[4.4rem] w-[60rem] rounded-full bg-black-10 py-[0.8rem] pl-[2.8rem] pr-[2.4rem] text-[1.4rem] font-medium text-black-100 placeholder:text-black-60"
          />
          <IconWrapper className="shrink-0" type="submit">
            <SendIcon />
          </IconWrapper>
        </div>
      </form>
      <div className="w-full px-[1.2rem]">
        {commentData?.data.map((comment: CommentResponse) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            postId={postId}
            myUserId={myUserId}
          />
        ))}
      </div>
    </div>
  );
};

export default Comment;
