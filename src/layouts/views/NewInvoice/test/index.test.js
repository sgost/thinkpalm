import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import { HashRouter } from "react-router-dom";
import MockAdapter from "axios-mock-adapter";
import {
  mockapidata,
  currentOrgTokenMock,
  productInvoiceMoc,
} from "./mockData";
import axios from "axios";
import NewInvoice from "..";
import {
  urls,
  getCountryByCustomer,
  getEmployee,
  createManualInvoice,
  getBillingAddressUrl,
  getInvoiceDetailsUrl,
  updateInvoiceStatus,
  productInvoice,
  CountryApi,
  getRelatedInvoiceUrl,
  getHeaders,
  calculateInvoiceUrl,
  getVatValue,
} from "../../../../urls/urls";
import FinishCreditMemo from "../FinishCreditMemo";
import InvoicePreviewPop from "../InvoicePreviewPop";

localStorage.setItem(
  "accessToken",
  "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIwdmRELXE3ekFYdkFxUzRfTDdoUExua2ZJbVVzaW1NWE1ZWGoxVUYwUUxVIn0.eyJleHAiOjE2NTcwOTc1MzAsImlhdCI6MTY1NzA5NTczMCwiYXV0aF90aW1lIjowLCJqdGkiOiJlZjYwOWEyNi1kOWRmLTQzNzQtOGM2Yi00MDYzYTc2MWM0YzEiLCJpc3MiOiJodHRwczovL2FjY291bnRzLXFhLmF0bGFzYnllbGVtZW50cy5jb20vcmVhbG1zL0F0bGFzIiwiYXVkIjoiQUFBIEJyb2tlciIsInN1YiI6IjVlZmJiM2YxLTM3N2MtNGJkYS1iNmU0LTE3MGI2ZWUzY2NjNCIsInR5cCI6IklEIiwiYXpwIjoiQUFBIEJyb2tlciIsInNlc3Npb25fc3RhdGUiOiJhMzM5YTI3OC05YTFhLTRkNDctOTgwNy1iYWU1M2Y2N2VlMDciLCJhdF9oYXNoIjoiMXJsR0JWWkRfcE4zY2VYTFY2dU9ldyIsImFjciI6IjEiLCJzaWQiOiJhMzM5YTI3OC05YTFhLTRkNDctOTgwNy1iYWU1M2Y2N2VlMDciLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwiQ3JlYXRlX0xvY2tlciIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl0sIm5hbWUiOiJGaW5hbmNlQVIiLCJQZXJtaXNzaW9ucyI6eyJlMjkxYzlmMC0yNDc2LTQyMzctODVjYi03YWZlY2RkMDg1ZDMiOnsiTmFtZSI6IkNvY2EtQ29sYSIsIlpvbmUiOiJFVSIsIlR5cGUiOiJTZXJ2aWNlX0NvbnN1bWVycyIsIlBheW1lbnRzIjp7IlJvbGUiOiJGaW5hbmNlQVIiLCJDcmVkaXRNZW1vSW52b2ljZUNyZWF0aW9uIjpbIlNhdmUiXSwiUHJvZm9ybWFJbnZvaWNlIjpbIkFkZCIsIkRlbGV0ZUludm9pY2UiLCJEZWxldGVJdGVtIiwiUGF5IiwiRWRpdCIsIlZpZXciLCJBZGRQYXltZW50IiwiU2VuZCIsIkJyb3dzZSIsIlJlamVjdCIsIkV4cG9ydCIsIkNsb3NlIiwiVm9pZCIsIkRvd25sb2FkIiwiUHVibGlzaCIsIkFwcHJvdmUiLCJEZWxldGVGaWxlIl0sIlByb2Zvcm1hSW52b2ljZUNyZWF0aW9uIjpbIlNhdmUiLCJFZGl0Il0sIkludm9pY2VEZXRhaWxzIjpbIkFkZCIsIkRlbGV0ZSIsIlBhaWQiLCJFZGl0IiwiVmlldyIsIkFkZFBheW1lbnQiLCJTZW5kIiwiQnJvd3NlIiwiUmVqZWN0IiwiU2VsZWN0IiwiRXhwb3J0IiwiQ2xvc2UiLCJWb2lkIiwiRG93bmxvYWQiLCJQdWJsaXNoIiwiQXBwcm92ZSIsIkRlbGV0ZUZpbGUiXSwiTWlzY2VsbGFuZW91c0ludm9pY2VDcmVhdGlvbiI6WyJTYXZlIiwiRWRpdCJdLCJJbnZvaWNlTGlzdCI6WyJBZGQiLCJJbnRlcm5hbFZpZXciLCJFZGl0IiwiRG93bmxvYWQiLCJWaWV3IiwiQWRkUGF5bWVudCJdLCJNaXNjZWxsYW5lb3VzSW52b2ljZSI6WyJBZGQiLCJEZWxldGVJbnZvaWNlIiwiRGVsZXRlSXRlbSIsIlBheSIsIkVkaXQiLCJWaWV3IiwiQWRkUGF5bWVudCIsIlNlbmQiLCJCcm93c2UiLCJSZWplY3QiLCJFeHBvcnQiLCJDbG9zZSIsIlZvaWQiLCJEb3dubG9hZCIsIlB1Ymxpc2giLCJBcHByb3ZlIiwiRGVsZXRlRmlsZSJdLCJDcmVkaXRNZW1vSW52b2ljZSI6WyJBZGQiLCJEZWxldGVJbnZvaWNlIiwiRGVsZXRlSXRlbSIsIlBheSIsIkVkaXQiLCJWaWV3IiwiQWRkUGF5bWVudCIsIlNlbmQiLCJCcm93c2UiLCJSZWplY3QiLCJFeHBvcnQiLCJDbG9zZSIsIlZvaWQiLCJEb3dubG9hZCIsIlB1Ymxpc2giLCJBcHByb3ZlIiwiRGVsZXRlRmlsZSJdLCJNYW51YWxQYXlyb2xsSW52b2ljZUNyZWF0aW9uIjpbIlNhdmUiLCJFZGl0Il19LCJMUFBDIjp7IlJvbGUiOiJFbGVtZW50c1VzZXIiLCJQYXlyb2xsTGFuZGluZ091dHB1dEZvbGRlclBheXNsaXBBc3NpZ25hdGlvbiI6WyJBZGQiLCJWaWV3Il0sIkNvbmZpZ3VyZUNhbGVuZGFyIjpbIlZpZXciXSwiQ29uZmlndXJlQ2FsZW5kYXJBY3Rpdml0eSI6WyJBZGQiXSwiUGF5cm9sbExhbmRpbmdSb290T3V0cHV0RmlsZSI6WyJEZWxldGUiLCJEb3dubG9hZCIsIlZpZXciXSwiUGF5cm9sbExhbmRpbmdPdXRwdXRDcmVhdGVOZXdGb2xkZXIiOlsiQ3JlYXRlTmV3Rm9sZGVyIl0sIkNvbmZpZ3VyZUNhbGVuZGFyTWlsZXN0b25lU2VyaWVzIjpbIk1pbGVzdG9uZVNlcmllc0FkZCJdLCJQYXlyb2xsTGFuZGluZ0lucHV0Rm9sZGVyIjpbIkRlbGV0ZSIsIkRvd25sb2FkIiwiVmlldyIsIlJlbmFtZSJdLCJCaWdDYWxlbmRhck1pbGVzdG9uZVNlcmllcyI6WyJNaWxlc3RvbmVTZXJpZXNEZWxldGUiLCJNaWxlc3RvbmVTZXJpZXNFZGl0Il0sIlBheXJvbGxMYW5kaW5nT3V0cHV0Rm9sZGVyRmlsZSI6WyJVcGxvYWRGaWxlIiwiUGRmQ29udmVydCIsIlZpZXciLCJSZW5hbWVGaWxlIiwiRGVsZXRlRmlsZSIsIkRvd25sb2FkRmlsZXMiXSwiUGF5cm9sbEhpc3RvcnlBdXRvbWF0ZWRGaWxlQ3JlYXRpb24iOlsiRWRpdCIsIlZpZXciXSwiUGF5cm9sbExhbmRpbmdSb290SW5wdXRUYWIiOlsiVXBsb2FkQ29yZUhSIiwiVXBsb2FkRmlsZSJdLCJQYXlyb2xsQXV0b21hdGVkRmlsZUNyZWF0aW9uIjpbIkZpbGVSZWdlbmVyYXRlIiwiRWRpdCIsIlZpZXciLCJGaWxlR2VuZXJhdGUiXSwiUGF5cm9sbExhbmRpbmdGb2xkZXJOZXdQYXlyb2xsRmlsZSI6WyJBZGQiLCJGaWxlUmVnZW5lcmF0ZSIsIlZpZXciXSwiUGF5cm9sbExhbmRpbmdPdXRwdXRGb2xkZXJTcGxpdEZpbGUiOlsiU3BsaXRGaWxlIl0sIlBheXJvbGxMYW5kaW5nSW5wdXRUYWIiOlsiVmlldyJdLCJQYXlyb2xsTGFuZGluZ1ZpZXciOlsiVmlldyJdLCJQYXlyb2xsTGFuZGluZ1Jvb3RJbnB1dEZpbGUiOlsiRGVsZXRlIiwiRG93bmxvYWQiLCJWaWV3Il0sIkRhc2hib2FyZENvdW50cnlDYXJkcyI6WyJWaWV3Il0sIkJpZ0NhbGVuZGFyTWlsZXN0b25lIjpbIlZpZXciXSwiUGF5cm9sbExhbmRpbmdPdXRwdXRGb2xkZXIiOlsiRGVsZXRlIiwiRG93bmxvYWQiLCJWaWV3IiwiUmVuYW1lIl0sIkJpZ0NhbGVuZGFyQWN0aXZpdHkiOlsiVmlldyJdLCJCaWdDYWxlbmRhckFjdGl2aXR5U2VyaWVzIjpbIkFjdGl2aXR5U2VyaWVzRGVsZXRlIiwiQWN0aXZpdHlTZXJpZXNFZGl0Il0sIlBheXJvbGxMYW5kaW5nT3V0cHV0VGFiIjpbIlZpZXciXSwiUGF5cm9sbExhbmRpbmdSb290T3V0cHV0VGFiIjpbIlVwbG9hZEZpbGUiXSwiQmlnQ2FsZW5kYXJBY3Rpdml0eU9jY3VyZW5jZSI6WyJBY3Rpdml0eU9jY3VyZW5jZUVkaXQiLCJBY3Rpdml0eU9jY3VyZW5jZURlbGV0ZSJdLCJQYXlyb2xsTGFuZGluZ091dHB1dEZvbGRlclBheXNsaXBBc3NpZ25hdGlvblVwbG9hZCI6WyJVcGxvYWQiXSwiVGVzdCI6WyJBZGQiXSwiUGF5cm9sbExhbmRpbmdEb3dubG9hZEZpbGVzIjpbIkRvd25sb2FkRmlsZXMiXSwiQmlnQ2FsZW5kYXIiOlsiVmlldyJdLCJQYXlyb2xsTGFuZGluZyI6WyJEb3dubG9hZE91dHB1dEZpbGVzIiwiRG93bmxvYWRJbnB1dEZpbGVzIiwiVXBkYXRlRmlsZVN0YXR1cyIsIlZpZXciXSwiUGF5cm9sbExhbmRpbmdJbnB1dEZvbGRlckZpbGUiOlsiRGVsZXRlIiwiVXBsb2FkQ29yZUhSIiwiVXBsb2FkIiwiRG93bmxvYWQiLCJWaWV3Il0sIlBheXJvbGxMYW5kaW5nRm9sZGVyIjpbIkRlbGV0ZSIsIlVwbG9hZEZpbGUiLCJOZXdQYXlyb2xsRmlsZSIsIk5ld1BheXJvbGxBZGQiLCJWaWV3IiwiUmVuYW1lIl0sIkNvbmZpZ3VyZUNhbGVuZGFyTWlsZXN0b25lIjpbIkFkZCJdLCJQYXlyb2xsSGlzdG9yeVBheXJvbGxGb2xkZXJMaXN0IjpbIlZpZXciXSwiQ29uZmlndXJlQ2FsZW5kYXJBY3Rpdml0eU9jY3VyZW5jZSI6WyJBY3Rpdml0eU9jY3VyZW5jZUFkZCJdLCJQYXlyb2xsSGlzdG9yeU1pbmlDYWxlbmRhciI6WyJWaWV3Il0sIkNvbmZpZ3VyZUNhbGVuZGFyTWlsZXN0b25lT2NjdXJlbmNlIjpbIk1pbGVzdG9uZU9jY3VyZW5jZUFkZCJdLCJCaWdDYWxlbmRhck1pbGVzdG9uZU9jdXJyZW5jZSI6WyJNaWxlc3RvbmVPY3VycmVuY2VFZGl0IiwiTWlsZXN0b25lT2N1cnJlbmNlRGVsZXRlIl0sIlBheXJvbGxMYW5kaW5nSW5wdXRDcmVhdGVOZXdGb2xkZXIiOlsiQ3JlYXRlTmV3Rm9sZGVyIl19fSwiRURGOUU5NUMtMzMwQy00RUVELUE0QkItRTNGOUM5MDkxOTI0Ijp7Ik5hbWUiOiJBdmlhdCBOZXR3b3JrcyAoUykgUHRlIEx0ZCAoRVVSKSIsIlpvbmUiOiJFVSIsIlR5cGUiOiJTZXJ2aWNlX0NvbnN1bWVycyIsIlBheW1lbnRzIjp7IlJvbGUiOiJGaW5hbmNlQVIiLCJDcmVkaXRNZW1vSW52b2ljZUNyZWF0aW9uIjpbIlNhdmUiXSwiUHJvZm9ybWFJbnZvaWNlIjpbIkFkZCIsIkRlbGV0ZUludm9pY2UiLCJEZWxldGVJdGVtIiwiUGF5IiwiRWRpdCIsIlZpZXciLCJBZGRQYXltZW50IiwiU2VuZCIsIkJyb3dzZSIsIlJlamVjdCIsIkV4cG9ydCIsIkNsb3NlIiwiVm9pZCIsIkRvd25sb2FkIiwiUHVibGlzaCIsIkFwcHJvdmUiLCJEZWxldGVGaWxlIl0sIlByb2Zvcm1hSW52b2ljZUNyZWF0aW9uIjpbIlNhdmUiLCJFZGl0Il0sIkludm9pY2VEZXRhaWxzIjpbIkFkZCIsIkRlbGV0ZSIsIlBhaWQiLCJFZGl0IiwiVmlldyIsIkFkZFBheW1lbnQiLCJTZW5kIiwiQnJvd3NlIiwiUmVqZWN0IiwiU2VsZWN0IiwiRXhwb3J0IiwiQ2xvc2UiLCJWb2lkIiwiRG93bmxvYWQiLCJQdWJsaXNoIiwiQXBwcm92ZSIsIkRlbGV0ZUZpbGUiXSwiTWlzY2VsbGFuZW91c0ludm9pY2VDcmVhdGlvbiI6WyJTYXZlIiwiRWRpdCJdLCJJbnZvaWNlTGlzdCI6WyJBZGQiLCJJbnRlcm5hbFZpZXciLCJFZGl0IiwiRG93bmxvYWQiLCJWaWV3IiwiQWRkUGF5bWVudCJdLCJNaXNjZWxsYW5lb3VzSW52b2ljZSI6WyJBZGQiLCJEZWxldGVJbnZvaWNlIiwiRGVsZXRlSXRlbSIsIlBheSIsIkVkaXQiLCJWaWV3IiwiQWRkUGF5bWVudCIsIlNlbmQiLCJCcm93c2UiLCJSZWplY3QiLCJFeHBvcnQiLCJDbG9zZSIsIlZvaWQiLCJEb3dubG9hZCIsIlB1Ymxpc2giLCJBcHByb3ZlIiwiRGVsZXRlRmlsZSJdLCJDcmVkaXRNZW1vSW52b2ljZSI6WyJBZGQiLCJEZWxldGVJbnZvaWNlIiwiRGVsZXRlSXRlbSIsIlBheSIsIkVkaXQiLCJWaWV3IiwiQWRkUGF5bWVudCIsIlNlbmQiLCJCcm93c2UiLCJSZWplY3QiLCJFeHBvcnQiLCJDbG9zZSIsIlZvaWQiLCJEb3dubG9hZCIsIlB1Ymxpc2giLCJBcHByb3ZlIiwiRGVsZXRlRmlsZSJdLCJNYW51YWxQYXlyb2xsSW52b2ljZUNyZWF0aW9uIjpbIlNhdmUiLCJFZGl0Il19fSwiYTliYmVlNmQtNzk3YS00NzI0LWE4NmEtNWIxYTJlMjg3NjNmIjp7Ik5hbWUiOiJEU00gTnV0cml0aW9uYWwgUHJvZHVjdHMiLCJab25lIjoiRVUiLCJUeXBlIjoiU2VydmljZV9Db25zdW1lcnMiLCJDb3JlSFIiOnsiUm9sZSI6IkludGVybmFsSFIiLCJQb3N0T25ib2FyZGluZ0JhbmtEZXRhaWwiOlsiQWRkIiwiRWRpdCIsIlZpZXciXSwiSW50ZXJuYWxIUkxpc3RpbmdQYWdlIjpbIkRvd25sb2FkIiwiVmlldyJdLCJCZW5lZml0c2NvbmZpZ3VyYXRvciI6WyJBZGQiLCJEZWxldGUiLCJFZGl0IiwiVmlldyJdLCJUaW1lT2ZmIjpbIkN1c3RvbWl6ZSIsIkFwcHJvdmVEZWNsaW5lIiwiVmlldyJdLCJQb3N0T25ib2FyZGluZ0JlbmVmaXRzIjpbIkFkZCIsIkVkaXQiLCJWaWV3Il0sIkRvY3VtZW50cyI6WyJEZWxldGUiLCJVcGxvYWQiLCJQcmV2aWV3IiwiRG93bmxvYWQiXSwiSm9iRGV0YWlscyI6WyJBZGQiLCJFZGl0IiwiVmlldyJdLCJCZW5lZml0cyI6WyJDb25maWd1cmF0b3JEZWxldGVQbGFuIiwiQ29uZmlndXJhdG9yRWRpdFBsYW4iLCJDb25maWd1cmF0b3JBZGRQbGFuIiwiQ29uZmlndXJhdG9yVmlld1BsYW4iXSwiUG9zdE9uYm9hcmRpbmdFbWVyZ2VuY3kiOlsiVmlldyJdLCJCYW5rRGV0YWlsIjpbIlZpZXciXSwiRW1wbG95ZWVQcm9maWxlIjpbIkRlbGV0ZSIsIkFkZEVtcGxveWVlIiwiQ2hhbmdlc3RhdHVzIl0sIlBvc3RPbmJvYXJkaW5nRW1wbG95ZWVQcm9maWxlIjpbIkNoYW5nZXN0YXR1cyJdLCJQb3N0T25ib2FyZGluZ1Byb2ZpbGUiOlsiRnVsbEVkaXQiLCJWaWV3Il0sIkNvbXBlbnNhdGlvbiI6WyJBZGQiLCJTZWxlY3QiLCJTdWJtaXQiLCJFZGl0IiwiRG93bmxvYWQiLCJWaWV3Il0sIkVtZXJnZW5jeSI6WyJWaWV3Il0sIlByb2ZpbGUiOlsiRnVsbEVkaXQiLCJWaWV3Il0sIlBvc3RPbmJvYXJkaW5nSm9iRGV0YWlscyI6WyJBZGQiLCJFZGl0IiwiVmlldyJdLCJQb3N0T25ib2FyZGluZ0RvY3VtZW50cyI6WyJEZWxldGUiLCJVcGxvYWQiLCJQcmV2aWV3IiwiRG93bmxvYWQiXX0sIlBheW1lbnRzIjp7IlJvbGUiOiJGaW5hbmNlQVIiLCJDcmVkaXRNZW1vSW52b2ljZUNyZWF0aW9uIjpbIlNhdmUiXSwiUHJvZm9ybWFJbnZvaWNlIjpbIkFkZCIsIkRlbGV0ZUludm9pY2UiLCJEZWxldGVJdGVtIiwiUGF5IiwiRWRpdCIsIlZpZXciLCJBZGRQYXltZW50IiwiU2VuZCIsIkJyb3dzZSIsIlJlamVjdCIsIkV4cG9ydCIsIkNsb3NlIiwiVm9pZCIsIkRvd25sb2FkIiwiUHVibGlzaCIsIkFwcHJvdmUiLCJEZWxldGVGaWxlIl0sIlByb2Zvcm1hSW52b2ljZUNyZWF0aW9uIjpbIlNhdmUiLCJFZGl0Il0sIkludm9pY2VEZXRhaWxzIjpbIkFkZCIsIkRlbGV0ZSIsIlBhaWQiLCJFZGl0IiwiVmlldyIsIkFkZFBheW1lbnQiLCJTZW5kIiwiQnJvd3NlIiwiUmVqZWN0IiwiU2VsZWN0IiwiRXhwb3J0IiwiQ2xvc2UiLCJWb2lkIiwiRG93bmxvYWQiLCJQdWJsaXNoIiwiQXBwcm92ZSIsIkRlbGV0ZUZpbGUiXSwiTWlzY2VsbGFuZW91c0ludm9pY2VDcmVhdGlvbiI6WyJTYXZlIiwiRWRpdCJdLCJJbnZvaWNlTGlzdCI6WyJBZGQiLCJJbnRlcm5hbFZpZXciLCJFZGl0IiwiRG93bmxvYWQiLCJWaWV3IiwiQWRkUGF5bWVudCJdLCJNaXNjZWxsYW5lb3VzSW52b2ljZSI6WyJBZGQiLCJEZWxldGVJbnZvaWNlIiwiRGVsZXRlSXRlbSIsIlBheSIsIkVkaXQiLCJWaWV3IiwiQWRkUGF5bWVudCIsIlNlbmQiLCJCcm93c2UiLCJSZWplY3QiLCJFeHBvcnQiLCJDbG9zZSIsIlZvaWQiLCJEb3dubG9hZCIsIlB1Ymxpc2giLCJBcHByb3ZlIiwiRGVsZXRlRmlsZSJdLCJDcmVkaXRNZW1vSW52b2ljZSI6WyJBZGQiLCJEZWxldGVJbnZvaWNlIiwiRGVsZXRlSXRlbSIsIlBheSIsIkVkaXQiLCJWaWV3IiwiQWRkUGF5bWVudCIsIlNlbmQiLCJCcm93c2UiLCJSZWplY3QiLCJFeHBvcnQiLCJDbG9zZSIsIlZvaWQiLCJEb3dubG9hZCIsIlB1Ymxpc2giLCJBcHByb3ZlIiwiRGVsZXRlRmlsZSJdLCJNYW51YWxQYXlyb2xsSW52b2ljZUNyZWF0aW9uIjpbIlNhdmUiLCJFZGl0Il19LCJMUFBDIjp7IlJvbGUiOiJFbGVtZW50c1VzZXIiLCJQYXlyb2xsTGFuZGluZ091dHB1dEZvbGRlclBheXNsaXBBc3NpZ25hdGlvbiI6WyJBZGQiLCJWaWV3Il0sIkNvbmZpZ3VyZUNhbGVuZGFyIjpbIlZpZXciXSwiQ29uZmlndXJlQ2FsZW5kYXJBY3Rpdml0eSI6WyJBZGQiXSwiUGF5cm9sbExhbmRpbmdSb290T3V0cHV0RmlsZSI6WyJEZWxldGUiLCJEb3dubG9hZCIsIlZpZXciXSwiUGF5cm9sbExhbmRpbmdPdXRwdXRDcmVhdGVOZXdGb2xkZXIiOlsiQ3JlYXRlTmV3Rm9sZGVyIl0sIkNvbmZpZ3VyZUNhbGVuZGFyTWlsZXN0b25lU2VyaWVzIjpbIk1pbGVzdG9uZVNlcmllc0FkZCJdLCJQYXlyb2xsTGFuZGluZ0lucHV0Rm9sZGVyIjpbIkRlbGV0ZSIsIkRvd25sb2FkIiwiVmlldyIsIlJlbmFtZSJdLCJCaWdDYWxlbmRhck1pbGVzdG9uZVNlcmllcyI6WyJNaWxlc3RvbmVTZXJpZXNEZWxldGUiLCJNaWxlc3RvbmVTZXJpZXNFZGl0Il0sIlBheXJvbGxMYW5kaW5nT3V0cHV0Rm9sZGVyRmlsZSI6WyJVcGxvYWRGaWxlIiwiUGRmQ29udmVydCIsIlZpZXciLCJSZW5hbWVGaWxlIiwiRGVsZXRlRmlsZSIsIkRvd25sb2FkRmlsZXMiXSwiUGF5cm9sbEhpc3RvcnlBdXRvbWF0ZWRGaWxlQ3JlYXRpb24iOlsiRWRpdCIsIlZpZXciXSwiUGF5cm9sbExhbmRpbmdSb290SW5wdXRUYWIiOlsiVXBsb2FkQ29yZUhSIiwiVXBsb2FkRmlsZSJdLCJQYXlyb2xsQXV0b21hdGVkRmlsZUNyZWF0aW9uIjpbIkZpbGVSZWdlbmVyYXRlIiwiRWRpdCIsIlZpZXciLCJGaWxlR2VuZXJhdGUiXSwiUGF5cm9sbExhbmRpbmdGb2xkZXJOZXdQYXlyb2xsRmlsZSI6WyJBZGQiLCJGaWxlUmVnZW5lcmF0ZSIsIlZpZXciXSwiUGF5cm9sbExhbmRpbmdPdXRwdXRGb2xkZXJTcGxpdEZpbGUiOlsiU3BsaXRGaWxlIl0sIlBheXJvbGxMYW5kaW5nSW5wdXRUYWIiOlsiVmlldyJdLCJQYXlyb2xsTGFuZGluZ1ZpZXciOlsiVmlldyJdLCJQYXlyb2xsTGFuZGluZ1Jvb3RJbnB1dEZpbGUiOlsiRGVsZXRlIiwiRG93bmxvYWQiLCJWaWV3Il0sIkRhc2hib2FyZENvdW50cnlDYXJkcyI6WyJWaWV3Il0sIkJpZ0NhbGVuZGFyTWlsZXN0b25lIjpbIlZpZXciXSwiUGF5cm9sbExhbmRpbmdPdXRwdXRGb2xkZXIiOlsiRGVsZXRlIiwiRG93bmxvYWQiLCJWaWV3IiwiUmVuYW1lIl0sIkJpZ0NhbGVuZGFyQWN0aXZpdHkiOlsiVmlldyJdLCJCaWdDYWxlbmRhckFjdGl2aXR5U2VyaWVzIjpbIkFjdGl2aXR5U2VyaWVzRGVsZXRlIiwiQWN0aXZpdHlTZXJpZXNFZGl0Il0sIlBheXJvbGxMYW5kaW5nT3V0cHV0VGFiIjpbIlZpZXciXSwiUGF5cm9sbExhbmRpbmdSb290T3V0cHV0VGFiIjpbIlVwbG9hZEZpbGUiXSwiQmlnQ2FsZW5kYXJBY3Rpdml0eU9jY3VyZW5jZSI6WyJBY3Rpdml0eU9jY3VyZW5jZUVkaXQiLCJBY3Rpdml0eU9jY3VyZW5jZURlbGV0ZSJdLCJQYXlyb2xsTGFuZGluZ091dHB1dEZvbGRlclBheXNsaXBBc3NpZ25hdGlvblVwbG9hZCI6WyJVcGxvYWQiXSwiVGVzdCI6WyJBZGQiXSwiUGF5cm9sbExhbmRpbmdEb3dubG9hZEZpbGVzIjpbIkRvd25sb2FkRmlsZXMiXSwiQmlnQ2FsZW5kYXIiOlsiVmlldyJdLCJQYXlyb2xsTGFuZGluZyI6WyJEb3dubG9hZE91dHB1dEZpbGVzIiwiRG93bmxvYWRJbnB1dEZpbGVzIiwiVXBkYXRlRmlsZVN0YXR1cyIsIlZpZXciXSwiUGF5cm9sbExhbmRpbmdJbnB1dEZvbGRlckZpbGUiOlsiRGVsZXRlIiwiVXBsb2FkQ29yZUhSIiwiVXBsb2FkIiwiRG93bmxvYWQiLCJWaWV3Il0sIlBheXJvbGxMYW5kaW5nRm9sZGVyIjpbIkRlbGV0ZSIsIlVwbG9hZEZpbGUiLCJOZXdQYXlyb2xsRmlsZSIsIk5ld1BheXJvbGxBZGQiLCJWaWV3IiwiUmVuYW1lIl0sIkNvbmZpZ3VyZUNhbGVuZGFyTWlsZXN0b25lIjpbIkFkZCJdLCJQYXlyb2xsSGlzdG9yeVBheXJvbGxGb2xkZXJMaXN0IjpbIlZpZXciXSwiQ29uZmlndXJlQ2FsZW5kYXJBY3Rpdml0eU9jY3VyZW5jZSI6WyJBY3Rpdml0eU9jY3VyZW5jZUFkZCJdLCJQYXlyb2xsSGlzdG9yeU1pbmlDYWxlbmRhciI6WyJWaWV3Il0sIkNvbmZpZ3VyZUNhbGVuZGFyTWlsZXN0b25lT2NjdXJlbmNlIjpbIk1pbGVzdG9uZU9jY3VyZW5jZUFkZCJdLCJCaWdDYWxlbmRhck1pbGVzdG9uZU9jdXJyZW5jZSI6WyJNaWxlc3RvbmVPY3VycmVuY2VFZGl0IiwiTWlsZXN0b25lT2N1cnJlbmNlRGVsZXRlIl0sIlBheXJvbGxMYW5kaW5nSW5wdXRDcmVhdGVOZXdGb2xkZXIiOlsiQ3JlYXRlTmV3Rm9sZGVyIl19fSwiRTI5MUM5RjAtMjQ3Ni00MjM4LTg1Q0ItN0FGRUNERDA4NUU0Ijp7Ik5hbWUiOiJFR1MiLCJab25lIjoiRVUiLCJUeXBlIjoiQXRsYXNfT3duZXJzIiwiUGF5bWVudHMiOnsiUm9sZSI6IkZpbmFuY2VBUiIsIkNyZWRpdE1lbW9JbnZvaWNlQ3JlYXRpb24iOlsiU2F2ZSJdLCJQcm9mb3JtYUludm9pY2UiOlsiQWRkIiwiRGVsZXRlSW52b2ljZSIsIkRlbGV0ZUl0ZW0iLCJQYXkiLCJFZGl0IiwiVmlldyIsIkFkZFBheW1lbnQiLCJTZW5kIiwiQnJvd3NlIiwiUmVqZWN0IiwiRXhwb3J0IiwiQ2xvc2UiLCJWb2lkIiwiRG93bmxvYWQiLCJQdWJsaXNoIiwiQXBwcm92ZSIsIkRlbGV0ZUZpbGUiXSwiUHJvZm9ybWFJbnZvaWNlQ3JlYXRpb24iOlsiU2F2ZSIsIkVkaXQiXSwiSW52b2ljZURldGFpbHMiOlsiQWRkIiwiRGVsZXRlIiwiUGFpZCIsIkVkaXQiLCJWaWV3IiwiQWRkUGF5bWVudCIsIlNlbmQiLCJCcm93c2UiLCJSZWplY3QiLCJTZWxlY3QiLCJFeHBvcnQiLCJDbG9zZSIsIlZvaWQiLCJEb3dubG9hZCIsIlB1Ymxpc2giLCJBcHByb3ZlIiwiRGVsZXRlRmlsZSJdLCJNaXNjZWxsYW5lb3VzSW52b2ljZUNyZWF0aW9uIjpbIlNhdmUiLCJFZGl0Il0sIkludm9pY2VMaXN0IjpbIkFkZCIsIkludGVybmFsVmlldyIsIkVkaXQiLCJEb3dubG9hZCIsIlZpZXciLCJBZGRQYXltZW50Il0sIk1pc2NlbGxhbmVvdXNJbnZvaWNlIjpbIkFkZCIsIkRlbGV0ZUludm9pY2UiLCJEZWxldGVJdGVtIiwiUGF5IiwiRWRpdCIsIlZpZXciLCJBZGRQYXltZW50IiwiU2VuZCIsIkJyb3dzZSIsIlJlamVjdCIsIkV4cG9ydCIsIkNsb3NlIiwiVm9pZCIsIkRvd25sb2FkIiwiUHVibGlzaCIsIkFwcHJvdmUiLCJEZWxldGVGaWxlIl0sIkNyZWRpdE1lbW9JbnZvaWNlIjpbIkFkZCIsIkRlbGV0ZUludm9pY2UiLCJEZWxldGVJdGVtIiwiUGF5IiwiRWRpdCIsIlZpZXciLCJBZGRQYXltZW50IiwiU2VuZCIsIkJyb3dzZSIsIlJlamVjdCIsIkV4cG9ydCIsIkNsb3NlIiwiVm9pZCIsIkRvd25sb2FkIiwiUHVibGlzaCIsIkFwcHJvdmUiLCJEZWxldGVGaWxlIl0sIk1hbnVhbFBheXJvbGxJbnZvaWNlQ3JlYXRpb24iOlsiU2F2ZSIsIkVkaXQiXX19LCIwOTRiM2M2Ni01Nzg3LTQ3YmEtOWJkYy00ODc2MmZiZDkxMDQiOnsiTmFtZSI6IkF2aWF0IE5ldHdvcmtzIFBURSBMdGQiLCJab25lIjoiRVUiLCJUeXBlIjoiU2VydmljZV9Db25zdW1lcnMiLCJQYXltZW50cyI6eyJSb2xlIjoiRmluYW5jZUFSIiwiQ3JlZGl0TWVtb0ludm9pY2VDcmVhdGlvbiI6WyJTYXZlIl0sIlByb2Zvcm1hSW52b2ljZSI6WyJBZGQiLCJEZWxldGVJbnZvaWNlIiwiRGVsZXRlSXRlbSIsIlBheSIsIkVkaXQiLCJWaWV3IiwiQWRkUGF5bWVudCIsIlNlbmQiLCJCcm93c2UiLCJSZWplY3QiLCJFeHBvcnQiLCJDbG9zZSIsIlZvaWQiLCJEb3dubG9hZCIsIlB1Ymxpc2giLCJBcHByb3ZlIiwiRGVsZXRlRmlsZSJdLCJQcm9mb3JtYUludm9pY2VDcmVhdGlvbiI6WyJTYXZlIiwiRWRpdCJdLCJJbnZvaWNlRGV0YWlscyI6WyJBZGQiLCJEZWxldGUiLCJQYWlkIiwiRWRpdCIsIlZpZXciLCJBZGRQYXltZW50IiwiU2VuZCIsIkJyb3dzZSIsIlJlamVjdCIsIlNlbGVjdCIsIkV4cG9ydCIsIkNsb3NlIiwiVm9pZCIsIkRvd25sb2FkIiwiUHVibGlzaCIsIkFwcHJvdmUiLCJEZWxldGVGaWxlIl0sIk1pc2NlbGxhbmVvdXNJbnZvaWNlQ3JlYXRpb24iOlsiU2F2ZSIsIkVkaXQiXSwiSW52b2ljZUxpc3QiOlsiQWRkIiwiSW50ZXJuYWxWaWV3IiwiRWRpdCIsIkRvd25sb2FkIiwiVmlldyIsIkFkZFBheW1lbnQiXSwiTWlzY2VsbGFuZW91c0ludm9pY2UiOlsiQWRkIiwiRGVsZXRlSW52b2ljZSIsIkRlbGV0ZUl0ZW0iLCJQYXkiLCJFZGl0IiwiVmlldyIsIkFkZFBheW1lbnQiLCJTZW5kIiwiQnJvd3NlIiwiUmVqZWN0IiwiRXhwb3J0IiwiQ2xvc2UiLCJWb2lkIiwiRG93bmxvYWQiLCJQdWJsaXNoIiwiQXBwcm92ZSIsIkRlbGV0ZUZpbGUiXSwiQ3JlZGl0TWVtb0ludm9pY2UiOlsiQWRkIiwiRGVsZXRlSW52b2ljZSIsIkRlbGV0ZUl0ZW0iLCJQYXkiLCJFZGl0IiwiVmlldyIsIkFkZFBheW1lbnQiLCJTZW5kIiwiQnJvd3NlIiwiUmVqZWN0IiwiRXhwb3J0IiwiQ2xvc2UiLCJWb2lkIiwiRG93bmxvYWQiLCJQdWJsaXNoIiwiQXBwcm92ZSIsIkRlbGV0ZUZpbGUiXSwiTWFudWFsUGF5cm9sbEludm9pY2VDcmVhdGlvbiI6WyJTYXZlIiwiRWRpdCJdfX0sIjhmNWViZDY2LWMzZmItNGNmMi04OTRmLTQ4MjU2NGZiM2UzZSI6eyJOYW1lIjoiJHtOYW1lfSIsIlpvbmUiOiJFVSIsIlR5cGUiOiJTZXJ2aWNlX0NvbnN1bWVycyIsIkNvcmVIUiI6eyJSb2xlIjoiSW50ZXJuYWxIUiIsIlBvc3RPbmJvYXJkaW5nQmFua0RldGFpbCI6WyJBZGQiLCJFZGl0IiwiVmlldyJdLCJJbnRlcm5hbEhSTGlzdGluZ1BhZ2UiOlsiRG93bmxvYWQiLCJWaWV3Il0sIkJlbmVmaXRzY29uZmlndXJhdG9yIjpbIkFkZCIsIkRlbGV0ZSIsIkVkaXQiLCJWaWV3Il0sIlRpbWVPZmYiOlsiQ3VzdG9taXplIiwiQXBwcm92ZURlY2xpbmUiLCJWaWV3Il0sIlBvc3RPbmJvYXJkaW5nQmVuZWZpdHMiOlsiQWRkIiwiRWRpdCIsIlZpZXciXSwiRG9jdW1lbnRzIjpbIkRlbGV0ZSIsIlVwbG9hZCIsIlByZXZpZXciLCJEb3dubG9hZCJdLCJKb2JEZXRhaWxzIjpbIkFkZCIsIkVkaXQiLCJWaWV3Il0sIkJlbmVmaXRzIjpbIkNvbmZpZ3VyYXRvckRlbGV0ZVBsYW4iLCJDb25maWd1cmF0b3JFZGl0UGxhbiIsIkNvbmZpZ3VyYXRvckFkZFBsYW4iLCJDb25maWd1cmF0b3JWaWV3UGxhbiJdLCJQb3N0T25ib2FyZGluZ0VtZXJnZW5jeSI6WyJWaWV3Il0sIkJhbmtEZXRhaWwiOlsiVmlldyJdLCJFbXBsb3llZVByb2ZpbGUiOlsiRGVsZXRlIiwiQWRkRW1wbG95ZWUiLCJDaGFuZ2VzdGF0dXMiXSwiUG9zdE9uYm9hcmRpbmdFbXBsb3llZVByb2ZpbGUiOlsiQ2hhbmdlc3RhdHVzIl0sIlBvc3RPbmJvYXJkaW5nUHJvZmlsZSI6WyJGdWxsRWRpdCIsIlZpZXciXSwiQ29tcGVuc2F0aW9uIjpbIkFkZCIsIlNlbGVjdCIsIlN1Ym1pdCIsIkVkaXQiLCJEb3dubG9hZCIsIlZpZXciXSwiRW1lcmdlbmN5IjpbIlZpZXciXSwiUHJvZmlsZSI6WyJGdWxsRWRpdCIsIlZpZXciXSwiUG9zdE9uYm9hcmRpbmdKb2JEZXRhaWxzIjpbIkFkZCIsIkVkaXQiLCJWaWV3Il0sIlBvc3RPbmJvYXJkaW5nRG9jdW1lbnRzIjpbIkRlbGV0ZSIsIlVwbG9hZCIsIlByZXZpZXciLCJEb3dubG9hZCJdfX19LCJHcm91cCBNZW1iZXJzaGlwcyI6WyIvU3Vic2NyaXB0aW9ucy9Db250cmFjdG9yUGF5IiwiL1N1YnNjcmlwdGlvbnMvQ29yZUhSIiwiL1JvbGVzL0NvbnRyYWN0b3JQYXkvRWxlbWVudHNBZG1pbiIsIi9Sb2xlcy9MUFBDL0VsZW1lbnRzVXNlciIsIi9ab25lcy9FVS9Pcmdhbml6YXRpb25zL1NlcnZpY2VfQ29uc3VtZXJzL0RTTSBOdXRyaXRpb25hbCBQcm9kdWN0cy9MUFBDL0VsZW1lbnRzVXNlciIsIi9ab25lcy9FVS9Pcmdhbml6YXRpb25zL1NlcnZpY2VfQ29uc3VtZXJzL0NvY2EtQ29sYS9MUFBDL0VsZW1lbnRzVXNlciIsIi9ab25lcy9FVS9Pcmdhbml6YXRpb25zL0F0bGFzX093bmVycy9FR1MvUGF5bWVudHMvRmluYW5jZUFSIiwiL1pvbmVzL0VVL09yZ2FuaXphdGlvbnMvU2VydmljZV9Db25zdW1lcnMvQXZpYXQgTmV0d29ya3MgUFRFIEx0ZC9QYXltZW50cy9GaW5hbmNlQVIiLCIvUm9sZXMvUGF5bWVudHMvRmluYW5jZUFSIiwiL1pvbmVzL0VVL09yZ2FuaXphdGlvbnMvU2VydmljZV9Db25zdW1lcnMvQXZpYXQgTmV0d29ya3MgKFMpIFB0ZSBMdGQgKEVVUikvUGF5bWVudHMvRmluYW5jZUFSIiwiL1pvbmVzL0VVL09yZ2FuaXphdGlvbnMvU2VydmljZV9Db25zdW1lcnMvRFNNIE51dHJpdGlvbmFsIFByb2R1Y3RzL1BheW1lbnRzL0ZpbmFuY2VBUiIsIi9ab25lcy9FVS9Pcmdhbml6YXRpb25zL1NlcnZpY2VfQ29uc3VtZXJzL0NvY2EtQ29sYS9QYXltZW50cy9GaW5hbmNlQVIiLCIvUm9sZXMvQ29yZUhSL0ludGVybmFsSFIiLCIvWm9uZXMvRVUvT3JnYW5pemF0aW9ucy9TZXJ2aWNlX0NvbnN1bWVycy8ke05hbWV9L0NvcmVIUi9JbnRlcm5hbEhSIiwiL1pvbmVzL0VVL09yZ2FuaXphdGlvbnMvU2VydmljZV9Db25zdW1lcnMvRFNNIE51dHJpdGlvbmFsIFByb2R1Y3RzL0NvcmVIUi9JbnRlcm5hbEhSIiwiL1JvbGVzL0NvcmVIUi9JbnRlcm5hbEhSQWRtaW4iLCIvU3Vic2NyaXB0aW9ucy9MUFBDIiwiL1N1YnNjcmlwdGlvbnMvUGF5bWVudHMiXSwicHJlZmVycmVkX3VzZXJuYW1lIjoiZHNtbnV0cml0aW9uYWxwcm9kdWN0c19lbGVtZW50c2FkbWluQHByb3Rvbm1haWwuY29tIiwiZ2l2ZW5fbmFtZSI6IkZpbmFuY2VBUiIsImVtYWlsIjoiZHNtbnV0cml0aW9uYWxwcm9kdWN0c19lbGVtZW50c2FkbWluQHByb3Rvbm1haWwuY29tIn0.djXWs7HZ7JgsAlSD26JCpPI5bba0FNqAPJcUukhmfoF1emfsg2ZV35j2X69DzfR6jm6oih4a4yinjSnC6uwVSRmDW7Z-3--sPuac6Zpk6YzcB_edf4dzg8W6tAz5L4gIdpYjjK2gif5y9Qxytx-hVGmc23G3is9MPCMCCz29YEWn7ydLkWg7ILrlZCQ_K_JWFHZlQ_G-gkZT12W8H90HvZrNTpj12YMNktKEL-VEtMJ58nB2tc6ze0getVTDPFQGJOlyfxM4VcMhGnmZT4aTomRGb25EaHh1zuB9mCysggFdkIbfvNL8Eb7UBLKSg4106PQyxiNUFso-BghGe1SGqg"
  );
