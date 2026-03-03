import React, { useEffect, useState } from "react";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import Header from "./Header";

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* <Header /> */}
      <div
        className={`fixed z-50 w-full   transition-all duration-500 ease-in-out `}
      >
        <DesktopNav />
        <MobileNav />
      </div>
    </>
  );
};

export default Navbar;
