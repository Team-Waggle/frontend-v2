import type { ButtonColor, ButtonSize } from '../../types/button';

export const BASE_BUTTON_STYLES =
  'flex justify-center items-center py-[1.2rem] gap-[1rem]';

export const BUTTON_SIZE_STYLES: Record<ButtonSize, string> = {
  sm: 'h-[3.2rem] px-[1.6rem] rounded-[0.8rem] text-[1.4rem]',
  md: 'h-[4.4rem] px-[4rem] rounded-[0.8rem] text-[1.6rem]',
  lg: 'h-[5.4rem] px-[4rem] rounded-[0.8rem] text-[1.7rem]',
  xl: 'h-[6rem] px-[4rem] rounded-[1rem] text-[1.8rem]',
};
export const BUTTON_COLOR_STYLES: Record<ButtonColor, string> = {
  primary:
    'bg-blue-80 text-black-5 font-bold hover:bg-hover-80 disabled:bg-black-20 disabled:text-black-40',
  secondary:
    'bg-black-5 text-black-100 font-semibold border border-solid border-black-30 hover:bg-hover-5 disabled:bg-black-20 disabled:text-black-40 disabled:border-none',
  tertiary:
    'bg-black-5 text-blue-80 font-semibold border border-solid border-blue-60 hover:bg-blue-5 disabled:bg-black-20 disabled:text-black-40 disabled:border-none',
};
