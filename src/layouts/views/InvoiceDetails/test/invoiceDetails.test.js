import {
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
  waitFor,
} from "@testing-library/react";
import { HashRouter, useParams, useLocation } from "react-router-dom";
import InvoiceDetails from "..";
// import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { mockapidata, mockCreditMemoDatas } from "./mockdata";
import axios from "axios";
import { apiInvoiceMockData } from "../mockData";
import { BillsByInvoiceId } from "../../BillsTable/mockBills";
import {
  getUpdateCreditMemoUrl,
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
  getHeaders,
  subscriptionLookup,
  getVatValue,
  productInvoice,
  getPaymentDetailApi,
  editPaymentDetailApi,
} from "../../../../urls/urls";
import userEvent from "@testing-library/user-event";
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
const employeeId = "1000085";
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
    const tempToken = localStorage.getItem("accessToken");

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

    const status = "Approved";

    mock.onPut(getApproveUrlNo(id, 2)).reply(201, status);

    mock.onPut(getApproveUrlNo(id, 4)).reply(201);

    mock.onPut(getApproveUrl(id)).reply(201);

    mock
      .onPut(
        getUpdateCreditMemoUrl(id),
        mockCreditMemoDatas,
        getHeaders(tempToken, cid, id)
      )
      .reply(200, mockCreditMemoDatas);

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

    // const check1 = screen.getByTestId("check1");
    // fireEvent.click(check1);

    // const text1 = screen.getByText(/Employee Salary is not correct/);
    // fireEvent.click(text1);

    // const check2 = screen.getByTestId("check2");
    // fireEvent.click(check2);

    // const text2 = screen.getByText(/Benefit Amount is not correct/);
    // fireEvent.click(text2);

    // const check3 = screen.getByTestId("check3");
    // fireEvent.click(check3);

    // const text3 = screen.getByText(/One-off pay items amount to be updated/);
    // fireEvent.click(text3);

    // const check4 = screen.getByTestId("check4");
    // fireEvent.click(check4);

    // const text4 = screen.getByText(/Termination/);
    // fireEvent.click(text4);

    // const check5 = screen.getByTestId("check5");
    // fireEvent.click(check5);

    // const text5 = screen.getByText(/Invoice Calculation Error/);
    // fireEvent.click(text5);

    // const check6 = screen.getByTestId("check6");
    // fireEvent.click(check6);

    // const text6 = screen.getByText(/Fee Issue/);
    // fireEvent.click(text6);

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

describe("delete test cases on AR Reveiew on true  , and save invoice calander and po", () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));

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
    mock
      .onPut(urls.updateInvoiceCalendar)
      .reply(200, mockapidata.updateInvoiceCalendar);
  });

  //Vaidehi test
  //test("vaidehi test", async () => {
  ///  const component =  render(
  // <HashRouter>
  // <InvoiceDetails />
  //</HashRouter>
  //);

  // waitForElementToBeRemoved(() => screen.getByText(/Loading/));
  //const savebtn = await waitFor(() => screen.findByTestId("save-button"));
  //fireEvent.click(savebtn);
  // const notification = await waitFor(() => screen.queryByText("Your record has been saved successfully..!"));
  //const notification = await waitFor(() => screen.queryByText("Your record has been saved successfully..!"));
  //const notification2 = await waitFor(() => screen.findByTestId("toast-notify"));
  //console.log("noti" + notification);
  //expect(notification).toBeVisible();
  //expect(notification2).toBeVisible();
  //});

  test("vaidehi ponum", async () => {
    const component = render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );

    waitForElementToBeRemoved(() => screen.getByText(/Loading/));
    const savebtn = await waitFor(() => screen.findByTestId("save-button"));
    const poInput = await waitFor(() => screen.findByTestId("PONUMBER"));
    fireEvent.change(poInput, { target: { value: 1233 } });

    expect(savebtn).toBeEnabled();
  });

  test("vaidehi invoice date", async () => {
    const component = render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );

    waitForElementToBeRemoved(() => screen.getByText(/Loading/));
    const savebtn = await waitFor(() => screen.findByTestId("save-button"));
   // const dateInput = await waitFor(() => screen.getByText("invoiceDate"));
      
    //fireEvent.click(dateInput);


//await userEvent.click(dateInput);
//await userEvent.type(dateInput, '01/Feb/2000');
//await userEvent.tab();
//await userEvent.tab();
//await userEvent.tab();

    expect(savebtn).toBeDisabled();
  });
  //Vaidehi test

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

  test("save invoice calander and po", async () => {
    render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );
    waitForElementToBeRemoved(() => screen.getByText(/Loading/));
    const savebtn = await waitFor(() => screen.getByText(/save/i));
    fireEvent.click(savebtn);
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
    return;
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
  });
});

