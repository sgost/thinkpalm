import React, { useEffect, useState } from "react";
import "./invoices.scss";
import { Icon, Button, Table, Banner } from "atlasuikit";
import { FaEllipsisH } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import axios from "axios";
import MyDropdown from "../../../components/MyDropdown/Dropdown";
import DatepickerDropdown from "../../../components/DatepickerDropdown/DatepickerDropdown";
import getRequest from "../../../components/Comman/api";
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
  const [showSuccessToast, setShowSuccessToast] = useState({
    type: false,
    message: "Downloading..."
  });
  const [dropdownLabel, setDropdownLabel] = useState({
    types: "",
    status: "",
  });
  const [selectedDate, setSelectedDate] = useState({
    startDate: "",
    endDate: "",
    day: "",
  });
  const [singleInvoiceId, setSingleInvoiceId] = useState("");
  const [multiInvoiceId, setMultiInvoiveId] = useState([]);
  const [token, setToken] = useState("eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJXTTFNMldSbzJvOFV1ZGhzV0toZko1M2hsY3lad2dlb2RucVVqTHJxdnZVIn0.eyJleHAiOjE2NDg3MDI1NDAsImlhdCI6MTY0ODUyOTc0MSwiYXV0aF90aW1lIjoxNjQ4NTI5NzQwLCJqdGkiOiJmMjU5YTA3ZC1jOWQzLTQyMjYtOTRkMy02OTU1NWRiMzkxNzIiLCJpc3MiOiJodHRwczovL2FjY291bnRzLXVhdC5hcG5leHRnZW4uY29tL2F1dGgvcmVhbG1zL2RzbW51dHJpdGlvbmFscHJvZHVjdHNhZyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJlZWQ5MjRiMy05N2IxLTQxMzMtYjZhMC0xMGUwMGRmNzAxNGUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhbmd1bGFyLXdlYi1jbGllbnQiLCJub25jZSI6IjIyZTcwZmFlLWI0NmYtNDc2MC04MmZjLTViZWMxMGUzNmJiNSIsInNlc3Npb25fc3RhdGUiOiJiN2ExMWY3Yi00NzIyLTRlZjctYjdhNi02YThkNGE0MGMzMzYiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vZHNtbnV0cml0aW9uYWxwcm9kdWN0c2FnLXVhdC5hcG5leHRnZW4uY29tIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLWRzbW51dHJpdGlvbmFscHJvZHVjdHNhZy11YXQiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInJvbGUiOiJ1c2VyIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc0V4dGVybmFsIjp0cnVlLCJuYW1lIjoiU2ltb24gTGFzdG5hbWV1Nml1bGUiLCJjdXN0b21lcklkIjoiYTliYmVlNmQtNzk3YS00NzI0LWE4NmEtNWIxYTJlMjg3NjNmIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiZHNtbnV0cml0aW9uYWxwcm9kdWN0c2FnQHByb3Rvbm1haWwuY29tIiwiaWQiOiJlZWQ5MjRiMy05N2IxLTQxMzMtYjZhMC0xMGUwMGRmNzAxNGUiLCJnaXZlbl9uYW1lIjoiU2ltb24iLCJmYW1pbHlfbmFtZSI6Ikxhc3RuYW1ldTZpdWxlIiwiY3VzdG9tZXJOYW1lIjoiRFNNIE51dHJpdGlvbmFsIFByb2R1Y3RzIEFHIiwiZW1haWwiOiJkc21udXRyaXRpb25hbHByb2R1Y3RzYWdAcHJvdG9ubWFpbC5jb20ifQ.dzJYbfHtsW2iT2dTPdSoP9ChqAzGvy4WFCar_wZ9kapLnbAfUAhx7R0em-kZIbYw8bUId8xNzA69sdKU_S1W1rhHDpyJXRHrY-0aEt5Gc5rmApVcQO548YOaAJ2J9SAMHiEU7QtEpA9Pj-hvJrkGNTAQPS2JXasMFzPDLAss5BslcR36-bJZuN63qpQ6xce8FwlHgDnoa3sQHyO6wANkwxE3mPCkZne7VrFLQC45t0G8TWCxqUY-_5v742x63Um2gyXSOYbX_Xq7vTI-guaKLL8trEyhlEJLSddbCGkNImfGmDyfVANHB_lItFPeiaHw4r0Arb44hBdMEp-bEdB4Mg");
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
  });
  const [downloadDisable, setDownloadDisable] = useState(false);
  const [customerID, setCustomerId] = useState("");

  let api = ``;

  const apiFunc = () => {
    if (isClient !== null && isClient === true) {
      api = `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/customer/filter?page=1&pageSize=10000&transactionTypes=${transactionTypes}&statuses=${statusType}&dateFrom=${dateFrom}&dateTo=${dateTo}`;
      return api;
    } else if (isClient !== null && isClient === false) {
      api = `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/filter?page=1&pageSize=10000&transactionTypes=${transactionTypes}&statuses=${statusType}&dateFrom=${dateFrom}&dateTo=${dateTo}`;
      return api;
    } else {
      api = "";
      return api;
    }
  };

  const apiData: any = getRequest(apiFunc(), token);

  const clearFilter = () => {
    setTransactionTypes("");
    setStatusType("");
    setDateTo("");
    setDateFrom("");
    setSelectedDate({
      startDate: "",
      endDate: "",
      day: "",
    });
    setDropdownLabel({
      types: "",
      status: "",
    });
  };

  useEffect(() => {
    console.log("type", isTypeOpen);
  }, [isTypeOpen]);

  useEffect(() => {
    if (apiData?.data?.results) {
      const apiTableData = apiData?.data?.results;
      apiTableData?.map((item: any) => {
        item.totalAmount = `USD ${item.totalAmount.toLocaleString()}`;
        item.invoiceBalance = `USD ${item.invoiceBalance.toLocaleString()}`;
        item.createdDate = format(new Date(item.createdDate), "d MMM yyyy");
        item.dueDate = format(new Date(item.dueDate), "d MMM yyyy");
      });
      if (isClient) {
        setClientTableData({ ...clientTableData, data: apiTableData })
      } else {
        setInternalTabletData({ ...internalTabledata, data: apiTableData });
      }
    }
  }, [apiData, transactionTypes, statusType, dateFrom, dateTo]);



  useEffect(() => {
    if (showSuccessToast.type) {
      setTimeout(() => {
        setShowSuccessToast({ ...showSuccessToast, type: false });
      }, 4000);
    }
  }, [showSuccessToast.type]);

  const onRowCheckboxChange = (selectedRows: any) => {
    if (selectedRows.length == 1) {
      let id: any;
      let custmId: any;
      selectedRows.map((item: any) => {
        id = item.id;
        custmId = item.customerId
      });
      setCustomerId(custmId)
      setSingleInvoiceId(id);
      setMultiInvoiveId([]);
      setCheckedData(selectedRows);
    } else if (selectedRows.length >= 1) {
      const multiId = selectedRows.map((items: any) => {
        return items.id;
      });

      setMultiInvoiveId(multiId);
      setSingleInvoiceId("");
      setCheckedData(selectedRows);
    }
  };

  const downloadFunction = () => {
    setDownloadDisable(true);
    setShowSuccessToast({ ...showSuccessToast, type: true })
    const headers = {
      headers: {
        authorization: `Bearer ${token}`,
        "x-apng-base-region": "EMEA",
        "x-apng-customer-id": "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
        "x-apng-external": "false",
        "x-apng-inter-region": "0",
        "x-apng-target-region": "EMEA",
        "customer_id": customerID,
        "Content-Type": "application/json",
      },
    };
    if (singleInvoiceId) {
      const api = `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/generatePDF/${singleInvoiceId}`;
      axios
        .get(api, headers)
        .then((res: any) => {
          if (res.status === 200) {
            setDownloadDisable(false);
            setShowSuccessToast({ type: true, message: "Downloaded..." })
            let url = res.data.url;
            let a = document.createElement("a");
            a.href = url;
            a.download = `${res.data.name}`;
            a.click();
          }
        })
        .catch((e: any) => {
          console.log("error", e);
        });
    } else if (multiInvoiceId) {
      setShowSuccessToast({ ...showSuccessToast, type: true })
      const multiDownloadInvoiceId = multiInvoiceId.join(",");
      const api = `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/GeneratePDFMultiple/${multiDownloadInvoiceId}`;
      axios({
        method: "get",
        url: api,
        headers: headers.headers,
      })
        .then((res: any) => {
          if (res.status === 200) {
            setDownloadDisable(false)
            setShowSuccessToast({ type: true, message: "Downloaded..." })
            let url = res.data.url;
            let a = document.createElement("a");
            a.href = url;
            a.download = `${res.data.name}`;
            a.click();
          }
        })
        .catch((e: any) => {
          console.log("error", e);
        });
    }
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
        <p>Enter token</p>
        <input data-testid="custom-element" value={token} onChange={(e) => setToken(e.target.value)} />
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
    <>
      <div className="container">
        <div className="dropdowns">
          <div className="inputContainer">
            <Icon icon="search" size="small" />
            <input
              className="input"
              placeholder={
                isClient ? "Search Invoices" : "Search by Invoice, Customer"
              }
            />
          </div>
          <div className="pickers">
            <div
              onClick={downloadFunction}
              data-testid="download"
              className={downloadDisable ? "downloadpointer" : ""}
            >
              <Icon
                className="download"
                color={downloadDisable ? "#CBD4F3" : "#526fd6"}
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
                  case "Today":
                    const todayDate = format(date, "yyyy-MM-dd");
                    setDateFrom(todayDate);
                    setDateTo(todayDate);
                    break;

                  case "Yesterday":
                    const yesterdayDate = date.setDate(date.getDate() - 1);
                    const yesterdayFormatDate = format(
                      yesterdayDate,
                      "yyyy-MM-dd"
                    );
                    setDateFrom(yesterdayFormatDate);
                    setDateTo(yesterdayFormatDate);
                    break;

                  case "This Week":
                    const thisWeekStartDate = new Date(
                      date.getFullYear(),
                      date.getMonth(),
                      date.getDate() - 7
                    );
                    const thisWeekEndDate = date.setDate(date.getDate() - 1);
                    const thisWeekStartFormatDate = format(
                      thisWeekStartDate,
                      "yyyy-MM-dd"
                    );
                    const thisWeekEndFormatDate = format(
                      thisWeekEndDate,
                      "yyyy-MM-dd"
                    );
                    setDateFrom(thisWeekStartFormatDate);
                    setDateTo(thisWeekEndFormatDate);
                    break;

                  case "This Month":
                    const thisMonthStartDate = new Date(
                      date.getFullYear(),
                      date.getMonth(),
                      1
                    );
                    const thisMonthEndDate = new Date(
                      date.getFullYear(),
                      date.getMonth() + 1,
                      0
                    );
                    const thisMonthStartFormatDate = format(
                      thisMonthStartDate,
                      "yyyy-MM-dd"
                    );
                    const thisMonthEndFormatDate = format(
                      thisMonthEndDate,
                      "yyyy-MM-dd"
                    );
                    setDateFrom(thisMonthStartFormatDate);
                    setDateTo(thisMonthEndFormatDate);
                    break;

                  case "This Quarter":
                    const quarter = Math.floor(date.getMonth() / 3);
                    const thisQuarterStartDate = new Date(
                      date.getFullYear(),
                      quarter * 3,
                      1
                    );
                    const thisQuarterEndDate = new Date(
                      thisQuarterStartDate.getFullYear(),
                      thisQuarterStartDate.getMonth() + 3,
                      0
                    );
                    const thisQuarterStartFormatDate = format(
                      thisQuarterStartDate,
                      "yyyy-MM-dd"
                    );
                    const thisQuarterEndFormatDate = format(
                      thisQuarterEndDate,
                      "yyyy-MM-dd"
                    );
                    setDateFrom(thisQuarterStartFormatDate);
                    setDateTo(thisQuarterEndFormatDate);
                    break;

                  case "This Year":
                    const thisYearStartDate = new Date(
                      date.getFullYear(),
                      0,
                      1
                    );
                    const thisYearEndDate = new Date(
                      date.getFullYear(),
                      11,
                      31
                    );
                    const thisYearStartFormatDate = format(
                      thisYearStartDate,
                      "yyyy-MM-dd"
                    );
                    const thisYearEndFormatDate = format(
                      thisYearEndDate,
                      "yyyy-MM-dd"
                    );
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
              title="Types"
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
                setDropdownLabel({
                  ...dropdownLabel,
                  types: copy[index]?.label,
                });
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
                setDropdownLabel({
                  ...dropdownLabel,
                  status: copy[index]?.label,
                });
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

        <div className="clearfilter" data-testid="clearfilter" onClick={clearFilter}>
          <Icon
            className="remove"
            color="#526fd6"
            icon="remove"
            size="medium"
          />
          <h5>Clear Filters</h5>
        </div>

        {showSuccessToast.type && (
          <div className="toast">
            {showSuccessToast.message}
            <span
              className="toast-action"
              onClick={() => {
                setShowSuccessToast({ ...showSuccessToast, type: false });
              }}
            >
              <Icon
                icon="remove"
                color="#ffff"
                size="medium"
                viewBox="-6 -6 20 20"
              />
            </span>
          </div>
        )}
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
          handleRowClick={(row: any) => {
            navigate("/pay/invoicedetails" + row.id + "/" + row.customerId);

            // navigate("/pay/invoicedetails");
          }}
        />
      </div>
    </>
  );
}
