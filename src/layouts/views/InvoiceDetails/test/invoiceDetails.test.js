import {
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
  waitFor,
} from "@testing-library/react";
import {
  HashRouter,
  Route,
  Routes,
  useParams,
  MemoryRouter,
  useLocation,
} from "react-router-dom";
import InvoiceDetails from "..";
// import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { mockapidata } from "./mockdata";
import axios from "axios";
import { act } from "react-dom/test-utils";
import { apiInvoiceMockData } from "../mockData";
import { BillsByInvoiceId } from "../../BillsTable/mockBills";
import {
  getApproveUrl,
  getRelatedInvoiceUrl,
  getApproveUrlNo,
  getBillingAddressUrl,
  getDeleteInvoiceUrl,
  getDownloadFileUrl,
  getDownloadUrl,
  getEmployeeBreakdownUrl,
  getExcelUrl,
  getNotesUrl,
  urls,
} from "../../../../urls/urls";
// describe("Invoice detail", () => {
//   let mock;
//   beforeAll(() => {
//     mock = new MockAdapter(axios);
//   });

//   afterEach(() => {
//     mock.reset();
//   });

//   test("routing", async () => {
//     const transactionTypes = "";
//     const statusType = "";
//     const dateFrom = "";
//     const dateTo = "";

//     const id = "ab9d400a-0b11-4a21-8505-7646f6caed8d";
//     const cid = "a9bbee6d-797a-4724-a86a-5b1a2e28763f";

//     mock
//       .onGet(
//         `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/customer/filter?page=1&pageSize=10000&transactionTypes=${transactionTypes}&statuses=${statusType}&dateFrom=${dateFrom}&dateTo=${dateTo}`
//       )
//       .reply(200, mockapidata.resInvoiceListing);

//     mock
//       .onGet(
//         urls.invoiceDetails + id
//       )
//       .replyOnce(200, mockapidata.resData);
//     mock
//       .onGet(
//         getBillingAddressUrl(cid)
//       )
//       .replyOnce(200, mockapidata.resAddressData);

//     mock
//       .onGet(
//         urls.countries
//       )
//       .replyOnce(200, mockapidata.resCountriesData);

//     mock
//       .onGet(urls.fee)
//       .replyOnce(200, mockapidata.resFeeData);

//     mock
//       .onGet(urls.lookup)
//       .reply(200, mockapidata.resLookupData);
//     act(() => {
//       render(
//         <HashRouter>
//           <Routes>
//             <Route path="/" element={<InvoiceListing />} />
//             <Route
//               path="/pay/invoicedetails:id/:cid"
//               element={<InvoiceDetails />}
//             />
//           </Routes>
//         </HashRouter>
//       );
//     });

//     const token = screen.getByTestId("custom-element");
//     fireEvent.input(token, { target: { value: "123" } });
//     const clientView = screen.getByText(/Client View/);
//     fireEvent.click(clientView);

//     const row = await waitFor(() => screen.getByText("1000991"));
//     fireEvent.click(row);

//     await waitForElementToBeRemoved(() => screen.getByText(/Loading/));

//     // const payrollTab = await waitFor(() => screen.getByText(/Payroll Journal/));
//   });
// });

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useParams: jest.fn(),
  // () => ({
  //   id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
  //   cid: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
  //   isClient: "true",
  // }),
  useRouteMatch: () => ({ url: "/pay/invoicedetailsid/cid" }),
  useLocation: jest
    .fn()
    .mockReturnValue({ state: { transactionType: 1, InvoiceId: "1001002" } }),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useParams: jest.fn(),
  // () => ({
  //   id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
  //   cid: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
  //   isClient: "true",
  // }),
  useRouteMatch: () => ({ url: "/pay/invoicedetailsid/cid" }),
  useLocation: jest
    .fn()
    .mockReturnValue({ state: { transactionType: 2, InvoiceId: "1001002" } }),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useParams: jest.fn(),
  // () => ({
  //   id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
  //   cid: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
  //   isClient: "true",
  // }),
  useRouteMatch: () => ({ url: "/pay/invoicedetailsid/cid" }),
  useLocation: jest
    .fn()
    .mockReturnValue({ state: { transactionType: 3, InvoiceId: "1001002" } }),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useParams: jest.fn(),
  // () => ({
  //   id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
  //   cid: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
  //   isClient: "true",
  // }),
  useRouteMatch: () => ({ url: "/pay/invoicedetailsid/cid" }),
  useLocation: jest
    .fn()
    .mockReturnValue({ state: { transactionType: 4, InvoiceId: "1001002" } }),
}));

const relatedid = "c4ae2c39-715b-4f70-8709-5b54360d09bd";
const id = "ab9d400a-0b11-4a21-8505-7646f6caed8d";
const cid = "E291C9F0-2476-4238-85CB-7AFECDD085E4";
const invoiceId = "1001002";
const invoiceid2 = "ab9d400a-0b11-4a21-8505-7646f6caed8d";
const blobUrl =
  "https://apnguatemeaservices.blob.core.windows.net/data/12751d17-f8e7-4af7-a90a-233c177229db.pdf";

localStorage.setItem(
  "accessToken",
  "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIwdmRELXE3ekFYdkFxUzRfTDdoUExua2ZJbVVzaW1NWE1ZWGoxVUYwUUxVIn0.eyJleHAiOjE2NTI0NDA0NTQsImlhdCI6MTY1MjQzODY1NCwiYXV0aF90aW1lIjowLCJqdGkiOiJjNjc1ZjYwMy0xNmQ1LTQ5MGEtYWQ3Mi04OWViNDFlMjdjZjMiLCJpc3MiOiJodHRwczovL2FjY291bnRzLWRldi5hdGxhc2J5ZWxlbWVudHMuY29tL3JlYWxtcy9BdGxhcyIsImF1ZCI6IkFBQSBCcm9rZXIiLCJzdWIiOiIyOGEzNDgzOS00Nzk4LTRmYWEtOTc4Ni0wNjc3ZTE2ODBmMjIiLCJ0eXAiOiJJRCIsImF6cCI6IkFBQSBCcm9rZXIiLCJzZXNzaW9uX3N0YXRlIjoiYWI5MjcwNTUtYjU1MC00N2M4LWEyYTgtYzJkNWNjNzg2MzRiIiwiYXRfaGFzaCI6IjdEV25wVExkdFZ3MnM1cFlaeVNCelEiLCJhY3IiOiIxIiwic2lkIjoiYWI5MjcwNTUtYjU1MC00N2M4LWEyYTgtYzJkNWNjNzg2MzRiIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl0sIlBlcm1pc3Npb25zIjp7IkUyOTFDOUYwLTI0NzYtNDIzOC04NUNCLTdBRkVDREQwODVFNCI6eyJOYW1lIjoiRUdTIiwiWm9uZSI6IkVVIiwiVHlwZSI6IkF0bGFzX093bmVycyIsIlBheW1lbnRzIjp7IlJvbGUiOiJGaW5hbmNlQVIiLCJNaXNjZWxsYW5lb3VzSW52b2ljZUNyZWF0aW9uIjpbIlNhdmUiLCJFZGl0Il0sIk1hbnVhbFBheXJvbGxJbnZvaWNlQ3JlYXRpb24iOlsiU2F2ZSIsIkVkaXQiXSwiSW52b2ljZUxpc3QiOlsiQWRkIiwiRWRpdCIsIkRvd25sb2FkIiwiVmlldyJdLCJQcm9mb3JtYUludm9pY2VDcmVhdGlvbiI6WyJTYXZlIiwiRWRpdCJdLCJDcmVkaXRNZW1vSW52b2ljZUNyZWF0aW9uIjpbIlNhdmUiLCJFZGl0Il0sIk1pc2NlbGxhbmVvdXNJbnZvaWNlIjpbIkFkZCIsIkRlbGV0ZUludm9pY2UiLCJEZWxldGVJdGVtIiwiUGF5IiwiRWRpdCIsIlZpZXciLCJTZW5kIiwiQnJvd3NlIiwiUmVqZWN0IiwiRXhwb3J0IiwiQ2xvc2UiLCJWb2lkIiwiRG93bmxvYWQiLCJQdWJsaXNoIiwiQXBwcm92ZSIsIkRlbGV0ZUZpbGUiXSwiSW52b2ljZURldGFpbHMiOlsiQWRkIiwiRGVsZXRlIiwiUGFpZCIsIkVkaXQiLCJWaWV3IiwiU2VuZCIsIkJyb3dzZSIsIlJlamVjdCIsIlNlbGVjdCIsIkV4cG9ydCIsIkNsb3NlIiwiVm9pZCIsIkRvd25sb2FkIiwiUHVibGlzaCIsIkFwcHJvdmUiLCJEZWxldGVGaWxlIl0sIkNyZWRpdE1lbW9JbnZvaWNlIjpbIkFkZCIsIkRlbGV0ZUludm9pY2UiLCJEZWxldGVJdGVtIiwiUGF5IiwiRWRpdCIsIlZpZXciLCJTZW5kIiwiQnJvd3NlIiwiUmVqZWN0IiwiRXhwb3J0IiwiQ2xvc2UiLCJWb2lkIiwiRG93bmxvYWQiLCJQdWJsaXNoIiwiQXBwcm92ZSIsIkRlbGV0ZUZpbGUiXSwiUHJvZm9ybWFJbnZvaWNlIjpbIkFkZCIsIkRlbGV0ZUludm9pY2UiLCJEZWxldGVJdGVtIiwiUGF5IiwiRWRpdCIsIlNlbmQiLCJCcm93c2UiLCJSZWplY3QiLCJFeHBvcnQiLCJDbG9zZSIsIlZvaWQiLCJEb3dubG9hZCIsIlB1Ymxpc2giLCJBcHByb3ZlIiwiRGVsZXRlRmlsZSJdfX19LCJHcm91cCBNZW1iZXJzaGlwcyI6WyIvWm9uZXMvRVUvT3JnYW5pemF0aW9ucy9BdGxhc19Pd25lcnMvRUdTL1BheW1lbnRzL0ZpbmFuY2VBUiIsIi9Sb2xlcy9QYXltZW50cy9GaW5hbmNlQVIiLCIvU3Vic2NyaXB0aW9ucy9QYXltZW50cyJdLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJwYXltZW50c2ZpbmFuY2VhcnVzZXJAc29tZS1vcmcuY29tIn0.DdBvd-6ivuV9e3oPNT6RodPnuTJwvjX9P098LEzIEtee-T9O9887HDSnyYKq-ukOBdQEHQaFYsxU8agEnQbJOPKeba2t1urFKeKX1LqsD5FPQ66-Ulq3N2zgjqAC7gRjAIvSAU64WRubFlQP_-A3aQn8ETS-Y3M_hb1-a9YpHXMgUumYo0pDFriHXjOZXGO3RaooDZBVqSRVTJiQEy37-4DzqJWqLEOxbnpEqSKqoWksmzXoMYrssm4sxSD6D-68f7LN_hZ5k1_Q_D39LbZh5HLF2kw9XfJ-IErvwuOKF5gD499JTum3NEslpvZH1eBvnlAjsuW1hqXdlbD1GqpeMQ"
);
localStorage.setItem("current-org-id", "E291C9F0-2476-4238-85CB-7AFECDD085E4");
localStorage.setItem(
  "current-org",
  '{ "Name": "EGS", "Zone": "EU", "Type": "Atlas_Owners", "Payments": { "Role": "FinanceAR", "MiscellaneousInvoiceCreation": [ "Save", "Edit" ], "ManualPayrollInvoiceCreation": [ "Save", "Edit" ], "InvoiceList": [ "Add", "Edit", "Download", "View" ], "ProformaInvoiceCreation": [ "Save", "Edit" ], "CreditMemoInvoiceCreation": [ "Save", "Edit" ], "MiscellaneousInvoice": [ "Add", "DeleteInvoice", "DeleteItem", "Pay", "Edit", "View", "Send", "Browse", "Reject", "Export", "Close", "Void", "Download", "Publish", "Approve", "DeleteFile" ], "InvoiceDetails": [ "Add", "Delete", "Paid", "Edit", "View", "Send", "Browse", "Reject", "Select", "Export", "Close", "Void", "Download", "Publish", "Approve", "DeleteFile" ], "CreditMemoInvoice": [ "Add", "DeleteInvoice", "DeleteItem", "Pay", "Edit", "View", "Send", "Browse", "Reject", "Export", "Close", "Void", "Download", "Publish", "Approve", "DeleteFile" ], "ProformaInvoice": [ "Add", "DeleteInvoice", "DeleteItem", "Pay", "Edit", "Send", "Browse", "Reject", "Export", "Close", "Void", "Download", "Publish", "Approve", "DeleteFile" ] } }'
);