localStorage.setItem("current-org", JSON.stringify(currentOrgTokenMock));
localStorage.setItem("current-org-id", "E291C9F0-2476-4238-85CB-7AFECDD085E4");
const id = "a9bbee6d-797a-4724-a86a-5b1a2e28763f";
const customerId = "a9bbee6d-797a-4724-a86a-5b1a2e28763f";
const countryId = "7defc4f9-906d-437f-a6d9-c822ca2ecfd7";
const monthId = 1;
const yearId = 2022;

const stepperOneData = {
  customer: "DSM Nutritional Products AG",
  type: "Credit Memo",
  country: "",
  month: "",
  year: "",
  customerId: "A9BBEE6D-797A-4724-A86A-5B1A2E28763F",
  countryId: "",
  typeId: 4,
  yearId: "",
  monthId: "",
};

const todos = [
  {
    id: 0.4633734736448569,
    date: "17 Jun 2022",
    product: "Advisory Services",
    description: "Desc2",
    country: "ABW -- Aruba",
    quantity: "1",
    amount: "2",
  },
];

const invoiceId = "cbb51dc8-8529-4afa-bf72-d2615163a9a6";

describe("New Invoice", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock
      .onGet(urls.allPayrollCustomerSubscriptionapi)
      .reply(200, mockapidata.resGetCustomerWithSuscription);

    mock
      .onGet(getCountryByCustomer(id))
      .reply(200, mockapidata.resGetAllCountry);
  });

  test("breadcumbs are working", async () => {
    render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const newInvoice = await screen.findAllByText(/New Invoice/);

    expect(newInvoice[0]).toBeInTheDocument();
    const invoiceBreadClick = await screen.findAllByText(/Invoices/);
    expect(invoiceBreadClick[0]).toBeInTheDocument();
    fireEvent.click(invoiceBreadClick[0]);
  });
  test("dropDown Value change stepper 1", async () => {
    render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const newInvoice = await screen.findAllByText(/New Invoice/);

    expect(newInvoice[0]).toBeInTheDocument();

    let pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    const monthDropDown = await screen.findByText(/Select Month/);
    expect(monthDropDown).toBeInTheDocument();
    fireEvent.click(monthDropDown);

    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    const yearDropDown = await screen.findByText(/Select Year/);
    expect(yearDropDown).toBeInTheDocument();
    fireEvent.click(yearDropDown);

    const YearDropValue = await screen.findAllByText(/2022/);
    expect(YearDropValue[0]).toBeInTheDocument();
    fireEvent.click(YearDropValue[0]);
  });
});

