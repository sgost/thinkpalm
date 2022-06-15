import React, { useEffect, useState } from "react";
import {
  Button,
  Icon,
  BreadCrumb,
  DatePicker,
  Dropdown,
  Checkbox,
} from "atlasuikit";
import { useNavigate, useLocation } from "react-router-dom";
import "./paymentDetailPage.scss";
import NotesWidget from "../../../components/Notes";
import { urls, getHeaders, subscriptionLookup } from "../../../urls/urls";
import axios from "axios";
import FileUploadWidget from "../../../components/FileUpload";

const PaymentDetailPage = () => {
  const state: any = useLocation();
  const navigate = useNavigate();

  const tempToken = localStorage.getItem("accessToken");

  const [hideTopCheck, setHideTopCheck] = useState(true);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
  const [isPaymentMethodDropdownOpen, setIsPaymentMethodDropdownOpen] =
    useState(false);
  const [documents, setDocuments] = useState<any>([]);
  const [notes, setNotes] = useState<any>([]);
  const [toggleState, setToggleState] = useState<any>({
    index: null,
    invoiceIndex: null,
  });

  const [currencyOptionsDefault, setCurrencyOptionDefault] = useState<any>([]);
  const [currencyOptions, setCurrencyOption] = useState<any>([]);
  const [bankToDepositOptionsDefault, setBankToDepositOptionDefault] =
    useState<any>([]);
  const [bankToDepositOptions, setBankToDepositOption] = useState<any>([]);
  const [locationOptionsDefault, setLocationOptionDefault] = useState<any>([]);
  const [locationOptions, setLocationOption] = useState<any>([]);
  const [paymentMethodOptionsDefault, setPaymentMethodOptionDefault] =
    useState<any>([]);
  const [paymentMethodOptions, setPaymentMethodOption] = useState<any>([]);
  const [paymentDate, setpaymentDate] = useState<any>([]);
  const [referenceNo, setReferenceNo] = useState<any>([]);
  const [multiplePaymentId, setMultiplePaymentId] = useState([]);
  const [multiPaymentBlocks, setMultiPaymentBlocks] = useState(
    state.state.inveoicesData.map((e: any) => ({
      id: Math.random(),
      parentId: e.id,
    }))
  );
  // const [multiPaymentBlocks, setMultiPaymentBlocks] = useState([
  //   {
  //     id: Math.random(),
  //     paymentDate: "",
  //     currency: "",
  //     location: "",
  //     referenceNo: "",
  //     depositedBank: "",
  //     paymentMethod: "",
  //     amount: "",
  //   },
  // ]);

  useEffect(() => {
    if (!hideTopCheck) {
      navigate("/pay");
    }
  }, [hideTopCheck]);

  const getCurrencyAndDepositBankAndLocationDropdownOption = () => {
    const lookupApi = urls.lookup;
    const headers = {
      headers: getHeaders(tempToken, state?.state?.inveoicesData?.id, "false"),
    };
    axios
      .get(lookupApi, headers)
      .then((res: any) => {
        const currencyData: any = prepareCurrencyDropdownOption(
          res?.data?.billingCurrencies
        );
        const depositToBankData: any = prepareDepositToBankDropdownOption(
          res?.data?.depositToOptions
        );
        const locationData: any = preparelocationDropdownOption(
          res?.data?.locations
        );

        let tempCurrOpt: any = [];
        let tempBankDepositOpt: any = [];
        let tempLocationOpt: any = [];

        state?.state?.inveoicesData?.forEach(
          (invoiceItem: any, invoicesIndex: number) => {
            multiPaymentBlocks.forEach((item: any, _index: number) => {
              tempCurrOpt.push({
                invoiceKey: invoiceItem.id,
                blockKey: item.id,
                options: currencyData,
              });
              tempBankDepositOpt.push({
                invoiceKey: invoiceItem.id,
                blockKey: item.id,
                options: depositToBankData,
              });
              tempLocationOpt.push({
                invoiceKey: invoiceItem.id,
                blockKey: item.id,
                options: locationData,
              });
            });
          }
        );

        console.log("tempCurrOpt", tempCurrOpt);

        setCurrencyOptionDefault(currencyData);
        setCurrencyOption(tempCurrOpt);
        setBankToDepositOptionDefault(depositToBankData);
        setBankToDepositOption(tempBankDepositOpt);
        setLocationOptionDefault(locationData);
        setLocationOption(tempLocationOpt);
      })
      .catch((e: any) => {
        console.log("error", e);
      });
  };

  const getPaymentMethodDropdownOption = () => {
    const getSubscriptionLookup = subscriptionLookup();
    const headers = {
      headers: getHeaders(tempToken, state?.state?.inveoicesData?.id, "false"),
    };
    axios
      .get(getSubscriptionLookup, headers)
      .then((res: any) => {
        const paymentMethodData: any = preparePaymentMethodDropdownOption(
          res?.data?.paymentMethods
        );

        let tempPayMethodOpt: any = [];
        state?.state?.inveoicesData?.forEach(
          (invoiceItem: any, invoicesIndex: number) => {
            multiPaymentBlocks.forEach((item: any, _index: number) => {
              tempPayMethodOpt.push({
                invoiceKey: invoiceItem.id,
                blockKey: item.id,
                options: paymentMethodData,
              });
            });
          }
        );

        setPaymentMethodOptionDefault(paymentMethodData);
        setPaymentMethodOption(tempPayMethodOpt);
      })
      .catch((e: any) => {
        console.log("error", e);
      });
  };

  const prepareCurrencyDropdownOption = (data: any) => {
    return data?.map((item: any) => {
      return {
        ...item,
        isSelected: false,
        label: item.text,
        value: item.text,
      };
    });
  };

  const prepareDepositToBankDropdownOption = (data: any) => {
    return data?.map((item: any) => {
      return {
        ...item,
        isSelected: false,
        label: item.text,
        value: item.text,
      };
    });
  };

  const preparelocationDropdownOption = (data: any) => {
    return data?.map((item: any) => {
      return {
        ...item,
        isSelected: false,
        label: item.text,
        value: item.text,
      };
    });
  };

  const preparePaymentMethodDropdownOption = (data: any) => {
    return data?.map((item: any) => {
      return {
        ...item,
        isSelected: false,
        label: item.text,
        value: item.text,
      };
    });
  };

  const handlePaymentDropOption = (
    item: any,
    options: any,
    set: any,
    setIsOpen: any,
    invoiceKey: number,
    blockKey: number
  ) => {
    let arr = JSON.parse(JSON.stringify(options));

    let index = arr.findIndex(
      (e: any) => e.invoiceKey === invoiceKey && e.blockKey === blockKey
    );

    console.log("index", index);

    arr[index].options.forEach((e: any, i: number) => {
      console.log("loop item", e, i);

      if (e.value === item.value) {
        // arr[index].options[i] = {
        //   ...arr[index].options[i],
        //   isSelected: !arr[index].options[i].isSelected,
        // };
        console.log("fired if", e);
        e.isSelected = !e.isSelected;
        console.log("fired if", e, arr);
      } else {
        // arr[i] = {
        //   ...arr[i],
        //   isSelected: false,
        // };
        e.isSelected = false;
      }
    });

    console.log("arr", arr);

    set([...arr]);

    setIsOpen(false);
  };

  const handleInputText = (
    value: any,
    sValue: any,
    set: any,
    invoiceKey: number,
    blockKey: number
  ) => {
    let arr = JSON.parse(JSON.stringify(sValue));
    let index = arr.findIndex(
      (e: any) => e.invoiceKey === invoiceKey && e.blockKey === blockKey
    );
    arr[index].text = value;

    set([...arr]);
  };

  const handleDate = (
    date: any,
    dateArr: any,
    set: any,
    invoiceKey: number,
    blockKey: number
  ) => {
    let arr = JSON.parse(JSON.stringify(dateArr));
    let index = arr.findIndex(
      (e: any) => e.invoiceKey === invoiceKey && e.blockKey === blockKey
    );
    arr[index].date = date;

    set([...arr]);
  };

  useEffect(() => {
    getCurrencyAndDepositBankAndLocationDropdownOption();
    getPaymentMethodDropdownOption();

    let tempRefNo: any = [];
    let tempPaymentDate: any = [];

    state?.state?.inveoicesData?.forEach(
      (invoiceItem: any, invoicesIndex: number) => {
        multiPaymentBlocks.forEach((item: any, _index: number) => {
          tempRefNo.push({
            invoiceKey: invoiceItem.id,
            blockKey: item.id,
            text: "",
          });
          tempPaymentDate.push({
            invoiceKey: invoiceItem.id,
            blockKey: item.id,
            date: "",
          });
        });
      }
    );

    setpaymentDate(tempPaymentDate);
    setReferenceNo(tempRefNo);
  }, []);

  const addPaymentBlocks = (invoiceKey: any) => {
    const blockObj = {
      id: Math.random(),
      parentId: invoiceKey,
    };

    setMultiPaymentBlocks([...multiPaymentBlocks, blockObj]);

    setCurrencyOption([
      ...currencyOptions,
      {
        invoiceKey: invoiceKey,
        blockKey: blockObj.id,
        options: currencyOptionsDefault,
      },
    ]);

    setBankToDepositOption([
      ...bankToDepositOptions,
      {
        invoiceKey: invoiceKey,
        blockKey: blockObj.id,
        options: bankToDepositOptionsDefault,
      },
    ]);
    setLocationOption([
      ...locationOptions,
      {
        invoiceKey: invoiceKey,
        blockKey: blockObj.id,
        options: locationOptionsDefault,
      },
    ]);

    setPaymentMethodOption([
      ...paymentMethodOptions,
      {
        invoiceKey: invoiceKey,
        blockKey: blockObj.id,
        options: paymentMethodOptionsDefault,
      },
    ]);

    setReferenceNo([
      ...referenceNo,
      {
        invoiceKey: invoiceKey,
        blockKey: blockObj.id,
        text: "",
      },
    ]);

    setpaymentDate([
      ...paymentDate,
      {
        invoiceKey: invoiceKey,
        blockKey: blockObj.id,
        date: null,
      },
    ]);
  };

  const removePaymentBlock = (item: any) => {
    setMultiPaymentBlocks(
      multiPaymentBlocks.filter((todo: any) => todo.id !== item.id)
    );
  };

  const onChevronClick = (id: any) => {
    let newData: any = [...multiplePaymentId];
    if (newData.includes(id)) {
      newData = newData.filter((item: any) => item != id);
    } else {
      newData.push(id);
    }
    setMultiplePaymentId(newData);
  };

  const handleSave = () => {
    console.log("Save", state.state?.inveoicesData);
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
                label: "Payroll Invoice No. 791230",
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
            label="Save"
            handleOnClick={handleSave}
          />
        </div>
      </div>

      {state?.state?.inveoicesData?.map(
        (invoiceItem: any, invoicesIndex: number) => {
          return (
            <div className="paymentPageInvoiceInfo">
              <div className="paymentPageTopBar">
                {/* <div className="invoic-status">
            <p className="status">{status}</p>
          </div> */}
                <div className="paymentHeaderContainer">
                  <div className="paymentTopBarrow">
                    <div className="paymentInvoivceNo">
                      <Icon color="#FFFFFF" icon="orderSummary" size="large" />
                      <p>
                        {invoiceItem.transactionTypeLabel} {" Invoice No. "}{" "}
                        {invoiceItem.invoiceNo} Payment
                      </p>
                    </div>

                    <div className="payment-header-two">
                      <div className="paymentDetailPageamount">
                        <p>
                          Open <span>{invoiceItem.invoiceBalance}</span>
                        </p>

                        <p>
                          Total <span>{invoiceItem.totalAmount}</span>
                        </p>
                      </div>
                      <div
                        data-testid="open-payment-block"
                        className="header-chevron-icon"
                        onClick={() => {
                          onChevronClick(invoiceItem.id);
                        }}
                      >
                        <Icon
                          color="#fff"
                          icon={
                            multiplePaymentId.includes(invoiceItem.id)
                              ? "chevronUp"
                              : "chevronDown"
                          }
                          size="large"
                        />
                      </div>
                    </div>
                  </div>

                  <p>QBO No. 730</p>
                </div>
              </div>

              {multiplePaymentId.includes(invoiceItem?.id) && (
                <div className="paaymentInstallmetOuterContainer">
                  {multiPaymentBlocks?.map((item: any, i: any) => {
                    if (item.parentId === invoiceItem.id)
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
                              <DatePicker
                                label="Payment Date"
                                handleDateChange={function (date: any) {
                                  handleDate(
                                    date,
                                    paymentDate,
                                    setpaymentDate,
                                    invoiceItem.id,
                                    item.id
                                  );
                                }}
                                required
                              />
                            </div>

                            <div>
                              <Dropdown
                                handleDropdownClick={(b: boolean) => {
                                  setIsCurrencyDropdownOpen(b);
                                  setIsLocationDropdownOpen(false);
                                  setIsBankDropdownOpen(false);
                                  setIsPaymentMethodDropdownOpen(false);
                                  setToggleState({ index: i, invoicesIndex });
                                }}
                                handleDropOptionClick={(sel: any) => {
                                  handlePaymentDropOption(
                                    sel,
                                    currencyOptions,
                                    setCurrencyOption,
                                    setIsCurrencyDropdownOpen,
                                    invoiceItem.id,
                                    item.id
                                  );
                                }}
                                isOpen={
                                  toggleState.index == i &&
                                  toggleState.invoicesIndex == invoicesIndex
                                    ? isCurrencyDropdownOpen
                                    : false
                                }
                                options={
                                  currencyOptions.find(
                                    (e: any) =>
                                      e.invoiceKey === invoiceItem.id &&
                                      e.blockKey === item.id
                                  )?.options || []
                                }
                                title="Currency"
                              />
                            </div>

                            <div>
                              <Dropdown
                                handleDropdownClick={(b: boolean) => {
                                  setIsLocationDropdownOpen(b);
                                  setIsCurrencyDropdownOpen(false);
                                  setIsBankDropdownOpen(false);
                                  setIsPaymentMethodDropdownOpen(false);
                                  setToggleState({ index: i, invoicesIndex });
                                }}
                                handleDropOptionClick={(sel: any) => {
                                  handlePaymentDropOption(
                                    sel,
                                    locationOptions,
                                    setLocationOption,
                                    setIsLocationDropdownOpen,
                                    invoiceItem.id,
                                    item.id
                                  );
                                }}
                                isOpen={
                                  toggleState.index == i &&
                                  toggleState.invoicesIndex == invoicesIndex
                                    ? isLocationDropdownOpen
                                    : false
                                }
                                options={
                                  locationOptions.find(
                                    (e: any) =>
                                      e.invoiceKey === invoiceItem.id &&
                                      e.blockKey === item.id
                                  )?.options || []
                                }
                                title="Location"
                              />
                            </div>

                            <div className="paymentInstallmentContainerDropdowns">
                              <div className="referenceNoInput">
                                <span>Reference No</span>
                                <input
                                  value={
                                    referenceNo.find(
                                      (e: any) =>
                                        e.invoiceKey === invoiceItem.id &&
                                        e.blockKey === item.id
                                    )?.text || ""
                                  }
                                  name="Reference No"
                                  type="number"
                                  placeholder="Enter reference No"
                                  onChange={(e) => {
                                    handleInputText(
                                      e.target.value,
                                      referenceNo,
                                      setReferenceNo,
                                      invoiceItem.id,
                                      item.id
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="paymentInstallmentLowerBlock">
                            <div className="paymentInnerLowerBlock">
                              <div>
                                <Dropdown
                                  handleDropdownClick={(b: boolean) => {
                                    setIsBankDropdownOpen(b);
                                    setIsCurrencyDropdownOpen(false);
                                    setIsLocationDropdownOpen(false);
                                    setIsPaymentMethodDropdownOpen(false);
                                    setToggleState({ index: i, invoicesIndex });
                                  }}
                                  handleDropOptionClick={(sel: any) => {
                                    handlePaymentDropOption(
                                      sel,
                                      bankToDepositOptions,
                                      setBankToDepositOption,
                                      setIsBankDropdownOpen,
                                      invoiceItem.id,
                                      item.id
                                    );
                                  }}
                                  isOpen={
                                    toggleState.index == i &&
                                    toggleState.invoicesIndex == invoicesIndex
                                      ? isBankDropdownOpen
                                      : false
                                  }
                                  options={
                                    bankToDepositOptions.find(
                                      (e: any) =>
                                        e.invoiceKey === invoiceItem.id &&
                                        e.blockKey === item.id
                                    )?.options || []
                                  }
                                  title="Deposited to bank"
                                />
                              </div>
                              <div>
                                <Dropdown
                                  handleDropdownClick={(b: boolean) => {
                                    setIsPaymentMethodDropdownOpen(b);
                                    setIsCurrencyDropdownOpen(false);
                                    setIsLocationDropdownOpen(false);
                                    setIsBankDropdownOpen(false);
                                    setToggleState({ index: i, invoicesIndex });
                                  }}
                                  handleDropOptionClick={(sel: any) => {
                                    handlePaymentDropOption(
                                      sel,
                                      paymentMethodOptions,
                                      setPaymentMethodOption,
                                      setIsPaymentMethodDropdownOpen,
                                      invoiceItem.id,
                                      item.id
                                    );
                                  }}
                                  isOpen={
                                    toggleState.index == i &&
                                    toggleState.invoicesIndex == invoicesIndex
                                      ? isPaymentMethodDropdownOpen
                                      : false
                                  }
                                  options={
                                    paymentMethodOptions.find(
                                      (e: any) =>
                                        e.invoiceKey === invoiceItem.id &&
                                        e.blockKey === item.id
                                    )?.options || []
                                  }
                                  title="Payment Method"
                                />
                              </div>
                            </div>

                            <div className="PaymentPageTotalAmount">
                              <p>Amount</p>
                              <div className="amountPaymentPage">
                                USD 300,523.15
                              </div>
                              {i == 0 && multiPaymentBlocks.length == 1 ? (
                                <div className="fullAmountPaymentCheckbox">
                                  <Checkbox
                                    checked={true}
                                    label="Full Amount"
                                  />
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
                      onClick={() => addPaymentBlocks(invoiceItem.id)}
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
          );
        }
      )}

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
