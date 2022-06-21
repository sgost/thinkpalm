import React, { useState, useEffect } from "react";
import { Button, Modal, Icon, Table } from "atlasuikit";
import avatar from "../InvoiceDetails/avatar.png";

import "./PreviewInvoice.scss";
import {
  urls,
  getInvoiceDetailsUrl,
  getBillingAddressUrl,
  getHeaders,
} from "../../../urls/urls";
import axios from "axios";
import { getFlagPath } from "../InvoiceDetails/getFlag";
import moment from "moment";
import { Loader } from "../../../components/Comman/Utils/utils";

const PreviewInvoice = ({
  newInvoiceEmployeeDetailTable,
  newInvoiceCountrySummaryTable,
  newInvoiceFeeSummaryOptions,
  CreateManualPayrollRes,
  stepperOneData,
  setTransactionType,
  loading,
  setLoading,
}: any) => {
  const api = getInvoiceDetailsUrl(CreateManualPayrollRes?.invoiceId);

  const addressApi = getBillingAddressUrl(stepperOneData?.customerId);

  const countriesApi = urls.countries;

  const feeApi = urls.fee;

  const tempToken = localStorage.getItem("accessToken");

  // states
  const [isPreviewModal, setIsPreviewModal] = useState(false);
  const [feeData, setFeeData] = useState<any>(null);
  const [countriesData, setCountriesData] = useState<any>(null);

  //dataaaa
  const [payrollTables, setPayrollTables] = useState<any>([]);
  const [apiData, setApiData] = useState<any>(null);
  const [countrySummary, setCountrySummary] = useState<any>([]);
  const [totalCountrySummaryDue, settotalCountrySummaryDue] = useState(0);
  const [feeSummary, setFeeSummary] = useState<any>([]);
  const [addressData, setAddressData] = useState<any>(null);
  const [contractTerminationFee, setContractTerminationFee] = useState(0);
  const [incomingWirePayment, setIncomingWirePayment] = useState(0);
  const [feeSummaryTotalDue, setFeeSummaryTotalDue] = useState(0);

  const payrollToCurrencyFormat = (amount: number) => {
    const cFormat = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    return cFormat.format(amount).slice(1);
  };

  const getPayrollBillingCurrency = () => {
    if (countriesData?.data && apiData?.data) {
      let currency = countriesData.data.find(
        (e: any) => e.currencyId === apiData.data.invoice.currencyId
      );

      return currency.currency.code;
    } else {
      return "";
    }
  };

  const previewPageAllApi = () => {
    const headers = {
      headers: getHeaders(tempToken, stepperOneData.customerId, "false"),
    };

    setLoading(true);

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
          .get(api, headers)
          .then((res: any) => {
            let billingCurrencyPayroll = countryRes.data.find(
              (e: any) => e.currencyId === res.data.invoice.currencyId
            );
            let data: any = [];
            let countrySummaryPayroll: any = [];
            let tempTotalPayroll = 0;
            let countrySumTotalArrPayroll: any = [];
            let feeSummaryPayroll: any = [];

            res.data?.countryPayroll.forEach((e: any) => {
              let countryPayroll = e.countryName;
              let countryCodePayroll = e.countryCode;
              let currencyCodePayroll = e.currencyCode;
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
                    currencyCodePayroll +
                    " " +
                    payrollToCurrencyFormat(item.totalWage),

                  allowances:
                    currencyCodePayroll +
                    " " +
                    payrollToCurrencyFormat(item.allowance),

                  expenseReimb:
                    currencyCodePayroll +
                    " " +
                    payrollToCurrencyFormat(item.expenseRe),

                  employerLiability:
                    currencyCodePayroll +
                    " " +
                    payrollToCurrencyFormat(item.liability),

                  countryVAT: item.countryVat.toFixed(2),

                  adminFees:
                    billingCurrencyPayroll.currency.code +
                    " " +
                    payrollToCurrencyFormat(item.adminFee),

                  healthcareBenefits:
                    billingCurrencyPayroll.currency.code +
                    " " +
                    payrollToCurrencyFormat(item.healthcare),
                });
              });

              tempTotalPayroll += e.countryTotalDue;

              data.push({
                countryPayroll,
                countryCodePayroll,
                exchangeRate: e.exchangeRate,
                currencyCode: e.currencyCode,
                countryTotalDue: e.countryTotalDue,
                feeSummary: e.feeSummary,
                data: arr,
              });

              //For Country Summary

              let totalGrossWagesPayroll = e.payrollItems.reduce(
                (a: any, b: any) => a + (b.totalWage || 0),
                0
              );
              let totalAllowancesPayroll = e.payrollItems.reduce(
                (a: any, b: any) => a + (b.allowance || 0),
                0
              );
              let totalExpenseReimbPayroll = e.payrollItems.reduce(
                (a: any, b: any) => a + (b.expenseRe || 0),
                0
              );
              let totalEmployerLiabilityPayroll = e.payrollItems.reduce(
                (a: any, b: any) => a + (b.liability || 0),
                0
              );
              let totalCountryVATPayroll = e.payrollItems.reduce(
                (a: any, b: any) => a + (b.countryVat || 0),
                0
              );

              function precisionRound(number: number, precision: number) {
                return +(
                  Math.round(Number(number + "e+" + precision)) +
                  "e-" +
                  precision
                );
              }

              let countrySumTotalTempPayroll =
                precisionRound(
                  (totalGrossWagesPayroll + totalAllowancesPayroll) *
                    e.exchangeRate,
                  2
                ) +
                precisionRound(totalExpenseReimbPayroll * e.exchangeRate, 2) +
                precisionRound(
                  totalEmployerLiabilityPayroll * e.exchangeRate,
                  2
                ) +
                precisionRound(totalCountryVATPayroll * e.exchangeRate, 2);

              countrySumTotalArrPayroll.push(countrySumTotalTempPayroll);

              countrySummaryPayroll.push({
                country: {
                  value: e.countryName,
                  img: { src: getFlagPath(e.countryCode) },
                },
                currency: e.currencyCode,
                employees: e.payrollItems.length,
                grossWages: payrollToCurrencyFormat(totalGrossWagesPayroll),
                allowances: payrollToCurrencyFormat(totalAllowancesPayroll),
                expenseReimb: payrollToCurrencyFormat(totalExpenseReimbPayroll),
                employerLiability: payrollToCurrencyFormat(
                  totalEmployerLiabilityPayroll
                ),
                countryVAT: payrollToCurrencyFormat(totalCountryVATPayroll),
                exchangeRate: e.exchangeRate,
                total: payrollToCurrencyFormat(countrySumTotalTempPayroll),
              });

              //Fee Summary Calculation
              feeSummaryPayroll.push({
                country: {
                  value: e.countryName,
                  img: { src: getFlagPath(e.countryCode) },
                },
                currency: e.currencyCode,
                adminFees: payrollToCurrencyFormat(e.feeSummary.adminFee),
                OnOffboardings: e.feeSummary.boardingFee,
                fxRate: e.feeSummary.fxRate,
                fxBill: e.feeSummary.fxBill,
                benefits: payrollToCurrencyFormat(e.feeSummary.healthCare),
                employeeContribution: e.employeeContributionCreditTotal,
                total: payrollToCurrencyFormat(e.feeSummary.total),
              });
            });

            //Set states here
            setPayrollTables(data);
            setApiData(res);
            setTransactionType(res.data.invoice.transactionType);
            setCountrySummary(countrySummaryPayroll);
            let totalCountrySummaryDueTemp = countrySumTotalArrPayroll.reduce(
              (a: any, b: any) => a + (b || 0),
              0
            );
            settotalCountrySummaryDue(totalCountrySummaryDueTemp);
            setFeeSummary(feeSummaryPayroll);
            setLoading(false);
          })
          .catch((e: any) => {
            console.log("error e", e);
          });
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
  };

  useEffect(() => {
    previewPageAllApi();
  }, []);

  useEffect(() => {
    if (apiData?.data && feeData?.data) {
      const additionalFeePayroll = feeData.data.find((x: any) => x.type === 5);

      const terminationFeeTempPayroll = apiData.data.payrollFees.find(
        (x: any) => x.feeId === additionalFeePayroll.id
      );

      setContractTerminationFee(terminationFeeTempPayroll?.amount || 0);

      const incomingFeepayroll = feeData.data.find((x: any) => x.type === 1);

      const incomingWirePaymentTempPayroll = apiData.data.payrollFees.find(
        (x: any) => x.feeId === incomingFeepayroll.id
      );
      setIncomingWirePayment(incomingWirePaymentTempPayroll?.amount || 0);

      const totalFeeSummaryTempPayroll =
        apiData.data.countryPayroll.reduce(
          (a: any, b: any) => a + (b.feeSummary.total || 0),
          0
        ) +
        (terminationFeeTempPayroll ? terminationFeeTempPayroll.amount : 0) +
        (incomingWirePaymentTempPayroll
          ? incomingWirePaymentTempPayroll.amount
          : 0);

      setFeeSummaryTotalDue(totalFeeSummaryTempPayroll);
    }
  }, [apiData, feeData]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="preview-invoice-container">
          <div className="preview-invoice-inner-container">
            <div className="preview-header">
              <h3>Invoice Preview</h3>
            </div>
            <div className="preview-para-one">
              <p>Please preview the new payroll invoice has been created.</p>
            </div>
            <div className="preview-para-two">
              <p>
                You can access it right from here or from the Invoice listing
                page.
              </p>
            </div>
            <div className="preview-invoice-button">
              <Button
                data-testid="preview-modal"
                label="Preview Invoice"
                className="primary-blue medium"
                handleOnClick={() => {
                  setIsPreviewModal(true);
                }}
              />
            </div>
          </div>

          <div className="newPayrollInvoiceModal">
            <Modal
              isOpen={isPreviewModal}
              handleClose={() => {
                setIsPreviewModal(false);
              }}
            >
              <div className="body-wrapper-style">
                <div className="newInvoiceTopBar">
                  <div className="newInvoiceInnerHeader">
                    <div className="newInvoiceNoHeader">
                      <div className="orderSummary">
                        <Icon
                          color="#17224E"
                          icon="orderSummary"
                          size="large"
                        />
                      </div>
                      <div className="heading">
                        <p>
                          {"Payroll Invoice No." +
                            apiData?.data?.invoice?.invoiceNo}{" "}
                        </p>
                      </div>
                    </div>
                    <div className="newInvoiceHeaderAmount">
                      <p className="newInvoiceHeaderAmount-one">
                        Open{" "}
                        <span>
                          {getPayrollBillingCurrency()}{" "}
                          {payrollToCurrencyFormat(
                            apiData?.data?.invoice?.invoiceBalance
                          )}
                        </span>
                      </p>
                      <p className="newInvoiceHeaderAmount-two">
                        Total{" "}
                        <span>
                          {getPayrollBillingCurrency()}{" "}
                          {payrollToCurrencyFormat(
                            apiData?.data?.invoice?.totalAmount
                          )}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
           
               <div className="newInfoDetails">
                  <div className="column1">
                    <p className="newInvoiceHeading">From</p>
                    <p className="newInvoiceValue">
                      {apiData?.data?.invoiceFrom?.companyName}
                    </p>
                  </div>
                  <div>
                    <p className="newInvoiceHeading">To</p>
                    <p className="newInvoiceValue valuebold">
                      {apiData?.data?.invoice?.customerName}
                    </p>
                    <p className="newInvoiceAddress">
                      {addressData?.data?.billingAddress?.street}
                    </p>
                    <p className="address">
                      {addressData?.data?.billingAddress?.city}
                    </p>
                    <p className="address">
                      {addressData?.data?.billingAddress?.state}
                    </p>
                    <p className="address">
                      {addressData?.data?.billingAddress?.country}
                    </p>
                  </div>
                  <div>
                    <p className="newInvoiceHeading">Invoice Date</p>
                    <p className="newInvoiceValue">
                      {moment(apiData?.data?.invoice?.createdDate).format(
                        "DD MMM YYYY"
                      )}
                    </p>

                    <p className="newInvoiceHeading">Invoice Approval</p>
                    <p className="newInvoiceValue">
                      {moment(apiData?.data?.invoice?.approvalDate).format(
                        "DD MMM YYYY"
                      )}
                    </p>

                    <p className="newInvoiceHeading">Payment Due</p>
                    <p className="newInvoiceValue">
                      {moment(apiData?.data?.invoice?.dueDate).format(
                        "DD MMM YYYY"
                      )}
                    </p>
                  </div>
                  <div className="newInvoiceLastCloumn">
                    <p className="newInvoiceHeading">Location</p>
                    <p className="newInvoiceValue">
                      {apiData?.data?.invoice?.customerLocation}
                    </p>
                    <p className="newInvoiceHeading">Region</p>
                    <p className="newInvoiceValue">
                      {apiData?.data?.regionItemCode?.toUpperCase()}
                    </p>
                    <p className="newInvoiceHeading">Billing Currency</p>
                    <p className="newInvoiceValue">
                      {getPayrollBillingCurrency()}
                    </p>
                  </div>
                </div>

                {payrollTables.map((item: any) => {
                  return (
                    <div className="newInvoiceEmployeeDetail">
                      <div className="newInvoiceTable">
                        <Table
                          options={{
                            ...newInvoiceEmployeeDetailTable,
                            ...{ data: item.data },
                          }}
                          colSort
                        />
                      </div>
                      <div className="newInvoiceFeeSummaryCalc">
                        <div className="newInvoiceRowFee">
                          <p className="newInvoiceTitle">
                            Country Subtotal Due
                          </p>
                          <p className="newInvoiceAmount">
                            {item.currencyCode +
                              " " +
                              payrollToCurrencyFormat(
                                item.feeSummary.subTotalDue
                              )}
                          </p>
                        </div>
                        <div className="newInvoiceRowFee">
                          <p className="newInvoiceTitle">
                            Country EXC Rate {item.exchangeRate}
                          </p>
                          <p className="newInvoiceAmount">
                            {getPayrollBillingCurrency() +
                              " " +
                              payrollToCurrencyFormat(
                                item.feeSummary.subTotalDue * item.exchangeRate
                              )}
                          </p>
                        </div>
                        <div className="newInvoiceRowFee">
                          <p className="newInvoiceTitle">
                            In Country Processing Fee
                          </p>
                          <p className="newInvoiceAmount">
                            {getPayrollBillingCurrency() +
                              " " +
                              payrollToCurrencyFormat(
                                item.feeSummary.inCountryProcessingFee
                              )}
                          </p>
                        </div>
                        <div className="newInvoiceRowFee">
                          <p className="newInvoiceTitle">FX Bill</p>
                          <p className="newInvoiceAmount">
                            {getPayrollBillingCurrency() +
                              " " +
                              payrollToCurrencyFormat(item.feeSummary.fxBill)}
                          </p>
                        </div>
                        <div className="newInvoiceRow2">
                          <p className="newInvoiceTitle">Total Country VAT</p>
                          <p className="newInvoiceAmount">
                            {getPayrollBillingCurrency() +
                              " " +
                              payrollToCurrencyFormat(
                                item.feeSummary.totalCountryVat
                              )}
                          </p>
                        </div>
                        <div className="newInvoiceTotalRow">
                          <p>Country Total Due</p>
                          <h3>
                            {getPayrollBillingCurrency() +
                              " " +
                              payrollToCurrencyFormat(item.countryTotalDue)}
                          </h3>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="newInvoiceCountrySummary-Container">
                  <h3 className="countryTableHeader">Country Summary</h3>
                  <div className="newInvoiceCountryTable">
                    <Table
                      options={{
                        ...newInvoiceCountrySummaryTable,
                        ...{ data: countrySummary },
                      }}
                      colSort
                    />
                  </div>
                  <div className="newInvoiceCountrySummaryCalc">
                    <p>Total Due</p>
                    <h3>
                      {getPayrollBillingCurrency()}{" "}
                      {payrollToCurrencyFormat(totalCountrySummaryDue)}
                    </h3>
                  </div>

                  <h3 className="countryTableHeader">Fee Summary</h3>
                  <div className="newInvoiceCountryTable">
                    <Table
                      options={{
                        ...newInvoiceFeeSummaryOptions,
                        ...{ data: feeSummary },
                      }}
                      colSort
                    />
                  </div>
                  <div className="newInvoiceFeeSummaryCalc">
                    <div className="newInvoiceRowFee">
                      <p className="title">Incoming Wire Payment</p>
                      <p className="amount">
                        {getPayrollBillingCurrency()}{" "}
                        {payrollToCurrencyFormat(incomingWirePayment)}
                      </p>
                    </div>
                    <div className="newInvoicerow2">
                      <p className="title">Contract Termination Fee</p>
                      <p className="amount">
                        {getPayrollBillingCurrency()}{" "}
                        {payrollToCurrencyFormat(contractTerminationFee)}
                      </p>
                    </div>
                    <div className="newInvoiceTotalRow">
                      <p>Total Due</p>
                      <h3>
                        {getPayrollBillingCurrency()}{" "}
                        {payrollToCurrencyFormat(feeSummaryTotalDue)}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      )}
    </>
  );
};

export default PreviewInvoice;
