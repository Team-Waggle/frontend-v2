import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Controller, useForm } from 'react-hook-form';
import BaseButton from '../components/common/Button';
import FieldMaster from '../components/Field/FieldMaster';
import { useDropzone } from 'react-dropzone';
import { useCreateTeam, useCreateTeamImage } from '../hooks/useTeam';

// Icons
import NewTeamIcon from '../assets/icons/ic_character_new_team.svg?react';

interface FormValues {
  name: string;
  description: string;
  workMode: 'ONLINE' | 'OFFLINE' | 'HYBRID';
  profileImageUrl: string;
}

const TeamNewPage = () => {
  const { mutate: createImage } = useCreateTeamImage();
  const { mutate: createTeam } = useCreateTeam();
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [file, setFile] = useState<File | null>(null);
  const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
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

  const descriptionValue = watch('description', '');

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

  const onSubmit = (data: FormValues) => {
    if (!file || !presignedUrl) return;

    createTeam(data, {
      onSuccess: (data) => {
        axios.put(presignedUrl, file, {
          headers: { 'Content-Type': file.type },
        });
        navigate(`/team/${data.teamId}`);
      },
      onError: (error) => console.error(error),
    });
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
          새로운 팀을 만들어요!
        </span>
        <div className="flex h-[74.7rem] flex-col gap-[3.6rem]">
          <FieldMaster
            title="팀 명"
            id="title"
            variant="input"
            isRequired
            errorMessage={errors.name?.message}
            inputProps={{
              placeholder: '특수문자 제한, 최대 글자 수 20자',
              ...register('name', {
                required: '팀 이름을 입력해주세요.',
                maxLength: {
                  value: 20,
                  message: '최대 20자까지 가능합니다.',
                },
                pattern: {
                  value: /^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ]*$/,
                  message: '특수문자는 사용 불가합니다.',
                },
              }),
            }}
          />

          <FieldMaster
            title="대표 이미지"
            id="thumbnail"
            variant="thumbnail"
            isRequired
            thumbnailProps={{
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
                onChange: (e) => {
                  const value = e.target.value;
                  if (value.length > 200) {
                    setValue('description', value.slice(0, 200));
                  }
                },
                validate: (value) =>
                  value.length <= 200 || '200자 이내로 입력해주세요.',
              }),
              maxLength: 200,
            }}
          />
        </div>
        <BaseButton
          type="submit"
          size="lg"
          disabled={!isValid}
          className="mx-auto w-[32rem]"
        >
          팀 만들기
        </BaseButton>
      </form>
    </div>
  );
};

export default TeamNewPage;
