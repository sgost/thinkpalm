import React, { useEffect, useState } from "react";
import {
  Button,
  Icon,
  Table,
  FileHandler,
  FileUpload,
  NoDataCard,
  BreadCrumb,
  Checkbox,
  Modal,
} from "atlasuikit";
import "./invoiceDetails.scss";
import { apiInvoiceMockData } from "./mockData";

import moment from "moment";
import GetFlag, { getFlagPath } from "./getFlag";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import avatar from "./avatar.png";
import { Scrollbars } from "react-custom-scrollbars";
import BillsTable, { getFlagURL } from "../BillsTable";
import deleteSvg from '../../../assets/icons/deletesvg.svg'

export default function InvoiceDetails() {
  const { state }: any = useLocation();
  // const state = "";
  const [activeTab, setActiveTab] = useState("payroll");
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isVoidOpen, setIsVoidOpen] = useState(false);
  const [isVoidConfirmOptionOpen, setIsVoidConfirmOptionOpen] = useState(false);
  const { id, cid, isClient } = useParams();

  const baseBillApi =
    "https://apigw-dev-eu.atlasbyelements.com/billingservice/api/billing/bill/GetBillDetailsPerInvoice/";
  const api =
    "https://apigw-dev-eu.atlasbyelements.com/atlas-idg-service/api/InvoiceData/GetPayrollForInvoice/" +
    id;
  const addressApi = `https://apigw-uat-emea.apnextgen.com/customerservice/api/Customers/${cid}?includes=BillingAddress`;

  const countriesApi =
    "https://apigw-uat-emea.apnextgen.com/metadataservice/api/lookup/Countries?includeProperties=Currency&orderBy=Name";

  const feeApi =
    "https://apigw-uat-emea.apnextgen.com/metadataservice/api/Fees";

  const lookupApi =
    "https://apigw-uat-emea.apnextgen.com/metadataservice/api/Lookup";

  const notesApi = `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/InvoiceNote/notes/${id}`;

  const tempToken = localStorage.getItem("temptoken");

  const [apiData, setApiData] = useState<any>(null);
  const [billTableData, setBillTableData] = useState<any>(null);
  const [addressData, setAddressData] = useState<any>(null);
  const [countriesData, setCountriesData] = useState<any>(null);
  const [feeData, setFeeData] = useState<any>(null);
  const [lookupData, setLookupData] = useState<any>(null);
  const [documents, setDocuments] = useState<any>([]);
  const [hideTopCheck, setHideTopCheck] = useState(true);
  const [payrollTables, setPayrollTables] = useState<any>([]);

  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("");
  const [voidFileData, setVoidFileData] = useState<any>({});
  const [isErr, setIsErr] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputVoidValue, setInputVoidValue] = useState("");
  const [approvalMsg, setApprovalMsg] = useState("");
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState<any>([]);
  const [isFileError, setIsFileError] = useState<any>(null);
  const [transactionType, setTransactionType] = useState();
  const [isVisibleToCustomer, setIsVisibleToCustomer] = useState(false);
  const [deleteDisableButtons, setDeleteDisableButtons] = useState(false);
  const [isExportToQb, setIsExportToQb] = useState(false);
  const [isVisibleOnPDFInvoice, setisVisibleOnPDFInvoice] = useState(false);
  const [countrySummary, setCountrySummary] = useState<any>([]);
  const [totalCountrySummaryDue, settotalCountrySummaryDue] = useState(0);
  const [feeSummary, setFeeSummary] = useState<any>([]);
  const [contractTerminationFee, setContractTerminationFee] = useState(0);
  const [incomingWirePayment, setIncomingWirePayment] = useState(0);
  const [feeSummaryTotalDue, setFeeSummaryTotalDue] = useState(0);

  const navigate = useNavigate();
  useEffect(() => {
    if (!hideTopCheck) {
      navigate("/pay");
    }
  }, [hideTopCheck]);

  useEffect(() => {
    const headers = {
      headers: {
        authorization: `Bearer ${tempToken}`,
        "x-apng-base-region": "EMEA",
        "x-apng-customer-id": cid || "",
        "x-apng-external": "false",
        "x-apng-inter-region": "0",
        "x-apng-target-region": "EMEA",
        customer_id: cid || "",
      },
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

        if(state.transactionType != 7){
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

            //Mock Data used for id "fb706b8f-a622-43a1-a240-8c077e519d71"
            if (res.data.id == "fb706b8f-a622-43a1-a240-8c077e519d71") {
              res.data = apiInvoiceMockData;
            }

            res.data?.countryPayroll.forEach((e: any) => {
              let country = e.countryName;
              let countryCode = e.countryCode;
              let currencyCode = e.currencyCode;
              let arr: any = [];

              e.payrollItems.forEach((item: any) => {
                arr.push({
                  employeeID: item.employeeId,
                  name: {
                    value: item.firstName + " " + item.lastName,
                    // img: { src: item.employeeProfilePicture },

                    img: { src: avatar },
                    style: { borderRadius: 12 },
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
                });
              });

              tempTotal += e.feeSummary.total;

              data.push({
                country,
                countryCode,
                exchangeRate: e.exchangeRate,
                currencyCode: e.currencyCode,
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
            setTransactionType(res.data.invoice.transactionType);
            setCountrySummary(countrySummaryTemp);
            let totalCountrySummaryDueTemp = countrySumTotalArrTemp.reduce(
              (a: any, b: any) => a + (b || 0),
              0
            );
            settotalCountrySummaryDue(totalCountrySummaryDueTemp);
            setFeeSummary(feeSummaryTemp);
          })
          .catch((e: any) => {
            console.log("error e", e);
            setIsErr(true);
          });
        }else{
          let res : any = {
            data: apiInvoiceMockData
          };
          setTimeout(()=>{
            setApiData(res);
            setTransactionType(res.data.invoice.transactionType);
          }, 8000);
          

        }
      })
      .catch((e: any) => {
        console.log("error", e);
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

    let URL = baseBillApi + state.InvoiceId;
    axios
      .get(URL, { headers: { accept: "text/plain" } })
      .then((response: any) => {
        if (response.status == 200) {
          setBillTableData(response);
        } else {
          console.log("Bill API failing on contractor service");
        }
      })
      .catch((e: any) => {
        console.log("error", e);
      });

    axios
      .get(notesApi, headers)
      .then((res: any) => {
        if (isClient == "true") {
          setNotes(res.data.reverse().filter((e: any) => e.isCustomerVisible));
        } else {
          setNotes(res.data.reverse());
        }
      })
      .catch((e: any) => {
        console.log("error e", e);
      });
  }, []);

  useEffect(() => {
    if (lookupData?.data && apiData?.data) {
      lookupData.data.invoiceStatuses.forEach((e: any) => {
        if (e.value === apiData.data.invoice.status) {
          setStatus(e.text);
        }
      });
    }
  }, [lookupData, apiData]);

  useEffect(() => {
    if (apiData?.data && feeData?.data) {
      const additionalFee = feeData.data.find((x: any) => x.type === 5);

      const terminationFeeTemp = apiData.data.payrollFees.find(
        (x: any) => x.feeId === additionalFee.id
      );

      setContractTerminationFee(terminationFeeTemp?.amount);

      const incomingFee = feeData.data.find((x: any) => x.type === 1);

      const incomingWirePaymentTemp = apiData.data.payrollFees.find(
        (x: any) => x.feeId === incomingFee.id
      );
      setIncomingWirePayment(incomingWirePaymentTemp?.amount);

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

  // useEffect(() => {
  //   console.log("pay", payrollTables);

  //   if (countriesData?.data && payrollTables.length) {
  //     let arr: any = [];
  //     console.log("pay", payrollTables);

  //     payrollTables.forEach

  //     payrollTables.data.forEach((e: any) => {
  //       arr.push({
  //         ...e,
  //         adminFees: getBillingCurrency() + e.adminFees,
  //         healthcareBenefits: getBillingCurrency() + e.healthcareBenefits,
  //       });
  //     });
  //     setPayrollTables({ ...payrollTables, data: arr });
  //   }
  // }, [countriesData, payrollTables]);

  const getBillingCurrency = () => {
    if (countriesData?.data && apiData?.data) {
      let currency = countriesData.data.find(
        (e: any) => e.currencyId === apiData.data.invoice.currencyId
      );

      // console.log("currency", currency);

      return currency.currency.code;
    } else {
      return "";
    }
  };

  const sharedColumns = {
    grossWages: {
      header: "Gross Wages",
      isDefault: true,
      key: "grossWages",
    },
    allowances: {
      header: "Allowances",
      isDefault: true,
      key: "allowances",
    },
    expenseReimb: {
      header: "Expense Reimb.",
      isDefault: true,
      key: "expenseReimb",
    },
    employerLiability: {
      header: "Employer Liability",
      isDefault: true,
      key: "employerLiability",
    },

    countryVAT: {
      header: "Country VAT",
      isDefault: true,
      key: "countryVAT",
    },

    adminFees: {
      header: "Admin Fees",
      isDefault: true,
      key: "adminFees",
    },

    country: {
      header: "Country",
      isDefault: true,
      key: "country",
    },
    currency: {
      header: "Currency",
      isDefault: true,
      key: "currency",
    },
    total: {
      header: "Total in " + getBillingCurrency(),
      isDefault: true,
      key: "total",
    },
  };

  const payrollOptions: any = {
    columns: [
      {
        header: "Employee ID",
        isDefault: true,
        key: "employeeID",
      },
      {
        header: "Name",
        isDefault: true,
        key: "name",
      },
      sharedColumns.grossWages,
      sharedColumns.allowances,
      sharedColumns.expenseReimb,
      sharedColumns.employerLiability,
      sharedColumns.countryVAT,
      sharedColumns.adminFees,
      {
        header: "Healthcare Benefits",
        isDefault: true,
        key: "healthcareBenefits",
      },
    ],
    showDefaultColumn: true,
  };

  const countrySummaryOptions: any = {
    columns: [
      {
        header: "Country",
        isDefault: true,
        key: "country",
      },
      {
        header: "Currency",
        isDefault: true,
        key: "currency",
      },
      {
        header: "Employees",
        isDefault: true,
        key: "employees",
      },
      sharedColumns.grossWages,
      sharedColumns.allowances,
      sharedColumns.expenseReimb,
      sharedColumns.employerLiability,
      sharedColumns.countryVAT,
      {
        header: "Exchange Rate",
        isDefault: true,
        key: "exchangeRate",
      },
      sharedColumns.total,
    ],
    showDefaultColumn: true,
  };

  const feeSummaryOptions: any = {
    columns: [
      sharedColumns.country,
      sharedColumns.currency,
      sharedColumns.adminFees,
      {
        header: "On/Offboardings",
        isDefault: true,
        key: "OnOffboardings",
      },
      {
        header: "FX Rate in %",
        isDefault: true,
        key: "fxRate",
      },
      {
        header: "FX Bill",
        isDefault: true,
        key: "fxBill",
      },
      {
        header: "Benefits",
        isDefault: true,
        key: "benefits",
      },
      {
        header: "Employee Contribution",
        isDefault: true,
        key: "employeeContribution",
      },
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

  const getInCountryProcessingFee = () => {
    feeData.data.forEach((e: any) => {
      if (e.name === "In Country Processing Fee") {
        return e.payrollFees || 0;
      }
    });

    return 0;
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

    const downloadApi = `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/generatePDF/${id}`;
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

  const handleApproveInvoice = () => {
    // const headers = {
    //   headers: {
    //     authorization: `Bearer ${tempToken}`,
    //     "x-apng-base-region": "EMEA",
    //     "x-apng-customer-id": cid?.toString() || "",
    //     "x-apng-external": "false",
    //     "x-apng-inter-region": "0",
    //     "x-apng-target-region": "EMEA",
    //     customer_id: cid?.toString() || "",
    //   },
    // };

    const approveApi = `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/${id}/4`;

    axios({
      method: "PUT",
      url: approveApi,
      headers: {
        authorization: `Bearer ${tempToken}`,
        "x-apng-base-region": "EMEA",
        "x-apng-customer-id": cid?.toString() || "",
        "x-apng-external": "false",
        "x-apng-inter-region": "0",
        "x-apng-target-region": "EMEA",
        customer_id: cid?.toString() || "",
      },
    })
      .then((res: any) => {
        if (res.status === 201) {
          setStatus("Approved");
          setApprovalMsg("Invoice approve successfully");
          setTimeout(() => {
            setApprovalMsg("");
          }, 3000);
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

    // axios
    //   .put(approveApi, headers)
    //   .then((res: any) => {
    //     console.log(res);
    //     if (res.status === 201) {
    //       setStatus("Approved");
    //       setApprovalMsg("Invoice approve successfully");
    //       setTimeout(() => {
    //         setApprovalMsg("");
    //       }, 3000);
    //     } else {
    //       setApprovalMsg("Invoice approve failed");
    //     }
    //   })
    //   .catch((e: any) => {
    //     console.log("error", e);
    //     setApprovalMsg("Invoice approve failed");
    //     setTimeout(() => {
    //       setApprovalMsg("");
    //     }, 3000);
    //   });
  };

  const handleApproveAR = () => {
    const approveARApi =
      "https://apigw-dev-eu.atlasbyelements.com/atlas-invoiceservice/api/Invoices/Reviewed";

    axios({
      method: "PUT",
      url: approveARApi,
      headers: {
        authorization: `Bearer ${tempToken}`,
        "x-apng-base-region": "EMEA",
        "x-apng-customer-id": cid?.toString() || "",
        "x-apng-external": "false",
        "x-apng-inter-region": "0",
        "x-apng-target-region": "EMEA",
        customer_id: cid?.toString() || "",
      },
      data: [
        {
          InvoiceNo: apiData?.data?.invoice?.invoiceNo,
          TransactionType: apiData?.data?.invoice?.transactionType,
        },
      ],
    })
      .then((res: any) => {
        setStatus("Pending Approval");
      })
      .catch((e: any) => {
        console.log("error", e);
      });
  };

  const downloadExcelFunction = () => {
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

    const downloadApi = `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/generateExcel/${id}`;
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

  const handleVoid = async () => {
    const headers = {
      authorization: `Bearer ${tempToken}`,
      "x-apng-base-region": "EMEA",
      "x-apng-customer-id": cid || "",
      "x-apng-external": "false",
      "x-apng-inter-region": "0",
      "x-apng-target-region": "EMEA",
      customer_id: cid || "",
    };

    var formData = new FormData();
    formData.append("asset", voidFileData);
    await axios
      .post(
        "https://apigw-uat-emea.apnextgen.com/metadataservice/api/Blob/UploadFile",
        formData,
        {
          headers: headers,
        }
      )
      .then(async (res: any) => {
        await axios
          .post(
            "https://apigw-uat-emea.apnextgen.com/invoiceservice/api/InvoiceDocument/Create",
            {
              invoiceId: id,

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
            //  setDocuments([
            //     ...documents,
            //     {
            //       documentId: response.data.documentId,
            //       document: {
            //         documentName: res.data.fileName,
            //         url: res.data.url,
            //       },
            //     },
            //   ]);
          })
          .catch((e: any) => {
            console.log(e);
          });
      })
      .catch((e: any) => {
        console.log(e);
        setIsFileError(true);
      });

    let currDate = new Date();

    await axios
      .post(
        `https://apigw-dev-eu.atlasbyelements.com/atlas-invoiceservice/api/Invoices/voidInvoice`,
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
              setStatus(e.text);
            }
          });
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

  const handleDeleteInvoice = () => {
    const headers = {
      headers: {
        authorization: `Bearer ${tempToken}`,
        "x-apng-base-region": "EMEA",
        "x-apng-customer-id": cid || "",
        "x-apng-external": "false",
        "x-apng-inter-region": "0",
        "x-apng-target-region": "EMEA",
        customer_id: cid || "",
      },
    };
    const deleteApi = `https://apigw-dev-eu.atlasbyelements.com/atlas-invoiceservice/api/Invoices/${apiData?.data?.invoice?.id}`

    axios
      .delete(deleteApi, headers)
      .then((res: any) => {
        console.log('ress', res)
        if (res.data === true) {
          navigate("/pay")
        }
        if (res.data === false) {
          console.log("Invoice not deleted")
        }
      })
      .catch((e: any) => {
        console.log("error", e);
      });
  }

  if (!apiData?.data && !isErr) {
    return <p>Loading...</p>;
  }
  if (isErr) {
    return <p>Something went wrong!</p>;
  }

  return (
    <div className="invoiceDetailsContainer">
      <div className="invoiceDetailsHeaderRow">
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
                label:
                  transactionType == 7
                    ? "Contractor Invoice No. " +
                    apiData?.data?.invoice?.invoiceNo
                    : "Payroll Invoice No. " +
                    apiData?.data?.invoice?.invoiceNo,
              },
            ]}
          />
        </div>
        <div className="buttons">
          <div className="delete-button">
            {isClient == "false" && status === "In Review" && (
              <div className="delete-invoice"
                onClick={() => handleDeleteInvoice()}
              >
                <img src={deleteSvg} />
                <h5>Delete Invoice</h5>
              </div>
            )}
          </div>
          <div className="void-button">
            {isClient == "false" && status === "Approved" && (
              <Button
                className="secondary-btn small"
                label="Void Invoice"
                handleOnClick={() => {
                  setIsVoidOpen(true);
                }}
              />
            )}
          </div>
          <div
            onClick={() =>
              transactionType != 7
                ? setIsDownloadOpen(!isDownloadOpen)
                : function noRefCheck() { }
            }
            className={`${transactionType == 7 || deleteDisableButtons === true
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

          {isDownloadOpen && (
            <div className="openDownloadDropdown">
              <p onClick={() => downloadFunction()}>Invoice as PDF</p>
              <p onClick={() => downloadExcelFunction()}>Invoice as Excel</p>
              <p>Employee Breakdown</p>
            </div>
          )}

          <div className="decline-invoice">
            {isClient == "true" && status === "Pending Approval" && (
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
            )}
          </div>

          <div>
            {isClient == "false" && status === "In Review" && (
              <Button
                className="primary-blue small"
                icon={{
                  color: "#fff",
                  icon: "checkMark",
                  size: "medium",
                }}
                label="Submit to Customer"
                handleOnClick={() => {
                  handleApproveAR();
                }}
              />
            )}
            {isClient == "true" && status === "Pending Approval" && (
              <Button
                disabled={transactionType == 7 || deleteDisableButtons === true}
                handleOnClick={() => {
                  handleApproveInvoice();
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
          </div>
        </div>
      </div>

      <div className="payrollInvoiceInfo">
        <div className="topBar">
          <div className="invoic-status">
            <p className="status">
              {status === "In Review" ? "AR Review" : status}
            </p>
          </div>
          <div className="topBarrow">
            <div className="invoiceNo">
              <Icon color="#FFFFFF" icon="orderSummary" size="large" />
              {transactionType != 7 ? (
                <p>Payroll Invoice No. {apiData?.data?.invoice?.invoiceNo}</p>
              ) : (
                <p>
                  Contractor Invoice No. {apiData?.data?.invoice?.invoiceNo}
                </p>
              )}
            </div>
            <div className="amount">
              {transactionType != 7 && (
                <p>
                  Open{" "}
                  <span>
                    {getBillingCurrency()}{" "}
                    {
                      toCurrencyFormat(apiData?.data?.invoice?.invoiceBalance)

                      // Intl.NumberFormat().format(
                      //   apiData?.data?.invoice?.invoiceBalance.toLocaleString('en-US')
                      // )

                      // apiData?.data?.invoice?.invoiceBalance
                      //   .toFixed(2)
                      //   .replace(/\d(?=(\d{3})+\.)/g, "$&,")
                    }
                  </span>
                </p>
              )}
              <p>
                Total{" "}
                <span>
                  {getBillingCurrency()}{" "}
                  {
                    toCurrencyFormat(apiData?.data?.invoice?.totalAmount)

                    // apiData?.data?.invoice?.totalAmount
                    //   .toFixed(2)
                    //   .replace(/\d(?=(\d{3})+\.)/g, "$&,")
                  }
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="infoDetails">
          <div className="column1">
            <p className="heading">From</p>
            <p className="value">{apiData?.data?.invoiceFrom?.companyName}</p>
          </div>
          <div>
            <p className="heading">To</p>
            <p className="value">{apiData?.data?.invoice?.customerName}</p>
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
            {transactionType != 7 && (
              <>
                <p>PO Number</p>
                <p className="poNo">{apiData?.data?.invoice?.poNumber}</p>
              </>
            )}
          </div>
          <div>
            <p className="heading">Invoice Date</p>
            <p className="value">
              {moment(apiData?.data?.invoice?.createdDate).format(
                "DD MMM YYYY"
              )}
            </p>
            {transactionType != 7 && (
              <>
                <p className="heading">Invoice Changes</p>
                <p className="value">
                  {moment(apiData?.data?.invoice?.createdDate).format(
                    "DD MMM YYYY"
                  )}
                </p>
                <p className="heading">Payment Due</p>
                <p className="value">
                  {moment(apiData?.data?.invoice?.dueDate).format(
                    "DD MMM YYYY"
                  )}
                </p>
              </>
            )}
          </div>
          <div className="lastCloumn">
            <p className="heading">Location</p>
            <p className="value">{apiData?.data?.invoice?.customerLocation}</p>
            <p className="heading">Region</p>
            <p className="value">
              {apiData?.data?.regionItemCode?.toUpperCase()}
            </p>
            <p className="heading">Billing Currency</p>
            <p className="value">{getBillingCurrency()}</p>
          </div>
        </div>
      </div>

      {transactionType != 7 && (
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

      {activeTab === "master" && transactionType != 7 && (
        <div className="master">
          <h3 className="tableHeader">Country Summary</h3>
          <Table
            options={{ ...countrySummaryOptions, ...{ data: countrySummary } }}
            colSort
          />
          <div className="countrySummaryCalc">
            <p>Total Due</p>
            <h3>
              {getBillingCurrency()} {toCurrencyFormat(totalCountrySummaryDue)}
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
      {activeTab === "payroll" && transactionType != 7 && (
        <div className="payroll">
          {payrollTables.map((item: any) => {
            return (
              <div>
                <div className="countryHeader">
                  {/* <img src={spainFlag} alt="flag" /> */}
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
                        {
                          item.currencyCode +
                          " " +
                          toCurrencyFormat(item.feeSummary.subTotalDue)

                          // item.feeSummary.subTotalDue
                          //   .toFixed(2)
                          //   .replace(/\d(?=(\d{3})+\.)/g, "$&,")
                        }
                      </p>
                    </div>
                    <div className="rowFee">
                      <p className="title">
                        Country EXC Rate{" "}
                        {
                          toCurrencyFormat(item.exchangeRate)

                          // item.exchangeRate
                          //   .toFixed(2)
                          //   .replace(/\d(?=(\d{3})+\.)/g, "$&,")
                        }
                      </p>
                      <p className="amount">
                        {
                          getBillingCurrency() +
                          " " +
                          toCurrencyFormat(
                            item.feeSummary.subTotalDue * item.exchangeRate
                          )
                          // (item.feeSummary.subTotalDue * item.exchangeRate)
                          //   .toFixed(2)
                          //   .replace(/\d(?=(\d{3})+\.)/g, "$&,")
                        }
                      </p>
                    </div>
                    <div className="rowFee">
                      <p className="title">In Country Processing Fee</p>
                      <p className="amount">
                        {
                          getBillingCurrency() +
                          " " +
                          toCurrencyFormat(getInCountryProcessingFee())

                          // getInCountryProcessingFee()
                          //   .toFixed(2)
                          //   .replace(/\d(?=(\d{3})+\.)/g, "$&,")
                        }
                      </p>
                    </div>
                    <div className="rowFee">
                      <p className="title">FX Bill</p>
                      <p className="amount">
                        {
                          getBillingCurrency() +
                          " " +
                          toCurrencyFormat(item.feeSummary.fxBill)

                          // item.feeSummary.fxBill
                          //   .toFixed(2)
                          //   .replace(/\d(?=(\d{3})+\.)/g, "$&,")
                        }
                      </p>
                    </div>
                    <div className="row2">
                      <p className="title">Total Country VAT</p>
                      <p className="amount">
                        {
                          getBillingCurrency() +
                          " " +
                          toCurrencyFormat(item.feeSummary.totalCountryVat)

                          // item.feeSummary.totalCountryVat
                          //   .toFixed(2)
                          //   .replace(/\d(?=(\d{3})+\.)/g, "$&,")
                        }
                      </p>
                    </div>
                    <div className="totalRow">
                      <p>Country Total Due</p>
                      <h3>
                        {
                          getBillingCurrency() +
                          " " +
                          toCurrencyFormat(item.feeSummary.total)

                          // item.feeSummary.total
                          //   .toFixed(2)
                          //   .replace(/\d(?=(\d{3})+\.)/g, "$&,")
                        }
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
                {getBillingCurrency()}{" "}
                {
                  toCurrencyFormat(total)
                  // total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")
                }
              </h3>
            </div>
          </div>
        </div>
      )}
      {activeTab === "files" && transactionType != 7 && (
        <div className="filesNotes">
          <div className="box">
            <h3>Notes</h3>
            {/* <p>Write a Note relevant for this Invoice.</p> */}

            <Scrollbars
              renderView={(props: any) => (
                <div
                  {...props}
                  style={{
                    overflowX: "hidden",
                  }}
                  className="filesscroll"
                />
              )}
              renderTrackVertical={(props: any) => (
                <div
                  style={{ backgroundColor: "black" }}
                  {...props}
                  className="track-vertical"
                />
              )}
              renderThumbVertical={(props: any) => (
                <div
                  style={{ backgroundColor: "gray" }}
                  {...props}
                  className="thumb-vertical"
                />
              )}
              style={{ width: "110%", height: "26.75rem" }}
            >
              <div className="notesContainer">
                {!notes.length ? (
                  <div>
                    <NoDataCard
                      title=""
                      bodyContents={[
                        "No notes have been added yet.",
                        "Add one below!",
                      ]}
                      style={{
                        height: "19rem",
                        width: "auto",
                      }}
                    />
                  </div>
                ) : (
                  notes.map((item: any) => {
                    return (
                      <div className="notesSubContainer">
                        <div className="noteInfoBtn">
                          <div className="noteInfo">
                            <span>
                              test@email.com (You){" "}
                              {moment(item.createdDate).format(
                                "hh:mm A DD MMM, YYYY "
                              )}
                            </span>
                            <Icon color="#b4b3bb" icon="info" size="small" />
                          </div>
                          <div className="noteBtn">
                            <Icon color="#526FD6" icon="edit" size="small" />
                            {/* <Icon icon="trash" color="#FBAF00" size="small" /> */}

                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 26"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M4.38086 3.85719H19.619V22.1429C19.619 22.9512 19.2979 23.7264 18.7263 24.2979C18.1548 24.8694 17.3796 25.1905 16.5713 25.1905H7.42848C6.6202 25.1905 5.84503 24.8694 5.27349 24.2979C4.70195 23.7264 4.38086 22.9512 4.38086 22.1429V3.85719ZM11.9999 0.80957C12.7688 0.809327 13.5093 1.09971 14.0731 1.62252C14.6369 2.14532 14.9822 2.86191 15.0399 3.62862L15.0475 3.85719H8.95229C8.95229 3.04891 9.27338 2.27374 9.84492 1.7022C10.4165 1.13066 11.1916 0.80957 11.9999 0.80957V0.80957Z"
                                stroke="#E32C15"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M1.33398 3.85742H22.6673"
                                stroke="#E32C15"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M8.95312 8.42871V20.6192"
                                stroke="#E32C15"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M15.0488 8.42871V20.6192"
                                stroke="#E32C15"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="note">
                          <p>{item.note}</p>
                        </div>
                        {/* <div>
                      <p className="noteDate">
                        {moment(item.createdDate).format("DD/MM/YYYY, HH:mm")}
                      </p>
                    </div>

                    <div>
                      <p className="notes">
                        <span>test@email.com</span> {item.note}{" "}
                      </p>
                    </div> */}
                      </div>
                    );
                  })
                )}
              </div>
            </Scrollbars>

            <div className="inpContinaer">
              <textarea
                maxLength={400}
                value={noteText}
                onChange={(e: any) => setNoteText(e.target.value)}
                placeholder="Add a note here..."
              />
              <span>Characters left: {400 - noteText.length}</span>
            </div>
            <div className="btnContainer">
              {isClient == "false" && (
                <div className="btnContainercheckbox">
                  <Checkbox
                    onChange={(e: any) => {
                      setIsVisibleToCustomer(e.target.checked);
                    }}
                    label="Visible to Customer"
                    checked={isVisibleToCustomer}
                  />
                  <Checkbox
                    label="Export to Quickbooks"
                    onChange={(e: any) => {
                      setIsExportToQb(e.target.checked);
                    }}
                    checked={isExportToQb}
                  />
                  <Checkbox
                    label="Visible on PDF Invoice"
                    onChange={(e: any) => {
                      setisVisibleOnPDFInvoice(e.target.checked);
                    }}
                    checked={isVisibleOnPDFInvoice}
                  />
                </div>
              )}
              <Button
                disabled={
                  !noteText.length || noteText.length > 400 ? true : false
                }
                handleOnClick={() => {
                  const url = `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/InvoiceNote/Create`;
                  let currDate = new Date();

                  axios({
                    method: "POST",
                    url: url,
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
                    data: {
                      invoiceId: id,
                      noteType: "2",
                      note: noteText,
                      isCustomerVisible: isVisibleToCustomer,
                      exportToQuickbooks: isExportToQb,
                      createdDate: currDate,
                      modifiedBy: "00000000-0000-0000-0000-000000000000",
                      modifiedByUser: null,
                      displayInPDF: isVisibleOnPDFInvoice,
                      customerId: cid,
                    },
                  })
                    .then((res: any) => {
                      setNotes([res.data, ...notes]);
                      setNoteText("");
                    })
                    .catch((e: any) => {
                      console.log(e);
                    });
                }}
                className="primary-blue small"
                label="Save"
              />
            </div>
          </div>

          <div className="box2">
            <h3>Files</h3>
            <p>Upload files relevant for this Invoice.</p>
            <div className="boxsubcontainer">
              <div className="fileHandlerContainer">
                {documents.map((item: any, index: any) => {
                  return (
                    <FileHandler
                      icons={{
                        prefix: {
                          color: "#526FD6",
                          height: "40",
                          icon: "docUpload",
                          width: "40",
                        },
                        suffix: [
                          {
                            color: "#526FD6",
                            height: "40",
                            icon: "download",
                            width: "40",
                            handleOnClick: () => {
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

                              const downloadApi = `https://apigw-uat-emea.apnextgen.com/metadataservice/api/Blob/getBlobUrlWithSASToken?url=${item.document.url}`;
                              axios
                                .get(downloadApi, headers)
                                .then((res: any) => {
                                  if (res.status === 200) {
                                    // let url = res.data.url;
                                    let a = document.createElement("a");
                                    a.href = res.data.url;
                                    a.download = `${res.data.name}`;
                                    a.click();
                                  }
                                })
                                .catch((e: any) => {
                                  console.log("error", e);
                                });
                            },
                          },
                          {
                            color: "#526FD6",
                            height: "30",
                            icon: "remove",
                            width: "30",
                            handleOnClick: () => {
                              const headers = {
                                authorization: `Bearer ${tempToken}`,
                                "x-apng-base-region": "EMEA",
                                "x-apng-customer-id": cid || "",
                                "x-apng-external": "false",
                                "x-apng-inter-region": "0",
                                "x-apng-target-region": "EMEA",
                                customer_id: cid || "",
                              };

                              axios({
                                method: "DELETE",
                                url: "https://apigw-uat-emea.apnextgen.com/invoiceservice/api/InvoiceDocument/Delete",
                                data: {
                                  invoiceId: id,
                                  documentId: documents[index].documentId,
                                },
                                headers: headers,
                              })
                                .then((res: any) => {
                                  let cpy = [...documents];
                                  cpy.splice(index, 1);
                                  setDocuments(cpy);
                                })
                                .catch((e: any) => {
                                  console.log(e);
                                });

                              // axios
                              //   .post(
                              //     "https://apigw-uat-emea.apnextgen.com/invoiceservice/api/InvoiceDocument/Delete",
                              //     {
                              //       invoiceId: id,
                              //       documentId: documents[index].documentId,
                              //     },
                              //     {
                              //       headers: headers,
                              //     }
                              //   )
                              //   .then((res: any) => {
                              //     console.log("del rs", res);
                              //     let cpy = [...documents];
                              //     cpy.splice(index, 1);
                              //     setDocuments(cpy);
                              //   })
                              //   .catch((e: any) => {
                              //     console.log(e);
                              //   });
                            },
                          },
                        ],
                      }}
                      label={{
                        footer: "235 MB",
                        header: item.document.documentName,
                      }}
                    />
                  );
                })}
              </div>

              <div className="uploadConatiner">
                <FileUpload
                  fileList={[]}
                  formats={[".pdf", ".excel", ".jpeg", ".png", ".word"]}
                  handleUpload={
                    /* istanbul ignore next */
                    (file: any) => {
                      const headers = {
                        authorization: `Bearer ${tempToken}`,
                        "x-apng-base-region": "EMEA",
                        "x-apng-customer-id": cid || "",
                        "x-apng-external": "false",
                        "x-apng-inter-region": "0",
                        "x-apng-target-region": "EMEA",
                        customer_id: cid || "",
                      };
                      setTimeout(() => {
                        var formData = new FormData();
                        formData.append("asset", file[0]);
                        axios
                          .post(
                            "https://apigw-uat-emea.apnextgen.com/metadataservice/api/Blob/UploadFile",
                            formData,
                            {
                              headers: headers,
                            }
                          )
                          .then((res: any) => {
                            axios
                              .post(
                                " https://apigw-uat-emea.apnextgen.com/invoiceservice/api/InvoiceDocument/Create",
                                {
                                  invoiceId: id,

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
                                setDocuments([
                                  ...documents,
                                  {
                                    documentId: response.data.documentId,
                                    document: {
                                      documentName: res.data.fileName,
                                      url: res.data.url,
                                    },
                                  },
                                ]);
                                setIsFileError(false);
                              })
                              .catch((e: any) => {
                                console.log(e);
                                setIsFileError(true);
                              });
                          })
                          .catch((e: any) => {
                            console.log(e);
                            setIsFileError(true);
                          });
                      });
                    }
                  }
                  isError={isFileError}
                  maxSize={25}
                  resetFiles={function noRefCheck() {
                    setIsFileError(null);
                  }}
                  title="Upload"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {transactionType == 7 && (
        <BillsTable
          currency={getBillingCurrency()}
          tableData={billTableData?.data}
          customerId = {cid}
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
              <p>Payroll Invoice No. {apiData?.data?.invoice?.invoiceNo}.</p>
            </div>
            <h6>
              Comment<span className="comment">*</span>
            </h6>

            <div>
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
                disabled={!inputValue}
                label="Decline Invoice"
                className="primary-blue medium decline-button"
                handleOnClick={() => {
                  const url = `https://apigw-dev-eu.atlasbyelements.com/atlas-invoiceservice/api/Invoices/declineInvoice`;
                  let currDate = new Date();

                  axios({
                    method: "POST",
                    url: url,
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
                            setStatus(e.text);
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
        <Modal
          isOpen={isVoidConfirmOptionOpen}
          handleClose={() => {
            setIsVoidConfirmOptionOpen(false);
          }}
        >
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
    </div>
  );
}
