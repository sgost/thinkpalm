
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { HashRouter } from "react-router-dom";
import CreditMemoSummary from "..";
import MockAdapter from "axios-mock-adapter";
import { mockapidata, mockCreditMemoData } from "../../InvoiceDetails/test/mockdata";
import axios from "axios";
import { urls } from '../../../../urls/urls'
import { BillsTable } from '../../BillsTable/index'

const id = "ab9d400a-0b11-4a21-8505-7646f6caed8d";
const cid = "a9bbee6d-797a-4724-a86a-5b1a2e28763f";
localStorage.setItem("accessToken", "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIwdmRELXE3ekFYdkFxUzRfTDdoUExua2ZJbVVzaW1NWE1ZWGoxVUYwUUxVIn0.eyJleHAiOjE2NTIzMzg2ODcsImlhdCI6MTY1MjMzNjg4NywiYXV0aF90aW1lIjowLCJqdGkiOiIyZDU5YzIxNi1hNWRiLTQyNmItYTAwYi03MGU3MDY3ZjEwMjMiLCJpc3MiOiJodHRwczovL2FjY291bnRzLWRldi5hdGxhc2J5ZWxlbWVudHMuY29tL3JlYWxtcy9BdGxhcyIsImF1ZCI6IkFBQSBCcm9rZXIiLCJzdWIiOiIyOGEzNDgzOS00Nzk4LTRmYWEtOTc4Ni0wNjc3ZTE2ODBmMjIiLCJ0eXAiOiJJRCIsImF6cCI6IkFBQSBCcm9rZXIiLCJzZXNzaW9uX3N0YXRlIjoiYTcwMDkxNjYtMDE0Yy00ZGE3LThjMTEtOTFjYmYxN2JiMmU5IiwiYXRfaGFzaCI6IkE2Wk5pN0RINEhTVTZNaUFzMWowTVEiLCJhY3IiOiIxIiwic2lkIjoiYTcwMDkxNjYtMDE0Yy00ZGE3LThjMTEtOTFjYmYxN2JiMmU5IiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl0sIlBlcm1pc3Npb25zIjp7IkUyOTFDOUYwLTI0NzYtNDIzOC04NUNCLTdBRkVDREQwODVFNCI6eyJOYW1lIjoiRUdTIiwiWm9uZSI6IkVVIiwiVHlwZSI6IkF0bGFzX093bmVycyIsIlBheW1lbnRzIjp7IlJvbGUiOiJGaW5hbmNlQVIiLCJNaXNjZWxsYW5lb3VzSW52b2ljZUNyZWF0aW9uIjpbIlNhdmUiLCJFZGl0Il0sIk1hbnVhbFBheXJvbGxJbnZvaWNlQ3JlYXRpb24iOlsiU2F2ZSIsIkVkaXQiXSwiSW52b2ljZUxpc3QiOlsiQWRkIiwiRWRpdCIsIkRvd25sb2FkIiwiVmlldyJdLCJQcm9mb3JtYUludm9pY2VDcmVhdGlvbiI6WyJTYXZlIiwiRWRpdCJdLCJDcmVkaXRNZW1vSW52b2ljZUNyZWF0aW9uIjpbIlNhdmUiLCJFZGl0Il0sIk1pc2NlbGxhbmVvdXNJbnZvaWNlIjpbIkFkZCIsIkRlbGV0ZUludm9pY2UiLCJEZWxldGVJdGVtIiwiUGF5IiwiRWRpdCIsIlZpZXciLCJTZW5kIiwiQnJvd3NlIiwiUmVqZWN0IiwiRXhwb3J0IiwiQ2xvc2UiLCJWb2lkIiwiRG93bmxvYWQiLCJQdWJsaXNoIiwiQXBwcm92ZSIsIkRlbGV0ZUZpbGUiXSwiSW52b2ljZURldGFpbHMiOlsiQWRkIiwiRGVsZXRlIiwiUGFpZCIsIkVkaXQiLCJWaWV3IiwiU2VuZCIsIkJyb3dzZSIsIlJlamVjdCIsIlNlbGVjdCIsIkV4cG9ydCIsIkNsb3NlIiwiVm9pZCIsIkRvd25sb2FkIiwiUHVibGlzaCIsIkFwcHJvdmUiLCJEZWxldGVGaWxlIl0sIkNyZWRpdE1lbW9JbnZvaWNlIjpbIkFkZCIsIkRlbGV0ZUludm9pY2UiLCJEZWxldGVJdGVtIiwiUGF5IiwiRWRpdCIsIlZpZXciLCJTZW5kIiwiQnJvd3NlIiwiUmVqZWN0IiwiRXhwb3J0IiwiQ2xvc2UiLCJWb2lkIiwiRG93bmxvYWQiLCJQdWJsaXNoIiwiQXBwcm92ZSIsIkRlbGV0ZUZpbGUiXSwiUHJvZm9ybWFJbnZvaWNlIjpbIkFkZCIsIkRlbGV0ZUludm9pY2UiLCJEZWxldGVJdGVtIiwiUGF5IiwiRWRpdCIsIlNlbmQiLCJCcm93c2UiLCJSZWplY3QiLCJFeHBvcnQiLCJDbG9zZSIsIlZvaWQiLCJEb3dubG9hZCIsIlB1Ymxpc2giLCJBcHByb3ZlIiwiRGVsZXRlRmlsZSJdfX19LCJHcm91cCBNZW1iZXJzaGlwcyI6WyIvWm9uZXMvRVUvT3JnYW5pemF0aW9ucy9BdGxhc19Pd25lcnMvRUdTL1BheW1lbnRzL0ZpbmFuY2VBUiIsIi9Sb2xlcy9QYXltZW50cy9GaW5hbmNlQVIiLCIvU3Vic2NyaXB0aW9ucy9QYXltZW50cyJdLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJwYXltZW50c2ZpbmFuY2VhcnVzZXJAc29tZS1vcmcuY29tIn0.kQwAyl4f2lOXpiCysnYmZNLs3qUE7zkJ2xozWExr55W_pdBCcXV2nDVf0TsAh022NJ0xr4Mx7hxOkFhJKatg42IvxljZoxunHv88QqKYpGMK_r-B1YqSR6Vz1hUwOSaF_zLFlseR292icQWmxuNXRvtoUfN4shurHNIob63Dua5sNLfBEJL0BF4xDNtgQrn6H5SImOm8274a8J1BK4StteS0GOAbtZyrAn1h1N5xLb0q-RykXru4PSlHOuS_vCjnX5ZIX0zW4gEuuNqzfcSjjrB5hZRRprxjrbVJXGn-XvxIUULXSj0jPcO7w8j3iIGkTjnqzNAtd5iu5_2UUgU2bw");
localStorage.setItem("current-org-id", "E291C9F0-2476-4238-85CB-7AFECDD085E4");
describe("Credit Memo Summary", () => {
    beforeAll(() => {
        const mock = new MockAdapter(axios);
        mock.onPost(urls.uploadFile).reply(200, mockapidata.uploadFile);
        mock.onPost(urls.createDocument).reply(200, mockapidata.createDocument);
    })
    test("Render CM", () => {
        render(
            <HashRouter>
                <CreditMemoSummary
                    notes={mockapidata.notes}
                    documents={mockapidata.resData.invoice.invoiceDocuments}
                    id={id}
                    cid={cid}
                    isClient={"true"}
                    setNotes={() => { }}
                    setDocuments={() => { }}
                    invoiceItems={mockCreditMemoData.invoiceItems}
                ></CreditMemoSummary>
            </HashRouter>
        );
    })
})
describe("Notes fail", () => {
    beforeAll(() => {
        const mock = new MockAdapter(axios);
        mock.onPost(urls.uploadFile).reply(200, mockapidata.uploadFile);
        mock.onPost(urls.createDocument).reply(200, mockapidata.createDocument);
    })
    test("Render CM", async () => {
        render(
            <HashRouter>
                <CreditMemoSummary
                    notes={[]}
                    documents={mockapidata.resData.invoice.invoiceDocuments}
                    id={id}
                    cid={cid}
                    isClient={"false"}
                    setNotes={() => { }}
                    setDocuments={() => { }}
                    invoiceItems={mockCreditMemoData.invoiceItems}
                ></CreditMemoSummary>
            </HashRouter>
        );
        const input = await waitFor(() =>
            screen.getByPlaceholderText(/Add a note here.../)
        );
        fireEvent.change(input, { target: { value: "FWIfRJDL9AuOIDLBZOMlIdfkjhdkfjhsdjfhjfhgdfjhdgfjdsgfjhdgfLUACmHyPxGCAYVluVrEp8qqIo1oMiiq6KSeeqLz5kdVdsi9ZkGlMmOr5tU3lVLHsMveDIxnXW94wRfw1PaNBQjOMwx6GMMjlNJpgHdhNuqU35KeNMUbh5BSKW8NSvtWj7EHBGgeaQWv2Mip4t4Y902auYg7lCe5SXcNg2uOiA1wo9frMt89RdUHbpiAfVx5GJ42eJrzACNeeMmAlzELmL2Zyk3qWJWSJa64a3vMASalMhGag4RdLpNLQK6b9rmgLXYTUQg3vIH7VH7odGP3oxiZGFD1CktANJR501MOKWjXdAlyXd4V6z9BstN62s1Oy3k3MeoMAsMSO1Nt5qBxn8cnX29dWGkcqZ0DBzEAv81lSerQfzMVxkzOWuzhXd35EaGVkpqFOQJtPuSjdfsdfsdfdsfdsfsdsfdsfsdfsdfdsfsd" } });
        const publish = screen.getByText(/Save/);
        fireEvent.click(publish);
    });

})