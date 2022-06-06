import React, { useEffect, useState } from "react";
import axios from "axios";

const getRequest = (url: any, token: any, cid?: any, isClient: any) => {
  const [data, setData] = useState([]);

  const headers = {
    headers: {
      authorization: `Bearer ${token}`,
      "x-apng-base-region": "EMEA",
      "x-apng-customer-id": cid ? cid : "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
      "x-apng-external": isClient,
      "x-apng-inter-region": "0",
      "x-apng-target-region": "EMEA",
      customer_id: cid ? cid : "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
    },
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
