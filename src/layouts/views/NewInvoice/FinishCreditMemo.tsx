import React, { useEffect, useState } from "react";
import { Button } from "atlasuikit";
import "./FinishCreditMemo.scss";
import { useNavigate } from "react-router-dom";
import { getCreditMemoStep4Data } from "../../../apis/apis";

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
          getCreditMemoStep4Data("3b70a1d7-19fd-44e6-9995-18d0966eb790").then(
            (res: any) => {
              console.log(res);
              navigate(
                "/pay/invoicedetails" +
                  "3b70a1d7-19fd-44e6-9995-18d0966eb790" +
                  "/" +
                  // "a9bbee6d-797a-4724-a86a-5b1a2e28763f" +
                  res.data.customerId +
                  "/" +
                  "true",
                {
                  state: {
                    InvoiceId: "3b70a1d7-19fd-44e6-9995-18d0966eb790",
                    transactionType: 4,
                  },
                }
              );
            }
          );
        }}
        className="primary-blue small"
        label="Go to Invoice"
      />
    </div>
  );
}