describe("step one getCustomerSubscription api fail ", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);
    mock
      .onGet(urls.allPayrollCustomerSubscriptionapi)
      .reply(400, mockapidata.resGetCustomerWithSuscription);
  });

  test("dropDown Value change", async () => {
    render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const newInvoice = await screen.findAllByText(/New Invoice/);
    expect(newInvoice[0]).toBeInTheDocument();

    expect(newInvoice[0]).toBeInTheDocument();
    let pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);
  });
});

describe("step one getCOuntry api fail", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock
      .onGet(urls.allPayrollCustomerSubscriptionapi)
      .reply(200, mockapidata.resGetCustomerWithSuscription);

    mock
      .onGet(getCountryByCustomer(id))
      .reply(400, mockapidata.resGetAllCountry);
  });

  test("dropDown Value change", async () => {
    render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const newInvoice = await screen.findAllByText(/New Invoice/);

    expect(newInvoice[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);
  });
});

describe("Stepper 2", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock
      .onGet(urls.allPayrollCustomerSubscriptionapi)
      .reply(200, mockapidata.resGetCustomerWithSuscription);

    mock
      .onGet(getCountryByCustomer(id))
      .reply(200, mockapidata.resGetAllCountry);
    mock
      .onGet(getEmployee(customerId, countryId, monthId, yearId))
      .reply(200, mockapidata.resForStepperTwo);
    mock
      .onPost(createManualInvoice())
      .reply(200, mockapidata.resForCreateManualInvoice);


    mock.onGet(urls.fee).reply(200, mockapidata.resFeeData);

    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);

    mock
      .onGet(getBillingAddressUrl(customerId))
      .reply(200, mockapidata.resAddressData);

    mock
      .onGet(getInvoiceDetailsUrl("e9a959b9-a1a2-486e-938c-de1b8bac4b03"))
      .reply(200, mockapidata.resForInvoiceDetail);

    mock
      .onGet(updateInvoiceStatus("e9a959b9-a1a2-486e-938c-de1b8bac4b03"))
      .reply(201, {});
  });

  test("dropDown Value change stepper 1 then stepper 2 click on  back button", async () => {
    render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const newInvoice = await screen.findAllByText(/New Invoice/);

    expect(newInvoice[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findAllByText(/2022/);
    expect(YearDropValue[0]).toBeInTheDocument();
    fireEvent.click(YearDropValue[0]);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const stepTwoBackButton = await screen.findByTestId("back-button");
    expect(stepTwoBackButton).toBeInTheDocument();
    fireEvent.click(stepTwoBackButton);
  });
  test("dropDown Value change stepper 1 then stepper 2 complete and next button then row click in select table data stepper 3 then finish ", async () => {
    const { container } = render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const payrollTab = await screen.findAllByText(/New Invoice/);

    expect(payrollTab[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findAllByText(/2022/);
    expect(YearDropValue[0]).toBeInTheDocument();
    fireEvent.click(YearDropValue[0]);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const billedPayrollItem = await screen.findAllByText(
      /Show Billed Payroll Items/
    );
    fireEvent.click(billedPayrollItem[0]);

    //again click for false the checkbox
    fireEvent.click(billedPayrollItem[0]);

    const SelectEmployeeName = await screen.findAllByText(/Thomas George/);
    expect(SelectEmployeeName[0]).toBeInTheDocument();

    //again click for true the checkbox
    fireEvent.click(billedPayrollItem[0]);

    const showHideButton = await screen.findByTestId("showHide-button");
    expect(showHideButton).toBeInTheDocument();
    fireEvent.click(showHideButton);

    const amount = await screen.findAllByText(/71000/);
    expect(amount[0]).toBeInTheDocument();

    const labelText = await screen.findAllByLabelText("");
    fireEvent.click(labelText[1]);

    const stepTwoNextButton = await screen.findByTestId("next-button");
    expect(stepTwoNextButton).toBeInTheDocument();
    fireEvent.click(stepTwoNextButton);

    const previewText = await screen.findAllByText(
      /Please preview the new payroll invoice has been created./
    );
    expect(previewText[0]).toBeInTheDocument();

    const previewModal = await screen.findByTestId("preview-modal");
    expect(previewModal).toBeInTheDocument();
    fireEvent.click(previewModal);

    const closeButton = container.querySelector(".close");

    fireEvent.click(closeButton);

    const stepTwoNextButtonw = await screen.findByTestId("next-button");
    expect(stepTwoNextButtonw).toBeInTheDocument();
    fireEvent.click(stepTwoNextButtonw);

    const donetext = await screen.findAllByText(/You're done!/);
    expect(donetext[0]).toBeInTheDocument();

    const Go_Invoice = await screen.findByTestId("Go_Invoice");
    expect(Go_Invoice).toBeInTheDocument();
    fireEvent.click(Go_Invoice);
  });


  test("dropDown Value change stepper 1 then stepper 2 complete and next button previous recalculate part", async () => {
    const { container } = render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const payrollTab = await screen.findAllByText(/New Invoice/);

    expect(payrollTab[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findAllByText(/2022/);
    expect(YearDropValue[0]).toBeInTheDocument();
    fireEvent.click(YearDropValue[0]);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const billedPayrollItem = await screen.findAllByText(
      /Show Billed Payroll Items/
    );
    fireEvent.click(billedPayrollItem[0]);

    //again click for false the checkbox
    fireEvent.click(billedPayrollItem[0]);

    const SelectEmployeeName = await screen.findAllByText(/Thomas George/);
    expect(SelectEmployeeName[0]).toBeInTheDocument();

    //again click for true the checkbox
    fireEvent.click(billedPayrollItem[0]);

    const showHideButton = await screen.findByTestId("showHide-button");
    expect(showHideButton).toBeInTheDocument();
    fireEvent.click(showHideButton);

    const amount = await screen.findAllByText(/71000/);
    expect(amount[0]).toBeInTheDocument();

    const labelText = await screen.findAllByLabelText("");
    fireEvent.click(labelText[1]);

    const stepTwoNextButton = await screen.findByTestId("next-button");
    expect(stepTwoNextButton).toBeInTheDocument();
    fireEvent.click(stepTwoNextButton);

    const previewText = await screen.findAllByText(
      /Please preview the new payroll invoice has been created./
    );
    expect(previewText[0]).toBeInTheDocument();

    //Previous button for recal
    const stepTwoBackButton = await screen.findByTestId("back-button");
    expect(stepTwoBackButton).toBeInTheDocument();
    fireEvent.click(stepTwoBackButton);

    //again click for true the checkbox
    //fireEvent.click(billedPayrollItem[0]);

    const SelectEmployeeName1 = await screen.findAllByText(/Thomas George/);
    expect(SelectEmployeeName1[0]).toBeInTheDocument();

    const showHideButton1 = await screen.findByTestId("showHide-button");
    expect(showHideButton1).toBeInTheDocument();
    fireEvent.click(showHideButton1);

    const labelText1 = await screen.findAllByLabelText("");
    fireEvent.click(labelText1[1]);

    const stepTwoNextButton1 = await screen.findByTestId("next-button");
    expect(stepTwoNextButton1).toBeInTheDocument();
    fireEvent.click(stepTwoNextButton1);

  });



});

describe("Stepper 2 show table click", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock
      .onGet(urls.allPayrollCustomerSubscriptionapi)
      .reply(200, mockapidata.resGetCustomerWithSuscription);

    mock
      .onGet(getCountryByCustomer(id))
      .reply(200, mockapidata.resGetAllCountry);
    mock
      .onGet(getEmployee(customerId, countryId, monthId, yearId))
      .reply(200, mockapidata.resForStepperTwo);
  });

  test("dropDown Value change stepper 1 then stepper 2 click on  ", async () => {
    render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const newInvoice = await screen.findAllByText(/New Invoice/);

    expect(newInvoice[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findAllByText(/2022/);
    expect(YearDropValue[0]).toBeInTheDocument();
    fireEvent.click(YearDropValue[0]);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const showTable = await screen.findByTestId("showHide-button");
    expect(showTable).toBeInTheDocument();
    fireEvent.click(showTable);
  });
});

describe("Stepper 2 api fail", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock
      .onGet(urls.allPayrollCustomerSubscriptionapi)
      .reply(200, mockapidata.resGetCustomerWithSuscription);

    mock
      .onGet(getCountryByCustomer(id))
      .reply(200, mockapidata.resGetAllCountry);
    mock
      .onGet(getEmployee(customerId, countryId, monthId, yearId))
      .reply(200, mockapidata.resForStepperTwo);
    mock
      .onPost(createManualInvoice())
      .reply(500, mockapidata.resForCreateManualInvoice);
      mock.onPost(calculateInvoiceUrl())
      .reply(500,mockapidata.resForRecalInvoice);
  });

  test("dropDown Value change stepper 1 then stepper 2 complete and next button then row click in select table data   stepper 3 then finish 1", async () => {
    const { container } = render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const payrollTab = await screen.findAllByText(/New Invoice/);

    expect(payrollTab[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findAllByText(/2022/);
    expect(YearDropValue[0]).toBeInTheDocument();
    fireEvent.click(YearDropValue[0]);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const billedPayrollItem = await screen.findAllByText(
      /Show Billed Payroll Items/
    );

    fireEvent.click(billedPayrollItem[0]);

    //again click for false the checkbox
    fireEvent.click(billedPayrollItem[0]);

    const SelectEmployeeName = await screen.findAllByText(/Thomas George/);
    expect(SelectEmployeeName[0]).toBeInTheDocument();

    //again click for true the checkbox
    fireEvent.click(billedPayrollItem[0]);

    const showHideButton = await screen.findByTestId("showHide-button");
    expect(showHideButton).toBeInTheDocument();
    fireEvent.click(showHideButton);

    const amount = await screen.findAllByText(/71000/);
    expect(amount[0]).toBeInTheDocument();

    const labelText = await screen.findAllByLabelText("");
    fireEvent.click(labelText[1]);

    const stepTwoNextButton = await screen.findByTestId("next-button");
    expect(stepTwoNextButton).toBeInTheDocument();
    fireEvent.click(stepTwoNextButton);
  });
});
describe("Stepper 2 getEmployee exceptional error api fail  ", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock
      .onGet(urls.allPayrollCustomerSubscriptionapi)
      .reply(200, mockapidata.resGetCustomerWithSuscription);

    mock
      .onGet(getCountryByCustomer(id))
      .reply(200, mockapidata.resGetAllCountry);
    mock
      .onGet(getEmployee(customerId, countryId, monthId, yearId))
      .reply(500, "dfg");
  });

  test("dropDown Value change stepper 1 then stepper 2 complete and next button then row click in select table data   stepper 3 then finish 2", async () => {
    const { container } = render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const payrollTab = await screen.findAllByText(/New Invoice/);

    expect(payrollTab[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findAllByText(/2022/);
    expect(YearDropValue[0]).toBeInTheDocument();
    fireEvent.click(YearDropValue[0]);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const errorText = await screen.findByText(
      /An error occurred while fetching employees for this customer/
    );
    expect(errorText).toBeInTheDocument();
  });
});
describe("Stepper 2 getEmployee No Emplyee Error api fail  ", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock
      .onGet(urls.allPayrollCustomerSubscriptionapi)
      .reply(200, mockapidata.resGetCustomerWithSuscription);

    mock
      .onGet(getCountryByCustomer(id))
      .reply(200, mockapidata.resGetAllCountry);
    mock
      .onGet(getEmployee(customerId, countryId, monthId, yearId))
      .reply(500, "No Employees found under this customer");
  });

  test("dropDown Value change stepper 1 then stepper 2 complete and next button then row click in select table data   stepper 3 then finish 3", async () => {
    const { container } = render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const payrollTab = await screen.findAllByText(/New Invoice/);

    expect(payrollTab[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findAllByText(/2022/);
    expect(YearDropValue[0]).toBeInTheDocument();
    fireEvent.click(YearDropValue[0]);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const errorText = await screen.findByText(
      /No Employees found under this customer/
    );
    expect(errorText).toBeInTheDocument();
  });
});

describe("Stepper 3", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock
      .onGet(urls.allPayrollCustomerSubscriptionapi)
      .reply(200, mockapidata.resGetCustomerWithSuscription);

    mock
      .onGet(getCountryByCustomer(id))
      .reply(200, mockapidata.resGetAllCountry);
    mock
      .onGet(getEmployee(customerId, countryId, monthId, yearId))
      .reply(200, mockapidata.resForStepperTwo);
    mock
      .onPost(createManualInvoice())
      .reply(200, mockapidata.resForCreateManualInvoice);
      mock.onPost(calculateInvoiceUrl())
      .reply(200,mockapidata.resForRecalInvoice);

    mock.onGet(urls.fee).reply(200, mockapidata.resFeeData);

    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);

    mock
      .onGet(getBillingAddressUrl(customerId))
      .reply(200, mockapidata.resAddressData);

    mock
      .onGet(getInvoiceDetailsUrl("e9a959b9-a1a2-486e-938c-de1b8bac4b03"))
      .reply(200, mockapidata.resForInvoiceDetail);
  });

  test("dropDown Value change stepper 1 then stepper 2 complete and next button", async () => {
    render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const payrollTab = await screen.findAllByText(/New Invoice/);

    expect(payrollTab[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findAllByText(/2022/);
    expect(YearDropValue[0]).toBeInTheDocument();
    fireEvent.click(YearDropValue[0]);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const stepTwoNextButton = await screen.findByTestId("next-button");
    expect(stepTwoNextButton).toBeInTheDocument();
    fireEvent.click(stepTwoNextButton);
  });

  test("dropDown Value change stepper 1 then stepper 2 click on  back button", async () => {
    render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const newInvoice = await screen.findAllByText(/New Invoice/);

    expect(newInvoice[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findAllByText(/2022/);
    expect(YearDropValue[0]).toBeInTheDocument();
    fireEvent.click(YearDropValue[0]);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const stepTwoBackButton = await screen.findByTestId("back-button");
    expect(stepTwoBackButton).toBeInTheDocument();
    fireEvent.click(stepTwoBackButton);
  });
  test("dropDown Value change stepper 1 then stepper 2 complete and next button then row click in select table data stepper 3 then finish ", async () => {
    const { container } = render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const payrollTab = await screen.findAllByText(/New Invoice/);

    expect(payrollTab[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findAllByText(/2022/);
    expect(YearDropValue[0]).toBeInTheDocument();
    fireEvent.click(YearDropValue[0]);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const billedPayrollItem = await screen.findAllByText(
      /Show Billed Payroll Items/
    );
    fireEvent.click(billedPayrollItem[0]);

    //again click for false the checkbox
    fireEvent.click(billedPayrollItem[0]);

    const SelectEmployeeName = await screen.findAllByText(/Thomas George/);
    expect(SelectEmployeeName[0]).toBeInTheDocument();

    //again click for true the checkbox
    fireEvent.click(billedPayrollItem[0]);

    const showHideButton = await screen.findByTestId("showHide-button");
    expect(showHideButton).toBeInTheDocument();
    fireEvent.click(showHideButton);

    const amount = await screen.findAllByText(/71000/);
    expect(amount[0]).toBeInTheDocument();

    const labelText = await screen.findAllByLabelText("");
    fireEvent.click(labelText[1]);

    const stepTwoNextButton = await screen.findByTestId("next-button");
    expect(stepTwoNextButton).toBeInTheDocument();
    fireEvent.click(stepTwoNextButton);

    const previewText = await screen.findAllByText(
      /Please preview the new payroll invoice has been created./
    );
    expect(previewText[0]).toBeInTheDocument();

    const previewModal = await screen.findByTestId("preview-modal");
    expect(previewModal).toBeInTheDocument();
    fireEvent.click(previewModal);

    // const fromText = await screen.findAllByText(/Elements Holdings Group Ltd/);
    // expect(fromText[0]).toBeInTheDocument();
  });
});

describe("Stepper 3 invoice detail api fail", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock
      .onGet(urls.allPayrollCustomerSubscriptionapi)
      .reply(200, mockapidata.resGetCustomerWithSuscription);

    mock
      .onGet(getCountryByCustomer(id))
      .reply(200, mockapidata.resGetAllCountry);
    mock
      .onGet(getEmployee(customerId, countryId, monthId, yearId))
      .reply(200, mockapidata.resForStepperTwo);
    mock
      .onPost(createManualInvoice())
      .reply(200, mockapidata.resForCreateManualInvoice);
      mock.onPost(calculateInvoiceUrl())
      .reply(200,mockapidata.resForRecalInvoice);

    mock.onGet(urls.fee).reply(200, mockapidata.resFeeData);

    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);

    mock
      .onGet(getBillingAddressUrl(customerId))
      .reply(200, mockapidata.resAddressData);

    mock
      .onGet(getInvoiceDetailsUrl("e9a959b9-a1a2-486e-938c-de1b8bac4b03"))
      .reply(500, mockapidata.resForInvoiceDetail);
    mock
      .onGet(updateInvoiceStatus("e9a959b9-a1a2-486e-938c-de1b8bac4b03"))
      .reply(201, {});
  });

  test("dropDown Value change stepper 1 then stepper 2 complete and next button", async () => {
    render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const payrollTab = await screen.findAllByText(/New Invoice/);

    expect(payrollTab[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findAllByText(/2022/);
    expect(YearDropValue[0]).toBeInTheDocument();
    fireEvent.click(YearDropValue[0]);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const stepTwoNextButton = await screen.findByTestId("next-button");
    expect(stepTwoNextButton).toBeInTheDocument();
    fireEvent.click(stepTwoNextButton);
  });

  test("dropDown Value change stepper 1 then stepper 2 click on  back button", async () => {
    render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const newInvoice = await screen.findAllByText(/New Invoice/);

    expect(newInvoice[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findAllByText(/2022/);
    expect(YearDropValue[0]).toBeInTheDocument();
    fireEvent.click(YearDropValue[0]);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const stepTwoBackButton = await screen.findByTestId("back-button");
    expect(stepTwoBackButton).toBeInTheDocument();
    fireEvent.click(stepTwoBackButton);
  });
  test("dropDown Value change stepper 1 then stepper 2 complete and next button then row click in select table data   stepper 3 then finish 4", async () => {
    const { container } = render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const payrollTab = await screen.findAllByText(/New Invoice/);

    expect(payrollTab[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findAllByText(/2022/);
    expect(YearDropValue[0]).toBeInTheDocument();
    fireEvent.click(YearDropValue[0]);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const billedPayrollItem = await screen.findAllByText(
      /Show Billed Payroll Items/
    );
    fireEvent.click(billedPayrollItem[0]);

    //again click for false the checkbox
    fireEvent.click(billedPayrollItem[0]);

    const SelectEmployeeName = await screen.findAllByText(/Thomas George/);
    expect(SelectEmployeeName[0]).toBeInTheDocument();

    //again click for true the checkbox
    fireEvent.click(billedPayrollItem[0]);

    const showHideButton = await screen.findByTestId("showHide-button");
    expect(showHideButton).toBeInTheDocument();
    fireEvent.click(showHideButton);

    const amount = await screen.findAllByText(/71000/);
    expect(amount[0]).toBeInTheDocument();

    const labelText = await screen.findAllByLabelText("");
    fireEvent.click(labelText[1]);

    const stepTwoNextButton = await screen.findByTestId("next-button");
    expect(stepTwoNextButton).toBeInTheDocument();
    fireEvent.click(stepTwoNextButton);
  });
});

describe("Stepper 3 fee api fail", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock
      .onGet(urls.allPayrollCustomerSubscriptionapi)
      .reply(200, mockapidata.resGetCustomerWithSuscription);

    mock
      .onGet(getCountryByCustomer(id))
      .reply(200, mockapidata.resGetAllCountry);
    mock
      .onGet(getEmployee(customerId, countryId, monthId, yearId))
      .reply(200, mockapidata.resForStepperTwo);
    mock
      .onPost(createManualInvoice())
      .reply(200, mockapidata.resForCreateManualInvoice);
      mock.onPost(calculateInvoiceUrl())
      .reply(200,mockapidata.resForRecalInvoice);

    mock.onGet(urls.fee).reply(500, mockapidata.resFeeData);

    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);

    mock
      .onGet(getBillingAddressUrl(customerId))
      .reply(200, mockapidata.resAddressData);

    mock
      .onGet(getInvoiceDetailsUrl("e9a959b9-a1a2-486e-938c-de1b8bac4b03"))
      .reply(200, mockapidata.resForInvoiceDetail);
  });

  test("dropDown Value change stepper 1 then stepper 2 click on  back button", async () => {
    render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const newInvoice = await screen.findAllByText(/New Invoice/);

    expect(newInvoice[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findAllByText(/2022/);
    expect(YearDropValue[0]).toBeInTheDocument();
    fireEvent.click(YearDropValue[0]);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const stepTwoBackButton = await screen.findByTestId("back-button");
    expect(stepTwoBackButton).toBeInTheDocument();
    fireEvent.click(stepTwoBackButton);
  });
  test("dropDown Value change stepper 1 then stepper 2 complete and next button then row click in select table data   stepper 3 then finish 5", async () => {
    const { container } = render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const payrollTab = await screen.findAllByText(/New Invoice/);

    expect(payrollTab[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findAllByText(/2022/);
    expect(YearDropValue[0]).toBeInTheDocument();
    fireEvent.click(YearDropValue[0]);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const billedPayrollItem = await screen.findAllByText(
      /Show Billed Payroll Items/
    );
    fireEvent.click(billedPayrollItem[0]);

    //again click for false the checkbox
    fireEvent.click(billedPayrollItem[0]);

    const SelectEmployeeName = await screen.findAllByText(/Thomas George/);
    expect(SelectEmployeeName[0]).toBeInTheDocument();

    //again click for true the checkbox
    fireEvent.click(billedPayrollItem[0]);

    const showHideButton = await screen.findByTestId("showHide-button");
    expect(showHideButton).toBeInTheDocument();
    fireEvent.click(showHideButton);

    const amount = await screen.findAllByText(/71000/);
    expect(amount[0]).toBeInTheDocument();

    const labelText = await screen.findAllByLabelText("");
    fireEvent.click(labelText[1]);

    const stepTwoNextButton = await screen.findByTestId("next-button");
    expect(stepTwoNextButton).toBeInTheDocument();
    fireEvent.click(stepTwoNextButton);
  });
});

describe("Stepper 3 address api fail", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock
      .onGet(urls.allPayrollCustomerSubscriptionapi)
      .reply(200, mockapidata.resGetCustomerWithSuscription);

    mock
      .onGet(getCountryByCustomer(id))
      .reply(200, mockapidata.resGetAllCountry);
    mock
      .onGet(getEmployee(customerId, countryId, monthId, yearId))
      .reply(200, mockapidata.resForStepperTwo);
    mock
      .onPost(createManualInvoice())
      .reply(200, mockapidata.resForCreateManualInvoice);
      mock.onPost(calculateInvoiceUrl())
      .reply(200,mockapidata.resForRecalInvoice);

    mock.onGet(urls.fee).reply(200, mockapidata.resFeeData);

    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);

    mock
      .onGet(getBillingAddressUrl(customerId))
      .reply(500, mockapidata.resAddressData);

    mock
      .onGet(getInvoiceDetailsUrl("e9a959b9-a1a2-486e-938c-de1b8bac4b03"))
      .reply(200, mockapidata.resForInvoiceDetail);
  });

  test("dropDown Value change stepper 1 then stepper 2 complete and next button", async () => {
    render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const payrollTab = await screen.findAllByText(/New Invoice/);

    expect(payrollTab[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findAllByText(/2022/);
    expect(YearDropValue[0]).toBeInTheDocument();
    fireEvent.click(YearDropValue[0]);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const stepTwoNextButton = await screen.findByTestId("next-button");
    expect(stepTwoNextButton).toBeInTheDocument();
    fireEvent.click(stepTwoNextButton);
  });

  test("dropDown Value change stepper 1 then stepper 2 click on  back button", async () => {
    render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const newInvoice = await screen.findAllByText(/New Invoice/);

    expect(newInvoice[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findAllByText(/2022/);
    expect(YearDropValue[0]).toBeInTheDocument();
    fireEvent.click(YearDropValue[0]);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const stepTwoBackButton = await screen.findByTestId("back-button");
    expect(stepTwoBackButton).toBeInTheDocument();
    fireEvent.click(stepTwoBackButton);
  });
  test("dropDown Value change stepper 1 then stepper 2 complete and next button then row click in select table data   stepper 3 then finish 6", async () => {
    const { container } = render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const payrollTab = await screen.findAllByText(/New Invoice/);

    expect(payrollTab[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findAllByText(/2022/);
    expect(YearDropValue[0]).toBeInTheDocument();
    fireEvent.click(YearDropValue[0]);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const billedPayrollItem = await screen.findAllByText(
      /Show Billed Payroll Items/
    );
    fireEvent.click(billedPayrollItem[0]);

    //again click for false the checkbox
    fireEvent.click(billedPayrollItem[0]);

    const SelectEmployeeName = await screen.findAllByText(/Thomas George/);
    expect(SelectEmployeeName[0]).toBeInTheDocument();

    //again click for true the checkbox
    fireEvent.click(billedPayrollItem[0]);

    const showHideButton = await screen.findByTestId("showHide-button");
    expect(showHideButton).toBeInTheDocument();
    fireEvent.click(showHideButton);

    const amount = await screen.findAllByText(/71000/);
    expect(amount[0]).toBeInTheDocument();

    const labelText = await screen.findAllByLabelText("");
    fireEvent.click(labelText[1]);

    const stepTwoNextButton = await screen.findByTestId("next-button");
    expect(stepTwoNextButton).toBeInTheDocument();
    fireEvent.click(stepTwoNextButton);
  });
});

describe("Stepper 3 country api fail", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock
      .onGet(urls.allPayrollCustomerSubscriptionapi)
      .reply(200, mockapidata.resGetCustomerWithSuscription);

    mock
      .onGet(getCountryByCustomer(id))
      .reply(200, mockapidata.resGetAllCountry);
    mock
      .onGet(getEmployee(customerId, countryId, monthId, yearId))
      .reply(200, mockapidata.resForStepperTwo);
    mock
      .onPost(createManualInvoice())
      .reply(200, mockapidata.resForCreateManualInvoice);
      mock.onPost(calculateInvoiceUrl())
        .reply(200,mockapidata.resForRecalInvoice);

    mock.onGet(urls.fee).reply(200, mockapidata.resFeeData);

    mock.onGet(urls.countries).reply(500, mockapidata.resCountriesData);

    mock
      .onGet(getBillingAddressUrl(customerId))
      .reply(200, mockapidata.resAddressData);

    mock
      .onGet(getInvoiceDetailsUrl("e9a959b9-a1a2-486e-938c-de1b8bac4b03"))
      .reply(200, mockapidata.resForInvoiceDetail);
  });

  test("dropDown Value change stepper 1 then stepper 2 complete and next button", async () => {
    render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const payrollTab = await screen.findAllByText(/New Invoice/);

    expect(payrollTab[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findAllByText(/2022/);
    expect(YearDropValue[0]).toBeInTheDocument();
    fireEvent.click(YearDropValue[0]);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const stepTwoNextButton = await screen.findByTestId("next-button");
    expect(stepTwoNextButton).toBeInTheDocument();
    fireEvent.click(stepTwoNextButton);
  });

  test("dropDown Value change stepper 1 then stepper 2 click on  back button", async () => {
    render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const newInvoice = await screen.findAllByText(/New Invoice/);

    expect(newInvoice[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findAllByText(/2022/);
    expect(YearDropValue[0]).toBeInTheDocument();
    fireEvent.click(YearDropValue[0]);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const stepTwoBackButton = await screen.findByTestId("back-button");
    expect(stepTwoBackButton).toBeInTheDocument();
    fireEvent.click(stepTwoBackButton);
  });
  test("dropDown Value change stepper 1 then stepper 2 complete and next button then row click in select table data   stepper 3 then finish 7", async () => {
    const { container } = render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const payrollTab = await screen.findAllByText(/New Invoice/);

    expect(payrollTab[0]).toBeInTheDocument();
    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const typeDropDownValue = await screen.findByText(/Payroll/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const countryDropDown = await screen.findByText("Countries");
    fireEvent.click(countryDropDown);

    const countryDropValue = await screen.findByText(/Kenya/);
    expect(countryDropValue).toBeInTheDocument();
    fireEvent.click(countryDropValue);

    // fireEvent.click(pleaseSelectDropDown[2]);
    const monthDropValue = await screen.findByText(/January/);
    expect(monthDropValue).toBeInTheDocument();
    fireEvent.click(monthDropValue);

    // fireEvent.click(pleaseSelectDropDown[3]);
    const YearDropValue = await screen.findAllByText(/2022/);
    expect(YearDropValue[0]).toBeInTheDocument();
    fireEvent.click(YearDropValue[0]);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Select Employees/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const billedPayrollItem = await screen.findAllByText(
      /Show Billed Payroll Items/
    );
    fireEvent.click(billedPayrollItem[0]);

    //again click for false the checkbox
    fireEvent.click(billedPayrollItem[0]);

    const SelectEmployeeName = await screen.findAllByText(/Thomas George/);
    expect(SelectEmployeeName[0]).toBeInTheDocument();

    //again click for true the checkbox
    fireEvent.click(billedPayrollItem[0]);

    const showHideButton = await screen.findByTestId("showHide-button");
    expect(showHideButton).toBeInTheDocument();
    fireEvent.click(showHideButton);

    const amount = await screen.findAllByText(/71000/);
    expect(amount[0]).toBeInTheDocument();

    const labelText = await screen.findAllByLabelText("");
    fireEvent.click(labelText[1]);

    const stepTwoNextButton = await screen.findByTestId("next-button");
    expect(stepTwoNextButton).toBeInTheDocument();
    fireEvent.click(stepTwoNextButton);
  });
});

// test cases for Proforma

describe("New Invoice for Proforma ", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock
      .onPost(urls.getCustomersByIds)
      .reply(200, mockapidata.resForCustomersByIds);
    mock.onGet(productInvoice()).reply(200, productInvoiceMoc.productdata);
    mock.onGet(CountryApi()).reply(200, productInvoiceMoc.countrydata);

    mock
      .onGet(urls.subscriptionLookup)
      .reply(200, mockapidata.resSubscriptionsLookUp);

    mock.onGet(getVatValue("A9BBEE6D-797A-4724-A86A-5B1A2E28763F")).reply(200, mockapidata.resForVatDetail);

    jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));
  });

  test("breadcumbs are working", async () => {
    render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const newInvoice = await screen.findAllByText(/New Invoice/);

    expect(newInvoice[0]).toBeInTheDocument();
    const invoiceBreadClick = await screen.findAllByText(/Invoices/);
    expect(invoiceBreadClick[0]).toBeInTheDocument();
    fireEvent.click(invoiceBreadClick[0]);
  }, 30000);
  test("dropDown Value change stepper 1", async () => {
    render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const newInvoice = await screen.findAllByText(/New Invoice/);
    expect(newInvoice[0]).toBeInTheDocument();

    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const typeDropDownValue = await screen.findByText(/Proforma/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);
    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const dp = await waitFor(() => screen.getByRole("textbox"));
    fireEvent.click(dp);

    const selDate = await waitFor(() => screen.getAllByText(/15/));
    fireEvent.click(selDate[0]);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);
  }, 30000);
});

describe("New Invoice for Proforma vat api fail ", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    mock
      .onPost(urls.getCustomersByIds)
      .reply(200, mockapidata.resForCustomersByIds);
    mock.onGet(productInvoice()).reply(200, productInvoiceMoc.productdata);
    mock.onGet(CountryApi()).reply(200, productInvoiceMoc.countrydata);

    mock
      .onGet(urls.subscriptionLookup)
      .reply(200, mockapidata.resSubscriptionsLookUp);

    mock.onGet(getVatValue("A9BBEE6D-797A-4724-A86A-5B1A2E28763F")).reply(500, mockapidata.resForVatDetail);

    jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));
  });

  test("breadcumbs are working", async () => {
    render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const newInvoice = await screen.findAllByText(/New Invoice/);

    expect(newInvoice[0]).toBeInTheDocument();
    const invoiceBreadClick = await screen.findAllByText(/Invoices/);
    expect(invoiceBreadClick[0]).toBeInTheDocument();
    fireEvent.click(invoiceBreadClick[0]);
  }, 30000);
  test("dropDown Value change stepper 1", async () => {
    render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const newInvoice = await screen.findAllByText(/New Invoice/);
    expect(newInvoice[0]).toBeInTheDocument();

    const pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const typeDropDownValue = await screen.findByText(/Proforma/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);
    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const dp = await waitFor(() => screen.getByRole("textbox"));
    fireEvent.click(dp);

    const selDate = await waitFor(() => screen.getAllByText(/15/));
    fireEvent.click(selDate[0]);

  }, 30000);
});

