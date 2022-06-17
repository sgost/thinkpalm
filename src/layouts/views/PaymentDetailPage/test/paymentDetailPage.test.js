import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { mockapidata } from "./mockData";
import { HashRouter } from "react-router-dom";
import PaymentDetailPage from "../paymentDetailPage";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { urls, subscriptionLookup } from "../../../../urls/urls";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useParams: jest.fn(),

  useRouteMatch: () => ({
    url: "/pay/invoicedetailsid321bd39c-cf25-4017-aa22-1c19d51f28b2/a9bbee6d-797a-4724-a86a-5b1a2e28763f/false/payments",
  }),
  useLocation: jest.fn().mockReturnValue({
    state: {
      InvoiceId: "1100810",
      transactionType: 2,
      inveoicesData: [
        {
          customerId: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
          customerName: "DSM Nutritional Products AG",
          customerLocation: "USA",
          currencyId: 840,
          qbInvoiceNo: 0,
          invoiceNo: "1100810",
          status: 4,
          statusLabel: "Approved",
          transactionType: 2,
          transactionTypeLabel: "Miscellaneous",
          createdDate: "6 Jul 2022",
          paymentDate: null,
          approvalDate: null,
          submissionDate: null,
          dueDate: "13 Jul 2022",
          exchangeRate: 1,
          totalAmount: "USD 1.10",
          invoiceBalance: "USD 1.10",
          invoiceFrom: null,
          regionItemCode: null,
          isClientVisible: true,
          depositTo: null,
          createdBy: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
          modifiedBy: "28a34839-4798-4faa-9786-0677e1680f22",
          eorSubscriptionId: null,
          invoicerId: "1794f943-90b2-4d26-b81c-6e01cfa07e80",
          bankingDetailId: null,
          paymentMethod: null,
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
          currency: {
            code: "USD",
            description: "US Dollar",
            id: 840,
          },
          id: "321bd39c-cf25-4017-aa22-1c19d51f28b2",
          exportToQB: {
            value: "Not Exported",
            color: "#767676",
          },
        },
        {
          customerId: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
          customerName: "DSM Nutritional Products AG",
          customerLocation: "",
          currencyId: 840,
          qbInvoiceNo: 0,
          invoiceNo: "1100754",
          status: 4,
          statusLabel: "Approved",
          transactionType: 1,
          transactionTypeLabel: "Payroll",
          createdDate: "3 Jun 2022",
          paymentDate: null,
          approvalDate: "2022-05-23T00:00:00",
          submissionDate: "2022-05-22T00:00:00",
          dueDate: "25 May 2022",
          exchangeRate: 1,
          totalAmount: "USD 24.02",
          invoiceBalance: "USD 24.02",
          invoiceFrom: null,
          regionItemCode: null,
          isClientVisible: false,
          depositTo: null,
          createdBy: "854895ac-f8f0-4a06-9567-2be3a7dc2f7e",
          modifiedBy: "d5a2a8fe-f4fd-4f0a-bda2-d258336b5ef2",
          eorSubscriptionId: "c1dc3b92-d3bf-4c89-41f0-08da3969bbb6",
          invoicerId: "1794f943-90b2-4d26-b81c-6e01cfa07e80",
          bankingDetailId: "87cdcb34-b4e7-4c00-a006-2544918fa71b",
          paymentMethod: null,
          poNumber: "250989",
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
          id: "4f2673ca-8a96-4780-b4e2-104815657966",
          exportToQB: {
            value: "Not Exported",
            color: "#767676",
          },
        },
      ],
      rowDetails: {
        customerId: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
        customerName: "DSM Nutritional Products AG",
        customerLocation: "USA",
        currencyId: 840,
        qbInvoiceNo: 0,
        invoiceNo: "1100810",
        status: 4,
        statusLabel: "Approved",
        transactionType: 2,
        transactionTypeLabel: "Miscellaneous",
        createdDate: "6 Jul 2022",
        paymentDate: null,
        approvalDate: null,
        submissionDate: null,
        dueDate: "13 Jul 2022",
        exchangeRate: 1,
        totalAmount: "USD 1.10",
        invoiceBalance: "USD 1.10",
        invoiceFrom: null,
        regionItemCode: null,
        isClientVisible: true,
        depositTo: null,
        createdBy: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
        modifiedBy: "28a34839-4798-4faa-9786-0677e1680f22",
        eorSubscriptionId: null,
        invoicerId: "1794f943-90b2-4d26-b81c-6e01cfa07e80",
        bankingDetailId: null,
        paymentMethod: null,
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
        currency: {
          code: "USD",
          description: "US Dollar",
          id: 840,
        },
        id: "321bd39c-cf25-4017-aa22-1c19d51f28b2",
        exportToQB: {
          value: "Not Exported",
          color: "#767676",
        },
      },
    },
  }),
}));

