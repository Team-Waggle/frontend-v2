import type { ReactNode } from 'react';
import { Link } from 'react-router';

type NavTabProps = {
  to: string;
  children: ReactNode;
  className?: string;
  isActive?: boolean;
};

const NavTab = ({ to, children, className, isActive = false }: NavTabProps) => {
  const containerStyle = [
    'inline-flex h-[5.4rem] py-[1.2rem] px-[0.8rem] justify-center items-center gap-[1rem]',
    isActive ? 'border-b border-b-[3px] border-solid border-b-blue-100' : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  const textStyle = [
    'text-[2rem] leading-[1.4] tracking-[-0.04rem]',
    isActive ? 'text-blue-100 font-[700]' : 'text-black-60 font-[600]',
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
