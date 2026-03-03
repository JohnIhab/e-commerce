
// import React from "react";
// import { Navigate, useLocation } from "react-router-dom";

// import { useLocation } from "react-router-dom";

// const ProtectedRoute = (props) => {
//   const location = useLocation();
//   console.log(props.children.type.name);
  

//    if (localStorage.getItem("token") === null) {
//     return props.children;
//   } else {
//      if(props.children.type.name === "MainWish"){
//         return props.children;

//      }
//      else{
//         return <Navigate to="/" state={{ from: location }} replace />;
//      }
//   }
// };

// export default ProtectedRoute;

// const ProtectedRoute = ({ children }) => {
//   const location = useLocation();
//   const token = localStorage.getItem("token");
//   const allowedForLoggedUsers = ["MainWish"];

//   if (!token) return children;

//   const isAllowed = allowedForLoggedUsers.includes(children.type?.name);

//   return isAllowed
//     ? children
//     : <Navigate to="/" state={{ from: location }} replace />;
// };
// export default ProtectedRoute;

import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const hasToken = localStorage.getItem("token") !== null;

   if (children.type?.name === "MainWish" && !hasToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

   if (hasToken && ["LoginPage", "SignUp"].includes(children.type?.name)) {
    return <Navigate to="/" replace />;
  }

   return children;
};

export default ProtectedRoute;
