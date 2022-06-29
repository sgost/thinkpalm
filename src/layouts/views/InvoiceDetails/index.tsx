import React, { useEffect, useState } from "react";
import {
  Button,
  Icon,
  Table,
  BreadCrumb,
  Checkbox,
  Modal,
  Cards,
  DatePicker,
  AvatarHandler,
  ToastNotification,
  ButtonDropdown,
} from "atlasuikit";
import "./invoiceDetails.scss";
import { apiInvoiceMockData } from "./mockData";

import LogsCompo from "../Logs/index";

import moment from "moment";
import GetFlag, { getFlagPath } from "./getFlag";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import avatar from "./avatar.png";
import BillsTable from "../BillsTable";
import deleteSvg from "../../../assets/icons/deletesvg.svg";
import {
  convertMissInvoice,
  calculateInvoiceUrl,
  getDeleteInvoiceUrl,
  getDownloadUrl,
  getExcelUrl,
  getApproveARUrl,
  getApproveUrl,
  getApproveUrlNo,
  getInvoiceDetailsUrl,
  getBillingAddressUrl,
  urls,
  getNotesUrl,
  getHeaders,
  getRelatedInvoiceUrl,
  getVatValue,
  getEmployeeBreakdownUrl,
  getAutoApproveCheckUrl,
  getUpdateInvoiceCalanderPoNoUrl,
  getEmployeeCompensationData,
  getPaymentDetailApi,
} from "../../../urls/urls";
import CreditMemoSummary from "../CreditMemoSummary";
import { tableSharedColumns } from "../../../sharedColumns/sharedColumns";
import NotesWidget from "../../../components/Notes";
import FileUploadWidget from "../../../components/FileUpload";
import { getDecodedToken } from "../../../components/getDecodedToken";
import {
  getPermissions,
  Loader,
} from "../../../../src/components/Comman/Utils/utils";
import PaymentDetailContainer from "./paymentDetailContainer";
import format from "date-fns/format";
import cn from "classnames";

