import React from "react";
import ReactDom from "react-dom";
import Invoices from "..";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MyDropdown from "../../../../components/MyDropdown/Dropdown";
import { HashRouter } from "react-router-dom";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDom.render(
    <HashRouter>
      <Invoices />
    </HashRouter>,
    div
  );
});

test("Client View", () => {
  render(
    <HashRouter>
      <Invoices />
    </HashRouter>
  );

  const clientView = screen.getByText(/Client View/);
  fireEvent.click(clientView);
});

test("Internal View", () => {
  render(
    <HashRouter>
      <Invoices />
    </HashRouter>
  );

  const clientView = screen.getByText(/Internal View/);
  fireEvent.click(clientView);
});

// test("Date picker", () => {
//   render(
//     <HashRouter>
//       <Invoices />
//     </HashRouter>
//   );

//   const clientView = screen.getAllByText(/Date/);
//   fireEvent.click(clientView[0]);
// });

// test("Should render dropdowns", () => {
//   render(
//     <HashRouter>
//       <Invoices />
//     </HashRouter>
//   );

//   const clientView = screen.getByText(/Client View/);
//   fireEvent.click(clientView);

//   setTimeout(() => {
//     const element = document.querySelector(".dropdowns");
//     expect(element).toBeInTheDocument();
//   }, 100);
// });

// test("Should render table", () => {
//   render(
//     <HashRouter>
//       <Invoices />
//     </HashRouter>
//   );

//   const clientView = screen.getByText(/Client View/i);
//   fireEvent.click(clientView);

//   setTimeout(() => {
//     const element = document.querySelector(".table");
//     expect(element).toBeInTheDocument();
//   }, 100);
// });

// test("Dropdown should open", () => {
//   let fn = jest.fn();

//   render(
//     <MyDropdown
//       data-testid="type-dd"
//       title="Types"
//       isOpen={true}
//       handleDropdownClick={() => fn()}
//       handleDropOptionClick={() => fn()}
//       options={[
//         {
//           isSelected: false,
//           label: "Contractor Invoice",
//           value: "contractorInvoice",
//         },
//       ]}
//     />
//   );
//   const dropdown = screen.getByText(/Types/);

//   fireEvent.click(dropdown);
//   const option = document.querySelector(".openDropdownOption");
//   fireEvent.click(option);

//   expect(fn).toBeCalled();
//   // setTimeout(() => {
//   //   expect(document.querySelector("text").textContent).toBe(
//   //     "Contractor Invoice"
//   //   );
//   // }, 100);
//   fireEvent.click(dropdown);
//   setTimeout(() => {
//     expect(document.querySelector(".openDropdown .icon")).toBeInTheDocument();
//   }, 100);
// });

// test("Datepicker dropwdown working", () => {
//   render(
//     <HashRouter>
//       <Invoices />
//     </HashRouter>
//   );

//   const clientView = screen.getByText(/Client View/i);
//   fireEvent.click(clientView);

//   setTimeout(() => {
//     const datepicker = screen.getByTestId("datedd");
//     fireEvent.click(datepicker);
//     setTimeout(() => {
//       expect(
//         document.querySelector(".openDropdownDatepicker")
//       ).toBeInTheDocument();
//     }, 100);
//   }, 100);
// });

// test("Types  dropwdown working", () => {
//   render(
//     <HashRouter>
//       <Invoices />
//     </HashRouter>
//   );

//   const clientView = screen.getByText(/Client View/i);
//   fireEvent.click(clientView);

//   setTimeout(() => {
//     const types = screen.getByText(/Types/);
//     fireEvent.click(types);
//     setTimeout(() => {
//       expect(document.querySelector(".openDropdown")).toBeInTheDocument();
//       const option = screen.getByText(/Contractor Invoice/);
//       fireEvent.click(option);
//       setTimeout(() => {
//         expect(document.querySelector(".openDropdown")).not.toBeInTheDocument();
//       }, 100);
//     }, 100);
//   }, 100);
// });

// test("Status  dropwdown working", () => {
//   render(
//     <HashRouter>
//       <Invoices />
//     </HashRouter>
//   );

//   const clientView = screen.getByText(/Client View/i);
//   fireEvent.click(clientView);

//   setTimeout(() => {
//     const status = screen.getAllByText(/Status/);
//     // console.log(types);
//     fireEvent.click(status[0]);
//     setTimeout(() => {
//       expect(document.querySelector(".openDropdown")).toBeInTheDocument();
//       const option = screen.getbyText(/Approved/);
//       fireEvent.click(option);
//       setTimeout(() => {
//         expect(document.querySelector(".openDropdown"))
//           .not()
//           .toBeInTheDocument();
//       }, 100);
//     }, 100);
//   }, 100);
// });

// test("table click navigation", () => {
//   render(
//     <HashRouter>
//       <Invoices />
//     </HashRouter>
//   );

//   const clientView = screen.getByText(/Client View/i);
//   fireEvent.click(clientView);

//   setTimeout(() => {
//     // const tblrow = document.querySelector(".table__row");
//     const invoceNo = screen.getByText(/Invoice No./);
//     const tblrow = within(invoceNo).getAllByRole("generic");
//     // console.log("tbl row", tblrow);
//     fireEvent.click(tblrow[2]);
//     expect(document.querySelector(".abc")).toBeInTheDocument();
//     setTimeout(() => {}, 100);
//   }, 100);
// });
