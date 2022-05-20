import { render, screen, fireEvent } from "@testing-library/react";
import { HashRouter } from "react-router-dom";
import MockAdapter from "axios-mock-adapter";
import { mockapidata, currentOrgTokenMock } from "./mockData";
import axios from "axios";
import NewInvoice from "..";
import { urls, getCountryByCustomer, getEmployee, createManualInvoice, getBillingAddressUrl, getInvoiceDetailsUrl, updateInvoiceStatus } from "../../../../urls/urls";

localStorage.setItem("accessToken", "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIwdmRELXE3ekFYdkFxUzRfTDdoUExua2ZJbVVzaW1NWE1ZWGoxVUYwUUxVIn0.eyJleHAiOjE2NTI2OTU5NTksImlhdCI6MTY1MjY5NDE1OSwiYXV0aF90aW1lIjowLCJqdGkiOiIyMDE0MWU2MC1kOGRjLTQxZTQtYTlkYy1hZjI4NDFkNzY1ZWIiLCJpc3MiOiJodHRwczovL2FjY291bnRzLWRldi5hdGxhc2J5ZWxlbWVudHMuY29tL3JlYWxtcy9BdGxhcyIsImF1ZCI6IkFBQSBCcm9rZXIiLCJzdWIiOiIyOGEzNDgzOS00Nzk4LTRmYWEtOTc4Ni0wNjc3ZTE2ODBmMjIiLCJ0eXAiOiJJRCIsImF6cCI6IkFBQSBCcm9rZXIiLCJzZXNzaW9uX3N0YXRlIjoiNDUzNjQwZGUtZDU3Ni00ZGYxLThhNGQtZDViMzU4MmUyODE3IiwiYXRfaGFzaCI6ImROVkIzM3ZvdkpsMFV3ajlPWWFWVVEiLCJhY3IiOiIxIiwic2lkIjoiNDUzNjQwZGUtZDU3Ni00ZGYxLThhNGQtZDViMzU4MmUyODE3IiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl0sIlBlcm1pc3Npb25zIjp7IkUyOTFDOUYwLTI0NzYtNDIzOC04NUNCLTdBRkVDREQwODVFNCI6eyJOYW1lIjoiRUdTIiwiWm9uZSI6IkVVIiwiVHlwZSI6IkF0bGFzX093bmVycyIsIlBheW1lbnRzIjp7IlJvbGUiOiJGaW5hbmNlQVIiLCJNaXNjZWxsYW5lb3VzSW52b2ljZUNyZWF0aW9uIjpbIlNhdmUiLCJFZGl0Il0sIk1hbnVhbFBheXJvbGxJbnZvaWNlQ3JlYXRpb24iOlsiU2F2ZSIsIkVkaXQiXSwiSW52b2ljZUxpc3QiOlsiQWRkIiwiRWRpdCIsIkRvd25sb2FkIiwiVmlldyJdLCJQcm9mb3JtYUludm9pY2VDcmVhdGlvbiI6WyJTYXZlIiwiRWRpdCJdLCJDcmVkaXRNZW1vSW52b2ljZUNyZWF0aW9uIjpbIlNhdmUiLCJFZGl0Il0sIk1pc2NlbGxhbmVvdXNJbnZvaWNlIjpbIkFkZCIsIkRlbGV0ZUludm9pY2UiLCJEZWxldGVJdGVtIiwiUGF5IiwiRWRpdCIsIlZpZXciLCJTZW5kIiwiQnJvd3NlIiwiUmVqZWN0IiwiRXhwb3J0IiwiQ2xvc2UiLCJWb2lkIiwiRG93bmxvYWQiLCJQdWJsaXNoIiwiQXBwcm92ZSIsIkRlbGV0ZUZpbGUiXSwiSW52b2ljZURldGFpbHMiOlsiQWRkIiwiRGVsZXRlIiwiUGFpZCIsIkVkaXQiLCJWaWV3IiwiU2VuZCIsIkJyb3dzZSIsIlJlamVjdCIsIlNlbGVjdCIsIkV4cG9ydCIsIkNsb3NlIiwiVm9pZCIsIkRvd25sb2FkIiwiUHVibGlzaCIsIkFwcHJvdmUiLCJEZWxldGVGaWxlIl0sIkNyZWRpdE1lbW9JbnZvaWNlIjpbIkFkZCIsIkRlbGV0ZUludm9pY2UiLCJEZWxldGVJdGVtIiwiUGF5IiwiRWRpdCIsIlZpZXciLCJTZW5kIiwiQnJvd3NlIiwiUmVqZWN0IiwiRXhwb3J0IiwiQ2xvc2UiLCJWb2lkIiwiRG93bmxvYWQiLCJQdWJsaXNoIiwiQXBwcm92ZSIsIkRlbGV0ZUZpbGUiXSwiUHJvZm9ybWFJbnZvaWNlIjpbIkFkZCIsIkRlbGV0ZUludm9pY2UiLCJEZWxldGVJdGVtIiwiUGF5IiwiRWRpdCIsIlNlbmQiLCJCcm93c2UiLCJSZWplY3QiLCJFeHBvcnQiLCJDbG9zZSIsIlZvaWQiLCJEb3dubG9hZCIsIlB1Ymxpc2giLCJBcHByb3ZlIiwiRGVsZXRlRmlsZSJdfX19LCJHcm91cCBNZW1iZXJzaGlwcyI6WyIvWm9uZXMvRVUvT3JnYW5pemF0aW9ucy9BdGxhc19Pd25lcnMvRUdTL1BheW1lbnRzL0ZpbmFuY2VBUiIsIi9Sb2xlcy9QYXltZW50cy9GaW5hbmNlQVIiLCIvU3Vic2NyaXB0aW9ucy9QYXltZW50cyJdLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJwYXltZW50c2ZpbmFuY2VhcnVzZXJAc29tZS1vcmcuY29tIn0.qU5SMKAe0Q5VWvBur5lqnjcVhXRr1BGUJF77c_aqDmq2T9vJUiVf4LuZxcbk4d-J_BvL3NPjkANtuIlqUw28aLTQ1A9IUarfsx5nPsmE325ebtUq9Xp8r-tBRr0jAaFfj7ydbNS5z9QgTHk65h6AxZflXw3ZspWJ9gSN9fCce7AHJTsL6ZgBuNoJN6vgu-O6GH5lxuontJvJWHR1_x_zTX2_3s2u9tMxVG13KNnmjmvhg7yxnIKZDQDMqXAiqePLD6lBBMBcXRKKnpNSGzBJgSBOiyE9brKaFNAHh7VhoStRUkjmBXnrh-yVwCYDQUGt5ZnEk6oBS63FobTEoVNFEw");
localStorage.setItem("current-org", JSON.stringify(currentOrgTokenMock));
localStorage.setItem("current-org-id", "E291C9F0-2476-4238-85CB-7AFECDD085E4");
const id = "A9BBEE6D-797A-4724-A86A-5B1A2E28763F";
const customerId = "A9BBEE6D-797A-4724-A86A-5B1A2E28763F";
const countryId = "7defc4f9-906d-437f-a6d9-c822ca2ecfd7";
const monthId = 1;
const yearId = 2022;