localStorage.setItem(
  "accessToken",
  "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIwdmRELXE3ekFYdkFxUzRfTDdoUExua2ZJbVVzaW1NWE1ZWGoxVUYwUUxVIn0.eyJleHAiOjE2NTI2OTU5NTksImlhdCI6MTY1MjY5NDE1OSwiYXV0aF90aW1lIjowLCJqdGkiOiIyMDE0MWU2MC1kOGRjLTQxZTQtYTlkYy1hZjI4NDFkNzY1ZWIiLCJpc3MiOiJodHRwczovL2FjY291bnRzLWRldi5hdGxhc2J5ZWxlbWVudHMuY29tL3JlYWxtcy9BdGxhcyIsImF1ZCI6IkFBQSBCcm9rZXIiLCJzdWIiOiIyOGEzNDgzOS00Nzk4LTRmYWEtOTc4Ni0wNjc3ZTE2ODBmMjIiLCJ0eXAiOiJJRCIsImF6cCI6IkFBQSBCcm9rZXIiLCJzZXNzaW9uX3N0YXRlIjoiNDUzNjQwZGUtZDU3Ni00ZGYxLThhNGQtZDViMzU4MmUyODE3IiwiYXRfaGFzaCI6ImROVkIzM3ZvdkpsMFV3ajlPWWFWVVEiLCJhY3IiOiIxIiwic2lkIjoiNDUzNjQwZGUtZDU3Ni00ZGYxLThhNGQtZDViMzU4MmUyODE3IiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl0sIlBlcm1pc3Npb25zIjp7IkUyOTFDOUYwLTI0NzYtNDIzOC04NUNCLTdBRkVDREQwODVFNCI6eyJOYW1lIjoiRUdTIiwiWm9uZSI6IkVVIiwiVHlwZSI6IkF0bGFzX093bmVycyIsIlBheW1lbnRzIjp7IlJvbGUiOiJGaW5hbmNlQVIiLCJNaXNjZWxsYW5lb3VzSW52b2ljZUNyZWF0aW9uIjpbIlNhdmUiLCJFZGl0Il0sIk1hbnVhbFBheXJvbGxJbnZvaWNlQ3JlYXRpb24iOlsiU2F2ZSIsIkVkaXQiXSwiSW52b2ljZUxpc3QiOlsiQWRkIiwiRWRpdCIsIkRvd25sb2FkIiwiVmlldyJdLCJQcm9mb3JtYUludm9pY2VDcmVhdGlvbiI6WyJTYXZlIiwiRWRpdCJdLCJDcmVkaXRNZW1vSW52b2ljZUNyZWF0aW9uIjpbIlNhdmUiLCJFZGl0Il0sIk1pc2NlbGxhbmVvdXNJbnZvaWNlIjpbIkFkZCIsIkRlbGV0ZUludm9pY2UiLCJEZWxldGVJdGVtIiwiUGF5IiwiRWRpdCIsIlZpZXciLCJTZW5kIiwiQnJvd3NlIiwiUmVqZWN0IiwiRXhwb3J0IiwiQ2xvc2UiLCJWb2lkIiwiRG93bmxvYWQiLCJQdWJsaXNoIiwiQXBwcm92ZSIsIkRlbGV0ZUZpbGUiXSwiSW52b2ljZURldGFpbHMiOlsiQWRkIiwiRGVsZXRlIiwiUGFpZCIsIkVkaXQiLCJWaWV3IiwiU2VuZCIsIkJyb3dzZSIsIlJlamVjdCIsIlNlbGVjdCIsIkV4cG9ydCIsIkNsb3NlIiwiVm9pZCIsIkRvd25sb2FkIiwiUHVibGlzaCIsIkFwcHJvdmUiLCJEZWxldGVGaWxlIl0sIkNyZWRpdE1lbW9JbnZvaWNlIjpbIkFkZCIsIkRlbGV0ZUludm9pY2UiLCJEZWxldGVJdGVtIiwiUGF5IiwiRWRpdCIsIlZpZXciLCJTZW5kIiwiQnJvd3NlIiwiUmVqZWN0IiwiRXhwb3J0IiwiQ2xvc2UiLCJWb2lkIiwiRG93bmxvYWQiLCJQdWJsaXNoIiwiQXBwcm92ZSIsIkRlbGV0ZUZpbGUiXSwiUHJvZm9ybWFJbnZvaWNlIjpbIkFkZCIsIkRlbGV0ZUludm9pY2UiLCJEZWxldGVJdGVtIiwiUGF5IiwiRWRpdCIsIlNlbmQiLCJCcm93c2UiLCJSZWplY3QiLCJFeHBvcnQiLCJDbG9zZSIsIlZvaWQiLCJEb3dubG9hZCIsIlB1Ymxpc2giLCJBcHByb3ZlIiwiRGVsZXRlRmlsZSJdfX19LCJHcm91cCBNZW1iZXJzaGlwcyI6WyIvWm9uZXMvRVUvT3JnYW5pemF0aW9ucy9BdGxhc19Pd25lcnMvRUdTL1BheW1lbnRzL0ZpbmFuY2VBUiIsIi9Sb2xlcy9QYXltZW50cy9GaW5hbmNlQVIiLCIvU3Vic2NyaXB0aW9ucy9QYXltZW50cyJdLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJwYXltZW50c2ZpbmFuY2VhcnVzZXJAc29tZS1vcmcuY29tIn0.qU5SMKAe0Q5VWvBur5lqnjcVhXRr1BGUJF77c_aqDmq2T9vJUiVf4LuZxcbk4d-J_BvL3NPjkANtuIlqUw28aLTQ1A9IUarfsx5nPsmE325ebtUq9Xp8r-tBRr0jAaFfj7ydbNS5z9QgTHk65h6AxZflXw3ZspWJ9gSN9fCce7AHJTsL6ZgBuNoJN6vgu-O6GH5lxuontJvJWHR1_x_zTX2_3s2u9tMxVG13KNnmjmvhg7yxnIKZDQDMqXAiqePLD6lBBMBcXRKKnpNSGzBJgSBOiyE9brKaFNAHh7VhoStRUkjmBXnrh-yVwCYDQUGt5ZnEk6oBS63FobTEoVNFEw"
);
localStorage.setItem("current-org-id", "E291C9F0-2476-4238-85CB-7AFECDD085E4");

