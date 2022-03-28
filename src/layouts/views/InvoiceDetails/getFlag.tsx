import React from "react";
import ac from "./flags/4x3/ac.svg";
import ad from "./flags/4x3/ad.svg";
import ae from "./flags/4x3/ae.svg";
import af from "./flags/4x3/af.svg";
import ag from "./flags/4x3/ag.svg";
import al from "./flags/4x3/al.svg";
import am from "./flags/4x3/am.svg";
import ao from "./flags/4x3/ao.svg";
import aq from "./flags/4x3/aq.svg";
import ar from "./flags/4x3/ar.svg";
import as from "./flags/4x3/as.svg";
import at from "./flags/4x3/at.svg";
import au from "./flags/4x3/au.svg";
import aw from "./flags/4x3/aw.svg";
import ax from "./flags/4x3/ax.svg";
import az from "./flags/4x3/az.svg";
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
