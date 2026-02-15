import React, { forwardRef, memo } from 'react';
import type { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone';
import BaseChip from '../common/Chip/BaseChip';
import BaseButton from '../common/Button';
import IconWrapper from '../common/IconWrapper';

// @tiptap
import { useEditor, EditorContent } from '@tiptap/react';
import Link from '@tiptap/extension-link';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown } from '@tiptap/markdown';

// Icons
import ImageIcon from '../../assets/icons/normal/ic_image.svg?react';
import BoldIcon from '../../assets/icons/normal/ic_bold.svg?react';
import ItalicIcon from '../../assets/icons/normal/ic_italic.svg?react';
import List1Icon from '../../assets/icons/normal/ic_list1.svg?react';
import LinkIcon from '../../assets/icons/normal/ic_link.svg?react';
import DesktopIcon from '../../assets/icons/normal/ic_desktop.svg?react';
import LocationIcon from '../../assets/icons/normal/ic_location.svg?react';
import GlobeIcon from '../../assets/icons/normal/ic_globe.svg?react';
import MinusIcon from '../../assets/icons/normal/ic_minus.svg?react';
import PlusIcon from '../../assets/icons/normal/ic_plus.svg?react';
import Heading1Icon from '../../assets/icons/normal/ic_heading1.svg?react';
import Heading2Icon from '../../assets/icons/normal/ic_heading2.svg?react';
import Heading3Icon from '../../assets/icons/normal/ic_heading3.svg?react';
import Heading4Icon from '../../assets/icons/normal/ic_heading4.svg?react';

interface FieldInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
}

interface FieldTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  maxLength?: number;
}

interface FieldThumbnailProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  id: string;
  rootProps?: DropzoneRootProps;
  inputProps?: DropzoneInputProps;
  preview?: string;
}

type WorkmodeType = 'online' | 'offline' | 'both';

interface FieldWorkmodeProps {
  value?: WorkmodeType;
  onChange?: (value: WorkmodeType) => void;
}

interface FieldEditorProps {
  value: string;
  onChange: (content: string) => void;
}

interface FieldTeamNameProps {
  icon: React.ReactNode;
  name: string;
}

export const FieldInput = memo(
  forwardRef<HTMLInputElement, FieldInputProps>(
    ({ id, className, ...props }, ref) => {
      return (
        <input
          ref={ref}
          id={id}
          autoComplete="off"
          className={`h-[6rem] rounded-[0.8rem] border border-black-40 px-[1.8rem] py-[1.7rem] text-[1.6rem] font-medium ${className || ''}`}
          {...props}
        />
      );
    },
  ),
);

export const FieldTextarea = memo(
  forwardRef<HTMLTextAreaElement, FieldTextareaProps>(
    ({ id, maxLength, className, ...props }, ref) => {
      return (
        <textarea
          ref={ref}
          id={id}
          maxLength={maxLength}
          className={`h-[10.8rem] rounded-[0.8rem] border border-black-40 px-[1.8rem] py-[1.7rem] text-[1.6rem] font-medium ${className || ''}`}
          {...props}
        />
      );
    },
  ),
);

export const FieldThumbnail = memo(
  forwardRef<HTMLButtonElement, FieldThumbnailProps>(
    ({ id, preview, rootProps, inputProps }, ref) => {
      return (
        <button
          ref={ref}
          id={id}
          type="button"
          {...rootProps}
          className={`relative flex h-[17.4rem] flex-col items-center gap-[1.2rem] rounded-[0.8rem] border border-solid border-black-30 px-[1.8rem] py-[4rem]`}
        >
          <input {...inputProps} />
          {preview ? (
            <img
              src={preview}
              alt="미리보기"
              className="absolute inset-0 h-full w-full object-contain"
            />
          ) : (
            <>
              <ImageIcon className="h-[3.2rem] w-[3.2rem] text-black-40" />
              <div className="flex flex-col gap-[0.2rem]">
                <span className="text-[1.6rem] font-semibold text-black-90">
                  클릭하거나 파일을 드래그하여 업로드하세요
                </span>
                <span className="text-[1.6rem] font-medium text-black-60">
                  권장 사이즈: 1200x630 (PNG, JPG)
                </span>
              </div>
            </>
          )}
        </button>
      );
    },
  ),
);

export const FieldWorkmode = ({
  value = 'online',
  onChange,
}: FieldWorkmodeProps) => {
  return (
    <div className="flex gap-[0.9rem]">
      <BaseChip
        variant="card"
        mainIcon={<DesktopIcon />}
        isSelected={value === 'online'}
        className="h-[13.6rem] w-[29.4rem]"
        onClick={() => onChange?.('online')}
      >
        온라인
      </BaseChip>
      <BaseChip
        variant="card"
        mainIcon={<LocationIcon />}
        isSelected={value === 'offline'}
        className="h-[13.6rem] w-[29.4rem]"
        onClick={() => onChange?.('offline')}
      >
        오프라인
      </BaseChip>
      <BaseChip
        variant="card"
        mainIcon={<GlobeIcon />}
        isSelected={value === 'both'}
        className="h-[13.6rem] w-[29.4rem]"
        onClick={() => onChange?.('both')}
      >
        온라인 + 오프라인
      </BaseChip>
    </div>
  );
};

