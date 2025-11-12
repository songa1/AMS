interface CustomInputErrorProps {
  error: string | undefined;
}

export const CustomInputError: React.FC<CustomInputErrorProps> = ({ error }) => {
  return error ? <p className="text-red-500 text-sm mt-1">{error}</p> : null;
};
