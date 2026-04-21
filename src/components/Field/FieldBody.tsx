import React, { forwardRef, memo, useEffect, useRef, useState } from 'react';
import type { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone';
import BaseChip from '../common/Chip/BaseChip';
import BaseButton from '../common/Button';
import BaseTag from '../common/Tag';
import IconWrapper from '../common/IconWrapper';
import { SkillIcon } from '../../utils/SkillIcon';
import { positionSkillData } from '../../constants/positionSkill';
import type { PositionKey } from '../../utils/position';
import type { TeamResponse } from '../../types/api/team';
import type { PositionType } from '../../types/api/posts';

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
import ChevronDownIcon from '../../assets/icons/normal/chevron/ic_chevronDown.svg?react';
import CloseIcon from '../../assets/icons/normal/ic_close.svg?react';
import CloseSmallIcon from '../../assets/icons/normal/ic_close_small.svg?react';

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

type WorkmodeType = 'ONLINE' | 'OFFLINE' | 'HYBRID';

interface FieldWorkmodeProps {
  value?: WorkmodeType;
  onChange?: (value: WorkmodeType) => void;
}

interface FieldEditorProps {
  value: string;
  onChange: (content: string) => void;
}

interface FieldTeamNameProps {
  data: TeamResponse[];
  value: number;
  onChange: (teamId: number) => void;
}

export type RecruitmentsValue = {
  position: PositionKey | null;
  count: number;
  skills: string[];
};

interface FieldPositionProps {
  value?: PositionType | null;
  onChange?: (value: PositionType) => void;
}

interface FieldPositionSkillProps {
  value?: RecruitmentsValue[];
  onChange?: (value: RecruitmentsValue[]) => void;
}

interface FieldTabProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  options?: string[];
  reviewType?: 'LIKE' | 'DISLIKE';
}

export const FieldInput = memo(
  forwardRef<HTMLInputElement, FieldInputProps>(
    ({ id, error, maxLength, className, ...props }, ref) => {
      const isEmpty = !props.value;

      const getByteLength = (str: string) => {
        return str.split('').reduce((acc: number, char: string) => {
          return acc + (/[가-힣]/.test(char) ? 3 : 1);
        }, 0);
      };

      const byteLength = getByteLength(String(props.value ?? ''));

      return (
        <div
          className={`flex h-[6rem] items-center rounded-[0.8rem] border px-[1.8rem] py-[1.7rem] ${
            error
              ? 'border-error'
              : isEmpty
                ? 'border-black-30 focus-within:border-blue-80'
                : 'border-black-100 focus-within:border-blue-80'
          } ${className || ''}`}
        >
          <input
            ref={ref}
            id={id}
            autoComplete="off"
            className={`w-full text-[1.6rem] font-medium`}
            {...props}
          />
          {maxLength && (
            <span className="text-[1.4rem] font-medium text-black-60">
              {byteLength}/{maxLength}
            </span>
          )}
        </div>
      );
    },
  ),
);

FieldInput.displayName = 'FieldInput';

