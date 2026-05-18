import { useNavigate } from 'react-router';
import BaseButton from '../components/common/Button';

// Icons
import ForbiddenIcon from '../assets/icons/ic_character_403.svg?react';

const ForbiddenPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center">
        <ForbiddenIcon />
        <div className="flex flex-col gap-[2.8rem]">
          <div className="flex flex-col items-center gap-[0.8rem]">
            <span className="text-[2.6rem] font-bold text-black-100">
              이 페이지에 접근할 수 없어요.
            </span>
            <span className="whitespace-pre-line text-center text-[2rem] font-semibold text-black-60">
              {`정책에 따라 접근이 제한되었거나, \n사용 권한이 없는 기능일 수 있어요.`}
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

export default ForbiddenPage;