export const FieldEditor = memo(({ value, onChange }: FieldEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown,
      Link.configure({
        openOnClick: false, // 에디터 안에서 클릭 시 바로 이동 방지
        HTMLAttributes: {
          class: 'text-blue-500 underline pointer-events-none', // 링크 스타일 지정
        },
      }),
      Placeholder.configure({
        placeholder:
          '팀 목표, 기술 스택 상세 정보, 지향하는 팀 문화 등을 자유롭게 작성해주세요.',
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'focus:outline-none h-full overflow-y-auto',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  const setLink = () => {
    // 1. 이미 링크가 걸려있다면 해제(unset)
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    // 2. 링크가 없다면 주소 입력받기
    const url = window.prompt('연결할 URL 주소를 입력하세요:');

    // 취소 눌렀을 때 처리
    if (url === null) return;

    // 주소가 비어있으면 링크 해제, 있으면 링크 설정
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // 링크 적용
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .insertContent(url)
      .run();
  };

  return (
    <div className="h-[47.1rem] w-full">
      <div className="flex h-[6.4rem] gap-[2.4rem] rounded-tl-[0.8rem] rounded-tr-[0.8rem] border-x border-t border-black-30 bg-black-10 px-[1.8rem] py-[1.4rem]">
        <div className="flex gap-[0.2rem]">
          <IconWrapper
            color="transparent"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isSelected={editor.isActive('heading', { level: 1 })}
            className="h-[3.6rem] w-[3.6rem]"
          >
            <Heading1Icon />
          </IconWrapper>
          <IconWrapper
            color="transparent"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isSelected={editor.isActive('heading', { level: 2 })}
            className="h-[3.6rem] w-[3.6rem]"
          >
            <Heading2Icon />
          </IconWrapper>
          <IconWrapper
            color="transparent"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            isSelected={editor.isActive('heading', { level: 3 })}
            className="h-[3.6rem] w-[3.6rem]"
          >
            <Heading3Icon />
          </IconWrapper>
          <IconWrapper
            color="transparent"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            isSelected={editor.isActive('heading', { level: 4 })}
            className="h-[3.6rem] w-[3.6rem]"
          >
            <Heading4Icon />
          </IconWrapper>
        </div>
        <div className="flex gap-[0.6rem]">
          <IconWrapper
            color="transparent"
            onClick={() => editor.chain().focus().toggleBold().run()}
            isSelected={editor.isActive('bold')}
            className="h-[3.6rem] w-[3.6rem]"
          >
            <BoldIcon />
          </IconWrapper>
          <IconWrapper
            color="transparent"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isSelected={editor.isActive('italic')}
            className="h-[3.6rem] w-[3.6rem]"
          >
            <ItalicIcon />
          </IconWrapper>
          <IconWrapper
            color="transparent"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isSelected={editor.isActive('bulletList')}
            className="h-[3.6rem] w-[3.6rem]"
          >
            <List1Icon />
          </IconWrapper>
          <IconWrapper
            color="transparent"
            onClick={setLink}
            isSelected={editor.isActive('link')}
            className="h-[3.6rem] w-[3.6rem]"
          >
            <LinkIcon />
          </IconWrapper>
          <IconWrapper
            color="transparent"
            // isSelected={editor.isActive('')}
            className="h-[3.6rem] w-[3.6rem]"
          >
            <ImageIcon />
          </IconWrapper>
        </div>
      </div>
      <div className="h-[39.9rem] w-full rounded-bl-[0.8rem] rounded-br-[0.8rem] border-x border-b border-black-30 bg-black-5 px-[1.8rem] py-[1.7rem] text-[1.6rem] font-medium">
        <EditorContent editor={editor} className="prose-list h-full" />
      </div>
    </div>
  );
});

FieldEditor.displayName = 'FieldEditor';

export const FieldTeamName = ({ icon, name }: FieldTeamNameProps) => {
  return (
    <div className="grid grid-cols-4 gap-[1rem]">
      <BaseChip variant="teamOutline" mainIcon={icon}>
        {name}
      </BaseChip>
    </div>
  );
};

export const FieldPosition = () => {
  return (
    <div className="flex items-center gap-[0.8rem]">
      <div className="grid grid-cols-6 gap-[0.6rem]">
        <BaseChip className="w-[9.2rem]">기획</BaseChip>
        <BaseChip className="w-[9.2rem]">디자인</BaseChip>
        <BaseChip className="w-[9.2rem]">프론트엔드</BaseChip>
        <BaseChip className="w-[9.2rem]">백엔드</BaseChip>
        <BaseChip className="w-[9.2rem]">마케팅</BaseChip>
        <BaseChip className="w-[9.2rem]">기타</BaseChip>
      </div>
      <div className="flex items-center gap-[3.6rem]">
        <div className="flex items-center gap-[0.8rem] py-[0.8rem]">
          <button
            type="button"
            className="flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-full border border-solid border-black-30 bg-black-5"
          >
            <MinusIcon className="h-[1.745rem] w-[1.745rem]" />
          </button>
          <div className="flex h-[4rem] w-[4rem] items-center justify-center px-[0.8rem] text-[2rem] font-semibold text-blue-80">
            1
          </div>
          <button
            type="button"
            className="flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-full border border-solid border-black-30 bg-black-5"
          >
            <PlusIcon className="h-[1.745rem] w-[1.745rem]" />
          </button>
        </div>
        <div className="flex gap-[0.8rem]">
          <BaseButton size="sm" className="w-[6.8rem]">
            추가
          </BaseButton>
        </div>
      </div>
    </div>
  );
};
