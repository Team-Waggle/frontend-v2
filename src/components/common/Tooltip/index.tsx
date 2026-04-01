import { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  id: string;
}

const Tooltip = ({ content, children, id }: TooltipProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      <div
        tabIndex={0}
        aria-describedby={id}
        className="flex cursor-pointer items-center outline-none"
      >
        {children}
      </div>
      <div
        id={id}
        role="tooltip"
        className={`absolute bottom-[calc(100%+1.05rem)] left-1/2 -translate-x-1/2 items-center justify-center whitespace-nowrap rounded-[0.8rem] border border-black-20 bg-white p-[1.2rem] shadow-[0_2px_18px_0_rgba(0,0,0,0.08),0_1px_4px_0_rgba(0,0,0,0.08)] ${visible ? 'flex' : 'hidden'}`}
      >
        <p className="text-[1.2rem] font-[500] text-black-80">{content}</p>
      </div>
    </div>
  );
};

export default Tooltip;
