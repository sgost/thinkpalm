
import Invoices from "..";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { HashRouter } from "react-router-dom";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import InvoiceListing from "..";
import { act } from "react-dom/test-utils";
import {
  urls,
  getClientListingUrl,
  getGenerateMultiplePdfUrl,
  getGenerateSinglePdfUrl,
  getInternalListingUrl,
} from "../../../../urls/urls";
import { currentOrgForListing, allCustomerapiMock } from "../../NewInvoice/test/mockData";

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
      status: 9,
      statusLabel: "Pending Approval",
      transactionType: 7,
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

let resDownloadSinlgeApiData = {
  id: "70961bfc-8d6e-44fc-88ad-61f9c86db9a3",
  url: "https://apnguatemeaservices.blob.core.windows.net/data/b07446a2-b99f-4e4e-b5c4-8b9cda5fd6e5.pdf?sv=2019-02-02&sr=b&sig=ufGKBaB%2F%2Beb61FEA%2BXwy3BeyXaLqxcR3RWniAH9cuq8%3D&se=2023-05-07T10%3A25%3A14Z&sp=rl",
  name: "Payroll-EMEA-70961bfc-8d6e-44fc-88ad-61f9c86db9a3.pdf",
  regionItemCode: "emea",
};

localStorage.setItem(
  "accessToken",
  'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIwdmRELXE3ekFYdkFxUzRfTDdoUExua2ZJbVVzaW1NWE1ZWGoxVUYwUUxVIn0.eyJleHAiOjE2NTYwNzM3ODIsImlhdCI6MTY1NjA3MTk4MiwiYXV0aF90aW1lIjowLCJqdGkiOiJmMTY0NTNhOS0zMTZlLTQ0YzAtYjgzNi1mNGM0ZmZlZWE4NmUiLCJpc3MiOiJodHRwczovL2FjY291bnRzLWRldi5hdGxhc2J5ZWxlbWVudHMuY29tL3JlYWxtcy9BdGxhcyIsImF1ZCI6IkFBQSBCcm9rZXIiLCJzdWIiOiI1MDRiYzQyZi1iNWE3LTQ4Y2EtYjVjYy0yMjEwZDAxOTI4N2EiLCJ0eXAiOiJJRCIsImF6cCI6IkFBQSBCcm9rZXIiLCJzZXNzaW9uX3N0YXRlIjoiMTE4YTg0OTEtNTUxYy00YmQzLWEyZWYtZTNkOTY5NzA3ZGI4IiwiYXRfaGFzaCI6ImdDYTVoZ1hsTkx4MUZOYjhBNVhWWEEiLCJhY3IiOiIxIiwic2lkIjoiMTE4YTg0OTEtNTUxYy00YmQzLWEyZWYtZTNkOTY5NzA3ZGI4IiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIkNyZWF0ZV9Mb2NrZXIiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdLCJQZXJtaXNzaW9ucyI6eyJhOWJiZWU2ZC03OTdhLTQ3MjQtYTg2YS01YjFhMmUyODc2M2YiOnsiTmFtZSI6IkRTTSBOdXRyaXRpb25hbCBQcm9kdWN0cyIsIlpvbmUiOiJFVSIsIlR5cGUiOiJTZXJ2aWNlX0NvbnN1bWVycyIsIlBheW1lbnRzIjp7IlJvbGUiOiJGaW5hbmNlQVIiLCJDcmVkaXRNZW1vSW52b2ljZUNyZWF0aW9uIjpbIlNhdmUiLCJFZGl0Il0sIlByb2Zvcm1hSW52b2ljZSI6WyJBZGQiLCJEZWxldGVJbnZvaWNlIiwiRGVsZXRlSXRlbSIsIlBheSIsIkVkaXQiLCJWaWV3IiwiU2VuZCIsIkJyb3dzZSIsIlJlamVjdCIsIkV4cG9ydCIsIkNsb3NlIiwiVm9pZCIsIkRvd25sb2FkIiwiUHVibGlzaCIsIkFwcHJvdmUiLCJEZWxldGVGaWxlIl0sIlByb2Zvcm1hSW52b2ljZUNyZWF0aW9uIjpbIlNhdmUiLCJFZGl0Il0sIkludm9pY2VEZXRhaWxzIjpbIkFkZCIsIkRlbGV0ZSIsIlBhaWQiLCJFZGl0IiwiVmlldyIsIlNlbmQiLCJCcm93c2UiLCJSZWplY3QiLCJTZWxlY3QiLCJFeHBvcnQiLCJDbG9zZSIsIlZvaWQiLCJEb3dubG9hZCIsIlB1Ymxpc2giLCJBcHByb3ZlIiwiRGVsZXRlRmlsZSJdLCJNaXNjZWxsYW5lb3VzSW52b2ljZUNyZWF0aW9uIjpbIlNhdmUiLCJFZGl0Il0sIkludm9pY2VMaXN0IjpbIkFkZCIsIkludGVybmFsVmlldyIsIkVkaXQiLCJEb3dubG9hZCIsIlZpZXciXSwiTWlzY2VsbGFuZW91c0ludm9pY2UiOlsiQWRkIiwiRGVsZXRlSW52b2ljZSIsIkRlbGV0ZUl0ZW0iLCJQYXkiLCJFZGl0IiwiVmlldyIsIlNlbmQiLCJCcm93c2UiLCJSZWplY3QiLCJFeHBvcnQiLCJDbG9zZSIsIlZvaWQiLCJEb3dubG9hZCIsIlB1Ymxpc2giLCJBcHByb3ZlIiwiRGVsZXRlRmlsZSJdLCJDcmVkaXRNZW1vSW52b2ljZSI6WyJBZGQiLCJEZWxldGVJbnZvaWNlIiwiRGVsZXRlSXRlbSIsIlBheSIsIkVkaXQiLCJWaWV3IiwiU2VuZCIsIkJyb3dzZSIsIlJlamVjdCIsIkV4cG9ydCIsIkNsb3NlIiwiVm9pZCIsIkRvd25sb2FkIiwiUHVibGlzaCIsIkFwcHJvdmUiLCJEZWxldGVGaWxlIl0sIk1hbnVhbFBheXJvbGxJbnZvaWNlQ3JlYXRpb24iOlsiU2F2ZSIsIkVkaXQiXX0sIkxQUEMiOnsiUm9sZSI6IkVsZW1lbnRzVXNlciIsIlBheXJvbGxMYW5kaW5nT3V0cHV0Rm9sZGVyUGF5c2xpcEFzc2lnbmF0aW9uIjpbIkFkZCIsIlZpZXciXSwiQ29uZmlndXJlQ2FsZW5kYXIiOlsiVmlldyJdLCJQYXlyb2xsTGFuZGluZ1Jvb3RPdXRwdXRGaWxlIjpbIkRlbGV0ZSIsIkRvd25sb2FkIiwiVmlldyJdLCJQYXlyb2xsQ29tcGVuc2F0aW9uIjpbIkFkZCIsIlNlbGVjdCIsIlN1Ym1pdCIsIkVkaXQiLCJEb3dubG9hZCIsIlZpZXciXSwiUGF5cm9sbExhbmRpbmdPdXRwdXRDcmVhdGVOZXdGb2xkZXIiOlsiQ3JlYXRlTmV3Rm9sZGVyIl0sIkNvbmZpZ3VyZUNhbGVuZGFyTWlsZXN0b25lU2VyaWVzIjpbIk1pbGVzdG9uZVNlcmllc0FkZCJdLCJQYXlyb2xsTGFuZGluZ0lucHV0Rm9sZGVyIjpbIkRlbGV0ZSIsIkRvd25sb2FkIiwiVmlldyIsIlJlbmFtZSJdLCJCaWdDYWxlbmRhck1pbGVzdG9uZVNlcmllcyI6WyJNaWxlc3RvbmVTZXJpZXNEZWxldGUiLCJNaWxlc3RvbmVTZXJpZXNFZGl0Il0sIlBheXJvbGxMYW5kaW5nT3V0cHV0Rm9sZGVyRmlsZSI6WyJVcGxvYWRGaWxlIiwiUGRmQ29udmVydCIsIlZpZXciLCJSZW5hbWVGaWxlIiwiRGVsZXRlRmlsZSIsIkRvd25sb2FkRmlsZXMiXSwiUGF5cm9sbExhbmRpbmdSb290SW5wdXRUYWIiOlsiVXBsb2FkRmlsZSIsIlVwbG9hZENvcmVIUiJdLCJQYXlyb2xsQXV0b21hdGVkRmlsZUNyZWF0aW9uIjpbIkZpbGVSZWdlbmVyYXRlIiwiRWRpdCIsIlZpZXciXSwiUGF5cm9sbExhbmRpbmdPdXRwdXRGb2xkZXJTcGxpdEZpbGUiOlsiU3BsaXRGaWxlIl0sIlBheXJvbGxMYW5kaW5nRm9sZGVyTmV3UGF5cm9sbEZpbGUiOlsiQWRkIiwiRmlsZVJlZ2VuZXJhdGUiLCJWaWV3Il0sIlBheXJvbGxMYW5kaW5nSW5wdXRUYWIiOlsiVmlldyJdLCJQYXlyb2xsTGFuZGluZ1ZpZXciOlsiVmlldyJdLCJQYXlyb2xsTGFuZGluZ1Jvb3RJbnB1dEZpbGUiOlsiRGVsZXRlIiwiRG93bmxvYWQiLCJWaWV3Il0sIkRhc2hib2FyZENvdW50cnlDYXJkcyI6WyJWaWV3Il0sIkJpZ0NhbGVuZGFyTWlsZXN0b25lIjpbIlZpZXciXSwiUGF5cm9sbExhbmRpbmdPdXRwdXRGb2xkZXIiOlsiRGVsZXRlIiwiRG93bmxvYWQiLCJWaWV3IiwiUmVuYW1lIl0sIkJpZ0NhbGVuZGFyQWN0aXZpdHkiOlsiVmlldyJdLCJCaWdDYWxlbmRhckFjdGl2aXR5U2VyaWVzIjpbIkFjdGl2aXR5U2VyaWVzRGVsZXRlIiwiQWN0aXZpdHlTZXJpZXNFZGl0Il0sIlBheXJvbGxMYW5kaW5nT3V0cHV0VGFiIjpbIlZpZXciXSwiUGF5cm9sbExhbmRpbmdSb290T3V0cHV0VGFiIjpbIlVwbG9hZEZpbGUiXSwiQmlnQ2FsZW5kYXJBY3Rpdml0eU9jY3VyZW5jZSI6WyJBY3Rpdml0eU9jY3VyZW5jZUVkaXQiLCJBY3Rpdml0eU9jY3VyZW5jZURlbGV0ZSJdLCJQYXlyb2xsTGFuZGluZ091dHB1dEZvbGRlclBheXNsaXBBc3NpZ25hdGlvblVwbG9hZCI6WyJVcGxvYWQiXSwiVGVzdCI6WyJBZGQiXSwiUGF5cm9sbExhbmRpbmdEb3dubG9hZEZpbGVzIjpbIkRvd25sb2FkRmlsZXMiXSwiQ29uZmlndXJlQ2FsZW5kYXJBY3Rpdml0eVNlcmllcyI6WyJBY3Rpdml0eVNlcmllc0FkZCJdLCJCaWdDYWxlbmRhciI6WyJWaWV3Il0sIlBheXJvbGxMYW5kaW5nIjpbIlVwbG9hZEZpbGUiLCJWaWV3IiwiRG93bmxvYWRGaWxlcyJdLCJQYXlyb2xsTGFuZGluZ0lucHV0Rm9sZGVyRmlsZSI6WyJEZWxldGUiLCJVcGxvYWRDb3JlSFIiLCJVcGxvYWQiLCJEb3dubG9hZCIsIlZpZXciXSwiUGF5cm9sbExhbmRpbmdGb2xkZXIiOlsiRGVsZXRlIiwiVXBsb2FkRmlsZSIsIk5ld1BheXJvbGxGaWxlIiwiTmV3UGF5cm9sbEFkZCIsIlZpZXciLCJSZW5hbWUiXSwiUGF5cm9sbEhpc3RvcnlQYXlyb2xsRm9sZGVyTGlzdCI6WyJWaWV3Il0sIkNvbmZpZ3VyZUNhbGVuZGFyQWN0aXZpdHlPY2N1cmVuY2UiOlsiQWN0aXZpdHlPY2N1cmVuY2VBZGQiXSwiQ29uZmlndXJlQ2FsZW5kYXJNaWxlc3RvbmVPY2N1cmVuY2UiOlsiTWlsZXN0b25lT2NjdXJlbmNlQWRkIl0sIlBheXJvbGxIaXN0b3J5TWluaUNhbGVuZGFyIjpbIlZpZXciXSwiQmlnQ2FsZW5kYXJNaWxlc3RvbmVPY3VycmVuY2UiOlsiTWlsZXN0b25lT2N1cnJlbmNlRWRpdCIsIk1pbGVzdG9uZU9jdXJyZW5jZURlbGV0ZSJdLCJQYXlyb2xsTGFuZGluZ0lucHV0Q3JlYXRlTmV3Rm9sZGVyIjpbIkNyZWF0ZU5ld0ZvbGRlciJdfSwiQ29yZUhSIjp7IlJvbGUiOiJJbnRlcm5hbEhSIiwiUG9zdE9uYm9hcmRpbmdCYW5rRGV0YWlsIjpbIkFkZCIsIkVkaXQiLCJWaWV3Il0sIkludGVybmFsSFJMaXN0aW5nUGFnZSI6WyJEb3dubG9hZCIsIlZpZXciXSwiQmVuZWZpdHNjb25maWd1cmF0b3IiOlsiQWRkIiwiRGVsZXRlIiwiRWRpdCIsIlZpZXciXSwiVGltZU9mZiI6WyJDdXN0b21pemUiLCJBcHByb3ZlRGVjbGluZSIsIlZpZXciXSwiUG9zdE9uYm9hcmRpbmdCZW5lZml0cyI6WyJBZGQiLCJFZGl0IiwiVmlldyJdLCJEb2N1bWVudHMiOlsiRGVsZXRlIiwiVXBsb2FkIiwiUHJldmlldyIsIkRvd25sb2FkIl0sIkpvYkRldGFpbHMiOlsiQWRkIiwiRWRpdCIsIlZpZXciXSwiQmVuZWZpdHMiOlsiVmlldyJdLCJQb3N0T25ib2FyZGluZ0VtZXJnZW5jeSI6WyJWaWV3Il0sIkJhbmtEZXRhaWwiOlsiVmlldyJdLCJFbXBsb3llZVByb2ZpbGUiOlsiQ2hhbmdlU3RhdHVzIiwiQWRkRW1wbG95ZWUiXSwiUG9zdE9uYm9hcmRpbmdFbXBsb3llZVByb2ZpbGUiOlsiQ2hhbmdlU3RhdHVzIl0sIlBvc3RPbmJvYXJkaW5nUHJvZmlsZSI6WyJGdWxsRWRpdCIsIlZpZXciXSwiQ29tcGVuc2F0aW9uIjpbIkFkZCIsIlNlbGVjdCIsIlN1Ym1pdCIsIkVkaXQiLCJEb3dubG9hZCIsIlZpZXciXSwiRW1lcmdlbmN5IjpbIlZpZXciXSwiUHJvZmlsZSI6WyJGdWxsRWRpdCIsIlZpZXciXSwiUG9zdE9uYm9hcmRpbmdKb2JEZXRhaWxzIjpbIkFkZCIsIkVkaXQiLCJWaWV3Il0sIlBvc3RPbmJvYXJkaW5nRG9jdW1lbnRzIjpbIkRlbGV0ZSIsIlVwbG9hZCIsIlByZXZpZXciLCJEb3dubG9hZCJdfSwiQ29udHJhY3RvclBheSI6eyJSb2xlIjoiRWxlbWVudHNHZW5lcmFsIiwiQ29udHJhY3REb2N1bWVudHMiOlsiR2VuZXJhbERvd25sb2FkIl0sIkpvYiI6WyJHZW5lcmFsVmlldyJdLCJQcm9maWxlIjpbIkVsZW1lbnRzR2VuZXJhbFZpZXciLCJDdXN0b21lckxpc3QiXSwiQmlsbCI6WyJFbGVtZW50c0dlbmVyYWxMaXN0Il19fX0sIkdyb3VwIE1lbWJlcnNoaXBzIjpbIi9TdWJzY3JpcHRpb25zL0NvbnRyYWN0b3JQYXkiLCIvU3Vic2NyaXB0aW9ucy9Db3JlSFIiLCIvUm9sZXMvQ29udHJhY3RvclBheS9FbGVtZW50c0dlbmVyYWwiLCIvWm9uZXMvRVUvT3JnYW5pemF0aW9ucy9TZXJ2aWNlX0NvbnN1bWVycy9EU00gTnV0cml0aW9uYWwgUHJvZHVjdHMvQ29udHJhY3RvclBheS9FbGVtZW50c0dlbmVyYWwiLCIvUm9sZXMvTFBQQy9FbGVtZW50c1VzZXIiLCIvWm9uZXMvRVUvT3JnYW5pemF0aW9ucy9TZXJ2aWNlX0NvbnN1bWVycy9EU00gTnV0cml0aW9uYWwgUHJvZHVjdHMvTFBQQy9FbGVtZW50c1VzZXIiLCIvUm9sZXMvUGF5bWVudHMvRmluYW5jZUFSIiwiL1pvbmVzL0VVL09yZ2FuaXphdGlvbnMvU2VydmljZV9Db25zdW1lcnMvRFNNIE51dHJpdGlvbmFsIFByb2R1Y3RzL1BheW1lbnRzL0ZpbmFuY2VBUiIsIi9Sb2xlcy9Db3JlSFIvSW50ZXJuYWxIUiIsIi9ab25lcy9FVS9Pcmdhbml6YXRpb25zL1NlcnZpY2VfQ29uc3VtZXJzL0RTTSBOdXRyaXRpb25hbCBQcm9kdWN0cy9Db3JlSFIvSW50ZXJuYWxIUiIsIi9TdWJzY3JpcHRpb25zL0xQUEMiLCIvU3Vic2NyaXB0aW9ucy9QYXltZW50cyJdLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJkc21udXRyaXRpb25hbHByb2R1Y3RzZWxlbWVudHN1c2VyQHByb3Rvbm1haWwuY29tIiwiZW1haWwiOiJkc21udXRyaXRpb25hbHByb2R1Y3RzZWxlbWVudHN1c2VyQHByb3Rvbm1haWwuY29tIn0.Dgub6MCBUY1eHyYUUDqlMaTXI--Gt63G7Gq-PmJAV8gv52KgPzmcO88_NNIUHmn2nEfwPj_7q4rx67n9xW63ghaD2Ir3wH2i70Tl88rMGshE8Ae6G0JuUYa1Ufpn3u8UAXWx7MDRbqbA6uhnoJKniaVl7BfdGfPsrGfdXv9y69oi31zChg7MX5FvZ7IPSfzPy_xoRdIhePvjVaJGdot-ipOdHNEJdcu2LqDrdS51j3CANcQksvEryuBtJtxUTTHMpExRbduSNmhyl2NPnwSQR6919-9ccRfKaTAmz9dxETu5ftfVxHE1K6KmxbJ-1kc8HQaPf0etlP_VkMaOWtVPxA'
  );
