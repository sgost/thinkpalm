import React, { useEffect, useState } from "react";
import "./invoices.scss";
import { Icon, DatePicker, Table } from "atlasuikit";
import MyDropdown from "../../../components/MyDropdown/Dropdown";
import { FaEllipsisH } from "react-icons/fa";
import axios from "axios";


export default function Invoices() {

  const api = 'https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/customer/filter?page=1&pageSize=10000';
  const token = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJXTTFNMldSbzJvOFV1ZGhzV0toZko1M2hsY3lad2dlb2RucVVqTHJxdnZVIn0.eyJleHAiOjE2NDc1MDA2MDcsImlhdCI6MTY0NzQ5NzAwOSwiYXV0aF90aW1lIjoxNjQ3NDk3MDA3LCJqdGkiOiJhYThmMjhjNS02ZDk2LTRhNzktOWRkZS1lNWQ5N2E0MWVhYzEiLCJpc3MiOiJodHRwczovL2FjY291bnRzLXVhdC5hcG5leHRnZW4uY29tL2F1dGgvcmVhbG1zL2RzbW51dHJpdGlvbmFscHJvZHVjdHNhZyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJlZWQ5MjRiMy05N2IxLTQxMzMtYjZhMC0xMGUwMGRmNzAxNGUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhbmd1bGFyLXdlYi1jbGllbnQiLCJub25jZSI6ImUzNDdlNmY4LWVhOTItNDgxNy05OWVmLWQ4ODk0ZWM1NWJkMSIsInNlc3Npb25fc3RhdGUiOiJiMjlmNDY3ZS1hYzI2LTRlMTQtODE0OC1lNjhhZDU1ZjA2NDMiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vZHNtbnV0cml0aW9uYWxwcm9kdWN0c2FnLXVhdC5hcG5leHRnZW4uY29tIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLWRzbW51dHJpdGlvbmFscHJvZHVjdHNhZy11YXQiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInJvbGUiOiJ1c2VyIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc0V4dGVybmFsIjp0cnVlLCJuYW1lIjoiU2ltb24gTGFzdG5hbWV1Nml1bGUiLCJjdXN0b21lcklkIjoiYTliYmVlNmQtNzk3YS00NzI0LWE4NmEtNWIxYTJlMjg3NjNmIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiZHNtbnV0cml0aW9uYWxwcm9kdWN0c2FnQHByb3Rvbm1haWwuY29tIiwiaWQiOiJlZWQ5MjRiMy05N2IxLTQxMzMtYjZhMC0xMGUwMGRmNzAxNGUiLCJnaXZlbl9uYW1lIjoiU2ltb24iLCJmYW1pbHlfbmFtZSI6Ikxhc3RuYW1ldTZpdWxlIiwiY3VzdG9tZXJOYW1lIjoiRFNNIE51dHJpdGlvbmFsIFByb2R1Y3RzIEFHIiwiZW1haWwiOiJkc21udXRyaXRpb25hbHByb2R1Y3RzYWdAcHJvdG9ubWFpbC5jb20ifQ.iOlMj_ZZ5ZL126EBlNVOKmJtP1ZfLmI872ewK2aUCVBpMRF_2ioJgoErXzIfO9lSUi5HTwUV9STH2Ytr2GBE_Z7jXKmk-7ryrG9BgnUBBIATO-TBH87dmSwzm1cr1BAw2OXBhC-hVHj8nsAfL2jF0Go1ngyG0Ge4UWt9-5lpRHrd2P9rQvj01K0iwVqkbL9522dDjnaVSYCaW-tW_tv_4HJZxYt-Vyf97HyRBx5WJY3TWtB2G7kUVOvN5ZQKgMAD-Nv2v3YgfUtSG86tbQ5EdL8m7JA1YmPvIUjJ0RCrYOei2TcIjby22Ns56I0pKYgvR5Chdygmfg5u-tThHbw06Q'

  const [types, setTypes] = useState([
    {
      isSelected: false,
      label: "Contractor Invoice",
      value: "contractorInvoice",
    },
    {
      isSelected: false,
      label: "Credit Memo",
      value: "creditMemo",
    },
    {
      isSelected: false,
      label: "Payroll",
      value: "payroll",
    },
  ]);

  const [isTypeOpen, setIsTypeOpen] = useState(false);

  const [status, setStatus] = useState([
    {
      isSelected: false,
      label: "Approved",
      value: "approved",
    },
    {
      isSelected: false,
      label: "Paid",
      value: "paid",
    },
  ]);

  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [checkedData, setCheckedData] = useState([]);
  const [Data, setData] = useState({
    columns: [
      {
        header: "Invoice No.",
        isDefault: true,
        key: "invoiceNo",
      },
      {
        header: "Customer",
        isDefault: true,
        key: "customer",
      },
      {
        header: "Status",
        isDefault: true,
        key: "statusLabel",
      },
      {
        header: "Type",
        isDefault: true,
        key: "transactionTypeLabel",
      },
      {
        header: "Invoice Date",
        isDefault: true,
        key: "createdDate",
      },
      {
        header: "Due Date",
        isDefault: true,
        key: "dueDate",
      },
      {
        header: "Total",
        isDefault: true,
        key: "totalAmount",
      },
      {
        header: "Balance",
        isDefault: true,
        key: "invoiceBalance",
      },
    ],
    data: [],
  });



  console.log("checkedData::::", checkedData);

  useEffect(() => {
    console.log("type", isTypeOpen);
  }, [isTypeOpen]);

  useEffect(() => {
    axios.get(api, {
      headers: {
        "authorization": `Bearer ${token}`,
        "x-apng-base-region": "EMEA",
        "x-apng-customer-id": "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
        "x-apng-external": "true",
        "x-apng-inter-region": "0",
        "x-apng-target-region": "EMEA",
        "customer_id": "a9bbee6d-797a-4724-a86a-5b1a2e28763f"
      }
    })
      .then((res) => {

        const myData = res.data.results.map((item: any) => {
          if (item.customer === null) {
            item.customer = ''
          }
          return item
        })

        myData.map((item: any) => {
          item.totalAmount = `USD ${item.totalAmount}`
          item.invoiceBalance = `USD ${item.invoiceBalance}`
        })

        setData({ ...Data, data: myData });

        console.log(" res.data.results", res.data.results)

      })
  }, []);

  console.log("Data:::", Data)


  const onRowCheckboxChange = (selectedRows: any) => {
    setCheckedData(selectedRows)
  }

  return (
    <div className="container">
      <div className="dropdowns">
        <div className="inputContainer">
          <Icon icon="search" size="small" />
          <input className="input" placeholder="Search Customer, Invoice No." />
        </div>
        <div className="pickers">
          <Icon icon="download" size="large" className="downloadicon" />
          <MyDropdown
            title="Types"
            isOpen={isTypeOpen}
            handleDropdownClick={() => {
              setIsTypeOpen(!isTypeOpen);
            }}
            handleDropOptionClick={(opt: any) => {
              let index = types.findIndex((e) => e.value === opt.value);
              let copy = [...types];
              copy.forEach((e, i) => {
                if (i === index) {
                  copy[index] = { ...opt, isSelected: true };
                } else {
                  copy[i] = { ...copy[i], isSelected: false };
                }
              });
              setTypes(copy);
              setIsTypeOpen(false);
            }}
            options={types}
          />
          <MyDropdown
            title="Status"
            isOpen={isStatusOpen}
            handleDropdownClick={() => {
              setIsStatusOpen(!isStatusOpen);
            }}
            handleDropOptionClick={(opt: any) => {
              let index = status.findIndex((e) => e.value === opt.value);
              let copy = [...status];
              copy.forEach((e, i) => {
                if (i === index) {
                  copy[index] = { ...opt, isSelected: true };
                } else {
                  copy[i] = { ...copy[i], isSelected: false };
                }
              });
              setStatus(copy);
              setIsStatusOpen(false);
            }}
            options={status}
          />

          <DatePicker
            handleDateChange={function noRefCheck() {}}
            label="Start Date"
            required
          />
          <FaEllipsisH className="icon" />
        </div>
      </div>

      <Table
        options={{
          ...Data,
          showDefaultColumn: true,
          enableMultiSelect: true,
          onRowCheckboxChange: onRowCheckboxChange
        }}
        colSort
        pagination
        pagingOptions={[10, 20, 30, 40]}
      />
    </div>
  );
}