describe("New Invoice", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock.onGet(urls.customers).reply(200, mockapidata.resGetAllCustomer);

    mock
      .onGet(getCountryByCustomer(id))
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

    const customerDropValue = await screen.findByText(/"DSM Nutritional Products AG"/);
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);


    const countryDropDown = await screen.findByText("Countries")
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    fireEvent.click(pleaseSelectDropDown[3]);
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
    mock.onGet(urls.customers).reply(400, mockapidata.resGetAllCustomer);
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

    mock.onGet(urls.customers).reply(200, mockapidata.resGetAllCustomer);

    mock
      .onGet(getCountryByCustomer(id))
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

    const customerDropValue = await screen.findByText(/"DSM Nutritional Products AG"/);
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);
  });
});

describe("Stepper 2", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock.onGet(urls.customers).reply(200, mockapidata.resGetAllCustomer);

    mock
      .onGet(getCountryByCustomer(id))
      .reply(200, mockapidata.resGetAllCountry);
    mock
      .onGet
      (getEmployee(customerId, countryId, monthId, yearId))
      .reply(200, mockapidata.resForStepperTwo);
    mock
      .onPost
      (createManualInvoice())
      .reply(200, mockapidata.resForCreateManualInvoice);

    mock
      .onGet
      (urls.fee)
      .reply(200, mockapidata.resFeeData)

    mock
      .onGet
      (urls.countries)
      .reply(200, mockapidata.resCountriesData);

    mock
      .onGet(getBillingAddressUrl(customerId))
      .reply(200, mockapidata.resAddressData);

    mock
      .onGet(getInvoiceDetailsUrl("e9a959b9-a1a2-486e-938c-de1b8bac4b03"))
      .reply(200, mockapidata.resForInvoiceDetail);

    mock
      .onGet(updateInvoiceStatus("e9a959b9-a1a2-486e-938c-de1b8bac4b03"))
      .reply(201, {});

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

    const customerDropValue = await screen.findByText(/"DSM Nutritional Products AG"/);
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);


    const countryDropDown = await screen.findByText("Countries")
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findByText(/2022/);
    expect(YearDropValue).toBeInTheDocument();
    fireEvent.click(YearDropValue);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const stepTwoNextButton = await screen.findByTestId("next-button");
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

    const customerDropValue = await screen.findByText(/"DSM Nutritional Products AG"/);
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    const countryDropDown = await screen.findByText("Countries")
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findByText(/2022/);
    expect(YearDropValue).toBeInTheDocument();
    fireEvent.click(YearDropValue);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const stepTwoBackButton = await screen.findByTestId("back-button");
    expect(stepTwoBackButton).toBeInTheDocument();
    fireEvent.click(stepTwoBackButton);
  });
  test("dropDown Value change stepper 1 then stepper 2 complete and next button then row click in select table data stepper 3 then finish ", async () => {
    const { container } = render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const payrollTab = await screen.findAllByText(/New Invoice/);

    expect(payrollTab[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const customerDropValue = await screen.findByText(/"DSM Nutritional Products AG"/);
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);


    const countryDropDown = await screen.findByText("Countries")
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findByText(/2022/);
    expect(YearDropValue).toBeInTheDocument();
    fireEvent.click(YearDropValue);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const billedPayrollItem = await screen.findAllByText(/Show Billed Payroll Items/)
    fireEvent.click(billedPayrollItem[0]);

    //again click for false the checkbox
    fireEvent.click(billedPayrollItem[0]);

    const SelectEmployeeName = await screen.findAllByText(/Thomas George/);
    expect(SelectEmployeeName[0]).toBeInTheDocument();

    //again click for true the checkbox
    fireEvent.click(billedPayrollItem[0]);

    const showHideButton = await screen.findByTestId("showHide-button");
    expect(showHideButton).toBeInTheDocument();
    fireEvent.click(showHideButton);

    const amount = await screen.findAllByText(/71000/);
    expect(amount[0]).toBeInTheDocument();

    const labelText = await screen.findAllByLabelText("");
    fireEvent.click(labelText[1]);

    const stepTwoNextButton = await screen.findByTestId("next-button");
    expect(stepTwoNextButton).toBeInTheDocument();
    fireEvent.click(stepTwoNextButton);

    const previewText = await screen.findAllByText(/Please preview the new payroll invoice has been created./);
    expect(previewText[0]).toBeInTheDocument();

    const previewModal = await screen.findByTestId("preview-modal");
    expect(previewModal).toBeInTheDocument();
    fireEvent.click(previewModal);

    const closeButton = container.querySelector(
      ".close"
    );

    fireEvent.click(closeButton);

    const stepTwoNextButtonw = await screen.findByTestId("next-button");
    expect(stepTwoNextButtonw).toBeInTheDocument();
    fireEvent.click(stepTwoNextButtonw);

    const donetext = await screen.findAllByText(/You're done!/);
    expect(donetext[0]).toBeInTheDocument();

    const Go_Invoice = await screen.findByTestId("Go_Invoice");
    expect(Go_Invoice).toBeInTheDocument();
    fireEvent.click(Go_Invoice);

  });

});

