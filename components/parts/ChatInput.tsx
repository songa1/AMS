import { BiUser } from "react-icons/bi";

interface CustomAvatarProps {
  image?: string;
  senderName?: string;
}

export const CustomAvatar: React.FC<CustomAvatarProps> = ({ image, senderName }) => {
  return (
    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center flex-shrink-0">
      {image ? (
        <img
          src={image}
          alt={`${senderName}'s avatar`}
          className="w-full h-full object-cover"
        />
      ) : (
        <BiUser className="w-5 h-5 text-gray-600" />
      )}
    </div>
  );
};

interface ChatInputProps {
  value: string;
  setValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  setValue,
  handleSubmit,
}) => (
  <form
    onSubmit={handleSubmit}
    className="w-full flex items-center gap-2 p-2 bg-white rounded-lg shadow-inner"
  >
    <input
      type="text"
      value={value}
      onChange={setValue}
      placeholder="Type a message..."
      className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
    />
    <button
      type="submit"
      disabled={!value.trim()}
      className={`p-3 rounded-full text-white transition duration-150 ${
        value.trim()
          ? "bg-indigo-600 hover:bg-indigo-700"
          : "bg-gray-400 cursor-not-allowed"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14 5l7 7m0 0l-7 7m7-7H3"
        />
      </svg>
    </button>
  </form>
);
