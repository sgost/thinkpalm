import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Dropdown,
  Icon,
  ToastNotification,
} from "atlasuikit";
import { getDecodedToken } from "../../../components/getDecodedToken";
import axios from "axios";
import moment from "moment";
import {
  editPaymentDetailApi,
  getHeaders,
  getPaymentDetailApi,
  subscriptionLookup,
  urls,
} from "../../../urls/urls";
import { statusValues } from "./statusValues";

/* istanbul ignore next */
const RefundDetailContainer = ({
  cid,
  lookupData,
  paymentDetailData,
  getBillingCurrency,
  id,
  setPaymentDetailData,
  topPanel,
  setTopPanel,
  setStatus,
  currentStatusValue,
  setCurrentStatusValue,
  toCurrencyFormat,
}: any) => {
  const permission: any = getDecodedToken();
  const tempToken = localStorage.getItem("accessToken");

  const [refundCurrencyEditOpen, setRefundCurrencyEditOpen] = useState();
  const [refundLocationEditOpen, setRefundLocationEditOpen] = useState();
  const [refundDepositBankEditOpen, setRefundDepositBankEditOpen] = useState();
  const [refundPaymentMethodEditOpen, setPaymentMethodEditOpen] = useState();
  const [refundCurrencyOpen, setRefundCurrencyOpen] = useState(false);
  const [refundLocationOpen, setRefundLocationOpen] = useState(false);
  const [referenceNo, setReferenceNo] = useState<any>();
  const [refundAddAmount, setRefundAddAmount] = useState<any>(0.0);
  const [refundDepositBankOpen, setRefundDepositBankOpen] = useState(false);
  const [refundPaymentMethodOpen, setRefundPaymentMethodOpen] = useState(false);
  const [refundEditChecked, setRefundEditChecked] = useState<any>();
  const [refundNewCurrency, setRefundNewCurrency] = useState<any>();
  const [refundNewLocation, setRefundNewLocation] = useState<any>();
  const [refundNewDepositBank, setRefundNewDepositBank] = useState<any>();
  const [refundNewPaymentMethod, setRefundNewPaymentMethod] = useState<any>();
  const [refundNewReferenceNo, setRefundNewReferenceNo] = useState<any>();
  const [paymentApiData, setPaymentApiData] = useState<any>(paymentDetailData);
  const [addRefundSectionCheck, setAddRefundSectionCheck] = useState(false);
  const [refundNewPaymentDate, setRefundNewPaymentDate] = useState<any>();
  const [allRefundDropdownData] = useState({
    currency: lookupData?.data?.billingCurrencies,
    depositBank: lookupData?.data?.depositToOptions,
    location: lookupData?.data?.locations,
  });
  const [paymentMethodData, setPaymentMethodData] = useState([]);
  const [refundPaymentDate, setRefundPaymentDate] = useState();
  const [refundEditAmount, setRefundEditAmount] = useState<any>({});
  const [refundEditButtonDisable, setRefundEditButtonDisable] = useState(false);
  const [refundEditDisableToggle, setRefundEditDisableToggle] = useState(false);
  const [refundCurrencyDropdownOptions, setRefundCurrencyDropdownOption] =
    useState<any>([]);
  const [
    refundBankToDepositDropdownOptions,
    setRefundBankToDepositDropdownOption,
  ] = useState<any>([]);
  const [refundLocationDropdownOptions, setRefundLocationDropdownOption] =
    useState<any>([]);
  const [
    refundPaymentMethodDropdownOptions,
    setRefundPaymentMethodDropdownOption,
  ] = useState<any>([]);
  const [refundAddCurrencyDropdownOptions, setRefundAddCurrencyDropdownOption] =
    useState<any>([]);
  const [
    refundAddBankToDepositDropdownOptions,
    setRefundAddBankToDepositDropdownOption,
  ] = useState<any>([]);
  const [refundAddLocationDropdownOptions, setRefundAddLocationDropdownOption] =
    useState<any>([]);
  const [
    refundAddPaymentMethodDropdownOptions,
    setRefundAddPaymentMethodDropdownOption,
  ] = useState<any>([]);
  const [isToaster, setIsToaster] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState<any>("");

  useEffect(() => {
    if (paymentDetailData) {
      setPaymentApiData(paymentDetailData);
      updateRefundDropdowns(paymentDetailData);
    }
  }, [paymentDetailData]);

  const getCurrencyAndDepositBankAndLocationRefundDropdownOption = () => {
    const currencyDataOptions: any = prepareCurrencyRefundDropdownOptionData(
      lookupData?.data?.billingCurrencies
    );
    const depositToBankDataOptions: any =
      prepareDepositToBankRefundDropdownOptionData(
        lookupData?.data?.depositToOptions
      );
    const locationDataOptions: any = preparelocationRefundDropdownOptionData(
      lookupData?.data?.locations
    );
    setRefundAddCurrencyDropdownOption(currencyDataOptions);
    setRefundAddBankToDepositDropdownOption(depositToBankDataOptions);
    setRefundAddLocationDropdownOption(locationDataOptions);
  };

  const getPaymentMethodRefundDropdownOptionData = () => {
    const getSubscriptionLookup = subscriptionLookup();
    const headers = {
      headers: getHeaders(tempToken, cid, "false"),
    };
    axios
      .get(getSubscriptionLookup, headers)
      .then((res: any) => {
        const paymentMethodDropdownData: any =
          preparePaymentMethodRefundDropdownOptionData(
            res?.data?.paymentMethods
          );
        setRefundAddPaymentMethodDropdownOption(paymentMethodDropdownData);
        setPaymentMethodData(paymentMethodDropdownData);
      })
      .catch((e: any) => {
        console.log("error", e);
      });
  };

  const prepareCurrencyRefundDropdownOptionData = (data: any) => {
    return data?.map((item: any) => {
      return {
        ...item,
        isSelected: false,
        label: item.text,
        value: item.value,
      };
    });
  };

  const prepareDepositToBankRefundDropdownOptionData = (bankData: any) => {
    return bankData?.map((bankItem: any) => {
      return {
        ...bankItem,
        isSelected: false,
        label: bankItem.text,
        value: bankItem.value,
      };
    });
  };

  const preparelocationRefundDropdownOptionData = (locationData: any) => {
    return locationData?.map((locationItem: any) => {
      return {
        ...locationItem,
        isSelected: false,
        label: locationItem.text,
        value: locationItem.value,
      };
    });
  };

  const preparePaymentMethodRefundDropdownOptionData = (paymentMethodData: any) => {
    return paymentMethodData?.map((paymentMethodItem: any) => {
      return {
        ...paymentMethodItem,
        isSelected: false,
        label: paymentMethodItem.text,
        value: paymentMethodItem.value,
      };
    });
  };

  const handleRefundDropOptionData = (
    item: any,
    options: any,
    set: any,
    setIsOpen: any,
    index: number
  ) => {
    let array = [...options];

    array &&
      array[index]?.forEach((e: any, i: number) => {
        if (e.value === item.value) {
          array[index][i] = {
            ...e,
            label: e.label,
            value: e.value,
            isSelected: !e.isSelected,
          };
        } else {
          array[index][i] = {
            ...array[index][i],
            isSelected: false,
          };
        }
      });
    set([]);
    setTimeout(() => {
      set([...array]);
    }, 1);
    setIsOpen(paymentApiData.length + 1);
  };

  const refundCurrencyDropOptionClick = (option: any) =>
    handleRefundAddOptionClick({
      option,
      dropOptions: refundAddCurrencyDropdownOptions,
      updateIsOpen: setRefundCurrencyOpen,
      isDropOpen: refundCurrencyOpen,
      updateOptions: setRefundAddCurrencyDropdownOption,
      type: "currency",
    });

  const refundLocationDropOptionClick = (option: any) =>
    handleRefundAddOptionClick({
      option,
      dropOptions: refundAddLocationDropdownOptions,
      updateIsOpen: setRefundLocationOpen,
      isDropOpen: refundLocationOpen,
      updateOptions: setRefundAddLocationDropdownOption,
      type: "location",
    });

  const refundDepositBankDropOptionClick = (option: any) =>
    handleRefundAddOptionClick({
      option,
      dropOptions: refundAddBankToDepositDropdownOptions,
      updateIsOpen: setRefundDepositBankOpen,
      isDropOpen: refundDepositBankOpen,
      updateOptions: setRefundAddBankToDepositDropdownOption,
      type: "bankDeposit",
    });

  const refundPaymentMethodDropOptionClick = (option: any) =>
    handleRefundAddOptionClick({
      option,
      dropOptions: refundAddPaymentMethodDropdownOptions,
      updateIsOpen: setRefundPaymentMethodOpen,
      isDropOpen: refundPaymentMethodOpen,
      updateOptions: setRefundAddPaymentMethodDropdownOption,
      type: "paymentMethod",
    });

  const handleRefundAddOptionClick = (args: any) => {
    const {
      option,
      dropOptions,
      updateIsOpen,
      isDropOpen,
      updateOptions,
      type,
    } = args;
    updateIsOpen(!isDropOpen);
    let updatedOptions = dropOptions?.map((opt: any) => {
      opt.isSelected = option.value === opt.value;
      return opt;
    });
    if (type == "currency") {
      setRefundNewCurrency(option);
    } else if (type == "location") {
      setRefundNewLocation(option);
    } else if (type == "bankDeposit") {
      setRefundNewDepositBank(option);
    } else if (type == "paymentMethod") {
      setRefundNewPaymentMethod(option);
    }

    updateOptions(updatedOptions);
  };

  const updateRefundDropdowns = (paymentDetailDatas: any) => {
    let billingCurrencyArray: any = [];

    if (lookupData?.data?.billingCurrencies) {
      paymentDetailDatas?.forEach((item: any) => {
        billingCurrencyArray.push(
          lookupData?.data?.billingCurrencies?.map((x: any) => {
            return {
              isSelected: x.value == item.currencyId,
              label: x.text,
              value: x.value,
            };
          })
        );
      });
      setRefundCurrencyDropdownOption(billingCurrencyArray);
    }

    let bankToDepositArray: any = [];

    if (lookupData?.data?.depositToOptions) {
      paymentDetailDatas?.forEach((item: any) => {
        bankToDepositArray.push(
          lookupData?.data?.depositToOptions?.map((x: any) => {
            return {
              isSelected: x.value == item.depositedtoBank,
              label: x.text,
              value: x.value,
            };
          })
        );
      });
      setRefundBankToDepositDropdownOption(bankToDepositArray);
    }

    let locationArray: any = [];

    if (lookupData?.data?.locations) {
      paymentDetailDatas?.forEach((item: any) => {
        locationArray.push(
          lookupData?.data?.locations?.map((x: any) => {
            return {
              isSelected: x.value == item.location,
              label: x.text,
              value: x.value,
            };
          })
        );
      });
      setRefundLocationDropdownOption(locationArray);
    }

    const getSubscriptionLookupApi = subscriptionLookup();
    const headers = {
      headers: getHeaders(tempToken, cid, "false"),
    };
    axios
      .get(getSubscriptionLookupApi, headers)
      .then((res: any) => {
        if (res?.data?.paymentMethods) {
          let paymentMethodArr: any = [];
          paymentDetailDatas?.forEach((item: any) => {
            paymentMethodArr.push(
              res?.data?.paymentMethods?.map((x: any) => {
                return {
                  isSelected: x.value == item.paymentMethod,
                  label: x.text,
                  value: x.value,
                };
              })
            );
          });
          setRefundPaymentMethodDropdownOption(paymentMethodArr);
        }
      })
      .catch((e: any) => {
        console.log("error", e);
      });
  };

  const cleanNewRefundObject = () => {
    setRefundNewPaymentDate("");
    setRefundNewCurrency(null);

    setRefundAddLocationDropdownOption(
      allRefundDropdownData?.location?.map((item: any) => {
        return {
          isSelected: false,
          label: item.text,
          value: item.value,
        };
      })
    );
    setRefundAddCurrencyDropdownOption(
      allRefundDropdownData?.currency?.map((items: any) => {
        return {
          isSelected: false,
          label: items.text,
          value: items.value,
        };
      })
    );
    setRefundAddBankToDepositDropdownOption(
      allRefundDropdownData?.depositBank?.map((itemsNew: any) => {
        return {
          isSelected: false,
          label: itemsNew.text,
          value: itemsNew.value,
        };
      })
    );
    setRefundAddPaymentMethodDropdownOption(
      paymentMethodData?.map((x: any) => {
        return {
          isSelected: false,
          label: x.text,
          value: x.value,
        };
      })
    );
    setRefundNewLocation(null);
    setRefundNewDepositBank(null);
    setRefundNewPaymentMethod(null);
    setRefundNewReferenceNo("");
    setRefundAddAmount(null);
  };

  const saveRefundDetail = () => {
    let arr: any = [];
    arr.push({
      totalAmount: refundAddAmount,
      paymentDate: refundNewPaymentDate,
      currencyId: refundNewCurrency?.value,
      location: refundNewLocation?.value,
      referenceNo: refundNewReferenceNo,
      depositedtoBank: refundNewDepositBank.value,
      paymentMethod: refundNewPaymentMethod?.value,
    });

    const data: any = {
      PaymentType: 1,
      invoiceids: [id],
      paymentnotes: [],
      paymentdocuments: [],
      Payments: arr,
    };

    axios({
      method: "POST",
      url: urls.savePayments,
      headers: getHeaders(tempToken, cid, "false"),
      data: data,
    })
      .then(async (res) => {
        console.log("res", res);
        const headers = {
          headers: getHeaders(tempToken, cid, "false"),
        };

        let paymentdetailApi = getPaymentDetailApi(id);

        axios
          .get(paymentdetailApi, headers)
          .then((response: any) => {
            setPaymentDetailData(response?.data?.payments);
            setAddRefundSectionCheck(false);
            setRefundEditChecked(null);
            setReferenceNo(null);
            cleanNewRefundObject();
            setTopPanel({
              ...topPanel,
              open: response?.data?.invoice?.invoiceBalance,
            });
            if (response?.data?.invoice?.invoiceBalance === 0) {
              setStatus("Paid");
              setCurrentStatusValue(statusValues.paid);
            }
          })
          .catch((e: any) => {
            console.log("error e", e);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const editRefundChanges = (item: any, key: any) => {
    let editRefundArr = [];

    editRefundArr.push({
      paymentinvoiceid: item?.paymentInvoiceId,
      totalAmount:
        refundEditAmount && refundEditAmount[key]
          ? refundEditAmount[key]
          : item.totalAmount,
      paymentDate: refundPaymentDate ? refundPaymentDate : item.paymentDate,
      currencyId: refundCurrencyDropdownOptions[key]?.find(
        (e: any) => e.isSelected
      )?.value,
      location: refundLocationDropdownOptions[key]?.find(
        (e: any) => e.isSelected
      )?.value,
      referenceNo:
        referenceNo && referenceNo[key] ? referenceNo[key] : item.referenceNo,
      depositedtoBank: refundBankToDepositDropdownOptions[key]?.find(
        (e: any) => e.isSelected
      )?.value,
      paymentMethod: refundPaymentMethodDropdownOptions[key]?.find(
        (e: any) => e.isSelected
      )?.value,
    });

    const refundPayload = {
      invoiceids: [id],
      paymentnotes: [],
      Payments: editRefundArr,
    };

    axios({
      method: "POST",
      url: editPaymentDetailApi(),
      headers: getHeaders(tempToken, cid, "false"),
      data: refundPayload,
    })
      .then(async (res) => {
        if (res.status == 200) {
          setPaymentApiData(res?.data?.payments);
          let obj = { ...referenceNo };
          obj[key] = res?.data?.payments[key]?.referenceNo;
          setReferenceNo(obj);
          let objAm = { ...refundEditAmount };
          objAm[key] = res?.data?.payments[key]?.totalAmount;
          setRefundEditAmount(objAm);
          setRefundEditChecked(null);
          setRefundEditButtonDisable(false);
          setTopPanel({
            ...topPanel,
            open: res?.data?.invoice?.invoiceBalance,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const AddInstallmentSaveDisable = () => {
    let isDisable = false;

    const totalAmount = refundAddAmount;
    const openAmount = topPanel?.open;

    if (totalAmount > openAmount) {
      if (!isToaster) setIsToaster(true);
      isDisable = true;
    }
    return isDisable;
  };

  const EditInstallmentSaveDisable = (key: any) => {
    let isDisable = false;

    const openAmount = topPanel?.open;
    const editTotalAmount = refundEditAmount;

    if (refundEditDisableToggle && editTotalAmount[key] > openAmount) {
      if (!isToaster) setIsToaster(true);
      isDisable = true;
    }
    return isDisable;
  };

  useEffect(() => {
    getCurrencyAndDepositBankAndLocationRefundDropdownOption();
    getPaymentMethodRefundDropdownOptionData();
  }, []);

  const addPaymentInstallmentBlocks = () => {
    setAddRefundSectionCheck(true);
  };

  const addPaymentButtonClassName = addRefundSectionCheck ? "addPaymentInstallmentIconDisable" : "addPaymentInstallmentIcon"

  return (
    <div className="paymentDisplayContainer">
      {paymentApiData &&
        paymentApiData?.map((item: any, key: any) => {
          return (
            <div className="paymentInstallmentContainer">
              <div
                className={
                  key == 0
                    ? "paymentPageTitleHeader"
                    : "paymentPageTitleHeaderNoTitle"
                }
              >
                {key == 0 ? <p>Refund Details</p> : <></>}
                <div className="topButtonActions">
                  {permission?.InvoiceDetails.includes("Edit") &&
                    refundEditChecked != key &&
                    currentStatusValue === statusValues.paid && (
                      <div className="paymentDetailEdit">
                        <Button
                          disabled={refundEditButtonDisable}
                          className="primary-blue medium"
                          icon={{
                            color: "#fff",
                            icon: "edit",
                            size: "small",
                          }}
                          label="Edit"
                          handleOnClick={() => {
                            setRefundEditButtonDisable(true);
                            setRefundEditChecked(key);
                          }}
                        />
                      </div>
                    )}

                  {refundEditChecked == key && (
                    <div className="paymentPageCancelSave">
                      <div className="paymentDetailCancel">
                        <Button
                          className="secondary-btn"
                          label="Cancel Edit"
                          handleOnClick={() => {
                            const headers = {
                              headers: getHeaders(tempToken, cid, "false"),
                            };

                            let paymentdetailApi = getPaymentDetailApi(id);

                            axios
                              .get(paymentdetailApi, headers)
                              .then((res: any) => {
                                setPaymentDetailData(res?.data?.payments);
                                setAddRefundSectionCheck(false);
                                setRefundEditChecked(null);
                                let obj = { ...referenceNo };
                                obj[key] = res.data?.payments[key].referenceNo;
                                setReferenceNo(obj);
                                let objAm = { ...refundEditAmount };
                                objAm[key] =
                                  res.data?.payments[key].totalAmount;
                                setRefundEditAmount(objAm);
                                setRefundEditButtonDisable(false);
                                setTopPanel({
                                  ...topPanel,
                                  open: res?.data?.invoice?.invoiceBalance,
                                });
                              })
                              .catch((e: any) => {
                                console.log("error e", e);
                              });
                          }}
                        />
                      </div>

                      <div className="paymentDetailSave">
                        <Button
                          disabled={EditInstallmentSaveDisable(key)}
                          className="primary-blue medium"
                          label="Save Changes"
                          handleOnClick={() => {
                            editRefundChanges(item, key);
                          }}
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
                    value={moment(item.paymentDate).format("DD MMM YYYY")}
                    disabled={refundEditChecked != key}
                    required
                    handleDateChange={(date: any) => {
                      setRefundPaymentDate(date);
                      paymentApiData[key].paymentDate = date;
                      setPaymentApiData([...paymentApiData]);
                    }}
                  />
                </div>

                <div className="paymentInstallmentContainerDropdowns">
                  <Dropdown
                    handleDropdownClick={(b: boolean) => {
                      b
                        ? setRefundCurrencyEditOpen(key)
                        : setRefundCurrencyEditOpen(paymentApiData.length + 1);
                    }}
                    handleDropOptionClick={(data: any) => {
                      handleRefundDropOptionData(
                        data,
                        refundCurrencyDropdownOptions,
                        setRefundCurrencyDropdownOption,
                        setRefundCurrencyEditOpen,
                        key
                      );
                    }}
                    options={refundCurrencyDropdownOptions[key] || []}
                    isOpen={refundCurrencyEditOpen == key}
                    isDisabled={refundEditChecked != key}
                    title="Currency"
                  />
                </div>

                <div className="paymentInstallmentContainerDropdowns">
                  <Dropdown
                    handleDropdownClick={(b: boolean) => {
                      b
                        ? setRefundLocationEditOpen(key)
                        : setRefundLocationEditOpen(paymentApiData.length + 1);
                    }}
                    handleDropOptionClick={(data: any) => {
                      handleRefundDropOptionData(
                        data,
                        refundLocationDropdownOptions,
                        setRefundLocationDropdownOption,
                        setRefundLocationEditOpen,
                        key
                      );
                    }}
                    options={refundLocationDropdownOptions[key] || []}
                    isOpen={refundLocationEditOpen == key}
                    isDisabled={refundEditChecked != key}
                    title="Location"
                  />
                </div>

                <div className="paymentInstallmentContainerDropdowns">
                  <div className="referenceNoInput">
                    <span
                      className={
                        refundEditChecked != key ? "disable-label" : ""
                      }
                    >
                      Reference No
                    </span>
                    <input
                      data-testid={item.referenceNo}
                      key={item.referenceNo}
                      className={
                        refundEditChecked != key ? "disable-input" : ""
                      }
                      value={referenceNo && referenceNo[key]}
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
                      disabled={refundEditChecked != key}
                      onChange={(e) => {
                        let obj = { ...referenceNo };
                        obj[key] = e.target.value;
                        setReferenceNo(obj);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="paymentInstallmentLowerBlock">
                <div className="paymentInnerLowerBlock">
                  <div className="paymentInstallmentContainerDropdowns">
                    <Dropdown
                      testId="deposite-bank"
                      handleDropdownClick={(b: boolean) => {
                        b
                          ? setRefundDepositBankEditOpen(key)
                          : setRefundDepositBankEditOpen(
                              paymentApiData.length + 1
                            );
                      }}
                      handleDropOptionClick={(data: any) => {
                        handleRefundDropOptionData(
                          data,
                          refundBankToDepositDropdownOptions,
                          setRefundBankToDepositDropdownOption,
                          setRefundDepositBankEditOpen,
                          key
                        );
                      }}
                      options={refundBankToDepositDropdownOptions[key] || []}
                      isOpen={refundDepositBankEditOpen == key}
                      isDisabled={refundEditChecked != key}
                      title="Credited from bank"
                    />
                  </div>

                  <div className="paymentInstallmentContainerDropdowns">
                    <Dropdown
                      handleDropdownClick={(b: boolean) => {
                        b
                          ? setPaymentMethodEditOpen(key)
                          : setPaymentMethodEditOpen(paymentApiData.length + 1);
                      }}
                      handleDropOptionClick={(data: any) => {
                        handleRefundDropOptionData(
                          data,
                          refundPaymentMethodDropdownOptions,
                          setRefundPaymentMethodDropdownOption,
                          setPaymentMethodEditOpen,
                          key
                        );
                      }}
                      options={refundPaymentMethodDropdownOptions[key] || []}
                      isOpen={refundPaymentMethodEditOpen == key}
                      isDisabled={refundEditChecked != key}
                      title="Payment Method"
                    />
                  </div>

                  <div className="paymentInstallmentContainerDropdowns">
                    <div className="invoiceNumber">
                      <span
                        className={
                          refundEditChecked != key ? "disable-label" : ""
                        }
                      >
                        Invoice Number
                      </span>
                      <input
                        data-testid={item.invoiceNumber}
                        key={item.invoiceNumber}
                        className={
                          refundEditChecked != key ? "disable-input" : ""
                        }
                        value={invoiceNumber && invoiceNumber[key]}
                        name="Reference No"
                        type="number"
                        placeholder="Enter Invoice Number"
                        defaultValue={item.invoiceNumber}
                        min="0"
                        disabled={refundEditChecked != key}
                        pattern="[+-]?\d+(?:[.,]\d+)?"
                        onKeyDown={(e) => {
                          ["e", "E", "+", "-", "."].includes(e.key) &&
                            e.preventDefault();
                        }}
                        onChange={(e) => {
                          let obj = { ...invoiceNumber };
                          obj[key] = e.target.value;
                          setInvoiceNumber(obj);
                        }}
                      />
                    </div>
                  </div>

                  <div className="PaymentPageTotalAmountInput">
                    <div className="amountPaymentPageInput">
                      <span
                        className={
                          refundEditChecked != key ? "disable-label" : ""
                        }
                      >
                        Amount
                      </span>
                      <input
                        data-testid="addAmount"
                        value={refundEditAmount}
                        className={
                          refundEditChecked != key ? "disable-input" : ""
                        }
                        type="number"
                        placeholder="0"
                        onChange={(e) => {
                          setRefundEditAmount(parseFloat(e.target.value));
                        }}
                        min="0"
                        pattern="[+-]?\d+(?:[.,]\d+)?"
                        onKeyDown={(e) => {
                          ["e", "E", "+", "-"].includes(e.key) &&
                            e.preventDefault();
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="paymentLowerAmountBlock">
                <div className="PaymentPageTotalAmount">
                  <p>Refund Amount</p>
                  <div className="amountPaymentPage">
                    {getBillingCurrency()}{" "}
                    {refundEditAmount[key]
                      ? toCurrencyFormat(refundEditAmount[key])
                      : toCurrencyFormat(item.totalAmount)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

      {addRefundSectionCheck && (
        <div className="paymentInstallmentContainer border-line">
          <div className="paymentPageTitleHeaderNoTitle">
            <div className="topButtonActions">
              {addRefundSectionCheck && (
                <div className="paymentPageCancelSave">
                  <div className="paymentDetailCancel">
                    <Button
                      className="secondary-btn"
                      label="Cancel"
                      handleOnClick={() => {
                        setAddRefundSectionCheck(false);
                        cleanNewRefundObject();
                      }}
                    />
                  </div>
                  <div className="paymentDetailSave">
                    <Button
                      className="primary-blue medium"
                      label="Save"
                      handleOnClick={saveRefundDetail}
                      disabled={
                        !refundNewPaymentDate ||
                        !refundNewCurrency ||
                        !refundNewLocation ||
                        !refundNewDepositBank ||
                        !refundNewPaymentMethod ||
                        !refundAddAmount ||
                        AddInstallmentSaveDisable()
                      }
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
                disabled={false}
                handleDateChange={(date: any) => {
                  setRefundNewPaymentDate(date);
                }}
                required
              />
            </div>

            <div className="paymentInstallmentContainerDropdowns">
              <Dropdown
                testId="currencyOpen-id"
                handleDropdownClick={setRefundCurrencyOpen}
                handleDropOptionClick={refundCurrencyDropOptionClick}
                options={refundAddCurrencyDropdownOptions || []}
                isOpen={refundCurrencyOpen}
                isDisabled={false}
                title="Currency"
              />
            </div>

            <div className="paymentInstallmentContainerDropdowns">
              <Dropdown
                testId="locationOpen-id"
                handleDropdownClick={setRefundLocationOpen}
                handleDropOptionClick={refundLocationDropOptionClick}
                options={refundAddLocationDropdownOptions || []}
                isOpen={refundLocationOpen}
                isDisabled={false}
                title="Location"
              />
            </div>

            <div className="paymentInstallmentContainerDropdowns">
              <div className="referenceNoInput">
                <span>Reference No</span>
                <input
                  value={refundNewReferenceNo}
                  name="Reference No"
                  type="number"
                  placeholder="Enter reference No"
                  min="0"
                  pattern="[+-]?\d+(?:[.,]\d+)?"
                  onKeyDown={(e) => {
                    ["e", "E", "+", "-", "."].includes(e.key) &&
                      e.preventDefault();
                  }}
                  onChange={(e) => {
                    setRefundNewReferenceNo(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="paymentInstallmentLowerBlock">
            <div className="paymentInnerLowerBlock">
              <div className="paymentInstallmentContainerDropdowns">
                <Dropdown
                  testId="Deposited-id"
                  handleDropdownClick={setRefundDepositBankOpen}
                  handleDropOptionClick={refundDepositBankDropOptionClick}
                  options={refundAddBankToDepositDropdownOptions || []}
                  isOpen={refundDepositBankOpen}
                  isDisabled={false}
                  title="Credited from bank"
                />
              </div>

              <div className="paymentInstallmentContainerDropdowns">
                <Dropdown
                  testId="payment-id"
                  handleDropdownClick={setRefundPaymentMethodOpen}
                  handleDropOptionClick={refundPaymentMethodDropOptionClick}
                  options={refundAddPaymentMethodDropdownOptions || []}
                  isOpen={refundPaymentMethodOpen}
                  isDisabled={false}
                  title="Payment Method"
                />
              </div>

              <div className="paymentInstallmentContainerDropdowns">
                <div className="invoiceNumber">
                  <span>Invoice Number</span>
                  <input
                    value={invoiceNumber}
                    name="Reference No"
                    type="number"
                    placeholder="Enter Invoice Number"
                    min="0"
                    pattern="[+-]?\d+(?:[.,]\d+)?"
                    onKeyDown={(e) => {
                      ["e", "E", "+", "-", "."].includes(e.key) &&
                        e.preventDefault();
                    }}
                    onChange={(e) => {
                      setInvoiceNumber(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="PaymentPageTotalAmountInput">
                <div className="amountPaymentPageInput">
                  <span>Amount</span>
                  <input
                    data-testid="addAmount"
                    value={refundAddAmount}
                    type="number"
                    placeholder="0"
                    onChange={(e) => {
                      setRefundAddAmount(parseFloat(e.target.value));
                    }}
                    min="0"
                    pattern="[+-]?\d+(?:[.,]\d+)?"
                    onKeyDown={(e) => {
                      ["e", "E", "+", "-"].includes(e.key) &&
                        e.preventDefault();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="paymentLowerAmountBlock">
            <div className="PaymentPageTotalAmount">
              <p>Refund Amount</p>
              <div className="amountPaymentPage">
                {getBillingCurrency()}{" "}
                {refundAddAmount
                  ? toCurrencyFormat(refundAddAmount)
                  : toCurrencyFormat(0.0)}
              </div>
            </div>
          </div>
        </div>
      )}

      {permission?.InvoiceDetails?.includes("Add") &&
      currentStatusValue === statusValues.paid ? (
        <div className="addPaymentInstallmentButton">
          <div
            className={addPaymentButtonClassName}
            onClick={() => addPaymentInstallmentBlocks()}
            aria-disabled={addRefundSectionCheck}
            data-testid="add-installment"
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

      {isToaster && (
        <ToastNotification
          showNotification
          toastMessage="Entered amount can not be greater than open amount!"
          toastPosition="bottom-right"
        />
      )}
    </div>
  );
};

export default RefundDetailContainer;
