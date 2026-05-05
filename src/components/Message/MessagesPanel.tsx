import { useEffect } from 'react';
import { motion } from 'framer-motion';

import MessageList from './MessageList';

interface MessagesPanelProps {
  isFolded: boolean;
  onClose: () => void;
}

const MessagesPanel = ({ isFolded, onClose }: MessagesPanelProps) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ type: 'spring', stiffness: 320, damping: 36, mass: 0.8 }}
      className={`fixed top-0 z-40 flex h-full w-[38rem] flex-col border-r border-black-20 bg-black-5 shadow-[8px_0_24px_rgba(0,0,0,0.08)] transition-[left] duration-sidebar ease-sidebar ${
        isFolded ? 'left-[8.8rem]' : 'left-[29.8rem]'
      }`}
    >
      <MessageList onConversationClick={onClose} />
    </motion.div>
  );
};

export default MessagesPanel;
