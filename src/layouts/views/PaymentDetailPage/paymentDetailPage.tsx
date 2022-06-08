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
  const [isFullAmountChecked, setIsFullAmountChecked] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
  const [isPaymentMethodDropdownOpen, setIsPaymentMethodDropdownOpen] =
    useState(false);
  const [documents, setDocuments] = useState<any>([]);
  const [notes, setNotes] = useState<any>([]);
  const [toggleState, setToggleState] = useState(0);
  const [multiPaymentBlocks, setMultiPaymentBlocks] = useState([
    {
      id: Math.random(),
      paymentDate: "",
      currency: "",
      location: "",
      class: "",
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
        class: "",
        depositedBank: "",
        paymentMethod: "",
        amount: "",
      },
    ]);
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
          <Button
            className="primary-blue medium"
            // icon={{
            //   color: "#fff",
            //   icon: "dollar",
            //   size: "medium",
            // }}
            label="Save"
          />
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

              <div className="paymentDetailPageamount">
                <p>
                  Open <span>USD 300,523.15</span>
                </p>

                <p>
                  Total <span>USD 300,523.15</span>
                </p>
              </div>
            </div>

            <p>QBO No. 730</p>
          </div>
        </div>

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
                      isOpen={toggleState == i ? isCurrencyDropdownOpen : false}
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
                      isOpen={toggleState == i ? isLocationDropdownOpen : false}
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
                          toggleState == i ? isPaymentMethodDropdownOpen : false
                        }
                        options={dropdownOptions}
                        title="Payment Method"
                      />
                    </div>
                  </div>

                  <div className="PaymentPageTotalAmount">
                    <p>Amount</p>
                    <div className="amountPaymentPage">USD 300,523.15</div>
                    {i == 0 && (multiPaymentBlocks.length = 1) ? (
                      <div className="fullAmountPaymentCheckbox">
                        <Checkbox
                          checked={isFullAmountChecked}
                          onChange={(e: any) => {
                            setIsFullAmountChecked(e.target.checked);
                          }}
                          label="Full Amount"
                        />
                      </div>
                    )
                  : 
                  <></>}
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
              Add Payment Installment
            </div>
          </div>
        </div>
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
