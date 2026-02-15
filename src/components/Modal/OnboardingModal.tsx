import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import ModalOverlay from './ModalOverlay';
import ModalPortal from './ModalPortal';
import { useModal } from '../../hooks/useModal';
import type { ModalProps } from '../../types/modal';

import BaseButton from '../common/Button';
import BaseChip from '../common/Chip/BaseChip';
import FieldMaster from '../Field/FieldMaster';
import { SkillIcon } from '../../utils/SkillIcon';

// Icons
import RequireIcon from '../../assets/icons/ic_require.svg?react';

interface FormValues {
  nickname: string;
  position: PositionType;
  skills: string[];
  portfolio: string;
  intro: string;
}

const positionData = {
  기획: ['Figma', 'GA4', 'Jira', 'Notion', 'SQL'],
  디자인: ['After Effects', 'Figma', 'Illustrator', 'Photoshop', 'ProtoPie'],
  프론트엔드: [
    'C#',
    'Javascript',
    'Next.js',
    'React',
    'React Native',
    'TypeScript',
    'UE',
    'Unity',
    'Vue.js',
  ],
  백엔드: [
    'AWS',
    'Django',
    'express.js',
    'FastAPI',
    'Java',
    'Javascript',
    'Kotlin',
    'NestJS',
    'Node.js',
    'Python',
    'Spring',
  ],
  마케팅: ['CRM', 'GA4', 'SEO', 'SNS마케팅', '콘텐츠제작'],
  기타: [
    'After Effects',
    'AWS',
    'C#',
    'CRM',
    'Django',
    'express.js',
    'FastAPI',
    'Figma',
    'GA4',
    'Illustrator',
    'Java',
    'Javascript',
    'Jira',
    'Kotlin',
    'NestJS',
    'Next.js',
    'Node.js',
    'Notion',
    'Photoshop',
    'ProtoPie',
    'Python',
    'React',
    'React Native',
    'SEO',
    'SNS마케팅',
    'Spring',
    'SQL',
    'TypeScript',
    'UE',
    'Unity',
    'Vue.js',
    '콘텐츠제작',
  ],
};

const positions = Object.keys(positionData) as (keyof typeof positionData)[];
type PositionType = keyof typeof positionData;

const OnboardingModal = ({ isOpen, onClose, handleDone }: ModalProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      nickname: '',
      position: '기획',
      skills: [],
      portfolio: '',
      intro: '',
    },
  });

  // 현재 선택된 값들 구독
  const activePosition = watch('position');
  const activeSkills = watch('skills');

  useEffect(() => {
    register('skills', {
      required: '스킬을 최소 하나 이상 선택해주세요.',
      validate: (value) => value.length > 0 || '스킬을 선택해주세요.',
    });
  }, [register]);

  const onSubmit = (data: FormValues) => {
    console.log(data);
    handleDone?.(data);
    onClose();
  };

  useModal({ isOpen, isOnboarding: true, onClose });
  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
      >
        <ModalOverlay onClose={onClose} isOnboarding={true} />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative flex h-[63.2rem] w-[73.8rem] flex-col gap-[4rem] overflow-scroll overflow-y-scroll rounded-[2rem] bg-white px-[4rem] pt-[4.4rem] scrollbar-hide"
        >
          <div className="flex w-full flex-col gap-[3.4rem]">
            <div className="flex flex-col text-[3rem] font-bold">
              <span className="">반가워요!</span>
              <span className="">어떤 분인지 알려주세요!</span>
            </div>
            <div className="flex flex-col gap-[3.4rem]">
              <FieldMaster
                title="닉네임 입력"
                id="nickname"
                variant="input"
                isRequired
                errorMessage={errors.nickname?.message}
                inputProps={{
                  placeholder: '최대 10자 제한 / 특수문자 불가',
                  ...register('nickname', {
                    required: '닉네임은 필수입니다.',
                    maxLength: {
                      value: 10,
                      message: '최대 10자까지 가능합니다.',
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ]*$/,
                      message: '특수문자는 사용 불가합니다.',
                    },
                  }),
                }}
              />
              <div className="flex flex-col gap-[1rem]">
                <div className="flex items-center gap-[0.4rem]">
                  <span className="text-[1.6rem] font-semibold">
                    직무 및 사용 스킬
                  </span>
                  <div className="flex h-[1.8rem] w-[1.2rem] items-center">
                    <RequireIcon />
                  </div>
                </div>
                <div className="flex flex-col gap-[2rem]">
                  <div className="flex gap-[0.6rem]">
                    {positions.map((pos) => (
                      <BaseChip
                        variant="filled"
                        key={pos}
                        isSelected={activePosition === pos}
                        onClick={() => {
                          setValue('position', pos);
                          setValue('skills', [], { shouldValidate: true });
                        }}
                      >
                        {pos}
                      </BaseChip>
                    ))}
                  </div>
                  <div className="flex max-h-[14.2rem] flex-wrap gap-x-[0.6rem] gap-y-[1rem] overflow-y-auto pl-[0.1rem] pr-[2rem] pt-[0.1rem]">
                    {positionData[activePosition].map((skill) => {
                      const isSelected = activeSkills.includes(skill);
                      return (
                        <BaseChip
                          key={`${activePosition} - ${skill}`}
                          onClick={() => {
                            const nextSkills = isSelected
                              ? activeSkills.filter((s) => s !== skill)
                              : [...activeSkills, skill];
                            setValue('skills', nextSkills, {
                              shouldValidate: true,
                            });
                          }}
                          mainIcon={<SkillIcon name={skill} />}
                        >
                          {skill}
                        </BaseChip>
                      );
                    })}
                  </div>
                </div>
              </div>
              <FieldMaster
                title="포트폴리오"
                id="portfolio"
                variant="input"
                inputProps={{
                  placeholder:
                    '현재 가지고 있는 포트폴리오 사이트가 있다면 URL을 입력해 주세요.',
                }}
              />
              <FieldMaster
                title="한줄소개"
                id="intro"
                variant="textarea"
                textareaProps={{
                  placeholder: '한 줄 소개를 입력해주세요. (100자 이내)',
                  ...register('intro', {
                    onChange: (e) => {
                      const value = e.target.value;
                      if (value.length > 100) {
                        setValue('intro', value.slice(0, 100));
                      }
                    },
                    validate: (value) =>
                      value.length <= 100 || '100자 이내로 입력해주세요.',
                  }),
                  maxLength: 100,
                }}
              />
            </div>
          </div>
          <div className="flex w-full justify-center pb-[3.8rem]">
            <BaseButton size="xl" disabled={!isValid} className="w-[25rem]">
              완료
            </BaseButton>
          </div>
        </form>
      </div>
    </ModalPortal>
  );
};

export default OnboardingModal;
