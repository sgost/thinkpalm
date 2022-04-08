import {
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
  waitFor,
} from "@testing-library/react";
import { HashRouter, Route, Routes } from "react-router-dom";
import InvoiceDetails from "..";
// import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { mockapidata } from "./mockdata";
import axios from "axios";
import { act } from "react-dom/test-utils";

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
  useParams: () => ({
    id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
    cid: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
    isClient: "true",
  }),
  useRouteMatch: () => ({ url: "/pay/invoicedetailsid/cid" }),
}));

const id = "ab9d400a-0b11-4a21-8505-7646f6caed8d";
const cid = "a9bbee6d-797a-4724-a86a-5b1a2e28763f";
localStorage.setItem("temptoken", "1234");

describe("Invoice details", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock
      .onGet(
        "https://apigw-uat-emea.apnextgen.com/payrollservice/api/Payroll/" + id
      )
      .reply(200, mockapidata.resData);
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
      screen.getByPlaceholderText(/Add a Note.../)
    );
    fireEvent.change(input, { target: { value: "Pending" } });
    const publish = screen.getByText(/Publish Note/);
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
});
