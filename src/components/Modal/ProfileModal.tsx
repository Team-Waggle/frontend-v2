import React, { useEffect } from 'react';
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

  const onSubmit = async (data: FormValues) => {
    try {
      if (mode === 'onboarding') {
        const response = await getUserCheck(data.username);
        if (response?.available === false) {
          setError(
            'username',
            {
              type: 'manual',
              message: '이미 사용 중인 닉네임이에요.',
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
            onClose();
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
        message: '글자수를 초과했어요.',
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
        message: '글자수를 초과했어요.',
      });
      return;
    }

    clearErrors('bio');
    setValue('bio', value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  useModal({ isOpen, isOnboarding: mode === 'onboarding', onClose });
  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
      >
        <ModalOverlay onClose={onClose} isOnboarding={mode === 'onboarding'} />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative flex h-[63.2rem] w-[73.8rem] flex-col gap-[4rem] overflow-scroll overflow-y-scroll scroll-smooth rounded-[2rem] bg-white px-[4rem] pt-[4.4rem] scrollbar-hide"
        >
          <div className="flex w-full flex-col gap-[3.4rem]">
            {mode === 'onboarding' && (
              <div className="flex flex-col text-[3rem] font-bold">
                <span className="">반가워요!</span>
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
                  placeholder:
                    '한글/영문/숫자만 가능해요. 15byte 이내로 입력해 주세요.',
                  value: usernameValue,
                  ...register('username', {
                    required: '닉네임은 필수입니다.',
                    pattern: {
                      value: /^[a-zA-Z0-9가-힣]*$/,
                      message:
                        '한글 자음/모음, 공백, 특수문자는 사용할 수 없어요.',
                    },
                    validate: (value) => {
                      const byteLength = getByteLength(value);
                      if (byteLength > 0 && byteLength < 6) {
                        return '닉네임은 최소 6byte 이상이어야 합니다.';
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
                    최대 3개 선택 가능해요
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
                      message: '올바른 URL 형식을 입력해 주세요.',
                    },
                  }),
                  value: portfolioUrlsValue,
                  placeholder:
                    '현재 가지고 있는 포트폴리오 사이트가 있다면 URL을 입력해 주세요.',
                }}
              />
              <FieldMaster
                title="한줄소개"
                id="bio"
                variant="textarea"
                errorMessage={errors.bio?.message}
                textareaProps={{
                  placeholder:
                    'React로 MVP 빠르게 만들어요. 주 2회 저녁 참여 가능!',
                  value: introValue,
                  ...register('bio'),
                  onChange: handleBioChange,
                }}
                maxLength={100}
              />
            </div>
          </div>
          {mode === 'edit' && (
            <span
              onClick={() => deleteUser()}
              className="mx-auto cursor-pointer text-[1.6rem] font-semibold text-black-60"
            >
              회원 탈퇴하기
            </span>
          )}
          <div className="flex w-full justify-center pb-[3.8rem]">
            <BaseButton
              type="submit"
              size="xl"
              disabled={!isValid}
              className="w-[25rem]"
            >
              완료
            </BaseButton>
          </div>
        </form>
      </div>
    </ModalPortal>
  );
};

export default ProfileModal;
