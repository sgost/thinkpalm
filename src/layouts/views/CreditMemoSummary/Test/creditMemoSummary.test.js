
import { fireEvent, getByPlaceholderText, render, screen, waitFor } from "@testing-library/react";
import { HashRouter } from "react-router-dom";
import CreditMemoSummary from "..";
import MockAdapter from "axios-mock-adapter";
import { mockapidata, mockCreditMemoData, mockProductData, mockServiceCountries, productInvoiceMock } from "../../InvoiceDetails/test/mockdata";
import axios from "axios";
import { getHeaders, updateCreditMemoUrl, urls, productInvoice } from '../../../../urls/urls'
import { BillsTable } from '../../BillsTable/index'
import userEvent from "@testing-library/user-event";
import { url } from "inspector";

const changeLogs = [
    {
        "date": "14 Jun 2022, 11:41",
        "description": "CREATED"
    },
    {
        "date": "14 Jun 2022, 11:59",
        "description": "Changed invoice to Miscellaneous 1100955"
    },
    {
        "date": "14 Jun 2022, 11:59",
        "description": "Changed invoice from Performa 1100960"
    },
    {
        "date": "14 Jun 2022, 02:59",
        "description": "Changed invoice to Miscellaneous 1100955"
    },
    {
        "date": "14 Jun 2022, 02:59",
        "description": "Changed invoice from Performa 1100977"
    },
    {
        "date": "18 Jun 2022, 12:10",
        "description": "payment"
    }
]

const logsData = [
    {
        "date": "14 Jun 2022, 11:41",
        "description": "CREATED"
    },
    {
        "date": "14 Jun 2022, 11:59",
        "description": "Changed invoice to Miscellaneous 1100955"
    },
    {
        "date": "14 Jun 2022, 11:59",
        "description": "Changed invoice from Performa 1100960"
    },
    {
        "date": "14 Jun 2022, 02:59",
        "description": "Changed invoice to Miscellaneous 1100955"
    },
    {
        "date": "14 Jun 2022, 02:59",
        "description": "Changed invoice from Performa 1100977"
    },
    {
        "date": "18 Jun 2022, 12:10",
        "description": "payment"
    }
]

