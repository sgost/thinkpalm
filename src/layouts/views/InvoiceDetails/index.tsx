import React, { useEffect, useState } from "react";
import { Button, Icon, Table, FileHandler, FileUpload } from "atlasuikit";
import "./invoiceDetails.scss";
import { countrySummaryData, feeSummary, payrollData } from "./mockData";
import spainFlag from "./spainFlag.png";
import getRequest from "../../../components/Comman/api";
import moment from "moment";
import GetFlag from "./getFlag";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import avatar from "./avatar.png";

export default function InvoiceDetails() {
  const [activeTab, setActiveTab] = useState("payroll");
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const { id, cid } = useParams();

  const api =
    "https://apigw-uat-emea.apnextgen.com/payrollservice/api/Payroll/" + id;
  const addressApi = `https://apigw-uat-emea.apnextgen.com/customerservice/api/Customers/${cid}?includes=BillingAddress`;

  const countriesApi =
    "https://apigw-uat-emea.apnextgen.com/metadataservice/api/lookup/Countries?includeProperties=Currency&orderBy=Name";

  const feeApi =
    "https://apigw-uat-emea.apnextgen.com/metadataservice/api/Fees";

  const lookupApi =
    "https://apigw-uat-emea.apnextgen.com/metadataservice/api/Lookup";

  const tempToken = localStorage.getItem("temptoken");
  // const apiData: any = getRequest(api, tempToken, cid);
  // const addressData: any = getRequest(addressApi, tempToken, cid);
  // const countriesData: any = getRequest(countriesApi, tempToken, cid);
  // const feeData: any = getRequest(feeApi, tempToken, cid);
  // const lookupData: any = getRequest(lookupApi, tempToken, cid);
  const [apiData, setApiData] = useState<any>(null);
  const [addressData, setAddressData] = useState<any>(null);
  const [countriesData, setCountriesData] = useState<any>(null);
  const [feeData, setFeeData] = useState<any>(null);
  const [lookupData, setLookupData] = useState<any>(null);

  const [payrollTables, setPayrollTables] = useState([]);
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
      {
        header: "Gross Wages",
        isDefault: true,
        key: "grossWages",
      },
      {
        header: "Allowances",
        isDefault: true,
        key: "allowances",
      },
      {
        header: "Expense Reimb.",
        isDefault: true,
        key: "expenseReimb",
      },
      {
        header: "Employer Liability",
        isDefault: true,
        key: "employerLiability",
      },
      {
        header: "Country VAT",
        isDefault: true,
        key: "countryVAT",
      },
      {
        header: "Admin Fees",
        isDefault: true,
        key: "adminFees",
      },
      {
        header: "Healthcare Benefits",
        isDefault: true,
        key: "healthcareBenefits",
      },
    ],
    showDefaultColumn: true,
  };
  const [invoiceDetail, setInvoiceDetail] = useState<any>(null);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const headers = {
      headers: {
        authorization: `Bearer ${tempToken}`,
        "x-apng-base-region": "EMEA",
        "x-apng-customer-id": cid
          ? cid
          : "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
        "x-apng-external": "false",
        "x-apng-inter-region": "0",
        "x-apng-target-region": "EMEA",
        customer_id: cid ? cid : "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
      },
    };

    axios
      .get(api, headers)
      .then((res: any) => {
        console.log("invoice details", res);
        setInvoiceDetail(res?.data);
        setApiData(res);
        let data: any = [];
        let tempTotal = 0;
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
              grossWages: currencyCode + " " + item.totalWage.toFixed(2),
              allowances: currencyCode + " " + item.allowance.toFixed(2),
              expenseReimb: currencyCode + " " + item.expenseRe.toFixed(2),
              employerLiability: currencyCode + " " + item.liability.toFixed(2),
              countryVAT: item.countryVat.toFixed(2),
              adminFees: currencyCode + " " + item.adminFee.toFixed(2),
              healthcareBenefits:
                currencyCode + " " + item.healthcare.toFixed(2),
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
        });

        // console.log(data);
        setPayrollTables(data);
        setTotal(tempTotal);
      })
      .catch((e: any) => {
        console.log("error", e);
      });

    axios
      .get(feeApi, headers)
      .then((res: any) => {
        console.log("fee res", res);
        setFeeData(res);
      })
      .catch((e: any) => {
        console.log("error", e);
      });

    axios
      .get(countriesApi, headers)
      .then((res: any) => {
        console.log("countries res", res);
        setCountriesData(res);
      })
      .catch((e: any) => {
        console.log("error", e);
      });

    axios
      .get(lookupApi, headers)
      .then((res: any) => {
        console.log("lookup res", res);
        setLookupData(res);
      })
      .catch((e: any) => {
        console.log("error", e);
      });

    axios
      .get(addressApi, headers)
      .then((res: any) => {
        // console.log("working", res);
        setAddressData(res);
      })
      .catch((e: any) => {
        console.log("error", e);
      });
  }, []);

  // useEffect(() => {
  //   // const headers = {
  //   //   headers: {
  //   //     authorization: `Bearer ${tempToken}`,
  //   //     "x-apng-base-region": "EMEA",
  //   //     "x-apng-customer-id": cid
  //   //       ? cid
  //   //       : "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
  //   //     "x-apng-external": "false",
  //   //     "x-apng-inter-region": "0",
  //   //     "x-apng-target-region": "EMEA",
  //   //     customer_id: cid ? cid : "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
  //   //   },
  //   // };

  //   // axios
  //   //   .get(api, headers)
  //   //   .then((res: any) => {
  //   //     setApiData(res);
  //   //     setInvoiceDetail(res.data);
  //   //     if (res.data.countryPayroll) {
  //   //       let data: any = [];
  //   //       let tempTotal = 0;
  //   //       res.data?.countryPayroll.forEach((e: any) => {
  //   //         let country = e.countryName;
  //   //         let countryCode = e.countryCode;
  //   //         let currencyCode = e.currencyCode;
  //   //         let arr: any = [];

  //   //         e.payrollItems.forEach((item: any) => {
  //   //           arr.push({
  //   //             employeeID: item.employeeId,
  //   //             name: {
  //   //               value: item.firstName + " " + item.lastName,
  //   //               // img: { src: item.employeeProfilePicture },

  //   //               img: { src: avatar },
  //   //               style: { borderRadius: 12 },
  //   //             },
  //   //             grossWages: currencyCode + " " + item.totalWage.toFixed(2),
  //   //             allowances: currencyCode + " " + item.allowance.toFixed(2),
  //   //             expenseReimb: currencyCode + " " + item.expenseRe.toFixed(2),
  //   //             employerLiability:
  //   //               currencyCode + " " + item.liability.toFixed(2),
  //   //             countryVAT: item.countryVat.toFixed(2),
  //   //             adminFees: currencyCode + " " + item.adminFee.toFixed(2),
  //   //             healthcareBenefits:
  //   //               currencyCode + " " + item.healthcare.toFixed(2),
  //   //           });
  //   //         });

  //   //         tempTotal += e.feeSummary.total;

  //   //         data.push({
  //   //           country,
  //   //           countryCode,
  //   //           exchangeRate: e.exchangeRate,
  //   //           currencyCode: e.currencyCode,
  //   //           feeSummary: e.feeSummary,
  //   //           data: arr,
  //   //         });
  //   //       });

  //   //       // console.log(data);
  //   //       setPayrollTables(data);
  //   //       setTotal(tempTotal);
  //   //     }
  //   //   })
  //   //   .catch((e: any) => {
  //   //     console.log("error", e);
  //   //   });

  //   // axios
  //   //   .get(addressApi, headers)
  //   //   .then((res: any) => {
  //   //     setAddressData(res);
  //   //   })
  //   //   .catch((e: any) => {
  //   //     console.log("error", e);
  //   //   });

  //   // axios
  //   //   .get(feeApi, headers)
  //   //   .then((res: any) => {
  //   //     setFeeData(res);
  //   //   })
  //   //   .catch((e: any) => {
  //   //     console.log("error", e);
  //   //   });

  //   // axios
  //   //   .get(countriesApi, headers)
  //   //   .then((res: any) => {
  //   //     setCountriesData(res);
  //   //   })
  //   //   .catch((e: any) => {
  //   //     console.log("error", e);
  //   //   });

  //   // axios
  //   //   .get(lookupApi, headers)
  //   //   .then((res: any) => {
  //   //     setLookupData(res);
  //   //   })
  //   //   .catch((e: any) => {
  //   //     console.log("error", e);
  //   //   });

  //   if (apiData.data) {
  //     console.log(apiData.data?.invoice?.invoiceNo);
  //     setInvoiceDetail(apiData.data);
  //     if (apiData.data.countryPayroll) {
  //       let data: any = [];
  //       let tempTotal = 0;
  //       apiData.data?.countryPayroll.forEach((e: any) => {
  //         let country = e.countryName;
  //         let countryCode = e.countryCode;
  //         let currencyCode = e.currencyCode;
  //         let arr: any = [];

  //         e.payrollItems.forEach((item: any) => {
  //           arr.push({
  //             employeeID: item.employeeId,
  //             name: {
  //               value: item.firstName + " " + item.lastName,
  //               // img: { src: item.employeeProfilePicture },

  //               img: { src: avatar },
  //               style: { borderRadius: 12 },
  //             },
  //             grossWages: currencyCode + " " + item.totalWage.toFixed(2),
  //             allowances: currencyCode + " " + item.allowance.toFixed(2),
  //             expenseReimb: currencyCode + " " + item.expenseRe.toFixed(2),
  //             employerLiability: currencyCode + " " + item.liability.toFixed(2),
  //             countryVAT: item.countryVat.toFixed(2),
  //             adminFees: currencyCode + " " + item.adminFee.toFixed(2),
  //             healthcareBenefits:
  //               currencyCode + " " + item.healthcare.toFixed(2),
  //           });
  //         });

  //         tempTotal += e.feeSummary.total;

  //         data.push({
  //           country,
  //           countryCode,
  //           exchangeRate: e.exchangeRate,
  //           currencyCode: e.currencyCode,
  //           feeSummary: e.feeSummary,
  //           data: arr,
  //         });
  //       });

  //       // console.log(data);
  //       setPayrollTables(data);
  //       setTotal(tempTotal);
  //     }
  //   }
  // }, [apiData]);

  useEffect(() => {
    if (lookupData?.data && invoiceDetail) {
      console.log("lookupData", lookupData.data.invoiceStatuses);
      lookupData.data.invoiceStatuses.forEach((e: any) => {
        if (e.value === invoiceDetail.invoice.status) {
          setStatus(e.text);
        }
      });
    }
  }, [lookupData, invoiceDetail]);

  useEffect(() => {
    function handleClick() {
      console.log("fired");
      if (isDownloadOpen) {
        setIsDownloadOpen(false);
      }
    }
    console.log("id", id, "cid", cid);
    document.addEventListener("click", handleClick);
    return document.removeEventListener("click", handleClick);
  }, []);

  const getBillingCurrency = () => {
    let currency = countriesData.data.find(
      (e: any) => e.currencyId === apiData.data.invoice.currencyId
    );
    console.log("currency", currency);
    return currency.code;
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

  if (!apiData?.data) {
    return <p>Loading...</p>;
  }

  return (
    <div className="invoiceDetailsContainer">
      <div className="invoiceDetailsHeaderRow">
        <div className="breadcrumbs">
          <p onClick={() => navigate("/pay")} className="text">
            Invoices
          </p>
          <Icon className="icon" icon="chevronRight" size="medium" />
          <p className="text">
            Payroll Invoice No. {invoiceDetail?.invoice?.invoiceNo}
          </p>
        </div>
        <div className="buttons">
          <div
            onClick={() => setIsDownloadOpen(!isDownloadOpen)}
            className="download"
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

          <Button
            className="primary-blue small"
            disabled
            icon={{
              color: "#fff",
              icon: "checkMark",
              size: "medium",
            }}
            label="Approve Invoice"
          />
        </div>
      </div>

      <div className="payrollInvoiceInfo">
        <div className="topBar">
          <p className="status">{status}</p>

          <div className="row">
            <div className="invoiceNo">
              <Icon
                color="#FFFFFF"
                icon="orderSummary"
                size="medium"
                title="Order Summary"
              />
              <p>Payroll Invoice No. {invoiceDetail?.invoice?.invoiceNo}</p>
            </div>
            <div className="amount">
              <p>
                Open{" "}
                <span>
                  {getBillingCurrency()}{" "}
                  {invoiceDetail?.invoice?.invoiceBalance.toFixed(2)}
                </span>
              </p>
              <p>
                Total{" "}
                <span>
                  {getBillingCurrency()}{" "}
                  {invoiceDetail?.invoice?.totalAmount.toFixed(2)}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="infoDetails">
          <div className="column1">
            <p className="heading">From</p>
            <p className="value">{invoiceDetail?.invoiceFrom?.companyName}</p>
          </div>
          <div>
            <p className="heading">To</p>
            <p className="value">{invoiceDetail?.invoice?.customerName}</p>
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
            <p>PO Number</p>
            <p className="poNo">{invoiceDetail?.invoice?.poNumber}</p>
          </div>
          <div>
            <p className="heading">Invoice Date</p>
            <p className="value">
              {moment(invoiceDetail?.invoice?.createdDate).format(
                "DD MMM YYYY"
              )}
            </p>
            <p className="heading">Invoice Changes</p>
            <p className="value">-</p>
            <p className="heading">Payment Due</p>
            <p className="value">
              {moment(invoiceDetail?.invoice?.dueDate).format("DD MMM YYYY")}
            </p>
          </div>
          <div className="lastCloumn">
            <p className="heading">Location</p>
            <p className="value">{invoiceDetail?.invoice?.customerLocation}</p>
            <p className="heading">Region</p>
            <p className="value">{invoiceDetail?.regionItemCode}</p>
            <p className="heading">Billing Currency</p>
            <p className="value">{getBillingCurrency()}</p>
          </div>
        </div>
      </div>

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
          className={activeTab === "files" ? "tabTextActive" : "tabTextPassive"}
        >
          Files & Notes
        </p>
      </div>
      {activeTab === "master" && (
        <div>
          <h3 className="tableHeader">Country Summary</h3>
          <Table options={countrySummaryData} colSort />
          <div className="countrySummaryCalc">
            <p>Total Due</p>
            <h3>USD 300,523.15</h3>
          </div>

          <h3 className="tableHeader">Fee Summary</h3>
          <Table options={feeSummary} colSort />
          <div className="feeSummaryCalc">
            <div className="row">
              <p className="title">Incoming Wire Payment</p>
              <p className="amount">USD 35.00</p>
            </div>
            <div className="row2">
              <p className="title">Contract Termination Fee</p>
              <p className="amount">USD 35.00</p>
            </div>
            <div className="totalRow">
              <p>Total Due</p>
              <h3>USD 300,523.15</h3>
            </div>
          </div>
        </div>
      )}
      {activeTab === "payroll" && (
        <div>
          {payrollTables.map((item: any) => {
            console.log("item", item);
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
                    <div className="row">
                      <p className="title">Country Subtotal Due</p>
                      <p className="amount">
                        {item.currencyCode +
                          " " +
                          item.feeSummary.subTotalDue.toFixed(2)}
                      </p>
                    </div>
                    <div className="row">
                      <p className="title">
                        Country EXC Rate {item.exchangeRate.toFixed(2)}
                      </p>
                      <p className="amount">
                        {item.currencyCode +
                          " " +
                          (
                            item.feeSummary.subTotalDue * item.exchangeRate
                          ).toFixed(2)}
                      </p>
                    </div>
                    <div className="row">
                      <p className="title">In Country Processing Fee</p>
                      <p className="amount">
                        {item.currencyCode +
                          " " +
                          getInCountryProcessingFee().toFixed(2)}
                      </p>
                    </div>
                    <div className="row">
                      <p className="title">FX Bill</p>
                      <p className="amount">
                        {item.currencyCode +
                          " " +
                          item.feeSummary.fxBill.toFixed(2)}
                      </p>
                    </div>
                    <div className="row2">
                      <p className="title">Total Country VAT</p>
                      <p className="amount">
                        {item.currencyCode +
                          " " +
                          item.feeSummary.totalCountryVat.toFixed(2)}
                      </p>
                    </div>
                    <div className="totalRow">
                      <p>Country Total Due</p>
                      <h3>
                        {item.currencyCode +
                          " " +
                          item.feeSummary.total.toFixed(2)}
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
              <h3>- {total}</h3>
            </div>
          </div>
        </div>
      )}
      {activeTab === "files" && (
        <div className="filesNotes">
          <div className="box">
            <h3>Notes</h3>
            <p>Write a Note relevant for this Invoice.</p>
            <div className="inpContinaer">
              <textarea placeholder="Add a Note..." />
            </div>
            <div className="btnContainer">
              <Button className="primary-blue medium" label="Publish Note" />
            </div>
          </div>

          <div className="box2">
            <h3>Files</h3>
            <p>Upload files relevant for this Invoice.</p>
            <div className="fileHandlerContainer">
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
                      height: "30",
                      icon: "remove",
                      width: "30",
                    },
                  ],
                }}
                label={{
                  footer: "235 MB",
                  header: "Sample.pdf",
                }}
              />
            </div>

            <div className="uploadConatiner">
              <FileUpload
                fileList={[]}
                formats={[".PDF", ".EXCEL", ".JPEG", ".PNG", ".WORD"]}
                handleUpload={function noRefCheck() {}}
                isError={null}
                maxSize={25}
                resetFiles={function noRefCheck() {}}
                title="Upload"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
