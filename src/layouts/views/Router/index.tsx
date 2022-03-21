import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import InvoiceDetails from "../InvoiceDetails";
import Invoices from "../Invoices";

export default function Router() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Invoices />} />
        <Route path="/details" element={<InvoiceDetails />} />
      </Routes>
    </HashRouter>
  );
}