describe("Invoice details", () => {
  beforeAll(() => {
    useParams.mockImplementation(() => ({
      id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
      cid: "E291C9F0-2476-4238-85CB-7AFECDD085E4",
      isClient: "true",
    }));

    useLocation.mockImplementation(() => ({
      state: {
        transactionType: 1,
      },
    }));

    const mock = new MockAdapter(axios);

    mock.onGet(urls.invoiceDetails + id).reply(200, mockapidata.resData);
    mock.onGet(urls.billsPerInvoice + invoiceId).reply(200, BillsByInvoiceId);
    mock
      .onGet(getBillingAddressUrl(cid))
      .reply(200, mockapidata.resAddressData);

    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);

    mock
      .onGet(getRelatedInvoiceUrl(relatedid))
      .reply(200, mockapidata.RelatedMock);

    mock.onGet(urls.fee).reply(200, mockapidata.resFeeData);

    mock.onGet(urls.lookup).reply(200, mockapidata.resLookupData);

    mock.onGet(getNotesUrl(id)).reply(200, mockapidata.notes);

    mock.onPut(getApproveUrlNo(id, 2)).reply(201);

    mock.onPut(getApproveUrlNo(id, 4)).reply(201);

    mock.onPut(getApproveUrl(id)).reply(201);

    mock.onPost(urls.saveNote).reply(200, mockapidata.notesPost);

    mock.onGet(getDownloadFileUrl(blobUrl)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getDownloadUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getExcelUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getEmployeeBreakdownUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onPost(urls.declineInvoice).reply(200, mockapidata.declineInvoicePost);
  });

  test("tabs are working", async () => {
    render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );

    waitForElementToBeRemoved(() => screen.getByText(/Loading/));

    const payrollTab = await waitFor(() => screen.getByText(/Payroll Journal/));
    screen.logTestingPlaygroundURL();
    fireEvent.click(payrollTab);
    const masterTab = await waitFor(() => screen.getByText(/Master Invoice/));
    fireEvent.click(masterTab);
    const filesTab = await waitFor(() => screen.getByText(/Files & Notes/));
    if (filesTab) {
      fireEvent.click(filesTab);
    }

    // expect(payrollTab).toBeInTheDocument();
  });

  test("download clickable ", async () => {
    render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );

    await waitForElementToBeRemoved(() => screen.getByText(/Loading/));

    const download = screen.getByText(/Download/);
    fireEvent.click(download);
    const pdf = await waitFor(() => screen.getByText(/Invoice as PDF/));
    fireEvent.click(pdf);
    fireEvent.click(download);
    const excel = await waitFor(() => screen.getByText(/Invoice as Excel/));
    fireEvent.click(excel);
    fireEvent.click(download);
    const BreakDown = await waitFor(() =>
      screen.getByText(/Employee Breakdown/)
    );
    fireEvent.click(BreakDown);
  });

  test("approve invoice clickable ", async () => {
    render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );

    await waitForElementToBeRemoved(() => screen.getByText(/Loading/));

    const approve = screen.getByTestId("approve-button");
    fireEvent.click(approve);
  });

  test("publish notes", async () => {
    render(
      <HashRouter>
        ``
        <InvoiceDetails />
      </HashRouter>
    );

    await waitForElementToBeRemoved(() => screen.getByText(/Loading/));
    const filesTab = await waitFor(() => screen.getByText(/Files & Notes/));
    if (filesTab) {
      fireEvent.click(filesTab);
    }
    const input = await waitFor(() =>
      screen.getByPlaceholderText(/Add a note here.../)
    );
    fireEvent.change(input, { target: { value: "Pending" } });
    const publish = screen.getByText(/Save/);
    fireEvent.click(publish);
  });

  test("download file", async () => {
    render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );

    await waitForElementToBeRemoved(() => screen.getByText(/Loading/));
    const filesTab = await waitFor(() => screen.getByText(/Files & Notes/));
    if (filesTab) {
      fireEvent.click(filesTab);
    }
    const download = await waitFor(() =>
      screen.getByTestId(/file-upload-button-0/)
    );
    fireEvent.click(download);
  });
  test("delete file", async () => {
    render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );

    await waitForElementToBeRemoved(() => screen.getByText(/Loading/));
    const filesTab = await waitFor(() => screen.getByText(/Files & Notes/));
    if (filesTab) {
      fireEvent.click(filesTab);
    }
    const download = await waitFor(() =>
      screen.getByTestId(/file-upload-button-1/)
    );
    fireEvent.click(download);
  });
  test("Navigate with breadcrumbs", async () => {
    render(
      <HashRouter>
        <InvoiceDetails></InvoiceDetails>
      </HashRouter>
    );

    await waitForElementToBeRemoved(() => screen.getAllByText(/Loading/));
    const breadcrumbs = await waitFor(() => screen.getAllByText(/Invoices/));
    fireEvent.click(breadcrumbs[0]);
  });
  test("Decline invoice click on cancel button", async () => {
    render(
      <HashRouter>
        <InvoiceDetails></InvoiceDetails>
      </HashRouter>
    );

    await waitForElementToBeRemoved(() => screen.getByText(/Loading/));

    const decline = screen.getByTestId("decline-button");
    fireEvent.click(decline);

    const cancelButton = await waitFor(() =>
      screen.getByTestId("decline-cancel-button")
    );
    expect(cancelButton).toBeInTheDocument();
    fireEvent.click(cancelButton);
  });

  test("Decline invoice onchange textarea and click on decline button", async () => {
    render(
      <HashRouter>
        <InvoiceDetails></InvoiceDetails>
      </HashRouter>
    );

    await waitForElementToBeRemoved(() => screen.getByText(/Loading/));

    const decline = screen.getByTestId("decline-button");
    fireEvent.click(decline);

    const textarea = await waitFor(() =>
      screen.getByPlaceholderText("Please Enter a Reason")
    );
    expect(textarea).toBeInTheDocument();
    fireEvent.change(textarea, { target: { value: "test" } });

    const declineSubmit = screen.getByTestId("decline-button-submit");
    fireEvent.click(declineSubmit);
  });
});
describe("Api returns transaction type = 7", () => {
  beforeAll(() => {
    useParams.mockImplementation(() => ({
      id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
      cid: "E291C9F0-2476-4238-85CB-7AFECDD085E4",
      isClient: "true",
    }));
    const mock = new MockAdapter(axios);

    mock.onGet(urls.billsPerInvoice + invoiceId).reply(200, BillsByInvoiceId);
    mock.onGet(urls.invoiceDetails + id).reply(200, apiInvoiceMockData);
    mock
      .onGet(getBillingAddressUrl(cid))
      .reply(200, mockapidata.resAddressData);

    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);

    mock.onGet(urls.fee).reply(200, mockapidata.resFeeData);

    mock.onGet(urls.lookup).reply(200, mockapidata.resLookupData);

    mock.onGet(getNotesUrl(id)).reply(200, mockapidata.notes);

    mock.onPut(getApproveUrlNo(id, 2)).reply(201);

    mock.onPut(getApproveUrl(id)).reply(201);

    mock.onPost(urls.saveNote).reply(200, mockapidata.notesPost);

    mock.onGet(getDownloadFileUrl(blobUrl)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getDownloadUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getExcelUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });
  });
  test("Render Invoice Details", () => {
    render(
      <HashRouter>
        <InvoiceDetails></InvoiceDetails>
      </HashRouter>
    );
  });
});
describe("Invoice details decline api fail case handling", () => {
  beforeAll(() => {
    useParams.mockImplementation(() => ({
      id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
      cid: "E291C9F0-2476-4238-85CB-7AFECDD085E4",
      isClient: "true",
    }));

    useLocation.mockImplementation(() => ({
      state: {
        transactionType: 1,
      },
    }));

    const mock = new MockAdapter(axios);

    mock
      .onGet(
        // urls.invoiceDetails +
        urls.invoiceDetails + id
      )
      .reply(200, mockapidata.resData);
    mock.onGet(urls.billsPerInvoice + invoiceId).reply(200, BillsByInvoiceId);
    mock
      .onGet(getBillingAddressUrl(cid))
      .reply(200, mockapidata.resAddressData);

    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);

    mock.onGet(urls.fee).reply(200, mockapidata.resFeeData);

    mock.onGet(urls.lookup).reply(200, mockapidata.resLookupData);

    mock.onGet(getNotesUrl(id)).reply(200, mockapidata.notes);

    mock.onPut(getApproveUrlNo(id, 2)).reply(201);

    mock.onPut(getApproveUrl(id)).reply(201);

    mock.onPost(urls.saveNote).reply(200, mockapidata.notesPost);

    mock.onGet(getDownloadFileUrl(blobUrl)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getDownloadUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getExcelUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });
    mock.onPost(urls.declineInvoice).reply(400, mockapidata.declineInvoicePost);
  });

  test("Decline invoice onchange textarea click on decline button failed api", async () => {
    render(
      <HashRouter>
        <InvoiceDetails></InvoiceDetails>
      </HashRouter>
    );

    await waitForElementToBeRemoved(() => screen.getByText(/Loading/));

    const decline = screen.getByTestId("decline-button");
    fireEvent.click(decline);

    const textarea = await waitFor(() =>
      screen.getByPlaceholderText("Please Enter a Reason")
    );
    expect(textarea).toBeInTheDocument();
    fireEvent.change(textarea, { target: { value: "test" } });

    const declineSubmit = screen.getByTestId("decline-button-submit");
    fireEvent.click(declineSubmit);
  });
});
describe("void test cases on Apprroved", () => {
  beforeAll(() => {
    useParams.mockImplementation(() => ({
      id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
      cid: "E291C9F0-2476-4238-85CB-7AFECDD085E4",
      isClient: "false",
    }));
    const mock = new MockAdapter(axios);

    mockapidata.resData.invoice.status = 4;
    mock.onGet(urls.invoiceDetails + id).reply(200, mockapidata.resData);
    mock.onGet(urls.billsPerInvoice + invoiceId).reply(200, BillsByInvoiceId);
    mock
      .onGet(getBillingAddressUrl(cid))
      .reply(200, mockapidata.resAddressData);

    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);

    mock.onGet(urls.fee).reply(200, mockapidata.resFeeData);

    mock.onGet(urls.lookup).reply(200, mockapidata.resLookupData);

    mock.onGet(getNotesUrl(id)).reply(200, mockapidata.notes);

    mock.onPut(getApproveUrlNo(id, 2)).reply(201);

    mock.onPut(getApproveUrl(id)).reply(201);

    mock.onPost(urls.saveNote).reply(200, mockapidata.notesPost);

    mock.onGet(getDownloadFileUrl(blobUrl)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getDownloadUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getExcelUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });
    mock.onPost(urls.declineInvoice).reply(200, mockapidata.declineInvoicePost);

    mock.onPost(urls.voidInvoice).reply(200, mockapidata.voidApiPost);

    mock.onPost(urls.uploadFile).reply(200, mockapidata.uploadFile);

    mock.onPost(urls.createDocument).reply(200, mockapidata.createDocument);
  });

  test("tabs are working", async () => {
    const file = new File(["hello"], "hello.pdf", { type: "application/pdf" });

    render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );

    waitForElementToBeRemoved(() => screen.getByText(/Loading/));

    const buttonVoidInvoice = await screen.findByText(/Void Invoice/);
    fireEvent.click(buttonVoidInvoice);

    expect(buttonVoidInvoice).toBeInTheDocument();
    const placeHolderText = await screen.findByPlaceholderText(
      /Enter note here/
    );
    expect(placeHolderText).toBeInTheDocument();
    fireEvent.click(placeHolderText);
    fireEvent.change(placeHolderText, { target: { value: "Notes Testing" } });

    const attachmenttestId = await screen.findByTestId("attachmenttestId");
    expect(attachmenttestId).toBeInTheDocument();
    await waitFor(() =>
      fireEvent.change(attachmenttestId, {
        target: { files: [file] },
      })
    );

    const pdfFile = await screen.findAllByText(/hello.pdf/);
    expect(pdfFile[0]).toBeInTheDocument();

    const voidButtonId = await screen.findByTestId("void-button-id");
    expect(voidButtonId).toBeInTheDocument();
    fireEvent.click(voidButtonId);

    const confirmText = await screen.findAllByText(
      /Are you sure you want to void this invoice?/
    );
    expect(confirmText[0]).toBeInTheDocument();

    const voidConfirm = await screen.findByTestId("Void-button-submit");
    expect(voidConfirm).toBeInTheDocument();
    fireEvent.click(voidConfirm);
  });
});
describe("void test cases on Apprroved Upload Api Failed", () => {
  beforeAll(() => {
    useParams.mockImplementation(() => ({
      id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
      cid: "E291C9F0-2476-4238-85CB-7AFECDD085E4",
      isClient: "false",
    }));
    useLocation.mockImplementation(() => ({
      state: {
        transactionType: 1,
      },
    }));
    const mock = new MockAdapter(axios);

    mockapidata.resData.invoice.status = 4;
    mock.onGet(urls.invoiceDetails + id).reply(200, mockapidata.resData);
    mock.onGet(urls.billsPerInvoice + invoiceId).reply(200, BillsByInvoiceId);
    mock
      .onGet(getBillingAddressUrl(cid))
      .reply(200, mockapidata.resAddressData);

    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);

    mock.onGet(urls.fee).reply(200, mockapidata.resFeeData);

    mock.onGet(urls.lookup).reply(200, mockapidata.resLookupData);

    mock.onGet(getNotesUrl(id)).reply(200, mockapidata.notes);

    mock.onPut(getApproveUrlNo(id, 2)).reply(201);

    mock.onPut(getApproveUrl(id)).reply(201);

    mock.onPost(urls.saveNote).reply(200, mockapidata.notesPost);

    mock.onGet(getDownloadFileUrl(blobUrl)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getDownloadUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getExcelUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });
    mock.onPost(urls.declineInvoice).reply(200, mockapidata.declineInvoicePost);

    mock.onPost(urls.voidInvoice).reply(200, mockapidata.voidApiPost);

    mock.onPost(urls.uploadFile).reply(400, mockapidata.uploadFile);

    mock.onPost(urls.createDocument).reply(200, mockapidata.createDocument);
  });

  test("tabs are working", async () => {
    const file = new File(["hello"], "hello.pdf", { type: "application/pdf" });

    render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );

    waitForElementToBeRemoved(() => screen.getByText(/Loading/));

    const buttonVoidInvoice = await screen.findByText(/Void Invoice/);
    fireEvent.click(buttonVoidInvoice);

    expect(buttonVoidInvoice).toBeInTheDocument();
    const placeHolderText = await screen.findByPlaceholderText(
      /Enter note here/
    );
    expect(placeHolderText).toBeInTheDocument();
    fireEvent.click(placeHolderText);
    fireEvent.change(placeHolderText, { target: { value: "Notes Testing" } });

    const attachmenttestId = await screen.findByTestId("attachmenttestId");
    expect(attachmenttestId).toBeInTheDocument();
    await waitFor(() =>
      fireEvent.change(attachmenttestId, {
        target: { files: [file] },
      })
    );

    const pdfFile = await screen.findAllByText(/hello.pdf/);
    expect(pdfFile[0]).toBeInTheDocument();

    const voidButtonId = await screen.findByTestId("void-button-id");
    expect(voidButtonId).toBeInTheDocument();
    fireEvent.click(voidButtonId);

    const confirmText = await screen.findAllByText(
      /Are you sure you want to void this invoice?/
    );
    expect(confirmText[0]).toBeInTheDocument();

    const voidConfirm = await screen.findByTestId("Void-button-submit");
    expect(voidConfirm).toBeInTheDocument();
    fireEvent.click(voidConfirm);
  });
});
describe("void test cases on Apprroved Create Api Failed", () => {
  beforeAll(() => {
    useParams.mockImplementation(() => ({
      id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
      cid: "E291C9F0-2476-4238-85CB-7AFECDD085E4",
      isClient: "false",
    }));
    useLocation.mockImplementation(() => ({
      state: {
        transactionType: 1,
      },
    }));
    const mock = new MockAdapter(axios);

    mockapidata.resData.invoice.status = 4;
    mock.onGet(urls.invoiceDetails + id).reply(200, mockapidata.resData);
    mock.onGet(urls.billsPerInvoice + invoiceId).reply(200, BillsByInvoiceId);
    mock
      .onGet(getBillingAddressUrl(cid))
      .reply(200, mockapidata.resAddressData);

    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);

    mock.onGet(urls.fee).reply(200, mockapidata.resFeeData);

    mock.onGet(urls.lookup).reply(200, mockapidata.resLookupData);

    mock.onGet(getNotesUrl(id)).reply(200, mockapidata.notes);

    mock.onPut(getApproveUrlNo(id, 2)).reply(201);

    mock.onPut(getApproveUrl(id)).reply(201);

    mock.onPost(urls.saveNote).reply(200, mockapidata.notesPost);

    mock.onGet(getDownloadFileUrl(blobUrl)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getDownloadUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getExcelUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });
    mock.onPost(urls.declineInvoice).reply(200, mockapidata.declineInvoicePost);

    mock.onPost(urls.voidInvoice).reply(200, mockapidata.voidApiPost);

    mock.onPost(urls.uploadFile).reply(200, mockapidata.uploadFile);

    mock.onPost(urls.createDocument).reply(400, mockapidata.createDocument);
  });

  test("tabs are working", async () => {
    const file = new File(["hello"], "hello.pdf", { type: "application/pdf" });

    render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );

    waitForElementToBeRemoved(() => screen.getByText(/Loading/));

    const buttonVoidInvoice = await screen.findByText(/Void Invoice/);
    fireEvent.click(buttonVoidInvoice);

    expect(buttonVoidInvoice).toBeInTheDocument();
    const placeHolderText = await screen.findByPlaceholderText(
      /Enter note here/
    );
    expect(placeHolderText).toBeInTheDocument();
    fireEvent.click(placeHolderText);
    fireEvent.change(placeHolderText, { target: { value: "Notes Testing" } });

    const attachmenttestId = await screen.findByTestId("attachmenttestId");
    expect(attachmenttestId).toBeInTheDocument();
    await waitFor(() =>
      fireEvent.change(attachmenttestId, {
        target: { files: [file] },
      })
    );

    const pdfFile = await screen.findAllByText(/hello.pdf/);
    expect(pdfFile[0]).toBeInTheDocument();

    const voidButtonId = await screen.findByTestId("void-button-id");
    expect(voidButtonId).toBeInTheDocument();
    fireEvent.click(voidButtonId);

    const confirmText = await screen.findAllByText(
      /Are you sure you want to void this invoice?/
    );
    expect(confirmText[0]).toBeInTheDocument();

    const voidConfirm = await screen.findByTestId("Void-button-submit");
    expect(voidConfirm).toBeInTheDocument();
    fireEvent.click(voidConfirm);
  });
});
describe("void test cases on Apprroved Void Api Failed", () => {
  beforeAll(() => {
    useParams.mockImplementation(() => ({
      id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
      cid: "E291C9F0-2476-4238-85CB-7AFECDD085E4",
      isClient: "false",
    }));
    useLocation.mockImplementation(() => ({
      state: {
        transactionType: 1,
      },
    }));
    const mock = new MockAdapter(axios);

    mockapidata.resData.invoice.status = 4;
    mock.onGet(urls.invoiceDetails + id).reply(200, mockapidata.resData);
    mock.onGet(urls.billsPerInvoice + invoiceId).reply(200, BillsByInvoiceId);
    mock
      .onGet(getBillingAddressUrl(cid))
      .reply(200, mockapidata.resAddressData);

    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);

    mock.onGet(urls.fee).reply(200, mockapidata.resFeeData);

    mock.onGet(urls.lookup).reply(200, mockapidata.resLookupData);

    mock.onGet(getNotesUrl(id)).reply(200, mockapidata.notes);

    mock.onPut(getApproveUrlNo(id, 2)).reply(201);

    mock.onPut(getApproveUrl(id)).reply(201);

    mock.onPost(urls.saveNote).reply(200, mockapidata.notesPost);

    mock.onGet(getDownloadFileUrl(blobUrl)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getDownloadUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getExcelUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });
    mock.onPost(urls.declineInvoice).reply(200, mockapidata.declineInvoicePost);

    mock.onPost(urls.voidInvoice).reply(400, mockapidata.voidApiPost);

    mock.onPost(urls.uploadFile).reply(200, mockapidata.uploadFile);

    mock.onPost(urls.createDocument).reply(200, mockapidata.createDocument);
  });

  test("tabs are working", async () => {
    const file = new File(["hello"], "hello.pdf", { type: "application/pdf" });

    render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );

    waitForElementToBeRemoved(() => screen.getByText(/Loading/));

    const buttonVoidInvoice = await screen.findByText(/Void Invoice/);
    fireEvent.click(buttonVoidInvoice);

    expect(buttonVoidInvoice).toBeInTheDocument();
    const placeHolderText = await screen.findByPlaceholderText(
      /Enter note here/
    );
    expect(placeHolderText).toBeInTheDocument();
    fireEvent.click(placeHolderText);
    fireEvent.change(placeHolderText, { target: { value: "Notes Testing" } });

    const attachmenttestId = await screen.findByTestId("attachmenttestId");
    expect(attachmenttestId).toBeInTheDocument();
    await waitFor(() =>
      fireEvent.change(attachmenttestId, {
        target: { files: [file] },
      })
    );

    const pdfFile = await screen.findAllByText(/hello.pdf/);
    expect(pdfFile[0]).toBeInTheDocument();

    const voidButtonId = await screen.findByTestId("void-button-id");
    expect(voidButtonId).toBeInTheDocument();
    fireEvent.click(voidButtonId);

    const confirmText = await screen.findAllByText(
      /Are you sure you want to void this invoice?/
    );
    expect(confirmText[0]).toBeInTheDocument();

    const voidConfirm = await screen.findByTestId("Void-button-submit");
    expect(voidConfirm).toBeInTheDocument();
    fireEvent.click(voidConfirm);
  });
});
describe("void test cases on Apprroved and click on cancel", () => {
  beforeAll(() => {
    useParams.mockImplementation(() => ({
      id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
      cid: "E291C9F0-2476-4238-85CB-7AFECDD085E4",
      isClient: "false",
    }));
    useLocation.mockImplementation(() => ({
      state: {
        transactionType: 1,
      },
    }));
    const mock = new MockAdapter(axios);

    mockapidata.resData.invoice.status = 4;
    mock.onGet(urls.invoiceDetails + id).reply(200, mockapidata.resData);
    mock.onGet(urls.billsPerInvoice + invoiceId).reply(200, BillsByInvoiceId);
    mock
      .onGet(getBillingAddressUrl(cid))
      .reply(200, mockapidata.resAddressData);

    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);

    mock.onGet(urls.fee).reply(200, mockapidata.resFeeData);

    mock.onGet(urls.lookup).reply(200, mockapidata.resLookupData);

    mock.onGet(getNotesUrl(id)).reply(200, mockapidata.notes);

    mock.onPut(getApproveUrlNo(id, 2)).reply(201);

    mock.onPut(getApproveUrl(id)).reply(201);

    mock.onPost(urls.saveNote).reply(200, mockapidata.notesPost);

    mock.onGet(getDownloadFileUrl(blobUrl)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getDownloadUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getExcelUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });
    mock.onPost(urls.declineInvoice).reply(200, mockapidata.declineInvoicePost);

    mock.onPost(urls.voidInvoice).reply(200, mockapidata.voidApiPost);

    mock.onPost(urls.uploadFile).reply(200, mockapidata.uploadFile);

    mock.onPost(urls.createDocument).reply(200, mockapidata.createDocument);
  });

  test("tabs are working", async () => {
    const file = new File(["hello"], "hello.pdf", { type: "application/pdf" });

    render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );

    waitForElementToBeRemoved(() => screen.getByText(/Loading/));

    const buttonVoidInvoice = await screen.findByText(/Void Invoice/);
    fireEvent.click(buttonVoidInvoice);

    expect(buttonVoidInvoice).toBeInTheDocument();
    const placeHolderText = await screen.findByPlaceholderText(
      /Enter note here/
    );
    expect(placeHolderText).toBeInTheDocument();
    fireEvent.click(placeHolderText);
    fireEvent.change(placeHolderText, { target: { value: "Notes Testing" } });

    const attachmenttestId = await screen.findByTestId("attachmenttestId");
    expect(attachmenttestId).toBeInTheDocument();
    await waitFor(() =>
      fireEvent.change(attachmenttestId, {
        target: { files: [file] },
      })
    );

    const pdfFile = await screen.findAllByText(/hello.pdf/);
    expect(pdfFile[0]).toBeInTheDocument();

    const voidButtonId = await screen.findByTestId("void-button-id");
    expect(voidButtonId).toBeInTheDocument();
    fireEvent.click(voidButtonId);

    const confirmText = await screen.findAllByText(
      /Are you sure you want to void this invoice?/
    );
    expect(confirmText[0]).toBeInTheDocument();

    const cancelId = await screen.findByTestId("Void-button-Cancel");
    expect(cancelId).toBeInTheDocument();
    fireEvent.click(cancelId);
  });
});
// describe("void test cases for Checkobox", () => {
//   beforeAll(() => {
//     useParams.mockImplementation(() => ({
//       id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
//       cid: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
//       isClient: "false",
//     }));
//     const mock = new MockAdapter(axios);