export default function InvoiceDetails() {
  const { state }: any = useLocation();
  const topPanelObj = {
    from: "",
    to: "",
    toAddress: "",
    poNumber: "",
    invoiceDate: "",
    invoiceApproval: "",
    paymentDue: "",
    location: "",
    region: "",
    billingCurrency: "",
    total: "",
    open: "",
  };
  const permission: any = getDecodedToken();
  const [btnDis, setBtnDis] = useState(false);
  const [missTransType] = useState(state.transactionType); //To change the the invoice transictionType number
  const [activeTab, setActiveTab] = useState("payroll");
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isVoidOpen, setIsVoidOpen] = useState(false);
  const [isVoidConfirmOptionOpen, setIsVoidConfirmOptionOpen] = useState(false);
  const [isCompensatioModalOpen, setIsCompensatioModalOpen] = useState<any>({
    modalOpen: false,
    data: [],
  });

  const { id, cid, isClient } = useParams();

  const baseBillApi = urls.billsPerInvoice;

  const api = getInvoiceDetailsUrl(id);

  const addressApi = getBillingAddressUrl(cid);

  const countriesApi = urls.countries;

  const feeApi = urls.fee;

  const lookupApi = urls.lookup;

  const notesApi = getNotesUrl(id);

  const tempToken = localStorage.getItem("accessToken");

  const [apiData, setApiData] = useState<any>(null);
  const [billTableData, setBillTableData] = useState<any>(null);
  const [addressData, setAddressData] = useState<any>(null);
  const [countriesData, setCountriesData] = useState<any>(null);
  const [feeData, setFeeData] = useState<any>(null);
  const [lookupData, setLookupData] = useState<any>(null);
  const [documents, setDocuments] = useState<any>([]);
  const [hideTopCheck, setHideTopCheck] = useState(true);
  const [payrollTables, setPayrollTables] = useState<any>([]);
  const [showAutoApprovedToast, setShowAutoApprovedToast] = useState(false);

  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("");
  const [voidFileData, setVoidFileData] = useState<any>({});
  const [isErr, setIsErr] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputVoidValue, setInputVoidValue] = useState("");
  const [approvalMsg, setApprovalMsg] = useState("");
  const [notes, setNotes] = useState<any>([]);
  const [deleteDisableButtons, setDeleteDisableButtons] = useState(false);
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const [deleteEmployeeModalOpen, setDeleteEmployeeModalOpen] = useState({
    isModalOpen: false,
    data: {},
  });
  const [countrySummary, setCountrySummary] = useState<any>([]);
  const [totalCountrySummaryDue, settotalCountrySummaryDue] = useState(0);
  const [feeSummary, setFeeSummary] = useState<any>([]);
  const [contractTerminationFee, setContractTerminationFee] = useState(0);
  const [incomingWirePayment, setIncomingWirePayment] = useState(0);
  const [feeSummaryTotalDue, setFeeSummaryTotalDue] = useState(0);
  const [isAutoApprove, setIsAutoApprove] = useState(false);
  const [creditMemoData, setCreditMemoData] = useState<any>(null);
  const [topPanel, setTopPanel] = useState<any>(topPanelObj);
  const [vatValue, setVatValue] = useState();
  const [logsData, setLogsData] = useState<any>([]); // mockLogsdata
  const viewLimit = 10;
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [dataAvailable, setDataAvailable] = useState(true);
  const [changeLogs, setChangeLogs] = useState<any>([]);
  const [paymentDetailData, setPaymentDetailData] = useState<any>([]);
  const [initail, setInitial] = useState(0);
  const [limitFor, setLimitFor] = useState(10);
  const [deleteApp, setDeleteApp] = useState(true);

  const [poNumber, setPoNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState<any>("");
  const [paymentDue, setPaymentDue] = useState<any>("");
  const [invoiceChanges, setInvoiceChanges] = useState<any>("");
  const [compensationTableOptions, setCompensationTableOptions] = useState({
    columns: [
      tableSharedColumns.payItemName,
      tableSharedColumns.amount,
      tableSharedColumns.currency,
      tableSharedColumns.effectiveDate,
      tableSharedColumns.endDate,
      tableSharedColumns.scopesName,
      tableSharedColumns.payItemFrequencyName,
    ],
    data: [],
  });
  const [invoiceSaved, setInvoiceSavedValue] = useState("");
  const [saveButtonDisable, setSaveButtonDisable] = useState(true);
  const [isEditFieldsChanges, setIsEditFieldsChanges] = useState(false);
  const [reCalButtonDisable, setReCalButtonDisable] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [declineCheckboxLabel, setDeclineCheckboxLabel] = useState([
    {
      label: "Employee Salary is not correct",
      isSelected: undefined,
      isDisable: false,
    },
    {
      label: "Benefit Amount is not correct",
      isSelected: undefined,
      isDisable: false,
    },
    {
      label: "One-off pay items amount to be updated",
      isSelected: undefined,
      isDisable: false,
    },
    {
      label: "Termination",
      isSelected: undefined,
      isDisable: false,
    },
    {
      label: "Invoice Calculation Error",
      isSelected: undefined,
      isDisable: false,
    },
    {
      label: "Fee Issue",
      isSelected: undefined,
      isDisable: false,
    },
  ]);

  useEffect(() => {
    if (logsData.length === 0) return;
    const splicedData: any = [...logsData].splice(0, viewLimit);

    setChangeLogs([...splicedData]);
  }, [logsData]);

  useEffect(() => {
    if (changeLogs.length > 0) {
      if (logsData.length > 0) {
        if (changeLogs.length === logsData.length) {
          setDataAvailable(false);
        } else {
          setDataAvailable(true);
        }
      }
    }
  }, [changeLogs]);

  const navigate = useNavigate();
  useEffect(() => {
    if (!hideTopCheck) {
      navigate("/pay");
    }
  }, [hideTopCheck]);

  const initialApiCall = () => {
    const headers = {
      headers: getHeaders(tempToken, cid, isClient),
    };

    axios
      .get(feeApi, headers)
      .then((res: any) => {
        setFeeData(res);
      })
      .catch((e: any) => {
        console.log("error", e);
      });

    axios
      .get(countriesApi, headers)
      .then((countryRes: any) => {
        setCountriesData(countryRes);

        axios
          .get(urls.invoiceLogs.replace("{invoice-id}", id), headers)
          .then((res: any) => {
            const logsDetails: any = res?.data?.map((log: any) => ({
              date: moment(log?.createdDate).format("DD MMM YYYY, hh:mm"),
              customerEmail: log?.email,
              description: log?.note,
            }));
            setLogsData([...logsDetails]);
          })
          .catch((e: any) => {
            console.log("error", e);
          });

        if (
          missTransType != 7 &&
          missTransType != 4 &&
          missTransType != 3 &&
          missTransType != 2
        ) {
          axios
            .get(api, headers)
            .then((res: any) => {
              if (res.status !== 200) {
                throw new Error("Something went wrong");
              }
              let billingCurrency = countryRes.data.find(
                (e: any) => e.currencyId === res.data.invoice.currencyId
              );
              let data: any = [];
              let countrySummaryTemp: any = [];
              let tempTotal = 0;
              let countrySumTotalArrTemp: any = [];
              let feeSummaryTemp: any = [];

              res.data?.countryPayroll.forEach((e: any) => {
                let country = e.countryName;
                let countryCode = e.countryCode;
                let currencyCode = e.currencyCode;
                let arr: any = [];

                e.payrollItems.forEach((item: any) => {
                  arr.push({
                    employeeID: {
                      value: (
                        <span
                          style={{ fontWeight: 600 }}
                          onClick={() => {
                            // (status === "Declined" || status === "AR Review") &&
                            (res.data?.invoice?.status === 2 ||
                              res.data?.invoice?.status === 12) &&
                              handleCompensationModal(item);
                            // : (
                            //   <></>
                            // );
                          }}
                        >
                          {item.employeeId}
                        </span>
                      ),
                    },
                    name: {
                      value: (
                        <span style={{display: 'flex' , alignItems: 'center'}}>
                        { item?.employeeProfilePicture ?  <img style={{borderRadius: 12}} src={item?.employeeProfilePicture} /> 
                          : <span className="initialsImg">{item?.firstName[0] + " " + item?.lastName[0]}</span>  
                        }
                        <span
                          style={{ fontWeight: 600 }}
                          onClick={() => {
                            // (status === "Declined" || status === "AR Review") &&
                            (res.data?.invoice?.status === 2 ||
                              res.data?.invoice?.status === 12) &&
                              handleCompensationModal(item);
                            // : (
                            //   <></>
                            // );
                          }}
                        >
                          {item.firstName + " " + item.lastName}
                        </span>
                        </span>

                      ),
                      // img: { src: item?.employeeProfilePicture ? item.employeeProfilePicture : avatar },
                      // style: { borderRadius: 12 },
                    },
                    grossWages:
                      currencyCode + " " + toCurrencyFormat(item.totalWage),
                    // item.totalWage.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")
                    allowances:
                      currencyCode + " " + toCurrencyFormat(item.allowance),

                    // item.allowance.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")
                    expenseReimb:
                      currencyCode + " " + toCurrencyFormat(item.expenseRe),

                    // item.expenseRe.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")
                    employerLiability:
                      currencyCode + " " + toCurrencyFormat(item.liability),

                    // item.liability.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")
                    countryVAT: item.countryVat.toFixed(2),
                    adminFees:
                      billingCurrency.currency.code +
                      " " +
                      toCurrencyFormat(item.adminFee),
                    // item.adminFee.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")
                    healthcareBenefits:
                      billingCurrency.currency.code +
                      " " +
                      toCurrencyFormat(item.healthcare),

                    // item.healthcare.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")

                    action:
                      res.data?.invoice?.status === 2 ||
                        res.data?.invoice?.status === 12
                        ? {
                          value: (
                            <div
                              data-testid="delete-icon"
                              onClick={() => {
                                setDeleteEmployeeModalOpen({
                                  isModalOpen: true,
                                  data: item,
                                });
                              }}
                            >
                              <Icon
                                icon="trash"
                                color="#E32C15"
                                size="large"
                              />
                            </div>
                          ),
                          color: "#E32C15",
                        }
                        : "",
                  });
                });

                tempTotal += e.countryTotalDue;

                data.push({
                  country,
                  countryCode,
                  exchangeRate: e.exchangeRate,
                  currencyCode: e.currencyCode,
                  countryTotalDue: e.countryTotalDue,
                  feeSummary: e.feeSummary,
                  data: arr,
                });

                //For Country Summary

                let totalGrossWages = e.payrollItems.reduce(
                  (a: any, b: any) => a + (b.totalWage || 0),
                  0
                );
                let totalAllowances = e.payrollItems.reduce(
                  (a: any, b: any) => a + (b.allowance || 0),
                  0
                );
                let totalExpenseReimb = e.payrollItems.reduce(
                  (a: any, b: any) => a + (b.expenseRe || 0),
                  0
                );
                let totalEmployerLiability = e.payrollItems.reduce(
                  (a: any, b: any) => a + (b.liability || 0),
                  0
                );
                let totalCountryVAT = e.payrollItems.reduce(
                  (a: any, b: any) => a + (b.countryVat || 0),
                  0
                );

                function precisionRound(number: number, precision: number) {
                  if (precision < 0) {
                    const factor = Math.pow(10, precision);
                    return Math.round(number * factor) / factor;
                  } else {
                    return +(
                      Math.round(Number(number + "e+" + precision)) +
                      "e-" +
                      precision
                    );
                  }
                }

                let countrySumTotalTemp =
                  precisionRound(
                    (totalGrossWages + totalAllowances) * e.exchangeRate,
                    2
                  ) +
                  precisionRound(totalExpenseReimb * e.exchangeRate, 2) +
                  precisionRound(totalEmployerLiability * e.exchangeRate, 2) +
                  precisionRound(totalCountryVAT * e.exchangeRate, 2);

                countrySumTotalArrTemp.push(countrySumTotalTemp);

                countrySummaryTemp.push({
                  country: {
                    value: e.countryName,
                    img: { src: getFlagPath(e.countryCode) },
                  },
                  currency: e.currencyCode,
                  employees: e.payrollItems.length,
                  grossWages: toCurrencyFormat(totalGrossWages),
                  allowances: toCurrencyFormat(totalAllowances),
                  expenseReimb: toCurrencyFormat(totalExpenseReimb),
                  employerLiability: toCurrencyFormat(totalEmployerLiability),
                  countryVAT: toCurrencyFormat(totalCountryVAT),
                  exchangeRate: e.exchangeRate,
                  total: toCurrencyFormat(countrySumTotalTemp),
                });

                //Fee Summary Calculation
                feeSummaryTemp.push({
                  country: {
                    value: e.countryName,
                    img: { src: getFlagPath(e.countryCode) },
                  },
                  currency: e.currencyCode,
                  adminFees: toCurrencyFormat(e.feeSummary.adminFee),
                  OnOffboardings: e.feeSummary.boardingFee,
                  fxRate: e.feeSummary.fxRate,
                  fxBill: e.feeSummary.fxBill,
                  benefits: toCurrencyFormat(e.feeSummary.healthCare),
                  employeeContribution: e.employeeContributionCreditTotal,
                  total: toCurrencyFormat(e.feeSummary.total),
                });
              });

              //Set states here
              setPayrollTables(data);
              setTotal(tempTotal);
              setDocuments(res.data.invoice.invoiceDocuments);
              setApiData(res);
              setCountrySummary(countrySummaryTemp);
              let totalCountrySummaryDueTemp = countrySumTotalArrTemp.reduce(
                (a: any, b: any) => a + (b || 0),
                0
              );
              settotalCountrySummaryDue(totalCountrySummaryDueTemp);
              setFeeSummary(feeSummaryTemp);
              setIsAutoApprove(res.data.isAutoApprove);
            })
            .catch((e: any) => {
              console.log("error e", e);
              setIsErr(true);
            });
        } else if (
          missTransType == 4 ||
          missTransType == 3 ||
          missTransType == 2
        ) {
          axios
            .get(getRelatedInvoiceUrl(id), headers)
            .then((response) => {
              if (response.status == 200) {
                setCreditMemoData(response.data);
                setNotes(response.data.invoiceNotes);
                setDocuments(response.data.invoiceDocuments);
              }
            })
            .catch((_res) => {
              setIsErr(true);
            });
          axios
            .get(getVatValue(cid), headers)
            .then((resp) => {
              if (resp.status == 200) {
                setVatValue(resp?.data?.feeConfiguration?.percentage);
              }
            })
            .catch((resp) => {
              console.log(resp);
            });
        } else {
          let res: any = {
            data: {
              ...apiInvoiceMockData,
              invoice: {
                ...apiInvoiceMockData.invoice,
                ...state.rowDetails,
                customerName: state.rowDetails?.customerName,
                createdDate: state.rowDetails?.createdDate,
                invoiceBalance:
                  parseFloat(
                    state.rowDetails?.totalAmount
                      ?.split(" ")[1]
                      .replace(",", "")
                  ) || 0,
                totalAmount:
                  parseFloat(
                    state.rowDetails?.totalAmount
                      ?.split(" ")[1]
                      .replace(",", "")
                  ) || 0,
              },
            },
          };
          setTimeout(() => {
            setApiData(res);
          });
        }
      })
      .catch((e: any) => {
        console.log("error", e);
        setIsErr(true);
      });

    axios
      .get(lookupApi, headers)
      .then((res: any) => {
        setLookupData(res);
      })
      .catch((e: any) => {
        console.log("error", e);
      });

    axios
      .get(addressApi, headers)
      .then((res: any) => {
        setAddressData(res);
      })
      .catch((e: any) => {
        console.log("error", e);
      });

    if (missTransType == 7) {
      let URL = baseBillApi + state.InvoiceId;
      axios
        .get(URL, {
          headers: {
            accept: "text/plain",
            Authorization: `Bearer ${localStorage.accessToken}`,
            customerID: localStorage["current-org-id"],
          },
        })
        .then((response: any) => {
          if (response.status == 200) {
            const { data } = response.data;
            if (data?.invoiceBills?.length > 0) {
              setBillTableData(response);
            } else {
              console.log("no data");
            }
          } else {
            console.log("Bill API failing on contractor service");
          }
        })
        .catch((e: any) => {
          console.log("error", e);
        });
    }
    if (missTransType != 4 && missTransType != 3 && missTransType != 2) {
      axios
        .get(notesApi, headers)
        .then((res: any) => {
          if (isClient == "true") {
            setNotes(
              res.data.reverse().filter((e: any) => e.isCustomerVisible)
            );
          } else {
            setNotes(res.data.reverse());
          }
        })
        .catch((e: any) => {
          console.log("error e", e);
        });
    }
  };

  useEffect(() => {
    initialApiCall();
  }, []);

  useEffect(() => {
    if (lookupData?.data && apiData?.data) {
      lookupData.data.invoiceStatuses.forEach((e: any) => {
        if (e.value === apiData.data.invoice.status) {
          setStatus(e.text === "In Review" ? "AR Review" : e.text);
        }
      });
    }
  }, [lookupData, apiData]);
  useEffect(() => {
    if (lookupData?.data && creditMemoData) {
      lookupData.data.invoiceStatuses.forEach((e: any) => {
        if (e.value === creditMemoData.status) {
          setStatus(e.text === "In Review" ? "AR Review" : e.text);
        }
      });
    }
  }, [lookupData, creditMemoData]);

  useEffect(() => {
    if (apiData?.data && feeData?.data) {
      const additionalFee = feeData.data.find((x: any) => x.type === 5);

      const terminationFeeTemp = apiData.data.payrollFees.find(
        (x: any) => x.feeId === additionalFee.id
      );

      setContractTerminationFee(terminationFeeTemp?.amount || 0);

      const incomingFee = feeData.data.find((x: any) => x.type === 1);

      const incomingWirePaymentTemp = apiData.data.payrollFees.find(
        (x: any) => x.feeId === incomingFee.id
      );
      setIncomingWirePayment(incomingWirePaymentTemp?.amount || 0);

      const totalFeeSummaryTemp =
        apiData.data.countryPayroll.reduce(
          (a: any, b: any) => a + (b.feeSummary.total || 0),
          0
        ) +
        (terminationFeeTemp ? terminationFeeTemp.amount : 0) +
        (incomingWirePaymentTemp ? incomingWirePaymentTemp.amount : 0);

      setFeeSummaryTotalDue(totalFeeSummaryTemp);
    }
  }, [apiData, feeData]);
  useEffect(() => {
    if (apiData?.data && addressData?.data) {
      let model: any = topPanelObj;
      model.from = apiData?.data?.invoiceFrom?.companyName;
      model.to = apiData?.data?.invoice?.customerName;
      model.toAddress = addressData?.data?.billingAddress?.street;
      model.poNumber = apiData?.data?.invoice?.poNumber;
      model.invoiceDate = moment(
        state.transactionType == 7
          ? apiData?.data?.invoice?.createdDate
          : apiData?.data?.invoice?.submissionDate
      ).format("DD MMM YYYY");
      model.invoiceApproval = moment(
        apiData?.data?.invoice?.approvalDate
      ).format("DD MMM YYYY");
      model.paymentDue = moment(apiData?.data?.invoice?.dueDate).format(
        "DD MMM YYYY"
      );
      model.location = apiData?.data?.invoice?.customerLocation;
      model.region = apiData?.data?.regionItemCode?.toUpperCase();
      model.total = apiData?.data?.invoice?.totalAmount;
      model.open = apiData?.data?.invoice?.invoiceBalance;
      setTopPanel(model);
    }
  }, [apiData, addressData]);

  useEffect(() => {
    if (creditMemoData && addressData?.data) {
      let model: any = topPanelObj;
      model.from = creditMemoData.invoiceFrom.companyName;
      model.to = creditMemoData?.customerName;
      model.poNumber = creditMemoData?.poNumber || "";
      model.invoiceDate = creditMemoData?.submissionDate
        ? moment(creditMemoData?.submissionDate).format("DD MMM YYYY")
        : moment(creditMemoData?.createdDate).format("DD MMM YYYY");
      model.invoiceApproval = moment(creditMemoData?.createdDate).format(
        "DD MMM YYYY"
      );
      model.paymentDue = moment(creditMemoData?.dueDate).format("DD MMM YYYY");
      model.location = creditMemoData?.customerLocation;
      model.region = creditMemoData?.regionItemCode;
      model.total = creditMemoData?.totalAmount;
      model.open = creditMemoData?.invoiceBalance;
      setTopPanel(model);
    }
  }, [creditMemoData, addressData]);

  useEffect(() => {
    if (showAutoApprovedToast) {
      setTimeout(() => {
        setShowAutoApprovedToast(false);
      }, 4000);
    }
  }, [showAutoApprovedToast]);

  useEffect(() => {
    if ((status === "Paid" || status === "Partial Paid") && id) {
      const headers = {
        headers: getHeaders(tempToken, cid, isClient),
      };

      let paymentdetailApi = getPaymentDetailApi(id);

      axios
        .get(paymentdetailApi, headers)
        .then((res: any) => {
          setPaymentDetailData(res?.data?.payments);
        })
        .catch((e: any) => {
          console.log("error e", e);
        });
    }
  }, [id, status]);

  const handleSaveDisable = () => {
    const invDate = new Date(
      invoiceDate
        ? moment(invoiceDate).format("YYYY-MM-DD")
        : moment(topPanel.invoiceDate).format("YYYY-MM-DD")
    );

    const invAppDate = new Date(
      invoiceChanges
        ? moment(invoiceChanges).format("YYYY-MM-DD")
        : moment(topPanel.invoiceApproval).format("YYYY-MM-DD")
    );

    const payDue = new Date(
      paymentDue
        ? moment(paymentDue).format("YYYY-MM-DD")
        : moment(topPanel.paymentDue).format("YYYY-MM-DD")
    );

    if (
      invDate > payDue ||
      (invDate > invAppDate && missTransType == 1) ||
      (invAppDate > payDue && missTransType == 1)
    ) {
      setSaveButtonDisable(true);
    } else {
      setSaveButtonDisable(false);
    }
  };

  useEffect(() => {
    if (isEditFieldsChanges) {
      handleSaveDisable();
    }
  }, [paymentDue, invoiceDate, invoiceChanges, isEditFieldsChanges]);

  const getBillingCurrency = () => {
    if (countriesData?.data && apiData?.data) {
      let currency = countriesData.data.find(
        (e: any) => e.currencyId === apiData.data.invoice.currencyId
      );
      return currency?.currency?.code;
    } else if (creditMemoData && lookupData?.data) {
      let currency = lookupData.data.billingCurrencies.find(
        (e: any) => e.value === creditMemoData.currencyId
      );
      return currency?.text;
    } else {
      return "";
    }
  };

  const sharedColumns = {
    grossWages: tableSharedColumns.grossWages,
    allowances: tableSharedColumns.allowances,
    expenseReimb: tableSharedColumns.expenseReimb,
    employerLiability: tableSharedColumns.employerLiability,
    countryVAT: tableSharedColumns.countryVAT,
    adminFees: tableSharedColumns.adminFees,
    country: tableSharedColumns.country,
    currency: tableSharedColumns.currency,
    total: {
      header: "Total in " + getBillingCurrency(),
      isDefault: true,
      key: "total",
    },
  };

  const payrollOptions: any = {
    columns: [
      tableSharedColumns.employeeID,
      tableSharedColumns.name,
      sharedColumns.grossWages,
      sharedColumns.allowances,
      sharedColumns.expenseReimb,
      sharedColumns.employerLiability,
      sharedColumns.countryVAT,
      sharedColumns.adminFees,
      tableSharedColumns.healthcareBenefits,
      (apiData?.data?.invoice?.status === 2 ||
        apiData?.data?.invoice?.status === 12) && {
        header: "Action",
        isDefault: true,
        key: "action",
      },
    ],
    showDefaultColumn: true,
  };

  const countrySummaryOptions: any = {
    columns: [
      sharedColumns.country,
      sharedColumns.currency,
      tableSharedColumns.employees,
      sharedColumns.grossWages,
      sharedColumns.allowances,
      sharedColumns.expenseReimb,
      sharedColumns.employerLiability,
      sharedColumns.countryVAT,
      tableSharedColumns.exchangeRate,
      sharedColumns.total,
    ],
    showDefaultColumn: true,
  };

  const feeSummaryOptions: any = {
    columns: [
      sharedColumns.country,
      sharedColumns.currency,
      sharedColumns.adminFees,
      tableSharedColumns.OnOffboardings,
      tableSharedColumns.fxRate,
      tableSharedColumns.fxBill,
      tableSharedColumns.benefits,
      tableSharedColumns.employeeContribution,
      sharedColumns.total,
    ],
    showDefaultColumn: true,
  };

  const toCurrencyFormat = (amount: number) => {
    const cFormat = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    return cFormat.format(amount).slice(1);
  };

  const downloadFunction = () => {
    const headers = {
      headers: {
        authorization: `Bearer ${tempToken}`,
        "x-apng-base-region": "EMEA",
        "x-apng-customer-id": cid?.toString() || "",
        "x-apng-external": "false",
        "x-apng-inter-region": "0",
        "x-apng-target-region": "EMEA",
        customer_id: cid?.toString() || "",
        // "Content-Type": "application/json",
      },
    };

    const downloadApi = getDownloadUrl(id);

    axios
      .get(downloadApi, headers)
      .then((res: any) => {
        if (res.status === 200) {
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
    setIsDownloadOpen(false);
  };

  const handleApproveInvoice = (no: any) => {
    const approveApi =
      missTransType == 2 || missTransType == 3 || missTransType == 4
        ? getApproveUrlNo(id, no)
        : getApproveUrl(id);

    axios({
      method: "PUT",
      url: approveApi,
      headers: getHeaders(tempToken, cid, isClient),
    })
      .then((res: any) => {
        if (res?.status === 201) {
          if (res?.data?.status === 2) {
            setStatus("AR Review");
          } else if (res?.data?.status === 8) {
            setStatus("Closed");
            setApprovalMsg("Invoice Converted successfully");
            setTimeout(() => {
              setApprovalMsg("");
            }, 3000);
          } else {
            setStatus("Approved");
            setApprovalMsg("Invoice approve successfully");
            setTimeout(() => {
              setApprovalMsg("");
            }, 3000);
          }
        } else {
          setApprovalMsg("Invoice approve failed");
        }
      })
      .catch((e: any) => {
        console.log("error", e);
        setApprovalMsg("Invoice approve failed");
        setTimeout(() => {
          setApprovalMsg("");
        }, 3000);
      });
  };

  const handleApproveAR = () => {
    const approveARApi = getApproveARUrl();

    axios({
      method: "PUT",
      url: approveARApi,
      headers: getHeaders(tempToken, cid, isClient),
      data: [
        {
          InvoiceNo: apiData?.data?.invoice?.invoiceNo,
          TransactionType: apiData?.data?.invoice?.transactionType,
        },
      ],
    })
      .then((_res: any) => {
        setStatus("Pending Approval");
      })
      .catch((e: any) => {
        console.log("error", e);
      });
  };

  const downloadExcelFunction = () => {
    const headers = {
      headers: getHeaders(tempToken, cid, isClient),
    };

    const downloadApi = getExcelUrl(id);
    axios
      .get(downloadApi, headers)
      .then((res: any) => {
        if (res.status === 200) {
          let url2 = res.data.url;
          let a = document.createElement("a");
          a.href = url2;
          a.download = `${res.data.name}`;
          a.click();
        }
      })
      .catch((e: any) => {
        console.log("error", e);
      });
    setIsDownloadOpen(false);
  };

  const downloadEmployeeBreakdownFunction = () => {
    const headers = {
      headers: getHeaders(tempToken, cid, isClient),
    };

    const downloadEmployeeBreakdwonApi = getEmployeeBreakdownUrl(id);
    axios
      .get(downloadEmployeeBreakdwonApi, headers)
      .then((res: any) => {
        if (res.status === 200) {
          let url2 = res.data.url;
          let a = document.createElement("a");
          a.href = url2;
          a.download = `${res.data.name}`;
          a.click();
        }
      })
      .catch((e: any) => {
        console.log("error", e);
      });
    setIsDownloadOpen(false);
  };

  const handleVoid = async () => {
    const headers = getHeaders(tempToken, cid, isClient);

    let formData = new FormData();
    formData.append("asset", voidFileData);
    await axios
      .post(urls.voidUploadFile, formData, {
        headers: headers,
      })
      .then(async (res: any) => {
        await axios
          .post(
            urls.voidCreateDoc,
            {
              invoiceId: id,
              customerId: cid,

              document: {
                url: res.data.url,

                documentName: res.data.fileName,
              },
            },
            {
              headers: headers,
            }
          )
          .then((response: any) => {
            console.log(response);
          })
          .catch((e: any) => {
            console.log(e);
          });
      })
      .catch((e: any) => {
        console.log(e);
      });

    let currDate = new Date();

    await axios
      .post(
        urls.voidInvoice,
        {
          invoiceId: id,
          note: inputVoidValue,
          createdDate: currDate,
        },
        {
          headers: headers,
        }
      )
      .then((response: any) => {
        if (response.status == 200) {
          lookupData.data.invoiceStatuses.forEach((e: any) => {
            if (e.value === response.data.status) {
              setStatus(e.text === "In Review" ? "AR Review" : e.text);
              setTopPanel({ ...topPanel, open: 0.0 });
            }
          });
          initialApiCall();
          setVoidFileData({});
          setIsVoidConfirmOptionOpen(false);
          setInputVoidValue("");
        }
      })
      .catch((e: any) => {
        console.log(e);
        setVoidFileData({});
        setIsVoidConfirmOptionOpen(false);
        setInputVoidValue("");
      });
  };

  const handleDeleteInvoice = async () => {
    const headers = {
      headers: getHeaders(tempToken, cid, isClient),
    };
    const deleteApi = getDeleteInvoiceUrl(
      missTransType == 4 || missTransType == 3 || missTransType == 2
        ? id
        : apiData?.data?.invoice?.id
    );

    setDeleteApp(false);
    await axios
      .delete(deleteApi, headers)
      .then((res: any) => {
        if (res.data === true) {
          setDeleteApp(true);
          navigate("/pay");
        }
        if (res.data === false) {
          console.log("Invoice not deleted");
        }
      })
      .catch((e: any) => {
        console.log("error", e);
      });
  };

  /* istanbul ignore next */
  const handleCompensationModal = (data: any) => {
    if (data?.employeeId) {
      const headers: any = {
        headers: {
          authorization: `Bearer ${tempToken}`,
          "x-apng-base-region": "EMEA",
          "x-apng-customer-id": cid || "",
          "x-apng-external": isClient,
          "x-apng-inter-region": "0",
          "x-apng-target-region": "EMEA",
          customerId: cid || "",
        },
      };

      const compensationApi = getEmployeeCompensationData(data?.employeeId);

      axios
        .get(compensationApi, headers)
        .then((res: any) => {
          setIsCompensatioModalOpen({ modalOpen: true, data: res.data });
          const newData = res.data.compensation.payItems.map((item: any) => {
            if (item.effectiveDate) {
              item.effectiveDate = moment(item.effectiveDate).format(
                "D MMM YYYY"
              );
            }
            if (item.endDate === null) {
              item.endDate = "";
            }
            return item;
          });
          setCompensationTableOptions({
            ...compensationTableOptions,
            data: newData,
          });
        })
        .catch((e: any) => {
          console.log("error", e);
        });
    }
  };

  if (!apiData?.data && !isErr && !creditMemoData && !isErr) {
    return <Loader />;
  }
  if (isErr) {
    return <p>Something went wrong!</p>;
  }

  if (!permission?.InvoiceDetails.includes("View")) {
    return <p>You don't have permission to view this page.</p>;
  }

  const getTransactionLabel = () => {
    switch (missTransType) {
      case 7:
        return "Contractor Invoice No. " + apiData?.data?.invoice?.invoiceNo;
      case 4:
        return "Credit Memo No. " + creditMemoData.invoiceNo;
      case 3:
        return "Proforma Invoice No. " + creditMemoData.invoiceNo;
      case 2:
        return "Miscellaneous No. " + creditMemoData.invoiceNo;
      default:
        return "Payroll Invoice No. " + apiData?.data?.invoice?.invoiceNo;
    }
  };

  const getTransactionLabelForPayment = () => {
    switch (missTransType) {
      case 7:
        return "Contractor";
      case 4:
        return "Credit";
      case 3:
        return "Proforma";
      case 2:
        return "Miscellaneous";
      default:
        return "Payroll";
    }
  };

  if (missTransType != 1 && !getPermissions(missTransType, "View")) {
    return <p>You do not have permission to view this page.</p>;
  }

  const deleteFun = () => {
    if (deleteApp) {
      return "Delete";
    } else {
      return "Pending...";
    }
  };

  // To change the the invoice into Miscellineous

  const migrationInvoice = () => {
    axios({
      method: "POST",
      url: convertMissInvoice(id),
      headers: getHeaders(tempToken, cid, isClient),
    }).then((resp: any) => {
      if (resp) {
        handleApproveInvoice(8);
        setBtnDis(true);
      }
    });
  };

  const handleEditSave = () => {
    axios({
      method: "PUT",
      url: getUpdateInvoiceCalanderPoNoUrl(id),
      headers: getHeaders(tempToken, cid, isClient),
      data: {
        submissionDate: invoiceDate
          ? format(invoiceDate, "yyyy-MM-dd")
          : topPanel.invoiceDate,
        approvalDate: invoiceChanges
          ? format(invoiceChanges, "yyyy-MM-dd")
          : topPanel.invoiceApproval,
        dueDate: paymentDue
          ? format(paymentDue, "yyyy-MM-dd")
          : topPanel.paymentDue,
        poNumber: poNumber ? poNumber : topPanel.poNumber,
      },
    })
      .then((resp: any) => {
        if (resp) {
          setInvoiceSavedValue("Saved");
          setTimeout(() => {
            setInvoiceSavedValue("");
            setReCalButtonDisable(false);
          }, 3000);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
    setSaveButtonDisable(true);
  };

  const deleteEmployee = async () => {
    const headers = getHeaders(tempToken, cid, isClient);
    let deleteEmployeeApi = urls.deleteEmployeeApi;

    await axios
      .post(
        deleteEmployeeApi,
        {
          customerId: cid,
          InvoiceId: id,
          PayrollId: deleteEmployeeModalOpen?.data?.payrollId,
          EmployeeId: deleteEmployeeModalOpen?.data?.employeeId,
        },
        {
          headers: headers,
        }
      )
      .then((response: any) => {
        if (response.status === 200) {
          setDeleteEmployeeModalOpen({
            ...deleteEmployeeModalOpen,
            isModalOpen: false,
          });
        }
      })
      .catch((e: any) => {
        console.log(e);
      });
  };
  const reCalculate = () => {
    axios({
      method: "POST",
      url: calculateInvoiceUrl(id),
      headers: getHeaders(tempToken, cid, isClient),
    })
      .then((resp: any) => {
        if (resp) {
          setApprovalMsg("Invoice Recalculated successfully");
          setTimeout(() => {
            setApprovalMsg("");
          }, 3000);
        }
      })
      .catch((error: any) => {
        console.log(error);
        setReCalButtonDisable(false);
        setApprovalMsg("Invoice Recalculaton Failed");
        setTimeout(() => {
          setApprovalMsg("");
        }, 3000);
      });
    setReCalButtonDisable(true);
  };

  const handleMinDate = (dateType: string) => {
    const invDate = new Date(
      invoiceDate
        ? moment(invoiceDate).format("YYYY-MM-DD")
        : moment(topPanel.invoiceDate).format("YYYY-MM-DD")
    );

    const invAppDate = new Date(
      invoiceChanges
        ? moment(invoiceChanges).format("YYYY-MM-DD")
        : moment(topPanel.invoiceApproval).format("YYYY-MM-DD")
    );

    if (dateType === "approvalDate") {
      return invDate;
    }
    if (dateType === "paymentDate") {
      return missTransType === 1 ? invAppDate : invDate;
    }
  };

  const declineCheckboxDisable = () => {
    let isDisable = true;

    declineCheckboxLabel?.map((item: any) => {
      if (item?.isSelected === true && inputValue != "") {
        isDisable = false;
      }
    });
    return isDisable;
  };
  const openBal = topPanel.open != 'undefined' ? topPanel.open : 0;
  const TotalBal = topPanel.total != 'undefined' ? topPanel.total : 0;

  return (
    <div className="invoiceDetailsContainer">
      <div className="invoiceDetailsHeaderRow">
        {invoiceSaved === "Saved" && (
          <ToastNotification
            data-testid="toast-notify"
            showNotification
            toastMessage="Your record has been saved successfully..!"
            toastPosition="bottom-right"
          />
        )}
        <div className="breadcrumbs">
          <BreadCrumb
            hideHeaderTitle={hideTopCheck}
            hideHeaderTabs={hideTopCheck}
            steps={[
              {
                isActive: true,
                key: "Invoices",
                label: "Invoices",
                onClickLabel: () => {
                  setHideTopCheck(false);
                },
              },
              {
                key: "profile",
                label: getTransactionLabel(),
              },
            ]}
          />
        </div>
        <div className="buttons">
          {(status === "AR Review" ||
            (status === "Open" && missTransType !== 1)) &&
            (getPermissions(missTransType, "Delete") ||
              getPermissions(missTransType, "DeleteInvoice")) && (
              <div className="upper-delete-button">
                <div
                  className="delete-invoice"
                  onClick={() => setDeleteConfirmModalOpen(true)}
                >
                  <img src={deleteSvg} />
                  <h5>Delete Invoice</h5>
                </div>
              </div>
            )}

          {status === "Approved" && getPermissions(missTransType, "Void") && (
            <div className="void-button">
              <Button
                className="secondary-btn small"
                label="Void Invoice"
                handleOnClick={() => {
                  setIsVoidOpen(true);
                }}
              />
            </div>
          )}
          <div className="download-invoice-dropdown">
            {(permission?.InvoiceDetails.includes("Download") ||
              missTransType != 1) &&
              missTransType !== 7 && (
                <div
                  onClick={() =>
                    missTransType != 7
                      ? setIsDownloadOpen(!isDownloadOpen)
                      : function noRefCheck() { }
                  }
                  className={`${missTransType == 7 || deleteDisableButtons === true
                    ? "download_disable"
                    : "download"
                    }`}
                // className="download"
                >
                  <p className="text">Download</p>
                  <Icon
                    className="icon"
                    color="#526fd6"
                    icon="chevronDown"
                    size="medium"
                  />
                </div>
              )}

            {isDownloadOpen && (
              <div className="openDownloadDropdown">
                <p onClick={() => downloadFunction()}>Invoice as PDF</p>
                <p onClick={() => downloadExcelFunction()}>Invoice as Excel</p>
                {missTransType == 1 && (
                  <p onClick={() => downloadEmployeeBreakdownFunction()}>
                    Employee Breakdown
                  </p>
                )}
              </div>
            )}
          </div>

          {(status === "AR Review" || status === "Declined") &&
            missTransType == 1 &&
            getPermissions(1, "Edit") && (
              <div className="saveBtnContainer">
                <Button
                  disabled={reCalButtonDisable}
                  handleOnClick={() => {
                    reCalculate();
                  }}
                  className="secondary-btn small"
                  icon={{
                    color: "#526FD6",
                    icon: "autorenew",
                    size: "small",
                  }}
                  label="Re-Calculate"
                />
              </div>
            )}

          {(status === "AR Review" || status === "Open") &&
            getPermissions(missTransType, "Edit") && (
              <div className="saveBtnContainer">
                <Button
                  data-testid="save-button"
                  className="secondary-btn small"
                  label="Save"
                  disabled={saveButtonDisable}
                  handleOnClick={handleEditSave}
                />
              </div>
            )}

          {(status === "Approved" &&
            missTransType !== 4 &&
            missTransType !== 7 &&
            getPermissions(missTransType, "AddPayment")) ||
            (status === "Invoiced" &&
              missTransType === 7 &&
              getPermissions(missTransType, "AddPayment")) ? (
            <div className="addPaymentButton">
              <Button
                className="primary-blue medium"
                icon={{
                  color: "#fff",
                  icon: "add",
                  size: "medium",
                }}
                label="Add Payment"
                handleOnClick={() => {
                  const checkedInvoice = [
                    {
                      customerId: cid,
                      customerName:
                        topPanel.to || apiData?.data?.invoice?.customerName,
                      customerLocation:
                        topPanel.location ||
                        apiData?.data?.invoice?.customerLocation,
                      currencyId:
                        creditMemoData?.currencyId ||
                        apiData?.data?.invoice?.currencyId,
                      qbInvoiceNo:
                        creditMemoData?.qbInvoiceNo ||
                        apiData?.data?.invoice?.qbInvoiceNo,
                      invoiceNo:
                        creditMemoData?.invoiceNo ||
                        apiData?.data?.invoice?.invoiceNo,
                      status: 4,
                      statusLabel: "Approved",
                      transactionType: missTransType,
                      transactionTypeLabel: getTransactionLabelForPayment(),
                      createdDate: moment(topPanel.invoiceDate).format(
                        "DD/MMM/YYYY"
                      ),
                      paymentDate:
                        creditMemoData?.paymentDate ||
                        apiData?.data?.invoice?.paymentDate,
                      approvalDate:
                        creditMemoData?.approvalDate ||
                        apiData?.data?.invoice?.approvalDate,
                      submissionDate:
                        creditMemoData?.submissionDate ||
                        apiData?.data?.invoice?.submissionDate,
                      dueDate: moment(topPanel.paymentDue).format(
                        "DD/MMM/YYYY"
                      ),
                      exchangeRate:
                        creditMemoData?.exchangeRate ||
                        apiData?.data?.invoice?.exchangeRate,
                      totalAmount:
                        topPanel.total || apiData?.data?.invoice?.totalAmount,
                      invoiceBalance:
                        getBillingCurrency() + " " + topPanel.open ||
                        getBillingCurrency() +
                        " " +
                        apiData?.data?.invoice?.invoiceBalance,
                      invoiceFrom:
                        creditMemoData?.invoiceFrom ||
                        apiData?.data?.invoice?.invoiceFrom,
                      regionItemCode:
                        creditMemoData?.regionItemCode ||
                        apiData?.data?.regionItemCode,
                      isClientVisible:
                        creditMemoData?.isClientVisible ||
                        apiData?.data?.invoice?.isClientVisible,
                      depositTo:
                        creditMemoData?.depositTo ||
                        apiData?.data?.invoice?.depositTo,
                      createdBy:
                        creditMemoData?.createdBy ||
                        apiData?.data?.invoice?.createdBy,
                      modifiedBy:
                        creditMemoData?.modifiedBy ||
                        apiData?.data?.invoice?.modifiedBy,
                      eorSubscriptionId:
                        creditMemoData?.eorSubscriptionId ||
                        apiData?.data?.invoice?.eorSubscriptionId,
                      invoicerId:
                        creditMemoData?.invoicerId ||
                        apiData?.data?.invoice?.invoicerId,
                      bankingDetailId:
                        creditMemoData?.bankingDetailId ||
                        apiData?.data?.invoice?.bankingDetailId,
                      paymentMethod:
                        creditMemoData?.paymentMethod ||
                        apiData?.data?.invoice?.paymentMethod,
                      poNumber:
                        creditMemoData?.poNumber ||
                        apiData?.data?.invoice?.invoiceFrom,
                      ageingNotPaid:
                        creditMemoData?.ageingNotPaid ||
                        apiData?.data?.invoice?.ageingNotPaid,
                      ageingPaid:
                        creditMemoData?.ageingPaid ||
                        apiData?.data?.invoice?.ageingPaid,
                      invoiceDocuments:
                        creditMemoData?.invoiceDocuments ||
                        apiData?.data?.invoice?.invoiceDocuments,
                      invoiceItems:
                        creditMemoData?.invoiceItems ||
                        apiData?.data?.invoice?.invoiceItems,
                      invoiceNotes:
                        creditMemoData?.invoiceNotes ||
                        apiData?.data?.invoice?.invoiceNotes,
                      invoiceRelatedInvoices:
                        creditMemoData?.invoiceRelatedInvoices ||
                        apiData?.data?.invoice?.invoiceRelatedInvoices,
                      invoiceRelatedRelatedInvoices:
                        creditMemoData?.invoiceRelatedRelatedInvoices ||
                        apiData?.data?.invoice?.invoiceRelatedRelatedInvoices,
                      payrolls:
                        creditMemoData?.payrolls ||
                        apiData?.data?.invoice?.payrolls,
                      customer:
                        creditMemoData?.customer ||
                        apiData?.data?.invoice?.customer,
                      currency: {
                        code: "USD",
                        description: "US Dollar",
                        id: 840,
                      },
                      id: id,
                      exportToQB: {
                        value: "Not Exported",
                        color: "#767676",
                      },
                    },
                  ];
                  navigate(
                    "/pay/invoicedetails" +
                    id +
                    "/" +
                    cid +
                    "/" +
                    isClient +
                    "/payments",
                    {
                      state: {
                        InvoiceId:
                          apiData?.data?.invoice?.invoiceNo ||
                          creditMemoData.invoiceNo,
                        transactionType: missTransType,
                        inveoicesData: checkedInvoice,
                        checkPage: true,
                      },
                    }
                  );
                }}
              />
            </div>
          ) : (
            <></>
          )}

          {(status === "Pending Approval" ||
            (status === "AR Review" && missTransType !== 1)) &&
            getPermissions(missTransType, "Reject") && (
              <div className="decline-invoice">
                <Button
                  data-testid="decline-button"
                  disabled={deleteDisableButtons === true}
                  label="Decline Invoice"
                  className="secondary-btn small"
                  icon={{
                    icon: "remove",
                    size: "medium",
                    color: "#526FD6",
                  }}
                  handleOnClick={() => setIsOpen(true)}
                />
              </div>
            )}

          {(status === "AR Review" || status === "Declined") &&
            missTransType == 1 &&
            getPermissions(missTransType, "Send") && (
              <div className="submit_customer">
                <Button
                  className="primary-blue small"
                  label="Submit to Customer"
                  handleOnClick={() => {
                    handleApproveAR();
                  }}
                />
              </div>
            )}
          {(status === "Pending Approval" ||
            (status === "AR Review" && missTransType != 1)) &&
            getPermissions(missTransType, "Approve") && (
              <Button
                data-testid="approve-button"
                disabled={missTransType == 7 || deleteDisableButtons === true}
                handleOnClick={() => {
                  handleApproveInvoice(4);
                }}
                className="primary-blue small"
                icon={{
                  color: "#fff",
                  icon: "checkMark",
                  size: "medium",
                }}
                label="Approve Invoice"
              />
            )}

          {status === "Approved" &&
            missTransType === 3 &&
            getPermissions(2, "Add") && (
              <Button
                disabled={btnDis}
                data-testid="convert-button"
                label="Change to Miscellaneous"
                className="secondary-btn small change-miss"
                handleOnClick={() => {
                  migrationInvoice();
                }}
              />
            )}

          {(status === "Declined" || status === "Open") &&
            missTransType !== 1 &&
            permission?.InvoiceDetails.includes("Send") && (
              <Button
                data-testid="review-button"
                className="primary-blue small"
                icon={{
                  color: "#fff",
                  icon: "checkMark",
                  size: "medium",
                }}
                label="Send for Review"
                handleOnClick={() => {
                  handleApproveInvoice(2);
                }}
              />
            )}
        </div>
        {missTransType === 7 && (
          <div
            className={cn("cp-download", {
              "is-drop-open": isDropdownOpen,
              "is-drop-closed": !isDropdownOpen,
            })}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            onBlur={() => setIsDropdownOpen(false)}
          >
            <ButtonDropdown
              menuItems={{
                options: [
                  { value: "pdf", label: "Invoice as PDF" },
                  { value: "xlsx", label: "Invoice as Excel" },
                ],
                labelKeyName: "label",
              }}
              onChange={(selected: any) => console.log("selected", selected)}
            >
              Download
              <Icon
                color="#526FD6"
                className="chevron-down"
                icon="chevronDown"
                size="large"
                viewBox="-6 -3 24 13"
                width="34"
                height="34"
              />
              <Icon
                color="#526FD6"
                className="chevron-up"
                icon="chevronUp"
                size="large"
                viewBox="-6 -3 24 13"
                width="34"
                height="34"
              />
            </ButtonDropdown>
          </div>
        )}
      </div>

      <div className="payrollInvoiceInfo">
        <div className="topBar">
          <div className="invoic-status">
            <p className="status">{status}</p>
          </div>
          <div className="topBarrow">
            <div className="invoiceNo">
              <div className="qbo_wrapper">
                <Icon color="#FFFFFF" icon="orderSummary" size="large" />
                <p>{getTransactionLabel()}</p>
              </div>
              {creditMemoData != null && creditMemoData?.qbInvoiceNo != 0 && (
                <p className="qbo">QBO No. {creditMemoData?.qbInvoiceNo}</p>
              )}
            </div>
            <div className="amount">
              {missTransType != 7 && (
                <p>
                  Open{" "}
                  <span>
                    {getBillingCurrency()} {toCurrencyFormat(openBal)}
                  </span>
                </p>
              )}
              <p>
                Total{" "}
                <span>
                  {getBillingCurrency()} {toCurrencyFormat(TotalBal)}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="infoDetails">
          <div className="column1 divContainer">
            <p className="heading">From</p>
            <p className="value">{topPanel.from}</p>
          </div>
          <div className="divContainer">
            <p className="heading">To</p>
            <p className="value">{topPanel.to}</p>
            <p className="address">
              {addressData?.data?.billingAddress?.street}
            </p>
            <p className="address">{addressData?.data?.billingAddress?.city}</p>
            <p className="address">
              {addressData?.data?.billingAddress?.state}
            </p>
            <p className="address">
              {addressData?.data?.billingAddress?.country}
            </p>
            {missTransType != 7 && (
              <>
                <p>PO Number</p>
                {status === "AR Review" || status === "Open" ? (
                  <input
                    data-testid="PONUMBER"
                    onChange={(e: any) => {
                      setPoNumber(
                        Math.abs(parseInt(e.target.value)).toString()
                      );
                      setIsEditFieldsChanges(true);
                    }}
                    value={poNumber ? poNumber : topPanel.poNumber}
                    type="number"
                    className="poNoInput"
                  />
                ) : (
                  <p className="value">{topPanel.poNumber} </p>
                )}
              </>
            )}
          </div>
          <div className="divContainer">
            <p className="heading">Invoice Date</p>
            {status === "AR Review" || status === "Open" ? (
              <div className="dpContainer">
                <DatePicker
                  label="invoiceDate"
                  placeholderText={moment(topPanel.invoiceDate).format(
                    "DD/MMM/YYYY"
                  )}
                  handleDateChange={(date: any) => {
                    setInvoiceDate(date);
                    setIsEditFieldsChanges(true);
                  }}
                />
              </div>
            ) : (
              <p className="value">{topPanel.invoiceDate}</p>
            )}
            {missTransType == 7 && (
              <>
                <p className="heading">Due Date</p>
                <p className="value">{topPanel.paymentDue}</p>
              </>
            )}

            {missTransType != 7 && (
              <>
                {missTransType === 1 && (
                  <>
                    {status !== "Open" && (
                      <>
                        <p className="heading">Invoice Approval</p>
                        {status === "AR Review" || status === "Open" ? (
                          <div className="dpContainer dpMidMargin">
                            <DatePicker
                              minDate={handleMinDate("approvalDate")}
                              placeholderText={moment(
                                topPanel.invoiceApproval
                              ).format("DD/MMM/YYYY")}
                              handleDateChange={(date: any) => {
                                setInvoiceChanges(date);
                                setIsEditFieldsChanges(true);
                              }}
                            />
                          </div>
                        ) : (
                          <p className="value">{topPanel.invoiceApproval}</p>
                        )}

                        {isClient == "false" && (
                          <>
                            {status !== "Open" && (
                              <div className="autoapproveContainer">
                                <Checkbox
                                  onChange={(e: any) => {
                                    setIsAutoApprove(e.target.checked);
                                    axios({
                                      url: getAutoApproveCheckUrl(
                                        id,
                                        e.target.checked
                                      ),
                                      method: "POST",
                                      headers: getHeaders(
                                        tempToken,
                                        cid,
                                        isClient
                                      ),
                                    })
                                      .then((res: any) => {
                                        if (res.status === 200) {
                                          setShowAutoApprovedToast(true);
                                        }
                                      })
                                      .catch((err: any) => {
                                        setIsAutoApprove(!e.target.checked);
                                        console.log(err);
                                      });
                                  }}
                                  label="Auto-Approval after 24h"
                                  checked={isAutoApprove}
                                />
                              </div>
                            )}{" "}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}

                <p className="heading">Payment Due</p>
                {status === "AR Review" || status === "Open" ? (
                  <div className="dpContainer">
                    <DatePicker
                      minDate={handleMinDate("paymentDate")}
                      placeholderText={moment(topPanel.paymentDue).format(
                        "DD/MMM/YYYY"
                      )}
                      handleDateChange={(date: any) => {
                        setPaymentDue(date);
                        setIsEditFieldsChanges(true);
                      }}
                    />
                  </div>
                ) : (
                  <p className="value">{topPanel.paymentDue}</p>
                )}
              </>
            )}
          </div>
          <div className="lastCloumn divContainer">
            <p className="heading">Location</p>
            <p className="value">{topPanel.location}</p>
            <p className="heading">Region</p>
            <p className="value">{topPanel.region}</p>
            <p className="heading">Billing Currency</p>
            <p className="value">{getBillingCurrency()}</p>
          </div>
        </div>
      </div>

      {showAutoApprovedToast && (
        <div className="toast">
          {isAutoApprove === true
            ? "Invoice set to Auto-approve successfully"
            : "Auto-approval removed from Invoice successfully"}
          <span
            data-testid="toast-cross-button"
            className="toast-action"
            onClick={() => {
              setShowAutoApprovedToast(false);
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

      {(status === "Paid" || status === "Partial Paid") &&
        (missTransType === 1 || missTransType === 2 || missTransType === 3) ? (
        <div className="paymentCompnent">
          <PaymentDetailContainer
            setPaymentDetailData={setPaymentDetailData}
            status={status}
            cid={cid}
            lookupData={lookupData}
            paymentDetailData={paymentDetailData}
            getBillingCurrency={getBillingCurrency}
            id={id}
            topPanel={topPanel}
            setTopPanel={setTopPanel}
          />
        </div>
      ) : (
        <></>
      )}

      {(missTransType == 4 || missTransType == 3 || missTransType == 2) && (
        <CreditMemoSummary
          status={status}
          notes={notes}
          setNotes={setNotes}
          documents={documents}
          setDocuments={setDocuments}
          isClient={isClient}
          cid={cid}
          id={id}
          creditMemoData={creditMemoData}
          serviceCountries={lookupData?.data.serviceCountries}
          currency={getBillingCurrency()}
          vatValue={vatValue}
          setCreditMemoData={setCreditMemoData}
          isLogsOpen={isLogsOpen}
          changeLogs={changeLogs}
          setIsLogsOpen={setIsLogsOpen}
          dataAvailable={dataAvailable}
          logsData={logsData}
          viewLimit={viewLimit}
          setInitial={setInitial}
          setLimitFor={setLimitFor}
          setChangeLogs={setChangeLogs}
          setDataAvailable={setDataAvailable}
          initail={initail}
          limitFor={limitFor}
        ></CreditMemoSummary>
      )}

      {missTransType != 7 &&
        missTransType != 4 &&
        missTransType != 3 &&
        missTransType != 2 && (
          <div className="tab">
            <p
              onClick={() => setActiveTab("payroll")}
              className={
                activeTab === "payroll" ? "tabTextActive" : "tabTextPassive"
              }
            >
              Payroll Journal
            </p>
            <p
              onClick={() => setActiveTab("master")}
              className={
                activeTab === "master" ? "tabTextActive" : "tabTextPassive"
              }
            >
              Master Invoice
            </p>
            <p
              onClick={() => setActiveTab("files")}
              className={
                activeTab === "files" ? "tabTextActive" : "tabTextPassive"
              }
            >
              Files & Notes
            </p>
          </div>
        )}

      {activeTab === "master" &&
        missTransType != 4 &&
        missTransType != 3 &&
        missTransType != 7 &&
        missTransType != 2 && (
          <div className="master">
            <h3 className="tableHeader">Country Summary</h3>
            <Table
              options={{
                ...countrySummaryOptions,
                ...{ data: countrySummary },
              }}
              colSort
            />
            <div className="countrySummaryCalc">
              <p>Total Due</p>
              <h3>
                {getBillingCurrency()}{" "}
                {toCurrencyFormat(totalCountrySummaryDue)}
              </h3>
            </div>

            <h3 className="tableHeader">Fee Summary</h3>
            <Table
              options={{ ...feeSummaryOptions, ...{ data: feeSummary } }}
              colSort
            />
            <div className="feeSummaryCalc">
              <div className="rowFee">
                <p className="title">Incoming Wire Payment</p>
                <p className="amount">
                  {getBillingCurrency()} {toCurrencyFormat(incomingWirePayment)}
                </p>
              </div>
              <div className="row2">
                <p className="title">Contract Termination Fee</p>
                <p className="amount">
                  {getBillingCurrency()}{" "}
                  {toCurrencyFormat(contractTerminationFee)}
                </p>
              </div>
              <div className="totalRow">
                <p>Total Due</p>
                <h3>
                  {getBillingCurrency()} {toCurrencyFormat(feeSummaryTotalDue)}
                </h3>
              </div>
            </div>
          </div>
        )}
      {activeTab === "payroll" &&
        missTransType != 4 &&
        missTransType != 3 &&
        missTransType != 7 &&
        missTransType != 2 && (
          <div className="payroll">
            {payrollTables.map((item: any) => {
              return (
                <div>
                  <div className="countryHeader">
                    <GetFlag code={item.countryCode} />
                    <h3>{item.country}</h3>
                  </div>
                  <div>
                    <Table
                      options={{
                        ...payrollOptions,
                        ...{ data: item.data },
                      }}
                      colSort
                    />
                    <div className="feeSummaryCalc">
                      <div className="rowFee">
                        <p className="title">Country Subtotal Due</p>
                        <p className="amount">
                          {item.currencyCode +
                            " " +
                            toCurrencyFormat(item.feeSummary.subTotalDue)}
                        </p>
                      </div>
                      <div className="rowFee">
                        <p className="title">
                          Country EXC Rate {item.exchangeRate}
                        </p>
                        <p className="amount">
                          {getBillingCurrency() +
                            " " +
                            toCurrencyFormat(
                              item.feeSummary.subTotalDue * item.exchangeRate
                            )}
                        </p>
                      </div>
                      <div className="rowFee">
                        <p className="title">In Country Processing Fee</p>
                        <p className="amount">
                          {getBillingCurrency() +
                            " " +
                            toCurrencyFormat(
                              item.feeSummary.inCountryProcessingFee
                            )}
                        </p>
                      </div>
                      <div className="rowFee">
                        <p className="title">FX Bill</p>
                        <p className="amount">
                          {getBillingCurrency() +
                            " " +
                            toCurrencyFormat(item.feeSummary.fxBill)}
                        </p>
                      </div>
                      <div className="row2">
                        <p className="title">Total Country VAT</p>
                        <p className="amount">
                          {getBillingCurrency() +
                            " " +
                            toCurrencyFormat(item.feeSummary.totalCountryVat)}
                        </p>
                      </div>
                      <div className="totalRow">
                        <p>Country Total Due</p>
                        <h3>
                          {getBillingCurrency() +
                            " " +
                            toCurrencyFormat(item.countryTotalDue)}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="totalContainer">
              <div>
                <p>Total</p>
                <h3>
                  {getBillingCurrency()} {toCurrencyFormat(total)}
                </h3>
              </div>
            </div>
          </div>
        )}
      {activeTab === "files" &&
        missTransType != 4 &&
        missTransType != 3 &&
        missTransType != 7 &&
        missTransType != 2 && (
          <>
            <div className="filesNotes">
              <NotesWidget
                status={status}
                notes={notes}
                setNotes={setNotes}
                isClient={isClient}
                cid={cid}
                id={id}
                transactionType={missTransType}
              ></NotesWidget>

              <FileUploadWidget
                status={status}
                documents={documents}
                setDocuments={setDocuments}
                isClient={isClient}
                cid={cid}
                id={id}
                transactionType={missTransType}
              ></FileUploadWidget>
            </div>
            <LogsCompo
              isLogsOpen={isLogsOpen}
              changeLogs={changeLogs}
              setIsLogsOpen={setIsLogsOpen}
              dataAvailable={dataAvailable}
              logsData={logsData}
              viewLimit={viewLimit}
              setInitial={setInitial}
              setLimitFor={setLimitFor}
              setChangeLogs={setChangeLogs}
              setDataAvailable={setDataAvailable}
              initail={initail}
              limitFor={limitFor}
            ></LogsCompo>
          </>
        )}
      {missTransType == 7 && (
        <BillsTable
          currency={getBillingCurrency()}
          tableData={billTableData?.data}
          customerId={cid}
          billStatus={status}
          invoiceId={state.InvoiceId}
          navigate={navigate}
          totalAmount={apiData?.data?.invoice?.totalAmount}
          state={state}
        ></BillsTable>
      )}

      {approvalMsg && <p className="approvalMsg">{approvalMsg}</p>}

      <div className="decline-modal">
        <Modal
          isOpen={isOpen}
          handleClose={() => {
            setIsOpen(false);
            setInputValue("");
          }}
        >
          <div>
            <h3>Add A Reason</h3>
            <div className="text-line">
              <p>Please add a comment to indicate your reasons to decline</p>
            </div>
            <div className="text-invoive-no">
              <p>{getTransactionLabel()}.</p>
            </div>

            <div className="dec_check_main">
              {declineCheckboxLabel &&
                declineCheckboxLabel?.map((item: any, index: any) => {
                  return (
                    <div className="dec_check_wrapp">
                      <Checkbox
                        data-testid="check1"
                        id="sampleCheckbox"
                        disabled={
                          declineCheckboxLabel[index].isDisable === true
                        }
                        onChange={(e: any) => {
                          const declineData = [...declineCheckboxLabel];
                          declineData[index].isSelected = e.target.checked;
                          declineData.map((i, k) => {
                            if (i.label != item.label) {
                              declineData[k].isDisable = e.target.checked;
                            }
                          });
                          setDeclineCheckboxLabel(declineData);
                        }}
                        checked={declineCheckboxLabel[index].isSelected}
                      />
                      <label className="dec_check_label">{item.label}</label>
                    </div>
                  );
                })}
            </div>

            <div className="text-invoice-comment">
              <label>
                Comment<span className="comment">*</span>
              </label>
              <textarea
                value={inputValue}
                className="textarea-box"
                placeholder="Please Enter a Reason"
                rows={2}
                cols={50}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            <div className="decline-modal-button">
              <Button
                data-testid="decline-cancel-button"
                label="Cancel"
                className="secondary-btn medium cancel-button"
                handleOnClick={() => {
                  setIsOpen(false);
                  setInputValue("");
                }}
              />
              <Button
                data-testid="decline-button-submit"
                disabled={declineCheckboxDisable()}
                label="Decline Invoice"
                className="primary-blue medium decline-button"
                handleOnClick={() => {
                  let currDate = new Date();
                  axios({
                    method: "POST",
                    url: urls.declineInvoice,
                    headers: getHeaders(tempToken, cid, isClient),
                    data: {
                      invoiceId: id,
                      noteType: "1",
                      note: inputValue,
                      createdDate: currDate,
                      customerId: cid,
                    },
                  })
                    .then((res: any) => {
                      if (res.status == 200) {
                        lookupData.data.invoiceStatuses.forEach((e: any) => {
                          if (e.value === res.data.status) {
                            setStatus(
                              e.text === "In Review" ? "AR Review" : e.text
                            );
                          }
                        });
                        setInputValue("");
                        setIsOpen(false);
                        setDeleteDisableButtons(true);
                      }
                    })
                    .catch((e: any) => {
                      console.log(e);
                      setInputValue("");
                      setIsOpen(false);
                    });
                }}
              />
            </div>
          </div>
        </Modal>
      </div>

      <div className="void-modal">
        <Modal
          isOpen={isVoidOpen}
          handleClose={() => {
            setIsVoidOpen(false);
            setInputVoidValue("");
            setVoidFileData({});
          }}
        >
          <div>
            <h3>Void Invoice</h3>
            <h6>Enter Note</h6>

            <div>
              <textarea
                value={inputVoidValue}
                className="textarea-box"
                placeholder="Enter note here"
                rows={2}
                cols={50}
                onChange={(e) => setInputVoidValue(e.target.value)}
              />
            </div>

            <div className="attachment-container">
              <input
                data-testid="attachmenttestId"
                type="file"
                id="attachmentId"
                style={{ display: "none" }}
                onChange={(e: any) => setVoidFileData(e.target.files["0"])}
              />
              <label htmlFor="attachmentId" className="attachment">
                <Icon icon="attachment" size="large" color="#526fd6" />
                <h4>Add Attachment</h4>
              </label>
              <p>{voidFileData?.name}</p>
            </div>

            <div className="void-button">
              <Button
                data-testid="void-button-id"
                className="primary-blue small"
                label="Void"
                disabled={!inputVoidValue}
                handleOnClick={() => {
                  setIsVoidConfirmOptionOpen(true);
                  setIsVoidOpen(false);
                }}
              />
            </div>
          </div>
        </Modal>
      </div>

      <div className="void-confirm-modal">
        <Modal isOpen={isVoidConfirmOptionOpen}>
          <div>
            <h4>Are you sure you want to void this invoice?</h4>

            <div className="void-confirm-button">
              <Button
                data-testid="Void-button-Cancel"
                label="Cancel"
                className="secondary-btn medium"
                handleOnClick={() => {
                  setIsVoidConfirmOptionOpen(false);
                  setVoidFileData({});
                  setInputVoidValue("");
                }}
              />
              <Button
                data-testid="Void-button-submit"
                label="Void"
                className="primary-blue medium decline-button"
                handleOnClick={() => handleVoid()}
              />
            </div>
          </div>
        </Modal>
      </div>

      <div className="delete-confirm-modal">
        <Modal isOpen={deleteConfirmModalOpen}>
          <div>
            <h4>Are you sure you want to Delete this invoice permanently?</h4>

            <div className="delete-confirm-button">
              <Button
                data-testid="delete-button-Cancel"
                label="Cancel"
                className="secondary-btn medium"
                handleOnClick={() => {
                  setDeleteConfirmModalOpen(false);
                }}
              />
              <Button
                data-testid="delete-button-submit"
                label={deleteFun()}
                className="primary-blue medium delete-button"
                handleOnClick={() => handleDeleteInvoice()}
              />
            </div>
          </div>
        </Modal>
      </div>

      {/* istanbul ignore next */}
      <div className="compensation-full-container">
        <Modal
          isOpen={isCompensatioModalOpen.modalOpen}
          handleClose={() => {
            setIsCompensatioModalOpen({
              ...isCompensatioModalOpen,
              modalOpen: false,
            });
          }}
        >
          <div className="compensation-inner-container">
            <Cards className={`profile-header-container`}>
              <div className="section-1">
                <div className="img-container">
                  <AvatarHandler
                    // handleClick={handleAvatarClick}
                    // initials={user.initials}
                    source={
                      isCompensatioModalOpen?.data?.personalDetails?.photoUrl
                        ? isCompensatioModalOpen?.data?.personalDetails
                          ?.photoUrl
                        : avatar
                    }
                    style={{
                      "background-color": "#FFFFF",
                    }}
                  />
                </div>
                <div className="col-6">
                  <div className="header">
                    {isCompensatioModalOpen?.data?.fullName}
                  </div>
                  <div className="sub-header">
                    {isCompensatioModalOpen?.data?.jobTitle}
                  </div>
                </div>
                <div className="col-3 info-text-container">
                  <div className="info-text" id="work-phone">
                    <Icon color="#fff" icon="mobile" size="large" />
                    &nbsp;
                    <span>
                      {isCompensatioModalOpen?.data?.phone?.countryCode}
                      {isCompensatioModalOpen?.data?.phone?.number}
                    </span>
                  </div>
                  <div className="info-text">
                    <Icon color="#E0E5F8" icon="email" size="large" />
                    &nbsp;
                    <span>{isCompensatioModalOpen?.data?.email}</span>
                  </div>
                </div>
              </div>
              <div className="section-2">
                <div className="col-3"></div>
                <div className="col-6 misc-info">
                  <div className="col-6">
                    <div className="misc-info__item">
                      <Icon color="#767676" icon="pound" size="medium" />
                      &nbsp;
                      <span>C928422111</span>
                    </div>
                    <div className="misc-info__item">
                      <Icon color="#767676" icon="calendar" size="medium" />
                      &nbsp;
                      <span>
                        {"Effective Start Date: "}
                        {isCompensatioModalOpen &&
                          isCompensatioModalOpen.data &&
                          isCompensatioModalOpen?.data?.startDate
                          ? moment(
                            isCompensatioModalOpen?.data?.startDate
                          ).format("D MMM YYYY")
                          : ""}
                      </span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="misc-info__item misc-info__item__2">
                      <Icon color="#767676" icon="location" size="medium" />
                      &nbsp;
                      <span>{isCompensatioModalOpen?.data?.location}</span>
                    </div>
                  </div>
                  <div className="col-4"></div>
                </div>
                <div className="compensation-invoice-status">
                  <p>Active</p>
                </div>
              </div>
            </Cards>
            <div className="compensation-text">Compensation</div>
            <div className="compensation-table">
              <Table options={compensationTableOptions} colSort />
            </div>
          </div>
        </Modal>
      </div>

      <div className="delete-employee-modal">
        <Modal
          isOpen={deleteEmployeeModalOpen.isModalOpen}
          handleClose={() => {
            setDeleteEmployeeModalOpen({
              ...deleteEmployeeModalOpen,
              isModalOpen: false,
            });
          }}
        >
          <div className="delete-employee-inner-container">
            <h1>Are you sure you want to delete this employee?</h1>
            <div className="delete-emplyee-buttons">
              <Button
                data-testid="delete-button-Cancel"
                label="Cancel"
                className="secondary-btn medium"
                handleOnClick={() => {
                  setDeleteEmployeeModalOpen({
                    ...deleteEmployeeModalOpen,
                    isModalOpen: false,
                  });
                }}
              />
              <Button
                data-testid="delete-button-submit"
                label="Delete Employee"
                className="primary-blue medium employee-button"
                handleOnClick={() => deleteEmployee()}
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
