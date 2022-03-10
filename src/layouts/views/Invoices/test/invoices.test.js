import React from "react";
import ReactDom from "react-dom";
import Invoices from "..";
import { render } from "@testing-library/react";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDom.render(<Invoices />, div);
});

// test("Should render tabs", () => {
//   render(<Invoices />);
//   const element = document.querySelector(".tab");
//   expect(element).toBeInTheDocument();
// });

test("Should render dropdowns", () => {
  render(<Invoices />);
  const element = document.querySelector(".dropdowns");
  expect(element).toBeInTheDocument();
});

test("Should render table", () => {
  render(<Invoices />);
  const element = document.querySelector(".table");
  expect(element).toBeInTheDocument();
});
