import { useEffect } from 'react';
import { useParams } from 'react-router';
import { Controller, useForm } from 'react-hook-form';
import BaseButton from '../components/common/Button';
import FieldMaster from '../components/Field/FieldMaster';
import type { RecruitmentsValue } from '../components/Field/FieldBody';
import { useGetUserMeTeam } from '../hooks/useUser';
import {
  useCreatePosts,
  useGetPostDetail,
  useUpdatePosts,
} from '../hooks/usePost';
import { POSITION_CONVERTER, type PositionKey } from '../utils/position';
import { toSkillEnum, toSkillLabel } from '../utils/skill';
import { getByteLength } from '../utils/getByteLength';

// Icons
import NewTeamIcon from '../assets/icons/ic_character_new_post.svg?react';

interface FormValues {
  teamId: number;
  title: string;
  recruitments: RecruitmentsValue[];
  skills: string[];
  content: string;
}

const PostFormPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const isEditMode = Boolean(postId);
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    setError,
    clearErrors,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      teamId: undefined,
      title: '',
      recruitments: [],
      skills: [],
      content: '',
    },
  });

  const { data: myTeamData } = useGetUserMeTeam();
  const { data: myPostData } = useGetPostDetail(Number(postId));
  const { mutate: createPosts } = useCreatePosts();
  const { mutate: updatePosts } = useUpdatePosts();

  const postnameValue = watch('title', '');

  useEffect(() => {
    if (isEditMode && myPostData) {
      reset({
        teamId: myPostData.team.teamId,
        title: myPostData.title,
        recruitments: myPostData.recruitments.map((item) => ({
          ...item,
          position: POSITION_CONVERTER[item.position] as PositionKey,
          skills: item.skills?.map((skill) => toSkillLabel(skill)),
        })),
        content: myPostData.content,
      });
    }
  }, [isEditMode, myPostData, reset]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const byteLength = getByteLength(value);

    if (byteLength > 30) {
      setError('title', {
        type: 'manual',
        message: '글자수를 초과했어요.',
      });
      return;
    }

    clearErrors('title');
    setValue('title', value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = (data: FormValues) => {
    const formattedData = {
      ...data,
      recruitments: data.recruitments.map((item) => ({
        ...item,
        position:
          POSITION_CONVERTER[item.position as PositionKey] || item.position,
        skills: item.skills?.map((skill) => toSkillEnum(skill)),
      })),
    };

    if (isEditMode) {
      updatePosts({ postId: Number(postId), postData: formattedData });
    } else {
      createPosts(formattedData);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-[4rem]">
      <div className="relative flex h-[14rem] w-full justify-center bg-blue-10">
        <NewTeamIcon className="absolute top-[5rem] max-w-full" />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-[90rem] max-w-full flex-col gap-[2.4rem] px-[2rem] pb-[4rem]"
      >
        <span className="text-[2.4rem] font-bold">
          {isEditMode ? '모집글 수정해요!' : '모집글 작성해요!'}
        </span>
        <div className="flex flex-col gap-[2.4rem]">
          <Controller
            name="teamId"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <FieldMaster
                title="팀 선택"
                variant="teamname"
                isRequired
                teamnameProps={{
                  data: myTeamData ?? [],
                  value: field.value,
                  onChange: field.onChange,
                }}
              />
            )}
          />
          <FieldMaster
            title="제목"
            id="title"
            variant="input"
            isRequired
            errorMessage={errors.title?.message}
            inputProps={{
              placeholder: '최대 30자 제한',
              value: postnameValue,
              ...register('title'),
              onChange: handleChange,
            }}
            maxLength={30}
          />

          <Controller
            name="recruitments"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <FieldMaster
                title="모집 직무 및 사용 스킬"
                variant="positionSkill"
                isRequired
                positionSkillProps={{
                  value: field.value,
                  onChange: field.onChange,
                }}
              />
            )}
          />

          <Controller
            name="content"
            control={control}
            rules={{ required: '상세 내용을 입력해주세요.' }}
            render={({ field }) => (
              <FieldMaster
                title="상세 내용"
                id="detail"
                variant="detail"
                isRequired
                errorMessage={errors.content?.message}
                detailProps={{
                  value: field.value,
                  onChange: field.onChange,
                }}
              />
            )}
          />
        </div>
        <BaseButton
          type="submit"
          size="lg"
          disabled={!isValid}
          className="mx-auto w-[32rem]"
        >
          {isEditMode ? '수정하기' : '작성하기'}
        </BaseButton>
      </form>
    </div>
  );
};

export default PostFormPage;
