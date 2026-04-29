import type React from 'react';
import {
  FieldInput,
  FieldTextarea,
  FieldThumbnail,
  FieldEditor,
  FieldWorkmode,
  FieldTeamName,
  FieldPositionSkill,
  type RecruitmentsValue,
  FieldTab,
  FieldPosition,
} from './FieldBody';
import type { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone';
import type { TeamResponse } from '../../types/api/team';
import type { PositionType } from '../../types/api/posts';

//  Icons
import RequireIcon from '../../assets/icons/ic_require.svg?react';

/* 
  title: 소개박스 제목
  id: label과 input or textarea를 묶기 위한 값
  variant: body 종류
  isRequired: 필수 아이콘 여부
  errorMessage: 에러 메시지
  maxLength: textarea 최대 글자 수
  inputProps: input에 쓰이는 placeholder, register
  textareaProps: textarea에 쓰이는 placeholder, register
*/

interface FiledMasterProps {
  title: string;
  id?: string;
  variant?:
    | 'input'
    | 'textarea'
    | 'thumbnail'
    | 'workmode'
    | 'detail'
    | 'teamname'
    | 'position'
    | 'positionSkill'
    | 'tab';
  isRequired?: boolean;
  errorMessage?: string;
  warningMessage?: string;
  maxLength?: number;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  thumbnailProps?: DropzoneRootProps & {
    inputProps?: DropzoneInputProps;
    preview?: string;
  };
  workmodeProps?: {
    value?: 'ONLINE' | 'OFFLINE' | 'HYBRID';
    onChange?: (value: 'ONLINE' | 'OFFLINE' | 'HYBRID') => void;
  };
  detailProps?: {
    value: string;
    onChange: (content: string) => void;
  };
  teamnameProps?: {
    data: TeamResponse[];
    value: number;
    onChange: (teamId: number) => void;
  };
  positionProps?: {
    value?: PositionType | null;
    onChange?: (value: PositionType) => void;
  };
  positionSkillProps?: {
    value?: RecruitmentsValue[];
    onChange?: (value: RecruitmentsValue[]) => void;
  };
  tabProps?: {
    value?: string[];
    onChange?: (value: string[]) => void;
    options: string[];
    type?: 'LIKE' | 'DISLIKE';
  };
}

const FieldMaster = ({
  title,
  id,
  variant,
  isRequired = false,
  errorMessage,
  warningMessage,
  maxLength,
  inputProps,
  textareaProps,
  thumbnailProps,
  workmodeProps,
  detailProps,
  teamnameProps,
  positionProps,
  positionSkillProps,
  tabProps,
}: FiledMasterProps) => {
  const renderBody = {
    input: () => (
      <FieldInput
        id={id || ''}
        {...inputProps}
        error={errorMessage}
        maxLength={maxLength}
      />
    ),
    textarea: () => (
      <FieldTextarea
        id={id || ''}
        maxLength={maxLength}
        error={errorMessage}
        {...textareaProps}
      />
    ),
    thumbnail: () => <FieldThumbnail id={id || ''} {...thumbnailProps} />,
    workmode: () => <FieldWorkmode {...workmodeProps} />,
    detail: () => detailProps && <FieldEditor {...detailProps} />,
    teamname: () => teamnameProps && <FieldTeamName {...teamnameProps} />,
    position: () => <FieldPosition {...positionProps} />,
    positionSkill: () =>
      positionSkillProps && <FieldPositionSkill {...positionSkillProps} />,
    tab: () => tabProps && <FieldTab {...tabProps} />,
  };

  return (
    <div className="flex flex-col gap-[1rem]">
      <div className="flex items-center gap-[0.2rem]">
        <div className="flex items-center gap-[0.4rem]">
          <label
            htmlFor={id}
            className="text-[1.6rem] font-semibold text-black-100"
          >
            {title}
          </label>
          <div className="flex h-[1.8rem] w-[1.2rem] items-center empty:hidden">
            {isRequired && <RequireIcon />}
          </div>
        </div>
        {errorMessage && (
          <span className="text-[1.2rem] font-medium text-error">
            {errorMessage}
          </span>
        )}
        {warningMessage && (
          <span className="text-[1.2rem] font-medium text-error">
            {warningMessage}
          </span>
        )}
      </div>

      {variant && renderBody[variant]?.()}
    </div>
  );
};

export default FieldMaster;
