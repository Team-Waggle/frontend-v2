import { Controller, useForm } from 'react-hook-form';
import BaseButton from '../components/common/Button';
import FieldMaster from '../components/Field/FieldMaster';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

// Icons
import NewTeamIcon from '../assets/icons/ic_character_new_team.svg?react';
import { useCreateTeamImage } from '../hooks/useTeam';

interface FormValues {
  name: string;
  description: string;
  workMode: 'ONLINE' | 'OFFLINE' | 'BOTH';
  profileImageUrl: string;
}

const TeamNewPage = () => {
  const { mutateAsync } = useCreateTeamImage();
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [file, setFile] = useState<File | null>(null);
  const [presignedUrl, setPresignedUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
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

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.png', '.jpg'] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      const selectedFile = acceptedFiles[0];
      if (!selectedFile) return;

      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));

      const type = selectedFile.type.split('/')[1].toUpperCase();

      mutateAsync(selectedFile.type, {
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

  const onSubmit = async (data: FormValues) => {
    if (!file || !presignedUrl) return;

    const type = file.type.split('/')[1].toUpperCase();

    await axios
      .put(presignedUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
      })
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
  };

  return (
    <div className="flex w-full flex-col items-center gap-[7rem]">
      <div className="relative flex h-[20rem] w-full justify-center bg-blue-10">
        <NewTeamIcon className="absolute top-[8.887rem]" />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-[17.9rem] flex w-[90rem] flex-col gap-[4rem]"
      >
        <span className="text-[2.4rem] font-bold text-black-100">
          새로운 팀을 만들어요!
        </span>
        <div className="flex h-[108.5rem] flex-col gap-[3.6rem]">
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
                maxLength: { value: 20, message: '최대 20자까지 가능합니다.' },
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

          <Controller
            name="description"
            control={control}
            rules={{ required: '상세 내용을 입력해주세요.' }}
            render={({ field }) => (
              <FieldMaster
                title="상세 소개 작성"
                id="detail"
                variant="detail"
                isRequired
                errorMessage={errors.description?.message}
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
          팀 만들기
        </BaseButton>
      </form>
    </div>
  );
};

export default TeamNewPage;
