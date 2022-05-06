import {
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
  waitFor,
} from "@testing-library/react";
import { HashRouter, Route, Routes, useParams, MemoryRouter } from "react-router-dom";
import InvoiceDetails from "..";
// import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { mockapidata } from "./mockdata";
import axios from "axios";
import { act } from "react-dom/test-utils";
import { apiInvoiceMockData } from "../mockData";
import { BillsByInvoiceId } from "../../BillsTable/mockBills";
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
//         "https://apigw-uat-emea.apnextgen.com/payrollservice/api/Payroll/" + id
//       )
//       .replyOnce(200, mockapidata.resData);
//     mock
//       .onGet(
//         `https://apigw-uat-emea.apnextgen.com/customerservice/api/Customers/${cid}?includes=BillingAddress`
//       )
//       .replyOnce(200, mockapidata.resAddressData);

//     mock
//       .onGet(
//         "https://apigw-uat-emea.apnextgen.com/metadataservice/api/lookup/Countries?includeProperties=Currency&orderBy=Name"
//       )
//       .replyOnce(200, mockapidata.resCountriesData);

//     mock
//       .onGet("https://apigw-uat-emea.apnextgen.com/metadataservice/api/Fees")
//       .replyOnce(200, mockapidata.resFeeData);

//     mock
//       .onGet("https://apigw-uat-emea.apnextgen.com/metadataservice/api/Lookup")
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
  useParams:
    jest.fn(),
  // () => ({
  //   id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
  //   cid: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
  //   isClient: "true",
  // }),
  useRouteMatch: () => ({ url: "/pay/invoicedetailsid/cid" }),
  useLocation: jest.fn().mockReturnValue({ state: { InvoiceId: '1001002' } })
}));

const id = "ab9d400a-0b11-4a21-8505-7646f6caed8d";
const cid = "a9bbee6d-797a-4724-a86a-5b1a2e28763f";
const invoiceId = '1001002'
localStorage.setItem("temptoken", "1234");