describe("step one Proforma getCustomer api fail ", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);
    mock
      .onPost(urls.getCustomersByIds)
      .reply(400, mockapidata.resForCustomersByIds);
  });

  test("dropDown Value change", async () => {
    render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const newInvoice = await screen.findAllByText(/New Invoice/);
    expect(newInvoice[0]).toBeInTheDocument();

    expect(newInvoice[0]).toBeInTheDocument();
    let pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const typeDropDownValue = await screen.findByText(/Proforma/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);
  });
});

// test cases for Miscellaneous

describe("New Invoice for Miscellaneous ", () => {
  beforeEach(async () => {
    const mock = new MockAdapter(axios);

    mock
      .onPost(urls.getCustomersByIds)
      .reply(200, mockapidata.resForCustomersByIds);
    mock.onGet(productInvoice()).reply(200, productInvoiceMoc.productdata);
    mock.onGet(CountryApi()).reply(200, productInvoiceMoc.countrydata);
    mock
      .onPost(urls.createCreditMemo)
      .reply(201, mockapidata.resCreateCreditMemo);

    mock
      .onGet(urls.subscriptionLookup)
      .reply(200, mockapidata.resSubscriptionsLookUp);

    mock.onGet(urls.lookup).reply(200, mockapidata.resLookupData);

    mock.onGet(getVatValue("A9BBEE6D-797A-4724-A86A-5B1A2E28763F")).reply(200, mockapidata.resForVatDetail);

    jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));
  });

  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  test("breadcumbs are working", async () => {
    render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const newInvoice = await screen.findAllByText(/New Invoice/);

    expect(newInvoice[0]).toBeInTheDocument();
    const invoiceBreadClick = await screen.findAllByText(/Invoices/);
    expect(invoiceBreadClick[0]).toBeInTheDocument();
    fireEvent.click(invoiceBreadClick[0]);
  }, 30000);
  test("dropDown Value change stepper 1", async () => {
    render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const newInvoice = await screen.findAllByText(/New Invoice/);

    expect(newInvoice[0]).toBeInTheDocument();
    let pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const typeDropDownValue = await screen.findByText(/Miscellaneous/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const dp = await waitFor(() => screen.getByRole("textbox"));
    fireEvent.click(dp);

    const selDate = await waitFor(() => screen.getAllByText(/15/));
    fireEvent.click(selDate[0]);

    //select all drpdowns
    pleaseSelectDropDown = await screen.findAllByText(/Please Select/);

    fireEvent.click(pleaseSelectDropDown[0]);
    const invoiceDropDownValue = await screen.findByText(
      /usa\-\-unitedstatesofamerica/i
    );
    fireEvent.click(invoiceDropDownValue);
   
    const receivable = await screen.findAllByTestId(/receivable/);
    expect(receivable[0]).toBeInTheDocument();
    fireEvent.click(receivable[0]);

    fireEvent.click(pleaseSelectDropDown[2]);
    const currencyDropDownValue = await screen.findAllByText(/GBP/i);
    fireEvent.click(currencyDropDownValue[2]);

    const qb = screen.getByRole('spinbutton')
    fireEvent.change(qb, { target: { value: "1234" } });

    fireEvent.click(pleaseSelectDropDown[3]);
    const paymentTerm = await screen.findByText(/10 days/i);
    fireEvent.click(paymentTerm);

    // fireEvent.click(pleaseSelectDropDown[4]);
    // const paymentMethod = await screen.findByText(/achcredit/i);
    // fireEvent.click(paymentMethod);

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const SelectEmployeeText = await screen.findAllByText(/Add New Item/);
    expect(SelectEmployeeText[0]).toBeInTheDocument();

    const summaryText = await screen.findAllByText(/Summary/);
    expect(summaryText[0]).toBeInTheDocument();

    const dp2 = await screen.findAllByRole("textbox");
    fireEvent.click(dp2[0]);

    const serviceDate = await screen.findAllByText(/27/);
    fireEvent.click(serviceDate[1]);

    const pleaseSelectDropDownStepper2 = await screen.findAllByText(
      /Please Select/
    );
    fireEvent.click(pleaseSelectDropDownStepper2[0]);

    const DatePicket = await screen.getByTestId("Country_open");
    expect(DatePicket).toBeInTheDocument();

    const productServiceDropDownValue = await screen.findAllByText(
      /Contract Termination Fee/
    );
    expect(productServiceDropDownValue[0]).toBeInTheDocument();
    fireEvent.click(productServiceDropDownValue[0]);

    const Country = await screen.findAllByText(/Service Date/);
    expect(Country[0]).toBeInTheDocument();
    fireEvent.click(Country[0]);

    fireEvent.click(pleaseSelectDropDownStepper2[1]);
    const countryServiceDropDownValue = await screen.findAllByText(
      /AFG -- Afghanistan/
    );
    expect(countryServiceDropDownValue[0]).toBeInTheDocument();
    fireEvent.click(countryServiceDropDownValue[0]);

    const DescriptionInputField = await screen.findByPlaceholderText(
      /Enter description/
    );
    expect(DescriptionInputField).toBeInTheDocument();
    fireEvent.change(DescriptionInputField, { target: { value: "test" } });

    const QuantityInputField = await screen.findByTestId(/Quantity/);
    expect(QuantityInputField).toBeInTheDocument();
    fireEvent.change(QuantityInputField, { target: { value: 30 } });
    fireEvent.keyDown(QuantityInputField);

    const AmountInputField = await screen.findByTestId(/Amount/);
    expect(AmountInputField).toBeInTheDocument();
    fireEvent.change(AmountInputField, { target: { value: 1 } });

    const addNewText = await screen.findAllByText(/Add New Item/);
    expect(addNewText[0]).toBeInTheDocument();
    fireEvent.click(addNewText[0]);

    const DeleteText = await screen.findAllByText(/Delete/);
    expect(DeleteText[0]).toBeInTheDocument();
    fireEvent.click(DeleteText[0]);

    const nextPreview = await screen.findByTestId("next-button");
    expect(nextPreview).toBeInTheDocument();
    fireEvent.click(nextPreview);
  }, 30000);
});

