import { Controller, useForm } from 'react-hook-form';
import FieldMaster from '../Field/FieldMaster';
import type { PositionType } from '../Field/FieldBody';
import BaseButton from '../common/Button';

// Modal
import { useModal } from '../../hooks/useModal';
import type { ModalProps } from '../../types/modal';
import ModalOverlay from './ModalOverlay';
import ModalPortal from './ModalPortal';

interface FormValues {
  position: PositionType;
  detail: string;
  portfolioUrls: string[];
}

const ApplyModal = ({ isOpen, onClose }: ModalProps) => {
  const { register, handleSubmit, watch, control, setValue } =
    useForm<FormValues>({
      mode: 'onChange',
      defaultValues: {
        position: '',
        detail: '',
        portfolioUrls: [],
      },
    });

  const detailValue = watch('detail', '');

  const onSubmit = (data: FormValues) => {
    console.log(data);
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
                WAGGLE 팀에 지원합니다!
              </span>
              <div className="flex flex-col gap-[3.4rem]">
                <Controller
                  name="position"
                  control={control}
                  render={({ field }) => (
                    <FieldMaster
                      title="지원 직무"
                      variant="singlePosition"
                      isRequired
                      singlePositionProps={{
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
                  errorMessage="URL 추가 시 권한제한/암호 없이 공유해주세요"
                  inputProps={{
                    ...register('portfolioUrls'),
                    placeholder: 'URL::',
                  }}
                />
                <FieldMaster
                  title="한줄 소개"
                  variant="textarea"
                  textareaProps={{
                    placeholder: '한 줄 소개를 입력해주세요. (500자 이내)',
                    value: detailValue,
                    ...register('detail', {
                      onChange: (e) => {
                        const value = e.target.value;
                        if (value.length > 500) {
                          setValue('detail', value.slice(0, 500));
                        }
                      },
                    }),
                    maxLength: 500,
                  }}
                />
              </div>
            </div>
            <BaseButton type="submit" size="xl" className="mx-auto w-[25rem]">
              지원완료
            </BaseButton>
          </div>
        </form>
      </div>
    </ModalPortal>
  );
};

export default ApplyModal;
