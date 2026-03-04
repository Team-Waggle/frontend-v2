import React, { forwardRef, memo, useEffect, useRef, useState } from 'react';
import type { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone';
import BaseChip from '../common/Chip/BaseChip';
import BaseButton from '../common/Button';
import IconWrapper from '../common/IconWrapper';
import { SkillIcon } from '../../utils/SkillIcon';

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
import ProfileBasicIcon from '../../assets/icons/ic_profile_basic.svg?react';

interface FieldInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  error?: string;
}

interface FieldTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  error?: string;
  maxLength?: number;
}

interface FieldThumbnailProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  id: string;
  rootProps?: DropzoneRootProps;
  inputProps?: DropzoneInputProps;
  preview?: string;
}

type WorkmodeType = 'ONLINE' | 'OFFLINE' | 'BOTH';

interface FieldWorkmodeProps {
  value?: WorkmodeType;
  onChange?: (value: WorkmodeType) => void;
}

interface FieldEditorProps {
  value: string;
  onChange: (content: string) => void;
}

interface TeamData {
  teamId: number;
  name: string;
  description: string;
  profileImageUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface FieldTeamNameProps {
  data: TeamData[];
  value: number;
  onChange: (teamId: number) => void;
}

export type PositionType =
  | 'PM'
  | 'Design'
  | 'Frontend'
  | 'Backend'
  | 'Marketing'
  | 'etc'
  | '';

export type PositionValue = {
  position: PositionType | null;
  recruitingCount: number;
};

interface FieldSinglePositionProps {
  value?: PositionType | null;
  onChange?: (value: PositionType) => void;
}

interface FieldMultiPositionProps {
  value?: PositionValue[];
  onChange?: (value: PositionValue[]) => void;
  hasButton?: boolean;
}

interface FieldSkillProps {
  value?: string[];
  onChange?: (value: string[]) => void;
}

interface FieldTabProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  options?: string[];
}

export const FieldInput = memo(
  forwardRef<HTMLInputElement, FieldInputProps>(
    ({ id, error, className, ...props }, ref) => {
      return (
        <input
          ref={ref}
          id={id}
          autoComplete="off"
          className={`h-[6rem] rounded-[0.8rem] border px-[1.8rem] py-[1.7rem] text-[1.6rem] font-medium ${
            error
              ? 'border-error'
              : 'border-black-100 placeholder-shown:border-black-30 focus:border-blue-80'
          } ${className || ''}`}
          {...props}
        />
      );
    },
  ),
);

export const FieldTextarea = memo(
  forwardRef<HTMLTextAreaElement, FieldTextareaProps>(
    ({ id, error, maxLength = 500, className, ...props }, ref) => {
      return (
        <div className="flex flex-col items-end gap-[0.4rem]">
          <textarea
            ref={ref}
            id={id}
            maxLength={maxLength}
            className={`h-[10.8rem] w-full rounded-[0.8rem] border px-[1.8rem] py-[1.7rem] text-[1.6rem] font-medium ${
              error
                ? 'border-error'
                : 'border-black-100 placeholder-shown:border-black-30 focus:border-blue-80'
            } ${className || ''}`}
            {...props}
          />
          <span className="text-[1.4rem] font-medium text-black-60">
            {String(props.value || '').length}/{maxLength}
          </span>
        </div>
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
  value = 'ONLINE',
  onChange,
}: FieldWorkmodeProps) => {
  return (
    <div className="flex gap-[0.9rem]">
      <BaseChip
        variant="card"
        mainIcon={<DesktopIcon />}
        isSelected={value === 'ONLINE'}
        className="h-[13.6rem] w-[29.4rem]"
        onClick={() => onChange?.('ONLINE')}
      >
        온라인
      </BaseChip>
      <BaseChip
        variant="card"
        mainIcon={<LocationIcon />}
        isSelected={value === 'OFFLINE'}
        className="h-[13.6rem] w-[29.4rem]"
        onClick={() => onChange?.('OFFLINE')}
      >
        오프라인
      </BaseChip>
      <BaseChip
        variant="card"
        mainIcon={<GlobeIcon />}
        isSelected={value === 'BOTH'}
        className="h-[13.6rem] w-[29.4rem]"
        onClick={() => onChange?.('BOTH')}
      >
        온라인 + 오프라인
      </BaseChip>
    </div>
  );
};

export const FieldEditor = memo(({ value, onChange }: FieldEditorProps) => {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isLinkActiveUI, setIsLinkActiveUI] = useState(false);

  const linkModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        linkModalRef.current &&
        !linkModalRef.current.contains(event.target as Node)
      ) {
        setIsLinkModalOpen(false);
        setIsLinkActiveUI(false);
      }
    };

    if (isLinkModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLinkModalOpen]);

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

  const openLinkModal = () => {
    // 이미 링크가 활성화된 상태라면 링크 해제
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    // 링크가 없다면 입력 모달 열기
    setIsLinkActiveUI(true);
    setUrlInput(''); // 이전 입력값 초기화
    setIsLinkModalOpen(true);
  };

  // 2. 모달에서 '확인' 버튼을 눌렀을 때 호출
  const applyLink = () => {
    if (urlInput.trim() === '') {
      setIsLinkModalOpen(false);
      setIsLinkActiveUI(false);
      return;
    }

    const from = editor.state.selection.from;
    const to = from + urlInput.length;

    editor
      .chain()
      .focus()
      .insertContent(urlInput)
      .setTextSelection({ from, to }) // 방금 삽입한 텍스트 선택
      .setLink({ href: urlInput }) // 링크 적용
      .setTextSelection(to) // 커서를 링크 끝으로 이동
      .run();

    editor.commands.unsetMark('link');

    setIsLinkModalOpen(false);
    setIsLinkActiveUI(false);
    setUrlInput('');
  };

  return (
    <div className="relative h-[47.1rem] w-full">
      <div className="flex h-[6.4rem] items-center gap-[2.4rem] rounded-tl-[0.8rem] rounded-tr-[0.8rem] border-x border-t border-black-30 bg-black-10 px-[1.8rem] py-[1.4rem]">
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
            onClick={openLinkModal}
            isSelected={isLinkActiveUI}
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
      {isLinkModalOpen && (
        <div
          ref={linkModalRef}
          className="absolute left-[6.3rem] top-[6.2rem] z-50 flex w-[36.2rem] gap-[0.8rem] rounded-lg border bg-white px-[1rem] py-[0.8rem]"
        >
          <input
            autoFocus
            className="h-[3.2rem] w-[27.7rem] rounded-[0.6rem] border-2 border-blue-90 px-[1rem] py-[0.6rem] text-[1.6rem] font-medium"
            placeholder="링크를 입력해 주세요."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') applyLink();
              if (e.key === 'Escape') {
                setIsLinkModalOpen(false);
                setIsLinkActiveUI(false);
              }
            }}
          />
          <BaseButton
            size="sm"
            color="tertiary"
            disabled={!urlInput}
            onClick={applyLink}
            className="w-[5.7rem] whitespace-nowrap"
          >
            확인
          </BaseButton>
        </div>
      )}
    </div>
  );
});

