import { useNavigate } from 'react-router-dom';

import Iclogo from '../../assets/icons/ic_logo.svg?react';

const MobileHeader = () => {
  const navigate = useNavigate();
  const mobileHeaderClass = ['max-sm:flex', 'w-full', 'h-[4.8rem]', 'py-0', 'px-[2rem]', 'justify-between', 'items-center', 'pt-[2.8rem]' , 'mb-[1rem]'].join(' ')

  return (
    <header className={`hidden ${mobileHeaderClass}`}>
        <Iclogo className="cursor-pointer text-blue-80" onClick={() => navigate('/')} />
    </header>
  );
};

export default MobileHeader;
