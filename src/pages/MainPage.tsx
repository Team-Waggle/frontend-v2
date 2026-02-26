import MainCard from '../components/common/Cards/MainCard/MainCard';
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
    <>
      {/** Main */}
      <div className="flex w-full flex-col items-center gap-[5.6rem] px-[4.8rem]">
        {/** Frame 01 */}
        <div className="max-1440:w-full flex w-[152.6rem] flex-col items-start gap-[2rem]">
          <MainSearch />
        </div>
        {/** Frame 02 */}
        <div className="max-1440:w-full max-1440:max-w-full max-1440:grid-cols-3 inline-grid w-[152.6rem] max-w-[152.6rem] auto-rows-max grid-cols-4 gap-x-[1.8rem] gap-y-[1.8rem]">
          <MainCard mainCardTitle="[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)" />
          <MainCard mainCardTitle="[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)" />
          <MainCard mainCardTitle="[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)" />
          <MainCard mainCardTitle="[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)" />

          <MainCard mainCardTitle="[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)" />
          <MainCard mainCardTitle="[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)" />
          <MainCard mainCardTitle="[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)" />
          <MainCard mainCardTitle="[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)" />

          <MainCard mainCardTitle="[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)" />
          <MainCard mainCardTitle="[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)" />
          <MainCard mainCardTitle="[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)" />
          <MainCard mainCardTitle="[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)[네오플] 게임그래픽 직군 분야별 모집 (근무지 : 서울)" />
        </div>
      </div>
      <OnboardingModal isOpen={isOnboardingModalOpen} onClose={() => {}} />
    </>
  );
};

export default MainPage;
