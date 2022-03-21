import { render, screen, fireEvent } from "@testing-library/react";
import ReactDom from "react-dom";
import InvoiceDetails from "..";

it("invoice details renders without crashing", () => {
  const div = document.createElement("div");
  ReactDom.render(<InvoiceDetails />, div);
});

test("tabs are working", () => {
  render(<InvoiceDetails />);
  const payrollTab = screen.getByText(/Payroll Journal/);
  const masterInvoiceTab = screen.getByText(/Master Invoice/);

  fireEvent.click(masterInvoiceTab);
  setTimeout(() => {
    expect(document.querySelector(".tabTextActive")).toBeInTheDocument();
  }, 100);
  fireEvent.click(payrollTab);
  setTimeout(() => {
    expect(document.querySelector(".tabTextPassive")).toBeInTheDocument();
  }, 100);
});

test("Dropdown opens", () => {
  render(<InvoiceDetails />);
  const downloadButton = screen.getByText(/Download/);
  fireEvent.click(downloadButton);
  setTimeout(() => {
    expect(document.querySelector(".openDownloadDropdown")).toBeInTheDocument();
  }, 100);
});
