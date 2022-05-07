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


localStorage.setItem("temptoken", "1234");

describe("New Invoice", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock
      .onGet(
        "https://apigw-dev-eu.atlasbyelements.com/cs/api/Customer/GetAll"
      )
      .reply(200, mockapidata.resGetAllCustomer);

    mock
      .onGet(
        "https://apigw-dev-eu.atlasbyelements.com/atlas-subscriptionservice/api/Subscription/GetEORSubscriptionCountriesByCustomer?CustomerId=e291c9f0-2476-4237-85cb-7afecdd085d3"
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
        "https://apigw-dev-eu.atlasbyelements.com/cs/api/Customer/GetAll"
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
        "https://apigw-dev-eu.atlasbyelements.com/cs/api/Customer/GetAll"
      )
      .reply(200, mockapidata.resGetAllCustomer);

    mock
      .onGet(
        "https://apigw-dev-eu.atlasbyelements.com/atlas-subscriptionservice/api/Subscription/GetEORSubscriptionCountriesByCustomer?CustomerId=e291c9f0-2476-4237-85cb-7afecdd085d3"
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
        "https://apigw-dev-eu.atlasbyelements.com/cs/api/Customer/GetAll"
      )
      .reply(200, mockapidata.resGetAllCustomer);

    mock
      .onGet(
        "https://apigw-dev-eu.atlasbyelements.com/atlas-subscriptionservice/api/Subscription/GetEORSubscriptionCountriesByCustomer?CustomerId=e291c9f0-2476-4237-85cb-7afecdd085d3"
      )
      .reply(200, mockapidata.resGetAllCountry);
      mock
      .onGet(
        "https://apigw-dev-eu.atlasbyelements.com/atlas-idg-service/api/PayrollChangeItems?customerId=a9bbee6d-797a-4724-a86a-5b1a2e28763f&countryId=7defc4f9-906d-437f-a6d9-c822ca2ecfd7"
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


    // const stepTwoBackButton = await screen.findByTestId("back-button-steptwo");
    // expect(stepTwoBackButton).toBeInTheDocument();
    // fireEvent.click(stepTwoBackButton);

  });

});




