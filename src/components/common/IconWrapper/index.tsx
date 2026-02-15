import { forwardRef, memo, useMemo } from 'react';
import {
  BASE_ICONWRAPPER_STYLES,
  ICONWRAPPER_COLOR_STYLES,
  ICONWRAPPER_SHAPE_STYLES,
} from './style';
import type { IconWrapperProps } from '../../../types/iconwrapper';

const IconWrapper = memo(
  forwardRef<HTMLButtonElement, IconWrapperProps>(
    (
      {
        color = 'filled',
        shape = 'square',
        isSelected = false,
        disabled,
        className,
        children,
        ...props
      },
      ref,
    ) => {
      const iconStyles = useMemo(() => {
        return `${BASE_ICONWRAPPER_STYLES} ${ICONWRAPPER_COLOR_STYLES[color]} ${ICONWRAPPER_SHAPE_STYLES[shape]} ${className || ''}`;
      }, [color, shape, className]);
      return (
        <button
          type="button"
          ref={ref}
          disabled={disabled}
          className={`${iconStyles} ${color === 'transparent' && isSelected ? 'text-blue-70' : ''}`}
          {...props}
        >
          {children}
        </button>
      );
    },
  ),
);

export default IconWrapper;
