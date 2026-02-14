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
        return `${BASE_CHIP_STYLES} ${CHIP_VARIANT_STYLES[variant]} ${CHIP_SELECTED_STYLES[variant][selected]} ${className || ''}`;
      }, [variant, isSelected, className]);
      return (
        <button ref={ref} disabled={disabled} className={chipStyles} {...props}>
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
