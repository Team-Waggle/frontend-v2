import MainCard from '../components/Main/MainCard/MainCard';
import MainSearch from '../components/Main/MainSearch/MainSearch';
import OnboardingModal from '../components/Modal/OnboardingModal';
import { useGetIsUserProfileComplete } from '../hooks/userUser';

/**
 *
 * Main Page
 * : 홈이 되는 화면
 * : 1980px 제작, 1440px 미제작
 *
 */

const MainPage = () => {
  const { data } = useGetIsUserProfileComplete();

  const isOnboardingModalOpen = data?.isComplete === false;

  return (
    <div className="flex w-[192rem] flex-row items-start bg-white">
      {/** Main */}
      <div className="flex flex-col items-center gap-[5.6rem] px-[4.8rem]">
        {/** Frame 01 */}
        <div className="flex w-[152.6rem] flex-col items-start gap-[2rem]">
          <MainSearch />
        </div>
        {/** Frame 02 */}
        <div className="inline-grid auto-rows-max grid-cols-4 gap-x-[1.8rem] gap-y-[1.8rem] 2xl:w-[152.6rem] 2xl:max-w-[152.6rem] 2xl:grid-cols-4">
          <MainCard MainCardTitle="[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)" />
          <MainCard MainCardTitle="[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)" />
          <MainCard MainCardTitle="[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)" />
          <MainCard MainCardTitle="[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)" />

          <MainCard MainCardTitle="[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)" />
          <MainCard MainCardTitle="[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)" />
          <MainCard MainCardTitle="[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)" />
          <MainCard MainCardTitle="[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)" />

          <MainCard MainCardTitle="[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)" />
          <MainCard MainCardTitle="[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)" />
          <MainCard MainCardTitle="[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)" />
          <MainCard MainCardTitle="[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)" />

          <MainCard MainCardTitle="[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)" />
          <MainCard MainCardTitle="[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)" />
          <MainCard MainCardTitle="[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)" />
          <MainCard MainCardTitle="[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)" />
        </div>
      </div>
      <OnboardingModal isOpen={isOnboardingModalOpen} onClose={() => {}} />
    </div>
  );
};

export default MainPage;
