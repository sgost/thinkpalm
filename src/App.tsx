import React from "react";
import { HashRouter } from "react-router-dom";
import Invoices from "./layouts/views/Invoices";
import Router from "./layouts/views/Router";

function App() {
  return (
    <div className="main-page-container">
      <div className="main-container">
        <HashRouter>
          <Invoices />
        </HashRouter>
      </div>
    </div>
  );
}

export default App;
