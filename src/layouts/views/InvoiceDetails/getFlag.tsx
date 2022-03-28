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
import ba from "./flags/4x3/ba.svg";
import bb from "./flags/4x3/bb.svg";
import bd from "./flags/4x3/bd.svg";
import be from "./flags/4x3/be.svg";
import bf from "./flags/4x3/bf.svg";
import bg from "./flags/4x3/ay.svg";
import bh from "./flags/4x3/bh.svg";
import bi from "./flags/4x3/bi.svg";
import bj from "./flags/4x3/bj.svg";
import bl from "./flags/4x3/bl.svg";
import bm from "./flags/4x3/bm.svg";
import bn from "./flags/4x3/bn.svg";
import bo from "./flags/4x3/bo.svg";
import bq from "./flags/4x3/bq.svg";
import br from "./flags/4x3/br.svg";
import bs from "./flags/4x3/bs.svg";
import bt from "./flags/4x3/bt.svg";
import bv from "./flags/4x3/bv.svg";
import bw from "./flags/4x3/bw.svg";
import by from "./flags/4x3/by.svg";
import bz from "./flags/4x3/bz.svg";
import ca from "./flags/4x3/ca.svg";
import cc from "./flags/4x3/cc.svg";
import cd from "./flags/4x3/cd.svg";
import cf from "./flags/4x3/cf.svg";
import cg from "./flags/4x3/cg.svg";
import ch from "./flags/4x3/ch.svg";
import ci from "./flags/4x3/ci.svg";
import ck from "./flags/4x3/ck.svg";
import cl from "./flags/4x3/cl.svg";
import cm from "./flags/4x3/cm.svg";
import cn from "./flags/4x3/cn.svg";
import co from "./flags/4x3/co.svg";
import cp from "./flags/4x3/cp.svg";
import cr from "./flags/4x3/cr.svg";
import cu from "./flags/4x3/cu.svg";
import cv from "./flags/4x3/ay.svg";
import cw from "./flags/4x3/cw.svg";
import cx from "./flags/4x3/cx.svg";
import cy from "./flags/4x3/cy.svg";
import cz from "./flags/4x3/cz.svg";

import ke from "./flags/4x3/ke.svg";
import us from "./flags/4x3/us.svg";
import ay from "./flags/4x3/ay.svg";

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
