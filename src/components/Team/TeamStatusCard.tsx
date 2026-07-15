import BaseButton from '../common/Button';
import BaseTag from '../common/Tag';

type StatusType = 'PREPARING' | 'ACTIVE' | 'COMPLETED';

type TeamStatusCardProps = {
  type: StatusType;
  currentStatus: StatusType;
  title: string;
  description: string;
  ActiveIcon: React.ComponentType<{ className?: string }>;
  InactiveIcon: React.ComponentType<{ className?: string }>;
  buttonText: string;
  onClick: () => void;
};

const TeamStatusCard = ({
  type,
  currentStatus,
  title,
  description,
  ActiveIcon,
  InactiveIcon,
  buttonText,
  onClick,
}: TeamStatusCardProps) => {
  const isActive = currentStatus === type;

  return (
    <div
      className={`flex aspect-[310/325] w-full min-w-[31rem] max-w-[39.4rem] flex-col gap-[3.2rem] rounded-[1.6rem] border p-[2rem] max-sm:h-[32.5rem] max-sm:min-w-full ${
        isActive ? 'border-blue-70' : 'border-black-30'
      }`}
    >
      <div className="flex flex-1 flex-col items-center justify-between">
        <div className="w-full">
          <BaseTag
            size="sm"
            shape="square"
            color={isActive ? 'blue70' : 'black90'}
            isInverted={isActive}
            isDisabled={!isActive}
            className="w-[7.5rem]"
          >
            {title}
          </BaseTag>
        </div>
        <div className="flex w-full items-center justify-center">
          {isActive || !InactiveIcon ? (
            <ActiveIcon className="w-[clamp(10rem,7vw,13.8rem)] max-1440:h-[10rem] max-1440:w-[10rem]" />
          ) : (
            <InactiveIcon className="w-[clamp(10rem,7vw,13.8rem)] max-1440:h-[10rem] max-1440:w-[10rem]" />
          )}
        </div>
        <span
          className={`whitespace-pre-line text-center text-[1.6rem] font-medium ${
            isActive ? 'text-black-100' : 'text-black-60'
          } `}
        >
          {description}
        </span>
      </div>
      <BaseButton
        size="lg"
        onClick={onClick}
        disabled={!isActive}
        className="mx-auto w-full min-w-[27rem] max-w-[32.2rem] max-sm:max-w-full"
      >
        {buttonText}
      </BaseButton>
    </div>
  );
};

export default TeamStatusCard;
