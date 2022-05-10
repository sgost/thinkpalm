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
} from "react-router-dom";
import InvoiceDetails from "..";
// import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { mockapidata } from "./mockdata";
import axios from "axios";
import { act } from "react-dom/test-utils";
import { apiInvoiceMockData } from "../mockData";
import { BillsByInvoiceId } from "../../BillsTable/mockBills";
import { getApproveUrl, getBillingAddressUrl, getDeleteInvoiceUrl, getDownloadFileUrl, getDownloadUrl, getExcelUrl, getNotesUrl, urls } from "../../../../urls/urls";
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
  useLocation: jest.fn().mockReturnValue({ state: { InvoiceId: "1001002" } }),
}));

const id = "ab9d400a-0b11-4a21-8505-7646f6caed8d";
const cid = "a9bbee6d-797a-4724-a86a-5b1a2e28763f";
const invoiceId = "1001002";
const invoiceid2 = "ab9d400a-0b11-4a21-8505-7646f6caed8d";
const blobUrl= "https://apnguatemeaservices.blob.core.windows.net/data/12751d17-f8e7-4af7-a90a-233c177229db.pdf";
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
        urls.invoiceDetails +
          id
      )
      .reply(200, mockapidata.resData);
    mock
      .onGet(
        urls.billsPerInvoice +
          invoiceId
      )
      .reply(200, BillsByInvoiceId);
    mock
      .onGet(
        getBillingAddressUrl(cid)
      )
      .reply(200, mockapidata.resAddressData);

    mock
      .onGet(
        urls.countries
      )
      .reply(200, mockapidata.resCountriesData);

    mock
      .onGet(urls.fee)
      .reply(200, mockapidata.resFeeData);

    mock
      .onGet(urls.lookup)
      .reply(200, mockapidata.resLookupData);

    mock
      .onGet(
        getNotesUrl(id)
      )
      .reply(200, mockapidata.notes);

    mock
      .onPut(
        getApproveUrl(id)
      )
      .reply(201);

    mock
      .onPost(
        urls.saveNote
      )
      .reply(200, mockapidata.notesPost);

    mock
      .onGet(
        getDownloadFileUrl(blobUrl)
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        getDownloadUrl(id)
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        getExcelUrl(id)
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });
    mock
      .onPost(
        urls.declineInvoice
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
      cid: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
      isClient: "true",
    }));
    const mock = new MockAdapter(axios);

    mock
      .onGet(
        urls.billsPerInvoice +
          invoiceId
      )
      .reply(200, BillsByInvoiceId);
    mock
      .onGet(
          urls.invoiceDetails +
          id
      )
      .reply(200, apiInvoiceMockData);
    mock
      .onGet(
        getBillingAddressUrl(cid)
      )
      .reply(200, mockapidata.resAddressData);

    mock
      .onGet(
        urls.countries
      )
      .reply(200, mockapidata.resCountriesData);

    mock
      .onGet(urls.fee)
      .reply(200, mockapidata.resFeeData);

    mock
      .onGet(urls.lookup)
      .reply(200, mockapidata.resLookupData);

    mock
      .onGet(
        getNotesUrl(id)
      )
      .reply(200, mockapidata.notes);

    mock
      .onPut(
        getApproveUrl(id)
      )
      .reply(201);

    mock
      .onPost(
        urls.saveNote
      )
      .reply(200, mockapidata.notesPost);

    mock
      .onGet(
        getDownloadFileUrl(blobUrl)
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        getDownloadUrl(id)
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        getExcelUrl(id)
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
  });
});
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
        // urls.invoiceDetails +
        urls.invoiceDetails +
          id
      )
      .reply(200, mockapidata.resData);
    mock
      .onGet(
        urls.billsPerInvoice +
          invoiceId
      )
      .reply(200, BillsByInvoiceId);
    mock
      .onGet(
        getBillingAddressUrl(cid)
      )
      .reply(200, mockapidata.resAddressData);

    mock
      .onGet(
        urls.countries
      )
      .reply(200, mockapidata.resCountriesData);

    mock
      .onGet(urls.fee)
      .reply(200, mockapidata.resFeeData);

    mock
      .onGet(urls.lookup)
      .reply(200, mockapidata.resLookupData);

    mock
      .onGet(
        getNotesUrl(id)
      )
      .reply(200, mockapidata.notes);

    mock
      .onPut(
        getApproveUrl(id)
      )
      .reply(201);

    mock
      .onPost(
        urls.saveNote
      )
      .reply(200, mockapidata.notesPost);

    mock
      .onGet(
        getDownloadFileUrl(blobUrl)
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        getDownloadUrl(id)
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        getExcelUrl(id)
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });
    mock
      .onPost(
        urls.declineInvoice
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
      cid: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
      isClient: "false",
    }));
    const mock = new MockAdapter(axios);

    mockapidata.resData.invoice.status = 4;
    mock
      .onGet(
        urls.invoiceDetails +
          id
      )
      .reply(200, mockapidata.resData);
    mock
      .onGet(
        urls.billsPerInvoice +
          invoiceId
      )
      .reply(200, BillsByInvoiceId);
    mock
      .onGet(
        getBillingAddressUrl(cid)
      )
      .reply(200, mockapidata.resAddressData);

    mock
      .onGet(
        urls.countries
      )
      .reply(200, mockapidata.resCountriesData);

    mock
      .onGet(urls.fee)
      .reply(200, mockapidata.resFeeData);

    mock
      .onGet(urls.lookup)
      .reply(200, mockapidata.resLookupData);

    mock
      .onGet(
        getNotesUrl(id)
      )
      .reply(200, mockapidata.notes);

    mock
      .onPut(
        getApproveUrl(id)
      )
      .reply(201);

    mock
      .onPost(
        urls.saveNote
      )
      .reply(200, mockapidata.notesPost);

    mock
      .onGet(
        getDownloadFileUrl(blobUrl)
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        getDownloadUrl(id)
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        getExcelUrl(id)
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });
    mock
      .onPost(
        urls.declineInvoice
      )
      .reply(200, mockapidata.declineInvoicePost);

    mock
      .onPost(
        urls.voidInvoice
      )
      .reply(200, mockapidata.voidApiPost);

    mock
      .onPost(
        urls.uploadFile
      )
      .reply(200, mockapidata.uploadFile);

    mock
      .onPost(
        urls.createDocument
      )
      .reply(200, mockapidata.createDocument);
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
      cid: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
      isClient: "false",
    }));
    const mock = new MockAdapter(axios);

    mockapidata.resData.invoice.status = 4;
    mock
      .onGet(
        urls.invoiceDetails +
          id
      )
      .reply(200, mockapidata.resData);
    mock
      .onGet(
        urls.billsPerInvoice +
          invoiceId
      )
      .reply(200, BillsByInvoiceId);
    mock
      .onGet(
        getBillingAddressUrl(cid)
      )
      .reply(200, mockapidata.resAddressData);

    mock
      .onGet(
        urls.countries
      )
      .reply(200, mockapidata.resCountriesData);

    mock
      .onGet(urls.fee)
      .reply(200, mockapidata.resFeeData);

    mock
      .onGet(urls.lookup)
      .reply(200, mockapidata.resLookupData);

    mock
      .onGet(
        getNotesUrl(id)
      )
      .reply(200, mockapidata.notes);

    mock
      .onPut(
        getApproveUrl(id)
      )
      .reply(201);

    mock
      .onPost(
        urls.saveNote
      )
      .reply(200, mockapidata.notesPost);

    mock
      .onGet(
        getDownloadFileUrl(blobUrl)
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        getDownloadUrl(id)
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        getExcelUrl(id)
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });
    mock
      .onPost(
        urls.declineInvoice
      )
      .reply(200, mockapidata.declineInvoicePost);

    mock
      .onPost(
        urls.voidInvoice
      )
      .reply(200, mockapidata.voidApiPost);

    mock
      .onPost(
        urls.uploadFile
      )
      .reply(400, mockapidata.uploadFile);

    mock
      .onPost(
        urls.createDocument
      )
      .reply(200, mockapidata.createDocument);
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
      cid: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
      isClient: "false",
    }));
    const mock = new MockAdapter(axios);

    mockapidata.resData.invoice.status = 4;
    mock
      .onGet(
        urls.invoiceDetails +
          id
      )
      .reply(200, mockapidata.resData);
    mock
      .onGet(
        urls.billsPerInvoice +
          invoiceId
      )
      .reply(200, BillsByInvoiceId);
    mock
      .onGet(
        getBillingAddressUrl(cid)
      )
      .reply(200, mockapidata.resAddressData);

    mock
      .onGet(
        urls.countries
      )
      .reply(200, mockapidata.resCountriesData);

    mock
      .onGet(urls.fee)
      .reply(200, mockapidata.resFeeData);

    mock
      .onGet(urls.lookup)
      .reply(200, mockapidata.resLookupData);

    mock
      .onGet(
        getNotesUrl(id)
      )
      .reply(200, mockapidata.notes);

    mock
      .onPut(
        getApproveUrl(id)
      )
      .reply(201);

    mock
      .onPost(
        urls.saveNote
      )
      .reply(200, mockapidata.notesPost);

    mock
      .onGet(
        getDownloadFileUrl(blobUrl)
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        getDownloadUrl(id)
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        getExcelUrl(id)
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });
    mock
      .onPost(
        urls.declineInvoice
      )
      .reply(200, mockapidata.declineInvoicePost);

    mock
      .onPost(
        urls.voidInvoice
      )
      .reply(200, mockapidata.voidApiPost);

    mock
      .onPost(
        urls.uploadFile
      )
      .reply(200, mockapidata.uploadFile);

    mock
      .onPost(
        urls.createDocument
      )
      .reply(400, mockapidata.createDocument);
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
      cid: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
      isClient: "false",
    }));
    const mock = new MockAdapter(axios);

    mockapidata.resData.invoice.status = 4;
    mock
      .onGet(
        urls.invoiceDetails +
          id
      )
      .reply(200, mockapidata.resData);
    mock
      .onGet(
        urls.billsPerInvoice +
          invoiceId
      )
      .reply(200, BillsByInvoiceId);
    mock
      .onGet(
        getBillingAddressUrl(cid)
      )
      .reply(200, mockapidata.resAddressData);

    mock
      .onGet(
        urls.countries
      )
      .reply(200, mockapidata.resCountriesData);

    mock
      .onGet(urls.fee)
      .reply(200, mockapidata.resFeeData);

    mock
      .onGet(urls.lookup)
      .reply(200, mockapidata.resLookupData);

    mock
      .onGet(
        getNotesUrl(id)
      )
      .reply(200, mockapidata.notes);

    mock
      .onPut(
        getApproveUrl(id)
      )
      .reply(201);

    mock
      .onPost(
        urls.saveNote
      )
      .reply(200, mockapidata.notesPost);

    mock
      .onGet(
        getDownloadFileUrl(blobUrl)
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        getDownloadUrl(id)
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        getExcelUrl(id)
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });
    mock
      .onPost(
        urls.declineInvoice
      )
      .reply(200, mockapidata.declineInvoicePost);

    mock
      .onPost(
        urls.voidInvoice
      )
      .reply(400, mockapidata.voidApiPost);

    mock
      .onPost(
        urls.uploadFile
      )
      .reply(200, mockapidata.uploadFile);

    mock
      .onPost(
        urls.createDocument
      )
      .reply(200, mockapidata.createDocument);
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
      cid: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
      isClient: "false",
    }));
    const mock = new MockAdapter(axios);

    mockapidata.resData.invoice.status = 4;
    mock
      .onGet(
        urls.invoiceDetails +
          id
      )
      .reply(200, mockapidata.resData);
    mock
      .onGet(
        urls.billsPerInvoice +
          invoiceId
      )
      .reply(200, BillsByInvoiceId);
    mock
      .onGet(
        getBillingAddressUrl(cid)
      )
      .reply(200, mockapidata.resAddressData);

    mock
      .onGet(
        urls.countries
      )
      .reply(200, mockapidata.resCountriesData);

    mock
      .onGet(urls.fee)
      .reply(200, mockapidata.resFeeData);

    mock
      .onGet(urls.lookup)
      .reply(200, mockapidata.resLookupData);

    mock
      .onGet(
        getNotesUrl(id)
      )
      .reply(200, mockapidata.notes);

    mock
      .onPut(
        getApproveUrl(id)
      )
      .reply(201);

    mock
      .onPost(
        urls.saveNote
      )
      .reply(200, mockapidata.notesPost);

    mock
      .onGet(
        getDownloadFileUrl(blobUrl)
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        getDownloadUrl(id)
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        getExcelUrl(id)
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });
    mock
      .onPost(
        urls.declineInvoice
      )
      .reply(200, mockapidata.declineInvoicePost);

    mock
      .onPost(
        urls.voidInvoice
      )
      .reply(200, mockapidata.voidApiPost);

    mock
      .onPost(
        urls.uploadFile
      )
      .reply(200, mockapidata.uploadFile);

    mock
      .onPost(
        urls.createDocument
      )
      .reply(200, mockapidata.createDocument);
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
      cid: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
      isClient: "false",
    }));
    const mock = new MockAdapter(axios);

    mockapidata.resData.invoice.status = 4;
    mock
      .onGet(
        urls.invoiceDetails +
          id
      )
      .reply(500, mockapidata.resAddressDataFailedApi);
    mock
      .onGet(
        urls.billsPerInvoice +
          invoiceId
      )
      .reply(200, BillsByInvoiceId);
    mock
      .onGet(
        getBillingAddressUrl(cid)
      )
      .reply(404, mockapidata.resAddressDataFailedApi);

    mock
      .onGet(
        urls.countries
      )
      .reply(200, mockapidata.resCountriesData);

    mock
      .onGet(urls.fee)
      .reply(200, mockapidata.resFeeData);

    mock
      .onGet(urls.lookup)
      .reply(200, mockapidata.resLookupData);

    mock
      .onGet(
        getNotesUrl(id)
      )
      .reply(200, mockapidata.notes);

    mock
      .onPut(
        getApproveUrl(id)
      )
      .reply(201);

    mock
      .onPost(
        urls.saveNote
      )
      .reply(200, mockapidata.notesPost);

    mock
      .onGet(
        getDownloadFileUrl(blobUrl)
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        getDownloadUrl(id)
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        getExcelUrl(id)
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });
    mock
      .onPost(
        urls.declineInvoice
      )
      .reply(200, mockapidata.declineInvoicePost);

    mock
      .onPost(
        urls.voidInvoice
      )
      .reply(200, mockapidata.voidApiPost);

    mock
      .onPost(
        urls.uploadFile
      )
      .reply(200, mockapidata.uploadFile);

    mock
      .onPost(
        urls.createDocument
      )
      .reply(200, mockapidata.createDocument);
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
      cid: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
      isClient: "false",
    }));
    const mock = new MockAdapter(axios);

    mockapidata.resData.invoice.status = 2;
    mock
      .onGet(
        urls.invoiceDetails +
          id
      )
      .reply(200, mockapidata.resData);
    mock
      .onGet(
        urls.billsPerInvoice +
          invoiceId
      )
      .reply(200, BillsByInvoiceId);
    mock
      .onGet(
        getBillingAddressUrl(cid)
      )
      .reply(200, mockapidata.resAddressData);

    mock
      .onGet(
        urls.countries
      )
      .reply(200, mockapidata.resCountriesData);

    mock
      .onGet(urls.fee)
      .reply(200, mockapidata.resFeeData);

    mock
      .onGet(urls.lookup)
      .reply(200, mockapidata.resLookupData);

    mock
      .onGet(
        getNotesUrl(id)
      )
      .reply(200, mockapidata.notes);

    mock
      .onPut(
        getApproveUrl(id)
      )
      .reply(201);

    mock
      .onPost(
        urls.saveNote
      )
      .reply(200, mockapidata.notesPost);

    mock
      .onGet(
        getDownloadFileUrl(blobUrl)
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        getDownloadUrl(id)
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        getExcelUrl(id)
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });
    mock
      .onPost(
        urls.declineInvoice
      )
      .reply(200, mockapidata.declineInvoicePost);

    mock
      .onPost(
        urls.voidInvoice
      )
      .reply(200, mockapidata.voidApiPost);

    mock
      .onPost(
        urls.uploadFile
      )
      .reply(200, mockapidata.uploadFile);

    mock
      .onPost(
        urls.createDocument
      )
      .reply(200, mockapidata.createDocument);

    mock
      .onDelete(
        getDeleteInvoiceUrl(invoiceid2)
      )
      .reply(200, true);
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
  });
});
describe("delete test cases on AR Reveiew on false", () => {
  beforeAll(() => {
    useParams.mockImplementation(() => ({
      id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
      cid: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
      isClient: "false",
    }));
    const mock = new MockAdapter(axios);

    mockapidata.resData.invoice.status = 2;
    mock
      .onGet(
        urls.invoiceDetails +
          id
      )
      .reply(200, mockapidata.resData);
    mock
      .onGet(
        urls.billsPerInvoice +
          invoiceId
      )
      .reply(200, BillsByInvoiceId);
    mock
      .onGet(
        getBillingAddressUrl(cid)
      )
      .reply(200, mockapidata.resAddressData);

    mock
      .onGet(
        urls.countries
      )
      .reply(200, mockapidata.resCountriesData);

    mock
      .onGet(urls.fee)
      .reply(200, mockapidata.resFeeData);

    mock
      .onGet(urls.lookup)
      .reply(200, mockapidata.resLookupData);

    mock
      .onGet(
        getNotesUrl(id)
      )
      .reply(200, mockapidata.notes);

    mock
      .onPut(
        getApproveUrl(id)
      )
      .reply(201);

    mock
      .onPost(
        urls.saveNote
      )
      .reply(200, mockapidata.notesPost);

    mock
      .onGet(
        getDownloadFileUrl(blobUrl)
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        getDownloadUrl(id)
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        getExcelUrl(id)
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });
    mock
      .onPost(
        urls.declineInvoice
      )
      .reply(200, mockapidata.declineInvoicePost);

    mock
      .onPost(
        urls.voidInvoice
      )
      .reply(200, mockapidata.voidApiPost);

    mock
      .onPost(
        urls.uploadFile
      )
      .reply(200, mockapidata.uploadFile);

    mock
      .onPost(
        urls.createDocument
      )
      .reply(200, mockapidata.createDocument);

    mock
      .onDelete(
        getDeleteInvoiceUrl(invoiceid2)
      )
      .reply(200, false);
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
  });
});