describe("add payment button click test cases on Apprroved", () => {
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

    const addPaymentButton = await screen.findByText(/Add Payment/);
    fireEvent.click(addPaymentButton);
  });

  /* test("Save button enabled when change the poNumber", async () => {
 
     render(
       <HashRouter>
         <InvoiceDetails />
       </HashRouter>
     );
 
     waitForElementToBeRemoved(() => screen.getByText(/Loading/));
 
     const setPoNumber =  screen.findByTestId("PONUMBER");
     const saveButton =   screen.findByTestId("SaveButton");
 
     expect(setPoNumber).toBeInTheDocument();
     await waitFor(() =>
       fireEvent.change(setPoNumber, {target: { value: "123" } }));
       expect(saveButton).not.toBeDisabled();
   });*/
});

describe("delete employee on AR Review status api fail", () => {
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

    mock.onPost(urls.deleteEmployeeApi).reply(200, {});
  });

  test("tabs are working", async () => {
    const file = new File(["hello"], "hello.pdf", { type: "application/pdf" });

    const { container } = render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );

    waitForElementToBeRemoved(() => screen.getByText(/Loading/));

    const payrollTab = await waitFor(() => screen.getByText(/Payroll Journal/));
    expect(payrollTab).toBeInTheDocument();

    const deleteIcon = await screen.getAllByTestId("delete-icon");
    expect(deleteIcon[0]).toBeInTheDocument();
    fireEvent.click(deleteIcon[0]);

    const cancleButton = await waitFor(() => screen.getByText(/Cancel/));
    fireEvent.click(cancleButton);

    const deleteIcon1 = await screen.getAllByTestId("delete-icon");
    expect(deleteIcon[0]).toBeInTheDocument();
<<<<<<< HEAD
    fireEvent.click(deleteIcon1[0]);
=======
    fireEvent.click(deleteIcon1[0])

  



>>>>>>> d8dfb42485f71f7517ac771a21e1924e4b38aae4

    const deleteButton = await waitFor(() =>
      screen.getByText(/Delete Employee/)
    );
    fireEvent.click(deleteButton);
  });
});

describe("delete employee on AR Review status", () => {
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

    mock.onPost(urls.deleteEmployeeApi).reply(500, {});
  });

  test("tabs are working", async () => {
    const file = new File(["hello"], "hello.pdf", { type: "application/pdf" });

    const { container } = render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );

    waitForElementToBeRemoved(() => screen.getByText(/Loading/));

    const payrollTab = await waitFor(() => screen.getByText(/Payroll Journal/));
    expect(payrollTab).toBeInTheDocument();

    const deleteIcon = await screen.getAllByTestId("delete-icon");
    expect(deleteIcon[0]).toBeInTheDocument();
    fireEvent.click(deleteIcon[0]);

    const cancleButton = await waitFor(() => screen.getByText(/Cancel/));
    fireEvent.click(cancleButton);

    const deleteIcon1 = await screen.getAllByTestId("delete-icon");
    expect(deleteIcon[0]).toBeInTheDocument();
    fireEvent.click(deleteIcon1[0]);

    const deleteButton = await waitFor(() =>
      screen.getByText(/Delete Employee/)
    );
    fireEvent.click(deleteButton);
  });
});