//     mockapidata.resData.invoice.status = 4;
//     mock
//       .onGet(
//         urls.invoiceDetails +
//           id
//       )
//       .reply(200, mockapidata.resData);
//     mock
//       .onGet(
//         urls.billsPerInvoice +
//           invoiceId
//       )
//       .reply(200, BillsByInvoiceId);
//     mock
//       .onGet(
//         getBillingAddressUrl(cid)
//       )
//       .reply(200, mockapidata.resAddressData);

//     mock
//       .onGet(
//         urls.countries
//       )
//       .reply(200, mockapidata.resCountriesData);

//     mock
//       .onGet(urls.fee)
//       .reply(200, mockapidata.resFeeData);

//     mock
//       .onGet(urls.lookup)
//       .reply(200, mockapidata.resLookupData);

//     mock
//       .onGet(
//         getNotesUrl(id)
//       )
//       .reply(200, mockapidata.notes);

//     mock
//       .onPut(
//         getApproveUrl(id)
//       )
//       .reply(201);

//     mock
//       .onPost(
//         urls.saveNote
//       )
//       .reply(200, mockapidata.notesPost);

//     mock
//       .onGet(
//         getDownloadFileUrl(blobUrl)
//       )
//       .reply(200, {
//         url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
//         name: "sample.pdf",
//       });

