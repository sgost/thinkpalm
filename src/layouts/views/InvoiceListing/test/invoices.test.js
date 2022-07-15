import Invoices from "..";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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
import {
  currentOrgForListing,
  allCustomerapiMock,
} from "../../NewInvoice/test/mockData";
import { mockapidata } from "../../InvoiceDetails/test/mockdata";
import { resDataInternal, resDownloadSinlgeApiData } from "./mockData";



localStorage.setItem(
  "accessToken",
  "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIwdmRELXE3ekFYdkFxUzRfTDdoUExua2ZJbVVzaW1NWE1ZWGoxVUYwUUxVIn0.eyJleHAiOjE2NTY0MzA3MDIsImlhdCI6MTY1NjQyODkwMiwiYXV0aF90aW1lIjowLCJqdGkiOiJiMzc0ZGZmNC0yODEwLTQ0YWQtYjYzYy1iY2Y4NDU1ZjdlZTkiLCJpc3MiOiJodHRwczovL2FjY291bnRzLWRldi5hdGxhc2J5ZWxlbWVudHMuY29tL3JlYWxtcy9BdGxhcyIsImF1ZCI6IkFBQSBCcm9rZXIiLCJzdWIiOiI1MDRiYzQyZi1iNWE3LTQ4Y2EtYjVjYy0yMjEwZDAxOTI4N2EiLCJ0eXAiOiJJRCIsImF6cCI6IkFBQSBCcm9rZXIiLCJzZXNzaW9uX3N0YXRlIjoiMzRlMzdkYWMtMWI2MC00OTE1LWE0YmQtMDI2MWI4MDVlODc1IiwiYXRfaGFzaCI6ImNia0o4UjhENjV0NnpybFpod014d1EiLCJhY3IiOiIxIiwic2lkIjoiMzRlMzdkYWMtMWI2MC00OTE1LWE0YmQtMDI2MWI4MDVlODc1IiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIkNyZWF0ZV9Mb2NrZXIiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdLCJQZXJtaXNzaW9ucyI6eyJhOWJiZWU2ZC03OTdhLTQ3MjQtYTg2YS01YjFhMmUyODc2M2YiOnsiTmFtZSI6IkRTTSBOdXRyaXRpb25hbCBQcm9kdWN0cyIsIlpvbmUiOiJFVSIsIlR5cGUiOiJTZXJ2aWNlX0NvbnN1bWVycyIsIlBheW1lbnRzIjp7IlJvbGUiOiJGaW5hbmNlQVIiLCJDcmVkaXRNZW1vSW52b2ljZUNyZWF0aW9uIjpbIlNhdmUiLCJFZGl0Il0sIlByb2Zvcm1hSW52b2ljZSI6WyJBZGQiLCJEZWxldGVJbnZvaWNlIiwiRGVsZXRlSXRlbSIsIlBheSIsIkVkaXQiLCJWaWV3IiwiQWRkUGF5bWVudCIsIlNlbmQiLCJCcm93c2UiLCJSZWplY3QiLCJFeHBvcnQiLCJDbG9zZSIsIlZvaWQiLCJEb3dubG9hZCIsIlB1Ymxpc2giLCJBcHByb3ZlIiwiRGVsZXRlRmlsZSJdLCJQcm9mb3JtYUludm9pY2VDcmVhdGlvbiI6WyJTYXZlIiwiRWRpdCJdLCJJbnZvaWNlRGV0YWlscyI6WyJBZGQiLCJEZWxldGUiLCJQYWlkIiwiRWRpdCIsIlZpZXciLCJBZGRQYXltZW50IiwiU2VuZCIsIkJyb3dzZSIsIlJlamVjdCIsIlNlbGVjdCIsIkV4cG9ydCIsIkNsb3NlIiwiVm9pZCIsIkRvd25sb2FkIiwiUHVibGlzaCIsIkFwcHJvdmUiLCJEZWxldGVGaWxlIl0sIk1pc2NlbGxhbmVvdXNJbnZvaWNlQ3JlYXRpb24iOlsiU2F2ZSIsIkVkaXQiXSwiSW52b2ljZUxpc3QiOlsiQWRkIiwiSW50ZXJuYWxWaWV3IiwiRWRpdCIsIkRvd25sb2FkIiwiVmlldyIsIkFkZFBheW1lbnQiXSwiTWlzY2VsbGFuZW91c0ludm9pY2UiOlsiQWRkIiwiRGVsZXRlSW52b2ljZSIsIkRlbGV0ZUl0ZW0iLCJQYXkiLCJFZGl0IiwiVmlldyIsIkFkZFBheW1lbnQiLCJTZW5kIiwiQnJvd3NlIiwiUmVqZWN0IiwiRXhwb3J0IiwiQ2xvc2UiLCJWb2lkIiwiRG93bmxvYWQiLCJQdWJsaXNoIiwiQXBwcm92ZSIsIkRlbGV0ZUZpbGUiXSwiQ3JlZGl0TWVtb0ludm9pY2UiOlsiQWRkIiwiRGVsZXRlSW52b2ljZSIsIkRlbGV0ZUl0ZW0iLCJQYXkiLCJFZGl0IiwiVmlldyIsIkFkZFBheW1lbnQiLCJTZW5kIiwiQnJvd3NlIiwiUmVqZWN0IiwiRXhwb3J0IiwiQ2xvc2UiLCJWb2lkIiwiRG93bmxvYWQiLCJQdWJsaXNoIiwiQXBwcm92ZSIsIkRlbGV0ZUZpbGUiXSwiTWFudWFsUGF5cm9sbEludm9pY2VDcmVhdGlvbiI6WyJTYXZlIiwiRWRpdCJdfSwiTFBQQyI6eyJSb2xlIjoiRWxlbWVudHNVc2VyIiwiUGF5cm9sbExhbmRpbmdPdXRwdXRGb2xkZXJQYXlzbGlwQXNzaWduYXRpb24iOlsiQWRkIiwiVmlldyJdLCJDb25maWd1cmVDYWxlbmRhciI6WyJWaWV3Il0sIlBheXJvbGxMYW5kaW5nUm9vdE91dHB1dEZpbGUiOlsiRGVsZXRlIiwiRG93bmxvYWQiLCJWaWV3Il0sIlBheXJvbGxDb21wZW5zYXRpb24iOlsiQWRkIiwiU2VsZWN0IiwiU3VibWl0IiwiRWRpdCIsIkRvd25sb2FkIiwiVmlldyJdLCJQYXlyb2xsTGFuZGluZ091dHB1dENyZWF0ZU5ld0ZvbGRlciI6WyJDcmVhdGVOZXdGb2xkZXIiXSwiQ29uZmlndXJlQ2FsZW5kYXJNaWxlc3RvbmVTZXJpZXMiOlsiTWlsZXN0b25lU2VyaWVzQWRkIl0sIlBheXJvbGxMYW5kaW5nSW5wdXRGb2xkZXIiOlsiRGVsZXRlIiwiRG93bmxvYWQiLCJWaWV3IiwiUmVuYW1lIl0sIkJpZ0NhbGVuZGFyTWlsZXN0b25lU2VyaWVzIjpbIk1pbGVzdG9uZVNlcmllc0RlbGV0ZSIsIk1pbGVzdG9uZVNlcmllc0VkaXQiXSwiUGF5cm9sbExhbmRpbmdPdXRwdXRGb2xkZXJGaWxlIjpbIlVwbG9hZEZpbGUiLCJQZGZDb252ZXJ0IiwiVmlldyIsIlJlbmFtZUZpbGUiLCJEZWxldGVGaWxlIiwiRG93bmxvYWRGaWxlcyJdLCJQYXlyb2xsTGFuZGluZ1Jvb3RJbnB1dFRhYiI6WyJVcGxvYWRGaWxlIiwiVXBsb2FkQ29yZUhSIl0sIlBheXJvbGxBdXRvbWF0ZWRGaWxlQ3JlYXRpb24iOlsiRmlsZVJlZ2VuZXJhdGUiLCJFZGl0IiwiVmlldyJdLCJQYXlyb2xsTGFuZGluZ091dHB1dEZvbGRlclNwbGl0RmlsZSI6WyJTcGxpdEZpbGUiXSwiUGF5cm9sbExhbmRpbmdGb2xkZXJOZXdQYXlyb2xsRmlsZSI6WyJBZGQiLCJGaWxlUmVnZW5lcmF0ZSIsIlZpZXciXSwiUGF5cm9sbExhbmRpbmdJbnB1dFRhYiI6WyJWaWV3Il0sIlBheXJvbGxMYW5kaW5nVmlldyI6WyJWaWV3Il0sIlBheXJvbGxMYW5kaW5nUm9vdElucHV0RmlsZSI6WyJEZWxldGUiLCJEb3dubG9hZCIsIlZpZXciXSwiRGFzaGJvYXJkQ291bnRyeUNhcmRzIjpbIlZpZXciXSwiQmlnQ2FsZW5kYXJNaWxlc3RvbmUiOlsiVmlldyJdLCJQYXlyb2xsTGFuZGluZ091dHB1dEZvbGRlciI6WyJEZWxldGUiLCJEb3dubG9hZCIsIlZpZXciLCJSZW5hbWUiXSwiQmlnQ2FsZW5kYXJBY3Rpdml0eSI6WyJWaWV3Il0sIkJpZ0NhbGVuZGFyQWN0aXZpdHlTZXJpZXMiOlsiQWN0aXZpdHlTZXJpZXNEZWxldGUiLCJBY3Rpdml0eVNlcmllc0VkaXQiXSwiUGF5cm9sbExhbmRpbmdPdXRwdXRUYWIiOlsiVmlldyJdLCJQYXlyb2xsTGFuZGluZ1Jvb3RPdXRwdXRUYWIiOlsiVXBsb2FkRmlsZSJdLCJCaWdDYWxlbmRhckFjdGl2aXR5T2NjdXJlbmNlIjpbIkFjdGl2aXR5T2NjdXJlbmNlRWRpdCIsIkFjdGl2aXR5T2NjdXJlbmNlRGVsZXRlIl0sIlBheXJvbGxMYW5kaW5nT3V0cHV0Rm9sZGVyUGF5c2xpcEFzc2lnbmF0aW9uVXBsb2FkIjpbIlVwbG9hZCJdLCJUZXN0IjpbIkFkZCJdLCJQYXlyb2xsTGFuZGluZ0Rvd25sb2FkRmlsZXMiOlsiRG93bmxvYWRGaWxlcyJdLCJDb25maWd1cmVDYWxlbmRhckFjdGl2aXR5U2VyaWVzIjpbIkFjdGl2aXR5U2VyaWVzQWRkIl0sIkJpZ0NhbGVuZGFyIjpbIlZpZXciXSwiUGF5cm9sbExhbmRpbmciOlsiVXBsb2FkRmlsZSIsIlZpZXciLCJEb3dubG9hZEZpbGVzIl0sIlBheXJvbGxMYW5kaW5nSW5wdXRGb2xkZXJGaWxlIjpbIkRlbGV0ZSIsIlVwbG9hZENvcmVIUiIsIlVwbG9hZCIsIkRvd25sb2FkIiwiVmlldyJdLCJQYXlyb2xsTGFuZGluZ0ZvbGRlciI6WyJEZWxldGUiLCJVcGxvYWRGaWxlIiwiTmV3UGF5cm9sbEZpbGUiLCJOZXdQYXlyb2xsQWRkIiwiVmlldyIsIlJlbmFtZSJdLCJQYXlyb2xsSGlzdG9yeVBheXJvbGxGb2xkZXJMaXN0IjpbIlZpZXciXSwiQ29uZmlndXJlQ2FsZW5kYXJBY3Rpdml0eU9jY3VyZW5jZSI6WyJBY3Rpdml0eU9jY3VyZW5jZUFkZCJdLCJDb25maWd1cmVDYWxlbmRhck1pbGVzdG9uZU9jY3VyZW5jZSI6WyJNaWxlc3RvbmVPY2N1cmVuY2VBZGQiXSwiUGF5cm9sbEhpc3RvcnlNaW5pQ2FsZW5kYXIiOlsiVmlldyJdLCJCaWdDYWxlbmRhck1pbGVzdG9uZU9jdXJyZW5jZSI6WyJNaWxlc3RvbmVPY3VycmVuY2VFZGl0IiwiTWlsZXN0b25lT2N1cnJlbmNlRGVsZXRlIl0sIlBheXJvbGxMYW5kaW5nSW5wdXRDcmVhdGVOZXdGb2xkZXIiOlsiQ3JlYXRlTmV3Rm9sZGVyIl19LCJDb3JlSFIiOnsiUm9sZSI6IkludGVybmFsSFIiLCJQb3N0T25ib2FyZGluZ0JhbmtEZXRhaWwiOlsiQWRkIiwiRWRpdCIsIlZpZXciXSwiSW50ZXJuYWxIUkxpc3RpbmdQYWdlIjpbIkRvd25sb2FkIiwiVmlldyJdLCJCZW5lZml0c2NvbmZpZ3VyYXRvciI6WyJBZGQiLCJEZWxldGUiLCJFZGl0IiwiVmlldyJdLCJUaW1lT2ZmIjpbIkN1c3RvbWl6ZSIsIkFwcHJvdmVEZWNsaW5lIiwiVmlldyJdLCJQb3N0T25ib2FyZGluZ0JlbmVmaXRzIjpbIkFkZCIsIkVkaXQiLCJWaWV3Il0sIkRvY3VtZW50cyI6WyJEZWxldGUiLCJVcGxvYWQiLCJQcmV2aWV3IiwiRG93bmxvYWQiXSwiSm9iRGV0YWlscyI6WyJBZGQiLCJFZGl0IiwiVmlldyJdLCJCZW5lZml0cyI6WyJWaWV3Il0sIlBvc3RPbmJvYXJkaW5nRW1lcmdlbmN5IjpbIlZpZXciXSwiQmFua0RldGFpbCI6WyJWaWV3Il0sIkVtcGxveWVlUHJvZmlsZSI6WyJDaGFuZ2VTdGF0dXMiLCJBZGRFbXBsb3llZSJdLCJQb3N0T25ib2FyZGluZ0VtcGxveWVlUHJvZmlsZSI6WyJDaGFuZ2VTdGF0dXMiXSwiUG9zdE9uYm9hcmRpbmdQcm9maWxlIjpbIkZ1bGxFZGl0IiwiVmlldyJdLCJDb21wZW5zYXRpb24iOlsiQWRkIiwiU2VsZWN0IiwiU3VibWl0IiwiRWRpdCIsIkRvd25sb2FkIiwiVmlldyJdLCJFbWVyZ2VuY3kiOlsiVmlldyJdLCJQcm9maWxlIjpbIkZ1bGxFZGl0IiwiVmlldyJdLCJQb3N0T25ib2FyZGluZ0pvYkRldGFpbHMiOlsiQWRkIiwiRWRpdCIsIlZpZXciXSwiUG9zdE9uYm9hcmRpbmdEb2N1bWVudHMiOlsiRGVsZXRlIiwiVXBsb2FkIiwiUHJldmlldyIsIkRvd25sb2FkIl19LCJDb250cmFjdG9yUGF5Ijp7IlJvbGUiOiJFbGVtZW50c0dlbmVyYWwiLCJDb250cmFjdERvY3VtZW50cyI6WyJHZW5lcmFsRG93bmxvYWQiXSwiSm9iIjpbIkdlbmVyYWxWaWV3Il0sIlByb2ZpbGUiOlsiRWxlbWVudHNHZW5lcmFsVmlldyIsIkN1c3RvbWVyTGlzdCJdLCJCaWxsIjpbIkVsZW1lbnRzR2VuZXJhbExpc3QiXX19fSwiR3JvdXAgTWVtYmVyc2hpcHMiOlsiL1N1YnNjcmlwdGlvbnMvQ29udHJhY3RvclBheSIsIi9TdWJzY3JpcHRpb25zL0NvcmVIUiIsIi9Sb2xlcy9Db250cmFjdG9yUGF5L0VsZW1lbnRzR2VuZXJhbCIsIi9ab25lcy9FVS9Pcmdhbml6YXRpb25zL1NlcnZpY2VfQ29uc3VtZXJzL0RTTSBOdXRyaXRpb25hbCBQcm9kdWN0cy9Db250cmFjdG9yUGF5L0VsZW1lbnRzR2VuZXJhbCIsIi9Sb2xlcy9MUFBDL0VsZW1lbnRzVXNlciIsIi9ab25lcy9FVS9Pcmdhbml6YXRpb25zL1NlcnZpY2VfQ29uc3VtZXJzL0RTTSBOdXRyaXRpb25hbCBQcm9kdWN0cy9MUFBDL0VsZW1lbnRzVXNlciIsIi9Sb2xlcy9QYXltZW50cy9GaW5hbmNlQVIiLCIvWm9uZXMvRVUvT3JnYW5pemF0aW9ucy9TZXJ2aWNlX0NvbnN1bWVycy9EU00gTnV0cml0aW9uYWwgUHJvZHVjdHMvUGF5bWVudHMvRmluYW5jZUFSIiwiL1JvbGVzL0NvcmVIUi9JbnRlcm5hbEhSIiwiL1pvbmVzL0VVL09yZ2FuaXphdGlvbnMvU2VydmljZV9Db25zdW1lcnMvRFNNIE51dHJpdGlvbmFsIFByb2R1Y3RzL0NvcmVIUi9JbnRlcm5hbEhSIiwiL1N1YnNjcmlwdGlvbnMvTFBQQyIsIi9TdWJzY3JpcHRpb25zL1BheW1lbnRzIl0sInByZWZlcnJlZF91c2VybmFtZSI6ImRzbW51dHJpdGlvbmFscHJvZHVjdHNlbGVtZW50c3VzZXJAcHJvdG9ubWFpbC5jb20iLCJlbWFpbCI6ImRzbW51dHJpdGlvbmFscHJvZHVjdHNlbGVtZW50c3VzZXJAcHJvdG9ubWFpbC5jb20ifQ.SwF35EIV_4EiYhmxJcGaOll2UgTCX4XwId_JhyF3Tc587RGFVyY72nJ90iNN0qHdzOKjD3qrXxmUXtSQWNu9vrYu-c1upvruy-iJ712h6YVvggpk8n_COvOmIb6ejBnpzmQWpbZXE6ITBr_MRTmP9tQ0PT-uffWy2EdTgvKgG77vjwpHVT2TyQdQVMZwpX6yGseovUjzFacejs2USZb7s6xzZOtq_wK6srxXkFrd2G_UfNvGdvODzSsYx_SLQCl98k5Lh_sTSb0tP957502weUhmAFD4rW5J4cCN4Q2anSvJ6jHH_EQuG7VcAT7BULry_XykC2eVmo6L9rIbuA2mdg"
);
localStorage.setItem("current-org-id", "a9bbee6d-797a-4724-a86a-5b1a2e28763f");

