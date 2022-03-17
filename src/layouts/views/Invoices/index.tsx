import React, { useEffect, useState } from "react";
import "./invoices.scss";
import { Icon, DatePicker, Table } from "atlasuikit";
import MyDropdown from "../../../components/MyDropdown/Dropdown";
import { FaEllipsisH } from "react-icons/fa";
import DatepickerDropdown from "../../../components/DatepickerDropdown/DatepickerDropdown";
import { useNavigate } from "react-router-dom";
import axios from "axios";


export default function Invoices() {

  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [transactionTypes, setTransactionTypes] = useState('');
  const [statusType, setStatusType] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [dateFrom, setDateFrom] = useState('');


  const api = `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/customer/filter?page=1&pageSize=10000&transactionTypes=${transactionTypes}&statuses=${statusType}`;
  const token = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJXTTFNMldSbzJvOFV1ZGhzV0toZko1M2hsY3lad2dlb2RucVVqTHJxdnZVIn0.eyJleHAiOjE2NDc1MjI2NjksImlhdCI6MTY0NzUxOTA3MSwiYXV0aF90aW1lIjoxNjQ3NTE5MDY5LCJqdGkiOiJjY2RiODBkNi04ZjAzLTRhNzAtYjIzOC03YjM3MjYyZDM3MmEiLCJpc3MiOiJodHRwczovL2FjY291bnRzLXVhdC5hcG5leHRnZW4uY29tL2F1dGgvcmVhbG1zL2RzbW51dHJpdGlvbmFscHJvZHVjdHNhZyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJlZWQ5MjRiMy05N2IxLTQxMzMtYjZhMC0xMGUwMGRmNzAxNGUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhbmd1bGFyLXdlYi1jbGllbnQiLCJub25jZSI6IjE3MDY4OTU0LWFiMGUtNDM5My05NGYzLTRhNzM4NWQwNjY1YiIsInNlc3Npb25fc3RhdGUiOiI3NjQyNzVkZC0xNmZhLTRjMjQtYmRmNS0yZTY0Y2VlYjBjZTMiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vZHNtbnV0cml0aW9uYWxwcm9kdWN0c2FnLXVhdC5hcG5leHRnZW4uY29tIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLWRzbW51dHJpdGlvbmFscHJvZHVjdHNhZy11YXQiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInJvbGUiOiJ1c2VyIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc0V4dGVybmFsIjp0cnVlLCJuYW1lIjoiU2ltb24gTGFzdG5hbWV1Nml1bGUiLCJjdXN0b21lcklkIjoiYTliYmVlNmQtNzk3YS00NzI0LWE4NmEtNWIxYTJlMjg3NjNmIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiZHNtbnV0cml0aW9uYWxwcm9kdWN0c2FnQHByb3Rvbm1haWwuY29tIiwiaWQiOiJlZWQ5MjRiMy05N2IxLTQxMzMtYjZhMC0xMGUwMGRmNzAxNGUiLCJnaXZlbl9uYW1lIjoiU2ltb24iLCJmYW1pbHlfbmFtZSI6Ikxhc3RuYW1ldTZpdWxlIiwiY3VzdG9tZXJOYW1lIjoiRFNNIE51dHJpdGlvbmFsIFByb2R1Y3RzIEFHIiwiZW1haWwiOiJkc21udXRyaXRpb25hbHByb2R1Y3RzYWdAcHJvdG9ubWFpbC5jb20ifQ.eUDRkMMUaOu9Qe2P82NpEd-JDKU8J7DykExGsLUP8OllbgVSfHcpH5KBoaPhrLUpx7DjqkJq4oaF0n0NEhRC-DnUvv3Ky_tg_jtGMeMhSU6b5HUDTjaDAfuJDcQO4zitB5r5g4udR2k0OyPiMnC-j5Kuw_6_1FecSXBzMqDHlJETm4IiKz62mImN4RYsopLAsoUVr4Ot8GDJMdwvRijjNATA3yOo2kQ58igCeYvN9OI2QaqiWIZ8pH9mkZSBzu29PeTA-7O-sBsjLFepULOGrIdjwIKqbmosLgG48whukZnjkGQtvfQINX65z55jP_xnj-t1TqU6sJu5GIfqpjgVUA'
  
  const [types, setTypes] = useState([
    {
      isSelected: false,
      label: "Contractor Invoice",
      value: "contractorInvoice",
    },
    {
      isSelected: false,
      label: "Credit Memo",
      value: 4,
    },
    {
      isSelected: false,
      label: "Payroll",
      value: 1,
    },
    {
      isSelected: false,
      label: "Miscellaneous",
      value: 2,
    },
    {
      isSelected: false,
      label: "Proforma",
      value: 3,
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
      value: 5,
    },
    {
      isSelected: false,
      label: "Pending Approval",
      value: 3,
    },
    {
      isSelected: false,
      label: "Voided",
      value: 9,
    },
    {
      isSelected: false,
      label: "Closed",
      value: 8,
    },
  ]);

  

  let navigate = useNavigate();
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
      })
  }, [transactionTypes,statusType]);

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
          <Icon
            className="download"
            color="#526fd6"
            icon="download"
            size="large"
          />

          <DatepickerDropdown
            title="Date"
            isOpen={isDateOpen}
            setDateTo={setDateTo}
            setDateFrom={setDateFrom}
            handleDropOptionClick={() => {
              setIsDateOpen(!isDateOpen);
            }}
            handleDropdownClick={() => {
              setIsDateOpen(!isDateOpen);
            }}

          />

          <MyDropdown
            // data-testid="type-dd"
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

              let typesValue :any= copy[index]?.value;

              setTypes(copy);
              setIsTypeOpen(false);
              setTransactionTypes(typesValue);
            }}

            options={types}
          />

        
          <MyDropdown
            data-testid=""
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

              let statusValue : any = copy[index]?.value;

              setStatus(copy);
              setIsStatusOpen(false);
              setStatusType(statusValue);
            }}
            options={status}
          />

          {/* <DatePicker
            handleDateChange={function noRefCheck() {}}
            label="Start Date"
            required
          /> */}
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
        pagingOptions={[15, 30, 50, 100]}
        handleRowClick={() => {
          navigate("/details");
        }}
      />
    </div>
  );
}
