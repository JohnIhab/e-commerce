import React from "react";
import backgroundImage from "../../assets/Home/footer.png";
import { Link } from "react-router-dom";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { Helmet } from "react-helmet";

const HeadPrivacy = () => {
  return (
    <>
      <Helmet>
        <title>{"JootBag | Privacy Policy"}</title>
        <meta name="description" content="JootBagPrivacyPolicy" />
      </Helmet>
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="bg-[#07332f] p-20 text-white relative overflow-hidden"
      >
        {/* Content */}
        <div className="flex items-center justify-center flex-col gap-6 relative z-10">
          <h1 className="text-3xl md:text-5xl text-white font-bold text-left">
            Privacy Policy
          </h1>

          {/* Breadcrumb */}
          <div className="flex items-center gap-3 text-lg">
            <Link
              to="/"
              className="hover:text-white transition-colors duration-300 font-medium"
            >
              Home
            </Link>

            <MdOutlineKeyboardDoubleArrowRight className="text-white" />

            <span className="text-white font-medium">Privacy Policy</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeadPrivacy;
