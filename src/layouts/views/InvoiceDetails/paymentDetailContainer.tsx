import React, { useEffect, useState } from "react";
import { Button, DatePicker, Dropdown, Icon } from "atlasuikit";
import { getDecodedToken } from "../../../components/getDecodedToken";
import axios from "axios";
import moment from "moment";
import { getHeaders, subscriptionLookup, urls } from "../../../urls/urls";
// /* istanbul ignore next */
const PaymentDetailContainer = ({
  status,
  cid,
  lookupData,
  paymentDetailData,
  getBillingCurrency
}: any) => {
  const permission: any = getDecodedToken();
  const tempToken = localStorage.getItem("accessToken");

  const [currencyEditOpen, setCurrencyEditOpen] = useState();
  const [locationEditOpen, setLocationEditOpen] = useState();
  const [depositBankEditOpen, setDepositBankEditOpen] = useState();
  const [paymentMethodEditOpen, setPaymentMethodEditOpen] = useState();
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [referenceNo, setReferenceNo] = useState<any>([]);
  const [depositBankOpen, setDepositBankOpen] = useState(false);
  const [paymentMethodOpen, setPaymentMethodOpen] = useState(false);
  const [editChecked, setEditChecked] = useState<any>();
  const [addPaymentSectionCheck, setAddPaymentSectionCheck] = useState(false);
  const [currencyDropdownOptions, setCurrencyDropdownOption] = useState<any>(
    []
  );
  const [bankToDepositDropdownOptions, setBankToDepositDropdownOption] =
    useState<any>([]);
  const [locationDropdownOptions, setLocationDropdownOption] = useState<any>(
    []
  );
  const [paymentMethodDropdownOptions, setPaymentMethodDropdownOption] =
    useState<any>([]);
  const [addCurrencyDropdownOptions, setAddCurrencyDropdownOption] =
    useState<any>([]);
  const [addBankToDepositDropdownOptions, setAddBankToDepositDropdownOption] =
    useState<any>([]);
  const [addLocationDropdownOptions, setAddLocationDropdownOption] =
    useState<any>([]);
  const [addPaymentMethodDropdownOptions, setAddPaymentMethodDropdownOption] =
    useState<any>([]);
  const [multiDetailPaymentBlocks] = useState<any>([
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
    updateDropdowns();
  }, [paymentDetailData])

  const getCurrencyAndDepositBankAndLocationDropdownOption = () => {
    const currencyDataOptions: any = prepareCurrencyDropdownOptionData(
      lookupData?.data?.billingCurrencies
    );
    const depositToBankDataOptions: any =
      prepareDepositToBankDropdownOptionData(
        lookupData?.data?.depositToOptions
      );
    const locationDataOptions: any = preparelocationDropdownOptionData(
      lookupData?.data?.locations
    );
    // setCurrencyDropdownOption(currencyDataOptions);
    setAddCurrencyDropdownOption(currencyDataOptions);
    // setBankToDepositDropdownOption(depositToBankDataOptions);
    setAddBankToDepositDropdownOption(depositToBankDataOptions);
    // setLocationDropdownOption(locationDataOptions);
    setAddLocationDropdownOption(locationDataOptions);
  };

  const getPaymentMethodDropdownOptionData = () => {
    const getSubscriptionLookup = subscriptionLookup();
    const headers = {
      headers: getHeaders(tempToken, cid, "false"),
    };
    axios
      .get(getSubscriptionLookup, headers)
      .then((res: any) => {
        const paymentMethodData: any = preparePaymentMethodDropdownOptionData(
          res?.data?.paymentMethods
        );
        setPaymentMethodDropdownOption(paymentMethodData);
        setAddPaymentMethodDropdownOption(paymentMethodData);
      })
      .catch((e: any) => {
        console.log("error", e);
      });
  };

  const prepareCurrencyDropdownOptionData = (data: any) => {
    return data?.map((item: any) => {
      return {
        ...item,
        isSelected: false,
        label: item.text,
        value: item.text,
      };
    });
  };

  const prepareDepositToBankDropdownOptionData = (data: any) => {
    return data?.map((item: any) => {
      return {
        ...item,
        isSelected: false,
        label: item.text,
        value: item.text,
      };
    });
  };

  const preparelocationDropdownOptionData = (data: any) => {
    return data?.map((item: any) => {
      return {
        ...item,
        isSelected: false,
        label: item.text,
        value: item.text,
      };
    });
  };

  const preparePaymentMethodDropdownOptionData = (data: any) => {
    return data?.map((item: any) => {
      return {
        ...item,
        isSelected: false,
        label: item.text,
        value: item.text,
      };
    });
  };

  const handlePaymentDropOptionData = (
    item: any,
    options: any,
    set: any,
    setIsOpen: any
  ) => {
    let arr = [...options];

    arr.forEach((e, i) => {
      if (e.value === item.value) {
        arr[i] = {
          ...arr[i],
          isSelected: !arr[i].isSelected,
        };
      } else {
        arr[i] = {
          ...arr[i],
          isSelected: false,
        };
      }
    });

    set(arr);
    setIsOpen(paymentDetailData.length + 1);
  };

  const currencyDropOptionClick = (option: any) =>
    handleAddOptionClick({
      option,
      dropOptions: addCurrencyDropdownOptions,
      updateIsOpen: setCurrencyOpen,
      isDropOpen: currencyOpen,
      updateOptions: setAddCurrencyDropdownOption,
    });

  const locationDropOptionClick = (option: any) =>
    handleAddOptionClick({
      option,
      dropOptions: addLocationDropdownOptions,
      updateIsOpen: setLocationOpen,
      isDropOpen: locationOpen,
      updateOptions: setAddLocationDropdownOption,
    });

  const depositBankDropOptionClick = (option: any) =>
    handleAddOptionClick({
      option,
      dropOptions: addBankToDepositDropdownOptions,
      updateIsOpen: setDepositBankOpen,
      isDropOpen: depositBankOpen,
      updateOptions: setAddBankToDepositDropdownOption,
    });

  const paymentMethodDropOptionClick = (option: any) =>
    handleAddOptionClick({
      option,
      dropOptions: addPaymentMethodDropdownOptions,
      updateIsOpen: setPaymentMethodOpen,
      isDropOpen: paymentMethodOpen,
      updateOptions: setAddPaymentMethodDropdownOption,
    });

  const handleAddOptionClick = (args: any) => {
    const { option, dropOptions, updateIsOpen, isDropOpen, updateOptions } =
      args;
    updateIsOpen(!isDropOpen);
    let updatedOptions = dropOptions.map((opt: any) => {
      opt.isSelected = option.value === opt.value;
      return opt;
    });
    updateOptions(updatedOptions);
  };

  const updateDropdowns = () => {
    let billingCurrencyArr: any = []

    if(lookupData?.data?.billingCurrencies) {
      paymentDetailData.forEach((item: any) => {
        billingCurrencyArr.push(
          lookupData?.data?.billingCurrencies.map((x: any) => {
            return{
              isSelected: x.value == item.currencyId,
              label: x.text,
              value: x.value,
            }
          })
        )
      })
      setCurrencyDropdownOption(billingCurrencyArr)
    }

    let bankToDepositArr: any = []

    if(lookupData?.data?.depositToOptions) {
      paymentDetailData.forEach((item: any) => {
        bankToDepositArr.push(
          lookupData?.data?.depositToOptions.map((x: any) => {
            return{
              isSelected: x.value == item.depositedtoBank,
              label: x.text,
              value: x.value,
            }
          })
        )
      })
      setBankToDepositDropdownOption(bankToDepositArr)
    }

    let locationArr: any = []

    if(lookupData?.data?.locations) {
      paymentDetailData.forEach((item: any) => {
        locationArr.push(
          lookupData?.data?.locations.map((x: any) => {
            return{
              isSelected: x.value == item.location,
              label: x.text,
              value: x.value,
            }
          })
        )
      })
      setLocationDropdownOption(locationArr)
    }
  
   
  };

  useEffect(() => {
    getCurrencyAndDepositBankAndLocationDropdownOption();
    getPaymentMethodDropdownOptionData();
  }, []);

  const addPaymentInstallmentBlocks = () => {
    setAddPaymentSectionCheck(true);
  };

  return (
    <div className="paymentDisplayContainer">
      {paymentDetailData?.map((item: any, key: any) => {
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
                        data-testid="payment-edit-button"
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
                          setEditChecked(paymentDetailData.length);
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
                {console.log("currencyDropdownOptions", currencyDropdownOptions)}
                <Dropdown
                  handleDropdownClick={(b: boolean) => {
                    b
                      ? setCurrencyEditOpen(key)
                      : setCurrencyEditOpen(paymentDetailData.length + 1);
                  }}
                  handleDropOptionClick={(item: any) => {
                    handlePaymentDropOptionData(
                      item,
                      currencyDropdownOptions,
                      setCurrencyDropdownOption,
                      setCurrencyEditOpen
                    );
                  }}
                  options={currencyDropdownOptions[key] || []}
                  isOpen={currencyEditOpen == key}
                  isDisabled={editChecked != key}
                  title="Currency"
                />
              </div>

              <div className="paymentInstallmentContainerDropdowns">
                <Dropdown
                  handleDropdownClick={(b: boolean) => {
                    b
                      ? setLocationEditOpen(key)
                      : setLocationEditOpen(paymentDetailData.length + 1);
                  }}
                  handleDropOptionClick={(item: any) => {
                    handlePaymentDropOptionData(
                      item,
                      locationDropdownOptions,
                      setLocationDropdownOption,
                      setLocationEditOpen
                    );
                  }}
                  options={locationDropdownOptions[key] || []}
                  isOpen={locationEditOpen == key}
                  isDisabled={editChecked != key}
                  title="Location"
                />
              </div>

              <div className="paymentInstallmentContainerDropdowns">
                <div className="referenceNoInput">
                  <span className={editChecked != key ? "disable-label" : ""}>
                    Reference No
                  </span>
                  <input
                    className={editChecked != key ? "disable-input" : ""}
                    // value={referenceNo}
                    defaultValue={item.referenceNo}
                    name="Reference No"
                    type="text"
                    placeholder="Enter reference No"
                    min="0"
                    pattern="[+-]?\d+(?:[.,]\d+)?"
                    onKeyDown={(e) => {
                      ["e", "E", "+", "-", "."].includes(e.key) &&
                        e.preventDefault();
                    }}
                    disabled={editChecked != key}
                    onChange={(e) => {
                      setReferenceNo(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="paymentInstallmentLowerBlock">
              <div className="paymentInnerLowerBlock">
                <div className="paymentInstallmentContainerDropdowns">
                  <Dropdown
                    handleDropdownClick={(b: boolean) => {
                      b
                        ? setDepositBankEditOpen(key)
                        : setDepositBankEditOpen(paymentDetailData.length + 1);
                    }}
                    handleDropOptionClick={(item: any) => {
                      handlePaymentDropOptionData(
                        item,
                        bankToDepositDropdownOptions,
                        setBankToDepositDropdownOption,
                        setDepositBankEditOpen
                      );
                    }}
                    options={bankToDepositDropdownOptions[key] || []}
                    isOpen={depositBankEditOpen == key}
                    isDisabled={editChecked != key}
                    title="Deposited to bank"
                  />
                </div>

                <div className="paymentInstallmentContainerDropdowns">
                  <Dropdown
                    handleDropdownClick={(b: boolean) => {
                      b
                        ? setPaymentMethodEditOpen(key)
                        : setPaymentMethodEditOpen(
                            paymentDetailData.length + 1
                          );
                    }}
                    handleDropOptionClick={(item: any) => {
                      handlePaymentDropOptionData(
                        item,
                        paymentMethodDropdownOptions,
                        setPaymentMethodDropdownOption,
                        setPaymentMethodEditOpen
                      );
                    }}
                    options={paymentMethodDropdownOptions}
                    isOpen={paymentMethodEditOpen == key}
                    isDisabled={editChecked != key}
                    title="Payment Method"
                  />
                </div>

                <div className="PaymentPageTotalAmountInput">
                  <div className="amountPaymentPageInput">
                    <span>Amount</span>
                    <input
                      defaultValue={getBillingCurrency() + " " + item.totalAmount}
                      // value="USD 300,523.15"
                      type="text"
                      className="disable-input-color"
                      placeholder="Please enter"
                      disabled={true}
                    />
                  </div>
                  <div className="fullAmountPaymentNoInput">
                    Payment #765248
                  </div>
                </div>
              </div>

              <div className="PaymentPageTotalAmount">
                <p>Amount</p>
                <div className="amountPaymentPage">{getBillingCurrency() + " " + item.totalAmount}</div>
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
                handleDropdownClick={setCurrencyOpen}
                handleDropOptionClick={currencyDropOptionClick}
                options={addCurrencyDropdownOptions}
                isOpen={currencyOpen}
                isDisabled={false}
                title="Currency"
              />
            </div>

            <div className="paymentInstallmentContainerDropdowns">
              <Dropdown
                handleDropdownClick={setLocationOpen}
                handleDropOptionClick={locationDropOptionClick}
                options={addLocationDropdownOptions}
                isOpen={locationOpen}
                isDisabled={false}
                title="Location"
              />
            </div>

            <div className="paymentInstallmentContainerDropdowns">
              <div className="referenceNoInput">
                <span>Reference No</span>
                <input
                  value={referenceNo}
                  name="Reference No"
                  type="text"
                  placeholder="Enter reference No"
                  min="0"
                  pattern="[+-]?\d+(?:[.,]\d+)?"
                  onKeyDown={(e) => {
                    ["e", "E", "+", "-", "."].includes(e.key) &&
                      e.preventDefault();
                  }}
                  onChange={(e) => {
                    setReferenceNo(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="paymentInstallmentLowerBlock">
            <div className="paymentInnerLowerBlock">
              <div className="paymentInstallmentContainerDropdowns">
                <Dropdown
                  handleDropdownClick={setDepositBankOpen}
                  handleDropOptionClick={depositBankDropOptionClick}
                  options={addBankToDepositDropdownOptions}
                  isOpen={depositBankOpen}
                  isDisabled={false}
                  title="Deposited to bank"
                />
              </div>

              <div className="paymentInstallmentContainerDropdowns">
                <Dropdown
                  handleDropdownClick={setPaymentMethodOpen}
                  handleDropOptionClick={paymentMethodDropOptionClick}
                  options={addPaymentMethodDropdownOptions}
                  isOpen={paymentMethodOpen}
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
      status === "Partial Paid" ? (
        <div className="addPaymentInstallmentButton">
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
      ) : (
        <></>
      )}
    </div>
  );
};

export default PaymentDetailContainer;
