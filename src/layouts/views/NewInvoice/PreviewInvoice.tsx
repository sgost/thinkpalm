import React, { useState } from 'react'
import { Button, Modal, Icon, Table } from "atlasuikit";
import "./PreviewInvoice.scss"


const previewInvoice = ({
  handleSteps,
  handleAllSteppersData,
  allStepsData,
}: any) => {

  const [isPreviewModal, setIsPreviewModal] = useState(false)

  const newInvoiceEmployeeDetailTable: any = {
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
    data: [
      {
        employeeID: "73917",
        name: "Camila Lopez",
        grossWages: "USD 20,000.00",
        allowances: "USD 200.00",
        expenseReimb: "USD 400.00",
        employerLiability: "USD 7,210.00",
        countryVAT: "0.63",
        adminFees: "USD 650.00",
        healthcareBenefits: "USD 0.00"
      }
    ],
    showDefaultColumn: true,
  };

  const newInvoiceCountrySummaryTable: any = {
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
        header: "Exchange Rate",
        isDefault: true,
        key: "exchangeRate",
      },
      {
        header: "Total in USD",
        isDefault: true,
        key: "total",
      },
    ],
    data: [
      {
        country: "Spain",
        currency: "EUR",
        employees: "14",
        grossWages: "95,000",
        allowances: "13,690",
        expenseReimb: "950.00",
        employerLiability: "2,000.00",
        countryVAT: "0.00",
        exchangeRate: "0.75355",
        total: "121,411.97"
      }
    ],  
    showDefaultColumn: true,
  }

  return (
    <div className='preview-invoice-container'>
      <div className='preview-invoice-inner-container'>
        <div className='preview-header'>
          <h3>Invoice Preview</h3>
        </div>
        <div className='preview-para-one'>
          <p>Please preview the new payroll invoice has been created.</p>
        </div>
        <div className='preview-para-two'>
          <p>You can access it right from here or from the Invoice listing page.</p>
        </div>
        <div className='preview-invoice-button'>
          <Button
            data-testid=""
            label="Preview Invoice"
            className="primary-blue medium"
            handleOnClick={() => {
              setIsPreviewModal(true)
            }}
          />
        </div>
      </div>
      <div className='preview-invoice-button-container'>
        <div>
          <Button
            data-testid=""
            icon={{
              icon: "chevronLeft",
              size: "medium",
              color: "#fff",
            }}
            className="primary-blue medium previous-button"
            label="Previous"
            handleOnClick={() => {
              handleSteps(2);
            }}
          />
        </div>
        <div>
          <Button
            data-testid=""
            icon={{
              icon: "chevronRight",
              size: "medium",
              color: "#fff",
            }}
            label="Next"
            className="primary-blue medium button next-button"
            handleOnClick={() => {
              handleSteps(4);
              handleAllSteppersData({}, 4);
            }}
          />
        </div>
      </div>
      <div className='newPayrollInvoiceModal'>
        <Modal
          isOpen={isPreviewModal}
          handleClose={() => {
            setIsPreviewModal(false)
          }}
        >
          <div className='newPayrollInvoiceInfo'>
            <div className='newInvoiceTopBar'>
              <div className="newInvoiceNoHeader">
                <Icon color="#FFFFFF" icon="orderSummary" size="large" />
                <p>Payroll Invoice No. 791230 </p>
              </div>
              <div className='newInvoiceAmount'>
                <div>USD 300,523.15</div>
                <div>USD 300,523.15</div>
              </div>

            </div>

            <div className="newInfoDetails">
              <div className="column1">
                <p className="newInvoiceHeading">From</p>
                <p className="newInvoiceValue">Elements Global Services</p>
              </div>
              <div>
                <p className="newInvoiceHeading">To</p>
                <p className="newInvoiceValue">Camila Lopez</p>
                <p className="newInvoiceAddress">
                  1101 15th Street NW 90001, Los Angeles, CA United States of America
                </p>

              </div>
              <div>
                <p className="newInvoiceHeading">Invoice Date</p>
                <p className="newInvoiceValue">
                  01 Nov 2021
                </p>

                <p className="newInvoiceHeading">Invoice Approval</p>
                <p className="newInvoiceValue">
                  05 Nov 2021
                </p>

                <p className="newInvoiceHeading">Payment Due</p>
                <p className="newInvoiceValue">
                  10 Nov 2021
                </p>

              </div>
              <div className="newInvoiceLastCloumn">
                <p className="newInvoiceHeading">Location</p>
                <p className="newInvoiceValue">Nigeria</p>
                <p className="newInvoiceHeading">Region</p>
                <p className="newInvoiceValue">
                  EMEA
                </p>
                <p className="newInvoiceHeading">Billing Currency</p>
                <p className="newInvoiceValue">USD</p>
              </div>
            </div>

            <div className='newInvoiceEmployeeDetail'>
              <div className='newInvoiceTable'>
                <Table
                  options={{
                    ...newInvoiceEmployeeDetailTable,
                  }}
                  colSort
                />
              </div>
              <div className="newInvoiceFeeSummaryCalc">
                <div className="newInvoiceRowFee">
                  <p className="newInvoiceTitle">Country Subtotal Due</p>
                  <p className="newInvoiceAmount">
                    USD 161,120.90
                  </p>
                </div>
                <div className="newInvoiceRowFee">
                  <p className="newInvoiceTitle">
                    Country EXC Rate 0.75355
                  </p>
                  <p className="newInvoiceAmount">
                    USD 121,411.98
                  </p>
                </div>
                <div className="newInvoiceRowFee">
                  <p className="newInvoiceTitle">In Country Processing Fee</p>
                  <p className="newInvoiceAmount">
                    USD 0.00
                  </p>
                </div>
                <div className="newInvoiceRowFee">
                  <p className="newInvoiceTitle">FX Bill</p>
                  <p className="newInvoiceAmount">
                    USD 1,821.17
                  </p>
                </div>
                <div className="newInvoiceRow2">
                  <p className="newInvoiceTitle">Total Country VAT</p>
                  <p className="newInvoiceAmount">
                    USD 0.00
                  </p>
                </div>
                <div className="newInvoiceTotalRow">
                  <p>Country Total Due</p>
                  <h3>
                    USD 130,913.15
                  </h3>
                </div>
              </div>
            </div>

            {/* <div className="newInvoiceCountrySummary-Container">
              <h3 className="countryTableHeader">Country Summary</h3>
              <div className='newInvoiceCountryTable'>
                <Table
                  options={{ ...newInvoiceCountrySummaryTable }}
                  colSort
                />
              </div>
              <div className="newInvoiceCountrySummaryCalc">
                <p>Total Due</p>
                <h3>
                  USD 300,523.15
                </h3>
              </div> */}

              {/* <h3 className="countryTableHeader">Fee Summary</h3>
              <div>
                <Table
                  options={{ ...feeSummaryOptions, ...{ data: feeSummary } }}
                  colSort
                />
              </div>
              <div className="feeSummaryCalc">
                <div className="rowFee">
                  <p className="title">Incoming Wire Payment</p>
                  <p className="amount">
                    USD 35.00
                  </p>
                </div>
                <div className="row2">
                  <p className="title">Contract Termination Fee</p>
                  <p className="amount">
                    USD 0.00
                  </p>
                </div>
                <div className="totalRow">
                  <p>Total Due</p>
                  <h3>
                    USD 37,897.93
                  </h3>
                </div>
              </div> */}
            {/* </div> */}

          </div>
        </Modal>
      </div>
    </div>
  )
}

export default previewInvoice