describe("delete test cases on AR Reveiew on api fail", () => {
  beforeAll(() => {
    useParams.mockImplementation(() => ({
      id: "ab9d400a-0b11-4a21-8505-7646f6caed8d",
      cid: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
      isClient: "false",
    }));
    const mock = new MockAdapter(axios);

    mockapidata.resData.invoice.status = 2;
    mock
      .onGet(
        urls.invoiceDetails +
          id
      )
      .reply(200, mockapidata.resData);
    mock
      .onGet(
        urls.billsPerInvoice +
          invoiceId
      )
      .reply(200, BillsByInvoiceId);
    mock
      .onGet(
        getBillingAddressUrl(cid)
      )
      .reply(200, mockapidata.resAddressData);

    mock
      .onGet(
        urls.countries
      )
      .reply(200, mockapidata.resCountriesData);

    mock
      .onGet(urls.fee)
      .reply(200, mockapidata.resFeeData);

    mock
      .onGet(urls.lookup)
      .reply(200, mockapidata.resLookupData);

    mock
      .onGet(
        getNotesUrl(id)
      )
      .reply(200, mockapidata.notes);

    mock
      .onPut(
        getApproveUrl(id)
      )
      .reply(201);

    mock
      .onPost(
        urls.saveNote
      )
      .reply(200, mockapidata.notesPost);

    mock
      .onGet(
        getDownloadFileUrl(blobUrl)
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        getDownloadUrl(id)
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });

    mock
      .onGet(
        getExcelUrl(id)
      )
      .reply(200, {
        url: "https://apnguatemeaservices.blob.core.windows.net/data/b7951974-531e-45ac-b399-fc07cde58bc0.png?sv=2019-07-07&sr=b&sig=aMz0OBUbKzAJv%2FYA0Dfsl5FQk5NKraO10%2B%2FuvSe6bUw%3D&se=2022-04-07T11%3A07%3A32Z&sp=rl",
        name: "sample.pdf",
      });
    mock
      .onPost(
        urls.declineInvoice
      )
      .reply(200, mockapidata.declineInvoicePost);

    mock
      .onPost(
        urls.voidInvoice
      )
      .reply(200, mockapidata.voidApiPost);

    mock
      .onPost(
        urls.uploadFile
      )
      .reply(200, mockapidata.uploadFile);

    mock
      .onPost(
        urls.createDocument
      )
      .reply(200, mockapidata.createDocument);

    mock
      .onDelete(
        getDeleteInvoiceUrl(invoiceid2)
      )
      .reply(400, true);
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
  });
});
