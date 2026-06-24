import { useLocation } from 'react-router';
import NavTab from './NavTab';

type Tab = { label: string; to: string };

type PageNavProps = {
  tabs: Tab[];
};

const PageNav = ({ tabs }: PageNavProps) => {
  const location = useLocation();

  return (
    <div className="flex w-full max-w-[clamp(98.2rem,70vw,130rem)] items-center gap-[2.4rem] border-b border-solid border-black-20 max-sm:px-[2rem]">
      {tabs.map((tab) => (
        <NavTab key={tab.to} to={tab.to} isActive={location.pathname === tab.to}>
          {tab.label}
        </NavTab>
      ))}
    </div>
  );
};

export default PageNav;
