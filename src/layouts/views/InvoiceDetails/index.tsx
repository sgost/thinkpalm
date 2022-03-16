import React from "react";
import { Button, Icon, Table } from "atlasuikit";
import "./invoiceDetails.scss";
import { countrySummaryData } from "./mockData";

export default function InvoiceDetails() {
  return (
    <div className="invoiceDetailsContainer">
      <div className="invoiceDetailsHeaderRow">
        <div className="breadcrumbs">
          <p className="text">Invoices</p>
          <Icon className="icon" icon="chevronRight" size="medium" />
          <p className="text">Payroll Invoice No. 791230</p>
        </div>
        <div className="buttons">
          <div className="download">
            <p className="text">Download</p>
            <Icon
              className="icon"
              color="#526fd6"
              icon="chevronDown"
              size="medium"
            />
          </div>

          <Button
            className="primary-blue small"
            icon={{
              color: "#fff",
              icon: "checkMark",
              size: "medium",
            }}
            label="Primary Button"
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
        <p className="tabTextPassive">Payroll Journal</p>
        <p className="tabTextActive">Master Invoice</p>
        <p className="tabTextPassive">Files & Notes</p>
      </div>

      <h3>Country Summary</h3>
      <Table options={countrySummaryData} colSort />
      <div className="countrySummaryCalc">
        <p>Total Due</p>
        <h3>USD 300,523.15</h3>
      </div>
      <h3>Fee Summary</h3>
    </div>
  );
}
