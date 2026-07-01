import JobSelectList from './JobSelectList';

type SearchJobSelectBoxProps = {
  values: string[];
  onToggle: (label: string) => void;
};

const SearchJobSelectBox = ({ values, onToggle }: SearchJobSelectBoxProps) => {
  return (
    <div className="absolute left-0 top-[calc(5rem+0.8rem)] z-[20]">
      <JobSelectList values={values} onToggle={onToggle} />
    </div>
  );
};

export default SearchJobSelectBox;
