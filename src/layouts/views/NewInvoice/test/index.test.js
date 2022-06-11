import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import { HashRouter } from "react-router-dom";
import MockAdapter from "axios-mock-adapter";
import {
  mockapidata,
  currentOrgTokenMock,
  productInvoiceMoc,
} from "./mockData";
import axios from "axios";
import NewInvoice from "..";
import {
  urls,
  getCountryByCustomer,
  getEmployee,
  createManualInvoice,
  getBillingAddressUrl,
  getInvoiceDetailsUrl,
  updateInvoiceStatus,
  productInvoice,
  CountryApi,
  getRelatedInvoiceUrl,
} from "../../../../urls/urls";
import FinishCreditMemo from "../FinishCreditMemo";
import InvoicePreviewPop from "../InvoicePreviewPop";
import { mockLogsdata } from "../../InvoiceDetails/mockData";

localStorage.setItem(
  "accessToken",
  "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIwdmRELXE3ekFYdkFxUzRfTDdoUExua2ZJbVVzaW1NWE1ZWGoxVUYwUUxVIn0.eyJleHAiOjE2NTI2OTU5NTksImlhdCI6MTY1MjY5NDE1OSwiYXV0aF90aW1lIjowLCJqdGkiOiIyMDE0MWU2MC1kOGRjLTQxZTQtYTlkYy1hZjI4NDFkNzY1ZWIiLCJpc3MiOiJodHRwczovL2FjY291bnRzLWRldi5hdGxhc2J5ZWxlbWVudHMuY29tL3JlYWxtcy9BdGxhcyIsImF1ZCI6IkFBQSBCcm9rZXIiLCJzdWIiOiIyOGEzNDgzOS00Nzk4LTRmYWEtOTc4Ni0wNjc3ZTE2ODBmMjIiLCJ0eXAiOiJJRCIsImF6cCI6IkFBQSBCcm9rZXIiLCJzZXNzaW9uX3N0YXRlIjoiNDUzNjQwZGUtZDU3Ni00ZGYxLThhNGQtZDViMzU4MmUyODE3IiwiYXRfaGFzaCI6ImROVkIzM3ZvdkpsMFV3ajlPWWFWVVEiLCJhY3IiOiIxIiwic2lkIjoiNDUzNjQwZGUtZDU3Ni00ZGYxLThhNGQtZDViMzU4MmUyODE3IiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl0sIlBlcm1pc3Npb25zIjp7IkUyOTFDOUYwLTI0NzYtNDIzOC04NUNCLTdBRkVDREQwODVFNCI6eyJOYW1lIjoiRUdTIiwiWm9uZSI6IkVVIiwiVHlwZSI6IkF0bGFzX093bmVycyIsIlBheW1lbnRzIjp7IlJvbGUiOiJGaW5hbmNlQVIiLCJNaXNjZWxsYW5lb3VzSW52b2ljZUNyZWF0aW9uIjpbIlNhdmUiLCJFZGl0Il0sIk1hbnVhbFBheXJvbGxJbnZvaWNlQ3JlYXRpb24iOlsiU2F2ZSIsIkVkaXQiXSwiSW52b2ljZUxpc3QiOlsiQWRkIiwiRWRpdCIsIkRvd25sb2FkIiwiVmlldyJdLCJQcm9mb3JtYUludm9pY2VDcmVhdGlvbiI6WyJTYXZlIiwiRWRpdCJdLCJDcmVkaXRNZW1vSW52b2ljZUNyZWF0aW9uIjpbIlNhdmUiLCJFZGl0Il0sIk1pc2NlbGxhbmVvdXNJbnZvaWNlIjpbIkFkZCIsIkRlbGV0ZUludm9pY2UiLCJEZWxldGVJdGVtIiwiUGF5IiwiRWRpdCIsIlZpZXciLCJTZW5kIiwiQnJvd3NlIiwiUmVqZWN0IiwiRXhwb3J0IiwiQ2xvc2UiLCJWb2lkIiwiRG93bmxvYWQiLCJQdWJsaXNoIiwiQXBwcm92ZSIsIkRlbGV0ZUZpbGUiXSwiSW52b2ljZURldGFpbHMiOlsiQWRkIiwiRGVsZXRlIiwiUGFpZCIsIkVkaXQiLCJWaWV3IiwiU2VuZCIsIkJyb3dzZSIsIlJlamVjdCIsIlNlbGVjdCIsIkV4cG9ydCIsIkNsb3NlIiwiVm9pZCIsIkRvd25sb2FkIiwiUHVibGlzaCIsIkFwcHJvdmUiLCJEZWxldGVGaWxlIl0sIkNyZWRpdE1lbW9JbnZvaWNlIjpbIkFkZCIsIkRlbGV0ZUludm9pY2UiLCJEZWxldGVJdGVtIiwiUGF5IiwiRWRpdCIsIlZpZXciLCJTZW5kIiwiQnJvd3NlIiwiUmVqZWN0IiwiRXhwb3J0IiwiQ2xvc2UiLCJWb2lkIiwiRG93bmxvYWQiLCJQdWJsaXNoIiwiQXBwcm92ZSIsIkRlbGV0ZUZpbGUiXSwiUHJvZm9ybWFJbnZvaWNlIjpbIkFkZCIsIkRlbGV0ZUludm9pY2UiLCJEZWxldGVJdGVtIiwiUGF5IiwiRWRpdCIsIlNlbmQiLCJCcm93c2UiLCJSZWplY3QiLCJFeHBvcnQiLCJDbG9zZSIsIlZvaWQiLCJEb3dubG9hZCIsIlB1Ymxpc2giLCJBcHByb3ZlIiwiRGVsZXRlRmlsZSJdfX19LCJHcm91cCBNZW1iZXJzaGlwcyI6WyIvWm9uZXMvRVUvT3JnYW5pemF0aW9ucy9BdGxhc19Pd25lcnMvRUdTL1BheW1lbnRzL0ZpbmFuY2VBUiIsIi9Sb2xlcy9QYXltZW50cy9GaW5hbmNlQVIiLCIvU3Vic2NyaXB0aW9ucy9QYXltZW50cyJdLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJwYXltZW50c2ZpbmFuY2VhcnVzZXJAc29tZS1vcmcuY29tIn0.qU5SMKAe0Q5VWvBur5lqnjcVhXRr1BGUJF77c_aqDmq2T9vJUiVf4LuZxcbk4d-J_BvL3NPjkANtuIlqUw28aLTQ1A9IUarfsx5nPsmE325ebtUq9Xp8r-tBRr0jAaFfj7ydbNS5z9QgTHk65h6AxZflXw3ZspWJ9gSN9fCce7AHJTsL6ZgBuNoJN6vgu-O6GH5lxuontJvJWHR1_x_zTX2_3s2u9tMxVG13KNnmjmvhg7yxnIKZDQDMqXAiqePLD6lBBMBcXRKKnpNSGzBJgSBOiyE9brKaFNAHh7VhoStRUkjmBXnrh-yVwCYDQUGt5ZnEk6oBS63FobTEoVNFEw"
);
localStorage.setItem("current-org", JSON.stringify(currentOrgTokenMock));
localStorage.setItem("current-org-id", "E291C9F0-2476-4238-85CB-7AFECDD085E4");
const id = "a9bbee6d-797a-4724-a86a-5b1a2e28763f";
const customerId = "a9bbee6d-797a-4724-a86a-5b1a2e28763f";
const countryId = "7defc4f9-906d-437f-a6d9-c822ca2ecfd7";
const monthId = 1;
const yearId = 2022;

