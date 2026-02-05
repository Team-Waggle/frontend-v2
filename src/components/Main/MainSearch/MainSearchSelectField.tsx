import React from 'react';
import IcChevronDown from '../../../../src/assets/icons/normal/chevron/ic_chevronDown_small.svg?react';
import IcChevronUp from '../../../../src/assets/icons/normal/chevron/ic_chevronUp_small.svg?react';

/**
 * MainSearch: 직무 및 스킬 선택박스 컴포넌트
 */

type MainSearchSelectFieldProps = {
  variant: 'job' | 'skill';
  isSelected: boolean;
  icon: React.ReactNode;
  valueLabel: string;
  isOpen: boolean;
  onToggle: () => void;
  suppressRightBorder?: boolean;
  disabled?: boolean;
  hasKeyword?: boolean;
};

const MainSearchSelectField = ({
  variant,
  isSelected,
  icon,
  valueLabel,
  isOpen,
  onToggle,
  suppressRightBorder = false,
  disabled = false,
  hasKeyword = false,
}: MainSearchSelectFieldProps) => {
  const baseCommon =
    'flex-1 flex h-[5rem] px-[2rem] items-center gap-[1rem] border-solid bg-white';

  const baseVariant =
    variant === 'job' ? 'border rounded-l-[0.8rem]' : 'border border-l-0';

  const closedTextBase = 'text-[#878B96]';
  const closedTextSelected = 'text-[#023075]';

  const closedBorderDefault = 'border-[#B7B9C0]';
  const closedBorderSelected = 'border-[#237BFF]';

  const shouldHighlightText = isSelected || hasKeyword;

  const openClass =
    variant === 'job'
      ? 'border-[#237BFF] text-[#51535A] rounded-[0.8rem] relative z-[10]'
      : 'border-[#237BFF] text-[#51535A] rounded-[0.8rem] relative z-[10] border-l-[1px]';

  const borderColorClass = isOpen
    ? ''
    : isSelected
      ? closedBorderSelected
      : closedBorderDefault;

  const textColorClass = isOpen
    ? ''
    : shouldHighlightText
      ? closedTextSelected
      : closedTextBase;

  const handleClick = () => {
    if (disabled) return;
    onToggle();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-expanded={isOpen}
      disabled={disabled}
      className={`${baseCommon} ${baseVariant} ${
        isOpen ? openClass : `${borderColorClass} ${textColorClass}`
      } ${suppressRightBorder ? 'border-r-0' : ''}`}
    >
      <div className="flex h-[2rem] w-[2rem] items-center justify-center">
        {icon}
      </div>

      <span className="min-w-0 truncate text-[1.6rem] font-[600]">
        {valueLabel}
      </span>

      <span className="ml-auto">
        {isOpen ? (
          <IcChevronUp className="h-[2rem] w-[2rem]" />
        ) : (
          <IcChevronDown className="h-[2rem] w-[2rem]" />
        )}
      </span>
    </button>
  );
};

export default MainSearchSelectField;
