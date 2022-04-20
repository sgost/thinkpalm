import React, { useEffect, useState } from "react";
import "./invoices.scss";
import { Icon, Button, Table, Dropdown } from "atlasuikit";
import { FaEllipsisH } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import axios from "axios";
import DatepickerDropdown from "../../../components/DatepickerDropdown/DatepickerDropdown";
import getRequest from "../../../components/Comman/api";
import { listData } from "../InvoiceDetails/mockData";
import dots from "./dots.svg";

export default function InvoiceListing() {
  let navigate = useNavigate();
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [transactionTypes, setTransactionTypes] = useState("");
  const [statusType, setStatusType] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [isClient, setIsClient] = useState<any>(null);
  const [showSuccessToast, setShowSuccessToast] = useState({
    type: false,
    message: "Downloading...",
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
  const [token, setToken] = useState(
    "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJXTTFNMldSbzJvOFV1ZGhzV0toZko1M2hsY3lad2dlb2RucVVqTHJxdnZVIn0.eyJleHAiOjE2NDg3MDI1NDAsImlhdCI6MTY0ODUyOTc0MSwiYXV0aF90aW1lIjoxNjQ4NTI5NzQwLCJqdGkiOiJmMjU5YTA3ZC1jOWQzLTQyMjYtOTRkMy02OTU1NWRiMzkxNzIiLCJpc3MiOiJodHRwczovL2FjY291bnRzLXVhdC5hcG5leHRnZW4uY29tL2F1dGgvcmVhbG1zL2RzbW51dHJpdGlvbmFscHJvZHVjdHNhZyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJlZWQ5MjRiMy05N2IxLTQxMzMtYjZhMC0xMGUwMGRmNzAxNGUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhbmd1bGFyLXdlYi1jbGllbnQiLCJub25jZSI6IjIyZTcwZmFlLWI0NmYtNDc2MC04MmZjLTViZWMxMGUzNmJiNSIsInNlc3Npb25fc3RhdGUiOiJiN2ExMWY3Yi00NzIyLTRlZjctYjdhNi02YThkNGE0MGMzMzYiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vZHNtbnV0cml0aW9uYWxwcm9kdWN0c2FnLXVhdC5hcG5leHRnZW4uY29tIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLWRzbW51dHJpdGlvbmFscHJvZHVjdHNhZy11YXQiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInJvbGUiOiJ1c2VyIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc0V4dGVybmFsIjp0cnVlLCJuYW1lIjoiU2ltb24gTGFzdG5hbWV1Nml1bGUiLCJjdXN0b21lcklkIjoiYTliYmVlNmQtNzk3YS00NzI0LWE4NmEtNWIxYTJlMjg3NjNmIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiZHNtbnV0cml0aW9uYWxwcm9kdWN0c2FnQHByb3Rvbm1haWwuY29tIiwiaWQiOiJlZWQ5MjRiMy05N2IxLTQxMzMtYjZhMC0xMGUwMGRmNzAxNGUiLCJnaXZlbl9uYW1lIjoiU2ltb24iLCJmYW1pbHlfbmFtZSI6Ikxhc3RuYW1ldTZpdWxlIiwiY3VzdG9tZXJOYW1lIjoiRFNNIE51dHJpdGlvbmFsIFByb2R1Y3RzIEFHIiwiZW1haWwiOiJkc21udXRyaXRpb25hbHByb2R1Y3RzYWdAcHJvdG9ubWFpbC5jb20ifQ.dzJYbfHtsW2iT2dTPdSoP9ChqAzGvy4WFCar_wZ9kapLnbAfUAhx7R0em-kZIbYw8bUId8xNzA69sdKU_S1W1rhHDpyJXRHrY-0aEt5Gc5rmApVcQO548YOaAJ2J9SAMHiEU7QtEpA9Pj-hvJrkGNTAQPS2JXasMFzPDLAss5BslcR36-bJZuN63qpQ6xce8FwlHgDnoa3sQHyO6wANkwxE3mPCkZne7VrFLQC45t0G8TWCxqUY-_5v742x63Um2gyXSOYbX_Xq7vTI-guaKLL8trEyhlEJLSddbCGkNImfGmDyfVANHB_lItFPeiaHw4r0Arb44hBdMEp-bEdB4Mg"
  );

  // Contractor, payroll, credit memos, proformas, miscellaneous
  const typeOptions = [
    // {
    //   isSelected: false,
    //   label: "Contractor Invoice",
    //   value: "contractorInvoice",
    // },
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
    {
      isSelected: false,
      label: "LateFee ",
      value: 5,
    },
    {
      isSelected: false,
      label: "Payment ",
      value: 6,
    },
  ];
  const [types, setTypes] = useState(typeOptions);

  //  open, AR review, Pending Approval, Approved, Paid, Partially paid, cancelled, voided,
  const statusOptions = [
    {
      isSelected: false,
      label: "Open",
      value: "1",
    },
    {
      isSelected: false,
      label: "In Review",
      value: "2",
    },
    {
      isSelected: false,
      label: "Pending Approval",
      value: 3,
    },
    {
      isSelected: false,
      label: "Approved",
      value: "4",
    },
    {
      isSelected: false,
      label: "Paid",
      value: 5,
    },
    {
      isSelected: false,
      label: "Partially Paid",
      value: 6,
    },
    // {
    //   isSelected: false,
    //   label: "Partial",
    //   value: 7,
    // },

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
  ];
  const [status, setStatus] = useState(statusOptions);
  const [internalTabledata, setInternalTabletData] = useState({
    columns: [
      {
        header: "Invoice No",
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
      {
        header: "Exported to QB",
        isDefault: true,
        key: "exportToQB",
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
  const [downloadDisable, setDownloadDisable] = useState(true);
  const [customerID, setCustomerId] = useState("");
  const [isClearFilter, setIsClearFilter] = useState(false);
  const [searchText, setSearchText] = useState<any>("");
  const [searchedTableData, setSearchedTableData] = useState<any>(null);

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
    setStatus(statusOptions);

    setTypes(typeOptions);
  };

  useEffect(() => {
    if (apiData?.data?.results) {
      const apiTableData: any = [];

      // const apiTableData = apiData?.data?.results;
      apiData?.data?.results.push(listData);
      apiData?.data?.results.forEach((item: any) => {
        const cFormat = Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        });
        apiTableData.push({
          ...item,
          totalAmount: `USD ${cFormat.format(item.totalAmount).slice(1)}`,
          invoiceBalance: `USD ${cFormat.format(item.invoiceBalance).slice(1)}`,
          createdDate: format(new Date(item.createdDate), "d MMM yyyy"),
          dueDate: format(new Date(item.dueDate), "d MMM yyyy"),
          exportToQB: {
            value: "Not Exported",
            color: "#767676",
          },
        });
      });

      // apiTableData?.map((item: any) => {
      //   if (!item.totalAmount.toString().includes("USD")) {
      //     const cFormat = Intl.NumberFormat("en-US", {
      //       style: "currency",
      //       currency: "USD",
      //     });
      //     item.totalAmount = `USD ${cFormat.format(item.totalAmount).slice(1)}`;
      //     item.invoiceBalance = `USD ${cFormat
      //       .format(item.invoiceBalance)
      //       .slice(1)}`;
      //     item.createdDate = format(new Date(item.createdDate), "d MMM yyyy");
      //     item.dueDate = format(new Date(item.dueDate), "d MMM yyyy");

      //   }
      // });

      // console.log("internal data", apiTableData);

      if (isClient) {
        setClientTableData({ ...clientTableData, data: apiTableData });
      } else {
        setInternalTabletData({ ...internalTabledata, data: apiTableData });
      }
    }

    if (transactionTypes || statusType || dateFrom || dateTo) {
      setIsClearFilter(true);
    } else {
      setIsClearFilter(false);
    }
  }, [apiData, transactionTypes, statusType, dateFrom, dateTo]);

  useEffect(() => {
    if (showSuccessToast.type) {
      setTimeout(() => {
        setShowSuccessToast({ ...showSuccessToast, type: false });
      }, 4000);
    }
  }, [showSuccessToast.type]);

  useEffect(() => {
    if (isClient) {
      const filteredData = {
        columns: clientTableData.columns,
        data: clientTableData.data.filter((e: any) =>
          e.invoiceNo.includes(searchText)
        ),
      };
      if (searchText && filteredData.data.length) {
        setSearchedTableData(filteredData);
      } else {
        setSearchedTableData(null);
      }
    } else {
      const filteredData = {
        columns: internalTabledata.columns,
        data: internalTabledata.data.filter(
          (e: any) =>
            e.invoiceNo.includes(searchText) ||
            e.customerName.toLowerCase().includes(searchText.toLowerCase())
        ),
      };
      if (searchText && filteredData.data.length) {
        setSearchedTableData(filteredData);
      } else {
        setSearchedTableData(null);
      }
    }
  }, [searchText]);

  const downloadFunction = () => {
    const download = (res: any) => {
      if (res.status === 200) {
        setDownloadDisable(false);
        setShowSuccessToast({ type: true, message: "Downloaded..." });
        let url = res.data.url;
        let a = document.createElement("a");
        a.href = url;
        a.download = `${res.data.name}`;
        a.click();
      }
    };

    setDownloadDisable(true);
    setShowSuccessToast({ ...showSuccessToast, type: true });
    const headers = {
      headers: {
        authorization: `Bearer ${token}`,
        "x-apng-base-region": "EMEA",
        "x-apng-customer-id": "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
        "x-apng-external": "false",
        "x-apng-inter-region": "0",
        "x-apng-target-region": "EMEA",
        customer_id: customerID,
        "Content-Type": "application/json",
      },
    };
    if (singleInvoiceId) {
      const api = `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/generatePDF/${singleInvoiceId}`;
      axios
        .get(api, headers)
        .then((res: any) => {
          download(res);
          // if (res.status === 200) {
          //   setDownloadDisable(false);
          //   setShowSuccessToast({ type: true, message: "Downloaded..." });
          //   let url = res.data.url;
          //   let a = document.createElement("a");
          //   a.href = url;
          //   a.download = `${res.data.name}`;
          //   a.click();
          // }
        })
        .catch((e: any) => {
          console.log("error", e);
        });
    } else if (multiInvoiceId) {
      setShowSuccessToast({ ...showSuccessToast, type: true });
      const multiDownloadInvoiceId = multiInvoiceId.join(",");
      const api = `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/GeneratePDFMultiple/${multiDownloadInvoiceId}`;
      axios({
        method: "get",
        url: api,
        headers: headers.headers,
      })
        .then((res: any) => {
          download(res);

          // if (res.status === 200) {
          //   setDownloadDisable(false);
          //   setShowSuccessToast({ type: true, message: "Downloaded...." });
          //   let url = res.data.url;
          //   let a = document.createElement("a");
          //   a.href = url;
          //   a.download = `${res.data.name}`;
          //   a.click();
          // }
        })
        .catch((e: any) => {
          console.log("error", e);
        });
    }
  };

  /* istanbul ignore next */
  const onRowCheckboxChange = (selectedRows: any) => {
    if (selectedRows.length) {
      setDownloadDisable(false);
    } else {
      setDownloadDisable(true);
    }
    if (selectedRows.length == 1) {
      let id: any;
      let custmId: any;
      selectedRows.map((item: any) => {
        id = item.id;
        custmId = item.customerId;
      });
      setCustomerId(custmId);
      setSingleInvoiceId(id);
      setMultiInvoiveId([]);
    } else if (selectedRows.length >= 1) {
      const multiId = selectedRows.map((items: any) => {
        return items.id;
      });

      setSingleInvoiceId("");
      setMultiInvoiveId(multiId);
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
        <input
          data-testid="custom-element"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
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
              onChange={(e: any) => setSearchText(e.target.value)}
            />
          </div>
          <div className="pickers">
            <div
              onClick={downloadFunction}
              data-testid="download"
              className={downloadDisable ? "downloadpointer" : "download"}
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
              setIsOpen={setIsDateOpen}
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

            <Dropdown
              title="Type"
              multiple
              isOpen={isTypeOpen}
              handleDropdownClick={(bool: any) => {
                setIsTypeOpen(bool);
                if (bool) {
                  setIsStatusOpen(false);
                }
              }}
              handleDropOptionClick={(opt: any) => {
                let index = types.findIndex((e) => e.value === opt.value);

                let copy = [...types];

                copy.forEach((e, i) => {
                  if (i === index) {
                    if (copy[index].isSelected) {
                      copy[index] = { ...opt, isSelected: false };
                    } else {
                      copy[index] = { ...opt, isSelected: true };
                    }
                  }
                });

                let typesValue = "";

                copy.forEach((e) => {
                  if (e.isSelected) {
                    if (typesValue) {
                      typesValue += "," + e.value.toString();
                    } else {
                      typesValue = e.value.toString();
                    }
                  }
                });

                setTypes(copy);
                setTransactionTypes(typesValue);
                setDropdownLabel({
                  ...dropdownLabel,
                  types: copy[index]?.label,
                });
              }}
              options={types}
            />

            <Dropdown
              title="Status"
              multiple
              isOpen={isStatusOpen}
              handleDropdownClick={(bool: any) => {
                setIsStatusOpen(bool);
                if (bool) {
                  setIsTypeOpen(false);
                }
              }}
              handleDropOptionClick={(opt: any) => {
                let copy = [...status];
                let index = status.findIndex((e) => e.value === opt.value);
                copy.forEach((e, ind) => {
                  if (ind === index) {
                    if (copy[index].isSelected) {
                      copy[index] = { ...opt, isSelected: false };
                    } else {
                      copy[index] = { ...opt, isSelected: true };
                    }
                  }
                });

                let statusValue = "";
                copy.forEach((e) => {
                  if (e.isSelected) {
                    if (statusValue) {
                      statusValue += "," + e.value.toString();
                    } else {
                      statusValue = e.value.toString();
                    }
                  }
                });

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
            <img src={dots} />
            {/* <FaEllipsisH className="icon" /> */}
          </div>
        </div>

        {isClearFilter && (
          <div
            className="clearfilter"
            data-testid="clearfilter"
            onClick={clearFilter}
          >
            <Icon
              className="remove"
              color="#526fd6"
              icon="remove"
              size="medium"
            />
            <h5>Clear Filters</h5>
          </div>
        )}

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
        {searchText && !searchedTableData ? (
          <div className="invalidSearch">
            <div className="uhohContainer">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 38C30.389 38 38 30.389 38 21C38 11.611 30.389 4 21 4C11.611 4 4 11.611 4 21C4 30.389 11.611 38 21 38Z"
                  fill="#526FD6"
                  fill-opacity="0.4"
                  stroke="#3E3E3E"
                  stroke-width="4"
                  stroke-linejoin="round"
                />
                <path
                  d="M26.6568 14.343C25.9147 13.599 25.0329 13.0091 24.0621 12.607C23.0913 12.2049 22.0506 11.9986 20.9998 12C18.7898 12 16.7898 12.895 15.3428 14.343"
                  stroke="white"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M33.2222 33.2227L41.7072 41.7077"
                  stroke="#3E3E3E"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <p>Uh-oh! We found no matches for your search.</p>
            </div>
            <ul>
              <li>Try modifiying your search or;</li>
              <li>Use filters to refine your search.</li>
            </ul>
          </div>
        ) : (
          <Table
            options={
              searchText
                ? {
                    ...searchedTableData,
                    // showDefaultColumn: true,
                    enableMultiSelect: true,
                    onRowCheckboxChange: onRowCheckboxChange,
                  }
                : isClient
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
              let isClientStr = isClient ? "true" : "false";
              navigate(
                "/pay/invoicedetails" +
                  row.id +
                  "/" +
                  row.customerId +
                  "/" +
                  isClientStr
              );
            }}
          />
        )}
      </div>
    </>
  );
}