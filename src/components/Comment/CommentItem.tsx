import { useEffect, useRef, useState } from 'react';
import IconWrapper from '../common/IconWrapper';
import SelectBox from '../common/SelectBox';
import BaseButton from '../common/Button';
import { formatPostListCreatedAt } from '../../utils/kst-time';
import {
  useDeleteComment,
  useLikeComment,
  useUnlikeComment,
  useUpdateComment,
} from '../../hooks/useComment';
import { FieldTextarea } from '../Field/FieldBody';
import type { CommentResponse } from '../../types/api/comment';

// Icons
import HeartIcon from '../../assets/icons/normal/ic_heart.svg?react';
import HeartFillIcon from '../../assets/icons/normal/ic_heart_fill.svg?react';
import BasicProfileIcon from '../../assets/icons/image/ic_character_circle_gray_60.svg?react';
import MoreVerticalIcon from '../../assets/icons/normal/ic_moreVertical.svg?react';
import WriteIcon from '../../assets/icons/normal/ic_write.svg?react';
import DeleteIcon from '../../assets/icons/normal/ic_trash.svg?react';

interface CommentItemProps {
  comment: CommentResponse;
  postId?: number;
  myUserId?: number;
}

const CommentItem = ({ comment, postId, myUserId }: CommentItemProps) => {
  const [isSelectBoxOpen, setIsSelectBoxOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');

  const { mutate: deleteComment } = useDeleteComment(comment.id, postId!);
  const { mutate: likeComment } = useLikeComment(comment.id);
  const { mutate: unlikeComment } = useUnlikeComment(comment.id);
  const { mutate: updateComment, isPending: isUpdating } = useUpdateComment(
    comment.id,
  );

  const selectBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isSelectBoxOpen) {
      return;
    }

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (selectBoxRef.current && !selectBoxRef.current.contains(target)) {
        setIsSelectBoxOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSelectBoxOpen]);

  return (
    <div className="flex flex-col gap-[1rem] px-[2rem] py-[0.8rem]">
      <div className="relative flex gap-[1.4rem] self-stretch">
        <div className="flex flex-1 items-center gap-[1rem]">
          {comment.user.profileImageUrl ? (
            <img
              src={comment.user.profileImageUrl}
              alt=""
              className="h-[3.2rem] w-[3.2rem] rounded-[0.6rem] object-cover"
            />
          ) : (
            <BasicProfileIcon className="h-[3.2rem] w-[3.2rem]" />
          )}
          <div className="flex items-center gap-[0.8rem]">
            <span className="whitespace-nowrap text-[1.6rem] font-medium text-black-100">
              {comment.user.username}
            </span>
            <span className="whitespace-nowrap text-[1.4rem] font-normal text-black-60">
              {formatPostListCreatedAt(comment.createdAt)}
            </span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-[0.2rem]">
            <span
              className={`text-[1.4rem] font-medium ${comment.liked ? 'text-blue-70' : 'text-black-60'}`}
            >
              {comment.likeCount}
            </span>
            <IconWrapper
              onClick={() => {
                if (comment.user.id === myUserId) return;
                if (comment.liked) {
                  unlikeComment();
                } else {
                  likeComment();
                }
              }}
              color="transparent"
              className={`!h-[3.6rem] !w-[3.6rem] ${comment.user.id === myUserId && 'cursor-default'}`}
            >
              {comment.liked ? (
                <HeartFillIcon className="!h-[1.964rem] !w-[1.964rem] text-blue-60" />
              ) : (
                <HeartIcon className="!h-[1.964rem] !w-[1.964rem] text-black-60" />
              )}
            </IconWrapper>
            {comment.user.id === myUserId && (
              <div ref={selectBoxRef}>
                <IconWrapper
                  color="transparentTwo"
                  className="!h-[3.6rem] !w-[3.6rem]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSelectBoxOpen((prev) => !prev);
                  }}
                >
                  <MoreVerticalIcon className="!h-[2.182rem] !w-[2.182rem] text-black-50" />
                </IconWrapper>
                {isSelectBoxOpen && (
                  <div
                    className="absolute right-0 top-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <SelectBox
                      items={[
                        {
                          icon: <WriteIcon />,
                          label: '수정하기',
                          onClick: () => {
                            setEditContent(comment.content);
                            setIsEditing(true);
                            setIsSelectBoxOpen(false);
                          },
                        },
                        {
                          icon: <DeleteIcon />,
                          label: '삭제하기',
                          onClick: () => {
                            deleteComment();
                          },
                          variant: 'danger',
                        },
                      ]}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {isEditing ? (
        <div className="flex flex-col items-end gap-[1rem]">
          <FieldTextarea
            id={`comment-${comment.id}`}
            placeholder="수정할 내용을 입력해주세요."
            className="w-full"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            disabled={isUpdating}
          />
          <BaseButton
            size="sm"
            color="secondary"
            className="w-[5.7rem] whitespace-nowrap"
            type="button"
            disabled={isUpdating || !editContent.trim()}
            onClick={() => {
              if (editContent === comment.content) {
                setIsEditing(false);
                return;
              }

              updateComment(
                { content: editContent },
                {
                  onSuccess: () => {
                    setIsEditing(false);
                  },
                },
              );
            }}
          >
            등록
          </BaseButton>
        </div>
      ) : (
        <div className="pb-[1.4rem]">
          <span className="text-[1.6rem] font-normal text-black-100">
            {comment.content}
          </span>
        </div>
      )}
    </div>
  );
};

export default CommentItem;
