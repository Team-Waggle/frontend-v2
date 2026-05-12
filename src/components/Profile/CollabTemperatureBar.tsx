import IcPolygon from '../../assets/icons/ic_polygon.svg?react';
import IcInfo from '../../assets/icons/normal/ic_circleInfo.svg?react';

import Tooltip from '../common/Tooltip';

const getTemperatureGradient = (temp: number): string => {
  if (temp <= 36.5) {
    return 'linear-gradient(270deg, #9FA2AB 39.42%, #F2F3F4 100%)';
  }

  const t = Math.min((temp - 36.5) / (100 - 36.5), 1);
  const hex = (n: number) => Math.round(n).toString(16).padStart(2, '0');

  const r1 = 0xfe + (0xf5 - 0xfe) * t;
  const g1 = 0x99 + (0x55 - 0x99) * t;
  const b1 = 0x1d + (0x2d - 0x1d) * t;

  const g2 = 0xf5 + (0xee - 0xf5) * t;
  const b2 = 0xe9 + (0xea - 0xe9) * t;

  return `linear-gradient(270deg, #${hex(r1)}${hex(g1)}${hex(b1)} 0%, #ff${hex(g2)}${hex(b2)} 100%)`;
};

interface CollabTemperatureBarProps {
  temperature?: number;
}

const CollabTemperatureBar = ({ temperature }: CollabTemperatureBarProps) => {
  const temp = temperature ?? 36.5;

  return (
    <div className="relative flex h-[9.7rem] flex-col items-start gap-[1.2rem] self-stretch">
      <div
        className="absolute bottom-[2.4rem] flex flex-col items-center justify-center pl-[1.0835rem] pr-[1.0165rem]"
        style={{
          left: `36.5%`,
          transform: 'translateX(-50%)',
        }}
      >
        <span className="text-[1.2rem] font-[500] leading-[1.5] tracking-[-0.024rem] text-black-80">
          기본 온도
        </span>
        <IcPolygon />
      </div>
      <div className="flex flex-col items-start gap-[1.2rem] self-stretch">
        <div className="flex items-center gap-[0.4rem] self-stretch">
          <p className="text-[1.4rem] font-[600] leading-[1.5] tracking-[-0.028rem] text-black-90">
            협업온도
          </p>
          <Tooltip
            id="collab-temp-tooltip"
            content="팀 활동 및 팀원 피드백 기반으로 변동되는 지표입니다."
          >
            <IcInfo className="h-[2rem] w-[2rem] text-black-60" />
          </Tooltip>
        </div>
        <div className="flex h-[6.4rem] flex-col items-start gap-[0.8rem] self-stretch">
          <div className="flex items-center self-stretch">
            <span className="text-[2.8rem] font-[800] leading-[1.5] tracking-[-0.056rem] text-black-100">
              {temp.toFixed(1)}°C
            </span>
          </div>
          <div className="flex h-[1.4rem] flex-shrink flex-col items-start self-stretch rounded-[9.9rem] bg-black-10">
            <div
              className="h-[1.4rem] rounded-l-[9.9rem]"
              style={{
                width: `${temp}%`,
                background: getTemperatureGradient(temp),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollabTemperatureBar;
