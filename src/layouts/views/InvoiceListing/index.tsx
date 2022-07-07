import React, { useEffect, useState } from "react";
import "./invoices.scss";
import { Icon, Button, Table, Dropdown, ButtonDropdown, NoSearchCard } from "atlasuikit";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import axios from "axios";
import DatepickerDropdown from "../../../components/DatepickerDropdown/DatepickerDropdown";
import getRequest from "../../../components/Comman/getRequest";
import disabled from "../../../assets/icons/disabled-3dote.svg";
import {
  urls,
  getClientListingUrl,
  getGenerateMultiplePdfUrl,
  getGenerateSinglePdfUrl,
  getHeaders,
  getInternalListingUrl,
} from "../../../urls/urls";
import { tableSharedColumns } from "../../../sharedColumns/sharedColumns";
import { getDecodedToken } from "../../..//components/getDecodedToken";

import { WeAreSorryModal } from "./weAreSorryModal";
import { Loader, ToastContainer } from "../../../components/Comman/Utils/utils";

export default function InvoiceListing() {
  let navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const permission: any = getDecodedToken();
  const customerId = localStorage.getItem("current-org-id");
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [transactionTypes, setTransactionTypes] = useState("");
  const [statusType, setStatusType] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [isClient, setIsClient] = useState<any>(null);
  const [customerType, setCustomerType] = useState("");
  const [customerData, setCustomerData] = useState([
    {
      isSelected: false,
      label: "",
      value: "",
    },
  ]);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [weAreSorryModalAction, setWeAreSorryModalAction] =
    useState<boolean>(false);
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
  const [types, setTypes] = useState<any>([]);
  const [status, setStatus] = useState<any>([]);
  const [internalTabledata, setInternalTabletData] = useState({
    columns: [
      tableSharedColumns.invoiceNo,
      tableSharedColumns.customerName,
      tableSharedColumns.statusLabel,
      tableSharedColumns.transactionTypeLabel,
      tableSharedColumns.createdDate,
      tableSharedColumns.dueDate,
      tableSharedColumns.totalAmount,
      tableSharedColumns.invoiceBalance,
      tableSharedColumns.exportToQB,
    ],
    data: [],
  });
  const [clientTableData, setClientTableData] = useState({
    columns: [
      tableSharedColumns.invoiceNo,
      tableSharedColumns.statusLabel,
      tableSharedColumns.transactionTypeLabel,
      tableSharedColumns.createdDate,
      tableSharedColumns.dueDate,
      tableSharedColumns.totalAmount,
      tableSharedColumns.invoiceBalance,
    ],
    data: [],
  });
  const [downloadDisable, setDownloadDisable] = useState(true);
  const [checkedInvoices, setCheckedInvoices] = useState<Array<any>>([]);
  const [customerID, setCustomerId] = useState("");
  const [isClearFilter, setIsClearFilter] = useState(false);
  const [searchText, setSearchText] = useState<any>("");
  const [searchedTableData, setSearchedTableData] = useState<any>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [lookupData, setLookupData] = useState<any>({});
  const [toggle, setToggle] = useState(true);
  const [toggleForType, setToggleForType] = useState(true);
  const [isLoader, setIsLoader] = useState(false)

  let api = ``;

  const apiFunc = () => {
    if (isClient !== null && isClient === true) {
      api = getClientListingUrl(transactionTypes, statusType, dateFrom, dateTo);
      return api;
    } else if (isClient !== null && isClient === false) {
      api = getInternalListingUrl(
        customerType,
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
  const apiData: any = getRequest(apiFunc(), accessToken, customerId, isClient, setIsLoader);

  const clearFilter = () => {
    setTransactionTypes("");
    setCustomerType("");
    setCustomerData([
      {
        isSelected: false,
        label: "",
        value: "",
      },
    ]);
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
    setToggle(true);
    setToggleForType(true);
    getCustomerDropdownOptions();
  };

  useEffect(() => {
    const headers = {
      headers: getHeaders(accessToken, customerId, isClient),
    };

    const lookupApi = urls.lookup;

    axios
      .get(lookupApi, headers)
      .then((res: any) => {
        setLookupData(res.data);
      })
      .catch((e: any) => {
        console.log("error", e);
      });
  }, []);

  useEffect(() => {
    const data = internalTabledata ? internalTabledata : clientTableData;
    if (data?.data && lookupData && toggle) {
      const statuses: any = data?.data?.map((item: any) => {
        if (item.statusLabel) {
          return item.statusLabel;
        }
      });

      const uniqueStatusNames = Array.from(new Set(statuses));
      let statusOptionsArr: any = [];
      const lookUpdataVar = lookupData?.invoiceStatuses;
      lookUpdataVar?.forEach((lookupItem: any) => {
        uniqueStatusNames.forEach((name) => {
          if (lookupItem?.text === "In Review") {
            lookupItem.text = "AR Review";
          }
          if (lookupItem?.text === name) {
            statusOptionsArr.push({
              isSelected: false,
              label: lookupItem.text,
              value: lookupItem.value,
            });
          }
        });
      });
      setStatus(statusOptionsArr);
    }
    if (data?.data && lookupData && toggleForType) {
      const transactionTypeNames: any = data?.data?.map((item: any) => {
        if (item.transactionTypeLabel) {
          return item.transactionTypeLabel;
        }
      });

      const uniqueTransactionTypeNames = Array.from(new Set(transactionTypeNames));
      let transactionTypeOptionsArr: any = [];
      const lookUpdataVar = lookupData?.transactionTypes;
      lookUpdataVar?.forEach((lookupItem: any) => {
        uniqueTransactionTypeNames.forEach((name) => {
          if (lookupItem?.text === name) {
            transactionTypeOptionsArr.push({
              isSelected: false,
              label: lookupItem.text,
              value: lookupItem.value,
            });
          }
        });
      });
      setTypes(transactionTypeOptionsArr);
    }
  }, [internalTabledata, clientTableData, lookupData, toggle]);

  useEffect(() => {
    if (permission.InvoiceList.includes("InternalView")) {
      setIsClient(false);
    } else {
      setIsClient(true);
    }
  }, []);

  useEffect(() => {
    if (localStorage.contractorInvoiceState) {
      const rowDetails = JSON.parse(localStorage.contractorInvoiceState);
      const { id, invoiceNo, transactionType } = rowDetails;
      navigate(
        "/pay/invoicedetails" + id + "/" + rowDetails?.customerId + "/" + true,
        {
          state: {
            InvoiceId: invoiceNo,
            transactionType,
            rowDetails,
          },
        }
      );
    }
    return () => {
      localStorage.removeItem("contractorInvoiceState");
    };
  }, []);

  useEffect(() => {
    if (!clientTableData || clientTableData?.data?.length === 0) return;
    if (localStorage.redirectingInvoiceState) {
      const { invoiceId, referenceNumber, isMoveBills } = JSON.parse(
        localStorage.redirectingInvoiceState
      );
      const matchingData: any = clientTableData.data.find(
        (d: any) => d.invoiceNo === invoiceId
      );
      const { id, invoiceNo, transactionType } = matchingData;
      navigate(
        "/pay/invoicedetails" +
        id +
        "/" +
        matchingData?.customerId +
        "/" +
        true,
        {
          state: {
            InvoiceId: invoiceNo,
            transactionType,
            rowDetails: matchingData,
            referenceNumber,
            isMoveBills,
          },
        }
      );
    }
    if (
      !localStorage.redirectingInvoiceState &&
      localStorage.redirectingReferenceNumber
    ) {
      const { invoiceId, isMoveBills } = JSON.parse(localStorage.voidedInvoice);
      let message = `Bill Reference No. ${localStorage.redirectingReferenceNumber} Has Been Rejected and Invoice No. ${invoiceId} Has Been Voided`;
      if (isMoveBills) {
        message = `Bill Reference No. ${localStorage.redirectingReferenceNumber} Has Been Moved To A New Invoice and Invoice No. ${invoiceId} Has Been Voided.`;
      }
      setShowToast(true);
      setToastMessage(message);
      localStorage.removeItem("redirectingReferenceNumber");
      localStorage.removeItem("voidedInvoice");
    }

    return () => {
      localStorage.removeItem("redirectingInvoiceState");
    };
  }, [clientTableData]);

  useEffect(() => {
    if (apiData?.data?.results) {
      const apiTableData: any = [];
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
          createdDate:
            item.transactionTypeLabel === "Contractor Pay"
              ? format(new Date(item.createdDate), "d MMM yyyy") || ""
              : format(new Date(item.submissionDate), "d MMM yyyy") || "",
          dueDate: format(new Date(item.dueDate), "d MMM yyyy") || "",
          totalAmount:
            item?.currency?.code +
            " " +
            cFormat.format(item.totalAmount).slice(1) || "",
          invoiceBalance:
            item?.currency?.code +
            " " +
            cFormat.format(item.invoiceBalance).slice(1) || "",
          exportToQB: {
            value: item?.qbInvoiceNo > 0 ? "Exported" : "Not Exported",
            color: item?.qbInvoiceNo > 0 ? '#519872' : "#767676",
          },
        });
      });

      if (isClient) {
        setClientTableData({ ...clientTableData, data: apiTableData });
      } else {
        setInternalTabletData({ ...internalTabledata, data: apiTableData });
      }
    }

    if (customerType || transactionTypes || statusType || dateFrom || dateTo) {
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
      if ((searchText) && filteredData.data.length) {
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
            e.customerName
              .toLowerCase()
              .includes((searchText).toLowerCase())
        ),
      };
      if ((searchText) && filteredData.data.length) {
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
      headers: getHeaders(accessToken, customerID, isClient),
    };
    if (singleInvoiceId) {
      const pdfApi = getGenerateSinglePdfUrl(singleInvoiceId);
      axios
        .get(pdfApi, headers)
        .then((res: any) => {
          download(res);
        })
        .catch((e: any) => {
          console.log("error", e);
        });
    } else if (multiInvoiceId) {
      setShowSuccessToast({ ...showSuccessToast, type: true });
      const multiPdfApi = getGenerateMultiplePdfUrl();
      axios({
        method: "post",
        url: multiPdfApi,
        headers: headers.headers,
        data: multiInvoiceId,
      })
        .then((res: any) => {
          download(res);
        })
        .catch((e: any) => {
          console.log("error", e);
        });
    }
  };

  /* istanbul ignore next */
  const onRowCheckboxChange = (selectedRows: any) => {
    setCheckedInvoices(selectedRows);
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

  const handleAddNewPaymentDisable = () => {
    let bool = false;

    if (!checkedInvoices.length) {
      return true;
    }

    /* istanbul ignore next */
    checkedInvoices.forEach((e: any) => {
      if (e.status != 4 && e.status != 10) {
        bool = true;
      }

      if (e.transactionType == 7) {
        bool = true;
      }

      if (e.transactionType == 4) {
        checkedInvoices.forEach((i: any) => {
          if (i.transactionType != 4) {
            bool = true;
          }
        });
      }
      if (checkedInvoices.length > 1) {
        if (checkedInvoices[0].customerId != e.customerId) {
          bool = true;
        }
        if (checkedInvoices[0]?.currency?.code != e?.currency?.code) {
          bool = true;
        }
      }
    });

    return bool;
  };

  /* istanbul ignore next */
  const handleAddPaymentNavigation = (e: any) => {
    let isClientString = isClient ? "true" : "false";
    let isCreditRefund = checkedInvoices.findIndex(
      (c: any) => c.transactionType == 4
    );

    const nav = () => {
      navigate(
        "/pay/invoicedetails" +
        checkedInvoices[0].id +
        "/" +
        checkedInvoices[0].customerId +
        "/" +
        isClientString +
        "/payments",
        {
          state: {
            InvoiceId: checkedInvoices[0].invoiceNo,
            transactionType: checkedInvoices[0].transactionType,
            rowDetails: checkedInvoices[0],
            inveoicesData: checkedInvoices,
          },
        }
      );
    };

    if (e.value === "invoicePayment" && isCreditRefund == -1) {
      nav();
    }
    if (e.value === "creditRefund" && isCreditRefund != -1) {
      nav();
    }
  };

  if (permission?.InvoiceList?.find((str: any) => str === "View") !== "View") {
    return (
      <p className="invoicelist_permission_tabe">
        You do not have permission to view this page.
      </p>
    );
  }

  //Customer filter
  useEffect(() => {
    getCustomerDropdownOptions();
  }, []);

  const getCustomerDropdownOptions = () => {
    let allCustomerapi = urls.customers;
    const headers = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };

    axios
      .get(allCustomerapi, headers)
      .then((response: any) => {
        const temp: any = [];
        response?.data.map((item: any) =>
          temp.push({
            isSelected: false,
            label: item.name,
            value: item.customerId,
          })
        );
        setCustomerData(temp);
      })
      .catch((e: any) => {
        console.log("error", e);
      });
  };

  const allTableOptions = searchText
  ? {
    ...searchedTableData,
    enableMultiSelect: true,
    onRowCheckboxChange: onRowCheckboxChange,
    fallback: ''
  }
  : isClient
    ? {
      ...clientTableData,
      enableMultiSelect: true,
      onRowCheckboxChange: onRowCheckboxChange,
      fallback: ''
    }
    : {
      ...internalTabledata,
      enableMultiSelect: true,
      onRowCheckboxChange: onRowCheckboxChange,
      fallback: ''
    }

  return (
    <>
      <div className="container">
        <div className="listingBtnContainer">
          <div className="add_payment_invoice">
            {permission.InvoiceList.includes("AddPayment") && (
              <>
                {handleAddNewPaymentDisable() ? (
                  <Button
                    className="primary-blue medium"
                    disabled
                    icon={{
                      color: "#ffff",
                      height: "22",
                      icon: "dollar",
                      viewBox: "0 -2 22 22",
                      width: "22",
                    }}
                    label="Add New Payment"
                  />
                ) : (
                  <ButtonDropdown
                    btnClassName="a-button primary-blue medium"
                    menuItems={{
                      labelKeyName: "label",
                      options: [
                        {
                          label: "Invoice Payment",
                          value: "invoicePayment",
                        },
                        {
                          label: "Credit Refund",
                          value: "creditRefund",
                        },
                      ],
                    }}
                    onChange={handleAddPaymentNavigation}
                  >
                    <Icon
                      color="#ffff"
                      height="22"
                      icon="dollar"
                      viewBox="0 -2 22 22"
                      width="22"
                    />
                    Add New Payment
                  </ButtonDropdown>
                )}
              </>
            )}
          </div>
          <div className="new-invoice-button">
            {permission?.InvoiceList?.find((str: any) => str === "Add") ===
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
        </div>

        {!localStorage.redirectingInvoiceState && (
          <div className="dropdowns">
            <div className="inputContainer">
              <Icon icon="search" size="medium" />
              <input
                className="input"
                placeholder={
                  isClient ? "Search Invoices" : "Search by Invoice, Customer"
                }
                onChange={(e: any) => setSearchText(e.target.value)}
              />
            </div>
            <div className="pickers">
              {permission?.InvoiceList?.find(
                (str: any) => str === "Download"
              ) === "Download" && (
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

              {permission.InvoiceList.includes("InternalView") && (
                <div className="customerSelection">
                  <Dropdown
                    data-testid="customer-type"
                    title="Customer"
                    multiple
                    search
                    isOpen={customerOpen}
                    handleDropdownClick={(bool: any) => {
                      setCustomerOpen(bool);
                      if (bool) {
                        setIsStatusOpen(false);
                      }
                    }}
                    handleDropOptionClick={(opt: any) => {
                      setCustomerOpen(true);
                      let index = customerData.findIndex(
                        (e) => e.value === opt.value
                      );

                      let copy = [...customerData];

                      copy.forEach((_e, i) => {
                        if (i === index) {
                          if (copy[index].isSelected) {
                            copy[index] = { ...opt, isSelected: false };
                          } else {
                            copy[index] = { ...opt, isSelected: true };
                          }
                        }
                      });

                      let typesValue = "";

                      copy.forEach((item) => {
                        if (item.isSelected) {
                          if (typesValue) {
                            typesValue += "," + item.value.toString();
                          } else {
                            typesValue = item.value.toString();
                          }
                        }
                      });

                      setCustomerData(copy);
                      setCustomerType(typesValue);
                    }}
                    options={customerData}
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
                  let date = new Date();
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

                    case "Last Month":
                      const lastMonthStartDate = new Date(
                        date.getFullYear(),
                        date.getMonth() - 1
                      );
                      const lastMonthEndDate = new Date(
                        date.getFullYear(),
                        date.getMonth() - 1,
                        31
                      );
                      const lastMonthStartFormatDate = format(
                        lastMonthStartDate,
                        "yyyy-MM-dd"
                      );
                      const lastMonthEndFormatDate = format(
                        lastMonthEndDate,
                        "yyyy-MM-dd"
                      );
                      setDateFrom(lastMonthStartFormatDate);
                      setDateTo(lastMonthEndFormatDate);
                      break;

                    case "Last Year":
                      const lastYearStartDate = new Date(
                        date.getFullYear() - 1,
                        0,
                        1
                      );
                      const lastYearEndDate = new Date(
                        date.getFullYear() - 1,
                        11,
                        31
                      );
                      const lastYearStartFormatDate = format(
                        lastYearStartDate,
                        "yyyy-MM-dd"
                      );
                      const lastYearEndFormatDate = format(
                        lastYearEndDate,
                        "yyyy-MM-dd"
                      );
                      setDateFrom(lastYearStartFormatDate);
                      setDateTo(lastYearEndFormatDate);
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
                    setCustomerOpen(false);
                  }
                }}
                handleDropOptionClick={(opt: any) => {
                  setToggleForType(false)
                  let index = types.findIndex((e) => e.value === opt.value);

                  let copy = [...types];

                  copy.forEach((_item, i) => {
                    if (i === index) {
                      if (copy[index].isSelected) {
                        copy[index] = { ...opt, isSelected: false };
                      } else {
                        copy[index] = { ...opt, isSelected: true };
                      }
                    }
                  });

                  let typesValue = "";

                  copy.forEach((e: any) => {
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
                    setCustomerOpen(false);
                  }
                }}
                handleDropOptionClick={(opt: any) => {
                  setToggle(false);
                  let copy = [...status];
                  let index = status.findIndex(
                    (e: any) => e.value === opt.value
                  );
                  copy.forEach((_e, ind) => {
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
                  setStatusType(statusValue);
                  setDropdownLabel({
                    ...dropdownLabel,
                    status: copy[index]?.label,
                  });
                }}
                options={status}
              />
              {permission?.InvoiceList?.find((str: any) => str === "Edit") ===
                "Edit" && <img src={disabled} className="disabled_dots" />}
              {/* <FaEllipsisH className="icon" /> dots*/}
            </div>
          </div>
        )}

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
        {isLoader && <Loader />}
        {(searchText && !searchedTableData) || (!isClient && !internalTabledata.data.length && !isLoader) || (isClient && !clientTableData.data.length && !isLoader) ? (
          <NoSearchCard
            style={{
              height: '19rem',
              width: 'auto'
            }}
            title="Uh-oh! We found no matches for your search."
          />
        ) : (
          <>
            {!localStorage.redirectingInvoiceState && !isLoader && (
              <Table
                options={allTableOptions}
                colSort
                className="table"
                pagination
                pagingOptions={[15, 30, 50, 100]}
                testRowClick="invoice-list-cell"
                handleRowClick={(row: any) => {
                  let isClientStr = isClient ? "true" : "false";
                  if (row?.transactionType === 7 && row?.status === 9) {
                    setWeAreSorryModalAction(true);
                  } else {
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
                          rowDetails: row,
                        },
                      }
                    );
                  }
                }}
              />
            )}
          </>
        )}
      </div>
      <ToastContainer
        showToast={showToast}
        setShowToast={setShowToast}
        message={toastMessage}
        duration={10}
      />
      <WeAreSorryModal
        isOpen={weAreSorryModalAction}
        onClose={() => setWeAreSorryModalAction(false)}
      />
    </>
  );
}
