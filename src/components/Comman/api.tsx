import React, { useEffect, useState } from "react";
import axios from "axios";

const getRequest = (url: any, token: any) => {
  const [data, setData] = useState([]);

  // const token =
  //   "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJXTTFNMldSbzJvOFV1ZGhzV0toZko1M2hsY3lad2dlb2RucVVqTHJxdnZVIn0.eyJleHAiOjE2NDgwMTM0MDksImlhdCI6MTY0Nzg0MTgxMiwiYXV0aF90aW1lIjoxNjQ3ODQwNjA5LCJqdGkiOiI2ODlkMDE2NS1mYWE1LTQwZTctODE2Yy0xOTQzNDQxZDFjNDkiLCJpc3MiOiJodHRwczovL2FjY291bnRzLXVhdC5hcG5leHRnZW4uY29tL2F1dGgvcmVhbG1zL2RzbW51dHJpdGlvbmFscHJvZHVjdHNhZyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJlZWQ5MjRiMy05N2IxLTQxMzMtYjZhMC0xMGUwMGRmNzAxNGUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhbmd1bGFyLXdlYi1jbGllbnQiLCJub25jZSI6IjRiOThiOWRjLWY0MTMtNGJmOC05YTg2LWVjMGY5MWE2MDM5MiIsInNlc3Npb25fc3RhdGUiOiJkZmJkMWU5Yy0wMGI1LTQ3NTItODk2ZS04ZTIzZTE5YTZiNWYiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vZHNtbnV0cml0aW9uYWxwcm9kdWN0c2FnLXVhdC5hcG5leHRnZW4uY29tIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLWRzbW51dHJpdGlvbmFscHJvZHVjdHNhZy11YXQiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInJvbGUiOiJ1c2VyIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc0V4dGVybmFsIjp0cnVlLCJuYW1lIjoiU2ltb24gTGFzdG5hbWV1Nml1bGUiLCJjdXN0b21lcklkIjoiYTliYmVlNmQtNzk3YS00NzI0LWE4NmEtNWIxYTJlMjg3NjNmIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiZHNtbnV0cml0aW9uYWxwcm9kdWN0c2FnQHByb3Rvbm1haWwuY29tIiwiaWQiOiJlZWQ5MjRiMy05N2IxLTQxMzMtYjZhMC0xMGUwMGRmNzAxNGUiLCJnaXZlbl9uYW1lIjoiU2ltb24iLCJmYW1pbHlfbmFtZSI6Ikxhc3RuYW1ldTZpdWxlIiwiY3VzdG9tZXJOYW1lIjoiRFNNIE51dHJpdGlvbmFsIFByb2R1Y3RzIEFHIiwiZW1haWwiOiJkc21udXRyaXRpb25hbHByb2R1Y3RzYWdAcHJvdG9ubWFpbC5jb20ifQ.Z-u67CuZfOakexCaEkuKCHxG0IhzQBZ5Iihgi6EkWp3jD4cW6aK528pP8OP7KJ39dEkKMKO50YPfkXb3dFg4fhDgWfajCr7juP7nORR0X9IPxXUo1bqW9frNZ5K_cbNbWFbDEsm2hDtF06-GCpbOQSlIDOQFPJviXWwt27Q4JsIhfxj_zDNl7Mww9YxS2rABCmiFZBAOuhINSayJ7gbKQAepv0w12QYHEm99xLUXzpg7k-XTHPmytBTLXgWl3oQinJY3_Mne4-16cISQavhVNrhjKagJIZxjPQoWpIJgRAaf_xchxDg58OOZQVuJ2CpoqNr_2sPmF2nRWx5b6lnZxg";

  // const token = localStorage.getItem("temptoken");

  const headers = {
    headers: {
      authorization: `Bearer ${token}`,
      "x-apng-base-region": "EMEA",
      "x-apng-customer-id": "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
      "x-apng-external": "false",
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
  }, [url, token]);

  return data;
};

export default getRequest;
