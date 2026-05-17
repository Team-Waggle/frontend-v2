import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';

// Modals
import ModalOverlay from './ModalOverlay';
import ModalPortal from './ModalPortal';
import { useModal } from '../../hooks/useModal';
import type { ModalProps } from '../../types/modal';

import { getUserCheck } from '../../api/user';
import BaseButton from '../common/Button';
import BaseChip from '../common/Chip/BaseChip';
import FieldMaster from '../Field/FieldMaster';
import { SkillIcon } from '../../utils/SkillIcon';
import { toSkillLabel } from '../../utils/skill';
import { POSITION_CONVERTER } from '../../utils/position';
import { getByteLength } from '../../utils/getByteLength';
import {
  useCreateUserProfile,
  useDeleteUserMe,
  usePutUserMe,
} from '../../hooks/useUser';
import { positionSkillData } from '../../constants/positionSkill';
import { SKILL_MAP } from '../../constants/skillMap';
import type { UserMeResponse } from '../../types/api/user';

// Icons
import RequireIcon from '../../assets/icons/ic_require.svg?react';

interface FormValues {
  username: string;
  position: PositionType;
  skills: string[];
  portfolioUrls: string;
  bio: string;
}

interface ProfileModalProps extends ModalProps {
  myData?: UserMeResponse;
}

const positions = Object.keys(
  positionSkillData,
) as (keyof typeof positionSkillData)[];

type PositionType = keyof typeof positionSkillData;
type ProfileModalStep = 'edit' | 'deleteConfirm';

