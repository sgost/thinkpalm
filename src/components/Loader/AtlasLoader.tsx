import Lottie from "lottie-web";
import React, { useEffect } from "react";
import LoaderAnimation from "./loader.json";
import "./AtlasLoader.scss";

export default function AtlasLoader({isOverlay}: any) {
  useEffect(() => {
    Lottie.loadAnimation({
      container: document.querySelector("#atlas-loader"),
      animationData: LoaderAnimation,
      renderer: "svg", // "canvas", "html"
      loop: true, // boolean
      autoplay: true, // boolean
    });
  }, []);

  return (
    <div data-testid='loader' className={isOverlay ? "loaderContainerOverlay" : 'loaderContainer'}>
      <div id="atlas-loader" />
    </div>
  );
}
