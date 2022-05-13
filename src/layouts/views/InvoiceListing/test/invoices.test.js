import React from "react";
import ReactDom from "react-dom";
import Invoices from "..";
import {
  render,
  screen,
  fireEvent,
  within,
  waitFor,
  queryByAttribute,
  waitForElementToBeRemoved,
  cleanup,
  findAllByRole,
  findAllByLabelText,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HashRouter } from "react-router-dom";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import InvoiceListing from "..";
import { act } from "react-dom/test-utils";
import {
  getClientListingUrl,
  getInternalListingUrl,
} from "../../../../urls/urls";
import { currentOrgForListing } from "../../NewInvoice/test/mockData";

let resDataInternal = {
  page: 1,
  pageSize: 10000,
  totalPages: 1,
  hasMore: false,
  totalCount: 64,
  results: [
    {
      customerId: "094b3c66-5787-47ba-9bdc-48762fbd9104",
      customerName: "Aviat Networks (S) Pte Ltdupdatetest",
      customerLocation: "Singapore",
      currencyId: 840,
      qbInvoiceNo: 0,
      invoiceNo: "100329",
      status: 1,
      statusLabel: "Open",
      transactionType: 1,
      transactionTypeLabel: "Payroll",
      createdDate: "2022-03-29T00:00:00",
      paymentDate: null,
      dueDate: "2022-03-10T00:00:00",
      exchangeRate: 1,
      totalAmount: 7797.34,
      invoiceBalance: 7797.34,
      isClientVisible: false,
      depositTo: null,
      createdBy: "f056a259-96fd-432c-a5e1-e65e00818c1a",
      modifiedBy: "f056a259-96fd-432c-a5e1-e65e00818c1a",
      poNumber: null,
      ageingNotPaid: 19,
      ageingPaid: null,
      invoiceDocuments: [],
      invoiceItems: [],
      invoiceNotes: [],
      invoiceRelatedInvoices: [],
      invoiceRelatedRelatedInvoices: [],
      payrolls: [],
      customer: null,
      currency: {
        code: "USD",
        description: "US Dollar",
        id: 840,
      },
      id: "70961bfc-8d6e-44fc-88ad-61f9c86db9a3",
    },
    {
      customerId: "094b3c66-5787-47ba-9bdc-48762fbd9104",
      customerName: "Aviat Networks (S) Pte Ltd",
      customerLocation: "Singapore",
      currencyId: 840,
      qbInvoiceNo: 0,
      invoiceNo: "100325",
      status: 1,
      statusLabel: "Open",
      transactionType: 1,
      transactionTypeLabel: "Payroll",
      createdDate: "2022-03-24T00:00:00",
      paymentDate: null,
      dueDate: "2022-03-10T00:00:00",
      exchangeRate: 1,
      totalAmount: 7781.88,
      invoiceBalance: 7781.88,
      isClientVisible: false,
      depositTo: null,
      createdBy: "bff16650-8e9d-435d-badf-9aae8286d2bd",
      modifiedBy: "bff16650-8e9d-435d-badf-9aae8286d2bd",
      poNumber: null,
      ageingNotPaid: 19,
      ageingPaid: null,
      invoiceDocuments: [],
      invoiceItems: [],
      invoiceNotes: [],
      invoiceRelatedInvoices: [],
      invoiceRelatedRelatedInvoices: [],
      payrolls: [],
      customer: null,
      currency: {
        code: "USD",
        description: "US Dollar",
        id: 840,
      },
      id: "ab327a85-81cb-40a4-8fe4-16b74912d1a7",
    },
  ],
  regionItemCode: "emea",
};

