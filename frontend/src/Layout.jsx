import React, { useEffect, useState } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { useSelector } from "react-redux";
import WaveBackground from "./assets/WaveBackground.svg";

import FallBack from "./components/FallBack";
import Header from "./components/Header";

function Layout() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const mode = useSelector((state) => state.mode.mode);

  useEffect(() => {
    const systemTheme = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const theme =
      mode === "dark"
        ? "dark"
        : systemTheme && mode === "system"
        ? "dark"
        : "light";
    setIsDarkMode(theme === "dark");
  }, [mode]);
  return (
    <div className="w-full h-full">
      <div className="fixed inset-0 w-full h-full overflow-hidden object-cover -z-10 ">
        <div className="w-full mx-auto rounded-md fixed inset-0 h-full overflow-hidden">
          <img
            src={WaveBackground}
            alt="Wave Background"
            className="w-full h-auto fixed bottom-0"
          />
        </div>
      </div>
      <div className="w-full md:w-[85%] lg:w-[80%] min-h-[80vh] mx-auto p-1 md:p-6 bg-background/60 backdrop-blur">
        <Header />
        <ErrorBoundary FallbackComponent={FallBack}>
          <ScrollRestoration />
          <Outlet />
        </ErrorBoundary>
      </div>
    </div>
  );
}
export default Layout;
