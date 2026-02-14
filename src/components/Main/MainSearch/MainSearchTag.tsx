import IcX from '../../../assets/icons/normal/ic_close.svg?react';

/**
 * MainSearch: 직무, 스킬 선택 시 뜨는 Search Tag
 */

interface MainSearchTagProps {
  TagTitle: string;
  onRemove?: () => void;
}

const MainSearchTag = ({ TagTitle, onRemove }: MainSearchTagProps) => {
  return (
    <div className="flex h-[3.2rem] min-w-[7rem] cursor-default items-center justify-end gap-[0.4rem] rounded-[9.9rem] bg-[#F0F6FF] px-[1.2rem]">
      <span className="text-[1.4rem] font-[500] text-[#023075]">
        {' '}
        {TagTitle}{' '}
      </span>
      <button onClick={onRemove}>
        <IcX className="h-[1.6rem] w-[1.6rem] text-[#023075]" />
      </button>
    </div>
  );
};

export default MainSearchTag;
