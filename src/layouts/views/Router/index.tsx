import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import InvoiceDetails from "../InvoiceDetails";
import InvoiceListing from "../InvoiceListing";
import NewInvoice from "../NewInvoice";
import PaymentDetailPage from "../PaymentDetailPage/paymentDetailPage";

export default function RouterComponent() {
  return (
    // <HashRouter>
    <Routes>
      <Route path="/" element={<InvoiceListing />} />
      <Route path="/newinvoice" element={<NewInvoice />} />
      <Route
        path="/pay/invoicedetails:id/:cid/:isClient/payments"
        element={<PaymentDetailPage />}
      />
      <Route
        path="/invoicedetails:id/:cid/:isClient"
        element={<InvoiceDetails />}
      />
    </Routes>
    //  </HashRouter>
  );
}
