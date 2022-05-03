import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import InvoiceDetails from "../InvoiceDetails";
import InvoiceListing from "../InvoiceListing";
import NewInvoice from "../NewInvoice";

export default function RouterComponent() {
  return (
    // <HashRouter>
    <Routes>
      <Route path="/" element={<InvoiceListing />} />
      <Route path="/newinvoice" element={<NewInvoice />} />
      <Route
        path="/invoicedetails:id/:cid/:isClient"
        element={<InvoiceDetails />}
      />
    </Routes>
    //  </HashRouter>
  );
}
