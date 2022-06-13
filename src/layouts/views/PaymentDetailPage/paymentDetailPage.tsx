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
import FileUploadWidget from "../../../components/FileUpload";
import Input from "../../../components/Input/input";
import { urls, getHeaders, subscriptionLookup } from "../../../urls/urls";
import axios from "axios";

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
  const [toggleState, setToggleState] = useState(0);
  const [currencyOptions, setCurrencyOption] = useState<any>([]);
  const [bankToDepositOptions, setBankToDepositOption] = useState<any>([]);
  const [locationOptions, setLocationOption] = useState<any>([]);
  const [paymentMethodOptions, setPaymentMethodOption] = useState<any>([]);
  const [referenceNo, setReferenceNo] = useState<any>([]);
  const [multiplePaymentId, setMultiplePaymentId] = useState([]);
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
        setCurrencyOption(currencyData);
        setBankToDepositOption(depositToBankData);
        setLocationOption(locationData);
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
        setPaymentMethodOption(paymentMethodData);
      })
      .catch((e: any) => {
        console.log("error", e);
      });
  };

  const prepareCurrencyDropdownOption = (data: any) => {
    const newData = data?.map((item: any) => {
      return {
        ...item,
        isSelected: false,
        label: item.text,
        value: item.text,
      };
    });
    return newData;
  };

  const prepareDepositToBankDropdownOption = (data: any) => {
    const newData = data?.map((item: any) => {
      return {
        ...item,
        isSelected: false,
        label: item.text,
        value: item.text,
      };
    });
    return newData;
  };

  const preparelocationDropdownOption = (data: any) => {
    const newData = data?.map((item: any) => {
      return {
        ...item,
        isSelected: false,
        label: item.text,
        value: item.text,
      };
    });
    return newData;
  };

  const preparePaymentMethodDropdownOption = (data: any) => {
    const newData = data?.map((item: any) => {
      return {
        ...item,
        isSelected: false,
        label: item.text,
        value: item.text,
      };
    });
    return newData;
  };

  const handleDropOption = (
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
    setIsOpen(false);
  };

  useEffect(() => {
    getCurrencyAndDepositBankAndLocationDropdownOption();
    getPaymentMethodDropdownOption();
  }, []);

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


  const onChevronClick = (id: any) => {
    let newData: any = [...multiplePaymentId];
    if (newData.includes(id)) {
      newData = newData.filter((item: any) => item != id);
    } else {
      newData.push(id);
    }
    setMultiplePaymentId(newData);
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
          <Button className="primary-blue medium" label="Save" />
        </div>
      </div>

      {state?.state?.inveoicesData?.map((item: any) => {
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
                      {item.transactionTypeLabel} {" Invoice No. "}{" "}
                      {item.invoiceNo} Payment
                    </p>
                  </div>

                  <div className="payment-header-two">
                    <div className="paymentDetailPageamount">
                      <p>
                        Open <span>{item.invoiceBalance}</span>
                      </p>

                      <p>
                        Total <span>{item.totalAmount}</span>
                      </p>
                    </div>
                    <div
                      data-testid="open-payment-block"
                      className="header-chevron-icon"
                      onClick={() => {
                        onChevronClick(item.id);
                      }}
                    >
                      <Icon
                        color="#fff"
                        icon={
                          multiplePaymentId.includes(item.id)
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

            {multiplePaymentId.includes(item?.id) && (
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
                          <DatePicker
                            label="Payment Date"
                            handleDateChange={function (date: any) {
                              console.log("date", date);
                            }}
                            required
                          />
                        </div>

                        <div className="paymentInstallmentContainerDropdowns">
                          <Dropdown
                            handleDropdownClick={(b: boolean) => {
                              setIsCurrencyDropdownOpen(b);
                              setIsLocationDropdownOpen(false);
                              setIsBankDropdownOpen(false);
                              setIsPaymentMethodDropdownOpen(false);
                              setToggleState(i);
                            }}
                            handleDropOptionClick={(item: any) => {
                              handleDropOption(
                                item,
                                currencyOptions,
                                setCurrencyOption,
                                setIsCurrencyDropdownOpen
                              );
                            }}
                            isOpen={
                              toggleState == i ? isCurrencyDropdownOpen : false
                            }
                            options={currencyOptions}
                            title="Currency"
                          />
                        </div>

                        <div className="paymentInstallmentContainerDropdowns">
                          <Dropdown
                            handleDropdownClick={(b: boolean) => {
                              setIsLocationDropdownOpen(b);
                              setIsCurrencyDropdownOpen(false);
                              setIsBankDropdownOpen(false);
                              setIsPaymentMethodDropdownOpen(false);
                              setToggleState(i);
                            }}
                            handleDropOptionClick={(item: any) => {
                              handleDropOption(
                                item,
                                locationOptions,
                                setLocationOption,
                                setIsLocationDropdownOpen
                              );
                            }}
                            isOpen={
                              toggleState == i ? isLocationDropdownOpen : false
                            }
                            options={locationOptions}
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
                                setIsBankDropdownOpen(b);
                                setIsCurrencyDropdownOpen(false);
                                setIsLocationDropdownOpen(false);
                                setIsPaymentMethodDropdownOpen(false);
                                setToggleState(i);
                              }}
                              handleDropOptionClick={(item: any) => {
                                handleDropOption(
                                  item,
                                  bankToDepositOptions,
                                  setBankToDepositOption,
                                  setIsBankDropdownOpen
                                );
                              }}
                              isOpen={
                                toggleState == i ? isBankDropdownOpen : false
                              }
                              options={bankToDepositOptions}
                              title="Deposited to bank"
                            />
                          </div>
                          <div className="paymentInstallmentContainerDropdowns">
                            <Dropdown
                              handleDropdownClick={(b: boolean) => {
                                setIsPaymentMethodDropdownOpen(b);
                                setIsCurrencyDropdownOpen(false);
                                setIsLocationDropdownOpen(false);
                                setIsBankDropdownOpen(false);
                                setToggleState(i);
                              }}
                              handleDropOptionClick={(item: any) => {
                                handleDropOption(
                                  item,
                                  paymentMethodOptions,
                                  setPaymentMethodOption,
                                  setIsPaymentMethodDropdownOpen
                                );
                              }}
                              isOpen={
                                toggleState == i
                                  ? isPaymentMethodDropdownOpen
                                  : false
                              }
                              options={paymentMethodOptions}
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
        );
      })}

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
