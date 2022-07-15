import { useEffect, useState } from "react";
import { Icon, Modal, Button } from "atlasuikit";
import "./InvoicePreviewPop.scss";
import { getCreditMemoStep4Data } from "../../../apis/apis";
import moment from "moment";
import axios from "axios";
import { getHeaders, urls, getBillingAddressUrl } from "../../../urls/urls";

const InvoicePreviewPop = ({
  stepperOneData,
  todos,
  invoiceId,
  // uncomment this after vat story is received and implemented
  // vatValue,
}: any) => {
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [_countriesData, setCountriesData] = useState<any>(null);
  const [billingData, setBillingData] = useState<any>(null);

  const addressApi = getBillingAddressUrl(stepperOneData.customerId); //Address api

  const tempToken = localStorage.getItem("accessToken"); //Accesstoken

  const headers = {
    headers: getHeaders(tempToken, stepperOneData.customerId, false), //Headers
  };

  useEffect(() => {
    getCreditMemoStep4Data(invoiceId)
      .then((res: any) => {
        setInvoiceData(res?.data);
      })
      .catch((err: any) => {
        console.log(err);
      });

    axios
      .get(urls.lookup)
      .then((res: any) => {
        setCountriesData(res.data.billingCurrencies);
      })
      .catch((err: any) => {
        console.log(err);
      });

    axios
      .get(addressApi, headers)
      .then((res: any) => {
        setBillingData(res?.data);
      })
      .catch((e: any) => {
        console.log("error", e);
      });
  }, []);

  const getCustlBillingCurrency = () => {
    if (invoiceData) {
      return invoiceData?.currency?.code;
    } else {
      return "";
    }
  };

  const [isCreditMemoModalOpen, setIsCreditMemoModalOpen] = useState(false);

  const emptyAmount: any = [];
  const amountPush = todos.map((item: any) =>
    emptyAmount.push(item.quantity * item.amount)
  );
  //uncomment this after vat story is received and implemented
  // const newAmount = emptyAmount.reduce(
  //   (partialSum: any, a: any) => partialSum + a,
  //   0
  // );

  // uncomment this after vat story is received and implemented
  // const vatAmount = newAmount * (vatValue / 100);

  return (
    <div id="popover_main">
      <div id="popover">
        <div id="body_main">
          <h1 id="title">Invoice Preview</h1>
          <p id="description">
            Please preview the new {stepperOneData?.type} invoice has been
            created. You can access it right from here or from the Invoices
            listing page.
          </p>
          <div className="credit-memo-preview-invoice-button">
            <Button
              data-testid="preview-button"
              label="Preview Invoice"
              className="primary-blue medium"
              handleOnClick={() => {
                setIsCreditMemoModalOpen(true);
              }}
            />
          </div>
        </div>

        {/* POPUP */}

        <div className="credit-memo-preview-modal">
          <Modal
            isOpen={isCreditMemoModalOpen}
            handleClose={() => {
              setIsCreditMemoModalOpen(false);
            }}
          >
            <div className="creditMemoModal">
              <div className="creditMemoTopBar">
                <div className="creditMemoInnerHeader">
                  <div className="creditMemoNoHeader">
                    <div className="creditMemoorderSummary">
                      <Icon color="#000" icon="orderSummary" size="large" />
                    </div>
                    <div className="creditMemoheading">
                      <p>
                        {" "}
                        {stepperOneData?.type +
                          " No. " +
                          invoiceData?.invoiceNo}
                      </p>
                    </div>
                  </div>
                  <div className="creditMemoHeaderAmount">
                    <p>
                      Open{" "}
                      <span>
                        {" "}
                        {getCustlBillingCurrency()}{" "}
                        {invoiceData?.invoiceBalance?.toLocaleString("en-US")}
                      </span>
                    </p>
                    <p>
                      Total{" "}
                      <span>
                        {" "}
                        {getCustlBillingCurrency()}{" "}
                        {invoiceData?.invoiceBalance?.toLocaleString("en-US")}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="creditMemoInfoDetails">
                <div className="column1">
                  <p className="creditMemoInvoiceHeading">From</p>
                  <p className="creditMemoInvoiceValue">
                    {invoiceData?.invoiceFrom?.companyName}
                  </p>
                  <p className="creditMemoInvoiceAddress">
                    {invoiceData?.invoiceFrom?.addressLine1}
                  </p>
                  <p className="creditMemoInvoiceAddress">
                    {invoiceData?.invoiceFrom?.addressLine2}
                  </p>
                  <p className="creditMemoInvoiceAddress">
                    {invoiceData?.invoiceFrom?.city}
                  </p>
                  <p className="creditMemoInvoiceAddress">
                    {invoiceData?.invoiceFrom?.state}
                  </p>
                  <p className="creditMemoInvoiceAddress">
                    {invoiceData?.invoiceFrom?.country}
                  </p>
                </div>
                <div>
                  <p className="creditMemoInvoiceHeading">To</p>
                  <p className="creditMemoInvoiceValue">
                    {invoiceData?.customerName}
                  </p>
                  <p className="creditMemoInvoiceAddress">
                    {billingData?.shippingAddress?.street1}
                  </p>
                  <p className="creditMemoInvoiceAddress">
                    {billingData?.shippingAddress?.street2}
                  </p>
                  <p className="creditMemoInvoiceAddress">
                    {billingData?.shippingAddress?.state},{" "}
                    {billingData?.shippingAddress?.city}
                  </p>
                  <p className="creditMemoInvoiceAddress">
                    {billingData?.shippingAddress?.country},{" "}
                    {billingData?.shippingAddress?.postalCode}
                  </p>
                </div>
                <div>
                  <p className="creditMemoInvoiceHeading">Invoice Date</p>
                  <p className="creditMemoInvoiceValue">
                    {moment(invoiceData?.createdDate).format("DD MMM YYYY")}
                  </p>

                  <p className="creditMemoInvoiceHeading">Payment Due</p>
                  <p className="creditMemoInvoiceValue">
                    {moment(invoiceData?.dueDate).format("DD MMM YYYY")}
                  </p>
                </div>
                <div className="creditMemoInvoiceLastCloumn">
                  <p className="creditMemoInvoiceHeading">Location</p>
                  <p className="creditMemoInvoiceValue">
                    {invoiceData?.customerLocation}
                  </p>
                  <p className="creditMemoInvoiceHeading">Region</p>
                  <p className="creditMemoInvoiceValue">
                    {invoiceData?.regionItemCode}
                  </p>
                  <p className="creditMemoInvoiceHeading">Billing Currency</p>
                  <p className="creditMemoInvoiceValue">
                    {getCustlBillingCurrency()}
                  </p>
                </div>
              </div>

              <div className="cards_main_div">
                {todos.map((item: any) => (
                  <div className="body_center">
                    {" "}
                    <h3 className="title">Summary</h3>
                    <div className="body_center_cards">
                      <div className="cards">
                        <div className="cards_date_container">
                          <h3>Invoice Date</h3>
                          <span className="description">{item.date}</span>
                        </div>
                        <div className="cards_date_container">
                          <h3>Service Country</h3>
                          <span className="description">{item.country}</span>
                        </div>
                      </div>
                      <div className="cards">
                        <div className="cards_date_container">
                          <h3>Product Service</h3>
                          <span className="description">{item.product}</span>
                        </div>
                        <div className="cards_date_container">
                          <h3>Quantity</h3>
                          <span className="description">{item.quantity}</span>
                        </div>
                      </div>
                      <div className="cards">
                        <div className="cards_date_container">
                          <h3>Description</h3>
                          <span className="description">
                            {item.description}
                          </span>
                        </div>
                        <div className="cards_date_container">
                          <h3>Amount</h3>
                          <span className="description">{item.amount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="invoice_bottom">
                <div className="rowBox">
                  {/*
                  uncomment this after vat story is received and implemented
                  <div className="rowFee">
                    <p className="title">Subtotal Due</p>
                    <p className="amount">
                      {getCustlBillingCurrency()}{" "}
                      {newAmount.toLocaleString("en-US")}
                    </p>
                  </div>
                  <div className="rowFee no-border">
                    <p className="title">VAT Amount</p>
                    <p className="amount">
                      {getCustlBillingCurrency()} {vatAmount.toFixed(2)}
                    </p>
                  </div> */}
                  <div className="totalRow">
                    <p>Total Balance</p>
                    <p className="total">
                      {getCustlBillingCurrency()}{" "}
                      {invoiceData?.invoiceBalance?.toLocaleString("en-US")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreviewPop;
