import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, useWatch } from 'react-hook-form';
import FieldMaster from '../Field/FieldMaster';
import BaseButton from '../common/Button';
import BaseChip from '../common/Chip/BaseChip';
import { formatReviewTag } from '../../utils/review-tag';
import { usePutTeamMemberReview } from '../../hooks/useTeam';
import type { ReviewRequestType } from '../../types/api/team';

// Modal
import { useModal } from '../../hooks/useModal';
import type { ModalProps } from '../../types/modal';
import ModalOverlay from './ModalOverlay';
import ModalPortal from './ModalPortal';

// Icons
import CloseIcon from '../../assets/icons/normal/ic_close.svg?react';
import LikeIcon from '../../assets/icons/normal/ic_like.svg?react';
import BadIcon from '../../assets/icons/normal/ic_bad.svg?react';

const LIKE_OPTIONS = [
  '시간엄수',
  '개발왕',
  '소통왕',
  '책임감',
  '친절함',
  '피카소',
  '홍보왕',
  '고트',
  '레전드',
  '꼼꼼함',
];

const DISLIKE_OPTIONS = ['지각쟁이', '잠수왕', '예민함', '불친절', '이탈자'];

interface ReviewModalProps extends ModalProps {
  memberId?: number | string;
  username: string;
}

const ReviewModal = ({
  isOpen,
  onClose,
  memberId,
  username,
}: ReviewModalProps) => {
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    control,
    setValue,
    formState: { isValid },
  } = useForm<ReviewRequestType>({
    mode: 'onChange',
    defaultValues: {
      type: 'LIKE',
      tags: [],
    },
  });

  const watchReviewType = useWatch({ control, name: 'type' });

  const { mutate: createReview } = usePutTeamMemberReview();

  const onSubmit = (data: ReviewRequestType) => {
    const transformedData = {
      ...data,
      tags: data?.tags.map((tag) => formatReviewTag(tag)),
    };
    createReview(
      { memberId: Number(memberId), reviewBody: transformedData },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['team-members'],
          });
          onClose();
        },
      },
    );
  };

  const handleTypeChange = (
    type: 'LIKE' | 'DISLIKE',
    onChange: (val: string) => void,
  ) => {
    onChange(type);
    setValue('tags', []); // 타입을 바꾸면 기존에 선택한 태그들을 리셋
  };

  useModal({ isOpen, onClose });
  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
      >
        <ModalOverlay onClose={onClose} />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative w-[56.9rem] overflow-y-scroll rounded-[2rem] bg-black-5 px-[4rem] pt-[3.6rem] scrollbar-hide max-xs:h-[59.2rem] max-xs:w-[32rem]"
        >
          <div className="flex flex-col gap-[4rem]">
            <div className="flex flex-col gap-[3.4rem]">
              <div className="flex justify-between gap-[3.4rem]">
                {/* <div className="flex h-[9rem] justify-between gap-[3.4rem]"> */}
                <span className="text-[3rem] font-bold text-black-100">
                  <span className="text-blue-80">{username}</span>
                  님과의 협업은 어떠셨나요?
                </span>
                <button onClick={onClose} className="flex text-black-60">
                  <CloseIcon />
                </button>
              </div>
              <div className="flex flex-col gap-[3.4rem]">
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <div className="flex gap-[0.9rem]">
                      <BaseChip
                        variant="card"
                        status="liked"
                        mainIcon={<LikeIcon />}
                        isSelected={field.value === 'LIKE'}
                        onClick={() => handleTypeChange('LIKE', field.onChange)}
                      >
                        좋아요
                      </BaseChip>
                      <BaseChip
                        variant="card"
                        status="unliked"
                        mainIcon={<BadIcon />}
                        isSelected={field.value === 'DISLIKE'}
                        onClick={() =>
                          handleTypeChange('DISLIKE', field.onChange)
                        }
                      >
                        아쉬워요
                      </BaseChip>
                    </div>
                  )}
                />

                <Controller
                  name="tags"
                  control={control}
                  rules={{
                    validate: (value) => value.length <= 3,
                  }}
                  render={({ field }) => (
                    <FieldMaster
                      title={
                        watchReviewType === 'LIKE'
                          ? `${username}님은 어떤점이 인상적이었나요?`
                          : `${username}님은 어떤점이 아쉬웠나요?`
                      }
                      variant="tab"
                      isRequired
                      errorMessage="최대 3개 선택 가능"
                      tabProps={{
                        value: field.value,
                        onChange: field.onChange,
                        options:
                          watchReviewType === 'LIKE'
                            ? LIKE_OPTIONS
                            : DISLIKE_OPTIONS,
                        type: watchReviewType,
                      }}
                      className="max-xs:gap-[2rem]"
                      headerClassName="max-xs:flex-col max-xs:items-start"
                    />
                  )}
                />
              </div>
            </div>
            <div className="flex justify-center pb-[3.8rem] max-xs:sticky max-xs:bottom-0 max-xs:bg-white/90 max-xs:py-[2.2rem] max-xs:backdrop-blur-[0.5px]">
              <BaseButton
                type="submit"
                size="xl"
                disabled={!isValid}
                className="w-[25rem] max-xs:h-[5.4rem]"
              >
                평가 제출하기
              </BaseButton>
            </div>
          </div>
        </form>
      </div>
    </ModalPortal>
  );
};

export default ReviewModal;
