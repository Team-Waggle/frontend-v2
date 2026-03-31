import IcSearch from "../../assets/icons/normal/ic_search.svg?react";

const MessageSearchBox = () => {
    return (
        <div className="flex w-full h-[4rem] py-[0.8rem] pl-[2.8rem] pr-[2.4rem] items-center gap-[1rem] rounded-[9.9rem] bg-black-10">
            <span className="text-black-40 text-[1.4rem] font-[500] leading-[1.5] flex-1"> 검색어를 입력해주세요. </span>
            <IcSearch className="w-[2rem] h-[2rem]" />
        </div>
    );
};

export default MessageSearchBox;