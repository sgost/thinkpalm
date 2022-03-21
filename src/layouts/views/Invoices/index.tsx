import React, { useEffect, useState } from "react";
import "./invoices.scss";
import { Icon, Button, Table } from "atlasuikit";
import MyDropdown from "../../../components/MyDropdown/Dropdown";
import { FaEllipsisH } from "react-icons/fa";
import DatepickerDropdown from "../../../components/DatepickerDropdown/DatepickerDropdown";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import getRequest from "../../../components/Comman/api";
import { clientTableData, tableData } from "./mockdata";

export default function Invoices() {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [transactionTypes, setTransactionTypes] = useState("");
  const [statusType, setStatusType] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [dateFrom, setDateFrom] = useState("");

  const [isClient, setIsClient] = useState<any>(null);

  const api = `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/customer/filter?page=1&pageSize=10000&transactionTypes=${transactionTypes}&statuses=${statusType}`;

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
  const apiData: any = getRequest(api);
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
          item.customer = "";
        }
        item.totalAmount = `USD ${item.totalAmount}`;
        item.invoiceBalance = `USD ${item.invoiceBalance}`;
        item.createdDate = format(new Date(item.createdDate), "d MMM yyyy");
        item.dueDate = format(new Date(item.dueDate), "d MMM yyyy");
      });

      seTabletData({ ...Tabledata, data: apiTableData });
    }
  }, [apiData, transactionTypes, statusType]);

  const onRowCheckboxChange = (selectedRows: any) => {
    setCheckedData(selectedRows);
  };

  if (isClient === null) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <Button
          handleOnClick={() => setIsClient(true)}
          className="primary-blue small"
          label="Client View"
        />
        <Button
          handleOnClick={() => setIsClient(false)}
          className="secondary-btn small"
          label="Internal View"
        />
      </div>
    );
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

              let typesValue: any = copy[index]?.value;

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

              let statusValue: any = copy[index]?.value;

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
        options={
          isClient
            ? clientTableData
            : {
                ...Tabledata,
                showDefaultColumn: true,
                enableMultiSelect: true,
                onRowCheckboxChange: onRowCheckboxChange,
              }
        }
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