let resDataClient = {
  page: 1,
  pageSize: 10000,
  totalPages: 1,
  hasMore: false,
  totalCount: 5,
  results: [
    {
      customerId: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
      customerName: "DSM Nutritional Products AG",
      customerLocation: "Switzerland",
      currencyId: 756,
      qbInvoiceNo: 21237,
      invoiceNo: "1000992",
      status: 4,
      statusLabel: "Approved",
      transactionType: 1,
      transactionTypeLabel: "Payroll",
      createdDate: "2022-03-01T00:00:00",
      paymentDate: null,
      dueDate: "2022-04-25T12:24:14",
      exchangeRate: 1.07441,
      totalAmount: 65096.31,
      invoiceBalance: 65096.31,
      isClientVisible: true,
      depositTo: null,
      createdBy: "72c7375f-2640-49f5-a9ca-1ca65166f44d",
      modifiedBy: "eed924b3-97b1-4133-b6a0-10e00df7014e",
      poNumber: "4702304768",
      ageingNotPaid: null,
      ageingPaid: null,
      invoiceDocuments: [],
      invoiceItems: [],
      invoiceNotes: [],
      invoiceRelatedInvoices: [],
      invoiceRelatedRelatedInvoices: [],
      payrolls: [],
      customer: null,
      currency: {
        code: "CHF",
        description: "Swiss Franc",
        id: 756,
      },
      id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
    },
    {
      customerId: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
      customerName: "DSM Nutritional Products AG",
      customerLocation: "Switzerland",
      currencyId: 978,
      qbInvoiceNo: 21238,
      invoiceNo: "1000989",
      status: 3,
      statusLabel: "Pending Approval",
      transactionType: 1,
      transactionTypeLabel: "Payroll",
      createdDate: "2022-02-01T00:00:00",
      paymentDate: null,
      dueDate: "2022-04-10T00:00:00",
      exchangeRate: 1.10407,
      totalAmount: 64941.25,
      invoiceBalance: 64941.25,
      isClientVisible: false,
      depositTo: null,
      createdBy: "325a4ed5-ebda-4bbb-b570-d52e96d8a947",
      modifiedBy: "eed924b3-97b1-4133-b6a0-10e00df7014e",
      poNumber: "4702304768",
      ageingNotPaid: null,
      ageingPaid: null,
      invoiceDocuments: [],
      invoiceItems: [],
      invoiceNotes: [],
      invoiceRelatedInvoices: [],
      invoiceRelatedRelatedInvoices: [],
      payrolls: [],
      customer: null,
      currency: {
        code: "EUR",
        description: "Euro",
        id: 978,
      },
      id: "18d6cb56-5196-4511-867d-4cb9623e3e4b",
    },
  ],
  regionItemCode: "emea",
};

let resDownloadSinlgeApiData = {
  id: "70961bfc-8d6e-44fc-88ad-61f9c86db9a3",
  url: "https://apnguatemeaservices.blob.core.windows.net/data/b07446a2-b99f-4e4e-b5c4-8b9cda5fd6e5.pdf?sv=2019-02-02&sr=b&sig=ufGKBaB%2F%2Beb61FEA%2BXwy3BeyXaLqxcR3RWniAH9cuq8%3D&se=2023-05-07T10%3A25%3A14Z&sp=rl",
  name: "Payroll-EMEA-70961bfc-8d6e-44fc-88ad-61f9c86db9a3.pdf",
  regionItemCode: "emea",
};

