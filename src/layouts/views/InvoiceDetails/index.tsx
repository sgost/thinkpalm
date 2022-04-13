import React, { useEffect, useState } from "react";
import { Button, Icon, Table, FileHandler, FileUpload, BreadCrumb } from "atlasuikit";
import "./invoiceDetails.scss";
import { apiInvoiceMockData, countrySummaryData, feeSummary } from "./mockData";

import moment from "moment";
import GetFlag from "./getFlag";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import avatar from "./avatar.png";

export default function InvoiceDetails() {
  const [activeTab, setActiveTab] = useState("payroll");
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const { id, cid, isClient } = useParams();

  const api =
    "https://apigw-uat-emea.apnextgen.com/payrollservice/api/Payroll/" + id;
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
  const [addressData, setAddressData] = useState<any>(null);
  const [countriesData, setCountriesData] = useState<any>(null);
  const [feeData, setFeeData] = useState<any>(null);
  const [lookupData, setLookupData] = useState<any>(null);
  const [documents, setDocuments] = useState<any>([]);

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
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("");
  const [isErr, setIsErr] = useState(false);
  const [approvalMsg, setApprovalMsg] = useState("");
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState<any>([]);
  const [isFileError, setIsFileError] = useState<any>(null);
  const [transactionType, setTransactionType] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const headers = {
      headers: {
        authorization: `Bearer ${tempToken}`,
        "x-apng-base-region": "EMEA",
        "x-apng-customer-id": "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
        "x-apng-external": "false",
        "x-apng-inter-region": "0",
        "x-apng-target-region": "EMEA",
        customer_id: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
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
      .then((res: any) => {
        setCountriesData(res);
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

    axios
      .get(api, headers)
      .then((res: any) => {
        let data: any = [];
        let tempTotal = 0;
        if (res.status !== 200) {
          throw new Error("Something went wrong");
        }
        console.log("invoice details", res);
        //Mock Data used for id "fb706b8f-a622-43a1-a240-8c077e519d71"
        if(res.data.id == "fb706b8f-a622-43a1-a240-8c077e519d71"){
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
              grossWages: currencyCode + " " + toCurrencyFormat(item.totalWage),
              // item.totalWage.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")
              allowances: currencyCode + " " + toCurrencyFormat(item.allowance),

              // item.allowance.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")
              expenseReimb:
                currencyCode + " " + toCurrencyFormat(item.expenseRe),

              // item.expenseRe.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")
              employerLiability:
                currencyCode + " " + toCurrencyFormat(item.liability),

              // item.liability.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")
              countryVAT: item.countryVat.toFixed(2),
              adminFees: currencyCode + " " + toCurrencyFormat(item.adminFee),
              // item.adminFee.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")
              healthcareBenefits:
                currencyCode + " " + toCurrencyFormat(item.healthcare),

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
        });
        setPayrollTables(data);
        setTotal(tempTotal);
        setDocuments(res.data.invoice.invoiceDocuments);
        setApiData(res);
        setTransactionType(res.data.invoice.transactionType);
      })
      .catch((e: any) => {
        console.log("error e", e);
        setIsErr(true);
      });

    axios
      .get(notesApi, headers)
      .then((res: any) => {
        setNotes(res.data.reverse());
      })
      .catch((e: any) => {
        console.log("error e", e);
      });
  }, []);

  useEffect(() => {
    if (lookupData?.data && apiData?.data) {
      console.log("lookupData", lookupData.data.invoiceStatuses);
      lookupData.data.invoiceStatuses.forEach((e: any) => {
        if (e.value === apiData.data.invoice.status) {
          setStatus(e.text);
        }
      });
    }
  }, [lookupData, apiData]);

  const getBillingCurrency = () => {
    let currency = countriesData.data.find(
      (e: any) => e.currencyId === apiData.data.invoice.currencyId
    );
    console.log("currency", currency);
    console.log("isClient", isClient);

    return currency.code;
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
        console.log(res);
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
            hideHeaderTitle={true}
            hideHeaderTabs = {true}
            steps={[
              {
                isActive: true,
                key: 'Invoices',
                label: 'Invoices',
                onClickLabel: () =>{ navigate("/pay")}
              },
              {
                key: 'profile',
                label: transactionType == 7 ? "Contractor Invoice No. " + apiData?.data?.invoice?.invoiceNo : "Payroll Invoice No. " + apiData?.data?.invoice?.invoiceNo,
              }
            ]}
          />
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

          <div>
            {isClient == "true" && status === "Pending Approval" && (
              <Button
                disabled = {transactionType == 7}
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
            <p className="status">{status}</p>
          </div>
          <div className="topBarrow">
            <div className="invoiceNo">
              <Icon
                color="#FFFFFF"
                icon="orderSummary"
                size="large"
                title="Order Summary"
              />
              {transactionType != 7 ? <p>Payroll Invoice No. {apiData?.data?.invoice?.invoiceNo}</p>: <p>Contractor Invoice No. {apiData?.data?.invoice?.invoiceNo}</p>}
            </div>
            <div className="amount">
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
            <p>PO Number</p>
            <p className="poNo">{apiData?.data?.invoice?.poNumber}</p>
          </div>
          <div>
            <p className="heading">Invoice Date</p>
            <p className="value">
              {moment(apiData?.data?.invoice?.createdDate).format(
                "DD MMM YYYY"
              )}
            </p>
            <p className="heading">Invoice Changes</p>
            <p className="value">
              {moment(apiData?.data?.invoice?.createdDate).format(
                "DD MMM YYYY"
              )}
            </p>
            <p className="heading">Payment Due</p>
            <p className="value">
              {moment(apiData?.data?.invoice?.dueDate).format("DD MMM YYYY")}
            </p>
          </div>
          <div className="lastCloumn">
            <p className="heading">Location</p>
            <p className="value">{apiData?.data?.invoice?.customerLocation}</p>
            <p className="heading">Region</p>
            <p className="value">
              {apiData?.data?.regionItemCode.toUpperCase()}
            </p>
            <p className="heading">Billing Currency</p>
            <p className="value">{getBillingCurrency()}</p>
          </div>
        </div>
      </div>

      {transactionType != 7 &&
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
      }
      
      {activeTab === "master" && transactionType != 7 && (
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
            <div className="rowFee">
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
      {activeTab === "payroll" && transactionType != 7 && (
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
                          item.currencyCode +
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
                          item.currencyCode +
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
                          item.currencyCode +
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
                          item.currencyCode +
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

            <div className="notesContainer">
              {notes.map((item: any) => {
                return (
                  <div className="notesSubContainer">
                    <div>
                      <p className="noteDate">
                        {moment(item.createdDate).format("DD/MM/YYYY, HH:mm")}
                      </p>
                    </div>

                    <div>
                      <p className="notes">
                        <span>test@email.com</span> {item.note}{" "}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="inpContinaer">
              <textarea
                value={noteText}
                onChange={(e: any) => setNoteText(e.target.value)}
                placeholder="Add a Note..."
              />
            </div>
            <div className="btnContainer">
              <div>
                <input type="checkbox" /> <label>Visible to Customer</label>
                <input type="checkbox" /> <label>Export to QB</label> <br />
                <input type="checkbox" /> <label>Visible on PDF Invoice</label>
              </div>
              <Button
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
                      isCustomerVisible: false,
                      exportToQuickbooks: false,
                      createdDate: currDate,
                      modifiedBy: "00000000-0000-0000-0000-000000000000",
                      modifiedByUser: null,
                      displayInPDF: false,
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
                label="Publish Note"
              />
            </div>
          </div>

          <div className="box2">
            <h3>Files</h3>
            <p>Upload files relevant for this Invoice.</p>
            <div className="boxsubcontainer">
              <div className="fileHandlerContainer">
                {documents.map((item: any, index: any) => {
                  console.log(item);
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
                              console.log("docs", documents[index]);
                              const headers = {
                                authorization: `Bearer ${tempToken}`,
                                "x-apng-base-region": "EMEA",
                                "x-apng-customer-id":
                                  "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
                                "x-apng-external": "false",
                                "x-apng-inter-region": "0",
                                "x-apng-target-region": "EMEA",
                                customer_id:
                                  "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
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
                                  console.log("del rs", res);
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
                        "x-apng-customer-id":
                          "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
                        "x-apng-external": "false",
                        "x-apng-inter-region": "0",
                        "x-apng-target-region": "EMEA",
                        customer_id: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
                      };
                      setTimeout(() => {
                        console.log(file);
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
                            console.log("file res", res);

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
                                console.log("create res", response);
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

      {approvalMsg && <p className="approvalMsg">{approvalMsg}</p>}
    </div>
  );
}
