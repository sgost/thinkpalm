import React, { useEffect, useState } from "react";
import "./invoices.scss";
import { Icon, DatePicker, Table } from "atlasuikit";
import MyDropdown from "../../../components/MyDropdown/Dropdown";
import { FaEllipsisH } from "react-icons/fa";
import { format } from 'date-fns'
import getRequest from "src/components/Comman/api";


export default function Invoices() {

  const api = 'https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/customer/filter?page=1&pageSize=10000';

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

  const apiData: any = getRequest(api)
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [checkedData, setCheckedData] = useState([]);
  const [Tabledata, seTabletData] = useState({
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
   if (apiData?.data?.results) {
      const apiTableData = apiData?.data?.results;

    apiTableData?.map((item: any) => {
      if (item.customer === null) {
        item.customer = ''
      }
      item.totalAmount = `USD ${item.totalAmount}`
      item.invoiceBalance = `USD ${item.invoiceBalance}`
      item.createdDate = format(new Date(item.createdDate), 'd MMM yyyy')
      item.dueDate = format(new Date(item.dueDate), 'd MMM yyyy')
    });

    seTabletData({ ...Tabledata, data: apiTableData });
   }
  }, [apiData])

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
          ...Tabledata,
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
