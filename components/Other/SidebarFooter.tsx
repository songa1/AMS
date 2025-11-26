"use client";

import { MdLogout, MdAccountCircle } from "react-icons/md";

const MOCK_USER = {
  name: "John Doe",
  email: "john.doe@example.com",
};

const SignOutButton = () => (
  <button
    onClick={() => console.log("Logging out...")}
    className="w-full text-left flex items-center p-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
  >
    <MdLogout className="w-5 h-5 mr-3" />
    Sign Out
  </button>
);

const AccountPreview = ({ mini }: { mini: boolean }) => (
  <div className={`p-4 ${mini ? "hidden" : "block"}`}>
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-blue-600">
        <MdAccountCircle className="w-8 h-8" />
      </div>
      <div className="flex flex-col truncate">
        <span className="font-semibold text-gray-900 truncate">
          {MOCK_USER.name}
        </span>
        <span className="text-xs text-gray-500 truncate">
          {MOCK_USER.email}
        </span>
      </div>
    </div>
  </div>
);

export default function SidebarFooterAccount({ mini }: { mini: boolean }) {
  if (mini) {
    return (
      <div className="p-3 border-t border-gray-700">
        <button
          onClick={() => console.log("Logging out...")}
          className="w-full flex justify-center p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
        >
          <MdLogout className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="p-2 border-t border-gray-200">
      <AccountPreview mini={mini} />
      <div className="p-2">
        <SignOutButton />
      </div>
    </div>
  );
}

export function ToolbarAccountOverride() {
  return null;
}
