import IcSearch from "../../assets/icons/normal/ic_search.svg?react";

interface MessageSearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

const MessageSearchBox = ({ value, onChange }: MessageSearchBoxProps) => {
  return (
    <div className="flex w-full h-[4rem] py-[0.8rem] pl-[2.8rem] pr-[2.4rem] items-center gap-[1rem] rounded-[9.9rem] bg-black-10">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="검색어를 입력해주세요."
        className="flex-1 bg-transparent text-[1.4rem] font-[500] leading-[1.5] text-black-100 outline-none placeholder:text-black-40"
      />
      <IcSearch className="w-[2rem] h-[2rem] flex-shrink-0 text-black-40" />
    </div>
  );
};

export default MessageSearchBox;
