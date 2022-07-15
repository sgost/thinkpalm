import React, { useEffect, useState } from "react";
import axios from "axios";
import { getHeaders } from "../../urls/urls";

const getRequest = (url: any, token: any, cid?: any, isClient: any, setLoader:any, setDropdownsDisableInStarting: any) => {
  const [data, setData] = useState([]);

  const headers = {
    headers: getHeaders(token, cid, isClient),
  };

  useEffect(() => {
    setLoader(true)
    if (url) {
      axios
        .get(url, headers)
        .then((res: any) => {
          setData(res);
          setLoader(false)
          setDropdownsDisableInStarting(false)
        })
        .catch((e: any) => {
          console.log("error", e);
          setLoader(false)
        });
    }
  }, [url, token]);

  return data;
};

export default getRequest;
