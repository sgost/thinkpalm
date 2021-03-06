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
import { format } from "date-fns";
import { stat } from "fs";

const PaymentDetailPage = () => {
  const state: any = useLocation();
  const navigate = useNavigate();

  const tempToken = localStorage.getItem("accessToken");

  const [hideTopCheck, setHideTopCheck] = useState(true);
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
  const [notes, setNotes] = useState<any>([]);
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
  const [multiRefNo, setMultiRefNo] = useState("");
  const [multiplePaymentId, setMultiplePaymentId] = useState([]);
  const [multiPaymentBlocks, setMultiPaymentBlocks] = useState(
    state.state.inveoicesData.map((e: any) => ({
      id: Math.random(),
      parentId: e.id,
    }))
  );
  const [isFullAmount, setIsFullAmount] = useState(true);
  const [totals, setTotals] = useState<any>([]);
  const [multiTotal, setMultiTotal] = useState<any>(0);

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

  const prepareDepositToBankDropdownOption = (data: any) => {
    return data?.map((item: any) => {
      return {
        ...item,
        isSelected: false,
        label: item.text,
        value: item.value,
      };
    });
  };

  const preparelocationDropdownOption = (data: any) => {
    return data?.map((item: any) => {
      return {
        ...item,
        isSelected: false,
        label: item.text,
        value: item.value,
      };
    });
  };

  const preparePaymentMethodDropdownOption = (data: any) => {
    return data?.map((item: any) => {
      return {
        ...item,
        isSelected: false,
        label: item.text,
        value: item.value,
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

    // console.log("arr", arr);

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

  const isSaveDisable = () => {
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
      currencyOptions.forEach((e: any) => {
        if (e.options.findIndex((o: any) => o.isSelected) == -1) {
          isDisable = true;
        }
      });
      locationOptions.forEach((e: any) => {
        if (e.options.findIndex((o: any) => o.isSelected) == -1) {
          isDisable = true;
        }
      });
      referenceNo.forEach((e: any) => {
        if (!e.text) {
          isDisable = true;
        }
      });
      bankToDepositOptions.forEach((e: any) => {
        if (e.options.findIndex((o: any) => o.isSelected) == -1) {
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
    }

    return isDisable;
  };

  useEffect(() => {
    getCurrencyAndDepositBankAndLocationDropdownOption();
    getPaymentMethodDropdownOption();

    let tempRefNo: any = [];
    let tempPaymentDate: any = [];
    let tempTotals: any = [];

    state?.state?.inveoicesData?.forEach(
      (invoiceItem: any, invoicesIndex: number) => {
        if (state?.state?.inveoicesData?.length > 1) {
          const total = state?.state?.inveoicesData?.reduce(
            (a: any, b: any) => {
              console.log("a b", a, parseFloat(b.invoiceBalance.split(" ")[1]));
              return a + parseFloat(b.invoiceBalance.split(" ")[1]);
            },
            0
          );

          setMultiTotal(
            state?.state?.inveoicesData[0].invoiceBalance.split(" ")[0] +
              " " +
              total.toFixed(2)
          );
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

  // const onChevronClick = (id: any) => {
  //   let newData: any = [...multiplePaymentId];
  //   if (newData.includes(id)) {
  //     newData = newData.filter((item: any) => item != id);
  //   } else {
  //     newData.push(id);
  //   }
  //   setMultiplePaymentId(newData);
  // };

  const handleSave = () => {
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
            note: paymentNote.note,
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
        Payments: [
          {
            totalAmount: parseFloat(multiTotal.split(" ")[1]),
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

      console.log(data);
    } else {
      console.log(currencyOptions, referenceNo);
      let arrData: Array<any> = [];
      for (let i = 0; i < currencyOptions.length; i++) {
        arrData.push({
          totalAmount:
            multiPaymentBlocks.length === 1
              ? isFullAmount
                ? parseFloat(
                    state?.state?.inveoicesData[0]?.invoiceBalance?.split(
                      " "
                    )[1]
                  )
                : parseFloat(totals[i].text)
              : parseFloat(totals[i].text),
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
            note: paymentNote.note,
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

    // return;
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
        console.log(res);
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
        console.log(err);
      });
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
            disabled={isSaveDisable()}
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
                      {/* <div
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
                      </div> */}
                    </div>
                  </div>

                  <p>QBO No. 730</p>
                </div>
              </div>

              {state?.state?.inveoicesData?.length === 1 && (
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

                            <div className="paymentInstallmentContainerDropdowns">
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

                            <div className="paymentInstallmentContainerDropdowns">
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
                              <div className="paymentInstallmentContainerDropdowns">
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
                              <div className="paymentInstallmentContainerDropdowns">
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

                              {isFullAmount &&
                                multiPaymentBlocks.length === 1 && (
                                  <div className="amountPaymentPage">
                                    {invoiceItem.invoiceBalance}
                                  </div>
                                )}
                              {(!isFullAmount ||
                                multiPaymentBlocks.length > 1) && (
                                <input
                                  type="number"
                                  value={
                                    totals.find(
                                      (e: any) =>
                                        e.invoiceKey === invoiceItem.id &&
                                        e.blockKey === item.id
                                    )?.text || ""
                                  }
                                  onChange={(e) => {
                                    handleInputText(
                                      e.target.value,
                                      totals,
                                      setTotals,
                                      invoiceItem.id,
                                      item.id
                                    );
                                  }}
                                />
                              )}
                              {i == 0 && multiPaymentBlocks.length == 1 ? (
                                <div className="fullAmountPaymentCheckbox">
                                  <Checkbox
                                    id="fullAmt"
                                    checked={isFullAmount}
                                    label="Full Amount"
                                    onChange={(e: any) =>
                                      setIsFullAmount(e.target.checked)
                                    }
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
              <p>{multiTotal}</p>
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
                  <div className="amountPaymentPage">{multiTotal}</div>

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
          cid="a9bbee6d-797a-4724-a86a-5b1a2e28763f"
          id="32fbfee0-809d-4828-ab55-e4deebeb5157"
          isPaymentPage={true}
        ></FileUploadWidget>
      </div>
    </div>
  );
};

export default PaymentDetailPage;
