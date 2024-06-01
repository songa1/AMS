"use client";

import React from "react";

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
      <button
        className="!absolute right-1 top-1 select-none rounded bg-mainBlue py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md transition-all hover:shadow-md focus:shadow-lg active:shadow-md"
        type="submit"
        onClick={onSubmit}
      >
        Search
      </button>
      <input
        type="text"
        value={value}
        onChange={setValue}
        className="h-full w-full rounded-md border border-mainBlue bg-transparent px-3 py-2.5 pr-20 text-sm font-normal outline-0 transition-all"
        placeholder="Search"
      />
    </div>
  );
}

export default SearchInput;