describe("Stepper 2 show table click", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock.onGet(urls.customers).reply(200, mockapidata.resGetAllCustomer);

    mock
      .onGet(getCountryByCustomer(id))
      .reply(200, mockapidata.resGetAllCountry);
    mock
      .onGet(getEmployee(customerId, countryId, monthId, yearId))
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

    const customerDropValue = await screen.findByText(/"DSM Nutritional Products AG"/);
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const countryDropDown = await screen.findByText("Countries")
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    fireEvent.click(pleaseSelectDropDown[3]);
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

describe("Stepper 2 api fail", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock.onGet(urls.customers).reply(200, mockapidata.resGetAllCustomer);

    mock
      .onGet(getCountryByCustomer(id))
      .reply(200, mockapidata.resGetAllCountry);
    mock
      .onGet
      (getEmployee(customerId, countryId, monthId, yearId))
      .reply(200, mockapidata.resForStepperTwo);
    mock
      .onPost
      (createManualInvoice())
      .reply(500, mockapidata.resForCreateManualInvoice);
  });



  test("dropDown Value change stepper 1 then stepper 2 complete and next button then row click in select table data   stepper 3 then finish ", async () => {
    const { container } = render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const payrollTab = await screen.findAllByText(/New Invoice/);

    expect(payrollTab[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const customerDropValue = await screen.findByText(/"DSM Nutritional Products AG"/);
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);


    const countryDropDown = await screen.findByText("Countries")
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findByText(/2022/);
    expect(YearDropValue).toBeInTheDocument();
    fireEvent.click(YearDropValue);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const billedPayrollItem = await screen.findAllByText(/Show Billed Payroll Items/)

    fireEvent.click(billedPayrollItem[0]);

    //again click for false the checkbox
    fireEvent.click(billedPayrollItem[0]);

    const SelectEmployeeName = await screen.findAllByText(/Thomas George/);
    expect(SelectEmployeeName[0]).toBeInTheDocument();

    //again click for true the checkbox
    fireEvent.click(billedPayrollItem[0]);

    const showHideButton = await screen.findByTestId("showHide-button");
    expect(showHideButton).toBeInTheDocument();
    fireEvent.click(showHideButton);

    const amount = await screen.findAllByText(/71000/);
    expect(amount[0]).toBeInTheDocument();

    const labelText = await screen.findAllByLabelText("");
    fireEvent.click(labelText[1]);

    const stepTwoNextButton = await screen.findByTestId("next-button");
    expect(stepTwoNextButton).toBeInTheDocument();
    fireEvent.click(stepTwoNextButton);
  });
});

