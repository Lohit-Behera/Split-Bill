import React from "react";
import "./Loader.css";

// this loader is from here https://uiverse.io/fahrerzeit/angry-insect-11
function Loader({ className }) {
  return (
    <div className={`${className} w-full flex justify-center items-center`}>
      <div className="spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default Loader;
