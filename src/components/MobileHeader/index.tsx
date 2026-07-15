import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuthStore } from '../../stores/authStore';
import {
  useGetIsUserProfileComplete,
  useGetNotificationsCount,
} from '../../hooks/useUser';
import LoginModal from '../Modal/LoginModal';

import Iclogo from '../../assets/icons/ic_logo.svg?react';
import BellIcon from '../../assets/icons/normal/ic_bell.svg?react';
import BellFillIcon from '../../assets/icons/normal/ic_bell_fill.svg?react';

const MobileHeader = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const mobileHeaderClass = [
    'max-sm:flex',
    'w-full',
    'h-[4.8rem]',
    'py-0',
    'px-[2rem]',
    'justify-between',
    'items-center',
    'pt-[2.8rem]',
  ].join(' ');

  const { accessToken } = useAuthStore();
  const isLoggedIn = !!accessToken;

  const { data: isProfileCompleteData } = useGetIsUserProfileComplete();
  const { data: notificationCountData } = useGetNotificationsCount();
  const unreadCount = notificationCountData?.unread ?? 0;

  const isProfileVisible = isLoggedIn && !!isProfileCompleteData?.complete;
  const isNotificationActive = pathname.includes('notification');

  const handleNotificationClick = () => {
    if (!isProfileVisible) {
      setIsLoginModalOpen(true);
      return;
    }
    navigate('/notification');
  };

  return (
    <>
      <header className={`hidden ${mobileHeaderClass}`}>
        <Iclogo
          className="cursor-pointer text-blue-80"
          onClick={() => navigate('/')}
        />

        <button
          onClick={handleNotificationClick}
          className="relative flex h-[4.8rem] w-[4.8rem] items-center justify-center"
        >
          <span
            className={isNotificationActive ? 'text-blue-100' : 'text-black-60'}
          >
            {isNotificationActive ? <BellFillIcon /> : <BellIcon />}
          </span>
          {unreadCount > 0 && (
            <div className="absolute right-[1.1rem] top-[0.7rem] h-[0.6rem] w-[0.6rem] rounded-full bg-blue-80" />
          )}
        </button>
      </header>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default MobileHeader;
