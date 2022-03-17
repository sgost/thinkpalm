import React, { useEffect, useState } from "react";
import axios from "axios";

 const getRequest = (url: any) => {

    const [ data, setData ] = useState([])

    const token = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJXTTFNMldSbzJvOFV1ZGhzV0toZko1M2hsY3lad2dlb2RucVVqTHJxdnZVIn0.eyJleHAiOjE2NDc1MTUwMTcsImlhdCI6MTY0NzUxMTQxOSwiYXV0aF90aW1lIjoxNjQ3NTExNDE3LCJqdGkiOiJjM2M1MjY0Zi1mNjdhLTQ3MGMtOGQ2Mi00Yjk3NjJiYWYyOGEiLCJpc3MiOiJodHRwczovL2FjY291bnRzLXVhdC5hcG5leHRnZW4uY29tL2F1dGgvcmVhbG1zL2RzbW51dHJpdGlvbmFscHJvZHVjdHNhZyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJlZWQ5MjRiMy05N2IxLTQxMzMtYjZhMC0xMGUwMGRmNzAxNGUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhbmd1bGFyLXdlYi1jbGllbnQiLCJub25jZSI6ImYwMjk5NjhhLTI3YWItNDNmYy04MjhkLTA1ZWYzOTQ0Zjk4ZSIsInNlc3Npb25fc3RhdGUiOiIwMDk2OTM5Mi1hOTg3LTRkOTktODQ1Yi1lZGM3YmUwZDlkZGYiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vZHNtbnV0cml0aW9uYWxwcm9kdWN0c2FnLXVhdC5hcG5leHRnZW4uY29tIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLWRzbW51dHJpdGlvbmFscHJvZHVjdHNhZy11YXQiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInJvbGUiOiJ1c2VyIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc0V4dGVybmFsIjp0cnVlLCJuYW1lIjoiU2ltb24gTGFzdG5hbWV1Nml1bGUiLCJjdXN0b21lcklkIjoiYTliYmVlNmQtNzk3YS00NzI0LWE4NmEtNWIxYTJlMjg3NjNmIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiZHNtbnV0cml0aW9uYWxwcm9kdWN0c2FnQHByb3Rvbm1haWwuY29tIiwiaWQiOiJlZWQ5MjRiMy05N2IxLTQxMzMtYjZhMC0xMGUwMGRmNzAxNGUiLCJnaXZlbl9uYW1lIjoiU2ltb24iLCJmYW1pbHlfbmFtZSI6Ikxhc3RuYW1ldTZpdWxlIiwiY3VzdG9tZXJOYW1lIjoiRFNNIE51dHJpdGlvbmFsIFByb2R1Y3RzIEFHIiwiZW1haWwiOiJkc21udXRyaXRpb25hbHByb2R1Y3RzYWdAcHJvdG9ubWFpbC5jb20ifQ.WPbMSwjSSmZZfyF0XD2gRG_6RBKgqkhsqAyE02_Q6mweTvps3PqzAkV8A8s2uakmYi5mM_1dzoXLFo1g_HNSGsvSh0WSpkQxeKoHkHUZGZaMaWNSKO9MStpnuFdlb0KnyC-6eqOvDcl7Eut7A9ljCUd91s4ivm3wMKgji9Q7o1V7439nNUSCkpl1GoC58klRizMNL_UDrvNNK3MoLaMYwbwEz3ceQutWrqjMqNSL5e9N7h4QHII0u7QfAQyXHVrTi21w_zOWdhpj2YwLiVvfQdWZs5-1-0dRvifCEOEq65fJuC7GC27Zfv33_MdKXL7pxMqpokhQ16jEHMaHUmwQSQ'

    const headers = {
        headers: {
            "authorization": `Bearer ${token}`,
            "x-apng-base-region": "EMEA",
            "x-apng-customer-id": "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
            "x-apng-external": "true",
            "x-apng-inter-region": "0",
            "x-apng-target-region": "EMEA",
            "customer_id": "a9bbee6d-797a-4724-a86a-5b1a2e28763f"
        }
    }

  useEffect(() => {
    axios.get(url, headers)
    .then((res: any) => {
        setData(res) 
    })
    .catch((e: any) => {
        console.log("error", e)
    })
  }, [])

    return data
}

export default getRequest;
