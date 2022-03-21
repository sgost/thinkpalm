import React, { useState } from "react";
import { Button, Icon, Table } from "atlasuikit";
import "./invoiceDetails.scss";
import { countrySummaryData, feeSummary, payrollData } from "./mockData";
import spainFlag from "./spainFlag.png";

export default function InvoiceDetails() {
  const [activeTab, setActiveTab] = useState("payroll");
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  return (
    <div className="invoiceDetailsContainer">
      <div className="invoiceDetailsHeaderRow">
        <div className="breadcrumbs">
          <p className="text">Invoices</p>
          <Icon className="icon" icon="chevronRight" size="medium" />
          <p className="text">Payroll Invoice No. 791230</p>
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
              <p>Invoice as PDF</p>
              <p>Invoice as Excel</p>
              <p>Employee Breakdown</p>
            </div>
          )}

          <Button
            className="primary-blue small"
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
          <p className="status">Pending Approval</p>

          <div className="row">
            <div className="invoiceNo">
              <Icon
                color="#FFFFFF"
                icon="orderSummary"
                size="small"
                title="Order Summary"
              />
              <p>Payroll Invoice No. 791230</p>
            </div>
            <div className="amount">
              <p>
                Open <span>USD 300,523.15</span>
              </p>
              <p>
                Total <span>USD 300,523.15</span>
              </p>
            </div>
          </div>
        </div>

        <div className="infoDetails">
          <div className="column1">
            <p className="heading">From</p>
            <p className="value">Elements Global Services</p>
          </div>
          <div>
            <p className="heading">To</p>
            <p className="value">ToGlobal Enterprise Solutions</p>
            <p>
              1101 15th Street NW90001, Los Angeles, CAUnited States of America
            </p>
            <p>PO Number</p>
            <input />
          </div>
          <div>
            <p className="heading">Invoice Date</p>
            <p className="value">01 Nov 2021</p>
            <p className="heading">Invoice Changes</p>
            <p className="value">05 Nov 2021</p>
            <p className="heading">Payment Due</p>
            <p className="value">10 Nov 2021</p>
          </div>
          <div className="lastCloumn">
            <p className="heading">Location</p>
            <p className="value">USA – United States of America</p>
            <p className="heading">Region</p>
            <p className="value">Americas</p>
            <p className="heading">Billing Currency</p>
            <p className="value">USD</p>
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
          <div>
            <div className="countryHeader">
              <img src={spainFlag} alt="flag" />
              <h3>Spain</h3>
            </div>
            <Table options={payrollData} colSort />
            <div className="feeSummaryCalc">
              <div className="row">
                <p className="title">Country Subtotal Due</p>
                <p className="amount">EUR 271,410.90</p>
              </div>
              <div className="row">
                <p className="title">Country EXC Rate 0.75355</p>
                <p className="amount">USD 121,411.98</p>
              </div>
              <div className="row">
                <p className="title">In Coutry Processing Fee</p>
                <p className="amount">USD 0.00</p>
              </div>
              <div className="row">
                <p className="title">FX Bill</p>
                <p className="amount">USD 1,821.17</p>
              </div>
              <div className="row2">
                <p className="title">Total Country VAT</p>
                <p className="amount">USD 0.00</p>
              </div>
              <div className="totalRow">
                <p>Country Total Due</p>
                <h3>USD 271,410.90</h3>
              </div>
            </div>
          </div>
          <div>
            <div className="countryHeader">
              <img src={spainFlag} alt="flag" />
              <h3>Spain</h3>
            </div>
            <Table options={payrollData} colSort />
            <div className="feeSummaryCalc">
              <div className="row">
                <p className="title">Country Subtotal Due</p>
                <p className="amount">EUR 271,410.90</p>
              </div>
              <div className="row">
                <p className="title">Country EXC Rate 0.75355</p>
                <p className="amount">USD 121,411.98</p>
              </div>
              <div className="row">
                <p className="title">In Coutry Processing Fee</p>
                <p className="amount">USD 0.00</p>
              </div>
              <div className="row">
                <p className="title">FX Bill</p>
                <p className="amount">USD 1,821.17</p>
              </div>
              <div className="row2">
                <p className="title">Total Country VAT</p>
                <p className="amount">USD 0.00</p>
              </div>
              <div className="totalRow">
                <p>Country Total Due</p>
                <h3>USD 271,410.90</h3>
              </div>
            </div>
          </div>

          <div className="totalContainer">
            <div>
              <p>Total</p>
              <h3>USD 300,523.15</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