describe("Stepper 3", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock.onGet(urls.customers).reply(200, mockapidata.resGetAllCustomer);

    mock
      .onGet(getCountryByCustomer(id))
      .reply(200, mockapidata.resGetAllCountry);
    mock
      .onGet
      (getEmployee(customerId, countryId, monthId, yearId))
      .reply(200, mockapidata.resForStepperTwo);
    mock
      .onPost
      (createManualInvoice())
      .reply(200, mockapidata.resForCreateManualInvoice);

    mock
      .onGet
      (urls.fee)
      .reply(200, mockapidata.resFeeData)

    mock
      .onGet
      (urls.countries)
      .reply(200, mockapidata.resCountriesData);

    mock
      .onGet(getBillingAddressUrl(customerId))
      .reply(200, mockapidata.resAddressData);

    mock
      .onGet(getInvoiceDetailsUrl("e9a959b9-a1a2-486e-938c-de1b8bac4b03"))
      .reply(200, mockapidata.resForInvoiceDetail);
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

    const customerDropValue = await screen.findByText(/"DSM Nutritional Products AG"/);
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);


    const countryDropDown = await screen.findByText("Countries")
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findByText(/2022/);
    expect(YearDropValue).toBeInTheDocument();
    fireEvent.click(YearDropValue);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const stepTwoNextButton = await screen.findByTestId("next-button");
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

    const customerDropValue = await screen.findByText(/"DSM Nutritional Products AG"/);
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    const countryDropDown = await screen.findByText("Countries")
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findByText(/2022/);
    expect(YearDropValue).toBeInTheDocument();
    fireEvent.click(YearDropValue);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const stepTwoBackButton = await screen.findByTestId("back-button");
    expect(stepTwoBackButton).toBeInTheDocument();
    fireEvent.click(stepTwoBackButton);
  });
  test("dropDown Value change stepper 1 then stepper 2 complete and next button then row click in select table data stepper 3 then finish ", async () => {
    const { container } = render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const payrollTab = await screen.findAllByText(/New Invoice/);

    expect(payrollTab[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const customerDropValue = await screen.findByText(/"DSM Nutritional Products AG"/);
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);


    const countryDropDown = await screen.findByText("Countries")
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findByText(/2022/);
    expect(YearDropValue).toBeInTheDocument();
    fireEvent.click(YearDropValue);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const billedPayrollItem = await screen.findAllByText(/Show Billed Payroll Items/)
    fireEvent.click(billedPayrollItem[0]);

    //again click for false the checkbox
    fireEvent.click(billedPayrollItem[0]);

    const SelectEmployeeName = await screen.findAllByText(/Thomas George/);
    expect(SelectEmployeeName[0]).toBeInTheDocument();

    //again click for true the checkbox
    fireEvent.click(billedPayrollItem[0]);

    const showHideButton = await screen.findByTestId("showHide-button");
    expect(showHideButton).toBeInTheDocument();
    fireEvent.click(showHideButton);

    const amount = await screen.findAllByText(/71000/);
    expect(amount[0]).toBeInTheDocument();

    const labelText = await screen.findAllByLabelText("");
    fireEvent.click(labelText[1]);

    const stepTwoNextButton = await screen.findByTestId("next-button");
    expect(stepTwoNextButton).toBeInTheDocument();
    fireEvent.click(stepTwoNextButton);

    const previewText = await screen.findAllByText(/Please preview the new payroll invoice has been created./);
    expect(previewText[0]).toBeInTheDocument();

    const previewModal = await screen.findByTestId("preview-modal");
    expect(previewModal).toBeInTheDocument();
    fireEvent.click(previewModal);


    const fromText = await screen.findAllByText(/Elements Holdings Group Ltd/);
    expect(fromText[0]).toBeInTheDocument();

  });

});