const stepperOneData = {
  "customer": "DSM Nutritional Products AG",
  "type": "Credit Memo",
  "country": "",
  "month": "",
  "year": "",
  "customerId": "A9BBEE6D-797A-4724-A86A-5B1A2E28763F",
  "countryId": "",
  "typeId": 4,
  "yearId": "",
  "monthId": ""
}

const todos = [
  {
    "id": 0.4633734736448569,
    "date": "17 Jun 2022",
    "product": "Advisory Services",
    "description": "Desc2",
    "country": "ABW -- Aruba",
    "quantity": "1",
    "amount": "2"
  }
]

const invoiceId = "cbb51dc8-8529-4afa-bf72-d2615163a9a6"

describe("New Invoice", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock
      .onGet(urls.allPayrollCustomerSubscriptionapi)
      .reply(200, mockapidata.resGetCustomerWithSuscription);

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

    let pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    const monthDropDown = await screen.findByText(/Select Month/);
    expect(monthDropDown).toBeInTheDocument();
    fireEvent.click(monthDropDown);

    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    const yearDropDown = await screen.findByText(/Select Year/);
    expect(yearDropDown).toBeInTheDocument();
    fireEvent.click(yearDropDown);

    const YearDropValue = await screen.findByText(/2022/);
    expect(YearDropValue).toBeInTheDocument();
    fireEvent.click(YearDropValue);
  });
});