//     mock
//       .onGet(
//         getDownloadUrl(id)
//       )
//       .reply(200, {
//         url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
//         name: "sample.pdf",
//       });

//     mock
//       .onGet(
//         getExcelUrl(id)
//       )
//       .reply(200, {
//         url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
//         name: "sample.pdf",
//       });
//     mock
//       .onPost(
//         urls.declineInvoice
//       )
//       .reply(200, mockapidata.declineInvoicePost);

//     mock
//       .onPost(
//         urls.voidInvoice
//       )
//       .reply(200, mockapidata.voidApiPost);

//     mock
//       .onPost(
//         urls.uploadFile
//       )
//       .reply(200, mockapidata.uploadFile);

//     mock
//       .onPost(
//         urls.createDocument
//       )
//       .reply(200, mockapidata.createDocument);
//   });

//   test("tabs are working", async () => {
//     render(
//       <HashRouter>
//         <InvoiceDetails />
//       </HashRouter>
//     );

//     waitForElementToBeRemoved(() => screen.getByText(/Loading/));

//     const filesTab = await waitFor(() => screen.getByText(/Files & Notes/));
//     fireEvent.click(filesTab);

//     const customerCheckbox = await screen.findByText(/Visible to Customer/);
//     fireEvent.click(customerCheckbox);