const id = "e6adaad5-089b-4a6f-b24f-a398b33c8cf3";
const cid = "a9bbee6d-797a-4724-a86a-5b1a2e28763f";
var token = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIwdmRELXE3ekFYdkFxUzRfTDdoUExua2ZJbVVzaW1NWE1ZWGoxVUYwUUxVIn0.eyJleHAiOjE2NTIzMzg2ODcsImlhdCI6MTY1MjMzNjg4NywiYXV0aF90aW1lIjowLCJqdGkiOiIyZDU5YzIxNi1hNWRiLTQyNmItYTAwYi03MGU3MDY3ZjEwMjMiLCJpc3MiOiJodHRwczovL2FjY291bnRzLWRldi5hdGxhc2J5ZWxlbWVudHMuY29tL3JlYWxtcy9BdGxhcyIsImF1ZCI6IkFBQSBCcm9rZXIiLCJzdWIiOiIyOGEzNDgzOS00Nzk4LTRmYWEtOTc4Ni0wNjc3ZTE2ODBmMjIiLCJ0eXAiOiJJRCIsImF6cCI6IkFBQSBCcm9rZXIiLCJzZXNzaW9uX3N0YXRlIjoiYTcwMDkxNjYtMDE0Yy00ZGE3LThjMTEtOTFjYmYxN2JiMmU5IiwiYXRfaGFzaCI6IkE2Wk5pN0RINEhTVTZNaUFzMWowTVEiLCJhY3IiOiIxIiwic2lkIjoiYTcwMDkxNjYtMDE0Yy00ZGE3LThjMTEtOTFjYmYxN2JiMmU5IiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl0sIlBlcm1pc3Npb25zIjp7IkUyOTFDOUYwLTI0NzYtNDIzOC04NUNCLTdBRkVDREQwODVFNCI6eyJOYW1lIjoiRUdTIiwiWm9uZSI6IkVVIiwiVHlwZSI6IkF0bGFzX093bmVycyIsIlBheW1lbnRzIjp7IlJvbGUiOiJGaW5hbmNlQVIiLCJNaXNjZWxsYW5lb3VzSW52b2ljZUNyZWF0aW9uIjpbIlNhdmUiLCJFZGl0Il0sIk1hbnVhbFBheXJvbGxJbnZvaWNlQ3JlYXRpb24iOlsiU2F2ZSIsIkVkaXQiXSwiSW52b2ljZUxpc3QiOlsiQWRkIiwiRWRpdCIsIkRvd25sb2FkIiwiVmlldyJdLCJQcm9mb3JtYUludm9pY2VDcmVhdGlvbiI6WyJTYXZlIiwiRWRpdCJdLCJDcmVkaXRNZW1vSW52b2ljZUNyZWF0aW9uIjpbIlNhdmUiLCJFZGl0Il0sIk1pc2NlbGxhbmVvdXNJbnZvaWNlIjpbIkFkZCIsIkRlbGV0ZUludm9pY2UiLCJEZWxldGVJdGVtIiwiUGF5IiwiRWRpdCIsIlZpZXciLCJTZW5kIiwiQnJvd3NlIiwiUmVqZWN0IiwiRXhwb3J0IiwiQ2xvc2UiLCJWb2lkIiwiRG93bmxvYWQiLCJQdWJsaXNoIiwiQXBwcm92ZSIsIkRlbGV0ZUZpbGUiXSwiSW52b2ljZURldGFpbHMiOlsiQWRkIiwiRGVsZXRlIiwiUGFpZCIsIkVkaXQiLCJWaWV3IiwiU2VuZCIsIkJyb3dzZSIsIlJlamVjdCIsIlNlbGVjdCIsIkV4cG9ydCIsIkNsb3NlIiwiVm9pZCIsIkRvd25sb2FkIiwiUHVibGlzaCIsIkFwcHJvdmUiLCJEZWxldGVGaWxlIl0sIkNyZWRpdE1lbW9JbnZvaWNlIjpbIkFkZCIsIkRlbGV0ZUludm9pY2UiLCJEZWxldGVJdGVtIiwiUGF5IiwiRWRpdCIsIlZpZXciLCJTZW5kIiwiQnJvd3NlIiwiUmVqZWN0IiwiRXhwb3J0IiwiQ2xvc2UiLCJWb2lkIiwiRG93bmxvYWQiLCJQdWJsaXNoIiwiQXBwcm92ZSIsIkRlbGV0ZUZpbGUiXSwiUHJvZm9ybWFJbnZvaWNlIjpbIkFkZCIsIkRlbGV0ZUludm9pY2UiLCJEZWxldGVJdGVtIiwiUGF5IiwiRWRpdCIsIlNlbmQiLCJCcm93c2UiLCJSZWplY3QiLCJFeHBvcnQiLCJDbG9zZSIsIlZvaWQiLCJEb3dubG9hZCIsIlB1Ymxpc2giLCJBcHByb3ZlIiwiRGVsZXRlRmlsZSJdfX19LCJHcm91cCBNZW1iZXJzaGlwcyI6WyIvWm9uZXMvRVUvT3JnYW5pemF0aW9ucy9BdGxhc19Pd25lcnMvRUdTL1BheW1lbnRzL0ZpbmFuY2VBUiIsIi9Sb2xlcy9QYXltZW50cy9GaW5hbmNlQVIiLCIvU3Vic2NyaXB0aW9ucy9QYXltZW50cyJdLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJwYXltZW50c2ZpbmFuY2VhcnVzZXJAc29tZS1vcmcuY29tIn0.kQwAyl4f2lOXpiCysnYmZNLs3qUE7zkJ2xozWExr55W_pdBCcXV2nDVf0TsAh022NJ0xr4Mx7hxOkFhJKatg42IvxljZoxunHv88QqKYpGMK_r-B1YqSR6Vz1hUwOSaF_zLFlseR292icQWmxuNXRvtoUfN4shurHNIob63Dua5sNLfBEJL0BF4xDNtgQrn6H5SImOm8274a8J1BK4StteS0GOAbtZyrAn1h1N5xLb0q-RykXru4PSlHOuS_vCjnX5ZIX0zW4gEuuNqzfcSjjrB5hZRRprxjrbVJXGn-XvxIUULXSj0jPcO7w8j3iIGkTjnqzNAtd5iu5_2UUgU2bw"
localStorage.setItem("accessToken", "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIwdmRELXE3ekFYdkFxUzRfTDdoUExua2ZJbVVzaW1NWE1ZWGoxVUYwUUxVIn0.eyJleHAiOjE2NTIzMzg2ODcsImlhdCI6MTY1MjMzNjg4NywiYXV0aF90aW1lIjowLCJqdGkiOiIyZDU5YzIxNi1hNWRiLTQyNmItYTAwYi03MGU3MDY3ZjEwMjMiLCJpc3MiOiJodHRwczovL2FjY291bnRzLWRldi5hdGxhc2J5ZWxlbWVudHMuY29tL3JlYWxtcy9BdGxhcyIsImF1ZCI6IkFBQSBCcm9rZXIiLCJzdWIiOiIyOGEzNDgzOS00Nzk4LTRmYWEtOTc4Ni0wNjc3ZTE2ODBmMjIiLCJ0eXAiOiJJRCIsImF6cCI6IkFBQSBCcm9rZXIiLCJzZXNzaW9uX3N0YXRlIjoiYTcwMDkxNjYtMDE0Yy00ZGE3LThjMTEtOTFjYmYxN2JiMmU5IiwiYXRfaGFzaCI6IkE2Wk5pN0RINEhTVTZNaUFzMWowTVEiLCJhY3IiOiIxIiwic2lkIjoiYTcwMDkxNjYtMDE0Yy00ZGE3LThjMTEtOTFjYmYxN2JiMmU5IiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl0sIlBlcm1pc3Npb25zIjp7IkUyOTFDOUYwLTI0NzYtNDIzOC04NUNCLTdBRkVDREQwODVFNCI6eyJOYW1lIjoiRUdTIiwiWm9uZSI6IkVVIiwiVHlwZSI6IkF0bGFzX093bmVycyIsIlBheW1lbnRzIjp7IlJvbGUiOiJGaW5hbmNlQVIiLCJNaXNjZWxsYW5lb3VzSW52b2ljZUNyZWF0aW9uIjpbIlNhdmUiLCJFZGl0Il0sIk1hbnVhbFBheXJvbGxJbnZvaWNlQ3JlYXRpb24iOlsiU2F2ZSIsIkVkaXQiXSwiSW52b2ljZUxpc3QiOlsiQWRkIiwiRWRpdCIsIkRvd25sb2FkIiwiVmlldyJdLCJQcm9mb3JtYUludm9pY2VDcmVhdGlvbiI6WyJTYXZlIiwiRWRpdCJdLCJDcmVkaXRNZW1vSW52b2ljZUNyZWF0aW9uIjpbIlNhdmUiLCJFZGl0Il0sIk1pc2NlbGxhbmVvdXNJbnZvaWNlIjpbIkFkZCIsIkRlbGV0ZUludm9pY2UiLCJEZWxldGVJdGVtIiwiUGF5IiwiRWRpdCIsIlZpZXciLCJTZW5kIiwiQnJvd3NlIiwiUmVqZWN0IiwiRXhwb3J0IiwiQ2xvc2UiLCJWb2lkIiwiRG93bmxvYWQiLCJQdWJsaXNoIiwiQXBwcm92ZSIsIkRlbGV0ZUZpbGUiXSwiSW52b2ljZURldGFpbHMiOlsiQWRkIiwiRGVsZXRlIiwiUGFpZCIsIkVkaXQiLCJWaWV3IiwiU2VuZCIsIkJyb3dzZSIsIlJlamVjdCIsIlNlbGVjdCIsIkV4cG9ydCIsIkNsb3NlIiwiVm9pZCIsIkRvd25sb2FkIiwiUHVibGlzaCIsIkFwcHJvdmUiLCJEZWxldGVGaWxlIl0sIkNyZWRpdE1lbW9JbnZvaWNlIjpbIkFkZCIsIkRlbGV0ZUludm9pY2UiLCJEZWxldGVJdGVtIiwiUGF5IiwiRWRpdCIsIlZpZXciLCJTZW5kIiwiQnJvd3NlIiwiUmVqZWN0IiwiRXhwb3J0IiwiQ2xvc2UiLCJWb2lkIiwiRG93bmxvYWQiLCJQdWJsaXNoIiwiQXBwcm92ZSIsIkRlbGV0ZUZpbGUiXSwiUHJvZm9ybWFJbnZvaWNlIjpbIkFkZCIsIkRlbGV0ZUludm9pY2UiLCJEZWxldGVJdGVtIiwiUGF5IiwiRWRpdCIsIlNlbmQiLCJCcm93c2UiLCJSZWplY3QiLCJFeHBvcnQiLCJDbG9zZSIsIlZvaWQiLCJEb3dubG9hZCIsIlB1Ymxpc2giLCJBcHByb3ZlIiwiRGVsZXRlRmlsZSJdfX19LCJHcm91cCBNZW1iZXJzaGlwcyI6WyIvWm9uZXMvRVUvT3JnYW5pemF0aW9ucy9BdGxhc19Pd25lcnMvRUdTL1BheW1lbnRzL0ZpbmFuY2VBUiIsIi9Sb2xlcy9QYXltZW50cy9GaW5hbmNlQVIiLCIvU3Vic2NyaXB0aW9ucy9QYXltZW50cyJdLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJwYXltZW50c2ZpbmFuY2VhcnVzZXJAc29tZS1vcmcuY29tIn0.kQwAyl4f2lOXpiCysnYmZNLs3qUE7zkJ2xozWExr55W_pdBCcXV2nDVf0TsAh022NJ0xr4Mx7hxOkFhJKatg42IvxljZoxunHv88QqKYpGMK_r-B1YqSR6Vz1hUwOSaF_zLFlseR292icQWmxuNXRvtoUfN4shurHNIob63Dua5sNLfBEJL0BF4xDNtgQrn6H5SImOm8274a8J1BK4StteS0GOAbtZyrAn1h1N5xLb0q-RykXru4PSlHOuS_vCjnX5ZIX0zW4gEuuNqzfcSjjrB5hZRRprxjrbVJXGn-XvxIUULXSj0jPcO7w8j3iIGkTjnqzNAtd5iu5_2UUgU2bw");
localStorage.setItem("current-org-id", "E291C9F0-2476-4238-85CB-7AFECDD085E4");
describe("Credit Memo Summary", () => {
    beforeAll(() => {
        var temp = localStorage.getItem('accessToken');
        const mock = new MockAdapter(axios);
        mock.onGet(productInvoice()).reply(200, productInvoiceMock);
        mock.onPost(urls.uploadFile).reply(200, mockapidata.uploadFile);
        mock.onPost(urls.createDocument).reply(200, mockapidata.createDocument);
        mock.onPut(updateCreditMemoUrl(mockCreditMemoData.id), mockCreditMemoData, getHeaders(temp, cid, id)).reply(200, mockCreditMemoData);
        mock.onGet(urls.products).reply(200, mockProductData)
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
                    // invoiceItems={mockCreditMemoData.invoiceItems}
                    creditMemoData={mockCreditMemoData}
                    serviceCountries={mockServiceCountries}
                    currency={"USD"}
                    vatValue={10}
                    isLogsOpen={false}
                    changeLogs={changeLogs}
                    setIsLogsOpen={() => { }}
                    dataAvailable={false}
                    logsData={logsData}
                    viewLimit={10}
                    setInitial={() => { }}
                    setLimitFor={() => { }}
                    setChangeLogs={() => { }}
                    setDataAvailable={() => { }}
                    initail={0}
                    limitFor={10}
                ></CreditMemoSummary>
            </HashRouter>
        );
    })
    test("Render CM with status = 2", () => {
        mockCreditMemoData.status = 2;
        const { getByTestId, getByText } = render(
            <HashRouter>
                <CreditMemoSummary
                    notes={mockapidata.notes}
                    documents={mockapidata.resData.invoice.invoiceDocuments}
                    id={id}
                    cid={cid}
                    isClient={"true"}
                    setNotes={() => { }}
                    setDocuments={() => { }}
                    // invoiceItems={mockCreditMemoData.invoiceItems}
                    creditMemoData={mockCreditMemoData}
                    serviceCountries={mockServiceCountries}
                    currency={"USD"}
                    vatValue={10}
                    isLogsOpen={false}
                    changeLogs={changeLogs}
                    setIsLogsOpen={() => { }}
                    dataAvailable={false}
                    logsData={logsData}
                    viewLimit={10}
                    setInitial={() => { }}
                    setLimitFor={() => { }}
                    setChangeLogs={() => { }}
                    setDataAvailable={() => { }}
                    initail={0}
                    limitFor={10}
                ></CreditMemoSummary>
            </HashRouter>
        );
        var addButton = getByTestId("Invoice-Add-New-Summary")
        userEvent.click(addButton);

    })
    test("Render CM => delete a summary", () => {
        const { getByTestId } = render(
            <HashRouter>
                <CreditMemoSummary
                    notes={mockapidata.notes}
                    documents={mockapidata.resData.invoice.invoiceDocuments}
                    id={id}
                    cid={cid}
                    isClient={"true"}
                    setNotes={() => { }}
                    setDocuments={() => { }}
                    creditMemoData={mockCreditMemoData}
                    serviceCountries={mockServiceCountries}
                    currency={"USD"}
                    vatValue={10}
                    isLogsOpen={false}
                    changeLogs={changeLogs}
                    setIsLogsOpen={() => { }}
                    dataAvailable={false}
                    logsData={logsData}
                    viewLimit={10}
                    setInitial={() => { }}
                    setLimitFor={() => { }}
                    setChangeLogs={() => { }}
                    setDataAvailable={() => { }}
                    initail={0}
                    limitFor={10}
                ></CreditMemoSummary>
            </HashRouter>
        );
        var deleteButton = getByTestId("delete-summary-button")
        userEvent.click(deleteButton);

    })
    test("Render CM => edit a summary", () => {
        const { getByTestId } = render(
            <HashRouter>
                <CreditMemoSummary
                    notes={mockapidata.notes}
                    documents={mockapidata.resData.invoice.invoiceDocuments}
                    id={id}
                    cid={cid}
                    isClient={"true"}
                    setNotes={() => { }}
                    setDocuments={() => { }}
                    creditMemoData={mockCreditMemoData}
                    serviceCountries={mockServiceCountries}
                    currency={"USD"}
                    vatValue={10}
                    isLogsOpen={false}
                    changeLogs={changeLogs}
                    setIsLogsOpen={() => { }}
                    dataAvailable={false}
                    logsData={logsData}
                    viewLimit={10}
                    setInitial={() => { }}
                    setLimitFor={() => { }}
                    setChangeLogs={() => { }}
                    setDataAvailable={() => { }}
                    initail={0}
                    limitFor={10}
                ></CreditMemoSummary>
            </HashRouter>
        );
        var editButton = getByTestId("edit-summary-button")
        userEvent.click(editButton);
        var cancelEditButton = getByTestId("cancel-edit-summary-button")
        userEvent.click(cancelEditButton);
        userEvent.click(editButton);
    })
    test("Render CM => edit a summary", () => {
        const { getByTestId } = render(
            <HashRouter>
                <CreditMemoSummary
                    notes={mockapidata.notes}
                    documents={mockapidata.resData.invoice.invoiceDocuments}
                    id={id}
                    cid={cid}
                    isClient={"true"}
                    setNotes={() => { }}
                    setDocuments={() => { }}
                    creditMemoData={mockCreditMemoData}
                    serviceCountries={mockServiceCountries}
                    currency={"USD"}
                    vatValue={10}
                    isLogsOpen={false}
                    changeLogs={changeLogs}
                    setIsLogsOpen={() => { }}
                    dataAvailable={false}
                    logsData={logsData}
                    viewLimit={10}
                    setInitial={() => { }}
                    setLimitFor={() => { }}
                    setChangeLogs={() => { }}
                    setDataAvailable={() => { }}
                    initail={0}
                    limitFor={10}
                ></CreditMemoSummary>
            </HashRouter>
        );
        var editButton = getByTestId("edit-summary-button")
        userEvent.click(editButton);
        var saveEditButton = getByTestId("save-edit-summary-button");
        userEvent.click(saveEditButton);
    })
    test("Render CM => edit a summary", () => {
        const { getByTestId, getByText } = render(
            <HashRouter>
                <CreditMemoSummary
                    notes={mockapidata.notes}
                    documents={mockapidata.resData.invoice.invoiceDocuments}
                    id={id}
                    cid={cid}
                    isClient={"true"}
                    setNotes={() => { }}
                    setDocuments={() => { }}
                    creditMemoData={mockCreditMemoData}
                    serviceCountries={mockServiceCountries}
                    currency={"USD"}
                    vatValue={10}
                    isLogsOpen={false}
                    changeLogs={changeLogs}
                    setIsLogsOpen={() => { }}
                    dataAvailable={false}
                    logsData={logsData}
                    viewLimit={10}
                    setInitial={() => { }}
                    setLimitFor={() => { }}
                    setChangeLogs={() => { }}
                    setDataAvailable={() => { }}
                    initail={0}
                    limitFor={10}
                ></CreditMemoSummary>
            </HashRouter>
        );
        var editButton = getByTestId("edit-summary-button")
        userEvent.click(editButton);
        var productDD = getByText("Service Date");
        userEvent.click(productDD);
    })
    test("Product Service", () => {
        const { getByTestId, getByText } = render(
            <HashRouter>
                <CreditMemoSummary
                    notes={mockapidata.notes}
                    documents={mockapidata.resData.invoice.invoiceDocuments}
                    id={id}
                    cid={cid}
                    isClient={"true"}
                    setNotes={() => { }}
                    setDocuments={() => { }}
                    creditMemoData={mockCreditMemoData}
                    serviceCountries={mockServiceCountries}
                    currency={"USD"}
                    vatValue={10}
                    isLogsOpen={false}
                    changeLogs={changeLogs}
                    setIsLogsOpen={() => { }}
                    dataAvailable={false}
                    logsData={logsData}
                    viewLimit={10}
                    setInitial={() => { }}
                    setLimitFor={() => { }}
                    setChangeLogs={() => { }}
                    setDataAvailable={() => { }}
                    initail={0}
                    limitFor={10}
                ></CreditMemoSummary>
            </HashRouter>
        );
        var ProductService = getByText("Product Service");
        expect(ProductService).toBeInTheDocument();
    })
    test("Enter description", () => {
        const { getByPlaceholderText } = render(
            <HashRouter>
                <CreditMemoSummary
                    notes={mockapidata.notes}
                    documents={mockapidata.resData.invoice.invoiceDocuments}
                    id={id}
                    cid={cid}
                    isClient={"true"}
                    setNotes={() => { }}
                    setDocuments={() => { }}
                    creditMemoData={mockCreditMemoData}
                    serviceCountries={mockServiceCountries}
                    currency={"USD"}
                    vatValue={10}
                    isLogsOpen={false}
                    changeLogs={changeLogs}
                    setIsLogsOpen={() => { }}
                    dataAvailable={false}
                    logsData={logsData}
                    viewLimit={10}
                    setInitial={() => { }}
                    setLimitFor={() => { }}
                    setChangeLogs={() => { }}
                    setDataAvailable={() => { }}
                    initail={0}
                    limitFor={10}
                ></CreditMemoSummary>
            </HashRouter>
        );
        var description = getByPlaceholderText("Enter description");
        expect(description).toBeInTheDocument();
        fireEvent.change(description, { target: { value: "test" } });
    })
    test("Service Country", () => {
        const { getByTestId, getByText } = render(
            <HashRouter>
                <CreditMemoSummary
                    notes={mockapidata.notes}
                    documents={mockapidata.resData.invoice.invoiceDocuments}
                    id={id}
                    cid={cid}
                    isClient={"true"}
                    setNotes={() => { }}
                    setDocuments={() => { }}
                    creditMemoData={mockCreditMemoData}
                    serviceCountries={mockServiceCountries}
                    currency={"USD"}
                    vatValue={10}
                    isLogsOpen={false}
                    changeLogs={changeLogs}
                    setIsLogsOpen={() => { }}
                    dataAvailable={false}
                    logsData={logsData}
                    viewLimit={10}
                    setInitial={() => { }}
                    setLimitFor={() => { }}
                    setChangeLogs={() => { }}
                    setDataAvailable={() => { }}
                    initail={0}
                    limitFor={10}
                ></CreditMemoSummary>
            </HashRouter>
        );
        var ServiceService = getByText("Service Country");
        expect(ServiceService).toBeInTheDocument();
    })

    test("Render CM => edit a summary", () => {
        const { getByTestId, getByText } = render(
            <HashRouter>
                <CreditMemoSummary
                    notes={mockapidata.notes}
                    documents={mockapidata.resData.invoice.invoiceDocuments}
                    id={id}
                    cid={cid}
                    isClient={"true"}
                    setNotes={() => { }}
                    setDocuments={() => { }}
                    creditMemoData={mockCreditMemoData}
                    serviceCountries={mockServiceCountries}
                    currency={"USD"}
                    vatValue={10}
                    isLogsOpen={false}
                    changeLogs={changeLogs}
                    setIsLogsOpen={() => { }}
                    dataAvailable={false}
                    logsData={logsData}
                    viewLimit={10}
                    setInitial={() => { }}
                    setLimitFor={() => { }}
                    setChangeLogs={() => { }}
                    setDataAvailable={() => { }}
                    initail={0}
                    limitFor={10}
                ></CreditMemoSummary>
            </HashRouter>
        );
        var editButton = getByTestId("edit-summary-button")
        userEvent.click(editButton);
        var productDD = getByText("Service Date");
        userEvent.click(productDD);
        userEvent.click(productDD);
    })


    test("For logs", () => {
        const { getByTestId, getByText } = render(
            <HashRouter>
                <CreditMemoSummary
                    notes={mockapidata.notes}
                    documents={mockapidata.resData.invoice.invoiceDocuments}
                    id={id}
                    cid={cid}
                    isClient={"true"}
                    setNotes={() => { }}
                    setDocuments={() => { }}
                    creditMemoData={mockCreditMemoData}
                    serviceCountries={mockServiceCountries}
                    currency={"USD"}
                    vatValue={10}
                    isLogsOpen={false}
                    changeLogs={changeLogs}
                    setIsLogsOpen={() => { }}
                    dataAvailable={false}
                    logsData={logsData}
                    viewLimit={10}
                    setInitial={() => { }}
                    setLimitFor={() => { }}
                    setChangeLogs={() => { }}
                    setDataAvailable={() => { }}
                    initail={0}
                    limitFor={10}
                ></CreditMemoSummary>
            </HashRouter>
        );
        var logs = getByText("View Change Log");
        userEvent.click(logs);
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
                    notes={mockapidata.notes}
                    documents={mockapidata.resData.invoice.invoiceDocuments}
                    id={id}
                    cid={cid}
                    isClient={"true"}
                    setNotes={() => { }}
                    setDocuments={() => { }}
                    // invoiceItems={mockCreditMemoData.invoiceItems}
                    creditMemoData={mockCreditMemoData}
                    serviceCountries={[]}
                    currency={"USD"}
                    vatValue={10}
                    isLogsOpen={false}
                    changeLogs={changeLogs}
                    setIsLogsOpen={() => { }}
                    dataAvailable={false}
                    logsData={logsData}
                    viewLimit={10}
                    setInitial={() => { }}
                    setLimitFor={() => { }}
                    setChangeLogs={() => { }}
                    setDataAvailable={() => { }}
                    initail={0}
                    limitFor={10}
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
