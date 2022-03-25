import React, { useEffect, useState } from "react";
import { Button, Icon, Table } from "atlasuikit";
import "./invoiceDetails.scss";
import { countrySummaryData, feeSummary, payrollData } from "./mockData";
import spainFlag from "./spainFlag.png";
import getRequest from "../../../components/Comman/api";
import moment from "moment";
import GetFlag from "./getFlag";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function InvoiceDetails() {
  const [activeTab, setActiveTab] = useState("payroll");
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const { id } = useParams();

  const api =
    "https://apigw-uat-emea.apnextgen.com/payrollservice/api/Payroll/" + id;
  const addressApi =
    "https://apigw-uat-emea.apnextgen.com/customerservice/api/Customers/a9bbee6d-797a-4724-a86a-5b1a2e28763f?includes=BillingAddress";

  const countriesApi =
    "https://apigw-uat-emea.apnextgen.com/metadataservice/api/lookup/Countries?includeProperties=Currency&orderBy=Name";

  const feeApi =
    "https://apigw-uat-emea.apnextgen.com/metadataservice/api/Fees";

  const lookupApi =
    "https://apigw-uat-emea.apnextgen.com/metadataservice/api/Lookup";

  const tempToken = localStorage.getItem("temptoken");
  const apiData: any = getRequest(api, tempToken);
  const addressData: any = getRequest(addressApi, tempToken);
  const countriesData: any = getRequest(countriesApi, tempToken);
  const feeData: any = getRequest(feeApi, tempToken);
  const lookupData: any = getRequest(lookupApi, tempToken);

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

  useEffect(() => {
    if (apiData.data) {
      console.log(apiData.data?.invoice?.invoiceNo);
      setInvoiceDetail(apiData.data);
      if (apiData.data.countryPayroll) {
        let data: any = [];
        let tempTotal = 0;
        apiData.data?.countryPayroll.forEach((e: any) => {
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

                img: { src: "https://via.placeholder.com/150" },
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
      }
    }
  }, [apiData]);

  useEffect(() => {
    if (lookupData.data && invoiceDetail) {
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
    console.log("id", id);
    document.addEventListener("click", handleClick);
    return document.removeEventListener("click", handleClick);
  }, []);

  if (!apiData.data) {
    return <p>Loading...</p>;
  }

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
        authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJxa1VoLVl2LWc3c25Zc3ktN1ktZVk0OE5TLTlzdldjWm9aMXFoMzZoYnpjIn0.eyJleHAiOjE2NDgyOTQ0MTMsImlhdCI6MTY0ODE4NTQ4MCwiYXV0aF90aW1lIjoxNjQ4MTIxNjEzLCJqdGkiOiIyMDhlODA5MS1lYzY0LTQ5NzAtYmJiOC1lYTA2ZjFlNjU4NjMiLCJpc3MiOiJodHRwczovL2FjY291bnRzLXVhdC5hcG5leHRnZW4uY29tL2F1dGgvcmVhbG1zL2VsZW1lbnRzZ3MiLCJzdWIiOiI4ZDdkYjFhMi0zMmVmLTRmZDYtODdmNi1mNWMyOGNhNGM1NjgiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhbmd1bGFyLXdlYi1jbGllbnQiLCJub25jZSI6IjUzN2E2MjJmLTVhYjktNDRiNS1iYzFjLThjOTFmNWViZDRkNyIsInNlc3Npb25fc3RhdGUiOiI5NzhiOTQ2NC04ZTZiLTQxNTEtYWQ1Ny05ZWMwNjRjMTdhNGUiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vd3d3LXVhdC5hcG5leHRnZW4uY29tIiwiaHR0cHM6Ly9lbGVtZW50c2dzLW5nLmFwbmV4dGdlbi5jb20iLCJodHRwczovL2VsZW1lbnRzZ3MtdWF0LmFwbmV4dGdlbi5jb20iXSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInJvbGUiOiJBcHByb3ZQYXlPd25lcnMiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImlzRXh0ZXJuYWwiOmZhbHNlLCJuYW1lIjoiUHJlbWthbnQgUHJlbSIsImlkIjoiOGQ3ZGIxYTItMzJlZi00ZmQ2LTg3ZjYtZjVjMjhjYTRjNTY4IiwicHJlZmVycmVkX3VzZXJuYW1lIjoicHJlbWthbnRwQGVsZW1lbnRzZ3MuY29tIiwiZ2l2ZW5fbmFtZSI6IlByZW1rYW50IiwiZmFtaWx5X25hbWUiOiJQcmVtIiwiZW1haWwiOiJwcmVta2FudHBAZWxlbWVudHNncy5jb20ifQ.gLALGnjHACUFJ_j4PL6cOGYQdtrPk8pv8WXJe4ESfqvQbqOc_2UwykN5BlAKz7cThs-mbf_KrLFXCecKcTFaPJ5UfdoopLrK2iVt01dgcu2_c3X_CfpFHPW-mjZhO06Z_eGMzYAu91bpluiiuhnM95P6jBO_7RZ2xnIQC3Rey8GMPYdieGNY4NWrAFUt9z6-Bms7IWRqCdwNdjpiLcFnemBO7lHS05lxvjdVK8D8glhiHpkQ7QXy_3FxMR_lbu60GjdO4nfmmRMxIFfoBCuJtzOyXkhjbBQ9yVPcPSjQeyyaADYADUgFtZ0Z-p0zrnwubx3G9uDxHPQY6wI0-lTWDQ`,
        "x-apng-base-region": "EMEA",
        "x-apng-customer-id": "094b3c66-5787-47ba-9bdc-48762fbd9104",
        "x-apng-external": "false",
        "x-apng-inter-region": "0",
        "x-apng-target-region": "EMEA",
        customer_id: "094b3c66-5787-47ba-9bdc-48762fbd9104",
        // "Content-Type": "application/json",
      },
    };

    const downloadApi = `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/generatePDF/ab327a85-81cb-40a4-8fe4-16b74912d1a7`;
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
        authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJxa1VoLVl2LWc3c25Zc3ktN1ktZVk0OE5TLTlzdldjWm9aMXFoMzZoYnpjIn0.eyJleHAiOjE2NDgyOTQ0MTMsImlhdCI6MTY0ODE4NTQ4MCwiYXV0aF90aW1lIjoxNjQ4MTIxNjEzLCJqdGkiOiIyMDhlODA5MS1lYzY0LTQ5NzAtYmJiOC1lYTA2ZjFlNjU4NjMiLCJpc3MiOiJodHRwczovL2FjY291bnRzLXVhdC5hcG5leHRnZW4uY29tL2F1dGgvcmVhbG1zL2VsZW1lbnRzZ3MiLCJzdWIiOiI4ZDdkYjFhMi0zMmVmLTRmZDYtODdmNi1mNWMyOGNhNGM1NjgiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhbmd1bGFyLXdlYi1jbGllbnQiLCJub25jZSI6IjUzN2E2MjJmLTVhYjktNDRiNS1iYzFjLThjOTFmNWViZDRkNyIsInNlc3Npb25fc3RhdGUiOiI5NzhiOTQ2NC04ZTZiLTQxNTEtYWQ1Ny05ZWMwNjRjMTdhNGUiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vd3d3LXVhdC5hcG5leHRnZW4uY29tIiwiaHR0cHM6Ly9lbGVtZW50c2dzLW5nLmFwbmV4dGdlbi5jb20iLCJodHRwczovL2VsZW1lbnRzZ3MtdWF0LmFwbmV4dGdlbi5jb20iXSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInJvbGUiOiJBcHByb3ZQYXlPd25lcnMiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImlzRXh0ZXJuYWwiOmZhbHNlLCJuYW1lIjoiUHJlbWthbnQgUHJlbSIsImlkIjoiOGQ3ZGIxYTItMzJlZi00ZmQ2LTg3ZjYtZjVjMjhjYTRjNTY4IiwicHJlZmVycmVkX3VzZXJuYW1lIjoicHJlbWthbnRwQGVsZW1lbnRzZ3MuY29tIiwiZ2l2ZW5fbmFtZSI6IlByZW1rYW50IiwiZmFtaWx5X25hbWUiOiJQcmVtIiwiZW1haWwiOiJwcmVta2FudHBAZWxlbWVudHNncy5jb20ifQ.gLALGnjHACUFJ_j4PL6cOGYQdtrPk8pv8WXJe4ESfqvQbqOc_2UwykN5BlAKz7cThs-mbf_KrLFXCecKcTFaPJ5UfdoopLrK2iVt01dgcu2_c3X_CfpFHPW-mjZhO06Z_eGMzYAu91bpluiiuhnM95P6jBO_7RZ2xnIQC3Rey8GMPYdieGNY4NWrAFUt9z6-Bms7IWRqCdwNdjpiLcFnemBO7lHS05lxvjdVK8D8glhiHpkQ7QXy_3FxMR_lbu60GjdO4nfmmRMxIFfoBCuJtzOyXkhjbBQ9yVPcPSjQeyyaADYADUgFtZ0Z-p0zrnwubx3G9uDxHPQY6wI0-lTWDQ`,
        "x-apng-base-region": "EMEA",
        "x-apng-customer-id": "094b3c66-5787-47ba-9bdc-48762fbd9104",
        "x-apng-external": "false",
        "x-apng-inter-region": "0",
        "x-apng-target-region": "EMEA",
        customer_id: "094b3c66-5787-47ba-9bdc-48762fbd9104",
        // "Content-Type": "application/json",
      },
    };

    const downloadApi = `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/generateExcel/ab327a85-81cb-40a4-8fe4-16b74912d1a7`;
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

  return (
    <div className="invoiceDetailsContainer">
      <div className="invoiceDetailsHeaderRow">
        <div className="breadcrumbs">
          <p className="text">Invoices</p>
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
        <p className="tabTextPassive">Files & Notes</p>
      </div>
      {activeTab === "master" ? (
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
      ) : (
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
    </div>
  );
}
