import { ChangeEvent } from "react";

interface SelectFieldProps {
  label: string;
  name: string;
  value: string | number | null;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  onChange,
  children,
}) => (
  <div className="flex flex-col space-y-1">
    <label htmlFor={name} className="text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="relative">
      <select
        id={name}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        className="p-3 pr-10 border border-gray-300 rounded-lg appearance-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out bg-white/70 shadow-sm w-full"
      >
        <option value="" disabled>
          Select {label}
        </option>
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  </div>
);