//     const checkBox2 = await screen.findByText(/Export to Quickbooks/);
//     fireEvent.click(checkBox2);
//   });
// });

describe("api fail", () => {
  beforeAll(() => {
    useParams.mockImplementation(() => ({
      id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
      cid: "E291C9F0-2476-4238-85CB-7AFECDD085E4",
      isClient: "false",
    }));
    const mock = new MockAdapter(axios);

    mockapidata.resData.invoice.status = 4;
    mock
      .onGet(urls.invoiceDetails + id)
      .reply(500, mockapidata.resAddressDataFailedApi);
    mock.onGet(urls.billsPerInvoice + invoiceId).reply(200, BillsByInvoiceId);
    mock
      .onGet(getBillingAddressUrl(cid))
      .reply(404, mockapidata.resAddressDataFailedApi);

    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);

    mock.onGet(urls.fee).reply(200, mockapidata.resFeeData);

    mock.onGet(urls.lookup).reply(200, mockapidata.resLookupData);

    mock.onGet(getNotesUrl(id)).reply(200, mockapidata.notes);

    mock.onPut(getApproveUrlNo(id, 2)).reply(201);

    mock.onPut(getApproveUrl(id)).reply(201);

    mock.onPost(urls.saveNote).reply(200, mockapidata.notesPost);

    mock.onGet(getDownloadFileUrl(blobUrl)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getDownloadUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getExcelUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });
    mock.onPost(urls.declineInvoice).reply(200, mockapidata.declineInvoicePost);

    mock.onPost(urls.voidInvoice).reply(200, mockapidata.voidApiPost);

    mock.onPost(urls.uploadFile).reply(200, mockapidata.uploadFile);

    mock.onPost(urls.createDocument).reply(200, mockapidata.createDocument);
  });

  test("tabs are working", async () => {
    const file = new File(["hello"], "hello.pdf", { type: "application/pdf" });

    render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );

    waitForElementToBeRemoved(() => screen.getByText(/Loading/));

    const attachmenttestId = await screen.findAllByText(
      /Something went wrong!/
    );
    expect(attachmenttestId[0]).toBeInTheDocument();
  });
});

