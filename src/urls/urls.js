/* istanbul ignore next */
const validateIsURLValid = () => {
  if (
    process?.env?.ATLAS_ENVIRONMENT &&
    process?.env?.ATLAS_ENVIRONMENT !== "$ATLAS_ENVIRONMENT"
  ) {
    return process?.env?.ATLAS_ENVIRONMENT;
  }
  return "dev";
};
/* istanbul ignore next */

/* istanbul ignore next */
const validateIsRegionValid = () => {
  if (
    process?.env?.ATLAS_REGION &&
    process?.env?.ATLAS_REGION !== "$ATLAS_REGION"
  ) {
    return process?.env?.ATLAS_REGION;
  }
  return "eu";
};
/* istanbul ignore next */

const baseURL = `https://apigw-${validateIsURLValid()}-${validateIsRegionValid()}.atlasbyelements.com`;
const metaDataUrl = `https://apigw-uat-emea.apnextgen.com`;

const services = {
  atlasInvoiceService: "/atlas-invoiceservice/api",
  atlasIdgService: "/atlas-idg-service/api",
  apngMetaDataService: "/metadataservice/api",
  atlasCustomerService: "/cs/api",
  contractorPayBillingService: "billingservice/api"
};

export const urls = {
  invoiceDetails:
    baseURL + services.atlasIdgService + "/InvoiceData/GetPayrollForInvoice/",
  countries:
    metaDataUrl +
    services.apngMetaDataService +
    "/lookup/Countries?includeProperties=Currency&orderBy=Name",

  fee: metaDataUrl + services.apngMetaDataService + `/Fees`,
  lookup: metaDataUrl + services.apngMetaDataService + `/Lookup`,
  voidUploadFile:
    metaDataUrl + services.apngMetaDataService + "/Blob/UploadFile",
  voidCreateDoc:
    metaDataUrl + services.apngMetaDataService + "/InvoiceDocument/Create",
  voidInvoice: baseURL + services.atlasInvoiceService + "/Invoices/voidInvoice",
  saveNote: baseURL + services.atlasInvoiceService + `/InvoiceNote/Create`,

  deleteFile:
    baseURL + services.atlasInvoiceService + "/InvoiceDocument/Delete",
  uploadFile: metaDataUrl + services.apngMetaDataService + "/Blob/UploadFile",
  createDocument:
    baseURL + services.atlasInvoiceService + "/InvoiceDocument/Create",

  declineInvoice: baseURL + services + "/Invoices/declineInvoice",
  billsPerInvoice: baseURL + services.contractorPayBillingService + "/billing/bill/GetBillDetailsPerInvoice/"
};

export const getClientListingUrl = (
  transactionTypes,
  statusType,
  dateFrom,
  dateTo
) => {
  return (
    baseURL +
    services.atlasInvoiceService +
    `/invoices/customer/filter?page=1&pageSize=10000&transactionTypes=${transactionTypes}&statuses=${statusType}&dateFrom=${dateFrom}&dateTo=${dateTo}`
  );
};

export const getInternalListingUrl = (
  transactionTypes,
  statusType,
  dateFrom,
  dateTo
) => {
  return (
    baseURL +
    services.atlasInvoiceService +
    `/invoices/filter?page=1&pageSize=10000&transactionTypes=${transactionTypes}&statuses=${statusType}&dateFrom=${dateFrom}&dateTo=${dateTo}`
  );
};

export const getGenerateSinglePdfUrl = (singleInvoiceId) => {
  return (
    baseURL +
    services.atlasInvoiceService +
    `/invoices/generatePDF/${singleInvoiceId}`
  );
};

export const getGenerateMultiplePdfUrl = (multiDownloadInvoiceId) => {
  return (
    baseURL +
    services.atlasInvoiceService +
    `/invoices/GeneratePDFMultiple/${multiDownloadInvoiceId}`
  );
};

export const getInvoiceDetailsUrl = (id) => {
  return (
    baseURL +
    services.atlasIdgService +
    "/InvoiceData/GetPayrollForInvoice/" +
    id
  );
};

export const getBillingAddressUrl = (cid) => {
  return (
    baseURL + services.atlasCustomerService + `/Customer?customerId=${cid}`
  );
};

export const getNotesUrl = (id) => {
  return baseURL + services.atlasInvoiceService + `/InvoiceNote/notes/${id}`;
};

export const getHeaders = (token, cid, isClient) => {
  return {
    authorization: `Bearer ${token}`,
    "x-apng-base-region": "EMEA",
    "x-apng-customer-id": cid || "",
    "x-apng-external": isClient,
    "x-apng-inter-region": "0",
    "x-apng-target-region": "EMEA",
    customer_id: cid || "",
  };
};

export const getDownloadUrl = (id) => {
  return baseURL + services.atlasInvoiceService + `/invoices/generatePDF/${id}`;
};

export const getApproveUrl = (id) => {
  return baseURL + services.atlasInvoiceService + `/invoices/${id}/4`;
};

export const getApproveARUrl = () => {
  return baseURL + services.atlasInvoiceService + `/Invoices/Reviewed`;
};

export const getExcelUrl = (id) => {
  return (
    baseURL + services.atlasInvoiceService + `/invoices/generateExcel/${id}`
  );
};

export const getDeleteInvoiceUrl = (invoiceId) => {
  return baseURL + services.atlasInvoiceService + `/Invoices/${invoiceId}`;
};

export const getAutoApproveCheckUrl = (id, isChecked) => {
  return (
    baseURL +
    services.atlasInvoiceService +
    `/Invoices/SaveInvoiceSetting/?invoiceId=${id}&settingTypeId=1&IsActive=${isChecked}`
  );
};

export const getDownloadFileUrl = (docurl) => {
  return (
    metaDataUrl +
    services.apngMetaDataService +
    `/Blob/getBlobUrlWithSASToken?url=${docurl}`
  );
};
