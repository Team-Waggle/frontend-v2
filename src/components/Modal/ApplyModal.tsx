import { Controller, useForm } from 'react-hook-form';
import { useCreateTeamApplications } from '../../hooks/useTeam';
import FieldMaster from '../Field/FieldMaster';
import BaseButton from '../common/Button';
import type { PositionType, PostDetailResponse } from '../../types/api/posts';
import type { UserMeResponse } from '../../types/api/user';

// Modal
import { useModal } from '../../hooks/useModal';
import type { ModalProps } from '../../types/modal';
import ModalOverlay from './ModalOverlay';
import ModalPortal from './ModalPortal';

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
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { isValid },
    setValue,
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      position: myData?.position as PositionType,
      detail: '',
      portfolioUrls: '',
    },
  });

  const { mutate: createApply } = useCreateTeamApplications();

  const detailValue = watch('detail', '');

  const onSubmit = (data: FormValues) => {
    const formattedData = {
      ...data,
      postId: postData?.postId,
      portfolioUrls: data.portfolioUrls ? [data.portfolioUrls] : [],
    };

    createApply(
      { teamId: postData.team.teamId, postData: formattedData },
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
          className="relative h-[65rem] w-[73.8rem] rounded-[2rem] bg-black-5 px-[4rem] pt-[3.6rem]"
        >
          <div className="flex flex-col gap-[4rem]">
            <div className="flex flex-col gap-[3.4rem]">
              <span className="text-[3rem] font-bold">
                {postData?.team?.name} 팀에 지원합니다!
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
                      }}
                    />
                  )}
                />
                <FieldMaster
                  title="포트폴리오"
                  id="portfolioUrls"
                  variant="input"
                  warningMessage="URL 추가 시 권한제한/암호 없이 공유해주세요"
                  inputProps={{
                    ...register('portfolioUrls'),
                    placeholder: 'URL::',
                  }}
                />
                <FieldMaster
                  title="지원동기"
                  variant="textarea"
                  textareaProps={{
                    placeholder: '1500byte 이내 지원동기 (한글 500자 기준)',
                    value: detailValue,
                    ...register('detail', {
                      onChange: (e) => {
                        const value = e.target.value;
                        if (value.length > 1500) {
                          setValue('detail', value.slice(0, 1500));
                        }
                      },
                    }),
                    maxLength: 1500,
                  }}
                />
              </div>
            </div>
            <BaseButton
              type="submit"
              size="xl"
              disabled={!isValid}
              className="mx-auto w-[25rem]"
            >
              지원완료
            </BaseButton>
          </div>
        </form>
      </div>
    </ModalPortal>
  );
};

export default ApplyModal;