describe("Stepper 3 invoice detail api fail", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock.onGet(urls.customers).reply(200, mockapidata.resGetAllCustomer);

    mock
      .onGet(getCountryByCustomer(id))
      .reply(200, mockapidata.resGetAllCountry);
    mock
      .onGet
      (getEmployee(customerId, countryId, monthId, yearId))
      .reply(200, mockapidata.resForStepperTwo);
    mock
      .onPost
      (createManualInvoice())
      .reply(200, mockapidata.resForCreateManualInvoice);

    mock
      .onGet
      (urls.fee)
      .reply(200, mockapidata.resFeeData)

    mock
      .onGet
      (urls.countries)
      .reply(200, mockapidata.resCountriesData);

    mock
      .onGet(getBillingAddressUrl(customerId))
      .reply(200, mockapidata.resAddressData);

    mock
      .onGet(getInvoiceDetailsUrl("e9a959b9-a1a2-486e-938c-de1b8bac4b03"))
      .reply(500, mockapidata.resForInvoiceDetail);
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

    const customerDropValue = await screen.findByText(/"DSM Nutritional Products AG"/);
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);


    const countryDropDown = await screen.findByText("Countries")
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findByText(/2022/);
    expect(YearDropValue).toBeInTheDocument();
    fireEvent.click(YearDropValue);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const stepTwoNextButton = await screen.findByTestId("next-button");
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

    const customerDropValue = await screen.findByText(/"DSM Nutritional Products AG"/);
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    const countryDropDown = await screen.findByText("Countries")
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findByText(/2022/);
    expect(YearDropValue).toBeInTheDocument();
    fireEvent.click(YearDropValue);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const stepTwoBackButton = await screen.findByTestId("back-button");
    expect(stepTwoBackButton).toBeInTheDocument();
    fireEvent.click(stepTwoBackButton);
  });
  test("dropDown Value change stepper 1 then stepper 2 complete and next button then row click in select table data   stepper 3 then finish ", async () => {
    const { container } = render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const payrollTab = await screen.findAllByText(/New Invoice/);

    expect(payrollTab[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const customerDropValue = await screen.findByText(/"DSM Nutritional Products AG"/);
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);


    const countryDropDown = await screen.findByText("Countries")
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findByText(/2022/);
    expect(YearDropValue).toBeInTheDocument();
    fireEvent.click(YearDropValue);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const billedPayrollItem = await screen.findAllByText(/Show Billed Payroll Items/)
    fireEvent.click(billedPayrollItem[0]);

    //again click for false the checkbox
    fireEvent.click(billedPayrollItem[0]);

    const SelectEmployeeName = await screen.findAllByText(/Thomas George/);
    expect(SelectEmployeeName[0]).toBeInTheDocument();

    //again click for true the checkbox
    fireEvent.click(billedPayrollItem[0]);

    const showHideButton = await screen.findByTestId("showHide-button");
    expect(showHideButton).toBeInTheDocument();
    fireEvent.click(showHideButton);

    const amount = await screen.findAllByText(/71000/);
    expect(amount[0]).toBeInTheDocument();

    const labelText = await screen.findAllByLabelText("");
    fireEvent.click(labelText[1]);

    const stepTwoNextButton = await screen.findByTestId("next-button");
    expect(stepTwoNextButton).toBeInTheDocument();
    fireEvent.click(stepTwoNextButton);


  });

});

