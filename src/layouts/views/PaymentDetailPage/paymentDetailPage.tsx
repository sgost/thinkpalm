import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Icon,
  BreadCrumb,
  DatePicker,
  Dropdown,
  Checkbox,
  ToastNotification,
} from "atlasuikit";
import { useNavigate, useLocation } from "react-router-dom";
import "./paymentDetailPage.scss";
import NotesWidget from "../../../components/Notes";
import { urls, getHeaders, subscriptionLookup } from "../../../urls/urls";
import axios from "axios";
import FileUploadWidget from "../../../components/FileUpload";
import { format } from "date-fns";
import { sharedBreadCrumbs } from "../../../sharedColumns/sharedSteps";
import { Loader } from "../../../components/Comman/Utils/utils";

const PaymentDetailPage = () => {
  const state: any = useLocation();
  const navigate = useNavigate();
  const tempToken = localStorage.getItem("accessToken");

  const [showCancel, useShowCancel] = useState(false);
  const [hideTopCheck, setHideTopCheck] = useState(true);
  const [navigateToInvoice, setNavigateToInvoice] = useState(true);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isMultiCurrencyDropdownOpen, setIsMultiCurrencyDropdownOpen] =
    useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isMultiLocationDropdownOpen, setIsMultiLocationDropdownOpen] =
    useState(false);
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
  const [isMultiBankDropdownOpen, setIsMultiBankDropdownOpen] = useState(false);
  const [isPaymentMethodDropdownOpen, setIsPaymentMethodDropdownOpen] =
    useState(false);
  const [isMultiPaymentMethodOpen, setIsMultiPaymentMethodOpen] =
    useState(false);
  const [documents, setDocuments] = useState<any>([]);
  const [paymentNote, setPaymentNote] = useState<any>(null);
  const [toggleState, setToggleState] = useState<any>({
    index: null,
    invoiceIndex: null,
  });

  const [currencyOptionsDefault, setCurrencyOptionDefault] = useState<any>([]);
  const [currencyOptions, setCurrencyOption] = useState<any>([]);
  const [multiCurrencyOptions, setMultiCurrencyOptions] = useState<any>([]);
  const [bankToDepositOptionsDefault, setBankToDepositOptionDefault] =
    useState<any>([]);
  const [bankToDepositOptions, setBankToDepositOption] = useState<any>([]);
  const [multiBankToDepositOptions, setmultiBankToDepositOptions] =
    useState<any>([]);
  const [locationOptionsDefault, setLocationOptionDefault] = useState<any>([]);
  const [locationOptions, setLocationOption] = useState<any>([]);
  const [multiLocationOptions, setMultiLocationOptions] = useState<any>([]);
  const [paymentMethodOptionsDefault, setPaymentMethodOptionDefault] =
    useState<any>([]);
  const [paymentMethodOptions, setPaymentMethodOption] = useState<any>([]);
  const [multiPaymentMethodOptions, setmultiPaymentMethodOptions] =
    useState<any>([]);
  const [paymentDate, setpaymentDate] = useState<any>([]);
  const [multiPaymentDate, setMultiPaymentDate] = useState<any>(null);
  const [referenceNo, setReferenceNo] = useState<any>([]);
  const [invoiceNumber, setInvoiceNumber] = useState<any>("");
  const [multiRefNo, setMultiRefNo] = useState("");
  const [multiPaymentBlocks, setMultiPaymentBlocks] = useState(
    state.state.inveoicesData.map((e: any) => ({
      id: Math.random(),
      parentId: e.id,
    }))
  );
  const [isFullAmount, setIsFullAmount] = useState<any>();
  const [totals, setTotals] = useState<any>([]);
  const [multiTotal, setMultiTotal] = useState<any>(0);
  const [isToaster, setIsToaster] = useState(false);
  const [isSaveBtnDisable, _setisSaveBtnDisable] = useState(false)
  const [isOverlayLoader, setIsOverlayLoader] = useState(false)

  useEffect(() => {
    if (!hideTopCheck) {
      navigate("/pay");
    }
  }, [hideTopCheck]);

  useEffect(() => {
    if (multiPaymentBlocks.length > 1) {
      setIsFullAmount(false);
    }
    else if (state?.state?.inveoicesData?.[0].transactionTypeLabel !== "Credit Memo" && multiPaymentBlocks.length == 1) {
      setIsFullAmount(true);
    }


  }, [multiPaymentBlocks]);

  useEffect(() => {
    if (!navigateToInvoice) {
      navigate(
        "/pay/invoicedetails" +
        state.state.inveoicesData[0].id +
        "/" +
        state.state.inveoicesData[0].customerId +
        "/" +
        "false",
        {
          state: {
            InvoiceId: state.state.inveoicesData[0].invoiceNo,
            transactionType: state.state.inveoicesData[0].transactionType,
            rowDetails: state,
          },
        }
      );
    }
  }, [navigateToInvoice]);

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
          (invoiceItem: any, _invoicesIndex: number) => {
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

        setCurrencyOptionDefault(currencyData);
        setCurrencyOption(tempCurrOpt);
        setMultiCurrencyOptions(currencyData);
        setBankToDepositOptionDefault(depositToBankData);
        setBankToDepositOption(tempBankDepositOpt);
        setmultiBankToDepositOptions(depositToBankData);
        setLocationOptionDefault(locationData);
        setLocationOption(tempLocationOpt);
        setMultiLocationOptions(locationData);
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
          (invoiceItem: any, _invoicesIndex: number) => {
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
        setmultiPaymentMethodOptions(paymentMethodData);
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
        value: item.value,
      };
    });
  };

  const prepareDepositToBankDropdownOption = (olddata: any) => {
    return olddata?.map((d: any) => {
      return {
        ...d,
        isSelected: false,
        label: d.text,
        value: d.value,
      };
    });
  };

  const preparelocationDropdownOption = (data: any) => {
    return data?.map((newitem: any) => {
      return {
        ...newitem,
        isSelected: false,
        label: newitem.text,
        value: newitem.value,
      };
    });
  };

  const preparePaymentMethodDropdownOption = (newdata: any) => {
    return newdata?.map((items: any) => {
      return {
        ...items,
        isSelected: false,
        label: items.text,
        value: items.value,
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

    arr[index].options.forEach((e: any, _i: number) => {
      if (e.value === item.value) {
        e.isSelected = !e.isSelected;
      } else {
        e.isSelected = false;
      }
    });

    set([...arr]);
    setIsOpen(false);
  };

  const handleMultiPaymentDropOption = (
    item: any,
    options: any,
    set: any,
    setIsOpen: any
  ) => {
    let arr = [...options];

    arr.forEach((e: any, i: number) => {
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
    arr[index].date = format(date, "yyyy-MM-dd");

    set([...arr]);
  };

  /* istanbul ignore next */
  const toCurrencyFormat = (amount: number) => {
    const cFormat = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    return cFormat.format(amount).slice(1);
  };

  const isSaveDisable = () => {

    if (isSaveBtnDisable) {
      return true
    }

    let isDisable = false;

    if (state?.state?.inveoicesData?.length > 1) {
      if (
        !multiPaymentDate ||
        !multiCurrencyOptions.find((e: any) => e.isSelected) ||
        !multiLocationOptions.find((e: any) => e.isSelected) ||
        !multiRefNo ||
        !multiBankToDepositOptions.find((e: any) => e.isSelected) ||
        !multiPaymentMethodOptions.find((e: any) => e.isSelected)
      ) {
        return true;
      }
    } else {
      paymentDate.forEach((e: any) => {
        if (!e.date) {
          isDisable = true;
        }
      });
      currencyOptions.forEach((event: any) => {
        if (event.options.findIndex((item: any) => item.isSelected) == -1) {
          isDisable = true;
        }
      });
      locationOptions.forEach((e: any) => {
        if (e.options.findIndex((o: any) => o.isSelected) == -1) {
          isDisable = true;
        }
      });
      bankToDepositOptions.forEach((items: any) => {
        if (items.options.findIndex((obj: any) => obj.isSelected) == -1) {
          isDisable = true;
        }
      });
      paymentMethodOptions.forEach((e: any) => {
        if (e.options.findIndex((o: any) => o.isSelected) == -1) {
          isDisable = true;
        }
      });

      if (
        multiPaymentBlocks.length > 1 ||
        (!isFullAmount && multiPaymentBlocks.length == 1)
      ) {
        totals.forEach((o: any) => {
          if (!o.text) {
            isDisable = true;
          }
        });
      }

      //checking total amount is greater open amount
      const totalAmount = totals.reduce(
        (a: any, b: any) => a + parseFloat(state?.state?.inveoicesData?.[0].transactionTypeLabel === "Credit Memo" ? b.text.substring(1) : b.text),
        0
      );
      const openAmount = state?.state?.inveoicesData?.reduce(
        (a: any, b: any) =>
          a + parseFloat(b?.invoiceBalance?.split(" ")[1].replace(",", "")),
        0
      );

      if (totalAmount > openAmount) {
        if (!isToaster) setIsToaster(true);
        isDisable = true;
      }
    }

    return isDisable;
  };

  useEffect(() => {
    getCurrencyAndDepositBankAndLocationDropdownOption();
    getPaymentMethodDropdownOption();

    let tempRefNo: any = [];
    let tempPaymentDate: any = [];
    let tempTotals: any = [];
    let check = true;
    state?.state?.inveoicesData?.forEach(
      (invoiceItem: any, _invoicesIndex: number) => {
        check = invoiceItem?.transactionTypeLabel === "Credit Memo"
          ? false
          : true;


        if (state?.state?.inveoicesData?.length > 1) {
          const total = state?.state?.inveoicesData?.reduce(
            (a: any, b: any) => {
              const one = b?.invoiceBalance?.split(" ");
              let two;
              let three;
              if (one?.length) {
                two = one?.[1];
              }
              if (two) {
                three = two?.replace(/,/g, "");
              }
              return a + parseFloat(three);
            },
            0
          );
          setMultiTotal(total);
        }

        multiPaymentBlocks.forEach((item: any, _index: number) => {
          tempRefNo.push({
            invoiceKey: invoiceItem.id,
            blockKey: item.id,
            text: "",
          });
          tempTotals.push({
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
    setIsFullAmount(check)
    setpaymentDate(tempPaymentDate);
    setReferenceNo(tempRefNo);
    setTotals(tempTotals);
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

    setTotals([
      ...totals,
      {
        invoiceKey: invoiceKey,
        blockKey: blockObj.id,
        text: "",
      },
    ]);
  };

  const removePaymentBlock = (item: any) => {
    setMultiPaymentBlocks(
      multiPaymentBlocks.filter((todo: any) => todo.id !== item.id)
    );
  };

  const amoutNote = () => {
    let amount;
    if (isFullAmount) {
      amount = "Paid";
    } else {
      amount = "Partially Paid"
    }
    return amount;
  }

  const handleSave = () => {

    setIsOverlayLoader(true)
    let data: any = null;
    const invoiceIds = state.state?.inveoicesData.map((e: any) => {
      return e.id;
    });
    let currDate = new Date();

    if (state.state?.inveoicesData.length > 1) {
      data = {
        PaymentType: 2,
        invoiceids: invoiceIds,
        paymentnotes: [
          {
            noteType: "2",
            note: paymentNote?.note ? paymentNote.note : amoutNote(),
            isCustomerVisible: paymentNote.isVisibleToCustomer,
            exportToQuickbooks: paymentNote.isExportToQb,
            createdDate: currDate,
            modifiedBy: "00000000-0000-0000-0000-000000000000",
            modifiedByUser: null,
            displayInPDF: paymentNote.currDate,
            customerId: state.state.inveoicesData[0].customerId,
          }
        ],
        paymentdocuments: [],
        Payments: [
          {
            totalAmount: parseFloat(multiTotal),
            paymentDate: format(multiPaymentDate, "yyyy-MM-dd"),
            currencyId: multiCurrencyOptions.find((e: any) => e.isSelected)
              ?.value,
            location: multiLocationOptions.find((e: any) => e.isSelected)
              ?.value,
            referenceNo: multiRefNo,
            depositedtoBank: multiBankToDepositOptions.find(
              (e: any) => e.isSelected
            )?.value,
            paymentMethod: multiPaymentMethodOptions.find(
              (e: any) => e.isSelected
            )?.value,
          },
        ],
      };
    } else {
      let arrData: Array<any> = [];
      for (let i = 0; i < currencyOptions.length; i++) {
        arrData.push({
          totalAmount:
            multiPaymentBlocks.length === 1
              ? isFullAmount
                ? parseFloat(
                  state?.state?.inveoicesData[0]?.invoiceBalance
                    ?.split(" ")[1]
                    .replace(",", "")
                )
                : state?.state?.inveoicesData?.[0].transactionTypeLabel == "Credit Memo" ?
                  parseFloat(totals[i].text.substring(1)) :
                  parseFloat(totals[i].text)
              : state?.state?.inveoicesData?.[0].transactionTypeLabel == "Credit Memo" ?
                parseFloat(totals[i].text.substring(1)) :
                parseFloat(totals[i].text),
          paymentDate: paymentDate[i]?.date,
          currencyId: currencyOptions[i].options.find((e: any) => e.isSelected)
            ?.value,
          location: locationOptions[i].options.find((e: any) => e.isSelected)
            ?.value,
          referenceNo: referenceNo[i].text,
          depositedtoBank: bankToDepositOptions[i].options.find(
            (e: any) => e.isSelected
          )?.value,
          paymentMethod: paymentMethodOptions[i].options.find(
            (e: any) => e.isSelected
          )?.value,
        });
      }

      data = {
        PaymentType: 1,
        invoiceids: invoiceIds,
        paymentnotes: [
          {
            noteType: "2",
            note: paymentNote?.note ? paymentNote.note : amoutNote(),
            isCustomerVisible: paymentNote.isVisibleToCustomer,
            exportToQuickbooks: paymentNote.isExportToQb,
            createdDate: currDate,
            modifiedBy: "00000000-0000-0000-0000-000000000000",
            modifiedByUser: null,
            displayInPDF: paymentNote.currDate,
            customerId: state.state.inveoicesData[0].customerId,
          },
        ],
        paymentdocuments: [],
        Payments: arrData,
      };
    }

    axios({
      method: "POST",
      url: urls.savePayments,
      headers: getHeaders(
        tempToken,
        state.state.inveoicesData[0].customerId,
        "false"
      ),
      data: data,
    })
      .then((res) => {
        setIsOverlayLoader(false)
        if (res.status == 200) {
          if (state.state.inveoicesData.length > 1) {
            navigate("/pay");
          } else {
            navigate(
              "/pay/invoicedetails" +
              state.state.inveoicesData[0].id +
              "/" +
              state.state.inveoicesData[0].customerId +
              "/" +
              "false",
              {
                state: {
                  InvoiceId: state.state.inveoicesData[0].invoiceNo,
                  transactionType: state.state.inveoicesData[0].transactionType,
                  rowDetails: state.state.inveoicesData[0],
                },
              }
            );
          }
        }
      })
      .catch((err) => {
        setIsOverlayLoader(false)
        console.log(err);
      });
  };

  const breadcrumbsLabel = () => {
    return state.state.inveoicesData.map((item: any) => {
      return item.transactionTypeLabel + " Invoice No. " + item.invoiceNo;
    });
  };

  return (
    <div className="paymentDetailPageContainer">
      <div className="paymentDetailPageHeaderRow">
        <div className="paymentDetailPageBreadcrumbs">
          <BreadCrumb
            hideHeaderTitle={hideTopCheck}
            hideHeaderTabs={hideTopCheck}
            steps={
              state?.state?.checkPage
                ? [
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
                    label: breadcrumbsLabel(),
                    onClickLabel: () => {
                      setNavigateToInvoice(false);
                    },
                  },
                  sharedBreadCrumbs.payments,
                ]
                : [
                  {
                    isActive: true,
                    key: "Invoices",
                    label: "Invoices",
                    onClickLabel: () => {
                      setHideTopCheck(false);
                    },
                  },
                  sharedBreadCrumbs.payments,
                ]
            }
          />
        </div>
        <div className="paymentSaveButton">
          <Button
            className="secondary-btn medium"
            label="Cancel"
            handleOnClick={() => {
              useShowCancel(true);
            }}
          />
          <Button
            className="primary-blue medium"
            label="Pay"
            handleOnClick={handleSave}
            disabled={isSaveDisable()}
          />
        </div>
      </div>

      {state?.state?.inveoicesData?.map(
        (invoiceItem: any, invoicesIndex: number) => {
          const paymentHeader =
            invoiceItem.transactionTypeLabel === "Credit Memo" ? (
              <p>Refund Details</p>
            ) : (
              <p>Payment Details</p>
            );
          return (
            <div className="paymentPageInvoiceInfo">
              <div className="paymentPageTopBar">
                <div className="paymentHeaderContainer">
                  <div className="paymentTopBarrow">
                    <div className="paymentInvoivceNo">
                      <Icon color="#FFFFFF" icon="orderSummary" size="large" />
                      <p>
                        {invoiceItem.transactionTypeLabel}{" "}
                        {invoiceItem.transactionTypeLabel === "Credit Memo"
                          ? "No. "
                          : " Invoice No. "}{" "}
                        {invoiceItem.invoiceNo}{" "}
                        {invoiceItem.transactionTypeLabel === "Credit Memo"
                          ? "Refund Payment"
                          : "Payment"}
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
                    </div>
                  </div>
                  {invoiceItem != null &&
                    invoiceItem?.qbInvoiceNo != undefined && invoiceItem?.qbInvoiceNo > 0 && (
                      <p>QBO No. {invoiceItem.qbInvoiceNo}</p>
                    )}
                </div>
              </div>

              {state?.state?.inveoicesData?.length === 1 && (
                <div className="paaymentInstallmetOuterContainer">
                  {multiPaymentBlocks?.map((item: any, i: any) => {
                    let creditMemoBalance = invoiceItem.invoiceBalance.split(" ");
                    let creditMemoCurrency = creditMemoBalance[0]
                    let creditMemoAmount = - creditMemoBalance[1]
                    let newCreditMemoBalance = creditMemoCurrency.concat(" ", creditMemoAmount);
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
                            {
                              i == 0 &&
                              paymentHeader
                            }

                            {i != 0 && (
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

                            <div className="paymentInstallmentContainerDropdowns">
                              <Dropdown
                                handleDropdownClick={(b: boolean) => {
                                  if(b){
                                    setIsCurrencyDropdownOpen(b);
                                    setIsLocationDropdownOpen(false);
                                    setIsBankDropdownOpen(false);
                                    setIsPaymentMethodDropdownOpen(false);
                                    setToggleState({ index: i, invoicesIndex });
                                  }
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

                            <div className="paymentInstallmentContainerDropdowns">
                              <Dropdown
                                handleDropdownClick={(b: boolean) => {
                                  if(b){
                                    setIsLocationDropdownOpen(b);
                                    setIsCurrencyDropdownOpen(false);
                                    setIsBankDropdownOpen(false);
                                    setIsPaymentMethodDropdownOpen(false);
                                    setToggleState({ index: i, invoicesIndex });
                                  }
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
                                <span className="Reference">Reference No</span>
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
                                  min="0"
                                  pattern="[+-]?\d+(?:[.,]\d+)?"
                                  onKeyDown={(e) => {
                                    ["e", "E", "+", "-", "."].includes(e.key) &&
                                      e.preventDefault();
                                  }}
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
                            <div
                              className={
                                invoiceItem.transactionTypeLabel ===
                                  "Credit Memo"
                                  ? "paymentCreditMemoInnerLowerBlock"
                                  : "paymentInnerLowerBlock"
                              }
                            >
                              <div className="paymentInstallmentContainerDropdowns">
                                <Dropdown
                                  handleDropdownClick={(b: boolean) => {
                                    if(b){
                                      setIsBankDropdownOpen(b);
                                      setIsCurrencyDropdownOpen(false);
                                      setIsLocationDropdownOpen(false);
                                      setIsPaymentMethodDropdownOpen(false);
                                      setToggleState({
                                        index: i,
                                        invoicesIndex,
                                      });
                                    }
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
                                  title={
                                    invoiceItem.transactionTypeLabel ===
                                      "Credit Memo"
                                      ? "Credited from bank"
                                      : "Deposited to bank"
                                  }
                                />
                              </div>

                              <div className="paymentInstallmentContainerDropdowns">
                                <Dropdown
                                  handleDropdownClick={(b: boolean) => {
                                    if(b){
                                      setIsPaymentMethodDropdownOpen(b);
                                      setIsCurrencyDropdownOpen(false);
                                      setIsLocationDropdownOpen(false);
                                      setIsBankDropdownOpen(false);
                                      setToggleState({ index: i, invoicesIndex });
                                    }
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

                              {invoiceItem.transactionTypeLabel ===
                                "Credit Memo" && (
                                  <div className="paymentInstallmentContainerDropdowns">
                                    <div className="invoiceNumber">
                                      <span>Invoice Number</span>
                                      <input
                                        value={invoiceNumber}
                                        name="Invoice No"
                                        type="number"
                                        placeholder="Enter Invoice Number"
                                        min="0"
                                        pattern="[+-]?\d+(?:[.,]\d+)?"
                                        onKeyDown={(e) => {
                                          ["e", "E", "+", "-", "."].includes(
                                            e.key
                                          ) && e.preventDefault();
                                        }}
                                        onChange={(e) => {
                                          setInvoiceNumber(e.target.value);
                                        }}
                                      />
                                    </div>
                                  </div>
                                )}
                            </div>

                            <div className="PaymentPageTotalAmount">
                              {invoiceItem.transactionTypeLabel ===
                                "Credit Memo" ? (
                                <p>Refund Amount</p>
                              ) : (
                                <p>Amount</p>
                              )}

                              {isFullAmount &&
                                multiPaymentBlocks?.length === 1 ? (
                                <div className="amountPaymentPage">
                                  {invoiceItem.transactionTypeLabel ===
                                    "Credit Memo" ?
                                    newCreditMemoBalance
                                    :
                                    invoiceItem.invoiceBalance
                                  }
                                </div>
                              ) : <></>}
                              {isFullAmount == false &&
                                multiPaymentBlocks.length >= 1 ? (
                                <input
                                  type="text"
                                  placeholder="Enter amount"
                                  value={
                                    totals.find(
                                      (e: any) =>
                                        e.invoiceKey === invoiceItem.id &&
                                        e.blockKey === item.id
                                    )?.text || ""
                                  }
                                  onChange={(e) => {
                                    let value = '';
                                    console.log("invoiceItem.transactionTypeLabel", invoiceItem.transactionTypeLabel)
                                    if (invoiceItem.transactionTypeLabel ===
                                      "Credit Memo") {
                                      const m = e.target.value.match(/\d+/g);
                                      value = m === null ? '-' : `-${m}`;
                                    }
                                    handleInputText(
                                      invoiceItem.transactionTypeLabel ===
                                        "Credit Memo" ? value : e.target.value,
                                      totals,
                                      setTotals,
                                      invoiceItem.id,
                                      item.id
                                    );
                                  }}
                                />
                              ) : <></>}
                              {i == 0 && multiPaymentBlocks.length == 1 ? (
                                <div className="fullAmountPaymentCheckbox">
                                  <Checkbox
                                    id="fullAmt"
                                    checked={isFullAmount}
                                    label="Full Amount"
                                    onClick={() => setIsFullAmount(!isFullAmount)} //changing from onChange to onClick due atlast ui kit causing issue in latest
                                  // onChange={(e: any) =>
                                  //   setIsFullAmount(e.target.checked)
                                  // }
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

      {state?.state?.inveoicesData?.length > 1 && (
        <div className="paymentPageInvoiceInfo">
          <div className="totalMultiContainer">
            <div>
              <p>Total Amount ({state.state.inveoicesData.length} invoices)</p>
            </div>
            <div>
              <p>
                {state?.state?.inveoicesData[0]?.invoiceBalance?.split(" ")[0]}{" "}
                {toCurrencyFormat(multiTotal)}
              </p>
            </div>
          </div>
          <div className="paaymentInstallmetOuterContainer">
            <div className="paymentInstallmentContainer">
              <div className="paymentInstallmentUpperBlock">
                <div className="paymentInstallmentDatepicker">
                  <DatePicker
                    label="Payment Date"
                    handleDateChange={function (date: any) {
                      setMultiPaymentDate(date);
                    }}
                    required
                  />
                </div>

                <div className="paymentInstallmentContainerDropdowns">
                  <Dropdown
                    handleDropdownClick={(b: boolean) => {
                      setIsMultiCurrencyDropdownOpen(b);
                    }}
                    handleDropOptionClick={(sel: any) => {
                      handleMultiPaymentDropOption(
                        sel,
                        multiCurrencyOptions,
                        setMultiCurrencyOptions,
                        setIsMultiCurrencyDropdownOpen
                      );
                    }}
                    isOpen={isMultiCurrencyDropdownOpen}
                    options={multiCurrencyOptions}
                    title="Currency"
                  />
                </div>

                <div className="paymentInstallmentContainerDropdowns">
                  <Dropdown
                    handleDropdownClick={(b: boolean) => {
                      setIsMultiLocationDropdownOpen(b);
                    }}
                    handleDropOptionClick={(sel: any) => {
                      handleMultiPaymentDropOption(
                        sel,
                        multiLocationOptions,
                        setMultiLocationOptions,
                        setIsMultiLocationDropdownOpen
                      );
                    }}
                    isOpen={isMultiLocationDropdownOpen}
                    options={multiLocationOptions}
                    title="Location"
                  />
                </div>

                <div className="paymentInstallmentContainerDropdowns">
                  <div className="referenceNoInput">
                    <span>Reference No</span>
                    <input
                      value={multiRefNo}
                      name="Reference No"
                      type="number"
                      placeholder="Enter reference No"
                      onChange={(e: any) => {
                        setMultiRefNo(e.target.value);
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
                        setIsMultiBankDropdownOpen(b);
                      }}
                      handleDropOptionClick={(sel: any) => {
                        handleMultiPaymentDropOption(
                          sel,
                          multiBankToDepositOptions,
                          setmultiBankToDepositOptions,
                          setIsMultiBankDropdownOpen
                        );
                      }}
                      isOpen={isMultiBankDropdownOpen}
                      options={multiBankToDepositOptions}
                      title="Deposited to bank"
                    />
                  </div>
                  <div className="paymentInstallmentContainerDropdowns">
                    <Dropdown
                      handleDropdownClick={(b: boolean) => {
                        setIsMultiPaymentMethodOpen(b);
                      }}
                      handleDropOptionClick={(sel: any) => {
                        handleMultiPaymentDropOption(
                          sel,
                          multiPaymentMethodOptions,
                          setmultiPaymentMethodOptions,
                          setIsMultiPaymentMethodOpen
                        );
                      }}
                      isOpen={isMultiPaymentMethodOpen}
                      options={multiPaymentMethodOptions}
                      title="Payment Method"
                    />
                  </div>
                </div>

                <div className="PaymentPageTotalAmount">
                  <p>Amount</p>
                  <div className="amountPaymentPage">
                    {
                      state?.state?.inveoicesData[0].invoiceBalance.split(
                        " "
                      )[0]
                    }{" "}
                    {toCurrencyFormat(multiTotal)}
                  </div>

                  <div className="fullAmountPaymentCheckbox">
                    <Checkbox disabled checked={true} label="Full Amount" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="filesNotes">
        <NotesWidget
          notes={[]}
          isPaymentPage={true}
          isClient="false"
          setPaymentNote={setPaymentNote}
        ></NotesWidget>
        <FileUploadWidget
          documents={documents}
          setDocuments={setDocuments}
          isClient="false"
          cid={state.state.inveoicesData[0].customerId}
          id={state.state.inveoicesData[0].id}
          isPaymentPage={true}
          paymentPageData={state.state.inveoicesData}
        ></FileUploadWidget>
      </div>
      {isToaster && (
        <ToastNotification
          showNotification
          toastMessage="Entered amount can not be greater than open amount!"
          toastPosition="bottom-right"
        />
      )}
      <div className="cancel_modal">
        <Modal
          handleClose={() => {
            useShowCancel(false);
          }}
          isOpen={showCancel}
        >
          <p className="cancel_note">Your changes will be unsaved!</p>
          <div className="modal_main">
            <Button
              label="cancel"
              className="secondary-btn small"
              handleOnClick={() => {
                useShowCancel(false);
              }}
            />
            <Button
              className="primary-blue small"
              label="Proceed"
              handleOnClick={() => {
                navigate(
                  "/pay/invoicedetails" +
                  state.state.inveoicesData[0].id +
                  "/" +
                  state.state.inveoicesData[0].customerId +
                  "/" +
                  "false",
                  {
                    state: {
                      InvoiceId: state.state.inveoicesData[0].invoiceNo,
                      transactionType: state.state.inveoicesData[0].transactionType,
                      rowDetails: state,
                    },
                  }
                );
              }}
            />
          </div>
        </Modal>
      </div>
      {isOverlayLoader && <Loader isOverlay />}
    </div>
  );
};

export default PaymentDetailPage;
