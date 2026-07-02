import type { ReactNode } from 'react';
import { Link } from 'react-router';

export const navTabContainerBase =
  'inline-flex h-[5.4rem] py-[1.2rem] px-[0.8rem] justify-center items-center gap-[1rem]';
export const navTabContainerActive =
  'border-b border-b-[3px] border-solid border-b-blue-100';
export const navTabTextBase = 'text-[2rem] leading-[1.4] tracking-[-0.04rem]';
export const navTabTextActive = 'text-blue-100 font-[700]';
export const navTabTextInactive = 'text-black-60 font-[600]';

type NavTabProps = {
  to: string;
  children: ReactNode;
  className?: string;
  isActive?: boolean;
};

const NavTab = ({ to, children, className, isActive = false }: NavTabProps) => {
  const containerStyle = [
    navTabContainerBase,
    isActive ? navTabContainerActive : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  const textStyle = [
    navTabTextBase,
    isActive ? navTabTextActive : navTabTextInactive,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Link to={to} className={containerStyle}>
      <p className={textStyle}>{children}</p>
    </Link>
  );
};

export default NavTab;
