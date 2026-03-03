import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";

const Dropdown = ({
  title,
  items,
  isMobile = false,
  onItemClick,
  textColor = "text-third",
  bgColor = "bg-transparent",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const paths = ["/new-arrival", "/shop", "/categories", "/best-seller"];
  const isActive = paths.includes(location.pathname);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  if (isMobile) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="w-full flex items-center justify-between py-3 px-4    text-third font-bold hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
        >
          <span>{title}</span>
          <FiChevronDown
            className={`transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            size={16}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="pl-4 space-y-2 mt-2">
            {items.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  onClick={() => {
                    if (item.fn) {
                      item.fn();
                    }
                    if (onItemClick) {
                      onItemClick();
                    }
                  }}
                  className={`block py-2 px-4 rounded-lg transition-colors text-sm ${
                    item.danger
                      ? "text-red-600 hover:bg-red-50 hover:text-red-700"
                      : "text-third hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center">
                    {item.icon && (
                      <span
                        className={`mr-3 ${
                          item.danger ? "text-red-500" : "text-third"
                        }`}
                      >
                        {item.icon}
                      </span>
                    )}
                    <span>{item.name}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`cursor-pointer flex items-center  ${textColor} ${bgColor} py-1 px-2  rounded-md font-bold transition-colors`}
      >
        {title}
        <FiChevronDown
          className={`ml-1 transition-transform  duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          size={16}
        />
      </button>

      {/* Desktop Dropdown */}
      <div
        className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 visible transform translate-y-0"
            : "opacity-0 invisible transform -translate-y-2"
        }`}
      >
        <div className="py-2">
          {/* {items.map((item, index) => (
            <Link
              onClick={() => {
                toggleDropdown();
                if (item.fn) {
                  item.fn();
                }
              }}
              key={index}
              to={item.path}
              className={`block px-4 py-3 transition-colors ${
                item.danger
                  ? "text-red-600 hover:bg-red-50 hover:text-red-700"
                  : "text-third hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon && (
                  <span
                    className={`mr-3 ${
                      item.danger ? "text-red-500" : "text-third"
                    }`}
                  >
                    {item.icon}
                  </span>
                 )}
                 <div>
                  <div
                    className={`font-medium ${
                      item.danger ? "text-red-600" : ""
                    }`}
                  >
                    {item.name}
                  </div>
                  {item.description && (
                    <div
                      className={`text-sm  ${
                        item.danger ? "text-red-500" : "text-third"
                      }`}
                    >
                      {item.description}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))} */}
          {items.map((item, index) => (
            <div key={index} className="relative">
              <div className={item.children ? "relative group/submenu" : ""}>
                <Link
                  onClick={() => {
                    if (!item.children) toggleDropdown();
                    if (item.fn) item.fn();
                  }}
                  to={item.path || "#"}
                  className="block px-4 py-3 text-third hover:bg-gray-50 hover:text-gray-900"
                >
                   <div className="flex items-center gap-3">
                {item.icon && (
                  <span
                    className={`mr-3 ${
                      item.danger ? "text-red-500" : "text-third"
                    }`}
                  >
                    {item.icon}
                  </span>
                 )}
                 <div>
                  <div
                    className={`font-medium ${
                      item.danger ? "text-red-600" : ""
                    }`}
                  >
                    {item.name}
                  </div>
                  {item.description && (
                    <div
                      className={`text-sm  ${
                        item.danger ? "text-red-500" : "text-third"
                      }`}
                    >
                      {item.description}
                    </div>
                  )}
                </div>
              </div>
                </Link>

                {item.children && (
                  <div
                    className="absolute left-full top-0 w-60 bg-primary text-third shadow-lg  rounded-lg py-3
          opacity-0 invisible group-hover/submenu:opacity-100 group-hover/submenu:visible 
          transition-all duration-200"
                  >
                    {item.children.map((child, idx) => (
                      <Link
                        key={idx}
                        to={child.path}
                        className="block px-4 py-3 text-third   hover:bg-gray-50 hover:text-gray-900"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
