"use client";

function TopTitle({ title }: { title: string }) {
  return (
    <div className="flex w-full items-center text-center">
      <h4 className="text-center py-3 px-1">{title}</h4>
    </div>
  );
}

export default TopTitle;
