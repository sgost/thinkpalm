import React from "react";
import logo from "./logo.svg";
// import "./App.css";
import Invoices from "./layouts/views/Invoices";

function App() {
  return (
    <div className="main-page-container">
      <div className="main-container">
        <Invoices />
      </div>
    </div>
  );
}

export default App;
