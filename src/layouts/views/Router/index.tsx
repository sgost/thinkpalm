import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import InvoiceDetails from "../InvoiceDetails";
import InvoiceListing from "../InvoiceListing";

export default function Router() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/pay">
          <Route path="" element={<InvoiceListing />} />
          <Route path="/pay/invoicedetails" element={<InvoiceDetails />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