describe("step one getCustomerSubscription api fail ", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);
    mock
      .onGet(urls.allPayrollCustomerSubscriptionapi)
      .reply(400, mockapidata.resGetCustomerWithSuscription);
  });

  test("dropDown Value change", async () => {
    render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const newInvoice = await screen.findAllByText(/New Invoice/);
    expect(newInvoice[0]).toBeInTheDocument();

    expect(newInvoice[0]).toBeInTheDocument();
    let pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);
  });
});

describe("step one getCOuntry api fail", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock
      .onGet(urls.allPayrollCustomerSubscriptionapi)
      .reply(200, mockapidata.resGetCustomerWithSuscription);

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

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);
  });
});

describe("Stepper 2", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock
      .onGet(urls.allPayrollCustomerSubscriptionapi)
      .reply(200, mockapidata.resGetCustomerWithSuscription);

    mock
      .onGet(getCountryByCustomer(id))
      .reply(200, mockapidata.resGetAllCountry);
    mock
      .onGet(getEmployee(customerId, countryId, monthId, yearId))
      .reply(200, mockapidata.resForStepperTwo);
    mock
      .onPost(createManualInvoice())
      .reply(200, mockapidata.resForCreateManualInvoice);

    mock.onGet(urls.fee).reply(200, mockapidata.resFeeData);

    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);

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

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
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

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findByText(/2022/);
    expect(YearDropValue).toBeInTheDocument();
    fireEvent.click(YearDropValue);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const billedPayrollItem = await screen.findAllByText(
      /Show Billed Payroll Items/
    );
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

    const previewText = await screen.findAllByText(
      /Please preview the new payroll invoice has been created./
    );
    expect(previewText[0]).toBeInTheDocument();

    const previewModal = await screen.findByTestId("preview-modal");
    expect(previewModal).toBeInTheDocument();
    fireEvent.click(previewModal);

    const closeButton = container.querySelector(".close");

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

    mock
      .onGet(urls.allPayrollCustomerSubscriptionapi)
      .reply(200, mockapidata.resGetCustomerWithSuscription);

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

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
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

    mock
      .onGet(urls.allPayrollCustomerSubscriptionapi)
      .reply(200, mockapidata.resGetCustomerWithSuscription);

    mock
      .onGet(getCountryByCustomer(id))
      .reply(200, mockapidata.resGetAllCountry);
    mock
      .onGet(getEmployee(customerId, countryId, monthId, yearId))
      .reply(200, mockapidata.resForStepperTwo);
    mock
      .onPost(createManualInvoice())
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

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findByText(/2022/);
    expect(YearDropValue).toBeInTheDocument();
    fireEvent.click(YearDropValue);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const billedPayrollItem = await screen.findAllByText(
      /Show Billed Payroll Items/
    );

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
describe("Stepper 2 getEmployee exceptional error api fail  ", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock
      .onGet(urls.allPayrollCustomerSubscriptionapi)
      .reply(200, mockapidata.resGetCustomerWithSuscription);

    mock
      .onGet(getCountryByCustomer(id))
      .reply(200, mockapidata.resGetAllCountry);
    mock
      .onGet(getEmployee(customerId, countryId, monthId, yearId))
      .reply(500, "dfg");
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

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findByText(/2022/);
    expect(YearDropValue).toBeInTheDocument();
    fireEvent.click(YearDropValue);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const errorText = await screen.findByText(
      /An error occurred while fetching employees for this customer/
    );
    expect(errorText).toBeInTheDocument();
  });
});
describe("Stepper 2 getEmployee No Emplyee Error api fail  ", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock
      .onGet(urls.allPayrollCustomerSubscriptionapi)
      .reply(200, mockapidata.resGetCustomerWithSuscription);

    mock
      .onGet(getCountryByCustomer(id))
      .reply(200, mockapidata.resGetAllCountry);
    mock
      .onGet(getEmployee(customerId, countryId, monthId, yearId))
      .reply(500, "No Employees found under this customer");
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

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findByText(/2022/);
    expect(YearDropValue).toBeInTheDocument();
    fireEvent.click(YearDropValue);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const errorText = await screen.findByText(
      /No Employees found under this customer/
    );
    expect(errorText).toBeInTheDocument();
  });
});