const ProfileModal = ({ isOpen, onClose, mode, myData }: ProfileModalProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset,
    formState: { errors, isValid },
    clearErrors,
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      username: '',
      position: '기획',
      skills: [],
      portfolioUrls: '',
      bio: '',
    },
  });

  const [step, setStep] = useState<ProfileModalStep>('edit');

  const queryClient = useQueryClient();
  const { mutate: createUserProfile } = useCreateUserProfile();
  const { mutate: updateUserProfile } = usePutUserMe();
  const { mutate: deleteUser } = useDeleteUserMe();

  // 현재 선택된 값들 구독
  const usernameValue = watch('username', '');
  const activePosition = watch('position');
  const activeSkills = watch('skills');
  const portfolioUrlsValue = watch('portfolioUrls', '');
  const introValue = watch('bio', '');

  useEffect(() => {
    if (!isOpen) {
      setStep('edit');

      if (myData) {
        reset({
          username: myData.username || '',
          position:
            (POSITION_CONVERTER[myData.position] as PositionType) || '기획',
          skills: myData.skills.map((skill) => toSkillLabel(skill)),
          portfolioUrls: myData.portfolioUrls?.[0] || '',
          bio: myData.bio || '',
        });
      } else {
        reset();
      }
    }
  }, [isOpen, myData, reset]);

  useEffect(() => {
    if (isOpen) {
      register('skills', {
        required: '스킬을 최소 하나 이상 선택해주세요.',
        validate: (value) =>
          (Array.isArray(value) && value.length > 0) || '스킬을 선택해주세요.',
      });
    }
  }, [register, isOpen]);

  const handleClose = () => {
    setStep('edit');
    onClose();
  };

  const handleDeleteUser = () => {
    deleteUser();
  };

  const onSubmit = async (data: FormValues) => {
    try {
      if (mode === 'onboarding') {
        const response = await getUserCheck(data.username);
        if (!response?.available) {
          setError(
            'username',
            {
              type: 'manual',
              message: '이미 사용 중인 닉네임입니다.',
            },
            { shouldFocus: true },
          );
          return;
        }
      }

      const transformedData = {
        ...(mode !== 'edit' && { username: data?.username }),

        position: POSITION_CONVERTER[data.position] || data.position,

        skills: data.skills.map(
          (skill) => SKILL_MAP[skill as keyof typeof SKILL_MAP] ?? skill,
        ),

        ...(data.portfolioUrls?.trim() && {
          portfolioUrls: [data.portfolioUrls.trim()],
        }),

        ...(data.bio?.trim() && { bio: data.bio.trim() }),
        ...(mode === 'edit' && {
          profileImageUrl: myData?.profileImageUrl,
        }),
      };

      if (mode === 'onboarding') {
        createUserProfile(transformedData);
      }

      if (mode === 'edit') {
        updateUserProfile(transformedData, {
          onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['user'] });
            await queryClient.invalidateQueries({ queryKey: ['me'] });
            handleClose();
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const byteLength = getByteLength(value);

    if (byteLength > 15) {
      setError('username', {
        type: 'manual',
        message: '6~15byte 이내로 입력이 가능해요.',
      });
      return;
    }

    clearErrors('username');
    setValue('username', value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.replace(/\n/g, ' ');
    const byteLength = getByteLength(value);

    if (byteLength > 100) {
      setError('bio', {
        type: 'manual',
        message: '최대 100byte까지 입력이 가능해요.',
      });
      return;
    }

    clearErrors('bio');
    setValue('bio', value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setError('bio', {
        type: 'manual',
        message: '줄바꿈은 사용할 수 없어요.',
      });
      return;
    }

    clearErrors('bio');
  };

  useModal({
    isOpen,
    isOnboarding: mode === 'onboarding',
    onClose: handleClose,
  });
  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
      >
        <ModalOverlay
          onClose={handleClose}
          isOnboarding={mode === 'onboarding'}
        />

        {step === 'edit' && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative flex h-[80.7rem] w-[73.8rem] flex-col gap-[4rem] overflow-y-scroll scroll-smooth rounded-[2rem] bg-white px-[4rem] pt-[4.4rem] scrollbar-hide"
          >
            <div className="flex w-full flex-col gap-[3.4rem]">
              {mode === 'onboarding' && (
                <div className="flex flex-col text-[3rem] font-bold">
                  <span className="">반가워요.</span>
                  <span className="">어떤 분인지 알려주세요!</span>
                </div>
              )}
              <div className="flex flex-col gap-[3.4rem]">
                <FieldMaster
                  title="닉네임 입력"
                  id="username"
                  variant="input"
                  isRequired
                  errorMessage={errors.username?.message}
                  inputProps={{
                    placeholder: '한글/영문/숫자만 가능해요.',
                    value: usernameValue,
                    ...register('username', {
                      validate: (value) => {
                        const hasEmoji = /[\p{Extended_Pictographic}]/gu.test(
                          value,
                        );
                        if (hasEmoji) {
                          return '이모지/이모티콘 사용은 불가능 해요.';
                        }

                        if (!/^[a-zA-Z0-9가-힣]*$/.test(value)) {
                          return '한글 자음/모음, 공백, 특수문자는 사용할 수 없어요.';
                        }

                        const byteLength = getByteLength(value);
                        if (byteLength > 0 && byteLength < 6) {
                          return '6~15byte 이내로 입력이 가능해요.';
                        }
                        return true;
                      },
                    }),
                    onChange: handleChange,
                    disabled: mode === 'edit',
                  }}
                  maxLength={15}
                />
                <div className="flex flex-col gap-[1rem]">
                  <div className="flex items-center gap-[0.2rem]">
                    <div className="flex items-center gap-[0.4rem]">
                      <span className="text-[1.6rem] font-semibold">
                        직무 및 사용 스킬
                      </span>
                      <div className="flex h-[1.8rem] w-[1.2rem] items-center">
                        <RequireIcon />
                      </div>
                    </div>
                    <span className="text-[1.2rem] font-medium text-error">
                      스킬은 최대 3개까지 선택할 수 있어요.
                    </span>
                  </div>
                  <div className="flex flex-col gap-[2rem]">
                    <div className="flex gap-[0.6rem]">
                      {positions.map((pos) => (
                        <BaseChip
                          variant="filled"
                          key={pos}
                          isSelected={activePosition === pos}
                          onClick={() => {
                            setValue('position', pos, { shouldDirty: true });
                            setValue('skills', [], {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          }}
                        >
                          {pos}
                        </BaseChip>
                      ))}
                    </div>
                    <div className="flex max-h-[14.2rem] flex-wrap gap-x-[0.6rem] gap-y-[1rem] overflow-y-auto pl-[0.1rem] pr-[2rem] pt-[0.1rem]">
                      {positionSkillData[activePosition].map((skill) => {
                        const isSelected = activeSkills.includes(skill);
                        const isDisabled =
                          !isSelected && activeSkills.length >= 3;
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
                            isSelected={isSelected}
                            disabled={isDisabled}
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
                  id="portfolioUrls"
                  variant="input"
                  errorMessage={errors.portfolioUrls?.message}
                  inputProps={{
                    ...register('portfolioUrls', {
                      pattern: {
                        value: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/,
                        message: '올바른 url을 사용해주셔야 해요.',
                      },
                    }),
                    value: portfolioUrlsValue,
                    placeholder: 'URL을 입력해주세요.',
                  }}
                />
                <FieldMaster
                  title="한줄소개"
                  id="bio"
                  variant="textarea"
                  errorMessage={errors.bio?.message}
                  textareaProps={{
                    placeholder:
                      'ex) 저는 프로젝트를 끝까지 책임지는 빌더와 같은 기획자예요. 주 2회 저녁 시간대에 참석할 수 있어요.',
                    value: introValue,
                    ...register('bio'),
                    onChange: handleBioChange,
                    onKeyDown: handleKeyDown,
                  }}
                  maxLength={100}
                />
              </div>
            </div>
            <div className="flex flex-col gap-[2.6rem]">
              <div className="flex w-full justify-center pb-[3.8rem]">
                <BaseButton
                  type="submit"
                  size="xl"
                  disabled={!isValid}
                  className="w-[25rem]"
                >
                  {mode === 'edit' ? '완료' : '다음'}
                </BaseButton>
              </div>
              {mode === 'edit' && (
                <div className="flex h-[3.8rem] justify-end pb-[2rem]">
                  <button
                    type="button"
                    onClick={() => setStep('deleteConfirm')}
                    className="cursor-pointer text-[1.2rem] font-semibold text-black-60"
                  >
                    회원 탈퇴
                  </button>
                </div>
              )}
            </div>
          </form>
        )}

        {step === 'deleteConfirm' && (
          <div className="relative flex h-[30.9rem] w-[48.8rem] justify-center rounded-[1.492rem] bg-black-5 py-[6.4rem]">
            <div className="flex w-[33.4rem] flex-col gap-[3.2rem]">
              <div className="flex w-[31.4rem] flex-col items-center gap-[0.8rem]">
                <span className="text-[2.2rem] font-bold text-black-100">
                  회원 탈퇴할까요?
                </span>
                <span className="whitespace-nowrap text-center text-[1.8rem] font-medium text-black-80">
                  탈퇴하면 참여 중인 팀에서 자동으로 나가며,
                  <br />
                  되돌릴 수 없어요.
                </span>
              </div>
              <div className="flex gap-[1.2rem]">
                <BaseButton
                  size="lg"
                  color="secondary"
                  onClick={() => setStep('edit')}
                  className="w-[16.1rem]"
                >
                  닫기
                </BaseButton>
                <BaseButton
                  size="lg"
                  onClick={handleDeleteUser}
                  className="w-[16.1rem]"
                >
                  탈퇴하기
                </BaseButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </ModalPortal>
  );
};

export default ProfileModal;
