import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import InvoiceDetails from "../InvoiceDetails";
import InvoiceListing from "../InvoiceListing";

export default function RouterComponent() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<InvoiceListing />} />
        <Route path="/invoicedetails" element={<InvoiceDetails />} />
      </Routes>
    </HashRouter>
  );
}