FieldEditor.displayName = 'FieldEditor';

export const FieldTeamName = ({
  data,
  value,
  onChange,
}: FieldTeamNameProps) => {
  return (
    <div className="grid grid-cols-4 gap-[1rem]">
      {data?.map((team) => (
        <BaseChip
          key={team.teamId}
          variant="teamOutline"
          mainIcon={team?.profileImageUrl || <ProfileBasicIcon />}
          isSelected={value === team.teamId}
          onClick={() => onChange?.(team.teamId)}
        >
          {team.name}
        </BaseChip>
      ))}
    </div>
  );
};

export const FieldSinglePosition = ({
  value,
  onChange,
}: FieldSinglePositionProps) => {
  const handleChange = (newValue: PositionType) => {
    onChange?.(newValue);
  };

  return (
    <div className="flex gap-[0.6rem]">
      <BaseChip
        isSelected={value === 'PM'}
        onClick={() => handleChange('PM')}
        className="w-[9.2rem]"
      >
        기획
      </BaseChip>
      <BaseChip
        isSelected={value === 'Design'}
        onClick={() => handleChange('Design')}
        className="w-[9.2rem]"
      >
        디자인
      </BaseChip>
      <BaseChip
        isSelected={value === 'Frontend'}
        onClick={() => handleChange('Frontend')}
        className="w-[9.2rem]"
      >
        프론트엔드
      </BaseChip>
      <BaseChip
        isSelected={value === 'Backend'}
        onClick={() => handleChange('Backend')}
        className="w-[9.2rem]"
      >
        백엔드
      </BaseChip>
      <BaseChip
        isSelected={value === 'Marketing'}
        onClick={() => handleChange('Marketing')}
        className="w-[9.2rem]"
      >
        마케팅
      </BaseChip>
      <BaseChip
        isSelected={value === 'etc'}
        onClick={() => handleChange('etc')}
        className="w-[9.2rem]"
      >
        기타
      </BaseChip>
    </div>
  );
};

