import type { ReactNode } from 'react';

export type SelectBoxItem = {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
};

type SelectBoxProps = {
  items: SelectBoxItem[];
};

const SelectBox = ({ items }: SelectBoxProps) => {
  return (
    <div className="flex w-[10.7rem] cursor-pointer flex-col items-end rounded-[0.8rem] bg-black-5 shadow-search-select-box">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex h-[4.4rem] w-full items-center gap-[0.4rem] rounded-[0.8rem] bg-black-5 px-[1.2rem] hover:bg-hover-5"
          onClick={(e) => {
            e.stopPropagation();
            item.onClick();
          }}
        >
          <span
            className={[
              'flex h-[1.6rem] w-[1.6rem] items-center justify-center',
              item.variant === 'danger' ? 'text-error' : 'text-black-60',
            ].join(' ')}
          >
            {item.icon}
          </span>
          <span
            className={[
              'whitespace-nowrap text-[1.4rem] font-[500] leading-[1.5] tracking-[-0.028rem]',
              item.variant === 'danger' ? 'text-error' : 'text-black-60',
            ].join(' ')}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SelectBox;