describe("payment detail on partial paid", () => {
  beforeAll(() => {
    useParams.mockImplementation(() => ({
      id: "0d40412b-f901-4cab-b886-8f30e1bc9a71",
      cid: "E291C9F0-2476-4238-85CB-7AFECDD085E4",
      isClient: "false",
    }));

    useLocation.mockImplementation(() => ({
      state: {
        InvoiceId: "1101078",
        transactionType: 2,
        rowDetails: {
          customerId: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
          customerName: "DSM Nutritional Products AG",
          customerLocation: "Italy",
          currencyId: 1,
          qbInvoiceNo: 0,
          invoiceNo: "1101078",
          status: 6,
          statusLabel: "Partial Paid",
          transactionType: 2,
          transactionTypeLabel: "Miscellaneous",
          createdDate: "5 Jul 2022",
          paymentDate: null,
          approvalDate: null,
          submissionDate: null,
          dueDate: "15 Jul 2022",
          exchangeRate: 1,
          totalAmount: "undefined 300.00",
          invoiceBalance: "undefined 96.00",
          invoiceFrom: null,
          regionItemCode: null,
          isClientVisible: true,
          depositTo: null,
          createdBy: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
          modifiedBy: "504bc42f-b5a7-48ca-b5cc-2210d019287a",
          eorSubscriptionId: null,
          invoicerId: "1794f943-90b2-4d26-b81c-6e01cfa07e80",
          bankingDetailId: null,
          paymentMethod: 1,
          poNumber: null,
          ageingNotPaid: null,
          ageingPaid: null,
          invoiceDocuments: [],
          invoiceItems: [],
          invoiceNotes: [],
          invoiceRelatedInvoices: [],
          invoiceRelatedRelatedInvoices: [],
          payrolls: [],
          customer: null,
          currency: null,
          id: "0d40412b-f901-4cab-b886-8f30e1bc9a71",
          exportToQB: {
            value: "Not Exported",
            color: "#767676",
          },
        },
      },
    }));

    jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));

    const mock = new MockAdapter(axios);

    mockapidata.resData.invoice.status = 6;
    mock.onGet(urls.invoiceDetails + id).reply(200, mockapidata.resData);
    mock.onGet(urls.billsPerInvoice + invoiceId).reply(200, BillsByInvoiceId);
    mock
      .onGet(getBillingAddressUrl(cid))
      .reply(200, mockapidata.resAddressData);

    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);

    mock.onGet(urls.fee).reply(200, mockapidata.resFeeData);

    mock.onGet(urls.lookup).reply(200, mockapidata.resLookupData);

    mock
      .onGet(getNotesUrl("0d40412b-f901-4cab-b886-8f30e1bc9a71"))
      .reply(200, mockapidata.notes);

    mock
      .onPut(getApproveUrlNo("0d40412b-f901-4cab-b886-8f30e1bc9a71", 2))
      .reply(201);

    mock
      .onPut(getApproveUrl("0d40412b-f901-4cab-b886-8f30e1bc9a71"))
      .reply(201);

    mock.onPost(urls.saveNote).reply(200, mockapidata.notesPost);

    mock
      .onGet(getRelatedInvoiceUrl("0d40412b-f901-4cab-b886-8f30e1bc9a71"))
      .reply(200,mockapidata.newGetRelatedData);

    mock.onGet(getVatValue(cid)).reply(200, mockapidata.resForVatDetail);

    mock
      .onGet(getPaymentDetailApi("0d40412b-f901-4cab-b886-8f30e1bc9a71"))
      .reply(200, mockapidata.resForPaymentDetailApi);
    mock
      .onGet(
        urls.invoiceLogs.replace(
          "{invoice-id}",
          "0d40412b-f901-4cab-b886-8f30e1bc9a71"
        )
      )
      .reply(200, mockapidata.resInvoiceNotesData);

    mock
      .onGet(subscriptionLookup())
      .reply(200, mockapidata.resSuscriptionLookup);
    mock.onGet(productInvoice()).reply(200, mockapidata.dd);

    mock.onPost(urls.savePayments).reply(200, mockapidata.dd);

    mock.onPost(editPaymentDetailApi()).reply(200, mockapidata.resForEditPaymentDetailApi);

    mock
      .onGet(getPaymentDetailApi("0d40412b-f901-4cab-b886-8f30e1bc9a71"))
      .reply(200, mockapidata.resForPaymentDetailApi);
  });

  test("tabs are working", async () => {
    const file = new File(["hello"], "hello.pdf", { type: "application/pdf" });

    render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );

    const paymentText = await screen.findByText(/Payment Details/);
    expect(paymentText).toBeInTheDocument();

    const textEdit = await screen.findAllByText(/Edit/);
    expect(textEdit[0]).toBeInTheDocument();
    fireEvent.click(textEdit[0]);

    const textEditCancel = await screen.findAllByText(/Cancel Edit/);
    expect(textEditCancel[0]).toBeInTheDocument();
    fireEvent.click(textEditCancel[0]);

    const textEdit2 = await screen.findAllByText(/Edit/);

    expect(textEdit2[1]).toBeInTheDocument();

    fireEvent.click(textEdit2[1]);

    const textEdiEUR = await screen.findAllByText(/EUR/);
    expect(textEdiEUR[0]).toBeInTheDocument();
    fireEvent.click(textEdiEUR[0]);

    const textEdiUSD = await screen.findAllByText(/USD/);
    expect(textEdiUSD[0]).toBeInTheDocument();
    fireEvent.click(textEdiUSD[0]);

    const textEditSave = await screen.findAllByText(/Save Changes/);
    expect(textEditSave[0]).toBeInTheDocument();
    fireEvent.click(textEditSave[0]);

    const textEdit3 = await screen.findAllByText(/Edit/);

    expect(textEdit3[2]).toBeInTheDocument();
    fireEvent.click(textEdit3[2]);

    const textref = await screen.findAllByTestId(/0149/);
    expect(textref[0]).toBeInTheDocument();
    fireEvent.change(textref[0], { target: { value: "01499" } });

    const textAm = await screen.findAllByTestId(/111/);
    expect(textAm[0]).toBeInTheDocument();
    fireEvent.change(textAm[0], { target: { value: "014" } });

    const textLocation = await screen.findAllByText(
      /USA -- United States of America/
    );
    expect(textLocation[0]).toBeInTheDocument();
    fireEvent.click(textLocation[0]);

    const textLocation2 = await screen.findAllByText(/GBR -- United Kingdom/);
    expect(textLocation2[0]).toBeInTheDocument();
    fireEvent.click(textLocation2[0]);

    const textBank = await screen.findAllByTestId(/deposite-bank/);
    expect(textBank[2]).toBeInTheDocument();
    // fireEvent.click(textBank[2])

    const textEditSave2 = await screen.findAllByText(/Save Changes/);
    expect(textEditSave2[0]).toBeInTheDocument();
    fireEvent.click(textEditSave2[0]);

    const textAddPaymentInstallment = await screen.findAllByText(
      /Add payment Installment/
    );
    expect(textAddPaymentInstallment[0]).toBeInTheDocument();
    fireEvent.click(textAddPaymentInstallment[0]);

    const cancelButton = await screen.findAllByText(/Cancel/);
    expect(cancelButton[0]).toBeInTheDocument();
    fireEvent.click(cancelButton[0]);

    const textAddPaymentInstallment2 = await screen.findAllByText(
      /Add payment Installment/
    );
    expect(textAddPaymentInstallment2[0]).toBeInTheDocument();
    fireEvent.click(textAddPaymentInstallment2[0]);

    const textBankww = await screen.findAllByTestId(/Deposited-id/);
    fireEvent.click(textBankww[0]);

    const locationid = await screen.findAllByTestId(/locationOpen-id/);
    fireEvent.click(locationid[0]);

    const currencyid = await screen.findAllByTestId(/currencyOpen-id/);
    fireEvent.click(currencyid[0]);

    const paymentid = await screen.findAllByTestId(/payment-id/);
    fireEvent.click(paymentid[0]);

    const referenceText = await screen.findAllByPlaceholderText(
      /Enter reference No/
    );
    expect(referenceText[32]).toBeInTheDocument();
    fireEvent.keyDown(referenceText[32]);
    fireEvent.change(referenceText[32], { target: { value: "000987" } });

    const addAmountText = await screen.findAllByTestId(/addAmount/);
    expect(addAmountText[0]).toBeInTheDocument();
    fireEvent.keyDown(addAmountText[0]);
    fireEvent.change(addAmountText[0], { target: { value: "2" } });

  });
});
