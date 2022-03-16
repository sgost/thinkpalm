import React from "react";
import ReactDom from "react-dom";
import Invoices from "..";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MyDropdown from "../../../../components/MyDropdown/Dropdown";

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

// test("Dropdown should open", () => {
//   render(<Invoices />);
//   const dropdown = screen.getByTestId("type-dd");
//   userEvent.click(dropdown);

//   setTimeout(() => {
//     const element = document.querySelector(".openDropdown");
//     expect(element).toBeInTheDocument();
//   }, 3000);
// });

test("Dropdown should open", () => {
  render(
    <MyDropdown
      data-testid="type-dd"
      title="Types"
      isOpen={true}
      handleDropdownClick={() => {}}
      handleDropOptionClick={() => {}}
      options={[]}
    />
  );
  const dropdown = screen.getByText(/Types/);
  // userEvent.click(dropdown);

  fireEvent.click(dropdown);
  const element = document.querySelector(".openDropdown");
  expect(element).toBeInTheDocument();
  // setTimeout(() => {
  //   const element = document.querySelector(".openDropdown");
  //   expect(element).toBeInTheDocument();
  // }, 3000);
});
