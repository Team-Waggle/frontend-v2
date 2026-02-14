import { forwardRef, memo, useMemo } from 'react';
import {
  BASE_CHIP_STYLES,
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
        isSelected = false,
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
          // 타입 캐스팅으로 접근 (상위 interface에 card 외의 나머지들이 있음을 TS에 알림)
          const styles = CHIP_SELECTED_STYLES[variant];
          selectedStyle = styles[selected];
        }

        return `${BASE_CHIP_STYLES} ${CHIP_VARIANT_STYLES[variant]} ${selectedStyle} ${className || ''}`;
      }, [variant, status, isSelected, className]);
      return (
        <button
          type="button"
          ref={ref}
          disabled={disabled}
          className={chipStyles}
          {...props}
        >
          {mainIcon && (
            <span className={`${CHIP_ICON_SIZE[variant]} empty:hidden`}>
              {mainIcon}
            </span>
          )}
          {children}
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
