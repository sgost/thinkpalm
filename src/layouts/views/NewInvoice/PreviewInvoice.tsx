import React, { useState } from 'react'
import { Button, Modal } from "atlasuikit";
import "./PreviewInvoice.scss"


const previewInvoice = ({
  handleSteps,
  handleAllSteppersData,
  allStepsData,
}: any) => {

  const[isPreviewModal, setIsPreviewModal] = useState(false)
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
      <div>
        <Modal
        isOpen={isPreviewModal}
        handleClose={() => {
          setIsPreviewModal(false)
         }}
        ></Modal>
      </div>
    </div>
  )
}

export default previewInvoice