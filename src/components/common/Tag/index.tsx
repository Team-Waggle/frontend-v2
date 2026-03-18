import { useMemo } from 'react';
import type { BaseTagProps } from '../../../types/tag';
import {
  BASE_TAG_STYLES,
  TAG_COLOR_STYLES,
  TAG_SHAPE_STYLES,
  TAG_SIZE_STYLES,
} from './styles';

/*
  size: Tag의 세로 길이, xs: 20, sm: 24, md: 28, lg: 32, xl: 42
  shape: radius 정도, square: 0.6rem, circle: full
  isInverted: 반전색 유무
*/

const BaseTag = ({
  size,
  shape,
  color,
  isInverted = false,
  leftIcon,
  rightIcon,
  className,
  children,
}: BaseTagProps) => {
  const inverted = isInverted ? 'inverted' : 'normal';
  const tagStyles = useMemo(() => {
    return `${BASE_TAG_STYLES} ${TAG_SIZE_STYLES[size]} ${TAG_SHAPE_STYLES[shape]} ${TAG_COLOR_STYLES[color][inverted]} ${className || ''}`;
  }, [size, shape, color, inverted, className]);
  return (
    <div className={tagStyles}>
      {leftIcon && <span>{leftIcon}</span>}
      {children}
      {rightIcon && <span>{rightIcon}</span>}
    </div>
  );
};

export default BaseTag;
