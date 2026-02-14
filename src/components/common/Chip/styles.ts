import type { ChipSelectedStyles, ChipVariant } from '../../../types/chip';

export const BASE_CHIP_STYLES = 'flex items-center';

export const CHIP_VARIANT_STYLES: Record<ChipVariant, string> = {
  outline:
    'h-[4rem] gap-[0.5rem] rounded-full border border-solid px-[1.2rem] text-[1.4rem] font-medium',
  filled:
    'h-[4rem] w-[10rem] justify-center rounded-full text-[1.6rem] font-bold',
  teamOutline:
    'h-[6rem] gap-[1.2rem] rounded-[1rem] border border-solid py-[0.8rem] pl-[0.8rem] pr-[1.6rem] text-[1.6rem] font-semibold',
  card: 'h-[10.6rem] w-[24rem] flex-col justify-center gap-[0.8rem] rounded-[0.8rem] border border-solid px-[1.2rem] py-[2rem] text-[1.6rem] font-medium',
};

export const CHIP_SELECTED_STYLES: ChipSelectedStyles = {
  outline: {
    selected: 'border-blue-80 bg-blue-5 text-black-100',
    unselected:
      'border-black-30 bg-black-5 text-black-80 hover:bg-hover-5 disabled:opacity-50 disabled:hover:bg-black-5',
  },
  filled: {
    selected: 'bg-blue-70 text-black-5',
    unselected: 'bg-black-10 text-black-60 hover:bg-hover-10',
  },
  teamOutline: {
    selected: 'border-blue-80 bg-blue-5 text-black-100',
    unselected: 'border-black-30 bg-black-5 text-black-80 hover:bg-hover-5',
  },
  card: {
    normal: {
      selected: 'border-blue-80 bg-blue-5 text-black-100',
      unselected: 'border-black-30 bg-black-5 text-black-80 hover:bg-hover-5',
    },
    liked: {
      selected: 'border-blue-70 bg-blue-5 text-black-100',
      unselected:
        'border-black-30 bg-black-5 text-black-80 hover:border-blue-70 hover:text-black-100',
    },
    unliked: {
      selected: 'border-error bg-[#FFEEEA] text-black-100',
      unselected:
        'border-black-30 bg-black-5 text-black-80 hover:border-error hover:text-black-100',
    },
  },
};

export const CHIP_ICON_SIZE: Record<ChipVariant, string> = {
  outline: 'h-[1.6rem] w-[1.6rem]',
  filled: 'h-[2rem] w-[2rem]',
  teamOutline: 'h-[4.4rem] w-[4.4rem]',
  card: 'h-[2.4rem] w-[2.4rem]',
};
