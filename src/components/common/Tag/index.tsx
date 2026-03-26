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
  isDisabled = false,
  leftIcon,
  rightIcon,
  className,
  children,
}: BaseTagProps) => {
  // const inverted = isInverted ? 'inverted' : 'normal';
  const state = isDisabled ? 'disabled' : isInverted ? 'inverted' : 'normal';

  // 2. 해당 색상에 그 상태(state)가 없으면 'normal'로 돌아가도록(Fallback) 처리
  const colorStyle =
    TAG_COLOR_STYLES[color][state] || TAG_COLOR_STYLES[color]['normal'];
  const tagStyles = useMemo(() => {
    return `${BASE_TAG_STYLES} ${TAG_SIZE_STYLES[size]} ${TAG_SHAPE_STYLES[shape]} ${colorStyle} ${className || ''}`;
  }, [size, shape, color, isInverted, isDisabled, className]);
  return (
    <div className={tagStyles}>
      {leftIcon && <span>{leftIcon}</span>}
      {children}
      {rightIcon && <span>{rightIcon}</span>}
    </div>
  );
};

export default BaseTag;