export const FieldPosition = ({
  value = [{ position: null, recruitingCount: 1 }],
  onChange,
  hasButton = false,
}: FieldMultiPositionProps) => {
  const positions = value;

  const handleChange = (index: number, newValue: PositionType) => {
    const updated = positions.map((item, i) =>
      i === index ? { ...item, position: newValue } : item,
    );
    onChange?.(updated);
  };

  const handleCountChange = (index: number, delta: number) => {
    const updated = positions.map((item, i) => {
      if (i === index) {
        const newCount = Math.max(1, item.recruitingCount + delta);
        return { ...item, recruitingCount: newCount };
      }
      return item;
    });
    onChange?.(updated);
  };

  const handleAdd = () => {
    onChange?.([...positions, { position: null, recruitingCount: 1 }]);
  };

  const handleRemove = (index: number) => {
    if (positions.length === 1) return; // 최소 1개 유지
    onChange?.(positions.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-[0.8rem]">
      {positions.map((selevtedValue, index) => (
        <div key={index} className="flex items-center gap-[0.8rem]">
          <div className="grid grid-cols-6 gap-[0.6rem]">
            <BaseChip
              isSelected={selevtedValue.position === 'PM'}
              onClick={() => handleChange(index, 'PM')}
              className="w-[9.2rem]"
            >
              기획
            </BaseChip>
            <BaseChip
              isSelected={selevtedValue.position === 'Design'}
              onClick={() => handleChange(index, 'Design')}
              className="w-[9.2rem]"
            >
              디자인
            </BaseChip>
            <BaseChip
              isSelected={selevtedValue.position === 'Frontend'}
              onClick={() => handleChange(index, 'Frontend')}
              className="w-[9.2rem]"
            >
              프론트엔드
            </BaseChip>
            <BaseChip
              isSelected={selevtedValue.position === 'Backend'}
              onClick={() => handleChange(index, 'Backend')}
              className="w-[9.2rem]"
            >
              백엔드
            </BaseChip>
            <BaseChip
              isSelected={selevtedValue.position === 'Marketing'}
              onClick={() => handleChange(index, 'Marketing')}
              className="w-[9.2rem]"
            >
              마케팅
            </BaseChip>
            <BaseChip
              isSelected={selevtedValue.position === 'etc'}
              onClick={() => handleChange(index, 'etc')}
              className="w-[9.2rem]"
            >
              기타
            </BaseChip>
          </div>
          {hasButton && (
            <div className="flex items-center gap-[3.6rem]">
              <div className="flex items-center gap-[0.8rem] py-[0.8rem]">
                <button
                  type="button"
                  onClick={() => handleCountChange(index, -1)}
                  className="flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-full border border-solid border-black-30 bg-black-5"
                >
                  <MinusIcon className="h-[1.745rem] w-[1.745rem]" />
                </button>
                <div className="flex h-[4rem] w-[4rem] items-center justify-center px-[0.8rem] text-[2rem] font-semibold text-blue-80">
                  {selevtedValue.recruitingCount}
                </div>
                <button
                  type="button"
                  onClick={() => handleCountChange(index, 1)}
                  className="flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-full border border-solid border-black-30 bg-black-5"
                >
                  <PlusIcon className="h-[1.745rem] w-[1.745rem]" />
                </button>
              </div>
              <div className="flex gap-[0.8rem]">
                {positions.length > 1 && (
                  <BaseButton
                    size="sm"
                    color="secondary"
                    onClick={() => handleRemove(index)}
                    className="w-[6.8rem]"
                  >
                    삭제
                  </BaseButton>
                )}
                {index === positions.length - 1 && (
                  <BaseButton
                    size="sm"
                    className="w-[6.8rem]"
                    onClick={handleAdd}
                  >
                    추가
                  </BaseButton>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export const FieldSkill = ({ value = [], onChange }: FieldSkillProps) => {
  const skills = [
    'After Effects',
    'AWS',
    'C#',
    'CRM',
    'Django',
    'express.js',
    'FastAPI',
    'Figma',
    'GA4',
    'Illustrator',
    'Java',
    'Javascript',
    'Jira',
    'Kotlin',
    'NestJS',
    'Next.js',
    'Node.js',
    'Notion',
    'Photoshop',
    'ProtoPie',
    'Python',
    'React',
    'React Native',
    'SEO',
    'SNS마케팅',
    'Spring',
    'SQL',
    'TypeScript',
    'UE',
    'Unity',
    'Vue.js',
    '콘텐츠제작',
  ];

  const handleToggle = (skill: string) => {
    if (value.includes(skill)) {
      onChange?.(value.filter((v) => v !== skill));
    } else {
      onChange?.([...value, skill]);
    }
  };

  return (
    <div className="flex flex-wrap gap-x-[0.6rem] gap-y-[1rem] pr-[2rem]">
      {skills.map((skill, idx) => (
        <BaseChip
          key={idx}
          isSelected={value.includes(skill)}
          onClick={() => handleToggle(skill)}
          mainIcon={<SkillIcon name={skill} />}
        >
          {skill}
        </BaseChip>
      ))}
    </div>
  );
};

export const FieldTab = ({ value = [], onChange, options }: FieldTabProps) => {
  const handleClick = (item: string) => {
    const isSelected = value.includes(item);

    // 선택 해제
    if (isSelected) {
      onChange?.(value.filter((v) => v !== item));
      return;
    }

    // 3개 초과 방지
    if (value.length >= 3) return;

    // 선택 추가
    onChange?.([...value, item]);
  };
  return (
    <div className="flex flex-wrap gap-x-[0.6rem] gap-y-[1rem] pr-[2rem]">
      {options?.map((item, idx) => {
        const isSelected = value.includes(item);
        const isDisabled = !isSelected && value.length >= 3;
        return (
          <BaseChip
            key={idx}
            isSelected={isSelected}
            disabled={isDisabled}
            onClick={() => handleClick(item)}
          >
            {item}
          </BaseChip>
        );
      })}
    </div>
  );
};
