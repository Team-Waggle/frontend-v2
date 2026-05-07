import { useNavigate } from 'react-router';
import BaseButton from '../components/common/Button';

// Icons
import UnAuthorizedIcon from '../assets/icons/ic_character_401.svg?react';

const UnAuthorizedPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center">
        <UnAuthorizedIcon />
        <div className="flex flex-col gap-[2.8rem]">
          <div className="flex flex-col items-center gap-[0.8rem]">
            <span className="text-[2.6rem] font-bold text-black-100">
              돌아가주세요!!
            </span>
            <span className="whitespace-pre-line text-center text-[2rem] font-semibold text-black-60">
              {`이 페이지에 접근할 권한이 없어요. \n이전 페이지로 돌아가 주세요.`}
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

export default UnAuthorizedPage;
