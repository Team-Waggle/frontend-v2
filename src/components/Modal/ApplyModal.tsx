import { Controller, useForm } from 'react-hook-form';
import { useCreateTeamApplications } from '../../hooks/useTeam';
import FieldMaster from '../Field/FieldMaster';
import BaseButton from '../common/Button';
import type { PositionType, PostDetailResponse } from '../../types/api/posts';
import type { UserMeResponse } from '../../types/api/user';
import { getByteLength } from '../../utils/getByteLength';

// Modal
import { useModal } from '../../hooks/useModal';
import type { ModalProps } from '../../types/modal';
import ModalOverlay from './ModalOverlay';
import ModalPortal from './ModalPortal';

const POSITION_ORDER: PositionType[] = [
  'PM',
  'DESIGNER',
  'FRONTEND',
  'BACKEND',
  'MARKETER',
  'OTHER',
];

interface FormValues {
  position: PositionType;
  detail: string;
  portfolioUrls: string;
}

interface ApplyModalProps extends ModalProps {
  postData: PostDetailResponse;
  myData: UserMeResponse;
  onSuccessApply: () => void;
}

const ApplyModal = ({
  postData,
  myData,
  onSuccessApply,
  isOpen,
  onClose,
}: ApplyModalProps) => {
  const availablePositions = postData.recruitments
    .map((recruitment) => recruitment.position as PositionType)
    .sort((a, b) => POSITION_ORDER.indexOf(a) - POSITION_ORDER.indexOf(b));

  const defaultPosition = availablePositions.includes(
    myData?.position as PositionType,
  )
    ? (myData?.position as PositionType)
    : availablePositions[0];

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isValid },
    setValue,
    setError,
    clearErrors,
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      position: defaultPosition,
      detail: '',
      portfolioUrls: '',
    },
  });

  const { mutate: createApply } = useCreateTeamApplications();

  const detailValue = watch('detail', '');

  const onSubmit = (data: FormValues) => {
    const formattedData = {
      ...data,
      postId: postData?.id,
      portfolioUrls: data.portfolioUrls ? [data.portfolioUrls] : [],
    };

    createApply(
      { teamId: postData.team.id, postData: formattedData },
      {
        onSuccess: () => {
          onSuccessApply();
        },
        onError: (err) => {
          console.error(err);
        },
      },
    );
  };

  const handleDetailChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.replace(/\n/g, ' ');
    const byteLength = getByteLength(value);

    if (byteLength > 1500) {
      setError('detail', {
        type: 'manual',
        message: '최대 1,500byte까지 입력할 수 있어요.',
      });
      return;
    }

    clearErrors('detail');
    setValue('detail', value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setError('detail', {
        type: 'manual',
        message: '줄바꿈은 사용할 수 없어요.',
      });
      return;
    }

    clearErrors('detail');
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
          className="relative h-[62.5rem] w-[73.8rem] overflow-y-scroll rounded-[2rem] bg-black-5 px-[4rem] pt-[3.6rem] scrollbar-hide max-sm:h-[50.6rem] max-sm:w-[46rem] max-xs:w-[32rem] max-xs:px-[2rem] max-xs:pt-[2.6rem]"
        >
          <div className="flex flex-col gap-[4rem]">
            <div className="flex flex-col gap-[3.4rem]">
              <span className="text-[3rem] font-bold max-sm:text-[2.6rem]">
                {postData?.team?.name} 팀에 지원합니다.
              </span>
              <div className="flex flex-col gap-[3.4rem]">
                <Controller
                  name="position"
                  control={control}
                  rules={{
                    required: '직무 선택 필수',
                  }}
                  render={({ field }) => (
                    <FieldMaster
                      title="지원 직무"
                      variant="position"
                      isRequired
                      positionProps={{
                        value: field.value,
                        onChange: field.onChange,
                        availablePositions,
                      }}
                    />
                  )}
                />
                <FieldMaster
                  title="포트폴리오"
                  id="portfolioUrls"
                  variant="input"
                  errorMessage={errors.portfolioUrls?.message}
                  inputProps={{
                    ...register('portfolioUrls'),
                    placeholder:
                      '권한/암호가 해제된 올바른 URL을 사용해주세요.',
                  }}
                />
                <FieldMaster
                  title="지원동기"
                  id="detail"
                  variant="textarea"
                  errorMessage={errors.detail?.message}
                  textareaProps={{
                    placeholder:
                      '1,500byte 이내로 지원동기를 작성해주세요. (한글 500자 기준이에요.)',
                    value: detailValue,
                    ...register('detail'),
                    onChange: handleDetailChange,
                    onKeyDown: handleKeyDown,
                  }}
                  maxLength={1500}
                />
              </div>
            </div>
            <div className="pb-[3.2rem]">
              <BaseButton
                type="submit"
                size="xl"
                disabled={!isValid}
                className="mx-auto w-[25rem]"
              >
                지원하기
              </BaseButton>
            </div>
          </div>
        </form>
      </div>
    </ModalPortal>
  );
};

export default ApplyModal;