describe("Payment details page", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock.onGet(urls.lookup).reply(200, mockapidata.resForLookupCurrencyData);

    mock
      .onGet(subscriptionLookup())
      .reply(200, mockapidata.resForPaymentMethodData);
  });

  // test("test payment detail ", async () => {
  //   render(
  //     <HashRouter>
  //       <PaymentDetailPage />
  //     </HashRouter>
  //   );

  //   // const openIcon = await screen.findAllByTestId("open-payment-block");
  //   // fireEvent.click(openIcon[0]);

  //   const dpp = await waitFor(() => screen.getAllByRole("textbox"));
  //   fireEvent.click(dpp[0]);

  //   const selDates = await waitFor(() => screen.getAllByText(/15/));
  //   fireEvent.click(selDates[2]);

  //   const currencyText = await screen.findByText("Currency");
  //   fireEvent.click(currencyText);

  //   const currencyValue = await screen.findByText("USD");
  //   fireEvent.click(currencyValue);

  //   const locationText = await screen.findByText("Location");
  //   fireEvent.click(locationText);

  //   const locationValue = await screen.findByText(
  //     "USA -- United States of America"
  //   );
  //   fireEvent.click(locationValue);

  //   const referenceText = await screen.findByPlaceholderText(
  //     /enter reference no/i
  //   );
  //   expect(referenceText).toBeInTheDocument();
  //   fireEvent.change(referenceText, { target: { value: "1234" } });
  //   // fireEvent.keyDown(referenceText);

  //   const depositBankText = await screen.findByText("Deposited to bank");
  //   fireEvent.click(depositBankText);

  //   const depositBankValue = await screen.findByText("HSBC (UK) 0175 - USD");
  //   fireEvent.click(depositBankValue);

  //   const paymentText = await screen.findByText("Payment Method");
  //   fireEvent.click(paymentText);

  //   const paymentValue = await screen.findByText("ACHCredit");
  //   fireEvent.click(paymentValue);

  //   // const fullAmountText = await screen.findByText("Full Amount");
  //   // fireEvent.click(fullAmountText);

  //   const saveBtn = await screen.findByText(/save/i);
  //   fireEvent.click(saveBtn);

  //   // const addPaymentInstallmentButton = await screen.findByText(
  //   //   "Add payment Installment"
  //   // );
  //   // fireEvent.click(addPaymentInstallmentButton);

  //   // const deleteButton = await screen.findByText("Delete Item");
  //   // fireEvent.click(deleteButton);
  // });
  test("payment page breadcrumbs click", async () => {
    render(
      <HashRouter>
        <PaymentDetailPage />
      </HashRouter>
    );

    const invoiceText = await screen.findByText(/Invoices/);
    expect(invoiceText).toBeInTheDocument();
    fireEvent.click(invoiceText);
  });
});

describe("Payment details page lookup and subscription lookup api fail", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock.onGet(urls.lookup).reply(500, mockapidata.resForLookupCurrencyData);

    mock
      .onGet(subscriptionLookup())
      .reply(500, mockapidata.resForPaymentMethodData);
  });

  test("payment page", async () => {
    render(
      <HashRouter>
        <PaymentDetailPage />
      </HashRouter>
    );
  });
});