describe("Stepper 3", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock
      .onGet(urls.allPayrollCustomerSubscriptionapi)
      .reply(200, mockapidata.resGetCustomerWithSuscription);

    mock
      .onGet(getCountryByCustomer(id))
      .reply(200, mockapidata.resGetAllCountry);
    mock
      .onGet(getEmployee(customerId, countryId, monthId, yearId))
      .reply(200, mockapidata.resForStepperTwo);
    mock
      .onPost(createManualInvoice())
      .reply(200, mockapidata.resForCreateManualInvoice);

    mock.onGet(urls.fee).reply(200, mockapidata.resFeeData);

    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);

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

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
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

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
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

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findByText(/2022/);
    expect(YearDropValue).toBeInTheDocument();
    fireEvent.click(YearDropValue);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const billedPayrollItem = await screen.findAllByText(
      /Show Billed Payroll Items/
    );
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

    const previewText = await screen.findAllByText(
      /Please preview the new payroll invoice has been created./
    );
    expect(previewText[0]).toBeInTheDocument();

    const previewModal = await screen.findByTestId("preview-modal");
    expect(previewModal).toBeInTheDocument();
    fireEvent.click(previewModal);

    // const fromText = await screen.findAllByText(/Elements Holdings Group Ltd/);
    // expect(fromText[0]).toBeInTheDocument();
  });
});

