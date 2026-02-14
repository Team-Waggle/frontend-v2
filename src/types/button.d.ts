export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
export type ButtonColor = 'primary' | 'secondary' | 'tertiary';

export interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  color?: ButtonColor;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