describe("Invoice details", () => {
  beforeAll(() => {
    useParams.mockImplementation(() => ({
      id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
      cid: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
      isClient: "true",
    }));
    const mock = new MockAdapter(axios);

    mock
      .onGet(
        "https://apigw-uat-emea.apnextgen.com/payrollservice/api/Payroll/" + id
      )
      .reply(200, mockapidata.resData);
    mock
      .onGet(
        "https://apigw-dev-eu.atlasbyelements.com/billingservice/api/billing/bill/GetBillDetailsPerInvoice/" + invoiceId
      )
      .reply(200, BillsByInvoiceId);
    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/customerservice/api/Customers/${cid}?includes=BillingAddress`
      )
      .reply(200, mockapidata.resAddressData);

    mock
      .onGet(
        "https://apigw-uat-emea.apnextgen.com/metadataservice/api/lookup/Countries?includeProperties=Currency&orderBy=Name"
      )
      .reply(200, mockapidata.resCountriesData);

    mock
      .onGet("https://apigw-uat-emea.apnextgen.com/metadataservice/api/Fees")
      .reply(200, mockapidata.resFeeData);

    mock
      .onGet("https://apigw-uat-emea.apnextgen.com/metadataservice/api/Lookup")
      .reply(200, mockapidata.resLookupData);

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/InvoiceNote/notes/${id}`
      )
      .reply(200, mockapidata.notes);

    mock
      .onPut(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/${id}/4`
      )
      .reply(201);

    mock
      .onPost(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/InvoiceNote/Create`
      )
      .reply(200, mockapidata.notesPost);

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/metadataservice/api/Blob/getBlobUrlWithSASToken?url=https://apnguatemeaservices.blob.core.windows.net/data/12751d17-f8e7-4af7-a90a-233c177229db.pdf`
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/generatePDF/${id}`
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/generateExcel/${id}`
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });
    mock
      .onPost(
        `https://apigw-dev-eu.atlasbyelements.com/atlas-invoiceservice/api/Invoices/declineInvoice`
      )
      .reply(200, mockapidata.declineInvoicePost);
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
    fireEvent.click(filesTab);

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
  });

  test("approve invoice clickable ", async () => {
    render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );

    await waitForElementToBeRemoved(() => screen.getByText(/Loading/));

    const approve = screen.getByText(/Approve Invoice/);
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
    fireEvent.click(filesTab);
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
    fireEvent.click(filesTab);
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
    fireEvent.click(filesTab);
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

  })
  test("Decline invoice click on cancel button", async () => {
    render(
      <HashRouter>
        <InvoiceDetails></InvoiceDetails>
      </HashRouter>
    );

    await waitForElementToBeRemoved(() => screen.getByText(/Loading/));

    const decline = screen.getByTestId("decline-button");
    fireEvent.click(decline);

    const cancelButton = await waitFor(() => screen.getByTestId('decline-cancel-button'));
    expect(cancelButton).toBeInTheDocument();
    fireEvent.click(cancelButton)
  })

  test("Decline invoice onchange textarea and click on decline button", async () => {
    render(
      <HashRouter>
        <InvoiceDetails></InvoiceDetails>
      </HashRouter>
    );

    await waitForElementToBeRemoved(() => screen.getByText(/Loading/));

    const decline = screen.getByTestId("decline-button");
    fireEvent.click(decline);

    const textarea = await waitFor(() => screen.getByPlaceholderText('Please Enter a Reason'));
    expect(textarea).toBeInTheDocument();
    fireEvent.change(textarea, { target: { value: 'test' } })

    const declineSubmit = screen.getByTestId("decline-button-submit");
    fireEvent.click(declineSubmit);
  })
});
describe("Api returns transaction type = 7", () => {
  beforeAll(() => {
    useParams.mockImplementation(() => ({
      id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
      cid: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
      isClient: "true",
    }));
    const mock = new MockAdapter(axios);

    mock
      .onGet(
        "https://apigw-dev-eu.atlasbyelements.com/billingservice/api/billing/bill/GetBillDetailsPerInvoice/" + invoiceId
      )
      .reply(200, BillsByInvoiceId);
    mock
      .onGet(
        "https://apigw-uat-emea.apnextgen.com/payrollservice/api/Payroll/" + id
      )
      .reply(200, apiInvoiceMockData);
    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/customerservice/api/Customers/${cid}?includes=BillingAddress`
      )
      .reply(200, mockapidata.resAddressData);

    mock
      .onGet(
        "https://apigw-uat-emea.apnextgen.com/metadataservice/api/lookup/Countries?includeProperties=Currency&orderBy=Name"
      )
      .reply(200, mockapidata.resCountriesData);

    mock
      .onGet("https://apigw-uat-emea.apnextgen.com/metadataservice/api/Fees")
      .reply(200, mockapidata.resFeeData);

    mock
      .onGet("https://apigw-uat-emea.apnextgen.com/metadataservice/api/Lookup")
      .reply(200, mockapidata.resLookupData);

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/InvoiceNote/notes/${id}`
      )
      .reply(200, mockapidata.notes);

    mock
      .onPut(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/${id}/4`
      )
      .reply(201);

    mock
      .onPost(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/InvoiceNote/Create`
      )
      .reply(200, mockapidata.notesPost);

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/metadataservice/api/Blob/getBlobUrlWithSASToken?url=https://apnguatemeaservices.blob.core.windows.net/data/12751d17-f8e7-4af7-a90a-233c177229db.pdf`
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/generatePDF/${id}`
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/generateExcel/${id}`
      )
      .reply(200, {
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
  })
})
describe("Invoice details decline api fail case handling", () => {
  beforeAll(() => {
    useParams.mockImplementation(() => ({
      id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
      cid: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
      isClient: "true",
    }));
    const mock = new MockAdapter(axios);

    mock
      .onGet(
        "https://apigw-uat-emea.apnextgen.com/payrollservice/api/Payroll/" + id
      )
      .reply(200, mockapidata.resData);
    mock
      .onGet(
        "https://apigw-dev-eu.atlasbyelements.com/billingservice/api/billing/bill/GetBillDetailsPerInvoice/" + invoiceId
      )
      .reply(200, BillsByInvoiceId);
    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/customerservice/api/Customers/${cid}?includes=BillingAddress`
      )
      .reply(200, mockapidata.resAddressData);

    mock
      .onGet(
        "https://apigw-uat-emea.apnextgen.com/metadataservice/api/lookup/Countries?includeProperties=Currency&orderBy=Name"
      )
      .reply(200, mockapidata.resCountriesData);

    mock
      .onGet("https://apigw-uat-emea.apnextgen.com/metadataservice/api/Fees")
      .reply(200, mockapidata.resFeeData);

    mock
      .onGet("https://apigw-uat-emea.apnextgen.com/metadataservice/api/Lookup")
      .reply(200, mockapidata.resLookupData);

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/InvoiceNote/notes/${id}`
      )
      .reply(200, mockapidata.notes);

    mock
      .onPut(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/${id}/4`
      )
      .reply(201);

    mock
      .onPost(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/InvoiceNote/Create`
      )
      .reply(200, mockapidata.notesPost);

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/metadataservice/api/Blob/getBlobUrlWithSASToken?url=https://apnguatemeaservices.blob.core.windows.net/data/12751d17-f8e7-4af7-a90a-233c177229db.pdf`
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/generatePDF/${id}`
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/generateExcel/${id}`
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });
    mock
      .onPost(
        `https://apigw-dev-eu.atlasbyelements.com/atlas-invoiceservice/api/Invoices/declineInvoice`
      )
      .reply(400, mockapidata.declineInvoicePost);
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

    const textarea = await waitFor(() => screen.getByPlaceholderText('Please Enter a Reason'));
    expect(textarea).toBeInTheDocument();
    fireEvent.change(textarea, { target: { value: 'test' } })

    const declineSubmit = screen.getByTestId("decline-button-submit");
    fireEvent.click(declineSubmit);
  })
});
describe("void test cases on Apprroved", () => {
  beforeAll(() => {
    useParams.mockImplementation(() => ({
      id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
      cid: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
      isClient: "false",
    }));
    const mock = new MockAdapter(axios);

    mockapidata.resData.invoice.status = 4;
    mock
      .onGet(
        "https://apigw-uat-emea.apnextgen.com/payrollservice/api/Payroll/" + id
      )
      .reply(200, mockapidata.resData);
    mock
      .onGet(
        "https://apigw-dev-eu.atlasbyelements.com/billingservice/api/billing/bill/GetBillDetailsPerInvoice/" + invoiceId
      )
      .reply(200, BillsByInvoiceId);
    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/customerservice/api/Customers/${cid}?includes=BillingAddress`
      )
      .reply(200, mockapidata.resAddressData);

    mock
      .onGet(
        "https://apigw-uat-emea.apnextgen.com/metadataservice/api/lookup/Countries?includeProperties=Currency&orderBy=Name"
      )
      .reply(200, mockapidata.resCountriesData);

    mock
      .onGet("https://apigw-uat-emea.apnextgen.com/metadataservice/api/Fees")
      .reply(200, mockapidata.resFeeData);

    mock
      .onGet("https://apigw-uat-emea.apnextgen.com/metadataservice/api/Lookup")
      .reply(200, mockapidata.resLookupData);

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/InvoiceNote/notes/${id}`
      )
      .reply(200, mockapidata.notes);

    mock
      .onPut(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/${id}/4`
      )
      .reply(201);

    mock
      .onPost(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/InvoiceNote/Create`
      )
      .reply(200, mockapidata.notesPost);

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/metadataservice/api/Blob/getBlobUrlWithSASToken?url=https://apnguatemeaservices.blob.core.windows.net/data/12751d17-f8e7-4af7-a90a-233c177229db.pdf`
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/generatePDF/${id}`
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/generateExcel/${id}`
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });
    mock
      .onPost(
        `https://apigw-dev-eu.atlasbyelements.com/atlas-invoiceservice/api/Invoices/declineInvoice`
      )
      .reply(200, mockapidata.declineInvoicePost);

    mock
      .onPost(
        `https://apigw-dev-eu.atlasbyelements.com/atlas-invoiceservice/api/Invoices/voidInvoice`
      )
      .reply(200, mockapidata.voidApiPost);

    mock
      .onPost(
        `https://apigw-uat-emea.apnextgen.com/metadataservice/api/Blob/UploadFile`
      )
      .reply(200, mockapidata.uploadFile);

    mock
      .onPost(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/InvoiceDocument/Create`
      )
      .reply(200, mockapidata.createDocument);

  });

  test("tabs are working", async () => {
    const file = new File(['hello'], 'hello.pdf', { type: 'application/pdf' });

    render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );

    waitForElementToBeRemoved(() => screen.getByText(/Loading/));

    const buttonVoidInvoice = await screen.findByText(/Void Invoice/);
    fireEvent.click(buttonVoidInvoice);

    expect(buttonVoidInvoice).toBeInTheDocument();
    const placeHolderText = await screen.findByPlaceholderText(/Enter note here/);
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
    fireEvent.click(voidButtonId)


    const confirmText = await screen.findAllByText(/Are you sure you want to void this invoice?/);
    expect(confirmText[0]).toBeInTheDocument();

    const voidConfirm = await screen.findByTestId("Void-button-submit");
    expect(voidConfirm).toBeInTheDocument();
    fireEvent.click(voidConfirm)

  });
});
describe("void test cases on Apprroved Upload Api Failed", () => {
  beforeAll(() => {

    useParams.mockImplementation(() => ({
      id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
      cid: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
      isClient: "false",
    }));
    const mock = new MockAdapter(axios);

    mockapidata.resData.invoice.status = 4;
    mock
      .onGet(
        "https://apigw-uat-emea.apnextgen.com/payrollservice/api/Payroll/" + id
      )
      .reply(200, mockapidata.resData);
    mock
      .onGet(
        "https://apigw-dev-eu.atlasbyelements.com/billingservice/api/billing/bill/GetBillDetailsPerInvoice/" + invoiceId
      )
      .reply(200, BillsByInvoiceId);
    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/customerservice/api/Customers/${cid}?includes=BillingAddress`
      )
      .reply(200, mockapidata.resAddressData);

    mock
      .onGet(
        "https://apigw-uat-emea.apnextgen.com/metadataservice/api/lookup/Countries?includeProperties=Currency&orderBy=Name"
      )
      .reply(200, mockapidata.resCountriesData);

    mock
      .onGet("https://apigw-uat-emea.apnextgen.com/metadataservice/api/Fees")
      .reply(200, mockapidata.resFeeData);

    mock
      .onGet("https://apigw-uat-emea.apnextgen.com/metadataservice/api/Lookup")
      .reply(200, mockapidata.resLookupData);

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/InvoiceNote/notes/${id}`
      )
      .reply(200, mockapidata.notes);

    mock
      .onPut(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/${id}/4`
      )
      .reply(201);

    mock
      .onPost(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/InvoiceNote/Create`
      )
      .reply(200, mockapidata.notesPost);

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/metadataservice/api/Blob/getBlobUrlWithSASToken?url=https://apnguatemeaservices.blob.core.windows.net/data/12751d17-f8e7-4af7-a90a-233c177229db.pdf`
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/generatePDF/${id}`
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/generateExcel/${id}`
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });
    mock
      .onPost(
        `https://apigw-dev-eu.atlasbyelements.com/atlas-invoiceservice/api/Invoices/declineInvoice`
      )
      .reply(200, mockapidata.declineInvoicePost);

    mock
      .onPost(
        `https://apigw-dev-eu.atlasbyelements.com/atlas-invoiceservice/api/Invoices/voidInvoice`
      )
      .reply(200, mockapidata.voidApiPost);

    mock
      .onPost(
        `https://apigw-uat-emea.apnextgen.com/metadataservice/api/Blob/UploadFile`
      )
      .reply(400, mockapidata.uploadFile);

    mock
      .onPost(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/InvoiceDocument/Create`
      )
      .reply(200, mockapidata.createDocument);

  });

  test("tabs are working", async () => {
    const file = new File(['hello'], 'hello.pdf', { type: 'application/pdf' });

    render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );

    waitForElementToBeRemoved(() => screen.getByText(/Loading/));

    const buttonVoidInvoice = await screen.findByText(/Void Invoice/);
    fireEvent.click(buttonVoidInvoice);

    expect(buttonVoidInvoice).toBeInTheDocument();
    const placeHolderText = await screen.findByPlaceholderText(/Enter note here/);
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
    fireEvent.click(voidButtonId)


    const confirmText = await screen.findAllByText(/Are you sure you want to void this invoice?/);
    expect(confirmText[0]).toBeInTheDocument();

    const voidConfirm = await screen.findByTestId("Void-button-submit");
    expect(voidConfirm).toBeInTheDocument();
    fireEvent.click(voidConfirm)

  });

});
describe("void test cases on Apprroved Create Api Failed", () => {
  beforeAll(() => {

    useParams.mockImplementation(() => ({
      id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
      cid: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
      isClient: "false",
    }));
    const mock = new MockAdapter(axios);

    mockapidata.resData.invoice.status = 4;
    mock
      .onGet(
        "https://apigw-uat-emea.apnextgen.com/payrollservice/api/Payroll/" + id
      )
      .reply(200, mockapidata.resData);
    mock
      .onGet(
        "https://apigw-dev-eu.atlasbyelements.com/billingservice/api/billing/bill/GetBillDetailsPerInvoice/" + invoiceId
      )
      .reply(200, BillsByInvoiceId);
    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/customerservice/api/Customers/${cid}?includes=BillingAddress`
      )
      .reply(200, mockapidata.resAddressData);

    mock
      .onGet(
        "https://apigw-uat-emea.apnextgen.com/metadataservice/api/lookup/Countries?includeProperties=Currency&orderBy=Name"
      )
      .reply(200, mockapidata.resCountriesData);

    mock
      .onGet("https://apigw-uat-emea.apnextgen.com/metadataservice/api/Fees")
      .reply(200, mockapidata.resFeeData);

    mock
      .onGet("https://apigw-uat-emea.apnextgen.com/metadataservice/api/Lookup")
      .reply(200, mockapidata.resLookupData);

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/InvoiceNote/notes/${id}`
      )
      .reply(200, mockapidata.notes);

    mock
      .onPut(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/${id}/4`
      )
      .reply(201);

    mock
      .onPost(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/InvoiceNote/Create`
      )
      .reply(200, mockapidata.notesPost);

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/metadataservice/api/Blob/getBlobUrlWithSASToken?url=https://apnguatemeaservices.blob.core.windows.net/data/12751d17-f8e7-4af7-a90a-233c177229db.pdf`
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/generatePDF/${id}`
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/generateExcel/${id}`
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });
    mock
      .onPost(
        `https://apigw-dev-eu.atlasbyelements.com/atlas-invoiceservice/api/Invoices/declineInvoice`
      )
      .reply(200, mockapidata.declineInvoicePost);

    mock
      .onPost(
        `https://apigw-dev-eu.atlasbyelements.com/atlas-invoiceservice/api/Invoices/voidInvoice`
      )
      .reply(200, mockapidata.voidApiPost);

    mock
      .onPost(
        `https://apigw-uat-emea.apnextgen.com/metadataservice/api/Blob/UploadFile`
      )
      .reply(200, mockapidata.uploadFile);

    mock
      .onPost(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/InvoiceDocument/Create`
      )
      .reply(400, mockapidata.createDocument);

  });

  test("tabs are working", async () => {
    const file = new File(['hello'], 'hello.pdf', { type: 'application/pdf' });

    render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );

    waitForElementToBeRemoved(() => screen.getByText(/Loading/));

    const buttonVoidInvoice = await screen.findByText(/Void Invoice/);
    fireEvent.click(buttonVoidInvoice);

    expect(buttonVoidInvoice).toBeInTheDocument();
    const placeHolderText = await screen.findByPlaceholderText(/Enter note here/);
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
    fireEvent.click(voidButtonId)


    const confirmText = await screen.findAllByText(/Are you sure you want to void this invoice?/);
    expect(confirmText[0]).toBeInTheDocument();

    const voidConfirm = await screen.findByTestId("Void-button-submit");
    expect(voidConfirm).toBeInTheDocument();
    fireEvent.click(voidConfirm)

  });

});
describe("void test cases on Apprroved Void Api Failed", () => {
  beforeAll(() => {

    useParams.mockImplementation(() => ({
      id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
      cid: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
      isClient: "false",
    }));
    const mock = new MockAdapter(axios);

    mockapidata.resData.invoice.status = 4;
    mock
      .onGet(
        "https://apigw-uat-emea.apnextgen.com/payrollservice/api/Payroll/" + id
      )
      .reply(200, mockapidata.resData);
    mock
      .onGet(
        "https://apigw-dev-eu.atlasbyelements.com/billingservice/api/billing/bill/GetBillDetailsPerInvoice/" + invoiceId
      )
      .reply(200, BillsByInvoiceId);
    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/customerservice/api/Customers/${cid}?includes=BillingAddress`
      )
      .reply(200, mockapidata.resAddressData);

    mock
      .onGet(
        "https://apigw-uat-emea.apnextgen.com/metadataservice/api/lookup/Countries?includeProperties=Currency&orderBy=Name"
      )
      .reply(200, mockapidata.resCountriesData);

    mock
      .onGet("https://apigw-uat-emea.apnextgen.com/metadataservice/api/Fees")
      .reply(200, mockapidata.resFeeData);

    mock
      .onGet("https://apigw-uat-emea.apnextgen.com/metadataservice/api/Lookup")
      .reply(200, mockapidata.resLookupData);

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/InvoiceNote/notes/${id}`
      )
      .reply(200, mockapidata.notes);

    mock
      .onPut(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/${id}/4`
      )
      .reply(201);

    mock
      .onPost(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/InvoiceNote/Create`
      )
      .reply(200, mockapidata.notesPost);

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/metadataservice/api/Blob/getBlobUrlWithSASToken?url=https://apnguatemeaservices.blob.core.windows.net/data/12751d17-f8e7-4af7-a90a-233c177229db.pdf`
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/generatePDF/${id}`
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/generateExcel/${id}`
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });
    mock
      .onPost(
        `https://apigw-dev-eu.atlasbyelements.com/atlas-invoiceservice/api/Invoices/declineInvoice`
      )
      .reply(200, mockapidata.declineInvoicePost);

    mock
      .onPost(
        `https://apigw-dev-eu.atlasbyelements.com/atlas-invoiceservice/api/Invoices/voidInvoice`
      )
      .reply(400, mockapidata.voidApiPost);

    mock
      .onPost(
        `https://apigw-uat-emea.apnextgen.com/metadataservice/api/Blob/UploadFile`
      )
      .reply(200, mockapidata.uploadFile);

    mock
      .onPost(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/InvoiceDocument/Create`
      )
      .reply(200, mockapidata.createDocument);

  });

  test("tabs are working", async () => {
    const file = new File(['hello'], 'hello.pdf', { type: 'application/pdf' });

    render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );

    waitForElementToBeRemoved(() => screen.getByText(/Loading/));

    const buttonVoidInvoice = await screen.findByText(/Void Invoice/);
    fireEvent.click(buttonVoidInvoice);

    expect(buttonVoidInvoice).toBeInTheDocument();
    const placeHolderText = await screen.findByPlaceholderText(/Enter note here/);
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
    fireEvent.click(voidButtonId)


    const confirmText = await screen.findAllByText(/Are you sure you want to void this invoice?/);
    expect(confirmText[0]).toBeInTheDocument();

    const voidConfirm = await screen.findByTestId("Void-button-submit");
    expect(voidConfirm).toBeInTheDocument();
    fireEvent.click(voidConfirm)

  });

});
describe("void test cases on Apprroved and click on cancel", () => {
  beforeAll(() => {

    useParams.mockImplementation(() => ({
      id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
      cid: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
      isClient: "false",
    }));
    const mock = new MockAdapter(axios);

    mockapidata.resData.invoice.status = 4;
    mock
      .onGet(
        "https://apigw-uat-emea.apnextgen.com/payrollservice/api/Payroll/" + id
      )
      .reply(200, mockapidata.resData);
    mock
      .onGet(
        "https://apigw-dev-eu.atlasbyelements.com/billingservice/api/billing/bill/GetBillDetailsPerInvoice/" + invoiceId
      )
      .reply(200, BillsByInvoiceId);
    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/customerservice/api/Customers/${cid}?includes=BillingAddress`
      )
      .reply(200, mockapidata.resAddressData);

    mock
      .onGet(
        "https://apigw-uat-emea.apnextgen.com/metadataservice/api/lookup/Countries?includeProperties=Currency&orderBy=Name"
      )
      .reply(200, mockapidata.resCountriesData);

    mock
      .onGet("https://apigw-uat-emea.apnextgen.com/metadataservice/api/Fees")
      .reply(200, mockapidata.resFeeData);

    mock
      .onGet("https://apigw-uat-emea.apnextgen.com/metadataservice/api/Lookup")
      .reply(200, mockapidata.resLookupData);

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/InvoiceNote/notes/${id}`
      )
      .reply(200, mockapidata.notes);

    mock
      .onPut(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/${id}/4`
      )
      .reply(201);

    mock
      .onPost(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/InvoiceNote/Create`
      )
      .reply(200, mockapidata.notesPost);

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/metadataservice/api/Blob/getBlobUrlWithSASToken?url=https://apnguatemeaservices.blob.core.windows.net/data/12751d17-f8e7-4af7-a90a-233c177229db.pdf`
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/generatePDF/${id}`
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/generateExcel/${id}`
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });
    mock
      .onPost(
        `https://apigw-dev-eu.atlasbyelements.com/atlas-invoiceservice/api/Invoices/declineInvoice`
      )
      .reply(200, mockapidata.declineInvoicePost);

    mock
      .onPost(
        `https://apigw-dev-eu.atlasbyelements.com/atlas-invoiceservice/api/Invoices/voidInvoice`
      )
      .reply(200, mockapidata.voidApiPost);

    mock
      .onPost(
        `https://apigw-uat-emea.apnextgen.com/metadataservice/api/Blob/UploadFile`
      )
      .reply(200, mockapidata.uploadFile);

    mock
      .onPost(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/InvoiceDocument/Create`
      )
      .reply(200, mockapidata.createDocument);

  });

  test("tabs are working", async () => {
    const file = new File(['hello'], 'hello.pdf', { type: 'application/pdf' });

    render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );

    waitForElementToBeRemoved(() => screen.getByText(/Loading/));

    const buttonVoidInvoice = await screen.findByText(/Void Invoice/);
    fireEvent.click(buttonVoidInvoice);

    expect(buttonVoidInvoice).toBeInTheDocument();
    const placeHolderText = await screen.findByPlaceholderText(/Enter note here/);
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
    fireEvent.click(voidButtonId)


    const confirmText = await screen.findAllByText(/Are you sure you want to void this invoice?/);
    expect(confirmText[0]).toBeInTheDocument();

    const cancelId = await screen.findByTestId("Void-button-Cancel");
    expect(cancelId).toBeInTheDocument();
    fireEvent.click(cancelId)

  });

});
describe("void test cases for Checkobox", () => {
  beforeAll(() => {

    useParams.mockImplementation(() => ({
      id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
      cid: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
      isClient: "false",
    }));
    const mock = new MockAdapter(axios);

    mockapidata.resData.invoice.status = 4;
    mock
      .onGet(
        "https://apigw-uat-emea.apnextgen.com/payrollservice/api/Payroll/" + id
      )
      .reply(200, mockapidata.resData);
    mock
      .onGet(
        "https://apigw-dev-eu.atlasbyelements.com/billingservice/api/billing/bill/GetBillDetailsPerInvoice/" + invoiceId
      )
      .reply(200, BillsByInvoiceId);
    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/customerservice/api/Customers/${cid}?includes=BillingAddress`
      )
      .reply(200, mockapidata.resAddressData);

    mock
      .onGet(
        "https://apigw-uat-emea.apnextgen.com/metadataservice/api/lookup/Countries?includeProperties=Currency&orderBy=Name"
      )
      .reply(200, mockapidata.resCountriesData);

    mock
      .onGet("https://apigw-uat-emea.apnextgen.com/metadataservice/api/Fees")
      .reply(200, mockapidata.resFeeData);

    mock
      .onGet("https://apigw-uat-emea.apnextgen.com/metadataservice/api/Lookup")
      .reply(200, mockapidata.resLookupData);

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/InvoiceNote/notes/${id}`
      )
      .reply(200, mockapidata.notes);

    mock
      .onPut(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/${id}/4`
      )
      .reply(201);

    mock
      .onPost(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/InvoiceNote/Create`
      )
      .reply(200, mockapidata.notesPost);

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/metadataservice/api/Blob/getBlobUrlWithSASToken?url=https://apnguatemeaservices.blob.core.windows.net/data/12751d17-f8e7-4af7-a90a-233c177229db.pdf`
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/generatePDF/${id}`
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/generateExcel/${id}`
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });
    mock
      .onPost(
        `https://apigw-dev-eu.atlasbyelements.com/atlas-invoiceservice/api/Invoices/declineInvoice`
      )
      .reply(200, mockapidata.declineInvoicePost);

    mock
      .onPost(
        `https://apigw-dev-eu.atlasbyelements.com/atlas-invoiceservice/api/Invoices/voidInvoice`
      )
      .reply(200, mockapidata.voidApiPost);

    mock
      .onPost(
        `https://apigw-uat-emea.apnextgen.com/metadataservice/api/Blob/UploadFile`
      )
      .reply(200, mockapidata.uploadFile);

    mock
      .onPost(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/InvoiceDocument/Create`
      )
      .reply(200, mockapidata.createDocument);

  });

  test("tabs are working", async () => {

    render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );

    waitForElementToBeRemoved(() => screen.getByText(/Loading/));

    const filesTab = await waitFor(() => screen.getByText(/Files & Notes/));
    fireEvent.click(filesTab);


    const customerCheckbox = await screen.findByText(/Visible to Customer/);
    fireEvent.click(customerCheckbox);

    const checkBox2 = await screen.findByText(/Export to Quickbooks/);
    fireEvent.click(checkBox2);

  });

});

describe("api fail", () => {
  beforeAll(() => {
    useParams.mockImplementation(() => ({
      id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
      cid: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
      isClient: "false",
    }));
    const mock = new MockAdapter(axios);

    mockapidata.resData.invoice.status = 4;
    mock
      .onGet(
        "https://apigw-uat-emea.apnextgen.com/payrollservice/api/Payroll/" + id
      )
      .reply(500, mockapidata.resAddressDataFailedApi);
    mock
      .onGet(
        "https://apigw-dev-eu.atlasbyelements.com/billingservice/api/billing/bill/GetBillDetailsPerInvoice/" + invoiceId
      )
      .reply(200, BillsByInvoiceId);
    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/customerservice/api/Customers/${cid}?includes=BillingAddress`
      )
      .reply(404, mockapidata.resAddressDataFailedApi);

    mock
      .onGet(
        "https://apigw-uat-emea.apnextgen.com/metadataservice/api/lookup/Countries?includeProperties=Currency&orderBy=Name"
      )
      .reply(200, mockapidata.resCountriesData);

    mock
      .onGet("https://apigw-uat-emea.apnextgen.com/metadataservice/api/Fees")
      .reply(200, mockapidata.resFeeData);

    mock
      .onGet("https://apigw-uat-emea.apnextgen.com/metadataservice/api/Lookup")
      .reply(200, mockapidata.resLookupData);

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/InvoiceNote/notes/${id}`
      )
      .reply(200, mockapidata.notes);

    mock
      .onPut(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/${id}/4`
      )
      .reply(201);

    mock
      .onPost(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/InvoiceNote/Create`
      )
      .reply(200, mockapidata.notesPost);

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/metadataservice/api/Blob/getBlobUrlWithSASToken?url=https://apnguatemeaservices.blob.core.windows.net/data/12751d17-f8e7-4af7-a90a-233c177229db.pdf`
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/generatePDF/${id}`
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/invoices/generateExcel/${id}`
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });
    mock
      .onPost(
        `https://apigw-dev-eu.atlasbyelements.com/atlas-invoiceservice/api/Invoices/declineInvoice`
      )
      .reply(200, mockapidata.declineInvoicePost);

    mock
      .onPost(
        `https://apigw-dev-eu.atlasbyelements.com/atlas-invoiceservice/api/Invoices/voidInvoice`
      )
      .reply(200, mockapidata.voidApiPost);

    mock
      .onPost(
        `https://apigw-uat-emea.apnextgen.com/metadataservice/api/Blob/UploadFile`
      )
      .reply(200, mockapidata.uploadFile);

    mock
      .onPost(
        `https://apigw-uat-emea.apnextgen.com/invoiceservice/api/InvoiceDocument/Create`
      )
      .reply(200, mockapidata.createDocument);

  });

  test("tabs are working", async () => {
    const file = new File(['hello'], 'hello.pdf', { type: 'application/pdf' });

    render(
      <HashRouter>
        <InvoiceDetails />
      </HashRouter>
    );

    waitForElementToBeRemoved(() => screen.getByText(/Loading/));

    const attachmenttestId = await screen.findAllByText(/Something went wrong!/);
    expect(attachmenttestId[0]).toBeInTheDocument();

  });
});