describe("Stepper 3 invoice detail api fail", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock
      .onGet(urls.allPayrollCustomerSubscriptionapi)
      .reply(200, mockapidata.resGetCustomerWithSuscription);

    mock
      .onGet(getCountryByCustomer(id))
      .reply(200, mockapidata.resGetAllCountry);
    mock
      .onGet(getEmployee(customerId, countryId, monthId, yearId))
      .reply(200, mockapidata.resForStepperTwo);
    mock
      .onPost(createManualInvoice())
      .reply(200, mockapidata.resForCreateManualInvoice);

    mock.onGet(urls.fee).reply(200, mockapidata.resFeeData);

    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);

    mock
      .onGet(getBillingAddressUrl(customerId))
      .reply(200, mockapidata.resAddressData);

    mock
      .onGet(getInvoiceDetailsUrl("e9a959b9-a1a2-486e-938c-de1b8bac4b03"))
      .reply(500, mockapidata.resForInvoiceDetail);
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

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
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

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
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

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findByText(/2022/);
    expect(YearDropValue).toBeInTheDocument();
    fireEvent.click(YearDropValue);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const billedPayrollItem = await screen.findAllByText(
      /Show Billed Payroll Items/
    );
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

    mock
      .onGet(urls.allPayrollCustomerSubscriptionapi)
      .reply(200, mockapidata.resGetCustomerWithSuscription);

    mock
      .onGet(getCountryByCustomer(id))
      .reply(200, mockapidata.resGetAllCountry);
    mock
      .onGet(getEmployee(customerId, countryId, monthId, yearId))
      .reply(200, mockapidata.resForStepperTwo);
    mock
      .onPost(createManualInvoice())
      .reply(200, mockapidata.resForCreateManualInvoice);

    mock.onGet(urls.fee).reply(500, mockapidata.resFeeData);

    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);

    mock
      .onGet(getBillingAddressUrl(customerId))
      .reply(200, mockapidata.resAddressData);

    mock
      .onGet(getInvoiceDetailsUrl("e9a959b9-a1a2-486e-938c-de1b8bac4b03"))
      .reply(200, mockapidata.resForInvoiceDetail);
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

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
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

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findByText(/2022/);
    expect(YearDropValue).toBeInTheDocument();
    fireEvent.click(YearDropValue);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const billedPayrollItem = await screen.findAllByText(
      /Show Billed Payroll Items/
    );
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

    mock
      .onGet(urls.allPayrollCustomerSubscriptionapi)
      .reply(200, mockapidata.resGetCustomerWithSuscription);

    mock
      .onGet(getCountryByCustomer(id))
      .reply(200, mockapidata.resGetAllCountry);
    mock
      .onGet(getEmployee(customerId, countryId, monthId, yearId))
      .reply(200, mockapidata.resForStepperTwo);
    mock
      .onPost(createManualInvoice())
      .reply(200, mockapidata.resForCreateManualInvoice);

    mock.onGet(urls.fee).reply(200, mockapidata.resFeeData);

    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);

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

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
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

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
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

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findByText(/2022/);
    expect(YearDropValue).toBeInTheDocument();
    fireEvent.click(YearDropValue);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const billedPayrollItem = await screen.findAllByText(
      /Show Billed Payroll Items/
    );
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

    mock
      .onGet(urls.allPayrollCustomerSubscriptionapi)
      .reply(200, mockapidata.resGetCustomerWithSuscription);

    mock
      .onGet(getCountryByCustomer(id))
      .reply(200, mockapidata.resGetAllCountry);
    mock
      .onGet(getEmployee(customerId, countryId, monthId, yearId))
      .reply(200, mockapidata.resForStepperTwo);
    mock
      .onPost(createManualInvoice())
      .reply(200, mockapidata.resForCreateManualInvoice);

    mock.onGet(urls.fee).reply(200, mockapidata.resFeeData);

    mock.onGet(urls.countries).reply(500, mockapidata.resCountriesData);

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

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
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

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
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

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findByText(/2022/);
    expect(YearDropValue).toBeInTheDocument();
    fireEvent.click(YearDropValue);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const billedPayrollItem = await screen.findAllByText(
      /Show Billed Payroll Items/
    );
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

// test cases for Proforma

describe("New Invoice for Proforma ", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock.onGet(urls.customers).reply(200, mockapidata.resGetAllCustomer);
    mock.onGet(productInvoice()).reply(200, productInvoiceMoc.productdata);
    mock.onGet(CountryApi()).reply(200, productInvoiceMoc.countrydata);

    jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));
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
  }, 30000);
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

    const typeDropDownValue = await screen.findByText(/Proforma/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const dp = await waitFor(() => screen.getByRole("textbox"));
    fireEvent.click(dp);

    const selDate = await waitFor(() => screen.getByText(/15/));
    fireEvent.click(selDate);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);
  }, 30000);
});

describe("step one Proforma getCustomer api fail ", () => {
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

    expect(newInvoice[0]).toBeInTheDocument();
    let pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const typeDropDownValue = await screen.findByText(/Proforma/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);
  });
});

// test cases for Miscellaneous

