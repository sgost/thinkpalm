import React, { useEffect, useState } from "react";
import axios from "axios";

const getRequest = (url: any) => {
  const [data, setData] = useState([]);

  const token =
    "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJXTTFNMldSbzJvOFV1ZGhzV0toZko1M2hsY3lad2dlb2RucVVqTHJxdnZVIn0.eyJleHAiOjE2NDc1MzI0MDYsImlhdCI6MTY0NzUyODgxMCwiYXV0aF90aW1lIjoxNjQ3NTI4ODA2LCJqdGkiOiI4NTQ3MjUxOC00ZGVlLTQyZTYtYmQ4ZC0yOTRkOWRlOGM3ZGYiLCJpc3MiOiJodHRwczovL2FjY291bnRzLXVhdC5hcG5leHRnZW4uY29tL2F1dGgvcmVhbG1zL2RzbW51dHJpdGlvbmFscHJvZHVjdHNhZyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJlZWQ5MjRiMy05N2IxLTQxMzMtYjZhMC0xMGUwMGRmNzAxNGUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhbmd1bGFyLXdlYi1jbGllbnQiLCJub25jZSI6ImIwZTQ5NmQwLWE2NGQtNDM2ZS04NzNiLTEwOWU1MWU0ZDAzMSIsInNlc3Npb25fc3RhdGUiOiI0MWU3MTNlMy1mNTk1LTRjNTAtYjYzMS0yNzAzMzM3NWIyZmUiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vZHNtbnV0cml0aW9uYWxwcm9kdWN0c2FnLXVhdC5hcG5leHRnZW4uY29tIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLWRzbW51dHJpdGlvbmFscHJvZHVjdHNhZy11YXQiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInJvbGUiOiJ1c2VyIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc0V4dGVybmFsIjp0cnVlLCJuYW1lIjoiU2ltb24gTGFzdG5hbWV1Nml1bGUiLCJjdXN0b21lcklkIjoiYTliYmVlNmQtNzk3YS00NzI0LWE4NmEtNWIxYTJlMjg3NjNmIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiZHNtbnV0cml0aW9uYWxwcm9kdWN0c2FnQHByb3Rvbm1haWwuY29tIiwiaWQiOiJlZWQ5MjRiMy05N2IxLTQxMzMtYjZhMC0xMGUwMGRmNzAxNGUiLCJnaXZlbl9uYW1lIjoiU2ltb24iLCJmYW1pbHlfbmFtZSI6Ikxhc3RuYW1ldTZpdWxlIiwiY3VzdG9tZXJOYW1lIjoiRFNNIE51dHJpdGlvbmFsIFByb2R1Y3RzIEFHIiwiZW1haWwiOiJkc21udXRyaXRpb25hbHByb2R1Y3RzYWdAcHJvdG9ubWFpbC5jb20ifQ.QFvMIddPd-7to_X6bG8A0C9nN_UJcUzh4OSGpO2aCjBuKWk-dBnKmuvxhw9fjfWYkFsM8wVKDDGg54_MjKfcP7AJasfbwDmQYgW1XX6vmeePTxeK58to8QxTW3i_qYweBeSmoWrg6dvxTqNGd66CbwdRqUeJG0XOg2hZLTuEdciBrl-sIGW56fmeX565YhluXtm4s3wPFQcXVscYSwyl46mDSRvM7BbsgucBsvbjt-82AxFxKpSAFDFjq7M_L7pLgr8FvSAcOkD_driD_UHgN9sXQ3jv3avH04IRgflwVUTOr0_IafulRJ9dwFXAvDRcTIgYH2MSmn3mvxFaNx-0MQ";

  const headers = {
    headers: {
      authorization: `Bearer ${token}`,
      "x-apng-base-region": "EMEA",
      "x-apng-customer-id": "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
      "x-apng-external": "true",
      "x-apng-inter-region": "0",
      "x-apng-target-region": "EMEA",
      customer_id: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
    },
  };

  useEffect(() => {
    axios
      .get(url, headers)
      .then((res: any) => {
        setData(res);
      })
      .catch((e: any) => {
        console.log("error", e);
      });
  }, [url]);

  return data;
};

export default getRequest;