/// Credit Memo

describe("Stepper for Credit Memo  1, 2 and 3 ", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);
    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);

    mock
      .onPost(urls.getCustomersByIds)
      .reply(200, mockapidata.resForCustomersByIds);
    mock.onGet(productInvoice()).reply(200, productInvoiceMoc.productdata);
    mock.onGet(CountryApi()).reply(200, productInvoiceMoc.countrydata);
    mock
      .onPost(urls.createCreditMemo)
      .reply(200, mockapidata.resCreateCreditMemo);

    mock
      .onGet(urls.subscriptionLookup)
      .reply(200, mockapidata.resSubscriptionsLookUp);

    mock.onGet(urls.lookup).reply(200, mockapidata.resLookupData);

    mock.onGet(getVatValue("A9BBEE6D-797A-4724-A86A-5B1A2E28763F")).reply(200, mockapidata.resForVatDetail);

    jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));
  });

  test("dropDown Value change stepper 1 then stepper 2 complete and next button for credit memo", async () => {
    const { container } = render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const payrollTab = await screen.findAllByText(/New Invoice/);

    expect(payrollTab[0]).toBeInTheDocument();
    let pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const typeDropDownValue = await screen.findByText(/Credit Memo/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const dp = await waitFor(() => screen.getByRole("textbox"));
    fireEvent.click(dp);

    const selDate = await waitFor(() => screen.getByText(/15/));
    fireEvent.click(selDate);

    pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);
    const invoiceDropDownValue = await screen.findByText(
      /usa\-\-unitedstatesofamerica/i
    );
    fireEvent.click(invoiceDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);
    const currencyDropDownValue = await screen.findByText(/eur/i);
    fireEvent.click(currencyDropDownValue);

    const qb = screen.getByRole('spinbutton')
    fireEvent.change(qb, { target: { value: "1234" } });

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const summaryText = await screen.findAllByText(/Summary/);
    expect(summaryText[0]).toBeInTheDocument();

    const dpp = await waitFor(() => screen.getAllByRole("textbox"));
    fireEvent.click(dpp[0]);

    const selDates = await waitFor(() => screen.getAllByText(/15/));
    fireEvent.click(selDates[2]);

    const pleaseSelectDropDownStepper2 = await screen.findAllByText(
      /Please Select/
    );
    fireEvent.click(pleaseSelectDropDownStepper2[0]);

    const productServiceDropDownValue = await screen.findAllByText(
      /Contract Termination Fee/
    );
    expect(productServiceDropDownValue[0]).toBeInTheDocument();
    fireEvent.click(productServiceDropDownValue[0]);

    fireEvent.click(pleaseSelectDropDownStepper2[1]);
    const countryServiceDropDownValue = await screen.findAllByText(
      /AFG -- Afghanistan/
    );
    expect(countryServiceDropDownValue[0]).toBeInTheDocument();
    fireEvent.click(countryServiceDropDownValue[0]);

    const DescriptionInputField = await screen.findByPlaceholderText(
      /Enter description/
    );
    expect(DescriptionInputField).toBeInTheDocument();
    fireEvent.change(DescriptionInputField, { target: { value: "test" } });

    const QuantityInputField = await screen.findByTestId(/Quantity/);
    expect(QuantityInputField).toBeInTheDocument();
    fireEvent.change(QuantityInputField, { target: { value: 30 } });

    const AmountInputField = await screen.findByTestId(/Amount/);
    expect(AmountInputField).toBeInTheDocument();
    fireEvent.change(AmountInputField, { target: { value: 1 } });
    const addNewText = await screen.findAllByText(/Add New Item/);
    expect(addNewText[0]).toBeInTheDocument();
    fireEvent.click(addNewText[0]);

    const DeleteText = await screen.findAllByText(/Delete/);
    expect(DeleteText[0]).toBeInTheDocument();
    fireEvent.click(DeleteText[0]);

    const nextPreview = await screen.findByTestId("next-button");
    expect(nextPreview).toBeInTheDocument();
    fireEvent.click(nextPreview);

    const InvoiceTab = await screen.findAllByText(/Invoice Preview/);
    expect(InvoiceTab[0]).toBeInTheDocument();

    const openModal = await screen.findAllByText(/Preview Invoice/);
    expect(openModal[0]).toBeInTheDocument();
    fireEvent.click(openModal[0]);

    const closeButton = container.querySelector(".close");
    fireEvent.click(closeButton);
  }, 30000);
});