localStorage.setItem(
  "accessToken",
  "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIwdmRELXE3ekFYdkFxUzRfTDdoUExua2ZJbVVzaW1NWE1ZWGoxVUYwUUxVIn0.eyJleHAiOjE2NTIzMzg2ODcsImlhdCI6MTY1MjMzNjg4NywiYXV0aF90aW1lIjowLCJqdGkiOiIyZDU5YzIxNi1hNWRiLTQyNmItYTAwYi03MGU3MDY3ZjEwMjMiLCJpc3MiOiJodHRwczovL2FjY291bnRzLWRldi5hdGxhc2J5ZWxlbWVudHMuY29tL3JlYWxtcy9BdGxhcyIsImF1ZCI6IkFBQSBCcm9rZXIiLCJzdWIiOiIyOGEzNDgzOS00Nzk4LTRmYWEtOTc4Ni0wNjc3ZTE2ODBmMjIiLCJ0eXAiOiJJRCIsImF6cCI6IkFBQSBCcm9rZXIiLCJzZXNzaW9uX3N0YXRlIjoiYTcwMDkxNjYtMDE0Yy00ZGE3LThjMTEtOTFjYmYxN2JiMmU5IiwiYXRfaGFzaCI6IkE2Wk5pN0RINEhTVTZNaUFzMWowTVEiLCJhY3IiOiIxIiwic2lkIjoiYTcwMDkxNjYtMDE0Yy00ZGE3LThjMTEtOTFjYmYxN2JiMmU5IiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl0sIlBlcm1pc3Npb25zIjp7IkUyOTFDOUYwLTI0NzYtNDIzOC04NUNCLTdBRkVDREQwODVFNCI6eyJOYW1lIjoiRUdTIiwiWm9uZSI6IkVVIiwiVHlwZSI6IkF0bGFzX093bmVycyIsIlBheW1lbnRzIjp7IlJvbGUiOiJGaW5hbmNlQVIiLCJNaXNjZWxsYW5lb3VzSW52b2ljZUNyZWF0aW9uIjpbIlNhdmUiLCJFZGl0Il0sIk1hbnVhbFBheXJvbGxJbnZvaWNlQ3JlYXRpb24iOlsiU2F2ZSIsIkVkaXQiXSwiSW52b2ljZUxpc3QiOlsiQWRkIiwiRWRpdCIsIkRvd25sb2FkIiwiVmlldyJdLCJQcm9mb3JtYUludm9pY2VDcmVhdGlvbiI6WyJTYXZlIiwiRWRpdCJdLCJDcmVkaXRNZW1vSW52b2ljZUNyZWF0aW9uIjpbIlNhdmUiLCJFZGl0Il0sIk1pc2NlbGxhbmVvdXNJbnZvaWNlIjpbIkFkZCIsIkRlbGV0ZUludm9pY2UiLCJEZWxldGVJdGVtIiwiUGF5IiwiRWRpdCIsIlZpZXciLCJTZW5kIiwiQnJvd3NlIiwiUmVqZWN0IiwiRXhwb3J0IiwiQ2xvc2UiLCJWb2lkIiwiRG93bmxvYWQiLCJQdWJsaXNoIiwiQXBwcm92ZSIsIkRlbGV0ZUZpbGUiXSwiSW52b2ljZURldGFpbHMiOlsiQWRkIiwiRGVsZXRlIiwiUGFpZCIsIkVkaXQiLCJWaWV3IiwiU2VuZCIsIkJyb3dzZSIsIlJlamVjdCIsIlNlbGVjdCIsIkV4cG9ydCIsIkNsb3NlIiwiVm9pZCIsIkRvd25sb2FkIiwiUHVibGlzaCIsIkFwcHJvdmUiLCJEZWxldGVGaWxlIl0sIkNyZWRpdE1lbW9JbnZvaWNlIjpbIkFkZCIsIkRlbGV0ZUludm9pY2UiLCJEZWxldGVJdGVtIiwiUGF5IiwiRWRpdCIsIlZpZXciLCJTZW5kIiwiQnJvd3NlIiwiUmVqZWN0IiwiRXhwb3J0IiwiQ2xvc2UiLCJWb2lkIiwiRG93bmxvYWQiLCJQdWJsaXNoIiwiQXBwcm92ZSIsIkRlbGV0ZUZpbGUiXSwiUHJvZm9ybWFJbnZvaWNlIjpbIkFkZCIsIkRlbGV0ZUludm9pY2UiLCJEZWxldGVJdGVtIiwiUGF5IiwiRWRpdCIsIlNlbmQiLCJCcm93c2UiLCJSZWplY3QiLCJFeHBvcnQiLCJDbG9zZSIsIlZvaWQiLCJEb3dubG9hZCIsIlB1Ymxpc2giLCJBcHByb3ZlIiwiRGVsZXRlRmlsZSJdfX19LCJHcm91cCBNZW1iZXJzaGlwcyI6WyIvWm9uZXMvRVUvT3JnYW5pemF0aW9ucy9BdGxhc19Pd25lcnMvRUdTL1BheW1lbnRzL0ZpbmFuY2VBUiIsIi9Sb2xlcy9QYXltZW50cy9GaW5hbmNlQVIiLCIvU3Vic2NyaXB0aW9ucy9QYXltZW50cyJdLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJwYXltZW50c2ZpbmFuY2VhcnVzZXJAc29tZS1vcmcuY29tIn0.kQwAyl4f2lOXpiCysnYmZNLs3qUE7zkJ2xozWExr55W_pdBCcXV2nDVf0TsAh022NJ0xr4Mx7hxOkFhJKatg42IvxljZoxunHv88QqKYpGMK_r-B1YqSR6Vz1hUwOSaF_zLFlseR292icQWmxuNXRvtoUfN4shurHNIob63Dua5sNLfBEJL0BF4xDNtgQrn6H5SImOm8274a8J1BK4StteS0GOAbtZyrAn1h1N5xLb0q-RykXru4PSlHOuS_vCjnX5ZIX0zW4gEuuNqzfcSjjrB5hZRRprxjrbVJXGn-XvxIUULXSj0jPcO7w8j3iIGkTjnqzNAtd5iu5_2UUgU2bw"
);
localStorage.setItem("current-org-id", "E291C9F0-2476-4238-85CB-7AFECDD085E4");

