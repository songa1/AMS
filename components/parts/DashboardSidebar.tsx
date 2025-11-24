"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavDivider,
  NavHeader,
  NAVIGATION,
  NavItem,
  NavItemType,
} from "../Other/Sidebar";
import SidebarFooterAccount from "./SidebarFooter";
import { MdKeyboardArrowRight } from "react-icons/md";

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
  const isCurrentPathExact = pathname === item.segment.split("#")[0];

  const [isExpanded, setIsExpanded] = React.useState(
    item.children
      ? item.children.some((child) =>
          pathname.startsWith(child.segment.split("#")[0])
        )
      : false
  );

  const isActive = isCurrentPathExact;
  const hasChildrenActive =
    item.children &&
    item.children.some((child) =>
      pathname.startsWith(child.segment.split("#")[0])
    );

  const linkClasses = `flex items-center py-2 px-3 rounded-lg transition-colors ${
    isActive
      ? "bg-primary text-white font-semibold shadow-md"
      : "text-gray-700 hover:bg-gray-100"
  }`;

  const parentClasses = `flex items-center py-2 px-3 rounded-lg transition-colors cursor-pointer ${
    hasChildrenActive || isExpanded
      ? "bg-gray-100 text-primary font-medium"
      : "text-gray-700 hover:bg-gray-100"
  }`;

  if (!isSidebarOpen) {
    return (
      <div className="relative group">
        <Link
          href={item.segment}
          className={`flex justify-center items-center h-10 w-10 mx-auto my-1 rounded-lg transition-colors 
${isActive ? "bg-primary text-white" : "text-gray-500 hover:bg-gray-100"}`}
        >
          {item.icon}
        </Link>
        <span className="absolute left-full ml-4 top-1/2 -translate-y-1/2 z-20 whitespace-nowrap px-3 py-1 text-sm font-medium text-white bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
          {item.title}
        </span>
      </div>
    );
  }

  return (
    <div className="mb-1">
      {item.children ? (
        <div>
          <button
            type="button"
            className={parentClasses}
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {item.icon}
            <span className="ml-3 flex-1">{item.title}</span>
            <MdKeyboardArrowRight
              className={`w-5 h-5 transition-transform ${
                isExpanded ? "rotate-90" : "rotate-0"
              }`}
            />
          </button>
          {isExpanded && (
            <div className="ml-4 mt-1 border-l border-gray-300 pl-3">
              {item.children.map((child, index) => (
                <Link
                  key={index + 1}
                  href={child.segment}
                  className={`flex items-center py-1.5 px-2 text-sm rounded-lg transition-colors ${
                    pathname.startsWith(child.segment.split("#")[0])
                      ? "bg-blue-100 text-primary font-medium"
                      : "text-gray-600 hover:bg-gray-100"
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
  return !("kind" in item);
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
        return <hr key={index} className="border-gray-200 my-4" />;
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
      className={`h-full bg-white text-gray-800 flex flex-col transition-all duration-300 ease-in-out fixed left-0 top-0 z-30 shadow-xl ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
    >
      <div
        className={`flex items-center p-4 border-b border-gray-200 h-16 ${
          !isSidebarOpen && "justify-center"
        }`}
      >
        <img
          src="/yali.png"
          alt="YALI AMS logo"
          className={isSidebarOpen ? "h-8 mr-2" : "h-8"}
        />
        {isSidebarOpen && (
          <span className="text-xl font-bold text-primary">YALI AMS</span>
        )}
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
