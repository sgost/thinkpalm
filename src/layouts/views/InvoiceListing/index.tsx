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
import {
  getClientListingUrl,
  getGenerateMultiplePdfUrl,
  getGenerateSinglePdfUrl,
  getHeaders,
  getInternalListingUrl,
} from "../../../urls/urls";
import { tableSharedColumns } from "../../../sharedColumns/sharedColumns";
import { getDecodedToken } from "../../..//components/getDecodedToken";

export default function InvoiceListing() {
  let navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const permission: any = getDecodedToken();
  // internal token
  // const accessToken = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJxa1VoLVl2LWc3c25Zc3ktN1ktZVk0OE5TLTlzdldjWm9aMXFoMzZoYnpjIn0.eyJleHAiOjE2NTE5OTU0ODIsImlhdCI6MTY1MTgzNjc0NSwiYXV0aF90aW1lIjoxNjUxODIyNjgyLCJqdGkiOiJmNTE3MjM4NS00MzVkLTQzMjQtODA3My1lZmU4YWJlMTY4ZGYiLCJpc3MiOiJodHRwczovL2FjY291bnRzLXVhdC5hcG5leHRnZW4uY29tL2F1dGgvcmVhbG1zL2VsZW1lbnRzZ3MiLCJzdWIiOiI3NWM2MmFiNi1iMWMyLTQ5NTEtYmY2Yy00MjA3ZGQwZmEwNmEiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhbmd1bGFyLXdlYi1jbGllbnQiLCJub25jZSI6IjBjMmYxNWY3LTg4YTItNDJjMS1hMDg0LWQ1ZDcxMWJkNjg1ZiIsInNlc3Npb25fc3RhdGUiOiIxNWU2MDRhMy01NDRhLTQ2YzYtYjYxOC1iZmU3MGZlZWIxYTQiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vd3d3LXVhdC5hcG5leHRnZW4uY29tIiwiaHR0cHM6Ly9lbGVtZW50c2dzLW5nLmFwbmV4dGdlbi5jb20iLCJodHRwczovL2VsZW1lbnRzZ3MtdWF0LmFwbmV4dGdlbi5jb20iXSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInJvbGUiOiJBcHByb3ZQYXlPd25lcnMiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImlzRXh0ZXJuYWwiOmZhbHNlLCJuYW1lIjoiSmFzbWluZSBLYXVyIiwiaWQiOiI3NWM2MmFiNi1iMWMyLTQ5NTEtYmY2Yy00MjA3ZGQwZmEwNmEiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJqYXNtaW5la0BlbGVtZW50c2dzLmNvbSIsImdpdmVuX25hbWUiOiJKYXNtaW5lIiwiZmFtaWx5X25hbWUiOiJLYXVyIiwiZW1haWwiOiJqYXNtaW5la0BlbGVtZW50c2dzLmNvbSJ9.Bz3I8XKE6cpPV_KdObEVBj1f3mAcQzXOnwKZzGblhJqf9HMB-QmNXilwL3rNkTioW-Oh2kbHwqj-V91OlFKaeL8JTW8KxEA2pxTxQtyXLYsaQzqRVZunVigTzJ4id2qRL4j8dpZhHFGgnmTXEX6com4alL-RCrBhHDACtOc-OVyi9Qr0zgU0E6q7vTyg1LAFhjUFcarp9YcVoquCCOSGEyflsbHiJVZ-PRoNtkz3psu6aGWYmsxfcoIo958pKSINjkmJjUiU-1C6_FgELQjStw88bj_trHAq-t2m6oGDOeaLopCsVpQLJatuGG6gMrmcbvmOCjtYgiDx51buFxppsA"
  const currentRoles = JSON.parse(localStorage.getItem("current-org") || "");
  const customerId = localStorage.getItem("current-org-id");
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
  // const [token, setToken] = useState("");

  // Contractor, payroll, credit memos, proformas, miscellaneous
  const typeOptions = [
    // {
    //   isSelected: false,
    //   label: "Contractor Invoice",
    //   value: "contractorInvoice",
    // },
    tableSharedColumns.createMemo,
    tableSharedColumns.payroll,
    tableSharedColumns.Miscellaneous,
    tableSharedColumns.proforma,
    {
      isSelected: false,
      label: "LateFee",
      value: 5,
    },
    // {
    //   isSelected: false,
    //   label: "Payment",
    //   value: 6,
    // },
    {
      isSelected: false,
      label: "Contractor Pay",
      value: 7,
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
      label: "AR Review",
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
    {
      isSelected: false,
      label: "Invoiced",
      value: 10,
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
      // api = `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/customer/filter?page=1&pageSize=10000&transactionTypes=${transactionTypes}&statuses=${statusType}&dateFrom=${dateFrom}&dateTo=${dateTo}`;
      api = getClientListingUrl(transactionTypes, statusType, dateFrom, dateTo);
      return api;
    } else if (isClient !== null && isClient === false) {
      // api = `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/filter?page=1&pageSize=10000&transactionTypes=${transactionTypes}&statuses=${statusType}&dateFrom=${dateFrom}&dateTo=${dateTo}`;
      api = getInternalListingUrl(
        transactionTypes,
        statusType,
        dateFrom,
        dateTo
      );

      return api;
    } else {
      api = "";
      return api;
    }
  };

  const apiData: any = getRequest(apiFunc(), accessToken, customerId, isClient);

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
    if (currentRoles?.Payments?.Role === "Customer") {
      setIsClient(true);
    } else {
      setIsClient(false);
    }
  }, [currentRoles]);

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
          invoiceNo: item.invoiceNo || "",
          customerName: item.customerName || "",
          statusLabel:
            item.statusLabel === "In Review"
              ? "AR Review"
              : item.statusLabel || "",
          transactionTypeLabel: item.transactionTypeLabel || "",
          createdDate: format(new Date(item.createdDate), "d MMM yyyy") || "",
          dueDate: format(new Date(item.dueDate), "d MMM yyyy") || "",
          totalAmount: `USD ${cFormat.format(item.totalAmount).slice(1)}` || "",
          invoiceBalance:
            `USD ${cFormat.format(item.invoiceBalance).slice(1)}` || "",
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

  useEffect(() => {
    console.log("sajkdh", permission);
  }, []);

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
      headers: getHeaders(accessToken, customerID, isClient),
    };
    if (singleInvoiceId) {
      const api = getGenerateSinglePdfUrl(singleInvoiceId);
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
      const api = getGenerateMultiplePdfUrl(multiDownloadInvoiceId);
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

  if (permission.InvoiceList.find((str: any) => str === "View") !== "View") {
    return <p>You do not have permission to view this page.</p>;
  }

  return (
    <>
      <div className="container">
        <div className="new-invoice-button">
          {permission.InvoiceList.find((str: any) => str === "Add") ===
            "Add" && (
            <Button
              label="New Invoice"
              className="primary-blue medium"
              icon={{
                icon: "add",
                size: "medium",
                color: "#fff",
              }}
              handleOnClick={() => navigate("/pay/newinvoice")}
            />
          )}
        </div>
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
            {permission.InvoiceList.find((str: any) => str === "Download") ===
              "Download" && (
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
            )}

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
            {permission.InvoiceList.find((str: any) => str === "Edit") ===
              "Edit" && <img src={dots} />}
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
              data-testid="remove-button-toast"
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
                  isClientStr,
                {
                  state: {
                    InvoiceId: row.invoiceNo,
                    transactionType: row.transactionType,
                  },
                }
              );
            }}
          />
        )}
      </div>
    </>
  );
}
