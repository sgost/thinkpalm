import React, { useEffect, useState } from "react";
import axios from "axios";
import { getHeaders } from "../../urls/urls";

const getRequest = (url: any, token: any, cid?: any, isClient: any) => {
  const [data, setData] = useState([]);

  const headers = {
    headers: getHeaders(token, cid, isClient),
  };

  useEffect(() => {
    if (url) {
      axios
        .get(url, headers)
        .then((res: any) => {
          setData(res);
        })
        .catch((e: any) => {
          console.log("error", e);
        });
    }
  }, [url, token]);

  return data;
};

export default getRequest;
