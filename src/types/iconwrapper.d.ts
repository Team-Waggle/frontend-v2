export type IconWrapperColor =
  | 'outline'
  | 'filled'
  | 'transparent'
  | 'transparentTwo';
export type IconWrapperShape = 'square' | 'circle';

export interface IconWrapperProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: IconWrapperColor;
  shape?: IconWrapperShape;
  isSelected?: boolean;
}
