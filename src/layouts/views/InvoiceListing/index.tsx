import React, { useEffect, useState } from "react";
import { Icon, Button, Table } from "atlasuikit";
import { FaEllipsisH } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import axios from "axios";
import MyDropdown from "../../../components/MyDropdown/Dropdown";
import DatepickerDropdown from "../../../components/DatepickerDropdown/DatepickerDropdown";
import getRequest from "../../../components/Comman/api";
import "./invoices.scss";

export default function InvoiceListing() {
  let navigate = useNavigate();
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [checkedData, setCheckedData] = useState([]);
  const [transactionTypes, setTransactionTypes] = useState("");
  const [statusType, setStatusType] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [isClient, setIsClient] = useState<any>(null);
  const [dropdownLabel, setDropdownLabel] = useState({
    types: '',
    status: ''
  })
  const [selectedDate, setSelectedDate] = useState({
    startDate: '',
    endDate: '',
    day: ''
  });
  const [singleInvoiceId, setSingleInvoiceId] = useState('')
  const [multiInvoiceId, setMultiInvoiveId] = useState([])
  const [token, setToken] = useState("eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJxa1VoLVl2LWc3c25Zc3ktN1ktZVk0OE5TLTlzdldjWm9aMXFoMzZoYnpjIn0.eyJleHAiOjE2NDgyOTQ5ODUsImlhdCI6MTY0ODEyMjE4NywiYXV0aF90aW1lIjoxNjQ4MTIyMTg1LCJqdGkiOiJjNTQ0YWZkMy0wZmY3LTQ0M2UtOGJlMy1kNThhNjY2MDFlMmIiLCJpc3MiOiJodHRwczovL2FjY291bnRzLXVhdC5hcG5leHRnZW4uY29tL2F1dGgvcmVhbG1zL2VsZW1lbnRzZ3MiLCJzdWIiOiI3NWM2MmFiNi1iMWMyLTQ5NTEtYmY2Yy00MjA3ZGQwZmEwNmEiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhbmd1bGFyLXdlYi1jbGllbnQiLCJub25jZSI6ImZkZTIxNzg3LWYwNTAtNDY1MC04NDk5LTM5NGVlZTU5YTE0OSIsInNlc3Npb25fc3RhdGUiOiI1MzhhMTkyZS1jZDNiLTQ5OTktYjk1Yy0wNWI1ZmUxZmRkZGYiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vd3d3LXVhdC5hcG5leHRnZW4uY29tIiwiaHR0cHM6Ly9lbGVtZW50c2dzLW5nLmFwbmV4dGdlbi5jb20iLCJodHRwczovL2VsZW1lbnRzZ3MtdWF0LmFwbmV4dGdlbi5jb20iXSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInJvbGUiOiJBcHByb3ZQYXlPd25lcnMiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImlzRXh0ZXJuYWwiOmZhbHNlLCJuYW1lIjoiSmFzbWluZSBLYXVyIiwiaWQiOiI3NWM2MmFiNi1iMWMyLTQ5NTEtYmY2Yy00MjA3ZGQwZmEwNmEiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJqYXNtaW5la0BlbGVtZW50c2dzLmNvbSIsImdpdmVuX25hbWUiOiJKYXNtaW5lIiwiZmFtaWx5X25hbWUiOiJLYXVyIiwiZW1haWwiOiJqYXNtaW5la0BlbGVtZW50c2dzLmNvbSJ9.ITHj9my5xy4lZTbdOUOyXz31irOW4fWU0jcsXCIaZjsZCPigNmNbGxDatapZNBNOD86QaDdeLFPhu23DTeKnzvGJjtrDIsuqilqYehZtN5omnGdb3wCCLfiJNLPuEzm2Sn3Wc--a05sKDVbOof8V6i_RUSMGgNesbVysl9Kc7ySdExpQF2ZCEkDLQP3GfjPS1oiik18_eK7qEJskdZ4jeSEVIKup9GPJ4REUyVyCdb9E0I7RZ6Q3BikGxpAzaeFpG4Van6V1-wT6WtOKMeWcTdJ0N35Xefq8Z4KGrN4IWg2z2wIiRiORik98DQQKje05WSU9dV66FI06nAxncW7Pww");
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
  const [internalTabledata, setInternalTabletData] = useState({
    columns: [
      {
        header: "Invoice Number",
        isDefault: true,
        key: "invoiceNo",
      },
      {
        header: "Customer",
        isDefault: true,
        // key: "customer",
        key: "customerName",
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
  const [clientTableData, setClientTableData] = useState({
    columns: [
      {
        header: "Invoice Number",
        isDefault: true,
        key: "invoiceNo",
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
        header: "Payment Due",
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
  })

  let api = ``;

  const apiFunc = () => {
    if (isClient !== null && isClient === true) {
      api = `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/customer/filter?page=1&pageSize=10000&transactionTypes=${transactionTypes}&statuses=${statusType}&dateFrom=${dateFrom}&dateTo=${dateTo}`
      return api
    }
    else if (isClient !== null && isClient === false) {
      api = `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/filter?page=1&pageSize=10000&transactionTypes=${transactionTypes}&statuses=${statusType}&dateFrom=${dateFrom}&dateTo=${dateTo}`
      return api
    }
    else {
      api = ''
      return api;
    }
  }

  const apiData: any = getRequest(apiFunc(), token);

  const clearFilter = () => {
    setTransactionTypes('');
    setStatusType('');
    setDateTo('');
    setDateFrom('');
    setSelectedDate({
      startDate: '',
      endDate: '',
      day: ''
    });
    setDropdownLabel({
      types: '',
      status: ''
    })
  }

  useEffect(() => {
    console.log("type", isTypeOpen);
  }, [isTypeOpen]);

  useEffect(() => {
    if (apiData?.data?.results) {
      const apiTableData = apiData?.data?.results;
      console.log("api data", apiTableData);

      apiTableData?.map((item: any) => {
        item.totalAmount = `USD ${item.totalAmount.toLocaleString()}`
        item.invoiceBalance = `USD ${item.invoiceBalance.toLocaleString()}`
        item.createdDate = format(new Date(item.createdDate), 'd MMM yyyy')
        item.dueDate = format(new Date(item.dueDate), 'd MMM yyyy')
      });

      setInternalTabletData({ ...internalTabledata, data: apiTableData });
    }
  }, [apiData, transactionTypes, statusType, dateFrom, dateTo]);

  useEffect(() => {
    if (apiData?.data?.results) {
      const apiTableData = apiData?.data?.results;

      apiTableData?.map((item: any) => {
        item.createdDate = format(new Date(item.createdDate), 'd MMM yyyy')
        item.dueDate = format(new Date(item.dueDate), 'd MMM yyyy')
      });

      setClientTableData({ ...clientTableData, data: apiTableData });

    }
  }, [apiData, transactionTypes, statusType, dateFrom, dateTo])

  const handleDropdown = () => {
    if (isTypeOpen || isStatusOpen || isDateOpen) {
      setIsTypeOpen(false);
      setIsStatusOpen(false);
      setIsDateOpen(false);
    }
  }

  const onRowCheckboxChange = (selectedRows: any) => {
    if (selectedRows.length == 1) {
      let id: any;
      selectedRows.map((item: any) => {
        id = item.id;
      })
      setSingleInvoiceId(id);
      setMultiInvoiveId([])
      setCheckedData(selectedRows);
    }
    else if (selectedRows.length >= 1) {
      const multiId = selectedRows.map((items: any) => {
        return items.id;
      })

      setMultiInvoiveId(multiId)
      setSingleInvoiceId("");
      setCheckedData(selectedRows)
    }
  };

  const downloadFunction = () => {
    const headers = {
      headers: {
        "authorization": `Bearer ${token}`,
        "x-apng-base-region": "EMEA",
        "x-apng-customer-id": "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
        "x-apng-external": "true",
        "x-apng-inter-region": "0",
        "x-apng-target-region": "EMEA",
        "customer_id": "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
        'Content-Type': 'application/json'
      },
    };
    if (singleInvoiceId) {
      const api = `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/generatePDF/${singleInvoiceId}`;
      axios.get(api, headers)
        .then((res: any) => {
          if (res.status === 200) {
            let url = res.data.url
            let a = document.createElement('a');
            a.href = url;
            a.download = `${res.data.name}`;
            a.click();
          }
        })
        .catch((e: any) => {
          console.log("error", e);
        });
    }
    else if (multiInvoiceId) {
      const api = `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/GeneratePDFMultiple`;
      axios({
        method: 'get',
        url: api,
        headers: headers.headers,
        data: multiInvoiceId
      })
        .then((res: any) => {
          if (res.status === 200) {
            let url = res.data.url
            let a = document.createElement('a');
            a.href = url;
            a.download = `${res.data.name}`;
            a.click();
          }
        })
        .catch((e: any) => {
          console.log("error", e);
        });
    }
  }


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
        <p>Enter token</p>
        <input value={token} onChange={(e) => setToken(e.target.value)} />
        <Button
          handleOnClick={() => {
            localStorage.setItem("temptoken", token);
            setIsClient(true);
          }}
          className="primary-blue small"
          label="Client View"
        />
        <Button
          handleOnClick={() => {
            localStorage.setItem("temptoken", token);
            setIsClient(false);
          }}
          className="secondary-btn small"
          label="Internal View"
        />
      </div>
    );
  }

  return (
    <div className="container" onClick={() => handleDropdown()}>
      <div className="dropdowns">
        <div className="inputContainer">
          <Icon icon="search" size="large" />
          <input className="input" placeholder={isClient ? "Search Invoices" : "Search by Invoice, Customer"} />
        </div>
        <div className="pickers">
          <div onClick={downloadFunction}>
            <Icon
              className="download"
              color="#526fd6"
              icon="download"
              size="large"
            />
          </div>

          <DatepickerDropdown
            title="Date"
            isOpen={isDateOpen}
            setDateTo={setDateTo}
            setDateFrom={setDateFrom}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            handleDropOptionClick={(item: any) => {
              var date = new Date();
              switch (item) {
                case 'Today':
                  const todayDate = format(date, "yyyy-MM-dd")
                  setDateFrom(todayDate);
                  setDateTo(todayDate);
                  break;

                case 'Yesterday':
                  const yesterdayDate = date.setDate(date.getDate() - 1);
                  const yesterdayFormatDate = format(yesterdayDate, "yyyy-MM-dd")
                  setDateFrom(yesterdayFormatDate);
                  setDateTo(yesterdayFormatDate);
                  break;

                case 'This Week':
                  const thisWeekStartDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7);
                  const thisWeekEndDate = date.setDate(date.getDate() - 1);
                  const thisWeekStartFormatDate = format(thisWeekStartDate, "yyyy-MM-dd")
                  const thisWeekEndFormatDate = format(thisWeekEndDate, "yyyy-MM-dd")
                  setDateFrom(thisWeekStartFormatDate);
                  setDateTo(thisWeekEndFormatDate);
                  break;

                case 'This Month':
                  const thisMonthStartDate = new Date(date.getFullYear(), date.getMonth(), 1);
                  const thisMonthEndDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                  const thisMonthStartFormatDate = format(thisMonthStartDate, "yyyy-MM-dd")
                  const thisMonthEndFormatDate = format(thisMonthEndDate, "yyyy-MM-dd")
                  setDateFrom(thisMonthStartFormatDate);
                  setDateTo(thisMonthEndFormatDate);
                  break;

                case 'This Quarter':
                  const quarter = Math.floor((date.getMonth() / 3));
                  const thisQuarterStartDate = new Date(date.getFullYear(), quarter * 3, 1);
                  const thisQuarterEndDate = new Date(thisQuarterStartDate.getFullYear(), thisQuarterStartDate.getMonth() + 3, 0);
                  const thisQuarterStartFormatDate = format(thisQuarterStartDate, "yyyy-MM-dd")
                  const thisQuarterEndFormatDate = format(thisQuarterEndDate, "yyyy-MM-dd")
                  setDateFrom(thisQuarterStartFormatDate);
                  setDateTo(thisQuarterEndFormatDate);
                  break;

                case 'This Year':
                  const thisYearStartDate = new Date(date.getFullYear(), 0, 1);
                  const thisYearEndDate = new Date(date.getFullYear(), 11, 31);
                  const thisYearStartFormatDate = format(thisYearStartDate, "yyyy-MM-dd")
                  const thisYearEndFormatDate = format(thisYearEndDate, "yyyy-MM-dd")
                  setDateFrom(thisYearStartFormatDate);
                  setDateTo(thisYearEndFormatDate);
                  break;
              }
              setIsDateOpen(!isDateOpen);
            }}
            handleDropdownClick={() => {
              setIsDateOpen(!isDateOpen);
            }}
          />

          <MyDropdown
            // data-testid="type-dd"
            title="Type"
            isOpen={isTypeOpen}
            dropdownLabel={dropdownLabel}
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
              setDropdownLabel({ ...dropdownLabel, types: copy[index]?.label })
            }}
            options={types}
          />

          <MyDropdown
            data-testid=""
            title="Status"
            isOpen={isStatusOpen}
            dropdownLabel={dropdownLabel}
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
              setDropdownLabel({ ...dropdownLabel, status: copy[index]?.label })
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

      <div className="clearfilter" onClick={clearFilter}>
        <Icon
          className="remove"
          color="#526fd6"
          icon="remove"
          size="medium"
        />
        <h5>Clear Filters</h5>
      </div>

      <Table
        options={
          isClient
            ? {
              ...clientTableData,
              // showDefaultColumn: true,
              enableMultiSelect: true,
              onRowCheckboxChange: onRowCheckboxChange,
            }
            : {
              ...internalTabledata,
              // showDefaultColumn: true,
              enableMultiSelect: true,
              onRowCheckboxChange: onRowCheckboxChange,
            }
        }
        colSort
        className="table"
        pagination
        pagingOptions={[15, 30, 50, 100]}
        handleRowClick={() => {
          navigate("/pay/invoicedetails");
        }}
      />
    </div>
  );
}