export const FieldTextarea = memo(
  forwardRef<HTMLTextAreaElement, FieldTextareaProps>(
    ({ id, error, maxLength = 500, className, ...props }, ref) => {
      const [text, setText] = useState('');
      const isEmpty = !props.value;

      const getByteLength = (str: string) => {
        return str.split('').reduce((acc: number, char: string) => {
          return acc + (/[가-힣]/.test(char) ? 3 : 1);
        }, 0);
      };

      const byteLength = getByteLength(String(props.value ?? ''));

      const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Enter 키인지 확인 (Shift + Enter도 막으려면 e.shiftKey 조건 제외)
        if (e.key === 'Enter') {
          e.preventDefault(); // 줄바꿈 방지
        }
      };

      const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        // 복사 붙여넣기로 들어오는 줄바꿈도 제거하고 싶다면:
        const formattedValue = e.target.value.replace(/\n/g, '');
        setText(formattedValue);
      };

      return (
        <div
          className={`flex flex-col items-end rounded-[0.8rem] border px-[1.8rem] pb-[1rem] pt-[1.7rem] ${
            error
              ? 'border-error'
              : isEmpty
                ? 'border-black-30 focus-within:border-blue-80'
                : 'border-black-100 focus-within:border-blue-80'
          } ${className || ''}`}
        >
          <textarea
            value={text}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            ref={ref}
            id={id}
            maxLength={maxLength}
            className={`h-[6rem] w-full text-[1.6rem] font-medium`}
            {...props}
          />
          <span className="text-[1.4rem] font-medium text-black-60">
            {byteLength}/{maxLength}byte
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
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={preview}
                alt="미리보기"
                className="aspect-square h-full object-cover"
              />
            </div>
          ) : (
            <>
              <ImageIcon className="h-[3.2rem] w-[3.2rem] text-black-40" />
              <div className="flex flex-col gap-[0.2rem]">
                <span className="text-[1.6rem] font-semibold text-black-90">
                  클릭하거나 파일을 드래그하여 업로드하세요
                </span>
                <span className="text-[1.6rem] font-medium text-black-60">
                  권장 사이즈: 1080x1080 (PNG, JPG)
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
        isSelected={value === 'HYBRID'}
        className="h-[13.6rem] w-[29.4rem]"
        onClick={() => onChange?.('HYBRID')}
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
      StarterKit.configure({
        orderedList: false,
      }),
      Markdown,
      Link.configure({
        openOnClick: false, // 에디터 안에서 클릭 시 바로 이동 방지
        HTMLAttributes: {
          class: 'text-blue-500 underline pointer-events-none', // 링크 스타일 지정
        },
      }),
      Placeholder.configure({
        placeholder: '내용을 입력하세요.',
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'focus:outline-none h-full overflow-y-auto',
      },
    },
    onUpdate: ({ editor }) => {
      if (editor.isEmpty) {
        onChange('');
        return;
      }
      const markdown = editor.getMarkdown().replace(/&nbsp;/g, ' ');
      onChange(markdown);
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value !== undefined) {
      // 현재 에디터 내부의 텍스트와 외부에서 들어온 value를 비교
      const currentContent = editor.getMarkdown().replace(/&nbsp;/g, ' ');

      // 값이 다를 때만 업데이트하여, 타이핑 중 커서가 튀는 현상 방지
      if (value !== currentContent) {
        editor.commands.setContent(value);
      }
    }
  }, [value, editor]);

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

export const FieldPosition = ({ value, onChange }: FieldPositionProps) => {
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
        isSelected={value === 'DESIGNER'}
        onClick={() => handleChange('DESIGNER')}
        className="w-[9.2rem]"
      >
        디자인
      </BaseChip>
      <BaseChip
        isSelected={value === 'FRONTEND'}
        onClick={() => handleChange('FRONTEND')}
        className="w-[9.2rem]"
      >
        프론트엔드
      </BaseChip>
      <BaseChip
        isSelected={value === 'BACKEND'}
        onClick={() => handleChange('BACKEND')}
        className="w-[9.2rem]"
      >
        백엔드
      </BaseChip>
      <BaseChip
        isSelected={value === 'MARKETER'}
        onClick={() => handleChange('MARKETER')}
        className="w-[9.2rem]"
      >
        마케팅
      </BaseChip>
      <BaseChip
        isSelected={value === 'OTHER'}
        onClick={() => handleChange('OTHER')}
        className="w-[9.2rem]"
      >
        기타
      </BaseChip>
    </div>
  );
};