describe("Stepper 3 fee api fail", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock.onGet(urls.customers).reply(200, mockapidata.resGetAllCustomer);

    mock
      .onGet(getCountryByCustomer(id))
      .reply(200, mockapidata.resGetAllCountry);
    mock
      .onGet
      (getEmployee(customerId, countryId, monthId, yearId))
      .reply(200, mockapidata.resForStepperTwo);
    mock
      .onPost
      (createManualInvoice())
      .reply(200, mockapidata.resForCreateManualInvoice);

    mock
      .onGet
      (urls.fee)
      .reply(500, mockapidata.resFeeData)

    mock
      .onGet
      (urls.countries)
      .reply(200, mockapidata.resCountriesData);

    mock
      .onGet(getBillingAddressUrl(customerId))
      .reply(200, mockapidata.resAddressData);

    mock
      .onGet(getInvoiceDetailsUrl("e9a959b9-a1a2-486e-938c-de1b8bac4b03"))
      .reply(200, mockapidata.resForInvoiceDetail);
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

    const customerDropValue = await screen.findByText(/"DSM Nutritional Products AG"/);
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);


    const countryDropDown = await screen.findByText("Countries")
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findByText(/2022/);
    expect(YearDropValue).toBeInTheDocument();
    fireEvent.click(YearDropValue);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const stepTwoNextButton = await screen.findByTestId("next-button");
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

    const customerDropValue = await screen.findByText(/"DSM Nutritional Products AG"/);
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    const countryDropDown = await screen.findByText("Countries")
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findByText(/2022/);
    expect(YearDropValue).toBeInTheDocument();
    fireEvent.click(YearDropValue);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const stepTwoBackButton = await screen.findByTestId("back-button");
    expect(stepTwoBackButton).toBeInTheDocument();
    fireEvent.click(stepTwoBackButton);
  });
  test("dropDown Value change stepper 1 then stepper 2 complete and next button then row click in select table data   stepper 3 then finish ", async () => {
    const { container } = render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const payrollTab = await screen.findAllByText(/New Invoice/);

    expect(payrollTab[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const customerDropValue = await screen.findByText(/"DSM Nutritional Products AG"/);
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);


    const countryDropDown = await screen.findByText("Countries")
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findByText(/2022/);
    expect(YearDropValue).toBeInTheDocument();
    fireEvent.click(YearDropValue);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const billedPayrollItem = await screen.findAllByText(/Show Billed Payroll Items/)
    fireEvent.click(billedPayrollItem[0]);

    //again click for false the checkbox
    fireEvent.click(billedPayrollItem[0]);

    const SelectEmployeeName = await screen.findAllByText(/Thomas George/);
    expect(SelectEmployeeName[0]).toBeInTheDocument();

    //again click for true the checkbox
    fireEvent.click(billedPayrollItem[0]);

    const showHideButton = await screen.findByTestId("showHide-button");
    expect(showHideButton).toBeInTheDocument();
    fireEvent.click(showHideButton);

    const amount = await screen.findAllByText(/71000/);
    expect(amount[0]).toBeInTheDocument();

    const labelText = await screen.findAllByLabelText("");
    fireEvent.click(labelText[1]);

    const stepTwoNextButton = await screen.findByTestId("next-button");
    expect(stepTwoNextButton).toBeInTheDocument();
    fireEvent.click(stepTwoNextButton);


  });

});