describe("client view", () => {
  localStorage.setItem("current-org", JSON.stringify(currentOrgForListing));
  beforeEach(() => {
    const mock = new MockAdapter(axios);
    mock.onGet(getClientListingUrl("", "", "", "")).reply(200, resDataClient);

    act(() => {
      render(
        <HashRouter>
          <InvoiceListing />
        </HashRouter>
      );
    });
  });

  test("Datepicker dropdowns clickoutside clickable", async () => {
    const dd = await waitFor(() => screen.getAllByText(/Please Select/));
    fireEvent.click(dd[0]);
    fireEvent.click(dd[2]);
  });
  test("Datepicker dropdowns today clickable", async () => {
    const dd = await waitFor(() => screen.getAllByText(/Please Select/));
    fireEvent.click(dd[0]);
    // fireEvent.click(dd[1]);
    // fireEvent.click(dd[2]);

    const today = await waitFor(() => screen.getByText(/Today/), {
      timeout: 5000,
    });
    fireEvent.click(today);
    fireEvent.click(dd[1]);
  });

  test("Datepicker dropdowns Yesterday clickable", async () => {
    const dd = await waitFor(() => screen.getAllByText(/Please Select/));
    fireEvent.click(dd[0]);
    // fireEvent.click(dd[1]);
    // fireEvent.click(dd[2]);

    const today = await waitFor(() => screen.getByText(/Yesterday/), {
      timeout: 5000,
    });
    fireEvent.click(today);
  });

  test("Datepicker dropdowns This Week clickable", async () => {
    const dd = await waitFor(() => screen.getAllByText(/Please Select/));
    fireEvent.click(dd[0]);
    // fireEvent.click(dd[1]);
    // fireEvent.click(dd[2]);

    const today = await waitFor(() => screen.getByText(/This Week/), {
      timeout: 5000,
    });
    fireEvent.click(today);
  });

  test("Datepicker dropdowns This Month clickable", async () => {
    const dd = await waitFor(() => screen.getAllByText(/Please Select/));
    fireEvent.click(dd[0]);
    // fireEvent.click(dd[1]);
    // fireEvent.click(dd[2]);

    const today = await waitFor(() => screen.getByText(/This Month/), {
      timeout: 5000,
    });
    fireEvent.click(today);
  });

  test("Datepicker dropdowns This Quarter clickable", async () => {
    const dd = await waitFor(() => screen.getAllByText(/Please Select/));
    fireEvent.click(dd[0]);
    // fireEvent.click(dd[1]);
    // fireEvent.click(dd[2]);

    const today = await waitFor(() => screen.getByText(/This Quarter/), {
      timeout: 5000,
    });
    fireEvent.click(today);
  });

  test("Datepicker dropdowns This Year clickable", async () => {
    const dd = await waitFor(() => screen.getAllByText(/Please Select/));
    fireEvent.click(dd[0]);
    // fireEvent.click(dd[1]);
    // fireEvent.click(dd[2]);

    const today = await waitFor(() => screen.getByText(/This Year/), {
      timeout: 5000,
    });
    fireEvent.click(today);
  });

  // test("Datepicker dropdowns date range clickable", async () => {
  //   const dd = await waitFor(() => screen.getAllByText(/Please Select/));
  //   fireEvent.click(dd[0]);

  //   let dr = await waitFor(() =>
  //     screen.getAllByPlaceholderText(/Please Select/)
  //   );
  //   // screen.debug(x);
  //   fireEvent.click(dr[0]);
  //   let date = await waitFor(() => screen.getAllByText(/15/));
  //   // screen.debug(date);
  //   fireEvent.click(date[2]);
  //   fireEvent.click(dr[1]);
  //   let date2 = await waitFor(() => screen.getAllByText(/15/));
  //   fireEvent.click(date2[2]);
  // });

  test("table row clickable", async () => {
    const row = await waitFor(() => screen.getByText("1000992"));
    fireEvent.click(row);
  });

  test("Status clickable", async () => {
    const status = await waitFor(() => screen.getByText(/Status/));
    fireEvent.click(status);
    const open = await waitFor(() => screen.getByText(/Open/));
    fireEvent.click(open);
  });

  test("Type clickable", async () => {
    const status = await waitFor(() => screen.getByText(/Type/));
    fireEvent.click(status);
    const paid = await waitFor(() => screen.getAllByText(/Payroll/));
    fireEvent.click(paid[0]);
  });

  test("Clear filters clickable", async () => {
    const status = await waitFor(() => screen.getByText(/Type/));
    fireEvent.click(status);
    const paid = await waitFor(() => screen.getAllByText(/Payroll/));
    fireEvent.click(paid[0]);
    const clear = await waitFor(() => screen.getByText(/Clear Filters/));
    fireEvent.click(clear);
  });

  test("search", async () => {
    const search = await waitFor(() => screen.getByPlaceholderText(/Search/));
    fireEvent.change(search, { target: { value: "100" } });
    fireEvent.change(search, { target: { value: "" } });
  });

  // test("tbl checkbox clickable", async () => {
  //   // const row = await waitFor(() => screen.getByText("1000992"));
  //   // const chkbox = await waitFor(() => screen.getByRole("checkbox"), {
  //   //   timeout: 5000,
  //   // });
  //   // const chkbox = document.querySelector(
  //   //   ".a-dropdown__option__item__check-box"
  //   // );
  //   // const chkbox = await waitFor(() =>
  //   //   document.querySelector(
  //   //     "#sandbox > div > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > span:nth-child(1)"
  //   //   )
  //   // );
  //   // const e = document.getElementById("chkbx0");
  //   // const someElement = getById("#chkbx0");
  //   // fireEvent.click(someElement);
  //   // screen.logTestingPlaygroundURL();
  // });
});
describe("checkbox and download", () => {
  localStorage.setItem("current-org", JSON.stringify(currentOrgForListing));
  test("checkbox and download are clickable in client view", async () => {
    const mock = new MockAdapter(axios);
    mock.onGet(getClientListingUrl("", "", "", "")).reply(200, resDataClient);
    // const getById = queryByAttribute.bind(null, "id");

    const { container } = render(
      <HashRouter>
        <Invoices />
      </HashRouter>
    );

    await waitFor(() => screen.getByText(/Status/));

    const chkbx = container.querySelector(
      ".a-dropdown__option__item__check-box"
    );
    // const chkbx = container.querySelector(".table__row__default");
    screen.debug(chkbx);
    fireEvent.click(chkbx);

    const download = await waitFor(() => container.querySelector(".download"));
    screen.debug(download);
    screen.logTestingPlaygroundURL();
    fireEvent.click(download);

    fireEvent.click(chkbx);

    const singlechkbx = container.querySelectorAll(
      ".a-dropdown__option__item__check-box"
    );

    fireEvent.click(singlechkbx[1]);
    fireEvent.click(download);
  });
  test("checkbox and download are clickable in internal view", async () => {
    const mock = new MockAdapter(axios);
    mock
      .onGet(getInternalListingUrl("", "", "", ""))
      .reply(200, resDataInternal);
    // const getById = queryByAttribute.bind(null, "id");

    const { container } = render(
      <HashRouter>
        <Invoices />
      </HashRouter>
    );

    await waitFor(() => screen.getByText(/Status/));

    const chkbx = container.querySelector(
      ".a-dropdown__option__item__check-box"
    );
    screen.debug(chkbx);
    fireEvent.click(chkbx);

    const download = await waitFor(() => container.querySelector(".download"));
    screen.debug(download);
    fireEvent.click(download);

    fireEvent.click(chkbx);

    const singlechkbx = container.querySelectorAll(
      ".a-dropdown__option__item__check-box"
    );

    fireEvent.click(singlechkbx[1]);
  });
  test("checkbox and download are clickable in client view and searched view", async () => {
    const mock = new MockAdapter(axios);
    mock.onGet(getClientListingUrl("", "", "", "")).reply(200, resDataClient);
    // const getById = queryByAttribute.bind(null, "id");

    const { container } = render(
      <HashRouter>
        <Invoices />
      </HashRouter>
    );

    await waitFor(() => screen.getByText(/Status/));

    const search = await waitFor(() => screen.getByPlaceholderText(/Search/));
    fireEvent.change(search, { target: { value: "100" } });

    const chkbx = container.querySelector(
      ".a-dropdown__option__item__check-box"
    );
    screen.debug(chkbx);
    fireEvent.click(chkbx);

    const download = await waitFor(() => container.querySelector(".download"));
    screen.debug(download);
    fireEvent.click(download);

    fireEvent.click(chkbx);

    const singlechkbx = container.querySelectorAll(
      ".a-dropdown__option__item__check-box"
    );

    fireEvent.click(singlechkbx[1]);
  });
});

