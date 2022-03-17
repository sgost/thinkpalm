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

test("Dropdown should open", () => {
  let fn = jest.fn();

  render(
    <MyDropdown
      data-testid="type-dd"
      title="Types"
      isOpen={true}
      handleDropdownClick={() => fn()}
      handleDropOptionClick={() => {}}
      options={[
        {
          isSelected: false,
          label: "Contractor Invoice",
          value: "contractorInvoice",
        },
      ]}
    />
  );
  const dropdown = screen.getByText(/Types/);

  fireEvent.click(dropdown);
  const option = document.querySelector(".openDropdownOption");
  fireEvent.click(option);

  expect(fn.mock.calls.length).toBe(2);
});
