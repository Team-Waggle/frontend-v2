export type ChipVariant = 'outline' | 'filled' | 'teamOutline' | 'card';
export type ChipSelected = 'selected' | 'unselected';

export type ChipSelectedStyles = Record<
  ChipVariant,
  Record<ChipSelected, string>
>;

export interface BaseChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ChipVariant;
  mainIcon?: React.ReactNode;
  subIcon?: React.ReactNode;
  isSelected?: boolean;
}