describe("Stepper for Credit Memo  1, 2 and 3 api country fail ", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);
    mock.onGet(urls.countries).reply(500, mockapidata.resCountriesData);

    mock
      .onPost(urls.getCustomersByIds)
      .reply(200, mockapidata.resForCustomersByIds);
    mock.onGet(productInvoice()).reply(200, productInvoiceMoc.productdata);
    mock.onGet(CountryApi()).reply(200, productInvoiceMoc.countrydata);
    mock
      .onPost(urls.createCreditMemo)
      .reply(200, mockapidata.resCreateCreditMemo);

    mock
      .onGet(urls.subscriptionLookup)
      .reply(200, mockapidata.resSubscriptionsLookUp);

    mock.onGet(urls.lookup).reply(200, mockapidata.resLookupData);

    mock.onGet(getVatValue("A9BBEE6D-797A-4724-A86A-5B1A2E28763F")).reply(200, mockapidata.resForVatDetail);

    jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));
  });

  test("dropDown Value change stepper 1 then stepper 2 country api fail", async () => {
    const { container } = render(
      <HashRouter>
        <NewInvoice />
      </HashRouter>
    );

    const payrollTab = await screen.findAllByText(/New Invoice/);

    expect(payrollTab[0]).toBeInTheDocument();
    let pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);

    const typeDropDownValue = await screen.findByText(/Credit Memo/);
    expect(typeDropDownValue).toBeInTheDocument();
    fireEvent.click(typeDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);

    const customerDropValue = await screen.findByText(
      /DSM Nutritional Products AG/
    );
    expect(customerDropValue).toBeInTheDocument();
    fireEvent.click(customerDropValue);

    const dp = await waitFor(() => screen.getByRole("textbox"));
    fireEvent.click(dp);

    const selDate = await waitFor(() => screen.getByText(/15/));
    fireEvent.click(selDate);

    pleaseSelectDropDown = await screen.findAllByText(/Please Select/);
    fireEvent.click(pleaseSelectDropDown[0]);
    const invoiceDropDownValue = await screen.findByText(
      /usa\-\-unitedstatesofamerica/i
    );
    fireEvent.click(invoiceDropDownValue);

    fireEvent.click(pleaseSelectDropDown[1]);
    const currencyDropDownValue = await screen.findByText(/eur/i);
    fireEvent.click(currencyDropDownValue);

    const qb = screen.getByRole('spinbutton')
    fireEvent.change(qb, { target: { value: "1234" } });

    const nextButton = await screen.findByTestId("next-button");
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);

    const summaryText = await screen.findAllByText(/Summary/);
    expect(summaryText[0]).toBeInTheDocument();

    const dpp = await waitFor(() => screen.getAllByRole("textbox"));
    fireEvent.click(dpp[0]);

    const selDates = await waitFor(() => screen.getAllByText(/15/));
    fireEvent.click(selDates[2]);

    const pleaseSelectDropDownStepper2 = await screen.findAllByText(
      /Please Select/
    );
    fireEvent.click(pleaseSelectDropDownStepper2[0]);

    const productServiceDropDownValue = await screen.findAllByText(
      /Contract Termination Fee/
    );
    expect(productServiceDropDownValue[0]).toBeInTheDocument();
    fireEvent.click(productServiceDropDownValue[0]);

    fireEvent.click(pleaseSelectDropDownStepper2[1]);
    const countryServiceDropDownValue = await screen.findAllByText(
      /AFG -- Afghanistan/
    );
    expect(countryServiceDropDownValue[0]).toBeInTheDocument();
    fireEvent.click(countryServiceDropDownValue[0]);

    const DescriptionInputField = await screen.findByPlaceholderText(
      /Enter description/
    );
    expect(DescriptionInputField).toBeInTheDocument();
    fireEvent.change(DescriptionInputField, { target: { value: "test" } });

    const QuantityInputField = await screen.findByTestId(/Quantity/);
    expect(QuantityInputField).toBeInTheDocument();
    fireEvent.change(QuantityInputField, { target: { value: 30 } });

    const AmountInputField = await screen.findByTestId(/Amount/);
    expect(AmountInputField).toBeInTheDocument();
    fireEvent.keyDown(AmountInputField);
    fireEvent.change(AmountInputField, { target: { value: 1 } });
    const addNewText = await screen.findAllByText(/Add New Item/);
    expect(addNewText[0]).toBeInTheDocument();
    fireEvent.click(addNewText[0]);

    const DeleteText = await screen.findAllByText(/Delete/);
    expect(DeleteText[0]).toBeInTheDocument();
    fireEvent.click(DeleteText[0]);

    const nextPreview = await screen.findByTestId("next-button");
    expect(nextPreview).toBeInTheDocument();
    fireEvent.click(nextPreview);
  }, 30000);
});