let accessToken = localStorage.getItem("accessToken");

describe("internal view", () => {
  beforeEach(() => {
    const mock = new MockAdapter(axios);
    mock
      .onGet(getInternalListingUrl("", "", "", "", ""))
      .reply(200, resDataInternal);
    mock.onGet(urls.customers, accessToken).reply(200, allCustomerapiMock);
    mock.onGet(urls.lookup).reply(200, mockapidata.resLookupData);

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

  //   let dr = await screen.getAllByPlaceholderText(/Please Select/);
  //   fireEvent.click(dr[0]);
  //   let date = await waitFor(() => screen.getAllByText(/15/));
  //   fireEvent.click(date[2]);
  //   fireEvent.click(dr[1]);
  //   let date2 = await waitFor(() => screen.getAllByText(/15/));
  //   fireEvent.click(date2[2]);
  // });

  // test("table row clickable", async () => {
  //   const row = await waitFor(() => screen.getByText("1000992"));
  //   fireEvent.click(row);
  // });

  test("Customer Type clickable", async () => {
    const customerType = await screen.getAllByText(/Customer/);
    fireEvent.click(customerType[0]);
    const open = await screen.findByText(/Merkel Economic Group Ltd 2024/);
    fireEvent.click(open);
  });

  test("Status clickable", async () => {
    const status = await waitFor(() => screen.getAllByText(/Status/));
    fireEvent.click(status[0]);
    const open = await screen.findByText(/Open/);
    fireEvent.click(open);
  });

  test("Type clickable", async () => {
    const status = await waitFor(() => screen.getAllByText(/Type/));
    fireEvent.click(status[0]);
    const paid = await waitFor(() => screen.getAllByText(/Payroll/));
    fireEvent.click(paid[0]);
  });

  test("Clear filters clickable", async () => {
    const status = await waitFor(() => screen.getAllByText(/Type/));
    fireEvent.click(status[0]);
    const paid = await waitFor(() => screen.getAllByText(/Payroll/));
    fireEvent.click(paid[0]);
    const clear = await waitFor(() => screen.getByText(/Clear Filters/));
    fireEvent.click(clear);
  });

  test("search", async () => {
    const search = await waitFor(() =>
      screen.getByPlaceholderText(/Search by Invoice, Customer/)
    );
    fireEvent.change(search, { target: { value: "100" } });
    fireEvent.change(search, { target: { value: "" } });
  });

  //   test("tbl checkbox clickable", async () => {
  // const row = await waitFor(() => screen.getByText("1000992"));
  // const chkbox = await waitFor(() => screen.getByRole("checkbox"), {
  //   timeout: 5000,
  // });
  // const chkbox = document.querySelector(
  //   ".a-dropdown__option__item__check-box"
  // );
  // const chkbox = await waitFor(() =>
  //   document.querySelector(
  //     "#sandbox > div > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > span:nth-child(1)"
  //   )
  // );
  // const e = document.getElementById("chkbx0");
  // const someElement = getById("#chkbx0");
  // fireEvent.click(someElement);
  // screen.logTestingPlaygroundURL();
  //   });
});

describe("Internal View Download click and checkbox Click", () => {
  test("table row clickable", async () => {
    // currentOrgForListing.Payments.Role = "Internal";
    // localStorage.setItem("current-org", JSON.stringify(currentOrgForListing));
    const mock = new MockAdapter(axios);
    mock
      .onGet(getInternalListingUrl("", "", "", "", ""))
      .reply(200, resDataInternal);

    mock.onGet(urls.customers, accessToken).reply(200, allCustomerapiMock);
    mock.onGet(urls.lookup).reply(200, mockapidata.resLookupData);

    mock
      .onGet(getGenerateSinglePdfUrl("a852a1d8-9c02-424e-abf5-4f57f6361862"))
      .reply(200, resDownloadSinlgeApiData);

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

    const row = await screen.findByText("1100756");
    expect(row).toBeInTheDocument();
    const labelText = await screen.findAllByLabelText("");
    fireEvent.click(labelText[0]);

    const download = await waitFor(() => container.querySelector(".download"));
    fireEvent.click(download);

    // const toast = await screen.findByText(/Downloaded.../);
    // expect(toast).toBeInTheDocument();

    // const toastRemoveButton = await screen.findByTestId("remove-button-toast");
    // expect(toastRemoveButton).toBeInTheDocument();
    // fireEvent.click(toastRemoveButton);

    fireEvent.click(labelText[0]);

    fireEvent.click(labelText[1]);

    const downloadsingle = await waitFor(() =>
      container.querySelector(".download")
    );
    fireEvent.click(downloadsingle);
  });
});

describe("Internal View Download click for single invoice  api fail Click", () => {
  test("table row clickable", async () => {
    currentOrgForListing.Payments.Role = "Internal";
    localStorage.setItem("current-org", JSON.stringify(currentOrgForListing));
    const mock = new MockAdapter(axios);
    mock
      .onGet(getInternalListingUrl("", "", "", "", ""))
      .reply(200, resDataInternal);

    mock
      .onGet(getGenerateSinglePdfUrl("a852a1d8-9c02-424e-abf5-4f57f6361862"))
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

    const row = await screen.findByText("1100756");
    expect(row).toBeInTheDocument();
    const labelText = await screen.findAllByLabelText("");
    fireEvent.click(labelText[0]);

    const download = await waitFor(() => container.querySelector(".download"));
    fireEvent.click(download);

    // const toast = await screen.findByText("Downloaded...");
    // expect(toast).toBeInTheDocument();

    // const toastRemoveButton = await screen.findByTestId("remove-button-toast");
    // expect(toastRemoveButton).toBeInTheDocument();
    // fireEvent.click(toastRemoveButton);

    fireEvent.click(labelText[0]);

    fireEvent.click(labelText[1]);

    const downloadsingle = await waitFor(() =>
      container.querySelector(".download")
    );
    fireEvent.click(downloadsingle);
  });
});

describe("Internal View Download click for multi invoice  api fail Click", () => {
  test("multi invoice download api fail Click", async () => {
    //   currentOrgForListing.Payments.Role = "Internal";
    //   localStorage.setItem("current-org", JSON.stringify(currentOrgForListing));
    const mock = new MockAdapter(axios);
    mock
      .onGet(getInternalListingUrl("", "", "", "", ""))
      .reply(200, resDataInternal);

    mock
      .onGet(getGenerateSinglePdfUrl("70961bfc-8d6e-44fc-88ad-61f9c86db9a3"))
      .reply(400, resDownloadSinlgeApiData);

    mock.onPost(getGenerateMultiplePdfUrl()).reply(400, {
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

    const row = await screen.findByText("1100756");
    expect(row).toBeInTheDocument();
    const labelText = await screen.findAllByLabelText("");
    fireEvent.click(labelText[0]);

    const download = await waitFor(() => container.querySelector(".download"));
    fireEvent.click(download);

    //   const toast = await screen.findByText("Downloaded...");
    //   expect(toast).toBeInTheDocument();

    //   const toastRemoveButton = await screen.findByTestId("remove-button-toast");
    //   expect(toastRemoveButton).toBeInTheDocument();

    //   fireEvent.click(toastRemoveButton);

    //   fireEvent.click(labelText[0]);

    //   fireEvent.click(labelText[1]);

    //   const downloadsingle = await waitFor(() =>
    //     container.querySelector(".download")
    //   );
    //   fireEvent.click(downloadsingle);
  });
});

describe("Internal View click on New Invoice", () => {
  test("New Invoice button clickable", async () => {
    //   currentOrgForListing.Payments.Role = "Internal";
    //   localStorage.setItem("current-org", JSON.stringify(currentOrgForListing));
    const mock = new MockAdapter(axios);
    mock
      .onGet(getInternalListingUrl("", "", "", "", ""))
      .reply(200, resDataInternal);

    render(
      <HashRouter>
        <InvoiceListing />
      </HashRouter>
    );

    const newInvoiceLabel = await screen.findByText(/New Invoice/);
    expect(newInvoiceLabel).toBeInTheDocument();
    fireEvent.click(newInvoiceLabel);
  });
});

describe("Internal View Download click on table row", () => {
  test("table row clickable", async () => {
    //   currentOrgForListing.Payments.Role = "Internal";
    //   localStorage.setItem("current-org", JSON.stringify(currentOrgForListing));
    const mock = new MockAdapter(axios);
    mock
      .onGet(getInternalListingUrl("", "", "", "", ""))
      .reply(200, resDataInternal);

    render(
      <HashRouter>
        <InvoiceListing />
      </HashRouter>
    );

    const row = await screen.findByText("1100756");
    expect(row).toBeInTheDocument();
    fireEvent.click(row);
  });
});

describe("Internal View click on Add New Payment", () => {
  test("Add New Payment button clickable", async () => {
    //   currentOrgForListing.Payments.Role = "Internal";
    //   localStorage.setItem("current-org", JSON.stringify(currentOrgForListing));
    const mock = new MockAdapter(axios);
    mock
      .onGet(getInternalListingUrl("", "", "", "", ""))
      .reply(200, resDataInternal);

    render(
      <HashRouter>
        <InvoiceListing />
      </HashRouter>
    );

    const row = await screen.findByText("1101114");
    expect(row).toBeInTheDocument();

    const labelText = await screen.findAllByLabelText("");
    fireEvent.click(labelText[2]);

    const newPaymentLabel = await screen.findByText(/Add New Payment/);
    expect(newPaymentLabel).toBeInTheDocument();
    fireEvent.click(newPaymentLabel);

    const invoicePaymentLabel = await screen.findByText(/Invoice Payment/);
    expect(invoicePaymentLabel).toBeInTheDocument();
    fireEvent.click(invoicePaymentLabel);
  });
});

// describe("client view", () => {
//     test("Add New Payment button clickable", async () => {
//         currentOrgForListing.Payments.Role = "Customer";
//         localStorage.setItem("current-org", JSON.stringify(currentOrgForListing));
//       const mock = new MockAdapter(axios);
//       mock
//         .onGet(getClientListingUrl("", "", "", "", ""))
//         .reply(200, resDataClient);
//       mock.onGet(urls.customers, accessToken).reply(200, allCustomerapiMock);
//       mock.onGet(urls.lookup).reply(200, mockapidata.resLookupData);
  
//       render(
//         <HashRouter>
//           <InvoiceListing />
//         </HashRouter>
//       );
  
//       const dd = await waitFor(() => screen.getAllByText(/Please Select/));
//       fireEvent.click(dd[0]);
//       fireEvent.click(dd[2]);
//     });
// });




