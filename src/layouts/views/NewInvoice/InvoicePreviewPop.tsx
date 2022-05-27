import { useState } from "react";
import { Icon, Modal, Button } from "atlasuikit";
import "./InvoicePreviewPop.scss";

const InvoicePreviewPop = ({ stepperOneData, todos }: any) => {
  const [isCreditMemoModalOpen, setIsCreditMemoModalOpen] = useState(false);

  const emptyAmount: any = [];
  const amountPush = todos.map((item: any) =>
    emptyAmount.push(item.quantity * item.amount)
  );
  const newAmount = emptyAmount.reduce((partialSum, a) => partialSum + a, 0);

  return (
    <div id="popover_main">
      <div id="popover">
        <div id="body_main">
          <h1 id="title">Invoice Preview</h1>
          <p id="description">
            Please preview the new payroll invoice has been created. You can
            access it right from here or from the Invoices listing page.
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
                      <p>{stepperOneData?.type + " No. 791230"}</p>
                    </div>
                  </div>
                  <div className="creditMemoHeaderAmount">
                    <p>
                      Open{" "}
                      <span>USD {newAmount.toLocaleString("en-US")}</span>
                    </p>
                    <p>
                      Total{" "}
                      <span>USD {newAmount.toLocaleString("en-US")}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="creditMemoInfoDetails">
                <div className="column1">
                  <p className="creditMemoInvoiceHeading">From</p>
                  <p className="creditMemoInvoiceValue">
                    Elements Global Services
                    {/* {apiData?.data?.invoiceFrom?.companyName} */}
                  </p>
                </div>
                <div>
                  <p className="creditMemoInvoiceHeading">To</p>
                  <p className="creditMemoInvoiceValue valuebold">
                    Camila Lopez
                    {/* {apiData?.data?.invoice?.customerName} */}
                  </p>
                  <p className="creditMemoInvoiceAddress">
                    1101 15th Street NW
                    {/* {addressData?.data?.billingAddress?.street} */}
                  </p>
                  <p className="creditMemoInvoiceAddress">
                    90001, Los Angeles, CA
                    {/* {addressData?.data?.billingAddress?.city} */}
                  </p>
                  <p className="creditMemoInvoiceAddress">
                    United States of America
                    {/* {addressData?.data?.billingAddress?.state} */}
                  </p>
                  <p className="creditMemoInvoiceAddress">
                    USA
                    {/* {addressData?.data?.billingAddress?.country} */}
                  </p>
                </div>
                <div>
                  <p className="creditMemoInvoiceHeading">Invoice Date</p>
                  <p className="creditMemoInvoiceValue">
                    01 Nov 2022
                    {/* {moment(apiData?.data?.invoice?.createdDate).format(
                          "DD MMM YYYY"
                        )} */}
                  </p>

                  <p className="creditMemoInvoiceHeading">Payment Due</p>
                  <p className="creditMemoInvoiceValue">
                    8 Nov 2022
                    {/* {moment(apiData?.data?.invoice?.dueDate).format(
                          "DD MMM YYYY"
                        )} */}
                  </p>
                </div>
                <div className="creditMemoInvoiceLastCloumn">
                  <p className="creditMemoInvoiceHeading">Location</p>
                  <p className="creditMemoInvoiceValue">
                    Nigeria
                    {/* {apiData?.data?.invoice?.customerLocation} */}
                  </p>
                  <p className="creditMemoInvoiceHeading">Region</p>
                  <p className="creditMemoInvoiceValue">
                    EMEA
                    {/* {apiData?.data?.regionItemCode?.toUpperCase()} */}
                  </p>
                  <p className="creditMemoInvoiceHeading">Billing Currency</p>
                  <p className="creditMemoInvoiceValue">
                    USD
                    {/* {getPayrollBillingCurrency()} */}
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
                          <h3>Invoice Type</h3>
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
                <p>Total Balance</p>
                <h3>USD {newAmount.toLocaleString("en-US")}</h3>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreviewPop;
