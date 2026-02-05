interface MainCardTagProps {
  TagTitle: string;
}

const MainCardTag = ({ TagTitle }: MainCardTagProps) => {
  return (
    <div className="inline-flex h-[2.8rem] items-center justify-center gap-[0.9828rem] rounded-[0.6rem] bg-[#E7E8EA] px-[1rem]">
      <span className="text-[1.3rem] font-[500]"> {TagTitle} </span>
    </div>
  );
};

export default MainCardTag;