describe("Internal View Download click and checkbox Click", () => {
  test("table row clickable", async () => {
    currentOrgForListing.Payments.Role = "Internal";
    localStorage.setItem("current-org", JSON.stringify(currentOrgForListing));
    const mock = new MockAdapter(axios);
    mock
      .onGet(getInternalListingUrl("", "", "", ""))
      .reply(200, resDataInternal);

    mock
      .onGet(
        `https://apigw-dev-eu.atlasbyelements.com/atlas-invoiceservice/api/invoices/generatePDF/70961bfc-8d6e-44fc-88ad-61f9c86db9a3`
      )
      .reply(200, resDownloadSinlgeApiData);

    mock
      .onGet(
        `https://apigw-dev-eu.atlasbyelements.com/atlas-invoiceservice/api/invoices/GeneratePDFMultiple/70961bfc-8d6e-44fc-88ad-61f9c86db9a3,ab327a85-81cb-40a4-8fe4-16b74912d1a7,5e507200-78a1-4708-b389-2a18032ade06`
      )
      .reply(200, {
        id: "00000000-0000-0000-0000-000000000000",
        url: "https://apnguatemeaservices.blob.core.windows.net/data/7d8a73de-aa5d-4ef7-a6b2-d0784b068a21.zip?sv=2019-02-02&sr=b&sig=HSBga2dlkl5SwD%2B28xiMtq682MhzYBB94wbFWvoFKvM%3D&se=2023-05-07T10%3A34%3A38Z&sp=rl",
        name: "Invoices.zip",
        regionItemCode: "emea",
      });

    const { container } = render(
      <HashRouter>
        <InvoiceListing />
      </HashRouter>
    );

    const row = await screen.findByText("100329");
    expect(row).toBeInTheDocument();
    const labelText = await screen.findAllByLabelText("");
    screen.debug(labelText);
    fireEvent.click(labelText[0]);

    const download = await waitFor(() => container.querySelector(".download"));
    screen.debug(download);
    fireEvent.click(download);

    const toast = await screen.findByText("Downloaded...");
    expect(toast).toBeInTheDocument();

    const toastRemoveButton = await screen.findByTestId("remove-button-toast");
    expect(toastRemoveButton).toBeInTheDocument();

    fireEvent.click(toastRemoveButton);

    fireEvent.click(labelText[0]);

    fireEvent.click(labelText[1]);

    const downloadsingle = await waitFor(() =>
      container.querySelector(".download")
    );
    screen.debug(downloadsingle);
    fireEvent.click(downloadsingle);
  });
});