describe("Invoice preview Pop", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    const tempToken = localStorage.getItem("accessToken"); //Accesstoken

    const headers = {
      headers: getHeaders(tempToken, customerId, false), //Headers
    };

    mock
      .onGet(getBillingAddressUrl(customerId), headers)
      .reply(200, mockapidata.resAddressData);

    mock
      .onGet(getRelatedInvoiceUrl(invoiceId))
      .reply(200, mockapidata.resFinalStepper);

    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);
  });
  test("final stepper", async () => {
    render(
      <HashRouter>
        <InvoicePreviewPop
          stepperOneData={stepperOneData}
          todos={todos}
          invoiceId={invoiceId}
        />
      </HashRouter>
    );
    const payrollTabs = await screen.findAllByText(/Invoice Preview/);
    expect(payrollTabs[0]).toBeInTheDocument();
  });

  test("Preview Invoice", async () => {
    render(
      <HashRouter>
        <InvoicePreviewPop
          stepperOneData={stepperOneData}
          todos={todos}
          invoiceId={invoiceId}
        />
      </HashRouter>
    );
    const PreviewButton = await screen.findByTestId("preview-button");
    fireEvent.click(PreviewButton);
  });
});

describe("Invoice preview Pop related api fail", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);

    const tempToken = localStorage.getItem("accessToken"); //Accesstoken

    const headers = {
      headers: getHeaders(tempToken, customerId, false), //Headers
    };

    mock
      .onGet(getBillingAddressUrl(customerId), headers)
      .reply(200, mockapidata.resAddressData);

    mock
      .onGet(getRelatedInvoiceUrl(invoiceId))
      .reply(500, mockapidata.resFinalStepper);

    mock.onGet(urls.countries).reply(200, mockapidata.resCountriesData);
  });
  test("final stepper", async () => {
    render(
      <HashRouter>
        <InvoicePreviewPop
          stepperOneData={stepperOneData}
          todos={todos}
          invoiceId={invoiceId}
        />
      </HashRouter>
    );
    const payrollTabs = await screen.findAllByText(/Invoice Preview/);
    expect(payrollTabs[0]).toBeInTheDocument();
  });

  test("Preview Invoice", async () => {
    render(
      <HashRouter>
        <InvoicePreviewPop
          stepperOneData={stepperOneData}
          todos={todos}
          invoiceId={invoiceId}
        />
      </HashRouter>
    );
    const PreviewButton = await screen.findByTestId("preview-button");
    fireEvent.click(PreviewButton);
  });
});

describe("final stepper", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);
    mock
      .onGet(getRelatedInvoiceUrl("0b5d231b-2fa8-4001-a737-b89328b2b6f2"))
      .reply(200, mockapidata.resFinalStepper);
  });
  test("final stepper", () => {
    render(
      <HashRouter>
        <FinishCreditMemo invoiceId="0b5d231b-2fa8-4001-a737-b89328b2b6f2" />
      </HashRouter>
    );

    const goto = screen.getByText(/Go to Invoice/);
    fireEvent.click(goto);
  }, 30000);
});

describe("final stepper with 201 status code", () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);
    mock
      .onGet(getRelatedInvoiceUrl("0b5d231b-2fa8-4001-a737-b89328b2b6f2"))
      .reply(201, mockapidata.resFinalStepper);
  });
  test("final stepper", () => {
    render(
      <HashRouter>
        <FinishCreditMemo invoiceId="0b5d231b-2fa8-4001-a737-b89328b2b6f2" />
      </HashRouter>
    );

    const goto = screen.getByText(/Go to Invoice/);
    fireEvent.click(goto);
  }, 30000);
});
