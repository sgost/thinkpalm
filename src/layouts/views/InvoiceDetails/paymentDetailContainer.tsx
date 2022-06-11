import React, { useState } from "react";
import { Button, DatePicker, Dropdown, Icon } from "atlasuikit";
import { getDecodedToken } from "../../../components/getDecodedToken";
/* istanbul ignore next */
const PaymentDetailContainer = (status: any) => {
  const permission: any = getDecodedToken();

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

  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [referenceNoOpen, setReferenceNoOpen] = useState(false);
  const [depositBankOpen, setDepositBankOpen] = useState(false);
  const [paymentMethodOpen, setPaymentMethodOpen] = useState(false);
  const [editChecked, setEditChecked] = useState<any>();
  const [addPaymentSectionCheck, setAddPaymentSectionCheck] = useState(false);
  const [multiDetailPaymentBlocks] = useState([
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

  const addPaymentInstallmentBlocks = () => {
    setAddPaymentSectionCheck(true);
  };

  return (
    <div className="paymentDisplayContainer">
      {multiDetailPaymentBlocks?.map((_item: any, key: any) => {
        return (
          <div className="paymentInstallmentContainer">
            <div className="paymentPageTitleHeader">
              {key == 0 ? <p>Payment Details</p> : <></>}
              <div className="topButtonActions">
                {permission?.InvoiceDetails.includes("Edit") &&
                  editChecked != key && (
                    <div className="paymentDetailEdit">
                      <Button
                        className="primary-blue medium"
                        icon={{
                          color: "#fff",
                          icon: "edit",
                          size: "small",
                        }}
                        label="Edit"
                        handleOnClick={() => {
                          setEditChecked(key);
                        }}
                      />
                    </div>
                  )}

                {editChecked == key && (
                  <div className="paymentPageCancelSave">
                    <div className="paymentDetailCancel">
                      <Button
                        className="secondary-btn"
                        label="Cancel Edit"
                        handleOnClick={() => {
                          setEditChecked(multiDetailPaymentBlocks.length);
                        }}
                      />
                    </div>
                    <div className="paymentDetailSave">
                      <Button
                        className="primary-blue medium"
                        label="Save Changes"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="paymentInstallmentUpperBlock">
              <div className="paymentInstallmentDatepicker">
                <DatePicker
                  label="Payment Date"
                  disabled={editChecked != key}
                  required
                />
              </div>

              <div className="paymentInstallmentContainerDropdowns">
                <Dropdown
                  handleDropdownClick={(b: boolean) => {
                    setCurrencyOpen(b);
                    setLocationOpen(false);
                    setReferenceNoOpen(false);
                    setDepositBankOpen(false);
                    setPaymentMethodOpen(false);
                  }}
                  isOpen={currencyOpen}
                  options={dropdownOptions}
                  isDisabled={editChecked != key}
                  title="Currency"
                />
              </div>

              <div className="paymentInstallmentContainerDropdowns">
                <Dropdown
                  handleDropdownClick={(b: boolean) => {
                    setCurrencyOpen(false);
                    setLocationOpen(b);
                    setReferenceNoOpen(false);
                    setDepositBankOpen(false);
                    setPaymentMethodOpen(false);
                  }}
                  isOpen={locationOpen}
                  options={dropdownOptions}
                  isDisabled={editChecked != key}
                  title="Location"
                />
              </div>

              <div className="paymentInstallmentContainerDropdowns">
                <Dropdown
                  handleDropdownClick={(b: boolean) => {
                    setCurrencyOpen(false);
                    setLocationOpen(false);
                    setReferenceNoOpen(b);
                    setDepositBankOpen(false);
                    setPaymentMethodOpen(false);
                  }}
                  isOpen={referenceNoOpen}
                  options={dropdownOptions}
                  isDisabled={editChecked != key}
                  title="Reference No"
                />
              </div>
            </div>

            <div className="paymentInstallmentLowerBlock">
              <div className="paymentInnerLowerBlock">
                <div className="paymentInstallmentContainerDropdowns">
                  <Dropdown
                    handleDropdownClick={(b: boolean) => {
                      setCurrencyOpen(false);
                      setLocationOpen(false);
                      setReferenceNoOpen(false);
                      setDepositBankOpen(b);
                      setPaymentMethodOpen(false);
                    }}
                    isOpen={depositBankOpen}
                    options={dropdownOptions}
                    isDisabled={editChecked != key}
                    title="Deposited to bank"
                  />
                </div>

                <div className="paymentInstallmentContainerDropdowns">
                  <Dropdown
                    handleDropdownClick={(b: boolean) => {
                      setCurrencyOpen(false);
                      setLocationOpen(false);
                      setReferenceNoOpen(false);
                      setDepositBankOpen(false);
                      setPaymentMethodOpen(b);
                    }}
                    isOpen={paymentMethodOpen}
                    options={dropdownOptions}
                    isDisabled={editChecked != key}
                    title="Payment Method"
                  />
                </div>

                <div className="PaymentPageTotalAmountInput">
                  <div className="amountPaymentPageInput">
                    <span>Amount</span>
                    <input
                      value="USD 300,523.15"
                      type="number"
                      className="disable-input-color"
                      placeholder="Please enter"
                      disabled={true}
                      // disabled={disable}
                      // onChange={(e)=>{setValue(e.target.value)}}
                      // onKeyPress={(e)=>{masking(e)}}
                    />
                  </div>
                  <div className="fullAmountPaymentNoInput">
                    Payment #765248
                  </div>
                </div>
              </div>

              <div className="PaymentPageTotalAmount">
                <p>Amount</p>
                <div className="amountPaymentPage">USD 300,523.15</div>
                <div className="fullAmountPaymentNo">Payment #765248</div>
              </div>
            </div>
          </div>
        );
      })}

      {addPaymentSectionCheck && (
        <div className="paymentInstallmentContainer border-line">
          <div className="paymentPageTitleHeaderNoTitle">
            <div className="topButtonActions">
              {addPaymentSectionCheck && (
                <div className="paymentPageCancelSave">
                  <div className="paymentDetailCancel">
                    <Button
                      className="secondary-btn"
                      label="Cancel"
                      handleOnClick={() => {
                        setAddPaymentSectionCheck(false);
                      }}
                    />
                  </div>
                  <div className="paymentDetailSave">
                    <Button className="primary-blue medium" label="Save" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="paymentInstallmentUpperBlock">
            <div className="paymentInstallmentDatepicker">
              <DatePicker label="Payment Date" disabled={false} required />
            </div>

            <div className="paymentInstallmentContainerDropdowns">
              <Dropdown
                handleDropdownClick={(b: boolean) => {
                  setCurrencyOpen(b);
                  setLocationOpen(false);
                  setReferenceNoOpen(false);
                  setDepositBankOpen(false);
                  setPaymentMethodOpen(false);
                }}
                isOpen={currencyOpen}
                options={dropdownOptions}
                isDisabled={false}
                title="Currency"
              />
            </div>

            <div className="paymentInstallmentContainerDropdowns">
              <Dropdown
                handleDropdownClick={(b: boolean) => {
                  setCurrencyOpen(false);
                  setLocationOpen(b);
                  setReferenceNoOpen(false);
                  setDepositBankOpen(false);
                  setPaymentMethodOpen(false);
                }}
                isOpen={locationOpen}
                options={dropdownOptions}
                isDisabled={false}
                title="Location"
              />
            </div>

            <div className="paymentInstallmentContainerDropdowns">
              <Dropdown
                handleDropdownClick={(b: boolean) => {
                  setCurrencyOpen(false);
                  setLocationOpen(false);
                  setReferenceNoOpen(b);
                  setDepositBankOpen(false);
                  setPaymentMethodOpen(false);
                }}
                isOpen={referenceNoOpen}
                options={dropdownOptions}
                isDisabled={false}
                title="Reference No"
              />
            </div>
          </div>

          <div className="paymentInstallmentLowerBlock">
            <div className="paymentInnerLowerBlock">
              <div className="paymentInstallmentContainerDropdowns">
                <Dropdown
                  handleDropdownClick={(b: boolean) => {
                    setCurrencyOpen(false);
                    setLocationOpen(false);
                    setReferenceNoOpen(false);
                    setDepositBankOpen(b);
                    setPaymentMethodOpen(false);
                  }}
                  isOpen={depositBankOpen}
                  options={dropdownOptions}
                  isDisabled={false}
                  title="Deposited to bank"
                />
              </div>

              <div className="paymentInstallmentContainerDropdowns">
                <Dropdown
                  handleDropdownClick={(b: boolean) => {
                    setCurrencyOpen(false);
                    setLocationOpen(false);
                    setReferenceNoOpen(false);
                    setDepositBankOpen(false);
                    setPaymentMethodOpen(b);
                  }}
                  isOpen={paymentMethodOpen}
                  options={dropdownOptions}
                  isDisabled={false}
                  title="Payment Method"
                />
              </div>

              <div className="PaymentPageTotalAmountInput">
                <div className="amountPaymentPageInput">
                  <span>Amount</span>
                  <input
                    value="USD 300,523.15"
                    type="number"
                    className="disable-input-color"
                    placeholder="Please enter"
                    disabled={true}
                    // disabled={disable}
                    // onChange={(e)=>{setValue(e.target.value)}}
                    // onKeyPress={(e)=>{masking(e)}}
                  />
                </div>
                <div className="fullAmountPaymentNoInput">Payment #765248</div>
              </div>
            </div>

            <div className="PaymentPageTotalAmount">
              <p>Amount</p>
              <div className="amountPaymentPage">USD 300,523.15</div>
              <div className="fullAmountPaymentNo">Payment #765248</div>
            </div>
          </div>
        </div>
      )}

      {permission?.InvoiceDetails.includes("Add") &&
        status.status === "Partial Paid" ? (
          <div className="addPaymentInstallmentButton">
            {console.log("status inside", status)}
            <div
              className="addPaymentInstallmentIcon"
              onClick={() => addPaymentInstallmentBlocks()}
              aria-disabled={addPaymentSectionCheck}
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
        )
      : 
      <></>}
    </div>
  );
};

export default PaymentDetailContainer;
