export type TagSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type TagShape = 'square' | 'circle';
export type TagColor =
  | 'blue70'
  | 'black90'
  | 'black80'
  | 'blue80'
  | 'orange'
  | 'red'
  | 'black100';
export type TagInverted = 'normal' | 'inverted' | 'disabled';

export interface BaseTagProps {
  size: TagSize;
  shape: TagShape;
  color: TagColor;
  isInverted?: boolean;
  isDisabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}
