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
    if (/[\p{Extended_Pictographic}]/gu.test(value)) {
      setError('name', {
        type: 'manual',
        message: '이모티콘은 사용할 수 없어요.',
      });
      return;
    }
    const byteLength = getByteLength(value);

    if (byteLength > 18) {
      setError('name', {
        type: 'manual',
        message: '글자수를 초과했어요.',
      });
      return;
    }

    clearErrors('name');
    setValue('name', value, {
      shouldValidate: true,
      shouldDirty: true,
    });
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
          navigate(`/team/${responseData.teamId}`);
        },
        onError: (error) => console.error(error),
      });
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
        <span className="text-[2.4rem] font-bold text-black-100">
          {isEditMode ? '팀 정보를 수정해요!' : '새로운 팀을 만들어요!'}
        </span>
        <div className="flex flex-col gap-[2.4rem]">
          <FieldMaster
            title="팀 명"
            id="title"
            variant="input"
            isRequired
            errorMessage={errors.name?.message}
            inputProps={{
              placeholder: '팀명을 입력해주세요',
              value: teamnameValue,
              ...register('name', {
                required: '팀 이름을 입력해주세요.',
                pattern: {
                  value: /^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ ]*$/,
                  message: '특수문자는 사용 불가합니다.',
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
              ...register('profileImageUrl', {
                required: '이미지를 첨부해주세요.',
              }),
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
            errorMessage={errors.description?.message}
            textareaProps={{
              placeholder:
                '팀 목표, 기술 스택 상세 정보, 지향하는 팀 문화 등을 자유롭게 작성해주세요.',
              value: descriptionValue,
              ...register('description', {
                required: '상세 소개를 작성해주세요.',
                validate: (value) => {
                  const byteLength = getByteLength(value);
                  const maxByte = 600;
                  if (byteLength > maxByte) {
                    return `글자수를 초과했어요.`;
                  }
                  return true;
                },
              }),
              maxLength: 600,
            }}
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
