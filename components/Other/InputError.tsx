"use client";

function InputError({ error }: { error: string }) {
  return (
    <div>
      <p className="text-red-500 m-0 p-0 text-sm">{error}</p>
    </div>
  );
}

export default InputError;