describe("New Invoice for Miscellaneous ", () => {
  beforeEach(async () => {
    const mock = new MockAdapter(axios);

    mock.onGet(urls.customers).reply(200, mockapidata.resGetAllCustomer);
    mock.onGet(productInvoice()).reply(200, productInvoiceMoc.productdata);
    mock.onGet(CountryApi()).reply(200, productInvoiceMoc.countrydata);
    mock
      .onPost(urls.createCreditMemo)
      .reply(201, mockapidata.resCreateCreditMemo);

    jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));
  });

  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
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
  }, 30000);
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

    const typeDropDownValue = await screen.findByText(/Miscellaneous/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const dp = await waitFor(() => screen.getByRole("textbox"));
    fireEvent.click(dp);

    const selDate = await waitFor(() => screen.getByText(/15/));
    fireEvent.click(selDate);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Add New Item/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const summaryText = await screen.findAllByText(/Summary/);
    expect(summaryText[0]).toBeInTheDocument();

    const dp2 = await screen.findAllByRole("textbox");
    fireEvent.click(dp2[0]);

    const serviceDate = await screen.findAllByText(/27/);
    fireEvent.click(serviceDate[1]);

    const pleaseSelectDropDownStepper2 = await screen.findAllByText(
      /Please Select/
    );
    fireEvent.click(pleaseSelectDropDownStepper2[0]);

    const DatePicket = await screen.getByTestId(
      "Country_open"
    );
    expect(DatePicket).toBeInTheDocument();

    const productServiceDropDownValue = await screen.findAllByText(
      /Contract Termination Fee/
    );
    expect(productServiceDropDownValue[0]).toBeInTheDocument();
    fireEvent.click(productServiceDropDownValue[0]);

    const Country = await screen.findAllByText(
      /Service Date/
    );
    expect(Country[0]).toBeInTheDocument();
    fireEvent.click(Country[0]);

    fireEvent.click(pleaseSelectDropDownStepper2[1]);
    const countryServiceDropDownValue = await screen.findAllByText(
      /AFG -- Afghanistan/
    );
    expect(countryServiceDropDownValue[0]).toBeInTheDocument();
    fireEvent.click(countryServiceDropDownValue[0]);

    const DescriptionInputField = await screen.findByPlaceholderText(
      /Enter description/
    );
    expect(DescriptionInputField).toBeInTheDocument();
    fireEvent.change(DescriptionInputField, { target: { value: "test" } });

    const QuantityInputField = await screen.findByTestId(/Quantity/);
    expect(QuantityInputField).toBeInTheDocument();
    fireEvent.change(QuantityInputField, { target: { value: 30 } });
    fireEvent.keyDown(QuantityInputField);

    const AmountInputField = await screen.findByTestId(/Amount/);
    expect(AmountInputField).toBeInTheDocument();
    fireEvent.change(AmountInputField, { target: { value: 1 } });

    const addNewText = await screen.findAllByText(/Add New Item/);
    expect(addNewText[0]).toBeInTheDocument();
    fireEvent.click(addNewText[0]);

    const DeleteText = await screen.findAllByText(/Delete/);
    expect(DeleteText[0]).toBeInTheDocument();
    fireEvent.click(DeleteText[0]);

    const nextPreview = await screen.findByTestId("next-button");
    expect(nextPreview).toBeInTheDocument();
    fireEvent.click(nextPreview);
  }, 30000);
});

/// Credit Memo

