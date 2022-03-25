import React from "react";
import ac from "./flags/4x3/ac.svg";

const flags = {
  ac,
};

export default function GetFlag() {
  const Flag = flags["ac"];
  return (
    <img src={Flag} />
    // <div>
    //   <Flag />
    // </div>
  );
}