describe("delete test cases on AR Reveiew on true", () => {
  beforeAll(() => {
    useParams.mockImplementation(() => ({
      id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
      cid: "E291C9F0-2476-4238-85CB-7AFECDD085E4",
      isClient: "false",
    }));
    useLocation.mockImplementation(() => ({
      state: {
        transactionType: 1,
      },
    }));
    const mock = new MockAdapter(axios);

    mockapidata.resData.invoice.status = 2;
    mock.onGet(urls.invoiceDetails + id).reply(200, mockapidata.resData);
    mock.onGet(urls.billsPerInvoice + invoiceId).reply(200, BillsByInvoiceId);
    mock
      .onGet(getBillingAddressUrl(cid))
      .reply(200, mockapidata.resAddressData);

    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);

    mock.onGet(urls.fee).reply(200, mockapidata.resFeeData);

    mock.onGet(urls.lookup).reply(200, mockapidata.resLookupData);

    mock.onGet(getNotesUrl(id)).reply(200, mockapidata.notes);

    mock.onPut(getApproveUrlNo(id, 2)).reply(201);

    mock.onPut(getApproveUrl(id)).reply(201);

    mock.onPost(urls.saveNote).reply(200, mockapidata.notesPost);

    mock.onGet(getDownloadFileUrl(blobUrl)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getDownloadUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getExcelUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });
    mock.onPost(urls.declineInvoice).reply(200, mockapidata.declineInvoicePost);

    mock.onPost(urls.voidInvoice).reply(200, mockapidata.voidApiPost);

    mock.onPost(urls.uploadFile).reply(200, mockapidata.uploadFile);

    mock.onPost(urls.createDocument).reply(200, mockapidata.createDocument);

    mock.onDelete(getDeleteInvoiceUrl(invoiceid2)).reply(200, true);
  });

  test("tabs are working", async () => {
    const file = new File(["hello"], "hello.pdf", { type: "application/pdf" });

    render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );

    waitForElementToBeRemoved(() => screen.getByText(/Loading/));

    const buttonDeleteInvoice = await screen.findByText(/Delete Invoice/);
    fireEvent.click(buttonDeleteInvoice);

    const confirmText = await screen.findAllByText(
      /Are you sure you want to Delete this invoice permanently?/
    );
    expect(confirmText[0]).toBeInTheDocument();

    const deleteConfirm = await screen.findByTestId("delete-button-submit");
    expect(deleteConfirm).toBeInTheDocument();
    fireEvent.click(deleteConfirm);
  });
});
describe("delete test cases on AR Reveiew click on cancel button", () => {
  beforeAll(() => {
    useParams.mockImplementation(() => ({
      id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
      cid: "E291C9F0-2476-4238-85CB-7AFECDD085E4",
      isClient: "false",
    }));
    useLocation.mockImplementation(() => ({
      state: {
        transactionType: 1,
      },
    }));
    const mock = new MockAdapter(axios);

    mockapidata.resData.invoice.status = 2;
    mock.onGet(urls.invoiceDetails + id).reply(200, mockapidata.resData);
    mock.onGet(urls.billsPerInvoice + invoiceId).reply(200, BillsByInvoiceId);
    mock
      .onGet(getBillingAddressUrl(cid))
      .reply(200, mockapidata.resAddressData);

    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);

    mock.onGet(urls.fee).reply(200, mockapidata.resFeeData);

    mock.onGet(urls.lookup).reply(200, mockapidata.resLookupData);

    mock.onGet(getNotesUrl(id)).reply(200, mockapidata.notes);

    mock.onPut(getApproveUrlNo(id, 2)).reply(201);

    mock.onPut(getApproveUrl(id)).reply(201);

    mock.onPost(urls.saveNote).reply(200, mockapidata.notesPost);

    mock.onGet(getDownloadFileUrl(blobUrl)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getDownloadUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getExcelUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });
    mock.onPost(urls.declineInvoice).reply(200, mockapidata.declineInvoicePost);

    mock.onPost(urls.voidInvoice).reply(200, mockapidata.voidApiPost);

    mock.onPost(urls.voidUploadFile).reply(200, mockapidata.uploadFile);

    mock.onPost(urls.voidCreateDoc).reply(200, mockapidata.createDocument);

    mock.onDelete(getDeleteInvoiceUrl(invoiceid2)).reply(200, true);
  });

  test("tabs are working", async () => {
    const file = new File(["hello"], "hello.pdf", { type: "application/pdf" });

    render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );

    waitForElementToBeRemoved(() => screen.getByText(/Loading/));

    const buttonDeleteInvoice = await screen.findByText(/Delete Invoice/);
    fireEvent.click(buttonDeleteInvoice);

    const confirmText = await screen.findAllByText(
      /Are you sure you want to Delete this invoice permanently?/
    );
    expect(confirmText[0]).toBeInTheDocument();

    const deleteCancel = await screen.findByTestId("delete-button-Cancel");
    expect(deleteCancel).toBeInTheDocument();
    fireEvent.click(deleteCancel);
  });
});
describe("delete test cases on AR Reveiew on false", () => {
  beforeAll(() => {
    useParams.mockImplementation(() => ({
      id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
      cid: "E291C9F0-2476-4238-85CB-7AFECDD085E4",
      isClient: "false",
    }));
    useLocation.mockImplementation(() => ({
      state: {
        transactionType: 1,
      },
    }));
    const mock = new MockAdapter(axios);

    mockapidata.resData.invoice.status = 2;
    mock.onGet(urls.invoiceDetails + id).reply(200, mockapidata.resData);
    mock.onGet(urls.billsPerInvoice + invoiceId).reply(200, BillsByInvoiceId);
    mock
      .onGet(getBillingAddressUrl(cid))
      .reply(200, mockapidata.resAddressData);

    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);

    mock.onGet(urls.fee).reply(200, mockapidata.resFeeData);

    mock.onGet(urls.lookup).reply(200, mockapidata.resLookupData);

    mock.onGet(getNotesUrl(id)).reply(200, mockapidata.notes);

    mock.onPut(getApproveUrlNo(id, 2)).reply(201);

    mock.onPut(getApproveUrl(id)).reply(201);

    mock.onPost(urls.saveNote).reply(200, mockapidata.notesPost);

    mock.onGet(getDownloadFileUrl(blobUrl)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getDownloadUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getExcelUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });
    mock.onPost(urls.declineInvoice).reply(200, mockapidata.declineInvoicePost);

    mock.onPost(urls.voidInvoice).reply(200, mockapidata.voidApiPost);

    mock.onPost(urls.uploadFile).reply(200, mockapidata.uploadFile);

    mock.onPost(urls.createDocument).reply(200, mockapidata.createDocument);

    mock.onDelete(getDeleteInvoiceUrl(invoiceid2)).reply(200, false);
  });

  test("tabs are working", async () => {
    const file = new File(["hello"], "hello.pdf", { type: "application/pdf" });

    render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );

    waitForElementToBeRemoved(() => screen.getByText(/Loading/));

    const buttonDeleteInvoice = await screen.findByText(/Delete Invoice/);
    fireEvent.click(buttonDeleteInvoice);

    const confirmText = await screen.findAllByText(
      /Are you sure you want to Delete this invoice permanently?/
    );
    expect(confirmText[0]).toBeInTheDocument();

    const deleteConfirm = await screen.findByTestId("delete-button-submit");
    expect(deleteConfirm).toBeInTheDocument();
    fireEvent.click(deleteConfirm);
  });
});

describe("delete test cases on AR Reveiew on api fail", () => {
  beforeAll(() => {
    useParams.mockImplementation(() => ({
      id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
      cid: "E291C9F0-2476-4238-85CB-7AFECDD085E4",
      isClient: "false",
    }));
    useLocation.mockImplementation(() => ({
      state: {
        transactionType: 1,
      },
    }));
    const mock = new MockAdapter(axios);

    mockapidata.resData.invoice.status = 2;
    mock.onGet(urls.invoiceDetails + id).reply(200, mockapidata.resData);
    mock.onGet(urls.billsPerInvoice + invoiceId).reply(200, BillsByInvoiceId);
    mock
      .onGet(getBillingAddressUrl(cid))
      .reply(200, mockapidata.resAddressData);

    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);

    mock.onGet(urls.fee).reply(200, mockapidata.resFeeData);

    mock.onGet(urls.lookup).reply(200, mockapidata.resLookupData);

    mock.onGet(getNotesUrl(id)).reply(200, mockapidata.notes);

    mock.onPut(getApproveUrlNo(id, 2)).reply(201);

    mock.onPut(getApproveUrl(id)).reply(201);

    mock.onPost(urls.saveNote).reply(200, mockapidata.notesPost);

    mock.onGet(getDownloadFileUrl(blobUrl)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getDownloadUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getExcelUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });
    mock.onPost(urls.declineInvoice).reply(200, mockapidata.declineInvoicePost);

    mock.onPost(urls.voidInvoice).reply(200, mockapidata.voidApiPost);

    mock.onPost(urls.uploadFile).reply(200, mockapidata.uploadFile);

    mock.onPost(urls.createDocument).reply(200, mockapidata.createDocument);

    mock.onDelete(getDeleteInvoiceUrl(invoiceid2)).reply(400, true);
  });

  test("tabs are working", async () => {
    const file = new File(["hello"], "hello.pdf", { type: "application/pdf" });

    render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );

    waitForElementToBeRemoved(() => screen.getByText(/Loading/));

    const buttonDeleteInvoice = await screen.findByText(/Delete Invoice/);
    fireEvent.click(buttonDeleteInvoice);

    const confirmText = await screen.findAllByText(
      /Are you sure you want to Delete this invoice permanently?/
    );
    expect(confirmText[0]).toBeInTheDocument();

    const deleteConfirm = await screen.findByTestId("delete-button-submit");
    expect(deleteConfirm).toBeInTheDocument();
    fireEvent.click(deleteConfirm);
  });
});
describe("Invoice details auto approve checkbox click", () => {
  beforeAll(() => {
    useParams.mockImplementation(() => ({
      id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
      cid: "E291C9F0-2476-4238-85CB-7AFECDD085E4",
      isClient: "false",
    }));
    useLocation.mockImplementation(() => ({
      state: {
        transactionType: 1,
      },
    }));
    const mock = new MockAdapter(axios);

    mock.onGet(urls.invoiceDetails + id).reply(200, mockapidata.resData);
    mock.onGet(urls.billsPerInvoice + invoiceId).reply(200, BillsByInvoiceId);
    mock
      .onGet(getBillingAddressUrl(cid))
      .reply(200, mockapidata.resAddressData);

    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);

    mock.onGet(urls.fee).reply(200, mockapidata.resFeeData);

    mock.onGet(urls.lookup).reply(200, mockapidata.resLookupData);

    mock.onGet(getNotesUrl(id)).reply(200, mockapidata.notes);

    mock.onPut(getApproveUrlNo(id, 2)).reply(201);

    mock.onPut(getApproveUrl(id)).reply(201);

    mock.onPost(urls.saveNote).reply(200, mockapidata.notesPost);

    mock.onGet(getDownloadFileUrl(blobUrl)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getDownloadUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getExcelUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });
    mock.onPost(urls.declineInvoice).reply(200, mockapidata.declineInvoicePost);
    mock
      .onPost(
        `https://apigw-dev-eu.atlasbyelements.com/atlas-invoiceservice/api/Invoices/SaveInvoiceSetting/?invoiceId=ab9d400a-0b11-4a21-8505-7646f6caed8d&settingTypeId=1&IsActive=true`
      )
      .reply(200, true);
  });

  test("approve invoice clickable ", async () => {
    render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );

    await waitForElementToBeRemoved(() => screen.getByText(/Loading/));

    const approve = await screen.getByText(/Auto-Approval after 24h/);
    fireEvent.click(approve);

    // const approveUncheckSuccesfully = screen.getByText(
    //   /Auto-approval removed from Invoice successfully/
    // );
    // expect(approveUncheckSuccesfully).toBeInTheDocument();

    // fireEvent.click(approve);

    // const crossButton = await screen.getByTestId("toast-cross-button");
    // fireEvent.click(crossButton);

    // const approveSuccesfully = await screen.findAllByText(
    //   /Invoice set to Auto-approve successfully/
    // );
    // expect(approveSuccesfully[0]).toBeInTheDocument();

    // fireEvent.click(approve);
  });
});
describe("Invoice details auto approve checkbox click api fail", () => {
  beforeAll(() => {
    useParams.mockImplementation(() => ({
      id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
      cid: "E291C9F0-2476-4238-85CB-7AFECDD085E4",
      isClient: "false",
    }));
    useLocation.mockImplementation(() => ({
      state: {
        transactionType: 1,
      },
    }));
    const mock = new MockAdapter(axios);

    mock.onGet(urls.invoiceDetails + id).reply(200, mockapidata.resData);
    mock.onGet(urls.billsPerInvoice + invoiceId).reply(200, BillsByInvoiceId);
    mock
      .onGet(getBillingAddressUrl(cid))
      .reply(200, mockapidata.resAddressData);

    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);

    mock.onGet(urls.fee).reply(200, mockapidata.resFeeData);

    mock.onGet(urls.lookup).reply(200, mockapidata.resLookupData);

    mock.onGet(getNotesUrl(id)).reply(200, mockapidata.notes);

    mock.onPut(getApproveUrlNo(id, 2)).reply(201);

    mock.onPut(getApproveUrl(id)).reply(201);

    mock.onPost(urls.saveNote).reply(200, mockapidata.notesPost);

    mock.onGet(getDownloadFileUrl(blobUrl)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getDownloadUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getExcelUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });
    mock.onPost(urls.declineInvoice).reply(200, mockapidata.declineInvoicePost);
    mock
      .onPost(
        `https://apigw-dev-eu.atlasbyelements.com/atlas-invoiceservice/api/Invoices/SaveInvoiceSetting/?invoiceId=ab9d400a-0b11-4a21-8505-7646f6caed8d&settingTypeId=1&IsActive=true`
      )
      .reply(400, true);
  });

  test("approve invoice clickable ", async () => {
    render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );

    await waitForElementToBeRemoved(() => screen.getByText(/Loading/));

    const approve = await screen.getByText(/Auto-Approval after 24h/);
    fireEvent.click(approve);
  });
});

