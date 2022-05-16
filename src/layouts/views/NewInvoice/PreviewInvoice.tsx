import React, { useState } from 'react'
import { Button, Modal, Icon, Table } from "atlasuikit";
import { getFlagPath } from "../InvoiceDetails/getFlag";
import "./PreviewInvoice.scss"


const previewInvoice = ({
  accessToken,
  newInvoiceEmployeeDetailTable,
  newInvoiceCountrySummaryTable,
  newInvoiceFeeSummaryOptions
}: any) => {

  const [isPreviewModal, setIsPreviewModal] = useState(false)


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
    
      <div className='newPayrollInvoiceModal'>
        <Modal
          isOpen={isPreviewModal}
          handleClose={() => {
            setIsPreviewModal(false)
          }}
        >
          <div className='body-wrapper-style'>

            <div className='newInvoiceTopBar'>
              <div className='newInvoiceInnerHeader'>
                <div className="newInvoiceNoHeader">
                  <div className='orderSummary'>
                    <Icon color="#000" icon="orderSummary" size="large" />
                  </div>
                  <div className='heading'>
                    <p>Payroll Invoice No. 791230 </p>
                  </div>
                </div>
                <div className='newInvoiceHeaderAmount'>
                  <div className='newInvoiceHeaderAmount-one'>USD 300,523.15</div>
                  <div className='newInvoiceHeaderAmount-two'>USD 300,523.15</div>
                </div>
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

            <div className="newInvoiceCountrySummary-Container">
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
              </div>

              <h3 className="countryTableHeader">Fee Summary</h3>
              <div className='newInvoiceCountryTable'>
                <Table
                  options={{ ...newInvoiceFeeSummaryOptions }}
                  colSort
                />
              </div>
              <div className="newInvoiceFeeSummaryCalc">
                <div className="newInvoiceRowFee">
                  <p className="title">Incoming Wire Payment</p>
                  <p className="amount">
                    USD 35.00
                  </p>
                </div>
                <div className="newInvoicerow2">
                  <p className="title">Contract Termination Fee</p>
                  <p className="amount">
                    USD 0.00
                  </p>
                </div>
                <div className="newInvoiceTotalRow">
                  <p>Total Due</p>
                  <h3>
                    USD 37,897.93
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default previewInvoice