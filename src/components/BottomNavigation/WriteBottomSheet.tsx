import { useLocation, useNavigate } from 'react-router-dom';

import BottomSheet from '../common/BottomSheet';
import SidebarItem from '../Sidebar/SidebarItem';

type WriteBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  hasWritableTeam: boolean;
};

const WriteBottomSheet = ({
  isOpen,
  onClose,
  hasWritableTeam,
}: WriteBottomSheetProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} aria-label="글쓰기">
      <div className="flex flex-col gap-[0.4rem]">
        <SidebarItem
          icon={null}
          label="새팀 만들기"
          isActive={pathname === '/team/new'}
          onClick={() => handleNavigate('/team/new')}
          unreadNotificationCount={0}
          setIsNotificationOpen={() => {}}
        />
        {hasWritableTeam && (
          <SidebarItem
            icon={null}
            label="모집글 작성"
            isActive={pathname === '/post/new'}
            onClick={() => handleNavigate('/post/new')}
            unreadNotificationCount={0}
            setIsNotificationOpen={() => {}}
          />
        )}
      </div>
    </BottomSheet>
  );
};

export default WriteBottomSheet;
