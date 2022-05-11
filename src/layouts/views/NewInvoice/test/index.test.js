import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";
import { HashRouter } from "react-router-dom";
import MockAdapter from "axios-mock-adapter";
import { mockapidata } from "./mockData";
import axios from "axios";
import NewInvoice from "..";
import { urls, getCountryByCustomer, getEmployee } from "../../../../urls/urls";


localStorage.setItem("accessToken", "1234");
const id = "e291c9f0-2476-4237-85cb-7afecdd085d3";
const customerId = "e291c9f0-2476-4237-85cb-7afecdd085d3";
const countryId = "7defc4f9-906d-437f-a6d9-c822ca2ecfd7";

describe("New Invoice", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock
      .onGet(
        urls.customers
      )
      .reply(200, mockapidata.resGetAllCustomer);

    mock
      .onGet(
        getCountryByCustomer(id)
      )
      .reply(200, mockapidata.resGetAllCountry);


  });

  test("breadcumbs are working", async () => {
    render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const newInvoice = await screen.findAllByText(/New Invoice/);

    expect(newInvoice[0]).toBeInTheDocument();
    const invoiceBreadClick = await screen.findAllByText(/Invoices/);
    expect(invoiceBreadClick[0]).toBeInTheDocument();
    fireEvent.click(invoiceBreadClick[0]);


  });
  test("dropDown Value change stepper 1", async () => {
    render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const newInvoice = await screen.findAllByText(/New Invoice/);

    expect(newInvoice[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const customerDropValue = await screen.findByText(/Cocacola/);
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);


    fireEvent.click(pleaseSelectDropDown[1]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);


    fireEvent.click(pleaseSelectDropDown[2]);
    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);


    fireEvent.click(pleaseSelectDropDown[3]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    fireEvent.click(pleaseSelectDropDown[4]);
    const YearDropValue = await screen.findByText(/2022/);
    expect(YearDropValue).toBeInTheDocument();
    fireEvent.click(YearDropValue);


    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

  });
});


describe("step one getCustomer api fail ", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);
    mock
      .onGet(
        urls.customers
      )
      .reply(400, mockapidata.resGetAllCustomer);
  });

  test("dropDown Value change", async () => {
    render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const newInvoice = await screen.findAllByText(/New Invoice/);
    expect(newInvoice[0]).toBeInTheDocument();
  });
});


describe("step one getCOuntry api fail", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock
      .onGet(
        urls.customers
      )
      .reply(200, mockapidata.resGetAllCustomer);

    mock
      .onGet(
        getCountryByCustomer(id)
      )
      .reply(400, mockapidata.resGetAllCountry);
  });

  test("dropDown Value change", async () => {
    render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const newInvoice = await screen.findAllByText(/New Invoice/);

    expect(newInvoice[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const customerDropValue = await screen.findByText(/Cocacola/);
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

  });
});


describe("Stepper 2", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock
      .onGet(
        urls.customers
      )
      .reply(200, mockapidata.resGetAllCustomer);

    mock
      .onGet(
        getCountryByCustomer(id)
      )
      .reply(200, mockapidata.resGetAllCountry);
      mock
      .onGet(
        // getEmployee(customerId,countryId)
      )
      .reply(200, mockapidata.resForStepperTwo);
  });

  test("dropDown Value change stepper 1 then stepper 2 complete and next button", async () => {
    render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const payrollTab = await screen.findAllByText(/New Invoice/);

    expect(payrollTab[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const customerDropValue = await screen.findByText(/Cocacola/);
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);


    fireEvent.click(pleaseSelectDropDown[1]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);


    fireEvent.click(pleaseSelectDropDown[2]);
    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);


    fireEvent.click(pleaseSelectDropDown[3]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    fireEvent.click(pleaseSelectDropDown[4]);
    const YearDropValue = await screen.findByText(/2022/);
    expect(YearDropValue).toBeInTheDocument();
    fireEvent.click(YearDropValue);


    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);


    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();


    const stepTwoNextButton = await screen.findByTestId("next-button-steptwo");
    expect(stepTwoNextButton).toBeInTheDocument();
    fireEvent.click(stepTwoNextButton);



  });

  test("dropDown Value change stepper 1 then stepper 2 click on  back button", async () => {
    render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const newInvoice = await screen.findAllByText(/New Invoice/);

    expect(newInvoice[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const customerDropValue = await screen.findByText(/Cocacola/);
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);


    fireEvent.click(pleaseSelectDropDown[1]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);


    fireEvent.click(pleaseSelectDropDown[2]);
    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);


    fireEvent.click(pleaseSelectDropDown[3]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    fireEvent.click(pleaseSelectDropDown[4]);
    const YearDropValue = await screen.findByText(/2022/);
    expect(YearDropValue).toBeInTheDocument();
    fireEvent.click(YearDropValue);


    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);


    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();


    const stepTwoBackButton = await screen.findByTestId("back-button-steptwo");
    expect(stepTwoBackButton).toBeInTheDocument();
    fireEvent.click(stepTwoBackButton);

  });

});


describe("Stepper 2 show table click", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock
      .onGet(
        urls.customers
      )
      .reply(200, mockapidata.resGetAllCustomer);

    mock
      .onGet(
        getCountryByCustomer(id)
      )
      .reply(200, mockapidata.resGetAllCountry);
      mock
      .onGet(
        getEmployee(customerId,countryId)
      )
      .reply(200, mockapidata.resForStepperTwo);
  });



  test("dropDown Value change stepper 1 then stepper 2 click on  ", async () => {
    render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const newInvoice = await screen.findAllByText(/New Invoice/);

    expect(newInvoice[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const customerDropValue = await screen.findByText(/Cocacola/);
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);


    fireEvent.click(pleaseSelectDropDown[1]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);


    fireEvent.click(pleaseSelectDropDown[2]);
    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);


    fireEvent.click(pleaseSelectDropDown[3]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    fireEvent.click(pleaseSelectDropDown[4]);
    const YearDropValue = await screen.findByText(/2022/);
    expect(YearDropValue).toBeInTheDocument();
    fireEvent.click(YearDropValue);


    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);


    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();


    const showTable = await screen.findByTestId("showHide-button");
    expect(showTable).toBeInTheDocument();
    fireEvent.click(showTable);

  });

});




