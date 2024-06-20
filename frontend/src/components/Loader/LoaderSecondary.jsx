import React from "react";
import "./LoaderSecondary.css";

// this loader is from https://uiverse.io/funkyjuice213/chilly-fireant-79

function ImageLoader({ className }) {
  return (
    <div className={`${className} flex justify-center items-center`}>
      <div className="loader">
        <div className="loader-bar bar-1"></div>
        <div className="loader-bar bar-2"></div>
        <div className="loader-bar bar-3"></div>
        <div className="loader-bar bar-4"></div>
      </div>
    </div>
  );
}

export default ImageLoader;
