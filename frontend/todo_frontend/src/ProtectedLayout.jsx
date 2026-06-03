import React from "react";
import { Navigate,Outlet} from "react-router-dom";


const ProtectedLayout=()=>{
    const isAuthenticated = !!localStorage.getItem("token");

    return isAuthenticated?<Outlet/>:<Navigate to={"/login"} />;
};

export default ProtectedLayout;
