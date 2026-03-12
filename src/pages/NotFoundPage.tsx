import { useNavigate } from 'react-router';
import BaseButton from '../components/common/Button';

// Icons
import NotFoundIcon from '../assets/icons/ic_character_404.svg?react';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center">
        <NotFoundIcon />
        <div className="flex flex-col gap-[2.8rem]">
          <div className="flex flex-col items-center gap-[0.8rem]">
            <span className="text-[2.6rem] font-bold text-black-100">
              돌아가주세요!!
            </span>
            <span className="whitespace-pre-line text-center text-[2rem] font-semibold text-black-60">
              {`불편을 드려 죄송합니다. \n이전 페이지로 돌아가 주세요.`}
            </span>
          </div>
          <BaseButton
            color="secondary"
            onClick={() => navigate(-1)}
            className="mx-auto w-[27rem]"
          >
            이전페이지로
          </BaseButton>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
