import { ChangeEvent } from "react";

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
}

export const TextAreaField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
}) => (
  <div className="flex flex-col space-y-1">
    <label htmlFor={name} className="text-sm font-medium text-gray-700">
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      rows={6}
      placeholder={placeholder}
      className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out bg-white/70 shadow-sm"
    />
  </div>
);
