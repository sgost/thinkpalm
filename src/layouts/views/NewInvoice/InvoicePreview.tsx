import React from 'react'

const InvoicePreview = ({handleSteps}:any) => {
  return (
    <>
    <div>InvoicePreview</div>
    <button onClick={() => handleSteps(4)}>next</button>
    </>
  )
}

export default InvoicePreview