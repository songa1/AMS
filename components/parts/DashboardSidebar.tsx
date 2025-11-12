// Sidebar.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavDivider, NavHeader, NAVIGATION, NavItem, NavItemType } from "../Other/Sidebar";
import SidebarFooterAccount from "../Other/SidebarFooter";

type SidebarProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
};

const NavItemComponent = ({
  item,
  isSidebarOpen,
}: {
  item: NavItem;
  isSidebarOpen: boolean;
}) => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = React.useState(
    item.children
      ? item.children.some((child) =>
          pathname.startsWith(child.segment.split("#")[0])
        )
      : false
  );

  const isActive =
    pathname.startsWith(item.segment.split("#")[0]) && !item.children;
  const linkClasses = `flex items-center py-2 px-3 rounded-lg transition-colors ${
    isActive
      ? "bg-blue-600 text-white font-semibold"
      : "text-gray-300 hover:bg-gray-700"
  }`;

  const hasChildrenActive =
    item.children &&
    item.children.some((child) =>
      pathname.startsWith(child.segment.split("#")[0])
    );
  const parentClasses = `flex items-center py-2 px-3 rounded-lg transition-colors cursor-pointer ${
    hasChildrenActive && !isExpanded
      ? "bg-gray-700 text-white"
      : "text-gray-300 hover:bg-gray-700"
  }`;

  if (!isSidebarOpen) {
    return (
      <div className="relative group">
        <Link
          href={item.segment}
          className="flex justify-center items-center h-10 w-10 mx-auto my-1 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
        >
          {item.icon}
        </Link>
        <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-20 whitespace-nowrap px-3 py-1 text-sm font-medium text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {item.title}
        </span>
      </div>
    );
  }

  return (
    <div className="mb-1">
      {item.children ? (
        <div>
          <div
            className={parentClasses}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {item.icon}
            <span className="ml-3 flex-1">{item.title}</span>
            <svg
              className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : "rotate-0"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </div>
          {isExpanded && (
            <div className="ml-5 mt-1 border-l border-gray-700 pl-3">
              {item.children.map((child, index) => (
                <Link
                  key={index + 1}
                  href={child.segment}
                  className={`flex items-center py-1.5 px-3 text-sm rounded-lg transition-colors ${
                    pathname.startsWith(child.segment.split("#")[0])
                      ? "bg-blue-500 text-white font-medium"
                      : "text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {child.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        <Link href={item.segment} passHref className={linkClasses}>
          {item.icon}
          <span className="ml-3 flex-1">{item.title}</span>
          {item.action}
        </Link>
      )}
    </div>
  );
};

const isNavItem = (item: NavItemType): item is NavItem => {
  return !('kind' in item);
};

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) => {
  const renderItem = (item: NavItemType, index: number) => {
    switch ((item as NavHeader | NavDivider).kind) {
      case "header":
        return (
          <h3
            key={index}
            className="text-xs font-semibold uppercase text-gray-500 px-3 pt-4 pb-2 mt-4"
          >
            {(item as NavHeader).title}
          </h3>
        );
      case "divider":
        return <hr key={index} className="border-gray-700 my-4" />;
      default:
        return (
          <NavItemComponent
            key={index}
            item={item as unknown as NavItem}
            isSidebarOpen={isSidebarOpen}
          />
        );
    }
  };

  return (
    <div
      className={`
      h-full bg-gray-800 text-white flex flex-col transition-all duration-300 ease-in-out fixed left-0 top-0 z-30
      ${isSidebarOpen ? "w-60" : "w-20"}
    `}
    >
      <div
        className={`flex items-center p-4 border-b border-gray-700 h-16 ${!isSidebarOpen && "justify-center"}`}
      >
        <img
          src="/yali.png"
          alt="YALI AMS logo"
          className={isSidebarOpen ? "h-8 mr-2" : "h-8"}
        />
        {isSidebarOpen && <span className="text-xl font-bold">YALI AMS</span>}
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {NAVIGATION.map(renderItem)}
      </nav>

      <div className="p-0">
        <SidebarFooterAccount mini={!isSidebarOpen} />
      </div>
    </div>
  );
};

export default Sidebar;
