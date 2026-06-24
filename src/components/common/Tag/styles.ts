import type {
  TagColor,
  TagInverted,
  TagShape,
  TagSize,
} from '../../../types/tag';

export const BASE_TAG_STYLES = 'flex items-center justify-center whitespace-nowrap';

export const TAG_SIZE_STYLES: Record<TagSize, string> = {
  xs: 'h-[2rem] gap-[0.2rem] text-[1rem] px-[0.8rem]',
  sm: 'h-[2.4rem] gap-[0.4rem] text-[1.2rem] px-[0.8rem]',
  md: 'h-[2.8rem] gap-[0.4rem] text-[1.3rem] px-[1rem]',
  lg: 'h-[3.2rem] gap-[0.4rem] text-[1.4rem] px-[1.2rem]',
  xl: 'h-[4.2rem] gap-[0.8rem] text-[1.8rem] px-[1.4rem]',
};

export const TAG_SHAPE_STYLES: Record<TagShape, string> = {
  square: 'rounded-[0.6rem]',
  circle: 'rounded-full',
};

export const TAG_COLOR_STYLES: Record<
  TagColor,
  Partial<Record<TagInverted, string>>
> = {
  blue70: {
    normal: 'bg-blue-70 text-black-5 font-semibold',
    inverted: 'bg-blue-10 text-blue-70 font-medium',
  },
  black90: {
    normal: 'bg-black-90 text-black-5 font-semibold',
    inverted: 'bg-black-20 text-black-100 font-medium',
    disabled: 'bg-black-20 text-black-60 font-medium',
  },
  black80: {
    normal: 'bg-black-80 text-black-5 font-semibold',
    inverted: 'bg-black-10 text-black-100 font-medium',
    disabled: 'bg-black-10 text-black-60 font-medium',
  },
  blue80: {
    normal: 'bg-blue-80 text-black-5 font-semibold',
    inverted: 'bg-blue-5 text-blue-70 font-medium',
  },
  orange: {
    normal: 'bg-temperatureBg-orange text-black-5 font-semibold',
    inverted:
      'bg-temperatureBg-orange2 text-temperatureFont-orange font-medium',
  },
  red: {
    normal: 'bg-temperatureBg-coral text-black-5 font-semibold',
    inverted: 'bg-temperatureBg-coral2 text-temperatureFont-coral font-medium',
  },
  black100: {
    normal: 'bg-blue-100 text-black-5 font-semibold',
    inverted: 'bg-blue-5 text-blue-100 font-medium',
  },
};
