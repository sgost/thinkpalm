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
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HashRouter } from "react-router-dom";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import InvoiceListing from "..";
import { act } from "react-dom/test-utils";

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

describe("client view", () => {
  beforeEach(() => {
    const mock = new MockAdapter(axios);
    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/customer/filter?page=1&pageSize=10000&transactionTypes=&statuses=&dateFrom=&dateTo=`
      )
      .reply(200, resDataClient);

    act(() => {
      render(
        <HashRouter>
          <InvoiceListing />
        </HashRouter>
      );
    });

    const input = screen.getByTestId("custom-element");
    fireEvent.change(input, {
      target: {
        value:
          "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJXTTFNMldSbzJvOFV1ZGhzV0toZko1M2hsY3lad2dlb2RucVVqTHJxdnZVIn0.eyJleHAiOjE2NDg3MDI1NDAsImlhdCI6MTY0ODUyOTc0MSwiYXV0aF90aW1lIjoxNjQ4NTI5NzQwLCJqdGkiOiJmMjU5YTA3ZC1jOWQzLTQyMjYtOTRkMy02OTU1NWRiMzkxNzIiLCJpc3MiOiJodHRwczovL2FjY291bnRzLXVhdC5hcG5leHRnZW4uY29tL2F1dGgvcmVhbG1zL2RzbW51dHJpdGlvbmFscHJvZHVjdHNhZyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJlZWQ5MjRiMy05N2IxLTQxMzMtYjZhMC0xMGUwMGRmNzAxNGUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhbmd1bGFyLXdlYi1jbGllbnQiLCJub25jZSI6IjIyZTcwZmFlLWI0NmYtNDc2MC04MmZjLTViZWMxMGUzNmJiNSIsInNlc3Npb25fc3RhdGUiOiJiN2ExMWY3Yi00NzIyLTRlZjctYjdhNi02YThkNGE0MGMzMzYiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vZHNtbnV0cml0aW9uYWxwcm9kdWN0c2FnLXVhdC5hcG5leHRnZW4uY29tIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLWRzbW51dHJpdGlvbmFscHJvZHVjdHNhZy11YXQiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInJvbGUiOiJ1c2VyIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc0V4dGVybmFsIjp0cnVlLCJuYW1lIjoiU2ltb24gTGFzdG5hbWV1Nml1bGUiLCJjdXN0b21lcklkIjoiYTliYmVlNmQtNzk3YS00NzI0LWE4NmEtNWIxYTJlMjg3NjNmIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiZHNtbnV0cml0aW9uYWxwcm9kdWN0c2FnQHByb3Rvbm1haWwuY29tIiwiaWQiOiJlZWQ5MjRiMy05N2IxLTQxMzMtYjZhMC0xMGUwMGRmNzAxNGUiLCJnaXZlbl9uYW1lIjoiU2ltb24iLCJmYW1pbHlfbmFtZSI6Ikxhc3RuYW1ldTZpdWxlIiwiY3VzdG9tZXJOYW1lIjoiRFNNIE51dHJpdGlvbmFsIFByb2R1Y3RzIEFHIiwiZW1haWwiOiJkc21udXRyaXRpb25hbHByb2R1Y3RzYWdAcHJvdG9ubWFpbC5jb20ifQ.dzJYbfHtsW2iT2dTPdSoP9ChqAzGvy4WFCar_wZ9kapLnbAfUAhx7R0em-kZIbYw8bUId8xNzA69sdKU_S1W1rhHDpyJXRHrY-0aEt5Gc5rmApVcQO548YOaAJ2J9SAMHiEU7QtEpA9Pj-hvJrkGNTAQPS2JXasMFzPDLAss5BslcR36-bJZuN63qpQ6xce8FwlHgDnoa3sQHyO6wANkwxE3mPCkZne7VrFLQC45t0G8TWCxqUY-_5v742x63Um2gyXSOYbX_Xq7vTI-guaKLL8trEyhlEJLSddbCGkNImfGmDyfVANHB_lItFPeiaHw4r0Arb44hBdMEp-bEdB4Mg",
      },
    });
    const clientView = screen.getByText(/Client View/);
    fireEvent.click(clientView);
  });

  // afterEach(() => {
  //   cleanup();
  // });

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
  test("checkbox and download are clickable in client view", async () => {
    const mock = new MockAdapter(axios);
    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/customer/filter?page=1&pageSize=10000&transactionTypes=&statuses=&dateFrom=&dateTo=`
      )
      .reply(200, resDataClient);
    // const getById = queryByAttribute.bind(null, "id");

    const { container } = render(
      <HashRouter>
        <Invoices />
      </HashRouter>
    );

    const input = screen.getByTestId("custom-element");
    fireEvent.change(input, {
      target: {
        value:
          "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJXTTFNMldSbzJvOFV1ZGhzV0toZko1M2hsY3lad2dlb2RucVVqTHJxdnZVIn0.eyJleHAiOjE2NDg3MDI1NDAsImlhdCI6MTY0ODUyOTc0MSwiYXV0aF90aW1lIjoxNjQ4NTI5NzQwLCJqdGkiOiJmMjU5YTA3ZC1jOWQzLTQyMjYtOTRkMy02OTU1NWRiMzkxNzIiLCJpc3MiOiJodHRwczovL2FjY291bnRzLXVhdC5hcG5leHRnZW4uY29tL2F1dGgvcmVhbG1zL2RzbW51dHJpdGlvbmFscHJvZHVjdHNhZyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJlZWQ5MjRiMy05N2IxLTQxMzMtYjZhMC0xMGUwMGRmNzAxNGUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhbmd1bGFyLXdlYi1jbGllbnQiLCJub25jZSI6IjIyZTcwZmFlLWI0NmYtNDc2MC04MmZjLTViZWMxMGUzNmJiNSIsInNlc3Npb25fc3RhdGUiOiJiN2ExMWY3Yi00NzIyLTRlZjctYjdhNi02YThkNGE0MGMzMzYiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vZHNtbnV0cml0aW9uYWxwcm9kdWN0c2FnLXVhdC5hcG5leHRnZW4uY29tIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLWRzbW51dHJpdGlvbmFscHJvZHVjdHNhZy11YXQiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInJvbGUiOiJ1c2VyIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc0V4dGVybmFsIjp0cnVlLCJuYW1lIjoiU2ltb24gTGFzdG5hbWV1Nml1bGUiLCJjdXN0b21lcklkIjoiYTliYmVlNmQtNzk3YS00NzI0LWE4NmEtNWIxYTJlMjg3NjNmIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiZHNtbnV0cml0aW9uYWxwcm9kdWN0c2FnQHByb3Rvbm1haWwuY29tIiwiaWQiOiJlZWQ5MjRiMy05N2IxLTQxMzMtYjZhMC0xMGUwMGRmNzAxNGUiLCJnaXZlbl9uYW1lIjoiU2ltb24iLCJmYW1pbHlfbmFtZSI6Ikxhc3RuYW1ldTZpdWxlIiwiY3VzdG9tZXJOYW1lIjoiRFNNIE51dHJpdGlvbmFsIFByb2R1Y3RzIEFHIiwiZW1haWwiOiJkc21udXRyaXRpb25hbHByb2R1Y3RzYWdAcHJvdG9ubWFpbC5jb20ifQ.dzJYbfHtsW2iT2dTPdSoP9ChqAzGvy4WFCar_wZ9kapLnbAfUAhx7R0em-kZIbYw8bUId8xNzA69sdKU_S1W1rhHDpyJXRHrY-0aEt5Gc5rmApVcQO548YOaAJ2J9SAMHiEU7QtEpA9Pj-hvJrkGNTAQPS2JXasMFzPDLAss5BslcR36-bJZuN63qpQ6xce8FwlHgDnoa3sQHyO6wANkwxE3mPCkZne7VrFLQC45t0G8TWCxqUY-_5v742x63Um2gyXSOYbX_Xq7vTI-guaKLL8trEyhlEJLSddbCGkNImfGmDyfVANHB_lItFPeiaHw4r0Arb44hBdMEp-bEdB4Mg",
      },
    });
    const clientView = screen.getByText(/Client View/);
    fireEvent.click(clientView);

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
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/filter?page=1&pageSize=10000&transactionTypes=&statuses=&dateFrom=&dateTo=`
      )
      .reply(200, resDataInternal);
    // const getById = queryByAttribute.bind(null, "id");

    const { container } = render(
      <HashRouter>
        <Invoices />
      </HashRouter>
    );

    const input = screen.getByTestId("custom-element");
    fireEvent.change(input, {
      target: {
        value:
          "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJXTTFNMldSbzJvOFV1ZGhzV0toZko1M2hsY3lad2dlb2RucVVqTHJxdnZVIn0.eyJleHAiOjE2NDg3MDI1NDAsImlhdCI6MTY0ODUyOTc0MSwiYXV0aF90aW1lIjoxNjQ4NTI5NzQwLCJqdGkiOiJmMjU5YTA3ZC1jOWQzLTQyMjYtOTRkMy02OTU1NWRiMzkxNzIiLCJpc3MiOiJodHRwczovL2FjY291bnRzLXVhdC5hcG5leHRnZW4uY29tL2F1dGgvcmVhbG1zL2RzbW51dHJpdGlvbmFscHJvZHVjdHNhZyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJlZWQ5MjRiMy05N2IxLTQxMzMtYjZhMC0xMGUwMGRmNzAxNGUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhbmd1bGFyLXdlYi1jbGllbnQiLCJub25jZSI6IjIyZTcwZmFlLWI0NmYtNDc2MC04MmZjLTViZWMxMGUzNmJiNSIsInNlc3Npb25fc3RhdGUiOiJiN2ExMWY3Yi00NzIyLTRlZjctYjdhNi02YThkNGE0MGMzMzYiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vZHNtbnV0cml0aW9uYWxwcm9kdWN0c2FnLXVhdC5hcG5leHRnZW4uY29tIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLWRzbW51dHJpdGlvbmFscHJvZHVjdHNhZy11YXQiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInJvbGUiOiJ1c2VyIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc0V4dGVybmFsIjp0cnVlLCJuYW1lIjoiU2ltb24gTGFzdG5hbWV1Nml1bGUiLCJjdXN0b21lcklkIjoiYTliYmVlNmQtNzk3YS00NzI0LWE4NmEtNWIxYTJlMjg3NjNmIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiZHNtbnV0cml0aW9uYWxwcm9kdWN0c2FnQHByb3Rvbm1haWwuY29tIiwiaWQiOiJlZWQ5MjRiMy05N2IxLTQxMzMtYjZhMC0xMGUwMGRmNzAxNGUiLCJnaXZlbl9uYW1lIjoiU2ltb24iLCJmYW1pbHlfbmFtZSI6Ikxhc3RuYW1ldTZpdWxlIiwiY3VzdG9tZXJOYW1lIjoiRFNNIE51dHJpdGlvbmFsIFByb2R1Y3RzIEFHIiwiZW1haWwiOiJkc21udXRyaXRpb25hbHByb2R1Y3RzYWdAcHJvdG9ubWFpbC5jb20ifQ.dzJYbfHtsW2iT2dTPdSoP9ChqAzGvy4WFCar_wZ9kapLnbAfUAhx7R0em-kZIbYw8bUId8xNzA69sdKU_S1W1rhHDpyJXRHrY-0aEt5Gc5rmApVcQO548YOaAJ2J9SAMHiEU7QtEpA9Pj-hvJrkGNTAQPS2JXasMFzPDLAss5BslcR36-bJZuN63qpQ6xce8FwlHgDnoa3sQHyO6wANkwxE3mPCkZne7VrFLQC45t0G8TWCxqUY-_5v742x63Um2gyXSOYbX_Xq7vTI-guaKLL8trEyhlEJLSddbCGkNImfGmDyfVANHB_lItFPeiaHw4r0Arb44hBdMEp-bEdB4Mg",
      },
    });
    const clientView = screen.getByText(/Internal View/);
    fireEvent.click(clientView);

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
    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/customer/filter?page=1&pageSize=10000&transactionTypes=&statuses=&dateFrom=&dateTo=`
      )
      .reply(200, resDataClient);
    // const getById = queryByAttribute.bind(null, "id");

    const { container } = render(
      <HashRouter>
        <Invoices />
      </HashRouter>
    );

    const input = screen.getByTestId("custom-element");
    fireEvent.change(input, {
      target: {
        value:
          "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJXTTFNMldSbzJvOFV1ZGhzV0toZko1M2hsY3lad2dlb2RucVVqTHJxdnZVIn0.eyJleHAiOjE2NDg3MDI1NDAsImlhdCI6MTY0ODUyOTc0MSwiYXV0aF90aW1lIjoxNjQ4NTI5NzQwLCJqdGkiOiJmMjU5YTA3ZC1jOWQzLTQyMjYtOTRkMy02OTU1NWRiMzkxNzIiLCJpc3MiOiJodHRwczovL2FjY291bnRzLXVhdC5hcG5leHRnZW4uY29tL2F1dGgvcmVhbG1zL2RzbW51dHJpdGlvbmFscHJvZHVjdHNhZyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJlZWQ5MjRiMy05N2IxLTQxMzMtYjZhMC0xMGUwMGRmNzAxNGUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhbmd1bGFyLXdlYi1jbGllbnQiLCJub25jZSI6IjIyZTcwZmFlLWI0NmYtNDc2MC04MmZjLTViZWMxMGUzNmJiNSIsInNlc3Npb25fc3RhdGUiOiJiN2ExMWY3Yi00NzIyLTRlZjctYjdhNi02YThkNGE0MGMzMzYiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vZHNtbnV0cml0aW9uYWxwcm9kdWN0c2FnLXVhdC5hcG5leHRnZW4uY29tIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLWRzbW51dHJpdGlvbmFscHJvZHVjdHNhZy11YXQiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInJvbGUiOiJ1c2VyIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc0V4dGVybmFsIjp0cnVlLCJuYW1lIjoiU2ltb24gTGFzdG5hbWV1Nml1bGUiLCJjdXN0b21lcklkIjoiYTliYmVlNmQtNzk3YS00NzI0LWE4NmEtNWIxYTJlMjg3NjNmIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiZHNtbnV0cml0aW9uYWxwcm9kdWN0c2FnQHByb3Rvbm1haWwuY29tIiwiaWQiOiJlZWQ5MjRiMy05N2IxLTQxMzMtYjZhMC0xMGUwMGRmNzAxNGUiLCJnaXZlbl9uYW1lIjoiU2ltb24iLCJmYW1pbHlfbmFtZSI6Ikxhc3RuYW1ldTZpdWxlIiwiY3VzdG9tZXJOYW1lIjoiRFNNIE51dHJpdGlvbmFsIFByb2R1Y3RzIEFHIiwiZW1haWwiOiJkc21udXRyaXRpb25hbHByb2R1Y3RzYWdAcHJvdG9ubWFpbC5jb20ifQ.dzJYbfHtsW2iT2dTPdSoP9ChqAzGvy4WFCar_wZ9kapLnbAfUAhx7R0em-kZIbYw8bUId8xNzA69sdKU_S1W1rhHDpyJXRHrY-0aEt5Gc5rmApVcQO548YOaAJ2J9SAMHiEU7QtEpA9Pj-hvJrkGNTAQPS2JXasMFzPDLAss5BslcR36-bJZuN63qpQ6xce8FwlHgDnoa3sQHyO6wANkwxE3mPCkZne7VrFLQC45t0G8TWCxqUY-_5v742x63Um2gyXSOYbX_Xq7vTI-guaKLL8trEyhlEJLSddbCGkNImfGmDyfVANHB_lItFPeiaHw4r0Arb44hBdMEp-bEdB4Mg",
      },
    });
    const clientView = screen.getByText(/Client View/);
    fireEvent.click(clientView);

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

describe("Client View", () => {
  beforeEach(async () => {
    const mock = new MockAdapter(axios);
    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/filter?page=1&pageSize=10000&transactionTypes=&statuses=&dateFrom=&dateTo=`
      )
      .reply(200, resDataInternal);
    // const getById = queryByAttribute.bind(null, "id");

    const { container } = render(
      <HashRouter>
        <Invoices />
      </HashRouter>
    );

    const input = screen.getByTestId("custom-element");
    fireEvent.change(input, {
      target: {
        value:
          "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJXTTFNMldSbzJvOFV1ZGhzV0toZko1M2hsY3lad2dlb2RucVVqTHJxdnZVIn0.eyJleHAiOjE2NDg3MDI1NDAsImlhdCI6MTY0ODUyOTc0MSwiYXV0aF90aW1lIjoxNjQ4NTI5NzQwLCJqdGkiOiJmMjU5YTA3ZC1jOWQzLTQyMjYtOTRkMy02OTU1NWRiMzkxNzIiLCJpc3MiOiJodHRwczovL2FjY291bnRzLXVhdC5hcG5leHRnZW4uY29tL2F1dGgvcmVhbG1zL2RzbW51dHJpdGlvbmFscHJvZHVjdHNhZyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJlZWQ5MjRiMy05N2IxLTQxMzMtYjZhMC0xMGUwMGRmNzAxNGUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhbmd1bGFyLXdlYi1jbGllbnQiLCJub25jZSI6IjIyZTcwZmFlLWI0NmYtNDc2MC04MmZjLTViZWMxMGUzNmJiNSIsInNlc3Npb25fc3RhdGUiOiJiN2ExMWY3Yi00NzIyLTRlZjctYjdhNi02YThkNGE0MGMzMzYiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vZHNtbnV0cml0aW9uYWxwcm9kdWN0c2FnLXVhdC5hcG5leHRnZW4uY29tIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLWRzbW51dHJpdGlvbmFscHJvZHVjdHNhZy11YXQiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInJvbGUiOiJ1c2VyIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc0V4dGVybmFsIjp0cnVlLCJuYW1lIjoiU2ltb24gTGFzdG5hbWV1Nml1bGUiLCJjdXN0b21lcklkIjoiYTliYmVlNmQtNzk3YS00NzI0LWE4NmEtNWIxYTJlMjg3NjNmIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiZHNtbnV0cml0aW9uYWxwcm9kdWN0c2FnQHByb3Rvbm1haWwuY29tIiwiaWQiOiJlZWQ5MjRiMy05N2IxLTQxMzMtYjZhMC0xMGUwMGRmNzAxNGUiLCJnaXZlbl9uYW1lIjoiU2ltb24iLCJmYW1pbHlfbmFtZSI6Ikxhc3RuYW1ldTZpdWxlIiwiY3VzdG9tZXJOYW1lIjoiRFNNIE51dHJpdGlvbmFsIFByb2R1Y3RzIEFHIiwiZW1haWwiOiJkc21udXRyaXRpb25hbHByb2R1Y3RzYWdAcHJvdG9ubWFpbC5jb20ifQ.dzJYbfHtsW2iT2dTPdSoP9ChqAzGvy4WFCar_wZ9kapLnbAfUAhx7R0em-kZIbYw8bUId8xNzA69sdKU_S1W1rhHDpyJXRHrY-0aEt5Gc5rmApVcQO548YOaAJ2J9SAMHiEU7QtEpA9Pj-hvJrkGNTAQPS2JXasMFzPDLAss5BslcR36-bJZuN63qpQ6xce8FwlHgDnoa3sQHyO6wANkwxE3mPCkZne7VrFLQC45t0G8TWCxqUY-_5v742x63Um2gyXSOYbX_Xq7vTI-guaKLL8trEyhlEJLSddbCGkNImfGmDyfVANHB_lItFPeiaHw4r0Arb44hBdMEp-bEdB4Mg",
      },
    });
    const clientView = screen.getByText(/Internal View/);
    fireEvent.click(clientView);

    await waitFor(() => screen.getByText(/Status/));
  });

  test("search intenal", async () => {
    const search = await waitFor(() => screen.getByPlaceholderText(/Search/));
    fireEvent.change(search, { target: { value: "10" } });
    fireEvent.change(search, { target: { value: "dsm" } });

    fireEvent.change(search, { target: { value: "" } });
  });
});

//

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

test("Enter token client", async () => {
  render(
    <HashRouter>
      <Invoices />
    </HashRouter>
  );
  const input = await screen.getByTestId("custom-element");
  fireEvent.change(input, {
    target: {
      value:
        "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJXTTFNMldSbzJvOFV1ZGhzV0toZko1M2hsY3lad2dlb2RucVVqTHJxdnZVIn0.eyJleHAiOjE2NDg3MDI1NDAsImlhdCI6MTY0ODUyOTc0MSwiYXV0aF90aW1lIjoxNjQ4NTI5NzQwLCJqdGkiOiJmMjU5YTA3ZC1jOWQzLTQyMjYtOTRkMy02OTU1NWRiMzkxNzIiLCJpc3MiOiJodHRwczovL2FjY291bnRzLXVhdC5hcG5leHRnZW4uY29tL2F1dGgvcmVhbG1zL2RzbW51dHJpdGlvbmFscHJvZHVjdHNhZyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJlZWQ5MjRiMy05N2IxLTQxMzMtYjZhMC0xMGUwMGRmNzAxNGUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhbmd1bGFyLXdlYi1jbGllbnQiLCJub25jZSI6IjIyZTcwZmFlLWI0NmYtNDc2MC04MmZjLTViZWMxMGUzNmJiNSIsInNlc3Npb25fc3RhdGUiOiJiN2ExMWY3Yi00NzIyLTRlZjctYjdhNi02YThkNGE0MGMzMzYiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vZHNtbnV0cml0aW9uYWxwcm9kdWN0c2FnLXVhdC5hcG5leHRnZW4uY29tIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLWRzbW51dHJpdGlvbmFscHJvZHVjdHNhZy11YXQiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInJvbGUiOiJ1c2VyIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc0V4dGVybmFsIjp0cnVlLCJuYW1lIjoiU2ltb24gTGFzdG5hbWV1Nml1bGUiLCJjdXN0b21lcklkIjoiYTliYmVlNmQtNzk3YS00NzI0LWE4NmEtNWIxYTJlMjg3NjNmIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiZHNtbnV0cml0aW9uYWxwcm9kdWN0c2FnQHByb3Rvbm1haWwuY29tIiwiaWQiOiJlZWQ5MjRiMy05N2IxLTQxMzMtYjZhMC0xMGUwMGRmNzAxNGUiLCJnaXZlbl9uYW1lIjoiU2ltb24iLCJmYW1pbHlfbmFtZSI6Ikxhc3RuYW1ldTZpdWxlIiwiY3VzdG9tZXJOYW1lIjoiRFNNIE51dHJpdGlvbmFsIFByb2R1Y3RzIEFHIiwiZW1haWwiOiJkc21udXRyaXRpb25hbHByb2R1Y3RzYWdAcHJvdG9ubWFpbC5jb20ifQ.dzJYbfHtsW2iT2dTPdSoP9ChqAzGvy4WFCar_wZ9kapLnbAfUAhx7R0em-kZIbYw8bUId8xNzA69sdKU_S1W1rhHDpyJXRHrY-0aEt5Gc5rmApVcQO548YOaAJ2J9SAMHiEU7QtEpA9Pj-hvJrkGNTAQPS2JXasMFzPDLAss5BslcR36-bJZuN63qpQ6xce8FwlHgDnoa3sQHyO6wANkwxE3mPCkZne7VrFLQC45t0G8TWCxqUY-_5v742x63Um2gyXSOYbX_Xq7vTI-guaKLL8trEyhlEJLSddbCGkNImfGmDyfVANHB_lItFPeiaHw4r0Arb44hBdMEp-bEdB4Mg",
    },
  });
  await expect(input.value).toBe(
    "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJXTTFNMldSbzJvOFV1ZGhzV0toZko1M2hsY3lad2dlb2RucVVqTHJxdnZVIn0.eyJleHAiOjE2NDg3MDI1NDAsImlhdCI6MTY0ODUyOTc0MSwiYXV0aF90aW1lIjoxNjQ4NTI5NzQwLCJqdGkiOiJmMjU5YTA3ZC1jOWQzLTQyMjYtOTRkMy02OTU1NWRiMzkxNzIiLCJpc3MiOiJodHRwczovL2FjY291bnRzLXVhdC5hcG5leHRnZW4uY29tL2F1dGgvcmVhbG1zL2RzbW51dHJpdGlvbmFscHJvZHVjdHNhZyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJlZWQ5MjRiMy05N2IxLTQxMzMtYjZhMC0xMGUwMGRmNzAxNGUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhbmd1bGFyLXdlYi1jbGllbnQiLCJub25jZSI6IjIyZTcwZmFlLWI0NmYtNDc2MC04MmZjLTViZWMxMGUzNmJiNSIsInNlc3Npb25fc3RhdGUiOiJiN2ExMWY3Yi00NzIyLTRlZjctYjdhNi02YThkNGE0MGMzMzYiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vZHNtbnV0cml0aW9uYWxwcm9kdWN0c2FnLXVhdC5hcG5leHRnZW4uY29tIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLWRzbW51dHJpdGlvbmFscHJvZHVjdHNhZy11YXQiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInJvbGUiOiJ1c2VyIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc0V4dGVybmFsIjp0cnVlLCJuYW1lIjoiU2ltb24gTGFzdG5hbWV1Nml1bGUiLCJjdXN0b21lcklkIjoiYTliYmVlNmQtNzk3YS00NzI0LWE4NmEtNWIxYTJlMjg3NjNmIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiZHNtbnV0cml0aW9uYWxwcm9kdWN0c2FnQHByb3Rvbm1haWwuY29tIiwiaWQiOiJlZWQ5MjRiMy05N2IxLTQxMzMtYjZhMC0xMGUwMGRmNzAxNGUiLCJnaXZlbl9uYW1lIjoiU2ltb24iLCJmYW1pbHlfbmFtZSI6Ikxhc3RuYW1ldTZpdWxlIiwiY3VzdG9tZXJOYW1lIjoiRFNNIE51dHJpdGlvbmFsIFByb2R1Y3RzIEFHIiwiZW1haWwiOiJkc21udXRyaXRpb25hbHByb2R1Y3RzYWdAcHJvdG9ubWFpbC5jb20ifQ.dzJYbfHtsW2iT2dTPdSoP9ChqAzGvy4WFCar_wZ9kapLnbAfUAhx7R0em-kZIbYw8bUId8xNzA69sdKU_S1W1rhHDpyJXRHrY-0aEt5Gc5rmApVcQO548YOaAJ2J9SAMHiEU7QtEpA9Pj-hvJrkGNTAQPS2JXasMFzPDLAss5BslcR36-bJZuN63qpQ6xce8FwlHgDnoa3sQHyO6wANkwxE3mPCkZne7VrFLQC45t0G8TWCxqUY-_5v742x63Um2gyXSOYbX_Xq7vTI-guaKLL8trEyhlEJLSddbCGkNImfGmDyfVANHB_lItFPeiaHw4r0Arb44hBdMEp-bEdB4Mg"
  );
  const clientView = screen.getByText(/Client View/);
  await fireEvent.click(clientView);

  const Date = await screen.getByText(/Date/);
  expect(Date).toBeInTheDocument();
});