describe("Internal View Download click for single invoice  api fail Click", () => {
  test("table row clickable", async () => {
    currentOrgForListing.Payments.Role = "Internal";
    localStorage.setItem("current-org", JSON.stringify(currentOrgForListing));
    const mock = new MockAdapter(axios);
    mock
      .onGet(
        `https://apigw-dev-eu.atlasbyelements.com/atlas-invoiceservice/api/invoices/filter?page=1&pageSize=10000&transactionTypes=&statuses=&dateFrom=&dateTo=`
      )
      .reply(200, resDataInternal);

    mock
      .onGet(
        `https://apigw-dev-eu.atlasbyelements.com/atlas-invoiceservice/api/invoices/generatePDF/70961bfc-8d6e-44fc-88ad-61f9c86db9a3`
      )
      .reply(400, resDownloadSinlgeApiData);

    mock
      .onGet(
        `https://apigw-dev-eu.atlasbyelements.com/atlas-invoiceservice/api/invoices/GeneratePDFMultiple/70961bfc-8d6e-44fc-88ad-61f9c86db9a3,ab327a85-81cb-40a4-8fe4-16b74912d1a7,5e507200-78a1-4708-b389-2a18032ade06`
      )
      .reply(200, {
        id: "00000000-0000-0000-0000-000000000000",
        url: "https://apnguatemeaservices.blob.core.windows.net/data/7d8a73de-aa5d-4ef7-a6b2-d0784b068a21.zip?sv=2019-02-02&sr=b&sig=HSBga2dlkl5SwD%2B28xiMtq682MhzYBB94wbFWvoFKvM%3D&se=2023-05-07T10%3A34%3A38Z&sp=rl",
        name: "Invoices.zip",
        regionItemCode: "emea",
      });

    const { container } = render(
      <HashRouter>
        <InvoiceListing />
      </HashRouter>
    );

    const row = await screen.findByText("100329");
    expect(row).toBeInTheDocument();
    const labelText = await screen.findAllByLabelText("");
    screen.debug(labelText);
    fireEvent.click(labelText[0]);

    const download = await waitFor(() => container.querySelector(".download"));
    screen.debug(download);
    fireEvent.click(download);

    const toast = await screen.findByText("Downloaded...");
    expect(toast).toBeInTheDocument();

    const toastRemoveButton = await screen.findByTestId("remove-button-toast");
    expect(toastRemoveButton).toBeInTheDocument();

    fireEvent.click(toastRemoveButton);

    fireEvent.click(labelText[0]);

    fireEvent.click(labelText[1]);

    const downloadsingle = await waitFor(() =>
      container.querySelector(".download")
    );
    screen.debug(downloadsingle);
    fireEvent.click(downloadsingle);
  });
});