describe("Invoice details fee api fail", () => {
  beforeAll(() => {
    useParams.mockImplementation(() => ({
      id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
      cid: "E291C9F0-2476-4238-85CB-7AFECDD085E4",
      isClient: "true",
    }));
    useLocation.mockImplementation(() => ({
      state: {
        transactionType: 1,
      },
    }));
    const mock = new MockAdapter(axios);

    mock.onGet(urls.invoiceDetails + id).reply(500, mockapidata.resData);
    mock.onGet(urls.billsPerInvoice + invoiceId).reply(200, BillsByInvoiceId);
    mock
      .onGet(getBillingAddressUrl(cid))
      .reply(200, mockapidata.resAddressData);

    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);

    mock.onGet(urls.fee).reply(200, mockapidata.resFeeData);

    mock.onGet(urls.lookup).reply(200, mockapidata.resLookupData);

    mock.onGet(getNotesUrl(id)).reply(200, mockapidata.notes);

    mock.onPut(getApproveUrlNo(id, 2)).reply(201);

    mock.onPut(getApproveUrl(id)).reply(201);

    mock.onPost(urls.saveNote).reply(200, mockapidata.notesPost);

    mock.onGet(getDownloadFileUrl(blobUrl)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getDownloadUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getExcelUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });
    mock.onPost(urls.declineInvoice).reply(200, mockapidata.declineInvoicePost);
  });

  test("tabs are working", async () => {
    render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );

    waitForElementToBeRemoved(() => screen.getByText(/Loading/));

    // const payrollTab = await waitFor(() => screen.getByText(/Payroll Journal/));
    // screen.logTestingPlaygroundURL();
    // fireEvent.click(payrollTab);
    // const masterTab = await waitFor(() => screen.getByText(/Master Invoice/));
    // fireEvent.click(masterTab);
    // const filesTab = await waitFor(() => screen.getByText(/Files & Notes/));
    // if (filesTab) { fireEvent.click(filesTab) }

    // expect(payrollTab).toBeInTheDocument();
  });

  // test("download clickable ", async () => {
  //   render(
  //     <HashRouter>
  //       <InvoiceDetails />
  //     </HashRouter>
  //   );

  //   await waitForElementToBeRemoved(() => screen.getByText(/Loading/));

  //   const download = screen.getByText(/Download/);
  //   fireEvent.click(download);
  //   const pdf = await waitFor(() => screen.getByText(/Invoice as PDF/));
  //   fireEvent.click(pdf);
  //   fireEvent.click(download);
  //   const excel = await waitFor(() => screen.getByText(/Invoice as Excel/));
  //   fireEvent.click(excel);
  // });

  // test("approve invoice clickable ", async () => {
  //   render(
  //     <HashRouter>
  //       <InvoiceDetails />
  //     </HashRouter>
  //   );

  //   await waitForElementToBeRemoved(() => screen.getByText(/Loading/));

  //   const approve = screen.getByText(/Approve Invoice/);
  //   fireEvent.click(approve);
  // });

  // test("publish notes", async () => {
  //   render(
  //     <HashRouter>
  //       <InvoiceDetails />
  //     </HashRouter>
  //   );

  //   await waitForElementToBeRemoved(() => screen.getByText(/Loading/));
  //   const filesTab = await waitFor(() => screen.getByText(/Files & Notes/));
  //   if (filesTab) { fireEvent.click(filesTab) }
  //   const input = await waitFor(() =>
  //     screen.getByPlaceholderText(/Add a note here.../)
  //   );
  //   fireEvent.change(input, { target: { value: "Pending" } });
  //   const publish = screen.getByText(/Save/);
  //   fireEvent.click(publish);
  // });

  // test("download file", async () => {
  //   render(
  //     <HashRouter>
  //       <InvoiceDetails />
  //     </HashRouter>
  //   );

  //   await waitForElementToBeRemoved(() => screen.getByText(/Loading/));
  //   const filesTab = await waitFor(() => screen.getByText(/Files & Notes/));
  //   if (filesTab) { fireEvent.click(filesTab) }
  //   const download = await waitFor(() =>
  //     screen.getByTestId(/file-upload-button-0/)
  //   );
  //   fireEvent.click(download);
  // });
  // test("delete file", async () => {
  //   render(
  //     <HashRouter>
  //       <InvoiceDetails />
  //     </HashRouter>
  //   );

  //   await waitForElementToBeRemoved(() => screen.getByText(/Loading/));
  //   const filesTab = await waitFor(() => screen.getByText(/Files & Notes/));
  //   if (filesTab) { fireEvent.click(filesTab) }
  //   const download = await waitFor(() =>
  //     screen.getByTestId(/file-upload-button-1/)
  //   );
  //   fireEvent.click(download);
  // });
  // test("Navigate with breadcrumbs", async () => {
  //   render(
  //     <HashRouter>
  //       <InvoiceDetails></InvoiceDetails>
  //     </HashRouter>
  //   );

  //   await waitForElementToBeRemoved(() => screen.getAllByText(/Loading/));
  //   const breadcrumbs = await waitFor(() => screen.getAllByText(/Invoices/));
  //   fireEvent.click(breadcrumbs[0]);
  // });
  // test("Decline invoice click on cancel button", async () => {
  //   render(
  //     <HashRouter>
  //       <InvoiceDetails></InvoiceDetails>
  //     </HashRouter>
  //   );

  //   await waitForElementToBeRemoved(() => screen.getByText(/Loading/));

  //   const decline = screen.getByTestId("decline-button");
  //   fireEvent.click(decline);

  //   const cancelButton = await waitFor(() =>
  //     screen.getByTestId("decline-cancel-button")
  //   );
  //   expect(cancelButton).toBeInTheDocument();
  //   fireEvent.click(cancelButton);
  // });

  // test("Decline invoice onchange textarea and click on decline button", async () => {
  //   render(
  //     <HashRouter>
  //       <InvoiceDetails></InvoiceDetails>
  //     </HashRouter>
  //   );

  //   await waitForElementToBeRemoved(() => screen.getByText(/Loading/));

  //   const decline = screen.getByTestId("decline-button");
  //   fireEvent.click(decline);

  //   const textarea = await waitFor(() =>
  //     screen.getByPlaceholderText("Please Enter a Reason")
  //   );
  //   expect(textarea).toBeInTheDocument();
  //   fireEvent.change(textarea, { target: { value: "test" } });

  //   const declineSubmit = screen.getByTestId("decline-button-submit");
  //   fireEvent.click(declineSubmit);
  // });
});