describe("Stepper for Credit Memo  1, 2 and 3 ", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);
    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);

    mock.onGet(urls.customers).reply(200, mockapidata.resGetAllCustomer);
    mock.onGet(productInvoice()).reply(200, productInvoiceMoc.productdata);
    mock.onGet(CountryApi()).reply(200, productInvoiceMoc.countrydata);
    mock
      .onPost(urls.createCreditMemo)
      .reply(200, mockapidata.resCreateCreditMemo);

    jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));
  });

  test("dropDown Value change stepper 1 then stepper 2 complete and next button for credit memo", async () => {
    const { container } = render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const payrollTab = await screen.findAllByText(/New Invoice/);

    expect(payrollTab[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const typeDropDownValue = await screen.findByText(/Credit Memo/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const dp = await waitFor(() => screen.getByRole("textbox"));
    fireEvent.click(dp);

    const selDate = await waitFor(() => screen.getByText(/15/));
    fireEvent.click(selDate);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);


    const summaryText = await screen.findAllByText(/Summary/);
    expect(summaryText[0]).toBeInTheDocument();

    const dpp = await waitFor(() => screen.getAllByRole("textbox"));
    fireEvent.click(dpp[0]);


    const selDates = await waitFor(() => screen.getAllByText(/15/));
    fireEvent.click(selDates[2]);

    const pleaseSelectDropDownStepper2 = await screen.findAllByText(
      /Please Select/
    );
    fireEvent.click(pleaseSelectDropDownStepper2[0]);

    const productServiceDropDownValue = await screen.findAllByText(
      /Contract Termination Fee/
    );
    expect(productServiceDropDownValue[0]).toBeInTheDocument();
    fireEvent.click(productServiceDropDownValue[0]);

    fireEvent.click(pleaseSelectDropDownStepper2[1]);
    const countryServiceDropDownValue = await screen.findAllByText(
      /AFG -- Afghanistan/
    );
    expect(countryServiceDropDownValue[0]).toBeInTheDocument();
    fireEvent.click(countryServiceDropDownValue[0]);

    const DescriptionInputField = await screen.findByPlaceholderText(
      /Enter description/
    );
    expect(DescriptionInputField).toBeInTheDocument();
    fireEvent.change(DescriptionInputField, { target: { value: "test" } });

    const QuantityInputField = await screen.findByTestId(/Quantity/);
    expect(QuantityInputField).toBeInTheDocument();
    fireEvent.change(QuantityInputField, { target: { value: 30 } });

    const AmountInputField = await screen.findByTestId(/Amount/);
    expect(AmountInputField).toBeInTheDocument();
    fireEvent.change(AmountInputField, { target: { value: 1 } });
    const addNewText = await screen.findAllByText(/Add New Item/);
    expect(addNewText[0]).toBeInTheDocument();
    fireEvent.click(addNewText[0]);

    const DeleteText = await screen.findAllByText(/Delete/);
    expect(DeleteText[0]).toBeInTheDocument();
    fireEvent.click(DeleteText[0]);

    const nextPreview = await screen.findByTestId("next-button");
    expect(nextPreview).toBeInTheDocument();
    fireEvent.click(nextPreview);

    const InvoiceTab = await screen.findAllByText(/Invoice Preview/);
    expect(InvoiceTab[0]).toBeInTheDocument();

    const openModal = await screen.findAllByText(/Preview Invoice/);
    expect(openModal[0]).toBeInTheDocument();
    fireEvent.click(openModal[0]);

    const closeButton = container.querySelector(".close");
    fireEvent.click(closeButton);
  }, 30000);
});

