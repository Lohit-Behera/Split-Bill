import React from "react";
import { Outlet, Link } from "react-router-dom";
import Header from "./components/Header";

function Layout() {
  return (
    <div className="w-[90%] md:w-[85%] lg:w-[80%] mx-auto">
      <Header />
      <Outlet />
    </div>
  );
}
export default Layout;
