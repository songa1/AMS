"use client";

function SearchInput({
  value,
  setValue,
  onSubmit,
}: {
  value: string;
  setValue: any;
  onSubmit: any;
}) {
  return (
    <div className="relative flex h-10 w-full max-w-[300px]">
      <input
        value={value}
        onChange={setValue}
        placeholder="Type the name or email of member"
      />
    </div>
  );
}

export default SearchInput;
