import React, { useEffect, useState } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { useSelector } from "react-redux";
import { ShaderGradientCanvas, ShaderGradient } from "shadergradient";
import * as reactSpring from "@react-spring/three";
import * as drei from "@react-three/drei";
import * as fiber from "@react-three/fiber";

import FallBack from "./components/FallBack";
import Header from "./components/Header";

function Layout() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const mode = useSelector((state) => state.mode.mode);

  const bgLight =
    "https://www.shadergradient.co/customize?animate=on&axesHelper=off&brightness=3.5&cAzimuthAngle=170&cDistance=4.2&cPolarAngle=70&cameraZoom=1&color1=%2394ffd1&color2=%236bf5ff&color3=%23ffffff&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=off&lightType=3d&pixelDensity=1&positionX=0&positionY=0.9&positionZ=-0.3&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=45&rotationY=0&rotationZ=0&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=1.2&uFrequency=0&uSpeed=0.2&uStrength=3.4&uTime=0&wireframe=false";

  const bgDark =
    "https://www.shadergradient.co/customize?animate=on&axesHelper=on&bgColor1=%23000000&bgColor2=%23000000&brightness=3.5&cAzimuthAngle=180&cDistance=3.9&cPolarAngle=115&cameraZoom=1&color1=%23009d1e&color2=%23007eb0&color3=%23000000&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&grain=off&lightType=3d&pixelDensity=1&positionX=-0.5&positionY=0.1&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=0&rotationZ=235&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=1.1&uFrequency=5.5&uSpeed=0.1&uStrength=2.4&uTime=0.2&wireframe=false";

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
    <div className="w-full min-h-[100vh]">
      <div className="absolute inset-0 w-full h-full overflow-hidden object-cover -z-10">
        <div className="w-full mx-auto rounded-md fixed inset-0 h-full overflow-hidden">
          <ShaderGradientCanvas
            importedFiber={{ ...fiber, ...drei, ...reactSpring }}
            style={{
              position: "absolute",
              top: 0,
            }}
          >
            <ShaderGradient
              control="query"
              urlString={isDarkMode ? bgDark : bgLight}
            />
          </ShaderGradientCanvas>
        </div>
      </div>
      <div className="w-full md:w-[85%] lg:w-[80%] h-full mx-auto p-1 md:p-6 bg-background/60 backdrop-blur ">
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
