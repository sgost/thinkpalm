import React, { useEffect, useState } from "react";
import { Button, DatePicker, Dropdown, Icon, ToastNotification } from "atlasuikit";
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
import { Loader } from "../../../components/Comman/Utils/utils";

const PaymentDetailContainer = ({
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
  loading,
  setLoading,
  toCurrencyFormat
}: any) => {
  const permission: any = getDecodedToken();
  const tempToken = localStorage.getItem("accessToken");

  const [currencyEditOpen, setCurrencyEditOpen] = useState();
  const [locationEditOpen, setLocationEditOpen] = useState();
  const [depositBankEditOpen, setDepositBankEditOpen] = useState();
  const [paymentMethodEditOpen, setPaymentMethodEditOpen] = useState();
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [referenceNo, setReferenceNo] = useState<any>();
  const [addAmount, setAddAmount] = useState<any>();
  const [depositBankOpen, setDepositBankOpen] = useState(false);
  const [paymentMethodOpen, setPaymentMethodOpen] = useState(false);
  const [editChecked, setEditChecked] = useState<any>();
  const [newCurrency, setNewCurrency] = useState<any>();
  const [newLocation, setNewLocation] = useState<any>();
  const [newDepositBank, setNewDepositBank] = useState<any>();
  const [newPaymentMethod, setNewPaymentMethod] = useState<any>();
  const [newReferenceNo, setNewReferenceNo] = useState<any>();
  const [paymentApiData, setPaymentApiData] = useState<any>(paymentDetailData);
  const [addPaymentSectionCheck, setAddPaymentSectionCheck] = useState(false);
  const [newPaymentDate, setNewPaymentDate] = useState<any>();
  const [allDropdownData] = useState({
    currency: lookupData?.data?.billingCurrencies,
    depositBank: lookupData?.data?.depositToOptions,
    location: lookupData?.data?.locations,
  });
  const [paymentMethodData, setPaymentMethodData] = useState([]);
  const [paymentDate, setPaymentDate] = useState();
  const [editAmount, setEditAmount] = useState<any>({});
  const [editButtonDisable, setEditButtonDisable] = useState(false);
  const [editDisableToggle, setEditDisableToggle] = useState(false)
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
  const [isToaster, setIsToaster] = useState(false);
  const [isSaveDisable, setIsSaveDisable] = useState(false)

  useEffect(() => {
    if (paymentDetailData) {
      setPaymentApiData(paymentDetailData);
      updateDropdowns(paymentDetailData);
    }
  }, [paymentDetailData]);

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
    setAddCurrencyDropdownOption(currencyDataOptions);
    setAddBankToDepositDropdownOption(depositToBankDataOptions);
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
        const paymentMethodDropdownData: any = preparePaymentMethodDropdownOptionData(
          res?.data?.paymentMethods
        );
        setAddPaymentMethodDropdownOption(paymentMethodDropdownData);
        setPaymentMethodData(paymentMethodDropdownData);
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
        value: item.value,
      };
    });
  };

  const prepareDepositToBankDropdownOptionData = (paymentBankData: any) => {
    return paymentBankData?.map((paymentBankdataItem: any) => {
      return {
        ...paymentBankdataItem,
        isSelected: false,
        label: paymentBankdataItem.text,
        value: paymentBankdataItem.value,
      };
    });
  };

  const preparelocationDropdownOptionData = (paymentLocationData: any) => {
    return paymentLocationData?.map((paymentLocationItem: any) => {
      return {
        ...paymentLocationItem,
        isSelected: false,
        label: paymentLocationItem.text,
        value: paymentLocationItem.value,
      };
    });
  };

  const preparePaymentMethodDropdownOptionData = (paymentNameData: any) => {
    return paymentNameData?.map((paymentNameItem: any) => {
      return {
        ...paymentNameItem,
        isSelected: false,
        label: paymentNameItem.text,
        value: paymentNameItem.value,
      };
    });
  };

  const handlePaymentDropOptionData = (
    item: any,
    options: any,
    set: any,
    setIsOpen: any,
    index: number
  ) => {
    let arr = [...options];

    arr && arr[index]?.forEach((e: any, i: number) => {
      if (e.value === item.value) {
        arr[index][i] = {
          ...e,
          label: e.label,
          value: e.value,
          isSelected: !e.isSelected,
        };
      } else {
        arr[index][i] = {
          ...arr[index][i],
          isSelected: false,
        };
      }
    });
    set([]);
    setTimeout(() => {
      set([...arr]);
    }, 1);
    setIsOpen(paymentApiData.length + 1);
  };

  const currencyDropOptionClick = (option: any) =>
    handleAddOptionClick({
      option,
      dropOptions: addCurrencyDropdownOptions,
      updateIsOpen: setCurrencyOpen,
      isDropOpen: currencyOpen,
      updateOptions: setAddCurrencyDropdownOption,
      type: "currency",
    });

  const locationDropOptionClick = (option: any) =>
    handleAddOptionClick({
      option,
      dropOptions: addLocationDropdownOptions,
      updateIsOpen: setLocationOpen,
      isDropOpen: locationOpen,
      updateOptions: setAddLocationDropdownOption,
      type: "location",
    });

  const depositBankDropOptionClick = (option: any) =>
    handleAddOptionClick({
      option,
      dropOptions: addBankToDepositDropdownOptions,
      updateIsOpen: setDepositBankOpen,
      isDropOpen: depositBankOpen,
      updateOptions: setAddBankToDepositDropdownOption,
      type: "bankDeposit",
    });

  const paymentMethodDropOptionClick = (option: any) =>
    handleAddOptionClick({
      option,
      dropOptions: addPaymentMethodDropdownOptions,
      updateIsOpen: setPaymentMethodOpen,
      isDropOpen: paymentMethodOpen,
      updateOptions: setAddPaymentMethodDropdownOption,
      type: "paymentMethod",
    });

  const handleAddOptionClick = (args: any) => {
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
      setNewCurrency(option);
    } else if (type == "location") {
      setNewLocation(option);
    } else if (type == "bankDeposit") {
      setNewDepositBank(option);
    } else if (type == "paymentMethod") {
      setNewPaymentMethod(option);
    }

    updateOptions(updatedOptions);
  };

  const updateDropdowns = (paymentDetailDatas: any) => {
    let billingCurrencyArr: any = [];

    if (lookupData?.data?.billingCurrencies) {
      paymentDetailDatas?.forEach((item: any) => {
        billingCurrencyArr.push(
          lookupData?.data?.billingCurrencies?.map((x: any) => {
            return {
              isSelected: x.value == item.currencyId,
              label: x.text,
              value: x.value,
            };
          })
        );
      });
      setCurrencyDropdownOption(billingCurrencyArr);
    }

    let bankToDepositArr: any = [];

    if (lookupData?.data?.depositToOptions) {
      paymentDetailDatas?.forEach((item: any) => {
        bankToDepositArr.push(
          lookupData?.data?.depositToOptions?.map((x: any) => {
            return {
              isSelected: x.value == item.depositedtoBank,
              label: x.text,
              value: x.value,
            };
          })
        );
      });
      setBankToDepositDropdownOption(bankToDepositArr);
    }

    let locationArr: any = [];

    if (lookupData?.data?.locations) {
      paymentDetailDatas?.forEach((item: any) => {
        locationArr.push(
          lookupData?.data?.locations?.map((x: any) => {
            return {
              isSelected: x.value == item.location,
              label: x.text,
              value: x.value,
            };
          })
        );
      });
      setLocationDropdownOption(locationArr);
    }

    const getSubscriptionLookup = subscriptionLookup();
    const headers = {
      headers: getHeaders(tempToken, cid, "false"),
    };
    axios
      .get(getSubscriptionLookup, headers)
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
          setPaymentMethodDropdownOption(paymentMethodArr);
        }
      })
      .catch((e: any) => {
        console.log("error", e);
      });
  };

  const cleanNewPaymentObject = () => {
    setNewPaymentDate("");
    setNewCurrency(null);

    setAddLocationDropdownOption(
      allDropdownData?.location?.map((item: any) => {
        return {
          isSelected: false,
          label: item.text,
          value: item.value,
        };
      })
    );
    setAddCurrencyDropdownOption(
      allDropdownData?.currency?.map((items: any) => {
        return {
          isSelected: false,
          label: items.text,
          value: items.value,
        };
      })
    );
    setAddBankToDepositDropdownOption(
      allDropdownData?.depositBank?.map((itemsNew: any) => {
        return {
          isSelected: false,
          label: itemsNew.text,
          value: itemsNew.value,
        };
      })
    );
    setAddPaymentMethodDropdownOption(
      paymentMethodData?.map((x: any) => {
        return {
          isSelected: false,
          label: x.text,
          value: x.value,
        };
      })
    );
    setNewLocation(null);
    setNewDepositBank(null);
    setNewPaymentMethod(null);
    setNewReferenceNo("");
    setAddAmount(null);
  };

  const savePaymentDetail = () => {
    setIsSaveDisable(true)
    let arr: any = [];
    arr.push({
      totalAmount: addAmount,
      paymentDate: newPaymentDate,
      currencyId: newCurrency?.value,
      location: newLocation?.value,
      referenceNo: newReferenceNo,
      depositedtoBank: newDepositBank.value,
      paymentMethod: newPaymentMethod?.value,
    });

    const data: any = {
      PaymentType: 1,
      invoiceids: [id],
      paymentnotes: [],
      paymentdocuments: [],
      Payments: arr,
    };

    setLoading(true);

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
            setIsSaveDisable(false)
            setPaymentDetailData(response?.data?.payments);
            setAddPaymentSectionCheck(false);
            setEditChecked(null);
            setReferenceNo(null);
            cleanNewPaymentObject();
            setTopPanel({
              ...topPanel,
              open: response?.data?.invoice?.invoiceBalance,
            });
            if (response?.data?.invoice?.invoiceBalance === 0) {
              setStatus("Paid")
              setCurrentStatusValue(statusValues.paid)
            }
            setLoading(false);
          })
          .catch((e: any) => {
            console.log("error e", e);
            setIsSaveDisable(false)
          });
      })
      .catch((err) => {
        console.log(err);
        setIsSaveDisable(false)
      });
  };

  const editPaymentChanges = (item: any, key: any) => {
    let arr = [];

    arr.push({
      paymentinvoiceid: item?.paymentInvoiceId,
      totalAmount:
        editAmount && editAmount[key] ? editAmount[key] : item.totalAmount,
      paymentDate: paymentDate ? paymentDate : item.paymentDate,
      currencyId: currencyDropdownOptions[key]?.find((e: any) => e.isSelected)
        ?.value,
      location: locationDropdownOptions[key]?.find((e: any) => e.isSelected)
        ?.value,
      referenceNo:
        referenceNo && referenceNo[key] ? referenceNo[key] : item.referenceNo,
      depositedtoBank: bankToDepositDropdownOptions[key]?.find(
        (e: any) => e.isSelected
      )?.value,
      paymentMethod: paymentMethodDropdownOptions[key]?.find(
        (e: any) => e.isSelected
      )?.value,
    });

    const payload = {
      invoiceids: [id],
      paymentnotes: [],
      Payments: arr,
    };

    setLoading(true);

    axios({
      method: "POST",
      url: editPaymentDetailApi(),
      headers: getHeaders(tempToken, cid, "false"),
      data: payload,
    })
      .then(async (res) => {
        if (res.status == 200) {
          setPaymentApiData(res?.data?.payments);
          let obj = { ...referenceNo };
          obj[key] = res?.data?.payments[key]?.referenceNo;
          setReferenceNo(obj);
          let objAm = { ...editAmount };
          objAm[key] = res?.data?.payments[key]?.totalAmount;
          setEditAmount(objAm);
          setEditChecked(null);
          setEditButtonDisable(false);
          setTopPanel({
            ...topPanel,
            open: res?.data?.invoice?.invoiceBalance,
          });
          setPaymentDetailData(res?.data?.payments);
          if (res?.data?.invoice?.invoiceBalance === 0) {
            setStatus("Paid")
            setCurrentStatusValue(statusValues.paid)
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const AddInstallmentSaveDisable = () => {
    let isDisable = false;

    const totalAmount = addAmount
    const openAmount = topPanel?.open

    if (totalAmount > openAmount) {
      if (!isToaster) setIsToaster(true);
      isDisable = true;
    }
    return isDisable;
  }

  const EditInstallmentSaveDisable = (key: any) => {
    let isDisable = false;

    const totalmount = topPanel?.total
    const editTotalAmount = editAmount

    if (editDisableToggle && editTotalAmount[key] > totalmount) {
      if (!isToaster) setIsToaster(true);
      isDisable = true;
    }
    return isDisable;
  }

  useEffect(() => {
    getCurrencyAndDepositBankAndLocationDropdownOption();
    getPaymentMethodDropdownOptionData();
  }, []);

  const addPaymentInstallmentBlocks = () => {
    setAddPaymentSectionCheck(true);
  };

  const paymentButtonClassName = addPaymentSectionCheck ? "addPaymentInstallmentIconDisable" : "addPaymentInstallmentIcon"
  const newAddAmount = addAmount ? toCurrencyFormat(addAmount) : toCurrencyFormat(0.0)

  return (
    <>
      {
        loading ?
          <Loader />
          :
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
                      {key == 0 ? <p>Payment Details</p> : <></>}
                      <div className="topButtonActions">
                        {permission?.InvoiceDetails.includes("Edit") &&
                          editChecked != key && currentStatusValue === statusValues.partiallyPaid && (
                            <div className="paymentDetailEdit">
                              <Button
                                disabled={editButtonDisable}
                                className="primary-blue medium"
                                data-testid="payment-edit-button"
                                icon={{
                                  color: "#fff",
                                  icon: "edit",
                                  size: "small",
                                }}
                                label="Edit"
                                handleOnClick={() => {
                                  setEditButtonDisable(true);
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
                                  const headers = {
                                    headers: getHeaders(tempToken, cid, "false"),
                                  };

                                  let paymentdetailApi = getPaymentDetailApi(id);

                                  axios
                                    .get(paymentdetailApi, headers)
                                    .then((res: any) => {
                                      setPaymentDetailData(res?.data?.payments);
                                      setAddPaymentSectionCheck(false);
                                      setEditChecked(null);
                                      let obj = { ...referenceNo };
                                      obj[key] = res.data?.payments[key].referenceNo;
                                      setReferenceNo(obj);
                                      let objAm = { ...editAmount };
                                      objAm[key] =
                                        res.data?.payments[key].totalAmount;
                                      setEditAmount(objAm);
                                      setEditButtonDisable(false);
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
                                disabled={
                                  EditInstallmentSaveDisable(key)}
                                className="primary-blue medium"
                                label="Save Changes"
                                handleOnClick={() => {
                                  editPaymentChanges(item, key);
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
                          disabled={editChecked != key}
                          required
                          handleDateChange={(date: any) => {
                            setPaymentDate(date);
                            paymentApiData[key].paymentDate = date;
                            setPaymentApiData([...paymentApiData]);
                          }}
                        />
                      </div>

                      <div className="paymentInstallmentContainerDropdowns">
                        <Dropdown
                          handleDropdownClick={(b: boolean) => {
                            b
                              ? setCurrencyEditOpen(key)
                              : setCurrencyEditOpen(paymentApiData.length + 1);
                          }}
                          handleDropOptionClick={(data: any) => {
                            handlePaymentDropOptionData(
                              data,
                              currencyDropdownOptions,
                              setCurrencyDropdownOption,
                              setCurrencyEditOpen,
                              key
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
                              : setLocationEditOpen(paymentApiData.length + 1);
                          }}
                          handleDropOptionClick={(data: any) => {
                            handlePaymentDropOptionData(
                              data,
                              locationDropdownOptions,
                              setLocationDropdownOption,
                              setLocationEditOpen,
                              key
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
                            data-testid={item.referenceNo}
                            key={item.referenceNo}
                            className={editChecked != key ? "disable-input" : ""}
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
                            disabled={editChecked != key}
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
                                ? setDepositBankEditOpen(key)
                                : setDepositBankEditOpen(paymentApiData.length + 1);
                            }}
                            handleDropOptionClick={(data: any) => {
                              handlePaymentDropOptionData(
                                data,
                                bankToDepositDropdownOptions,
                                setBankToDepositDropdownOption,
                                setDepositBankEditOpen,
                                key
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
                                : setPaymentMethodEditOpen(paymentApiData.length + 1);
                            }}
                            handleDropOptionClick={(data: any) => {
                              handlePaymentDropOptionData(
                                data,
                                paymentMethodDropdownOptions,
                                setPaymentMethodDropdownOption,
                                setPaymentMethodEditOpen,
                                key
                              );
                            }}
                            options={paymentMethodDropdownOptions[key] || []}
                            isOpen={paymentMethodEditOpen == key}
                            isDisabled={editChecked != key}
                            title="Payment Method"
                          />
                        </div>

                        <div className="PaymentPageTotalAmountInput">
                          <div className="amountPaymentPageInput">
                            <span>Amount</span>
                            <input
                              data-testid={item.totalAmount}
                              key={item.totalAmount}
                              defaultValue={item.totalAmount}
                              value={editAmount && editAmount[key]}
                              type="number"
                              className={
                                editChecked != key ? "disable-input-color" : ""
                              }
                              placeholder="0"
                              min="0"
                              pattern="[+-]?\d+(?:[.,]\d+)?"
                              disabled={editChecked != key}
                              onKeyDown={(e) => {
                                ["e", "E", "+", "-"].includes(e.key) &&
                                  e.preventDefault();
                              }}
                              onChange={(e) => {
                                const obj: any = { ...editAmount };
                                obj[key] = parseFloat(e.target.value);
                                setEditAmount(obj);
                                setEditDisableToggle(true)
                              }}
                            />
                          </div>
                          {/* <div className="fullAmountPaymentNoInput">
                            Payment #765248
                          </div> */}
                        </div>
                      </div>

                      <div className="PaymentPageTotalAmount">
                        <p>Amount</p>
                        <div className="amountPaymentPage">
                          {getBillingCurrency()}{" "}
                          {editAmount[key]
                            ? toCurrencyFormat(editAmount[key])
                            : toCurrencyFormat(item.totalAmount)}
                        </div>
                        {/* <div className="fullAmountPaymentNo">Payment #765248</div> */}
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
                              cleanNewPaymentObject();
                            }}
                          />
                        </div>
                        <div className="paymentDetailSave">
                          <Button
                            className="primary-blue medium"
                            label="Save"
                            handleOnClick={savePaymentDetail}
                            disabled={
                              !newPaymentDate ||
                              !newCurrency ||
                              !newLocation ||
                              !newDepositBank ||
                              !newPaymentMethod ||
                              !addAmount ||
                              AddInstallmentSaveDisable() ||
                              isSaveDisable
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
                        setNewPaymentDate(date);
                      }}
                      required
                    />
                  </div>

                  <div className="paymentInstallmentContainerDropdowns">
                    <Dropdown
                      testId="currencyOpen-id"
                      handleDropdownClick={setCurrencyOpen}
                      handleDropOptionClick={currencyDropOptionClick}
                      options={addCurrencyDropdownOptions || []}
                      isOpen={currencyOpen}
                      isDisabled={false}
                      title="Currency"
                    />
                  </div>

                  <div className="paymentInstallmentContainerDropdowns">
                    <Dropdown
                      testId="locationOpen-id"
                      handleDropdownClick={setLocationOpen}
                      handleDropOptionClick={locationDropOptionClick}
                      options={addLocationDropdownOptions || []}
                      isOpen={locationOpen}
                      isDisabled={false}
                      title="Location"
                    />
                  </div>

                  <div className="paymentInstallmentContainerDropdowns">
                    <div className="referenceNoInput">
                      <span>Reference No</span>
                      <input
                        value={newReferenceNo}
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
                          setNewReferenceNo(e.target.value);
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
                        handleDropdownClick={setDepositBankOpen}
                        handleDropOptionClick={depositBankDropOptionClick}
                        options={addBankToDepositDropdownOptions || []}
                        isOpen={depositBankOpen}
                        isDisabled={false}
                        title="Deposited to bank"
                      />
                    </div>

                    <div className="paymentInstallmentContainerDropdowns">
                      <Dropdown
                        testId="payment-id"
                        handleDropdownClick={setPaymentMethodOpen}
                        handleDropOptionClick={paymentMethodDropOptionClick}
                        options={addPaymentMethodDropdownOptions || []}
                        isOpen={paymentMethodOpen}
                        isDisabled={false}
                        title="Payment Method"
                      />
                    </div>

                    <div className="PaymentPageTotalAmountInput">
                      <div className="amountPaymentPageInput">
                        <span>Amount</span>
                        <input
                          data-testid="addAmount"
                          value={addAmount}
                          type="number"
                          placeholder="0"
                          onChange={(e) => {
                            setAddAmount(parseFloat(e.target.value));
                          }}
                          min="0"
                          pattern="[+-]?\d+(?:[.,]\d+)?"
                          onKeyDown={(e) => {
                            ["e", "E", "+", "-"].includes(e.key) &&
                              e.preventDefault();
                          }}
                        />
                      </div>
                      {/* <div className="fullAmountPaymentNoInput">Payment #765248</div> */}
                    </div>
                  </div>

                  <div className="PaymentPageTotalAmount">
                    <p>Amount</p>
                    <div className="amountPaymentPage">
                      {getBillingCurrency()}{" "}
                      {newAddAmount}
                    </div>
                    {/* <div className="fullAmountPaymentNo">Payment #765248</div> */}
                  </div>
                </div>
              </div>
            )}

            {permission?.InvoiceDetails?.includes("Add") &&
              currentStatusValue === statusValues.partiallyPaid && (
                <div className="addPaymentInstallmentButton">
                  <div
                    className={paymentButtonClassName}
                    onClick={() => addPaymentInstallmentBlocks()}
                    aria-disabled={addPaymentSectionCheck}
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
              )}

            {isToaster && (
              <ToastNotification
                showNotification
                toastMessage="Entered amount can not be greater than open amount!"
                toastPosition="bottom-right"
              />
            )}
          </div>
      }
    </>
  );
};

export default PaymentDetailContainer;
