import React, { useEffect, useState } from "react";
import { Button } from "atlasuikit";
import "./FinishCreditMemo.scss";
import { useNavigate } from "react-router-dom";
import { getCreditMemoStep4Data } from "../../../apis/apis";

export default function FinishCreditMemo({ invoiceId }: any) {
  const navigate = useNavigate();
  const currentRoles = JSON.parse(localStorage.getItem("current-org") || "");

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
          getCreditMemoStep4Data(invoiceId).then((res: any) => {
            console.log(res);
            if(res.status == 200 || res.statu == 201){
              navigate(
                "/pay/invoicedetails" +
                  invoiceId +
                  "/" +
                  // "a9bbee6d-797a-4724-a86a-5b1a2e28763f" +
                  res.data.customerId +
                  "/" +
                  (currentRoles?.Payments?.Role === "Customer"),
                {
                  state: {
                    InvoiceId: res.data.invoiceNo,
                    transactionType: res.data.transactionType,
                  },
                }
              );
            }
            
          });
        }}
        className="primary-blue small"
        label="Go to Invoice"
      />
    </div>
  );
}