describe("Stepper 3 address api fail", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock.onGet(urls.customers).reply(200, mockapidata.resGetAllCustomer);

    mock
      .onGet(getCountryByCustomer(id))
      .reply(200, mockapidata.resGetAllCountry);
    mock
      .onGet
      (getEmployee(customerId, countryId, monthId, yearId))
      .reply(200, mockapidata.resForStepperTwo);
    mock
      .onPost
      (createManualInvoice())
      .reply(200, mockapidata.resForCreateManualInvoice);

    mock
      .onGet
      (urls.fee)
      .reply(200, mockapidata.resFeeData)

    mock
      .onGet
      (urls.countries)
      .reply(200, mockapidata.resCountriesData);

    mock
      .onGet(getBillingAddressUrl(customerId))
      .reply(500, mockapidata.resAddressData);

    mock
      .onGet(getInvoiceDetailsUrl("e9a959b9-a1a2-486e-938c-de1b8bac4b03"))
      .reply(200, mockapidata.resForInvoiceDetail);
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

    const customerDropValue = await screen.findByText(/"DSM Nutritional Products AG"/);
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);


    const countryDropDown = await screen.findByText("Countries")
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findByText(/2022/);
    expect(YearDropValue).toBeInTheDocument();
    fireEvent.click(YearDropValue);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const stepTwoNextButton = await screen.findByTestId("next-button");
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

    const customerDropValue = await screen.findByText(/"DSM Nutritional Products AG"/);
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    const countryDropDown = await screen.findByText("Countries")
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findByText(/2022/);
    expect(YearDropValue).toBeInTheDocument();
    fireEvent.click(YearDropValue);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const stepTwoBackButton = await screen.findByTestId("back-button");
    expect(stepTwoBackButton).toBeInTheDocument();
    fireEvent.click(stepTwoBackButton);
  });
  test("dropDown Value change stepper 1 then stepper 2 complete and next button then row click in select table data   stepper 3 then finish ", async () => {
    const { container } = render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const payrollTab = await screen.findAllByText(/New Invoice/);

    expect(payrollTab[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const customerDropValue = await screen.findByText(/"DSM Nutritional Products AG"/);
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);


    const countryDropDown = await screen.findByText("Countries")
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findByText(/2022/);
    expect(YearDropValue).toBeInTheDocument();
    fireEvent.click(YearDropValue);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const billedPayrollItem = await screen.findAllByText(/Show Billed Payroll Items/)
    fireEvent.click(billedPayrollItem[0]);

    //again click for false the checkbox
    fireEvent.click(billedPayrollItem[0]);

    const SelectEmployeeName = await screen.findAllByText(/Thomas George/);
    expect(SelectEmployeeName[0]).toBeInTheDocument();

    //again click for true the checkbox
    fireEvent.click(billedPayrollItem[0]);

    const showHideButton = await screen.findByTestId("showHide-button");
    expect(showHideButton).toBeInTheDocument();
    fireEvent.click(showHideButton);

    const amount = await screen.findAllByText(/71000/);
    expect(amount[0]).toBeInTheDocument();

    const labelText = await screen.findAllByLabelText("");
    fireEvent.click(labelText[1]);

    const stepTwoNextButton = await screen.findByTestId("next-button");
    expect(stepTwoNextButton).toBeInTheDocument();
    fireEvent.click(stepTwoNextButton);


  });

});