export const FieldPositionSkill = ({
  value,
  onChange,
}: FieldPositionSkillProps) => {
  const [selectedPosition, setSelectedPosition] = useState<PositionKey | null>(
    null,
  );
  const [selectedSkill, setSelectedSkill] = useState<string[]>([]);
  const [positionDropdownOpen, setPositionDropdownOpen] = useState(false);
  const [skillDropdownOpen, setSkillDropdownOpen] = useState(false);
  const [selectedCount, setSelectedCount] = useState(1);

  const items = value ?? [];

  const positionRef = useRef<HTMLDivElement>(null);
  const skillRef = useRef<HTMLDivElement>(null);

  const handlePositionSelect = (e: React.MouseEvent, pos: PositionKey) => {
    e.stopPropagation();
    setSelectedPosition(pos);
    setSelectedSkill([]);
    setPositionDropdownOpen(false);
  };

  const handleSkillSelect = (e: React.MouseEvent, skill: string) => {
    e.stopPropagation();
    setSelectedSkill((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const handleSkillRemove = (itemIndex: number, skillName: string) => {
    const newItems = [...items];

    const updatedSkills = newItems[itemIndex].skills.filter(
      (s) => s !== skillName,
    );

    if (updatedSkills.length === 0) {
      onChange?.(newItems.filter((_, i) => i !== itemIndex));
      return;
    }

    newItems[itemIndex] = {
      ...newItems[itemIndex],
      skills: newItems[itemIndex].skills.filter((s) => s !== skillName),
    };

    onChange?.(newItems);
  };

  const handleAdd = () => {
    if (!selectedPosition) return;

    onChange?.([
      ...items,
      {
        position: selectedPosition,
        count: selectedCount,
        skills: selectedSkill,
      },
    ]);
    setSelectedPosition(null);
    setSelectedSkill([]);
    setSelectedCount(1);
  };

  const handleRemove = (index: number) => {
    onChange?.(items.filter((_, i) => i !== index));
  };

  const handleCountIncrease = (index: number) => {
    const newItems = [...items];

    newItems[index] = {
      ...newItems[index],
      count: newItems[index].count + 1,
    };

    onChange?.(newItems);
  };

  const handleCountDecrease = (index: number) => {
    const newItems = [...items];

    if (newItems[index].count <= 1) return;

    newItems[index] = {
      ...newItems[index],
      count: newItems[index].count - 1,
    };

    onChange?.(newItems);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        positionRef.current &&
        !positionRef.current.contains(event.target as Node)
      ) {
        setPositionDropdownOpen(false);
      }
      if (
        skillRef.current &&
        !skillRef.current.contains(event.target as Node)
      ) {
        setSkillDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="relative flex gap-[1.2rem]">
        <div
          ref={positionRef}
          onClick={() => setPositionDropdownOpen((prev) => !prev)}
          className={`relative flex h-[6rem] w-[31.8rem] cursor-pointer items-center gap-[1rem] rounded-[0.8rem] border px-[1.8rem] ${
            selectedPosition ? 'border-blue-70' : 'border-black-30'
          }`}
        >
          <div
            className={`h-[2.6rem] w-[24.8rem] text-[1.6rem] font-medium ${selectedPosition ? 'text-blue-100' : 'text-black-60'}`}
          >
            {selectedPosition || '모집 직무'}
          </div>
          <ChevronDownIcon
            className={`text-black-60 transition-transform ${positionDropdownOpen ? 'rotate-180' : ''}`}
          />

          {positionDropdownOpen && (
            <div className="absolute left-0 top-[7rem] grid h-[6rem] w-[61.8rem] grid-cols-6 items-center gap-[0.6rem] rounded-[0.8rem] border border-black-30 bg-black-5 px-[1.8rem]">
              <div onClick={(e) => handlePositionSelect(e, '기획')}>
                <BaseChip
                  isSelected={selectedPosition === '기획'}
                  className="w-full"
                >
                  기획
                </BaseChip>
              </div>
              <div onClick={(e) => handlePositionSelect(e, '디자인')}>
                <BaseChip
                  isSelected={selectedPosition === '디자인'}
                  className="w-full"
                >
                  디자인
                </BaseChip>
              </div>
              <div onClick={(e) => handlePositionSelect(e, '프론트엔드')}>
                <BaseChip
                  isSelected={selectedPosition === '프론트엔드'}
                  className="w-full"
                >
                  프론트엔드
                </BaseChip>
              </div>
              <div onClick={(e) => handlePositionSelect(e, '백엔드')}>
                <BaseChip
                  isSelected={selectedPosition === '백엔드'}
                  className="w-full"
                >
                  백엔드
                </BaseChip>
              </div>
              <div onClick={(e) => handlePositionSelect(e, '마케팅')}>
                <BaseChip
                  isSelected={selectedPosition === '마케팅'}
                  className="w-full"
                >
                  마케팅
                </BaseChip>
              </div>
              <div onClick={(e) => handlePositionSelect(e, '기타')}>
                <BaseChip
                  isSelected={selectedPosition === '기타'}
                  className="w-full"
                >
                  기타
                </BaseChip>
              </div>
            </div>
          )}
        </div>
        <div
          ref={skillRef}
          onClick={() => setSkillDropdownOpen((prev) => !prev)}
          className={`flex h-[6rem] w-[31.8rem] items-center gap-[1rem] rounded-[0.8rem] border px-[1.8rem] ${
            selectedSkill.length !== 0 ? 'border-blue-70' : 'border-black-30'
          } ${selectedPosition && 'cursor-pointer'}`}
        >
          <div
            className={`h-[2.6rem] w-[24.8rem] truncate text-[1.6rem] font-medium ${selectedSkill.length !== 0 ? 'text-blue-100' : 'text-black-60'}`}
          >
            {selectedSkill.length
              ? `사용 스킬(${selectedSkill.length}) ${selectedSkill.join(', ')}`
              : '사용 스킬'}
          </div>
          <ChevronDownIcon
            className={`text-black-60 transition-transform ${skillDropdownOpen && selectedPosition && 'rotate-180'}`}
          />

          {skillDropdownOpen && selectedPosition && (
            <div className="absolute left-[9.5rem] top-[7rem] z-10 rounded-[0.8rem] border border-black-30 bg-black-5 p-[1.8rem]">
              <div className="flex flex-wrap gap-x-[0.6rem] gap-y-[1rem] overflow-y-auto pl-[0.1rem] pr-[2rem] pt-[0.1rem]">
                {positionSkillData[selectedPosition as PositionKey]?.map(
                  (skill) => {
                    const isSelected = selectedSkill.includes(skill);
                    return (
                      <div
                        key={`${selectedPosition} - ${skill}`}
                        onClick={(e) => handleSkillSelect(e, skill)}
                      >
                        <BaseChip
                          isSelected={isSelected}
                          mainIcon={<SkillIcon name={skill} />}
                        >
                          {skill}
                        </BaseChip>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-[3.6rem]">
          <div className="flex items-center gap-[0.8rem] py-[0.8rem]">
            <IconWrapper
              color="outline"
              shape="circle"
              className="h-[4rem] w-[4rem]"
              onClick={() => {
                if (selectedCount > 1) setSelectedCount(selectedCount - 1);
              }}
            >
              <MinusIcon className="h-[2.182rem] w-[2.182rem]" />
            </IconWrapper>
            <div className="flex h-[4rem] w-[4rem] items-center justify-center px-[0.8rem] text-[2rem] font-semibold text-blue-80">
              {selectedCount}
            </div>
            <IconWrapper
              color="outline"
              shape="circle"
              className="h-[4rem] w-[4rem]"
              onClick={() => {
                setSelectedCount(selectedCount + 1);
              }}
            >
              <PlusIcon className="h-[2.182rem] w-[2.182rem]" />
            </IconWrapper>
          </div>
          <div className="flex gap-[0.8rem]">
            <BaseButton size="sm" className="w-[6.8rem]" onClick={handleAdd}>
              추가
            </BaseButton>
          </div>
        </div>
      </div>

      <div className="mt-[1rem] flex flex-col gap-[0.4rem] border-t border-black-40 py-[1.3rem]">
        {items.map((item, itemIdx) => (
          <div
            key={`item-${itemIdx}`}
            className="flex gap-[1rem] py-[1.6rem] pl-[1.6rem]"
          >
            <div className="flex w-[63.4rem] gap-[1rem]">
              <BaseTag
                size="lg"
                shape="circle"
                color="black80"
                className="w-[8.4rem]"
              >
                {item.position}
              </BaseTag>
              <div className="flex flex-wrap gap-x-[0.8rem] gap-y-[1rem]">
                {item.skills.map((skill: string) => (
                  <BaseTag
                    key={skill}
                    size="lg"
                    shape="circle"
                    color="black80"
                    isInverted
                    leftIcon={<SkillIcon name={skill} />}
                    rightIcon={
                      <CloseSmallIcon
                        width="16"
                        height="16"
                        className="cursor-pointer text-black-70"
                        onClick={() => handleSkillRemove(itemIdx, skill)}
                      />
                    }
                  >
                    {skill}
                  </BaseTag>
                ))}
              </div>
            </div>
            <div className="flex gap-[3.6rem]">
              <div className="flex gap-[0.8rem]">
                <IconWrapper
                  color="outline"
                  shape="circle"
                  className="!h-[3.2rem] !w-[3.2rem]"
                  onClick={() => handleCountDecrease(itemIdx)}
                >
                  <MinusIcon className="h-[1.745rem] w-[1.745rem]" />
                </IconWrapper>
                <div className="flex h-[3.2rem] w-[3.2rem] items-center justify-center px-[0.8rem] text-[2rem] font-semibold text-blue-80">
                  {item.count}
                </div>
                <IconWrapper
                  color="outline"
                  shape="circle"
                  className="!h-[3.2rem] !w-[3.2rem]"
                  onClick={() => handleCountIncrease(itemIdx)}
                >
                  <PlusIcon className="h-[1.745rem] w-[1.745rem]" />
                </IconWrapper>
              </div>
              <div className="flex w-[6.8rem] justify-center">
                <CloseIcon
                  className="cursor-pointer text-black-60"
                  onClick={() => handleRemove(itemIdx)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export const FieldTab = ({
  value = [],
  onChange,
  options,
  reviewType,
}: FieldTabProps) => {
  const isInverted = reviewType === 'DISLIKE';

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
            className={`${isSelected && isInverted ? 'border-error bg-error-2' : ''}`}
          >
            {item}
          </BaseChip>
        );
      })}
    </div>
  );
};
