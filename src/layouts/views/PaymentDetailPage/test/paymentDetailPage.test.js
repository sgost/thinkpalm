import {
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
  waitFor,
} from "@testing-library/react";
import { HashRouter } from "react-router-dom";
import PaymentDetailPage from "../paymentDetailPage";

localStorage.setItem(
  "accessToken",
  "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIwdmRELXE3ekFYdkFxUzRfTDdoUExua2ZJbVVzaW1NWE1ZWGoxVUYwUUxVIn0.eyJleHAiOjE2NTI2OTU5NTksImlhdCI6MTY1MjY5NDE1OSwiYXV0aF90aW1lIjowLCJqdGkiOiIyMDE0MWU2MC1kOGRjLTQxZTQtYTlkYy1hZjI4NDFkNzY1ZWIiLCJpc3MiOiJodHRwczovL2FjY291bnRzLWRldi5hdGxhc2J5ZWxlbWVudHMuY29tL3JlYWxtcy9BdGxhcyIsImF1ZCI6IkFBQSBCcm9rZXIiLCJzdWIiOiIyOGEzNDgzOS00Nzk4LTRmYWEtOTc4Ni0wNjc3ZTE2ODBmMjIiLCJ0eXAiOiJJRCIsImF6cCI6IkFBQSBCcm9rZXIiLCJzZXNzaW9uX3N0YXRlIjoiNDUzNjQwZGUtZDU3Ni00ZGYxLThhNGQtZDViMzU4MmUyODE3IiwiYXRfaGFzaCI6ImROVkIzM3ZvdkpsMFV3ajlPWWFWVVEiLCJhY3IiOiIxIiwic2lkIjoiNDUzNjQwZGUtZDU3Ni00ZGYxLThhNGQtZDViMzU4MmUyODE3IiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl0sIlBlcm1pc3Npb25zIjp7IkUyOTFDOUYwLTI0NzYtNDIzOC04NUNCLTdBRkVDREQwODVFNCI6eyJOYW1lIjoiRUdTIiwiWm9uZSI6IkVVIiwiVHlwZSI6IkF0bGFzX093bmVycyIsIlBheW1lbnRzIjp7IlJvbGUiOiJGaW5hbmNlQVIiLCJNaXNjZWxsYW5lb3VzSW52b2ljZUNyZWF0aW9uIjpbIlNhdmUiLCJFZGl0Il0sIk1hbnVhbFBheXJvbGxJbnZvaWNlQ3JlYXRpb24iOlsiU2F2ZSIsIkVkaXQiXSwiSW52b2ljZUxpc3QiOlsiQWRkIiwiRWRpdCIsIkRvd25sb2FkIiwiVmlldyJdLCJQcm9mb3JtYUludm9pY2VDcmVhdGlvbiI6WyJTYXZlIiwiRWRpdCJdLCJDcmVkaXRNZW1vSW52b2ljZUNyZWF0aW9uIjpbIlNhdmUiLCJFZGl0Il0sIk1pc2NlbGxhbmVvdXNJbnZvaWNlIjpbIkFkZCIsIkRlbGV0ZUludm9pY2UiLCJEZWxldGVJdGVtIiwiUGF5IiwiRWRpdCIsIlZpZXciLCJTZW5kIiwiQnJvd3NlIiwiUmVqZWN0IiwiRXhwb3J0IiwiQ2xvc2UiLCJWb2lkIiwiRG93bmxvYWQiLCJQdWJsaXNoIiwiQXBwcm92ZSIsIkRlbGV0ZUZpbGUiXSwiSW52b2ljZURldGFpbHMiOlsiQWRkIiwiRGVsZXRlIiwiUGFpZCIsIkVkaXQiLCJWaWV3IiwiU2VuZCIsIkJyb3dzZSIsIlJlamVjdCIsIlNlbGVjdCIsIkV4cG9ydCIsIkNsb3NlIiwiVm9pZCIsIkRvd25sb2FkIiwiUHVibGlzaCIsIkFwcHJvdmUiLCJEZWxldGVGaWxlIl0sIkNyZWRpdE1lbW9JbnZvaWNlIjpbIkFkZCIsIkRlbGV0ZUludm9pY2UiLCJEZWxldGVJdGVtIiwiUGF5IiwiRWRpdCIsIlZpZXciLCJTZW5kIiwiQnJvd3NlIiwiUmVqZWN0IiwiRXhwb3J0IiwiQ2xvc2UiLCJWb2lkIiwiRG93bmxvYWQiLCJQdWJsaXNoIiwiQXBwcm92ZSIsIkRlbGV0ZUZpbGUiXSwiUHJvZm9ybWFJbnZvaWNlIjpbIkFkZCIsIkRlbGV0ZUludm9pY2UiLCJEZWxldGVJdGVtIiwiUGF5IiwiRWRpdCIsIlNlbmQiLCJCcm93c2UiLCJSZWplY3QiLCJFeHBvcnQiLCJDbG9zZSIsIlZvaWQiLCJEb3dubG9hZCIsIlB1Ymxpc2giLCJBcHByb3ZlIiwiRGVsZXRlRmlsZSJdfX19LCJHcm91cCBNZW1iZXJzaGlwcyI6WyIvWm9uZXMvRVUvT3JnYW5pemF0aW9ucy9BdGxhc19Pd25lcnMvRUdTL1BheW1lbnRzL0ZpbmFuY2VBUiIsIi9Sb2xlcy9QYXltZW50cy9GaW5hbmNlQVIiLCIvU3Vic2NyaXB0aW9ucy9QYXltZW50cyJdLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJwYXltZW50c2ZpbmFuY2VhcnVzZXJAc29tZS1vcmcuY29tIn0.qU5SMKAe0Q5VWvBur5lqnjcVhXRr1BGUJF77c_aqDmq2T9vJUiVf4LuZxcbk4d-J_BvL3NPjkANtuIlqUw28aLTQ1A9IUarfsx5nPsmE325ebtUq9Xp8r-tBRr0jAaFfj7ydbNS5z9QgTHk65h6AxZflXw3ZspWJ9gSN9fCce7AHJTsL6ZgBuNoJN6vgu-O6GH5lxuontJvJWHR1_x_zTX2_3s2u9tMxVG13KNnmjmvhg7yxnIKZDQDMqXAiqePLD6lBBMBcXRKKnpNSGzBJgSBOiyE9brKaFNAHh7VhoStRUkjmBXnrh-yVwCYDQUGt5ZnEk6oBS63FobTEoVNFEw"
);
localStorage.setItem("current-org-id", "E291C9F0-2476-4238-85CB-7AFECDD085E4");

describe("Payment details page", () => {
  test("payment page breadcrumbs click", async () => {
    render(
      <HashRouter>
        <PaymentDetailPage />
      </HashRouter>
    );

    const invoiceText = await screen.findByText(/Invoices/);
    expect(invoiceText).toBeInTheDocument();
    fireEvent.click(invoiceText)
  });

  test("payment page", async () => {
    render(
      <HashRouter>
        <PaymentDetailPage />
      </HashRouter>
    );

    const currencyText = await screen.findByText("Currency");
    fireEvent.click(currencyText)

    const locationText = await screen.findByText("Location");
    fireEvent.click(locationText)

    const classText = await screen.findByText("Class");
    fireEvent.click(classText)

    const depositBankText = await screen.findByText("Deposited to bank");
    fireEvent.click(depositBankText)

    const paymentText = await screen.findByText("Payment Method");
    fireEvent.click(paymentText)

    const fullAmountText = await screen.findByText("Full Amount");
    fireEvent.click(fullAmountText)

    const addPaymentInstallmentButton = await screen.findByText("Add payment Installment");
    fireEvent.click(addPaymentInstallmentButton)
    
  });
});