describe("Stepper 3 country api fail", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock.onGet(urls.customers).reply(200, mockapidata.resGetAllCustomer);

    mock
      .onGet(getCountryByCustomer(id))
      .reply(200, mockapidata.resGetAllCountry);
    mock
      .onGet
      (getEmployee(customerId, countryId, monthId, yearId))
      .reply(200, mockapidata.resForStepperTwo);
    mock
      .onPost
      (createManualInvoice())
      .reply(200, mockapidata.resForCreateManualInvoice);

    mock
      .onGet
      (urls.fee)
      .reply(200, mockapidata.resFeeData)

    mock
      .onGet
      (urls.countries)
      .reply(500, mockapidata.resCountriesData);

    mock
      .onGet(getBillingAddressUrl(customerId))
      .reply(200, mockapidata.resAddressData);

    mock
      .onGet(getInvoiceDetailsUrl("e9a959b9-a1a2-486e-938c-de1b8bac4b03"))
      .reply(200, mockapidata.resForInvoiceDetail);
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

    const customerDropValue = await screen.findByText(/"DSM Nutritional Products AG"/);
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);


    const countryDropDown = await screen.findByText("Countries")
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findByText(/2022/);
    expect(YearDropValue).toBeInTheDocument();
    fireEvent.click(YearDropValue);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const stepTwoNextButton = await screen.findByTestId("next-button");
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

    const customerDropValue = await screen.findByText(/"DSM Nutritional Products AG"/);
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    const countryDropDown = await screen.findByText("Countries")
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findByText(/2022/);
    expect(YearDropValue).toBeInTheDocument();
    fireEvent.click(YearDropValue);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const stepTwoBackButton = await screen.findByTestId("back-button");
    expect(stepTwoBackButton).toBeInTheDocument();
    fireEvent.click(stepTwoBackButton);
  });
  test("dropDown Value change stepper 1 then stepper 2 complete and next button then row click in select table data   stepper 3 then finish ", async () => {
    const { container } = render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const payrollTab = await screen.findAllByText(/New Invoice/);

    expect(payrollTab[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const customerDropValue = await screen.findByText(/"DSM Nutritional Products AG"/);
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);


    const countryDropDown = await screen.findByText("Countries")
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findByText(/2022/);
    expect(YearDropValue).toBeInTheDocument();
    fireEvent.click(YearDropValue);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const billedPayrollItem = await screen.findAllByText(/Show Billed Payroll Items/)
    fireEvent.click(billedPayrollItem[0]);

    //again click for false the checkbox
    fireEvent.click(billedPayrollItem[0]);

    const SelectEmployeeName = await screen.findAllByText(/Thomas George/);
    expect(SelectEmployeeName[0]).toBeInTheDocument();

    //again click for true the checkbox
    fireEvent.click(billedPayrollItem[0]);

    const showHideButton = await screen.findByTestId("showHide-button");
    expect(showHideButton).toBeInTheDocument();
    fireEvent.click(showHideButton);

    const amount = await screen.findAllByText(/71000/);
    expect(amount[0]).toBeInTheDocument();

    const labelText = await screen.findAllByLabelText("");
    fireEvent.click(labelText[1]);

    const stepTwoNextButton = await screen.findByTestId("next-button");
    expect(stepTwoNextButton).toBeInTheDocument();
    fireEvent.click(stepTwoNextButton);


  });

});

