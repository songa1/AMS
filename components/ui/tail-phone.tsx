export const PhoneInputTailwind = ({
  id,
  label,
  value,
  onChange,
  error,
  helperText,
  placeholder,
  required = false,
}: any) => (
  <div className="flex flex-col w-full">
    <label htmlFor={id} className="text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <span className="text-gray-500">+</span>
      </div>
      <input
        id={id}
        type="tel"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full p-2 pl-6 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md focus:ring-primary focus:border-primary`}
      />
    </div>
    {helperText && (
      <p className={`text-xs mt-1 ${error ? "text-red-500" : "text-gray-500"}`}>
        {helperText}
      </p>
    )}
  </div>
);
