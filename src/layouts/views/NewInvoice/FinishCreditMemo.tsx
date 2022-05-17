import React from "react";
import { Button } from "atlasuikit";
import "./FinishCreditMemo.scss";
import { useNavigate } from "react-router-dom";

export default function FinishCreditMemo() {
  const navigate = useNavigate();
  return (
    <div className="finishCreditMemoContainer">
      <p className="finish">Finish</p>
      <p className="done">You’re done!</p>
      <p className="msg">
        A new payroll invoice has been created. You can access it right from
        here or from the Invoices listing page.
      </p>
      <Button
        handleOnClick={() => {
          navigate(
            "/pay/invoicedetails" +
              "3b70a1d7-19fd-44e6-9995-18d0966eb790" +
              "/" +
              "a9bbee6d-797a-4724-a86a-5b1a2e28763f" +
              "/" +
              "true",
            {
              state: {
                InvoiceId: "2313",
                transactionType: 4,
              },
            }
          );
        }}
        className="primary-blue small"
        label="Go to Invoice"
      />
    </div>
  );
}
