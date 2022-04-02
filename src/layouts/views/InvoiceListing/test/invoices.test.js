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

// const mock = new MockAdapter(axios);

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

  test("Datepicker dropdowns today clickable", async () => {
    const dd = await waitFor(() => screen.getAllByText(/Please Select/));
    fireEvent.click(dd[0]);
    // fireEvent.click(dd[1]);
    // fireEvent.click(dd[2]);

    const today = await waitFor(() => screen.getByText(/Today/), {
      timeout: 5000,
    });
    fireEvent.click(today);
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

  test("table row clickable", async () => {
    const row = await waitFor(() => screen.getByText("1000992"));
    fireEvent.click(row);
  });

  test("Status clickable", async () => {
    const status = await waitFor(() => screen.getByText(/Status/));
    fireEvent.click(status);
    const paid = await waitFor(() => screen.getByText(/Paid/));
    fireEvent.click(paid);
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

    // screen.logTestingPlaygroundURL();

    // const someElement = getById(dom.container, "#chkbx0");

    // const x = dom.container.querySelector(
    //   "div > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > span:nth-child(1)"
    // );
    // fireEvent.click(x);
    // const download = dom.container.querySelector(
    //   "div > div > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > svg"
    // );
    // // fireEvent.change(someElement, { target: { checked: true } });
    // setTimeout(() => {
    //   fireEvent.click(download);
    // }, 3000);
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

// test("Enter token internal", async () => {
//   render(
//     <HashRouter>
//       <Invoices />
//     </HashRouter>
//   );
//   const input = await screen.getByTestId("custom-element");
//   fireEvent.change(input, {
//     target: {
//       value:
//         "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJxa1VoLVl2LWc3c25Zc3ktN1ktZVk0OE5TLTlzdldjWm9aMXFoMzZoYnpjIn0.eyJleHAiOjE2NDg2OTg1NjgsImlhdCI6MTY0ODU0MTA5MiwiYXV0aF90aW1lIjoxNjQ4NTI1NzY4LCJqdGkiOiIyNmY3OGViOC1jMjY4LTRjZDAtYmZiMy03MWE2YjY3Mjk1Y2IiLCJpc3MiOiJodHRwczovL2FjY291bnRzLXVhdC5hcG5leHRnZW4uY29tL2F1dGgvcmVhbG1zL2VsZW1lbnRzZ3MiLCJzdWIiOiI5YmVmMTY3Mi0zZTZlLTRmZWUtYTg5ZS1mM2FiMGIwMDI1NDAiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhbmd1bGFyLXdlYi1jbGllbnQiLCJub25jZSI6IjM1MTI1OTk5LWIyNjItNGQwNS05M2EzLWI2YTUxYjcyMzAxZSIsInNlc3Npb25fc3RhdGUiOiI2MDVlYjhhOC00MTE3LTQwMzgtOTk3Zi1jODk1ZmJkNTUzYzAiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vd3d3LXVhdC5hcG5leHRnZW4uY29tIiwiaHR0cHM6Ly9lbGVtZW50c2dzLW5nLmFwbmV4dGdlbi5jb20iLCJodHRwczovL2VsZW1lbnRzZ3MtdWF0LmFwbmV4dGdlbi5jb20iXSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInJvbGUiOiJBcHByb3ZQYXlPd25lcnMiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImlzRXh0ZXJuYWwiOmZhbHNlLCJuYW1lIjoicmFudml0LnMgc3VyaSIsImlkIjoiOWJlZjE2NzItM2U2ZS00ZmVlLWE4OWUtZjNhYjBiMDAyNTQwIiwicHJlZmVycmVkX3VzZXJuYW1lIjoicmFudml0LnNAdGhpbmtwYWxtLmluZm8iLCJnaXZlbl9uYW1lIjoicmFudml0LnMiLCJmYW1pbHlfbmFtZSI6InN1cmkiLCJlbWFpbCI6InJhbnZpdC5zQHRoaW5rcGFsbS5pbmZvIn0.UDfHRek5E4M7efC2hbYsjt8V05ikpPXEl2RqzulH_3pBnSqT4L0URc5Lq3xlEleXxrNE3vz8MAgf8V8yGY1ALMqyokLiL3PA4mWkeC1J7KonPDQD7zLvU-MSLiT0SEFGdIrImr-ZNs1uS9cwfBpml0eVxYCPxN0UO9Va3x_hkP_vSfxnk0Hh_znV90O9XseOM2C_p8lw8NymOOxiWQXSzg63OMKmJJk6eL9lmbotA1258SOW3xFs4uVpbpiygG5d-ckWeka_lGYGEVsuXFln4QIdyCPuXV8gl7T5IZS5TVG_Xpq3fepsbpKo5-K9giyzPjMTic5R5pmx8Q6UlTDnIw",
//     },
//   });
//   await expect(input.value).toBe(
//     "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJxa1VoLVl2LWc3c25Zc3ktN1ktZVk0OE5TLTlzdldjWm9aMXFoMzZoYnpjIn0.eyJleHAiOjE2NDg2OTg1NjgsImlhdCI6MTY0ODU0MTA5MiwiYXV0aF90aW1lIjoxNjQ4NTI1NzY4LCJqdGkiOiIyNmY3OGViOC1jMjY4LTRjZDAtYmZiMy03MWE2YjY3Mjk1Y2IiLCJpc3MiOiJodHRwczovL2FjY291bnRzLXVhdC5hcG5leHRnZW4uY29tL2F1dGgvcmVhbG1zL2VsZW1lbnRzZ3MiLCJzdWIiOiI5YmVmMTY3Mi0zZTZlLTRmZWUtYTg5ZS1mM2FiMGIwMDI1NDAiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhbmd1bGFyLXdlYi1jbGllbnQiLCJub25jZSI6IjM1MTI1OTk5LWIyNjItNGQwNS05M2EzLWI2YTUxYjcyMzAxZSIsInNlc3Npb25fc3RhdGUiOiI2MDVlYjhhOC00MTE3LTQwMzgtOTk3Zi1jODk1ZmJkNTUzYzAiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vd3d3LXVhdC5hcG5leHRnZW4uY29tIiwiaHR0cHM6Ly9lbGVtZW50c2dzLW5nLmFwbmV4dGdlbi5jb20iLCJodHRwczovL2VsZW1lbnRzZ3MtdWF0LmFwbmV4dGdlbi5jb20iXSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInJvbGUiOiJBcHByb3ZQYXlPd25lcnMiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImlzRXh0ZXJuYWwiOmZhbHNlLCJuYW1lIjoicmFudml0LnMgc3VyaSIsImlkIjoiOWJlZjE2NzItM2U2ZS00ZmVlLWE4OWUtZjNhYjBiMDAyNTQwIiwicHJlZmVycmVkX3VzZXJuYW1lIjoicmFudml0LnNAdGhpbmtwYWxtLmluZm8iLCJnaXZlbl9uYW1lIjoicmFudml0LnMiLCJmYW1pbHlfbmFtZSI6InN1cmkiLCJlbWFpbCI6InJhbnZpdC5zQHRoaW5rcGFsbS5pbmZvIn0.UDfHRek5E4M7efC2hbYsjt8V05ikpPXEl2RqzulH_3pBnSqT4L0URc5Lq3xlEleXxrNE3vz8MAgf8V8yGY1ALMqyokLiL3PA4mWkeC1J7KonPDQD7zLvU-MSLiT0SEFGdIrImr-ZNs1uS9cwfBpml0eVxYCPxN0UO9Va3x_hkP_vSfxnk0Hh_znV90O9XseOM2C_p8lw8NymOOxiWQXSzg63OMKmJJk6eL9lmbotA1258SOW3xFs4uVpbpiygG5d-ckWeka_lGYGEVsuXFln4QIdyCPuXV8gl7T5IZS5TVG_Xpq3fepsbpKo5-K9giyzPjMTic5R5pmx8Q6UlTDnIw"
//   );
//   const internalView = screen.getByText(/Internal View/);
//   await fireEvent.click(internalView);

//   const Date = await screen.getByText(/Date/);
//   expect(Date).toBeInTheDocument();

//   // const pleaseSelect = await screen.getByText(/Please Select/);
//   // expect(pleaseSelect).toBeInTheDocument()

//   const types = await screen.getByText(/Types/);
//   expect(types).toBeInTheDocument();

//   const search = await screen.getByPlaceholderText(
//     /Search by Invoice, Customer/
//   );
//   expect(search).toBeInTheDocument();

//   const clearFilter = await screen.getByText(/Clear Filters/);
//   expect(clearFilter).toBeInTheDocument();
//   const clearFilterClick = await screen.getByTestId(/clearfilter/);
//   fireEvent.click(clearFilterClick);

//   const download = await screen.getByTestId("download");
//   fireEvent.click(download);
// });

// test("internal api working", async () => {
//   mock
//     .onGet(
//       `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/filter?page=1&pageSize=10000&transactionTypes=&statuses=&dateFrom=&dateTo=`
//     )
//     .reply(200, resDataInternal);

//   render(
//     <HashRouter>
//       <InvoiceListing />
//     </HashRouter>
//   );

//   const input = await screen.getByTestId("custom-element");
//   fireEvent.change(input, {
//     target: {
//       value:
//         "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJxa1VoLVl2LWc3c25Zc3ktN1ktZVk0OE5TLTlzdldjWm9aMXFoMzZoYnpjIn0.eyJleHAiOjE2NDg2OTg1NjgsImlhdCI6MTY0ODU0MTA5MiwiYXV0aF90aW1lIjoxNjQ4NTI1NzY4LCJqdGkiOiIyNmY3OGViOC1jMjY4LTRjZDAtYmZiMy03MWE2YjY3Mjk1Y2IiLCJpc3MiOiJodHRwczovL2FjY291bnRzLXVhdC5hcG5leHRnZW4uY29tL2F1dGgvcmVhbG1zL2VsZW1lbnRzZ3MiLCJzdWIiOiI5YmVmMTY3Mi0zZTZlLTRmZWUtYTg5ZS1mM2FiMGIwMDI1NDAiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhbmd1bGFyLXdlYi1jbGllbnQiLCJub25jZSI6IjM1MTI1OTk5LWIyNjItNGQwNS05M2EzLWI2YTUxYjcyMzAxZSIsInNlc3Npb25fc3RhdGUiOiI2MDVlYjhhOC00MTE3LTQwMzgtOTk3Zi1jODk1ZmJkNTUzYzAiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vd3d3LXVhdC5hcG5leHRnZW4uY29tIiwiaHR0cHM6Ly9lbGVtZW50c2dzLW5nLmFwbmV4dGdlbi5jb20iLCJodHRwczovL2VsZW1lbnRzZ3MtdWF0LmFwbmV4dGdlbi5jb20iXSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInJvbGUiOiJBcHByb3ZQYXlPd25lcnMiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImlzRXh0ZXJuYWwiOmZhbHNlLCJuYW1lIjoicmFudml0LnMgc3VyaSIsImlkIjoiOWJlZjE2NzItM2U2ZS00ZmVlLWE4OWUtZjNhYjBiMDAyNTQwIiwicHJlZmVycmVkX3VzZXJuYW1lIjoicmFudml0LnNAdGhpbmtwYWxtLmluZm8iLCJnaXZlbl9uYW1lIjoicmFudml0LnMiLCJmYW1pbHlfbmFtZSI6InN1cmkiLCJlbWFpbCI6InJhbnZpdC5zQHRoaW5rcGFsbS5pbmZvIn0.UDfHRek5E4M7efC2hbYsjt8V05ikpPXEl2RqzulH_3pBnSqT4L0URc5Lq3xlEleXxrNE3vz8MAgf8V8yGY1ALMqyokLiL3PA4mWkeC1J7KonPDQD7zLvU-MSLiT0SEFGdIrImr-ZNs1uS9cwfBpml0eVxYCPxN0UO9Va3x_hkP_vSfxnk0Hh_znV90O9XseOM2C_p8lw8NymOOxiWQXSzg63OMKmJJk6eL9lmbotA1258SOW3xFs4uVpbpiygG5d-ckWeka_lGYGEVsuXFln4QIdyCPuXV8gl7T5IZS5TVG_Xpq3fepsbpKo5-K9giyzPjMTic5R5pmx8Q6UlTDnIw",
//     },
//   });
//   await expect(input.value).toBe(
//     "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJxa1VoLVl2LWc3c25Zc3ktN1ktZVk0OE5TLTlzdldjWm9aMXFoMzZoYnpjIn0.eyJleHAiOjE2NDg2OTg1NjgsImlhdCI6MTY0ODU0MTA5MiwiYXV0aF90aW1lIjoxNjQ4NTI1NzY4LCJqdGkiOiIyNmY3OGViOC1jMjY4LTRjZDAtYmZiMy03MWE2YjY3Mjk1Y2IiLCJpc3MiOiJodHRwczovL2FjY291bnRzLXVhdC5hcG5leHRnZW4uY29tL2F1dGgvcmVhbG1zL2VsZW1lbnRzZ3MiLCJzdWIiOiI5YmVmMTY3Mi0zZTZlLTRmZWUtYTg5ZS1mM2FiMGIwMDI1NDAiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhbmd1bGFyLXdlYi1jbGllbnQiLCJub25jZSI6IjM1MTI1OTk5LWIyNjItNGQwNS05M2EzLWI2YTUxYjcyMzAxZSIsInNlc3Npb25fc3RhdGUiOiI2MDVlYjhhOC00MTE3LTQwMzgtOTk3Zi1jODk1ZmJkNTUzYzAiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vd3d3LXVhdC5hcG5leHRnZW4uY29tIiwiaHR0cHM6Ly9lbGVtZW50c2dzLW5nLmFwbmV4dGdlbi5jb20iLCJodHRwczovL2VsZW1lbnRzZ3MtdWF0LmFwbmV4dGdlbi5jb20iXSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInJvbGUiOiJBcHByb3ZQYXlPd25lcnMiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImlzRXh0ZXJuYWwiOmZhbHNlLCJuYW1lIjoicmFudml0LnMgc3VyaSIsImlkIjoiOWJlZjE2NzItM2U2ZS00ZmVlLWE4OWUtZjNhYjBiMDAyNTQwIiwicHJlZmVycmVkX3VzZXJuYW1lIjoicmFudml0LnNAdGhpbmtwYWxtLmluZm8iLCJnaXZlbl9uYW1lIjoicmFudml0LnMiLCJmYW1pbHlfbmFtZSI6InN1cmkiLCJlbWFpbCI6InJhbnZpdC5zQHRoaW5rcGFsbS5pbmZvIn0.UDfHRek5E4M7efC2hbYsjt8V05ikpPXEl2RqzulH_3pBnSqT4L0URc5Lq3xlEleXxrNE3vz8MAgf8V8yGY1ALMqyokLiL3PA4mWkeC1J7KonPDQD7zLvU-MSLiT0SEFGdIrImr-ZNs1uS9cwfBpml0eVxYCPxN0UO9Va3x_hkP_vSfxnk0Hh_znV90O9XseOM2C_p8lw8NymOOxiWQXSzg63OMKmJJk6eL9lmbotA1258SOW3xFs4uVpbpiygG5d-ckWeka_lGYGEVsuXFln4QIdyCPuXV8gl7T5IZS5TVG_Xpq3fepsbpKo5-K9giyzPjMTic5R5pmx8Q6UlTDnIw"
//   );
//   const internalView = screen.getByText(/Internal View/);
//   await fireEvent.click(internalView);

//   const tableText = await screen.findByText("100325");
//   expect(tableText).toBeInTheDocument();
// });

// test("client api working", async () => {
//   mock
//     .onGet(
//       `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/customer/filter?page=1&pageSize=10000&transactionTypes=&statuses=&dateFrom=&dateTo=`
//     )
//     .reply(200, resDataClient);

//   render(
//     <HashRouter>
//       <InvoiceListing />
//     </HashRouter>
//   );

//   const input = await screen.getByTestId("custom-element");
//   fireEvent.change(input, {
//     target: {
//       value:
//         "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJXTTFNMldSbzJvOFV1ZGhzV0toZko1M2hsY3lad2dlb2RucVVqTHJxdnZVIn0.eyJleHAiOjE2NDg3MDI1NDAsImlhdCI6MTY0ODUyOTc0MSwiYXV0aF90aW1lIjoxNjQ4NTI5NzQwLCJqdGkiOiJmMjU5YTA3ZC1jOWQzLTQyMjYtOTRkMy02OTU1NWRiMzkxNzIiLCJpc3MiOiJodHRwczovL2FjY291bnRzLXVhdC5hcG5leHRnZW4uY29tL2F1dGgvcmVhbG1zL2RzbW51dHJpdGlvbmFscHJvZHVjdHNhZyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJlZWQ5MjRiMy05N2IxLTQxMzMtYjZhMC0xMGUwMGRmNzAxNGUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhbmd1bGFyLXdlYi1jbGllbnQiLCJub25jZSI6IjIyZTcwZmFlLWI0NmYtNDc2MC04MmZjLTViZWMxMGUzNmJiNSIsInNlc3Npb25fc3RhdGUiOiJiN2ExMWY3Yi00NzIyLTRlZjctYjdhNi02YThkNGE0MGMzMzYiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vZHNtbnV0cml0aW9uYWxwcm9kdWN0c2FnLXVhdC5hcG5leHRnZW4uY29tIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLWRzbW51dHJpdGlvbmFscHJvZHVjdHNhZy11YXQiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInJvbGUiOiJ1c2VyIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc0V4dGVybmFsIjp0cnVlLCJuYW1lIjoiU2ltb24gTGFzdG5hbWV1Nml1bGUiLCJjdXN0b21lcklkIjoiYTliYmVlNmQtNzk3YS00NzI0LWE4NmEtNWIxYTJlMjg3NjNmIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiZHNtbnV0cml0aW9uYWxwcm9kdWN0c2FnQHByb3Rvbm1haWwuY29tIiwiaWQiOiJlZWQ5MjRiMy05N2IxLTQxMzMtYjZhMC0xMGUwMGRmNzAxNGUiLCJnaXZlbl9uYW1lIjoiU2ltb24iLCJmYW1pbHlfbmFtZSI6Ikxhc3RuYW1ldTZpdWxlIiwiY3VzdG9tZXJOYW1lIjoiRFNNIE51dHJpdGlvbmFsIFByb2R1Y3RzIEFHIiwiZW1haWwiOiJkc21udXRyaXRpb25hbHByb2R1Y3RzYWdAcHJvdG9ubWFpbC5jb20ifQ.dzJYbfHtsW2iT2dTPdSoP9ChqAzGvy4WFCar_wZ9kapLnbAfUAhx7R0em-kZIbYw8bUId8xNzA69sdKU_S1W1rhHDpyJXRHrY-0aEt5Gc5rmApVcQO548YOaAJ2J9SAMHiEU7QtEpA9Pj-hvJrkGNTAQPS2JXasMFzPDLAss5BslcR36-bJZuN63qpQ6xce8FwlHgDnoa3sQHyO6wANkwxE3mPCkZne7VrFLQC45t0G8TWCxqUY-_5v742x63Um2gyXSOYbX_Xq7vTI-guaKLL8trEyhlEJLSddbCGkNImfGmDyfVANHB_lItFPeiaHw4r0Arb44hBdMEp-bEdB4Mg",
//     },
//   });
//   await expect(input.value).toBe(
//     "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJXTTFNMldSbzJvOFV1ZGhzV0toZko1M2hsY3lad2dlb2RucVVqTHJxdnZVIn0.eyJleHAiOjE2NDg3MDI1NDAsImlhdCI6MTY0ODUyOTc0MSwiYXV0aF90aW1lIjoxNjQ4NTI5NzQwLCJqdGkiOiJmMjU5YTA3ZC1jOWQzLTQyMjYtOTRkMy02OTU1NWRiMzkxNzIiLCJpc3MiOiJodHRwczovL2FjY291bnRzLXVhdC5hcG5leHRnZW4uY29tL2F1dGgvcmVhbG1zL2RzbW51dHJpdGlvbmFscHJvZHVjdHNhZyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJlZWQ5MjRiMy05N2IxLTQxMzMtYjZhMC0xMGUwMGRmNzAxNGUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhbmd1bGFyLXdlYi1jbGllbnQiLCJub25jZSI6IjIyZTcwZmFlLWI0NmYtNDc2MC04MmZjLTViZWMxMGUzNmJiNSIsInNlc3Npb25fc3RhdGUiOiJiN2ExMWY3Yi00NzIyLTRlZjctYjdhNi02YThkNGE0MGMzMzYiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vZHNtbnV0cml0aW9uYWxwcm9kdWN0c2FnLXVhdC5hcG5leHRnZW4uY29tIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLWRzbW51dHJpdGlvbmFscHJvZHVjdHNhZy11YXQiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInJvbGUiOiJ1c2VyIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc0V4dGVybmFsIjp0cnVlLCJuYW1lIjoiU2ltb24gTGFzdG5hbWV1Nml1bGUiLCJjdXN0b21lcklkIjoiYTliYmVlNmQtNzk3YS00NzI0LWE4NmEtNWIxYTJlMjg3NjNmIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiZHNtbnV0cml0aW9uYWxwcm9kdWN0c2FnQHByb3Rvbm1haWwuY29tIiwiaWQiOiJlZWQ5MjRiMy05N2IxLTQxMzMtYjZhMC0xMGUwMGRmNzAxNGUiLCJnaXZlbl9uYW1lIjoiU2ltb24iLCJmYW1pbHlfbmFtZSI6Ikxhc3RuYW1ldTZpdWxlIiwiY3VzdG9tZXJOYW1lIjoiRFNNIE51dHJpdGlvbmFsIFByb2R1Y3RzIEFHIiwiZW1haWwiOiJkc21udXRyaXRpb25hbHByb2R1Y3RzYWdAcHJvdG9ubWFpbC5jb20ifQ.dzJYbfHtsW2iT2dTPdSoP9ChqAzGvy4WFCar_wZ9kapLnbAfUAhx7R0em-kZIbYw8bUId8xNzA69sdKU_S1W1rhHDpyJXRHrY-0aEt5Gc5rmApVcQO548YOaAJ2J9SAMHiEU7QtEpA9Pj-hvJrkGNTAQPS2JXasMFzPDLAss5BslcR36-bJZuN63qpQ6xce8FwlHgDnoa3sQHyO6wANkwxE3mPCkZne7VrFLQC45t0G8TWCxqUY-_5v742x63Um2gyXSOYbX_Xq7vTI-guaKLL8trEyhlEJLSddbCGkNImfGmDyfVANHB_lItFPeiaHw4r0Arb44hBdMEp-bEdB4Mg"
//   );
//   const clientView = screen.getByText(/Client View/);
//   await fireEvent.click(clientView);

//   const tableText = await screen.findByText("1000992");
//   expect(tableText).toBeInTheDocument();

//   const dropdown = await screen.findByText("Types");
//   fireEvent.click(dropdown);
// });

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