describe("Stepper for Credit Memo  1, 2 and 3 api country fail ", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);
    mock.onGet(urls.countries).reply(500, mockapidata.resCountriesData);

    mock.onGet(urls.customers).reply(200, mockapidata.resGetAllCustomer);
    mock.onGet(productInvoice()).reply(200, productInvoiceMoc.productdata);
    mock.onGet(CountryApi()).reply(200, productInvoiceMoc.countrydata);
    mock
      .onPost(urls.createCreditMemo)
      .reply(200, mockapidata.resCreateCreditMemo);

    jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));
  });

  test("dropDown Value change stepper 1 then stepper 2 country api fail", async () => {
    const { container } = render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const payrollTab = await screen.findAllByText(/New Invoice/);

    expect(payrollTab[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const typeDropDownValue = await screen.findByText(/Credit Memo/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const dp = await waitFor(() => screen.getByRole("textbox"));
    fireEvent.click(dp);

    const selDate = await waitFor(() => screen.getByText(/15/));
    fireEvent.click(selDate);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);


    const summaryText = await screen.findAllByText(/Summary/);
    expect(summaryText[0]).toBeInTheDocument();

    const dpp = await waitFor(() => screen.getAllByRole("textbox"));
    fireEvent.click(dpp[0]);


    const selDates = await waitFor(() => screen.getAllByText(/15/));
    fireEvent.click(selDates[2]);

    const pleaseSelectDropDownStepper2 = await screen.findAllByText(
      /Please Select/
    );
    fireEvent.click(pleaseSelectDropDownStepper2[0]);

    const productServiceDropDownValue = await screen.findAllByText(
      /Contract Termination Fee/
    );
    expect(productServiceDropDownValue[0]).toBeInTheDocument();
    fireEvent.click(productServiceDropDownValue[0]);

    fireEvent.click(pleaseSelectDropDownStepper2[1]);
    const countryServiceDropDownValue = await screen.findAllByText(
      /AFG -- Afghanistan/
    );
    expect(countryServiceDropDownValue[0]).toBeInTheDocument();
    fireEvent.click(countryServiceDropDownValue[0]);

    const DescriptionInputField = await screen.findByPlaceholderText(
      /Enter description/
    );
    expect(DescriptionInputField).toBeInTheDocument();
    fireEvent.change(DescriptionInputField, { target: { value: "test" } });

    const QuantityInputField = await screen.findByTestId(/Quantity/);
    expect(QuantityInputField).toBeInTheDocument();
    fireEvent.change(QuantityInputField, { target: { value: 30 } });

    const AmountInputField = await screen.findByTestId(/Amount/);
    expect(AmountInputField).toBeInTheDocument();
    fireEvent.change(AmountInputField, { target: { value: 1 } });
    const addNewText = await screen.findAllByText(/Add New Item/);
    expect(addNewText[0]).toBeInTheDocument();
    fireEvent.click(addNewText[0]);

    const DeleteText = await screen.findAllByText(/Delete/);
    screen.debug(DeleteText)
    expect(DeleteText[0]).toBeInTheDocument();
    fireEvent.click(DeleteText[0]);

    const nextPreview = await screen.findByTestId("next-button");
    expect(nextPreview).toBeInTheDocument();
    fireEvent.click(nextPreview);

  }, 30000);
});

describe("Invoice preview Pop", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);
    mock
      .onGet(getRelatedInvoiceUrl(invoiceId))
      .reply(200, mockapidata.resFinalStepper);

    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);
  });
  test("final stepper", async () => {
    render(
      <HashRouter>
        <InvoicePreviewPop
          stepperOneData={stepperOneData}
          todos={todos}
          invoiceId={invoiceId}
        />
      </HashRouter>
    );
    const payrollTabs = await screen.findAllByText(/Invoice Preview/);
    expect(payrollTabs[0]).toBeInTheDocument();
  });

  test("Preview Invoice", async () => {
    render(
      <HashRouter>
        <InvoicePreviewPop
          stepperOneData={stepperOneData}
          todos={todos}
          invoiceId={invoiceId}
        />
      </HashRouter>
    );
    const PreviewButton = await screen.findByTestId("preview-button");
    fireEvent.click(PreviewButton);
  });
});


describe("final stepper", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);
    mock
      .onGet(getRelatedInvoiceUrl("0b5d231b-2fa8-4001-a737-b89328b2b6f2"))
      .reply(200, mockapidata.resFinalStepper);
  });
  test("final stepper", () => {
    render(
      <HashRouter>
        <FinishCreditMemo invoiceId="0b5d231b-2fa8-4001-a737-b89328b2b6f2" />
      </HashRouter>
    );

    const goto = screen.getByText(/Go to Invoice/);
    fireEvent.click(goto);
  }, 30000);
});

describe("final stepper with 201 status code", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);
    mock
      .onGet(getRelatedInvoiceUrl("0b5d231b-2fa8-4001-a737-b89328b2b6f2"))
      .reply(201, mockapidata.resFinalStepper);
  });
  test("final stepper", () => {
    render(
      <HashRouter>
        <FinishCreditMemo invoiceId="0b5d231b-2fa8-4001-a737-b89328b2b6f2" />
      </HashRouter>
    );

    const goto = screen.getByText(/Go to Invoice/);
    fireEvent.click(goto);
  }, 30000);
});




