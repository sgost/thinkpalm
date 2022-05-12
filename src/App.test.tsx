import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { HashRouter } from "react-router-dom";
import { currentOrgForListing } from "./layouts/views/NewInvoice/test/mockData";

test("renders learn react link", () => {
  localStorage.setItem("current-org", JSON.stringify(currentOrgForListing));
  render(
    // <HashRouter>
    <App />
    // </HashRouter>
  );
  // const linkElement = screen.getByText(/Pay/i);
  // expect(linkElement).toBeInTheDocument();
});
