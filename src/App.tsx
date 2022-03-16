import React from "react";
import logo from "./logo.svg";
import Invoices from "./layouts/views/Invoices";
import { HashRouter, Route, Routes } from "react-router-dom";
import InvoiceDetails from "./layouts/views/InvoiceDetails";

function App() {
  return (
    <HashRouter>
      <div className="main-page-container">
        <div className="main-container">
          <Routes>
            <Route path="/" element={<Invoices />} />
            <Route path="/details" element={<InvoiceDetails />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
}

export default App;
