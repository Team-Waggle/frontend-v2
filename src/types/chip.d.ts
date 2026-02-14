export type ChipVariant = 'outline' | 'filled' | 'teamOutline' | 'card';
export type ChipSelected = 'selected' | 'unselected';
export type Cardliked = 'normal' | 'liked' | 'unliked';

export type ChipSelectedStyles = {
  outline: { selected: string; unselected: string };
  filled: { selected: string; unselected: string };
  teamOutline: { selected: string; unselected: string };
  card: Record<Cardliked, { selected: string; unselected: string }>;
};

export interface BaseChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ChipVariant;
  status?: Cardliked;
  mainIcon?: React.ReactNode;
  subIcon?: React.ReactNode;
  isSelected?: boolean;
}
