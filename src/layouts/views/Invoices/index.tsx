import React, { useEffect, useState } from "react";
import "./invoices.scss";
import { Icon, DatePicker, Table } from "atlasuikit";
import { tableData } from "./mockdata";
import MyDropdown from "../../../components/MyDropdown/Dropdown";
import { FaEllipsisH } from "react-icons/fa";

export default function Invoices() {
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

  useEffect(() => {
    console.log("type", isTypeOpen);
  }, [isTypeOpen]);

  return (
    <div className="container">
      {/* <h2 className="pay">Pay</h2>

      <div className="tab">
        <p className="tabTextPassive">Employee Pay</p>
        <p className="tabTextPassive">Contractor Pay</p>
        <p className="tabTextActive">Invoices</p>
      </div> */}

      <div className="dropdowns">
        <div className="inputContainer">
          <Icon icon="search" size="small" />
          <input className="input" placeholder="Search Customer, Invoice No." />
        </div>
        <div className="pickers">
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
        options={tableData}
        colSort
        pagination
        pagingOptions={[10, 20, 30, 40]}
      />
    </div>
  );
}
