import { forwardRef, memo, useMemo } from 'react';
import {
  BASE_CHIP_STYLES,
  CHIP_ICON_COLOR,
  CHIP_ICON_SIZE,
  CHIP_SELECTED_STYLES,
  CHIP_VARIANT_STYLES,
} from './styles';
import type { BaseChipProps } from '../../../types/chip';

const BaseChip = memo(
  forwardRef<HTMLButtonElement, BaseChipProps>(
    (
      {
        variant = 'outline',
        isSelected = false, // chip의 선택 여부
        status = 'normal', // variant가 card일 때만 적용
        mainIcon,
        subIcon,
        disabled,
        className,
        children,
        ...props
      },
      ref,
    ) => {
      const chipStyles = useMemo(() => {
        const selected = isSelected ? 'selected' : 'unselected';

        let selectedStyle = '';

        if (variant === 'card') {
          selectedStyle = CHIP_SELECTED_STYLES.card[status][selected];
        } else {
          selectedStyle = CHIP_SELECTED_STYLES[variant][selected];
        }

        return `${BASE_CHIP_STYLES} ${CHIP_VARIANT_STYLES[variant]} ${selectedStyle} ${className || ''}`;
      }, [variant, status, isSelected, className]);

      const iconColorClass =
        variant === 'card' && isSelected ? CHIP_ICON_COLOR[status] : '';

      return (
        <button
          type="button"
          ref={ref}
          disabled={disabled}
          className={chipStyles}
          {...props}
        >
          {mainIcon && (
            <span
              className={`${CHIP_ICON_SIZE[variant]} ${iconColorClass}shrink-0 empty:hidden`}
            >
              {typeof mainIcon === 'string' ? (
                <img
                  src={mainIcon}
                  className="h-full w-full rounded-[0.6rem] object-cover"
                />
              ) : (
                mainIcon
              )}
            </span>
          )}
          <span className="truncate">{children}</span>
          {subIcon && (
            <span className={`${CHIP_ICON_SIZE[variant]} empty:hidden`}>
              {subIcon}
            </span>
          )}
        </button>
      );
    },
  ),
);

export default BaseChip;
