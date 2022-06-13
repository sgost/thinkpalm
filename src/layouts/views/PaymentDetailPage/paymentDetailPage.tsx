import React, { useEffect, useState } from "react";
import {
  Button,
  Icon,
  BreadCrumb,
  DatePicker,
  Dropdown,
  Checkbox,
} from "atlasuikit";
import { useNavigate } from "react-router-dom";
import "./paymentDetailPage.scss";
import NotesWidget from "../../../components/Notes";
import FileUploadWidget from "../../../components/FileUpload";

const PaymentDetailPage = () => {
  const navigate = useNavigate();

  const dropdownOptions = [
    {
      isSelected: false,
      label: "Chocolate",
      value: "chocolate",
    },
    {
      isSelected: false,
      label: "Strawberry",
      value: "strawberry",
    },
    {
      isSelected: false,
      label: "Vanilla",
      value: "vanilla",
    },
  ];

  const [hideTopCheck, setHideTopCheck] = useState(true);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
  const [isPaymentMethodDropdownOpen, setIsPaymentMethodDropdownOpen] =
    useState(false);
  const [documents, setDocuments] = useState<any>([]);
  const [notes, setNotes] = useState<any>([]);
  const [toggleState, setToggleState] = useState(0);
  const [showPaymentBlock, setShowPaymentBlock] = useState<any>(0);
  const [multiPaymentBlocks, setMultiPaymentBlocks] = useState([
    {
      id: Math.random(),
      paymentDate: "",
      currency: "",
      location: "",
      referenceNo: "",
      depositedBank: "",
      paymentMethod: "",
      amount: "",
    },
  ]);

  useEffect(() => {
    if (!hideTopCheck) {
      navigate("/pay");
    }
  }, [hideTopCheck]);

  const addPaymentBlocks = () => {
    setMultiPaymentBlocks([
      ...multiPaymentBlocks,
      {
        id: Math.random(),
        paymentDate: "",
        currency: "",
        location: "",
        referenceNo: "",
        depositedBank: "",
        paymentMethod: "",
        amount: "",
      },
    ]);
  };

  const removePaymentBlock = (item: any) => {
    setMultiPaymentBlocks(
      multiPaymentBlocks.filter((todo: any) => todo.id !== item.id)
    );
  };

  const onChevronClick = () => {
    setShowPaymentBlock(!showPaymentBlock);
  };

  return (
    <div className="paymentDetailPageContainer">
      <div className="paymentDetailPageHeaderRow">
        <div className="paymentDetailPageBreadcrumbs">
          <BreadCrumb
            hideHeaderTitle={hideTopCheck}
            hideHeaderTabs={hideTopCheck}
            steps={[
              {
                isActive: true,
                key: "Invoices",
                label: "Invoices",
                onClickLabel: () => {
                  setHideTopCheck(false);
                },
              },
              {
                isActive: true,
                key: "Invoices",
                label: "Payroll Invoice Node. 791230",
              },
              {
                key: "payments",
                label: "Payments",
              },
            ]}
          />
        </div>
        <div className="paymentSaveButton">
          <Button className="primary-blue medium" label="Save" />
        </div>
      </div>

      <div className="paymentPageInvoiceInfo">
        <div className="paymentPageTopBar">
          {/* <div className="invoic-status">
          <p className="status">{status}</p>
        </div> */}
          <div className="paymentHeaderContainer">
            <div className="paymentTopBarrow">
              <div className="paymentInvoivceNo">
                <Icon color="#FFFFFF" icon="orderSummary" size="large" />
                <p>Payroll Invoice No. 791230 Payment</p>
              </div>

              <div className="payment-header-two">
                <div className="paymentDetailPageamount">
                  <p>
                    Open <span>USD 300,523.15</span>
                  </p>

                  <p>
                    Total <span>USD 300,523.15</span>
                  </p>
                </div>
                <div
                  data-testid="open-payment-block"
                  className="header-chevron-icon"
                  onClick={() => {
                    onChevronClick();
                  }}
                >
                  <Icon
                    color="#fff"
                    icon={
                      showPaymentBlock === true ? "chevronUp" : "chevronDown"
                    }
                    size="large"
                  />
                </div>
              </div>
            </div>

            <p>QBO No. 730</p>
          </div>
        </div>

        {showPaymentBlock && (
          <div className="paaymentInstallmetOuterContainer">
            {multiPaymentBlocks?.map((item: any, i: any) => {
              return (
                <div
                  className={
                    i == 0
                      ? "paymentInstallmentContainer"
                      : "paymentInstallmentContainer border-line"
                  }
                >
                  <div
                    className={
                      i == 0
                        ? "paymentPageTitleHeader"
                        : "paymentPageTitleHeaderNoTitle"
                    }
                  >
                    {i == 0 ? <p>Payment Details</p> : <></>}
                    {i == 0 ? (
                      <></>
                    ) : (
                      <div className="paymentPageEdit">
                        <Button
                          className="secondary-btn medium"
                          icon={{
                            color: "#526FD6",
                            icon: "trash",
                            size: "medium",
                          }}
                          label="Delete Item"
                          handleOnClick={() => removePaymentBlock(item)}
                        />
                      </div>
                    )}
                  </div>

                  <div className="paymentInstallmentUpperBlock">
                    <div className="paymentInstallmentDatepicker">
                      <DatePicker label="Payment Date" required />
                    </div>

                    <div className="paymentInstallmentContainerDropdowns">
                      <Dropdown
                        handleDropdownClick={(b: boolean) => {
                          setIsCurrencyDropdownOpen(b);
                          setIsLocationDropdownOpen(false);
                          setIsClassDropdownOpen(false);
                          setIsBankDropdownOpen(false);
                          setIsPaymentMethodDropdownOpen(false);
                          setToggleState(i);
                        }}
                        isOpen={
                          toggleState == i ? isCurrencyDropdownOpen : false
                        }
                        options={dropdownOptions}
                        title="Currency"
                      />
                    </div>

                    <div className="paymentInstallmentContainerDropdowns">
                      <Dropdown
                        handleDropdownClick={(b: boolean) => {
                          setIsLocationDropdownOpen(b);
                          setIsCurrencyDropdownOpen(false);
                          setIsClassDropdownOpen(false);
                          setIsBankDropdownOpen(false);
                          setIsPaymentMethodDropdownOpen(false);
                          setToggleState(i);
                        }}
                        isOpen={
                          toggleState == i ? isLocationDropdownOpen : false
                        }
                        options={dropdownOptions}
                        title="Location"
                      />
                    </div>

                    <div className="paymentInstallmentContainerDropdowns">
                      <Dropdown
                        handleDropdownClick={(b: boolean) => {
                          setIsClassDropdownOpen(b);
                          setIsCurrencyDropdownOpen(false);
                          setIsLocationDropdownOpen(false);
                          setIsBankDropdownOpen(false);
                          setIsPaymentMethodDropdownOpen(false);
                          setToggleState(i);
                        }}
                        isOpen={toggleState == i ? isClassDropdownOpen : false}
                        options={dropdownOptions}
                        title="Reference No"
                      />
                    </div>
                  </div>

                  <div className="paymentInstallmentLowerBlock">
                    <div className="paymentInnerLowerBlock">
                      <div className="paymentInstallmentContainerDropdowns">
                        <Dropdown
                          handleDropdownClick={(b: boolean) => {
                            setIsBankDropdownOpen(b);
                            setIsCurrencyDropdownOpen(false);
                            setIsLocationDropdownOpen(false);
                            setIsClassDropdownOpen(false);
                            setIsPaymentMethodDropdownOpen(false);
                            setToggleState(i);
                          }}
                          isOpen={toggleState == i ? isBankDropdownOpen : false}
                          options={dropdownOptions}
                          title="Deposited to bank"
                        />
                      </div>

                      <div className="paymentInstallmentContainerDropdowns">
                        <Dropdown
                          handleDropdownClick={(b: boolean) => {
                            setIsPaymentMethodDropdownOpen(b);
                            setIsCurrencyDropdownOpen(false);
                            setIsLocationDropdownOpen(false);
                            setIsClassDropdownOpen(false);
                            setIsBankDropdownOpen(false);
                            setToggleState(i);
                          }}
                          isOpen={
                            toggleState == i
                              ? isPaymentMethodDropdownOpen
                              : false
                          }
                          options={dropdownOptions}
                          title="Payment Method"
                        />
                      </div>
                    </div>

                    <div className="PaymentPageTotalAmount">
                      <p>Amount</p>
                      <div className="amountPaymentPage">USD 300,523.15</div>
                      {i == 0 && multiPaymentBlocks.length == 1 ? (
                        <div className="fullAmountPaymentCheckbox">
                          <Checkbox checked={true} label="Full Amount" />
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="addPaymentInstallmentButton">
              <div
                className="addPaymentInstallmentIcon"
                onClick={() => addPaymentBlocks()}
              >
                <span>
                  <Icon
                    icon="add"
                    size="small"
                    width="20"
                    height="20"
                    color="white"
                    style={{ margin: `0 4px 0 0` }}
                  />
                </span>
                Add payment Installment
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="filesNotes">
        <NotesWidget
          notes={notes}
          setNotes={setNotes}
          isClient="false"
          // cid={cid}
          cid="a9bbee6d-797a-4724-a86a-5b1a2e28763f"
          id="32fbfee0-809d-4828-ab55-e4deebeb5157"
          // id={id}
          // transactionType={creditMemoData?.transactionType}
        ></NotesWidget>
        <FileUploadWidget
          documents={documents}
          setDocuments={setDocuments}
          isClient="false"
          // cid={cid}
          cid="a9bbee6d-797a-4724-a86a-5b1a2e28763f"
          // id={id}
          id="32fbfee0-809d-4828-ab55-e4deebeb5157"
          // transactionType={creditMemoData?.transactionType}
        ></FileUploadWidget>
      </div>
    </div>
  );
};

export default PaymentDetailPage;
