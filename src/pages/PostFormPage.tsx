import { Controller, useForm } from 'react-hook-form';
import BaseButton from '../components/common/Button';
import FieldMaster from '../components/Field/FieldMaster';
import type { PositionValue } from '../components/Field/FieldBody';
import { useGetUserMeTeam } from '../hooks/userUser';

// Icons
import NewTeamIcon from '../assets/icons/ic_character_new_post.svg?react';

interface FormValues {
  teamId: number;
  title: string;
  recruitments: PositionValue[];
  skills: string[];
  content: string;
}

const PostFormPage = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      recruitments: [{ position: null, recruitingCount: 1 }],
      skills: [],
    },
  });

  const { data: myTeamData } = useGetUserMeTeam();

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <div className="flex w-full flex-col items-center gap-[7rem]">
      <div className="relative flex h-[20rem] w-full justify-center bg-blue-10">
        <NewTeamIcon className="absolute top-[8.887rem] max-w-full" />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-[90rem] max-w-full flex-col gap-[4rem] pb-[4.4rem]"
      >
        <span className="text-[2.4rem] font-bold">모집글 작성해요!</span>
        <div className="flex flex-col gap-[3.6rem]">
          <Controller
            name="teamId"
            control={control}
            render={({ field }) => (
              <FieldMaster
                title="팀 선택"
                variant="teamname"
                isRequired
                teamnameProps={{
                  data: myTeamData,
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
              placeholder: '최대 10자 제한 / 특수문자 불가',
              ...register('title', {
                required: '제목을 입력해주세요.',
                maxLength: { value: 10, message: '최대 10자까지 가능합니다.' },
                pattern: {
                  value: /^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ]*$/,
                  message: '특수문자는 사용 불가합니다.',
                },
              }),
            }}
          />

          <Controller
            name="recruitments"
            control={control}
            render={({ field }) => (
              <FieldMaster
                title="모집 직무"
                variant="multiPosition"
                isRequired
                multiPositionProps={{
                  value: field.value,
                  onChange: field.onChange,
                  hasButton: true,
                }}
              />
            )}
          />

          <Controller
            name="skills"
            control={control}
            render={({ field }) => (
              <FieldMaster
                title="사용 스킬"
                variant="skill"
                isRequired
                skillProps={{ value: field.value, onChange: field.onChange }}
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
          작성하기
        </BaseButton>
      </form>
    </div>
  );
};

export default PostFormPage;
