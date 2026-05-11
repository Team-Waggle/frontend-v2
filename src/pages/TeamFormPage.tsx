import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Controller, useForm } from 'react-hook-form';
import BaseButton from '../components/common/Button';
import FieldMaster from '../components/Field/FieldMaster';
import { useDropzone } from 'react-dropzone';
import {
  useCreateTeam,
  useCreateTeamImage,
  useGetTeamDetail,
  useUpdateTeam,
} from '../hooks/useTeam';
import { getByteLength } from '../utils/getByteLength';

// Icons
import NewTeamIcon from '../assets/icons/ic_character_new_team.svg?react';

interface FormValues {
  name: string;
  description: string;
  workMode: 'ONLINE' | 'OFFLINE' | 'HYBRID';
  profileImageUrl: string;
}

const TeamFormPage = () => {
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId: string }>();
  const isEditMode = Boolean(teamId);

  const { data: teamData } = useGetTeamDetail(Number(teamId));
  const { mutate: createImage } = useCreateTeamImage();
  const { mutate: createTeam } = useCreateTeam();
  const { mutate: updateTeam } = useUpdateTeam();

  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [file, setFile] = useState<File | null>(null);
  const [presignedUrl, setPresignedUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      workMode: 'ONLINE',
      profileImageUrl: '',
    },
  });

  const teamnameValue = watch('name', '');
  const descriptionValue = watch('description', '');

  useEffect(() => {
    if (isEditMode && teamData) {
      reset({
        name: teamData.name,
        profileImageUrl: teamData.profileImageUrl,
        workMode: teamData.workMode,
        description: teamData.description,
      });
      setPreview(teamData.profileImageUrl);
    }
  }, [isEditMode, teamData, reset]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.png', '.jpg'] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      const selectedFile = acceptedFiles[0];
      if (!selectedFile) return;

      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));

      createImage(selectedFile.type, {
        onSuccess: ({ presignedUrl, objectUrl }) => {
          setPresignedUrl(presignedUrl);
          setValue('profileImageUrl', objectUrl, { shouldValidate: true });
        },
        onError: (error) => {
          console.error(error);
        },
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const byteLength = getByteLength(value);

    if (byteLength > 18) {
      setError('name', {
        type: 'manual',
        message: '최대 18byte까지 입력할 수 있어요.',
      });
      return;
    }

    clearErrors('name');
    setValue('name', value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const value = e.target.value.replace(/\n/g, ' ');
    const byteLength = getByteLength(value);

    if (byteLength > 600) {
      setError('description', {
        type: 'manual',
        message: '최대 600byte까지 입력이 가능해요.',
      });
      return;
    }

    clearErrors('description');
    setValue('description', value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setError('description', {
        type: 'manual',
        message: '줄바꿈은 사용할 수 없어요.',
      });
      return;
    }

    clearErrors('description');
  };

  const onSubmit = async (data: FormValues) => {
    if (file && presignedUrl) {
      try {
        await axios.put(presignedUrl, file, {
          headers: { 'Content-Type': file.type },
        });
      } catch (error) {
        console.error('이미지 파일 업로드 실패:', error);
        return;
      }
    }

    if (isEditMode) {
      updateTeam(
        { teamId: Number(teamId), teamData: data },
        {
          onSuccess: () => {
            navigate(`/team/${teamId}`);
          },
          onError: (error) => console.error(error),
        },
      );
    } else {
      if (!file || !presignedUrl) return;

      createTeam(data, {
        onSuccess: (responseData) => {
          navigate(`/team/${responseData.id}`);
        },
        onError: (error) => console.error(error),
      });
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-[7rem]">
      <div className="relative flex h-[20rem] w-full justify-center bg-blue-10">
        <NewTeamIcon className="absolute top-[8.887rem] max-w-full" />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-[17.9rem] flex w-[90rem] max-w-full flex-col gap-[4rem]"
      >
        <span className="text-[2.4rem] font-bold text-black-100">
          {isEditMode ? '우리 팀을 수정해요.' : '새로운 팀을 만들어요.'}
        </span>
        <div className="flex h-[74.7rem] flex-col gap-[3.6rem]">
          <FieldMaster
            title="팀 명"
            id="title"
            variant="input"
            isRequired
            isError={Boolean(errors.name)}
            errorMessage={errors.name?.message}
            inputProps={{
              placeholder: '한글/영문/숫자만 가능해요.',
              value: teamnameValue,
              ...register('name', {
                required: true,
                pattern: {
                  value: /^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ ]*$/,
                  message: '특수문자와 이모지는 사용할 수 없어요.',
                },
                validate: (value) => {
                  if (value.trim().length === 0) {
                    return '공백만 입력할 수 없습니다.';
                  }
                  return true;
                },
              }),
              onChange: handleChange,
            }}
            maxLength={18}
          />

          <FieldMaster
            title="대표 이미지"
            id="thumbnail"
            variant="thumbnail"
            isRequired
            thumbnailProps={{
              ...register('profileImageUrl', { required: true }),
              rootProps: getRootProps(),
              inputProps: getInputProps(),
              preview,
            }}
          />

          <Controller
            name="workMode"
            control={control}
            render={({ field }) => (
              <FieldMaster
                title="팀 운영 및 진행 방식을 선택합니다."
                id="workmode"
                variant="workmode"
                isRequired
                workmodeProps={{
                  value: field.value,
                  onChange: field.onChange,
                }}
              />
            )}
          />

          <FieldMaster
            title="상세 소개 작성"
            id="description"
            variant="textarea"
            isRequired
            isError={Boolean(errors.description)}
            errorMessage={errors.description?.message}
            textareaProps={{
              placeholder:
                '예) 목표: 6주 안에 MVP 출시 / 진행방식: 주 2회 저녁 / 사용 기술: React, NestJS',
              value: descriptionValue,
              ...register('description', { required: true }),
              onChange: handleDescriptionChange,
              onKeyDown: handleKeyDown,
            }}
            maxLength={600}
          />
        </div>
        <BaseButton
          type="submit"
          size="lg"
          disabled={!isValid}
          className="mx-auto w-[32rem]"
        >
          {isEditMode ? '수정하기' : '팀 만들기'}
        </BaseButton>
      </form>
    </div>
  );
};

export default TeamFormPage;