describe("Invoice details invoice detail api fail", () => {
  beforeAll(() => {
    useParams.mockImplementation(() => ({
      id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
      cid: "E291C9F0-2476-4238-85CB-7AFECDD085E4",
      isClient: "true",
    }));
    const mock = new MockAdapter(axios);

    mock.onGet(urls.invoiceDetails + id).reply(200, mockapidata.resData);
    mock.onGet(urls.billsPerInvoice + invoiceId).reply(200, BillsByInvoiceId);
    mock
      .onGet(getBillingAddressUrl(cid))
      .reply(200, mockapidata.resAddressData);

    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);

    mock.onGet(urls.fee).reply(500, mockapidata.resFeeData);

    mock.onGet(urls.lookup).reply(200, mockapidata.resLookupData);

    mock.onGet(getNotesUrl(id)).reply(200, mockapidata.notes);

    mock.onPut(getApproveUrlNo(id, 2)).reply(201);

    mock.onPut(getApproveUrl(id)).reply(201);

    mock.onPost(urls.saveNote).reply(200, mockapidata.notesPost);

    mock.onGet(getDownloadFileUrl(blobUrl)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getDownloadUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getExcelUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });
    mock.onPost(urls.declineInvoice).reply(200, mockapidata.declineInvoicePost);
  });

  test("tabs are working", async () => {
    render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );

    waitForElementToBeRemoved(() => screen.getByText(/Loading/));

    // const payrollTab = await waitFor(() => screen.getByText(/Payroll Journal/));
    // screen.logTestingPlaygroundURL();
    // fireEvent.click(payrollTab);
    // const masterTab = await waitFor(() => screen.getByText(/Master Invoice/));
    // fireEvent.click(masterTab);
    // const filesTab = await waitFor(() => screen.getByText(/Files & Notes/));
    // if (filesTab) { fireEvent.click(filesTab) }

    // expect(payrollTab).toBeInTheDocument();
  });
});

describe("Invoice details lookup api fail", () => {
  beforeAll(() => {
    useParams.mockImplementation(() => ({
      id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
      cid: "E291C9F0-2476-4238-85CB-7AFECDD085E4",
      isClient: "true",
    }));
    const mock = new MockAdapter(axios);

    mock.onGet(urls.invoiceDetails + id).reply(200, mockapidata.resData);
    mock.onGet(urls.billsPerInvoice + invoiceId).reply(200, BillsByInvoiceId);
    mock
      .onGet(getBillingAddressUrl(cid))
      .reply(200, mockapidata.resAddressData);

    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);

    mock.onGet(urls.fee).reply(200, mockapidata.resFeeData);

    mock.onGet(urls.lookup).reply(500, mockapidata.resLookupData);

    mock.onGet(getNotesUrl(id)).reply(200, mockapidata.notes);

    mock.onPut(getApproveUrlNo(id, 2)).reply(201);

    mock.onPut(getApproveUrl(id)).reply(201);

    mock.onPost(urls.saveNote).reply(200, mockapidata.notesPost);

    mock.onGet(getDownloadFileUrl(blobUrl)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getDownloadUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getExcelUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });
    mock.onPost(urls.declineInvoice).reply(200, mockapidata.declineInvoicePost);
  });

  test("tabs are working", async () => {
    render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );

    waitForElementToBeRemoved(() => screen.getByText(/Loading/));

    // const payrollTab = await waitFor(() => screen.getByText(/Payroll Journal/));
    // screen.logTestingPlaygroundURL();
    // fireEvent.click(payrollTab);
    // const masterTab = await waitFor(() => screen.getByText(/Master Invoice/));
    // fireEvent.click(masterTab);
    // const filesTab = await waitFor(() => screen.getByText(/Files & Notes/));
    // if (filesTab) { fireEvent.click(filesTab) }

    // expect(payrollTab).toBeInTheDocument();
  });
});

describe("Invoice details countries api fail", () => {
  beforeAll(() => {
    useParams.mockImplementation(() => ({
      id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
      cid: "E291C9F0-2476-4238-85CB-7AFECDD085E4",
      isClient: "true",
    }));
    const mock = new MockAdapter(axios);

    mock.onGet(urls.invoiceDetails + id).reply(200, mockapidata.resData);
    mock.onGet(urls.billsPerInvoice + invoiceId).reply(200, BillsByInvoiceId);
    mock
      .onGet(getBillingAddressUrl(cid))
      .reply(200, mockapidata.resAddressData);

    mock.onGet(urls.countries).reply(500, mockapidata.resCountriesData);

    mock.onGet(urls.fee).reply(200, mockapidata.resFeeData);

    mock.onGet(urls.lookup).reply(200, mockapidata.resLookupData);

    mock.onGet(getNotesUrl(id)).reply(200, mockapidata.notes);

    mock.onPut(getApproveUrlNo(id, 2)).reply(201);

    mock.onPut(getApproveUrl(id)).reply(201);

    mock.onPost(urls.saveNote).reply(200, mockapidata.notesPost);

    mock.onGet(getDownloadFileUrl(blobUrl)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getDownloadUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getExcelUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });
    mock.onPost(urls.declineInvoice).reply(200, mockapidata.declineInvoicePost);
  });

  test("tabs are working", async () => {
    render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );

    waitForElementToBeRemoved(() => screen.getByText(/Loading/));

    // const payrollTab = await waitFor(() => screen.getByText(/Payroll Journal/));
    // screen.logTestingPlaygroundURL();
    // fireEvent.click(payrollTab);
    // const masterTab = await waitFor(() => screen.getByText(/Master Invoice/));
    // fireEvent.click(masterTab);
    // const filesTab = await waitFor(() => screen.getByText(/Files & Notes/));
    // if (filesTab) { fireEvent.click(filesTab) }

    // expect(payrollTab).toBeInTheDocument();
  });
});

describe("Invoice details employeeBreakDown api fail", () => {
  beforeAll(() => {
    useParams.mockImplementation(() => ({
      id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
      cid: "E291C9F0-2476-4238-85CB-7AFECDD085E4",
      isClient: "true",
    }));
    useLocation.mockImplementation(() => ({
      state: {
        transactionType: 1,
      },
    }));
    const mock = new MockAdapter(axios);

    mock.onGet(urls.invoiceDetails + id).reply(200, mockapidata.resData);
    mock.onGet(urls.billsPerInvoice + invoiceId).reply(200, BillsByInvoiceId);
    mock
      .onGet(getBillingAddressUrl(cid))
      .reply(200, mockapidata.resAddressData);

    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);

    mock.onGet(urls.fee).reply(200, mockapidata.resFeeData);

    mock.onGet(urls.lookup).reply(200, mockapidata.resLookupData);

    mock.onGet(getNotesUrl(id)).reply(200, mockapidata.notes);

    mock.onPut(getApproveUrlNo(id, 2)).reply(201);

    mock.onPut(getApproveUrl(id)).reply(201);

    mock.onPost(urls.saveNote).reply(200, mockapidata.notesPost);

    mock.onGet(getDownloadFileUrl(blobUrl)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getDownloadUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getExcelUrl(id)).reply(200, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onGet(getEmployeeBreakdownUrl(id)).reply(500, {
      url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
      name: "sample.pdf",
    });

    mock.onPost(urls.declineInvoice).reply(200, mockapidata.declineInvoicePost);
  });

  test("download clickable ", async () => {
    render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );

    await waitForElementToBeRemoved(() => screen.getByText(/Loading/));

    const download = screen.getByText(/Download/);
    fireEvent.click(download);
    const pdf = await waitFor(() => screen.getByText(/Invoice as PDF/));
    fireEvent.click(pdf);
    fireEvent.click(download);
    const excel = await waitFor(() => screen.getByText(/Invoice as Excel/));
    fireEvent.click(excel);

    fireEvent.click(download);
    const BreakDown = await waitFor(() =>
      screen.getByText(/Employee Breakdown/)
    );
    fireEvent.click(BreakDown);
  });
});

describe("Invoice details view change log click", () => {
  beforeAll(() => {
    useParams.mockImplementation(() => ({
      id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
      cid: "E291C9F0-2476-4238-85CB-7AFECDD085E4",
      isClient: "true",
    }));

    useLocation.mockImplementation(() => ({
      state: {
        transactionType: 1,
      },
    }));

    const mock = new MockAdapter(axios);

    mock.onGet(urls.invoiceDetails + id).reply(200, mockapidata.resData);
    mock.onGet(urls.billsPerInvoice + invoiceId).reply(200, BillsByInvoiceId);
    mock
      .onGet(getBillingAddressUrl(cid))
      .reply(200, mockapidata.resAddressData);

    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);

    mock.onGet(urls.fee).reply(200, mockapidata.resFeeData);

    mock.onGet(urls.lookup).reply(200, mockapidata.resLookupData);

    mock.onGet(getNotesUrl(id)).reply(200, mockapidata.notes);

    mock.onPost(urls.saveNote).reply(200, mockapidata.notesPost);

    mock
      .onGet(urls.invoiceLogs.replace("{invoice-id}", id))
      .reply(200, mockapidata.resInvoiceNotesData);
  });

  test("publish notes", async () => {
    render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );
      return
    await waitForElementToBeRemoved(() => screen.getByText(/Loading/));
    const filesTab = await waitFor(() => screen.getByText(/Files & Notes/));
    if (filesTab) {
      fireEvent.click(filesTab);
    }
    const input = await waitFor(() =>
      screen.getByPlaceholderText(/Add a note here.../)
    );
    fireEvent.change(input, { target: { value: "Pending" } });
    const publish = await waitFor(() => screen.getByText(/Save/));
    fireEvent.click(publish);

    const changeViewText = await screen.findByText(/View Change Log/);
    fireEvent.click(changeViewText);

    // const text = await screen.findByText(/test 9/);
    // expect(text).toBeInTheDocument();

    const viewMoreText = await screen.findByText(/View More/);
    fireEvent.click(viewMoreText);
    fireEvent.click(viewMoreText);
    fireEvent.click(viewMoreText);

    // screen.logTestingPlaygroundURL();

    // const viewLessText = await screen.findByText(/View Less/);
    // fireEvent.click(viewLessText);
  });
});
