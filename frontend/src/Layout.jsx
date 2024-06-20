import React from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import FallBack from "./components/FallBack";
import Header from "./components/Header";

function Layout() {
  return (
    <div className="w-[90%] md:w-[85%] lg:w-[80%] mx-auto">
      <Header />
      <ErrorBoundary FallbackComponent={FallBack}>
        <ScrollRestoration />
        <Outlet />
      </ErrorBoundary>
    </div>
  );
}
export default Layout;