localStorage.setItem("current-org-id", "a9bbee6d-797a-4724-a86a-5b1a2e28763f");


let accessToken = localStorage.getItem("accessToken");

describe("client view", () => {
  localStorage.setItem("current-org", JSON.stringify(currentOrgForListing));
  beforeEach(() => {
    const mock = new MockAdapter(axios);
  //  mock.onGet(getClientListingUrl("", "", "", "")).reply(200, resDataClient);
    mock.onGet(urls.customers, accessToken).reply(200, allCustomerapiMock);

    act(() => {
      render(
        <HashRouter>
          <InvoiceListing />
        </HashRouter>
      );
    });
  });

  test("Datepicker dropdowns clickoutside clickable", async () => {
    const dd = await waitFor(() => screen.getAllByText(/Please Select/));
    fireEvent.click(dd[0]);
    fireEvent.click(dd[2]);
  });
  test("Datepicker dropdowns today clickable", async () => {
    const dd = await waitFor(() => screen.getAllByText(/Please Select/));
    fireEvent.click(dd[0]);
    fireEvent.click(dd[1]);
    fireEvent.click(dd[2]);

    const today = await waitFor(() => screen.getByText(/Today/), {
      timeout: 5000,
    });
    fireEvent.click(today);
    fireEvent.click(dd[1]);
  });

  test("Datepicker dropdowns Yesterday clickable", async () => {
    const dd = await waitFor(() => screen.getAllByText(/Please Select/));
    fireEvent.click(dd[0]);
    fireEvent.click(dd[1]);
    fireEvent.click(dd[2]);

    const today = await waitFor(() => screen.getByText(/Yesterday/), {
      timeout: 5000,
    });
    fireEvent.click(today);
  });

  test("Datepicker dropdowns This Week clickable", async () => {
    const dd = await waitFor(() => screen.getAllByText(/Please Select/));
    fireEvent.click(dd[0]);
    fireEvent.click(dd[1]);
    fireEvent.click(dd[2]);

    const today = await waitFor(() => screen.getByText(/This Week/), {
      timeout: 5000,
    });
    fireEvent.click(today);
  });

  test("Datepicker dropdowns This Month clickable", async () => {
    const dd = await waitFor(() => screen.getAllByText(/Please Select/));
    fireEvent.click(dd[0]);
    fireEvent.click(dd[1]);
    fireEvent.click(dd[2]);

    const today = await waitFor(() => screen.getByText(/This Month/), {
      timeout: 5000,
    });
    fireEvent.click(today);
  });

  test("Datepicker dropdowns Last Month clickable", async () => {
    const dd = await waitFor(() => screen.getAllByText(/Please Select/));
    fireEvent.click(dd[0]);
    fireEvent.click(dd[1]);
    fireEvent.click(dd[2]);

    const today = await waitFor(() => screen.getByText(/Last Month/), {
      timeout: 5000,
    });
    fireEvent.click(today);
  });

  test("Datepicker dropdowns This Quarter clickable", async () => {
    const dd = await waitFor(() => screen.getAllByText(/Please Select/));
    fireEvent.click(dd[0]);
    fireEvent.click(dd[1]);
    fireEvent.click(dd[2]);

    const today = await waitFor(() => screen.getByText(/This Quarter/), {
      timeout: 5000,
    });
    fireEvent.click(today);
  });

  test("Datepicker dropdowns This Year clickable", async () => {
    const dd = await waitFor(() => screen.getAllByText(/Please Select/));
    fireEvent.click(dd[0]);
    fireEvent.click(dd[1]);
    fireEvent.click(dd[2]);

    const today = await waitFor(() => screen.getByText(/This Year/), {
      timeout: 5000,
    });
    fireEvent.click(today);
  });

  test("Datepicker dropdowns Last Year clickable", async () => {
    const dd = await waitFor(() => screen.getAllByText(/Please Select/));
    fireEvent.click(dd[0]);
    fireEvent.click(dd[1]);
    fireEvent.click(dd[2]);

    const today = await waitFor(() => screen.getByText(/Last Year/), {
      timeout: 5000,
    });
    fireEvent.click(today);
  });

  // test("Datepicker dropdowns date range clickable", async () => {
  //   const dd = await waitFor(() => screen.getAllByText(/Please Select/));
  //   fireEvent.click(dd[0]);

  //   let dr = await screen.getAllByPlaceholderText(/Please Select/)

  //   screen.debug(x);
  //   fireEvent.click(dr[0]);
  //   let date = await waitFor(() => screen.getAllByText(/15/));
  //   screen.debug(date);
  //   fireEvent.click(date[2]);
  //   fireEvent.click(dr[1]);
  //   let date2 = await waitFor(() => screen.getAllByText(/15/));
  //   fireEvent.click(date2[2]);
  // });

  test("table row clickable", async () => {
    //const row = await waitFor(() => screen.getByText("1000992"));
    //fireEvent.click(row);
  });

  test("Customer Type clickable", async () => {
    const customerType = await screen.getByText(/Customer/);
    fireEvent.click(customerType);
  });

  test("Status clickable", async () => {
    const status = await waitFor(() => screen.getByText(/Status/));
    fireEvent.click(status);
    const open = await waitFor(() => screen.getByText(/Open/));
    fireEvent.click(open);
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

  // test("search", async () => {
  //   // const search = await waitFor(() => screen.getByPlaceholderText(/Search/));
  //   // fireEvent.change(search, { target: { value: "100" } });
  //   // fireEvent.change(search, { target: { value: "" } });
  // });

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
  localStorage.setItem("current-org", JSON.stringify(currentOrgForListing));
  test("checkbox and download are clickable in client view", async () => {
    //const mock = new MockAdapter(axios);
    //mock.onGet(getClientListingUrl("", "", "", "")).reply(200, resDataClient);
    // const getById = queryByAttribute.bind(null, "id");

    const { container } = render(
      <HashRouter>
        <Invoices />
      </HashRouter>
    );

    await waitFor(() => screen.getByText(/Status/));

    const chkbx = container.querySelector(
      ".a-dropdown__option__item__check-box"
    );
    // const chkbx = container.querySelector(".table__row__default");
    fireEvent.click(chkbx);

    const download = await waitFor(() => container.querySelector(".download"));
    screen.logTestingPlaygroundURL();
    fireEvent.click(download);

    fireEvent.click(chkbx);

    const singlechkbx = container.querySelectorAll(
      ".a-dropdown__option__item__check-box"
    );

    fireEvent.click(singlechkbx[1]);
    fireEvent.click(download);
  });
  test("checkbox and download are clickable in internal view", async () => {
    const mock = new MockAdapter(axios);
    //mock
     // .onGet(getInternalListingUrl("", "", "", "", ""))
     // .reply(200, resDataInternal);
    // const getById = queryByAttribute.bind(null, "id");

    const { container } = render(
      <HashRouter>
        <Invoices />
      </HashRouter>
    );

    await waitFor(() => screen.getByText(/Status/));

    const chkbx = container.querySelector(
      ".a-dropdown__option__item__check-box"
    );
    fireEvent.click(chkbx);

    const download = await waitFor(() => container.querySelector(".download"));
    fireEvent.click(download);

    fireEvent.click(chkbx);

    const singlechkbx = container.querySelectorAll(
      ".a-dropdown__option__item__check-box"
    );

    fireEvent.click(singlechkbx[1]);
  });
  test("checkbox and download are clickable in client view and searched view", async () => {
    const mock = new MockAdapter(axios);
   // mock.onGet(getClientListingUrl("", "", "", "")).reply(200, resDataClient);
    // const getById = queryByAttribute.bind(null, "id");

    const { container, getByTestId } = render(
      <HashRouter>
        <Invoices />
      </HashRouter>
    );

    await waitFor(() => screen.getByText(/Status/));

    // const search = await waitFor(() => screen.getByPlaceholderText(/Search/));
    // fireEvent.change(search, { target: { value: "100" } });

    const chkbx = container.querySelector(
      ".a-dropdown__option__item__check-box"
    );
    fireEvent.click(chkbx);

    const download = await waitFor(() => container.querySelector(".download"));
    fireEvent.click(download);
    //fireEvent.click(getByTestId("invoice-list-cell-1"));
    //fireEvent.click(getByTestId("confirm-modal-button"));

    fireEvent.click(chkbx);

  /*  const singlechkbx = container.querySelectorAll(
      ".a-dropdown__option__item__check-box"
    );

    fireEvent.click(singlechkbx[1]);*/
  });
});

describe("Internal View Download click and checkbox Click", () => {
  test("table row clickable", async () => {
    currentOrgForListing.Payments.Role = "Internal";
    localStorage.setItem("current-org", JSON.stringify(currentOrgForListing));
    const mock = new MockAdapter(axios);
   /* mock
      .onGet(getInternalListingUrl("", "", "", "", ""))
      .reply(200, resDataInternal);

    mock
      .onGet(getGenerateSinglePdfUrl("70961bfc-8d6e-44fc-88ad-61f9c86db9a3"))
      .reply(200, resDownloadSinlgeApiData);

    mock.onPost(getGenerateMultiplePdfUrl()).reply(200, {
      id: "00000000-0000-0000-0000-000000000000",
      url: "https://apnguatemeaservices.blob.core.windows.net/data/7d8a73de-aa5d-4ef7-a6b2-d0784b068a21.zip?sv=2019-02-02&sr=b&sig=HSBga2dlkl5SwD%2B28xiMtq682MhzYBB94wbFWvoFKvM%3D&se=2023-05-07T10%3A34%3A38Z&sp=rl",
      name: "Invoices.zip",
      regionItemCode: "emea",
    });*/

    const { container } = render(
      <HashRouter>
        <InvoiceListing />
      </HashRouter>
    );

    //const row = await screen.findByText("100329");
    //expect(row).toBeInTheDocument();
    //const labelText = await screen.findAllByLabelText("");
    //fireEvent.click(labelText[0]);

    const download = await waitFor(() => container.querySelector(".download"));
    fireEvent.click(download);

   // const toast = await screen.findByText(/Downloaded.../);
    //expect(toast).toBeInTheDocument();

    const toastRemoveButton = await screen.findByTestId("remove-button-toast");
    expect(toastRemoveButton).toBeInTheDocument();

    fireEvent.click(toastRemoveButton);

   // fireEvent.click(labelText[0]);

   // fireEvent.click(labelText[1]);

    const downloadsingle = await waitFor(() =>
      container.querySelector(".download")
    );
    fireEvent.click(downloadsingle);
  });
});

/*describe("Internal View Download click for single invoice  api fail Click", () => {
  test("table row clickable", async () => {
    currentOrgForListing.Payments.Role = "Internal";
    localStorage.setItem("current-org", JSON.stringify(currentOrgForListing));
    const mock = new MockAdapter(axios);
    mock
      .onGet(getInternalListingUrl("", "", "", "", ""))
      .reply(200, resDataInternal);

    mock
      .onGet(getGenerateSinglePdfUrl("70961bfc-8d6e-44fc-88ad-61f9c86db9a3"))
      .reply(400, resDownloadSinlgeApiData);

    mock.onPost(getGenerateMultiplePdfUrl()).reply(200, {
      id: "00000000-0000-0000-0000-000000000000",
      url: "https://apnguatemeaservices.blob.core.windows.net/data/7d8a73de-aa5d-4ef7-a6b2-d0784b068a21.zip?sv=2019-02-02&sr=b&sig=HSBga2dlkl5SwD%2B28xiMtq682MhzYBB94wbFWvoFKvM%3D&se=2023-05-07T10%3A34%3A38Z&sp=rl",
      name: "Invoices.zip",
      regionItemCode: "emea",
    });

    const { container } = render(
      <HashRouter>
        <InvoiceListing />
      </HashRouter>
    );

    //const row = await screen.findByText("100329");
    //expect(row).toBeInTheDocument();
    const labelText = await screen.findAllByLabelText("");
    fireEvent.click(labelText[0]);

    const download = await waitFor(() => container.querySelector(".download"));
    fireEvent.click(download);

    const toast = await screen.findByText("Downloaded...");
    expect(toast).toBeInTheDocument();

    const toastRemoveButton = await screen.findByTestId("remove-button-toast");
    expect(toastRemoveButton).toBeInTheDocument();

    fireEvent.click(toastRemoveButton);

    fireEvent.click(labelText[0]);

    fireEvent.click(labelText[1]);

    const downloadsingle = await waitFor(() =>
      container.querySelector(".download")
    );
    fireEvent.click(downloadsingle);
  });
}); */
