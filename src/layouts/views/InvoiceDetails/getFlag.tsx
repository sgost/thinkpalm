import React from "react";
import ac from "./flags/4x3/ac.svg";
import ke from "./flags/4x3/ke.svg";
import us from "./flags/4x3/us.svg";

const flags: any = {
  ac,
  ke,
  us,
};

export default function GetFlag(props: any) {
  const Flag = flags[props.code.toLowerCase()];
  return (
    <img src={Flag} />
    // <div>
    //   <Flag />
    // </div>
  );
}
