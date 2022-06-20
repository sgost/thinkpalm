import { useEffect, useState } from "react";
import { Dropdown, Icon, DatePicker } from "atlasuikit";
import axios from "axios";
import "./NewInvoiceCreation.scss";
import { getCountryByCustomer, getHeaders, urls } from "../../../urls/urls";
import { Loader } from "../../../components/Comman/Utils/utils";
import moment from "moment";

const NewInvoiceCreation = ({
  accessToken,
  stepperOneData,
  setStepperOneData,
  YearOptions,
  setYearOptions,
  MonthOptions,
  setMonthOptions,
  CountryOptions,
  setCountryOptions,
  CustomerOptions,
  setCustomerOption,
  typeOptions,
  setTypeOptions,
  loading,
  setLoading,
  invoiceDate,
  setInvoiceDate,
  invoicerOptions,
  setInvoicerOptions,
  receivableAccountOptions,
  setReceivableAccountOptions,
  currencyOptions,
  setCurrencyOptions,
  qbIdOptions,
  setQbIdOptions,
  paymentTermsOptions,
  setPaymentTermsOptions,
  paymentMethodOptions,
  setPaymentMethodOptions,
}: any) => {
  // Dropdown open
  const [isCustomerOpen, setIsCustomerOpen] = useState(false);
  const [istypeOpen, setIstypeOpen] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);

  const [isInvoicer, setIsInvoicer] = useState(false);
  const [isRecAcc, setIsRecAcc] = useState(false);
  const [isCurrency, setIsCurrency] = useState(false);
  const [isQbId, setIsQbId] = useState(false);
  const [isPaymentTerms, setIsPaymentTerms] = useState(false);
  const [isPaymentMethod, setIsPaymentMethod] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    axios
      .get(urls.subscriptionLookup, {
        headers: getHeaders(token, stepperOneData.customerId, "false"),
      })
      .then((res: any) => {
        setInvoicerOptions(
          res.data.invoicers.map((invoicer: any) => {
            return {
              ...invoicer,
              isSelected: false,
              label: invoicer.text,
              value: invoicer.value,
              receivableAccounts: invoicer.receivableAccounts,
            };
          })
        );
        setPaymentMethodOptions(
          res.data.paymentMethods.map((pm: any) => {
            return {
              ...pm,
              isSelected: false,
              label: pm.text,
              value: pm.value,
            };
          })
        );

        setCurrencyOptions(
          res.data.billingCurrencies.map((bc: any) => {
            return {
              ...bc,
              isSelected: false,
              label: bc.text,
              value: bc.value,
            };
          })
        );
      })
      .catch((err: any) => console.log(err));

    axios
      .get(urls.lookup, {
        headers: getHeaders(token, stepperOneData.customerId, "false"),
      })
      .then((res: any) => {
        setPaymentTermsOptions(
          res.data.otherDueTypes.map((od: any) => {
            return {
              ...od,
              isSelected: false,
              label: od.text,
              value: od.value,
            };
          })
        );
      })
      .catch((err: any) => console.log(err));

    setQbIdOptions([
      {
        isSelected: false,
        label: "test 1",
        value: "test1",
      },
    ]);
  }, []);

  const preparedCustomerData = (data: any) => {
    const newData = data?.map((item: any) => {
      if (item.customerId === stepperOneData?.customerId) {
        return {
          ...item,
          isSelected: true,
          label: item.name,
          value: item.customerId,
        };
      } else {
        return {
          ...item,
          isSelected: false,
          label: item.name,
          value: item.customerId,
        };
      }
    });
    return newData;
  };

  const getCustomerDropdownOptions = () => {
    let allCustomerapi = urls.customers;
    const headers = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };

    setLoading(true);

    axios
      .get(allCustomerapi, headers)
      .then((res: any) => {
        const preData: any = preparedCustomerData(res.data);
        setCustomerOption(preData);
        setLoading(false);
      })
      .catch((e: any) => {
        console.log("error", e);
      });
  };

  const preparedPayrollCustomerData = (data: any) => {
    const newData = data?.customers?.map((item: any) => {
      if (item.customerId === stepperOneData?.customerId) {
        return {
          isSelected: true,
          label: item.name,
          value: item.customerId,
        };
      } else {
        return {
          isSelected: false,
          label: item.name,
          value: item.customerId,
        };
      }
    });
    return newData;
  };

  const getPayrollCustomerDropdownOptions = () => {
    let allPayrollCustomerapi = urls.allPayrollCustomerSubscriptionapi;
    const headers = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };

    setLoading(true);

    axios
      .get(allPayrollCustomerapi, headers)
      .then((res: any) => {
        const preData: any = preparedPayrollCustomerData(res.data);
        setCustomerOption(preData);
        setLoading(false);
      })
      .catch((e: any) => {
        console.log("error", e);
      });
  };

  const preparedCountryData = (data: any) => {
    const newData = data?.map((item: any) => {
      if (item.id === stepperOneData?.countryId) {
        return {
          isSelected: true,
          label: item.name,
          value: item.id,
        };
      } else {
        return {
          isSelected: false,
          label: item.name,
          value: item.id,
        };
      }
    });
    return newData;
  };

  const getCountryDropdwonOptions = () => {
    let api = getCountryByCustomer(stepperOneData?.customerId);
    const headers = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };

    axios
      .get(api, headers)
      .then((res: any) => {
        if (res.data) {
          const preData: any = preparedCountryData(res.data);
          setCountryOptions(preData);
        }
      })
      .catch((e: any) => {
        console.log("error", e);
      });
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
          isSelected: true,
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
    if (
      stepperOneData?.type === "Credit Memo" ||
      stepperOneData?.type === "Proforma" ||
      stepperOneData?.type === "Miscellaneous"
    ) {
      getCustomerDropdownOptions();
    }
  }, [stepperOneData?.type]);

  useEffect(() => {
    if (stepperOneData?.type === "Payroll") {
      getPayrollCustomerDropdownOptions();
    }
  }, [stepperOneData?.type]);

  useEffect(() => {
    if (stepperOneData?.customerId) {
      getCountryDropdwonOptions();
    }
  }, [stepperOneData?.customerId]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <div className="newinvoice-container new_Invoice_itme">
            <h3>New Invoice</h3>

            <div className="row">
              <div className="col-md-4 select-component type_dpStep">
                <Dropdown
                  handleDropOptionClick={(item: any) => {
                    handleDropOption(
                      item,
                      typeOptions,
                      setTypeOptions,
                      setIstypeOpen
                    );
                    setStepperOneData({
                      ...stepperOneData,
                      type: item.label,
                      typeId: item.value,
                    });
                  }}
                  handleDropdownClick={(b: boolean) => {
                    setIstypeOpen(b);
                    setIsCustomerOpen(false);
                    setIsCountryOpen(false);
                    setIsMonthOpen(false);
                    setIsYearOpen(false);
                  }}
                  isOpen={istypeOpen}
                  options={typeOptions}
                  title={`Type`}
                />
              </div>

              <div className=" col-md-4 select-component type_dpStep">
                <Dropdown
                  isDisabled={!stepperOneData?.type}
                  handleDropOptionClick={(item: any) => {
                    handleDropOption(
                      item,
                      CustomerOptions,
                      setCustomerOption,
                      setIsCustomerOpen
                    );
                    setCountryOptions([]);

                    setStepperOneData({
                      ...stepperOneData,
                      customer: item.label,
                      customerId: item.value,
                      countryId: "",
                      country: "",
                    });
                  }}
                  handleDropdownClick={(b: boolean) => {
                    setIsCustomerOpen(b);
                    setIstypeOpen(false);
                    setIsCountryOpen(false);
                    setIsMonthOpen(false);
                    setIsYearOpen(false);
                  }}
                  isOpen={isCustomerOpen}
                  options={CustomerOptions}
                  title={`Customer`}
                  search
                />
              </div>
            </div>

            {stepperOneData?.type !== "Payroll" && (
              <div className="dpStepContainer row">
                <div className="col-md-4 input-component">
                  <DatePicker
                    handleDateChange={function (date: any) {
                      console.log("date", date);
                      setInvoiceDate(date);
                    }}
                    label="Invoice Date"
                    minDate={new Date()}
                    required={true}
                    placeholderText={
                      invoiceDate
                        ? moment(invoiceDate).format("DD/MMM/YYYY")
                        : "Please Select"
                    }
                  />
                </div>
              </div>
            )}

            <div className="row">
              {stepperOneData?.type &&
                stepperOneData?.type !== "Payroll" &&
                stepperOneData?.type !== "Credit Memo" && (
                  <div className="dropdown col-md-4 select-component">
                    <Dropdown
                      isDisabled={!stepperOneData?.type}
                      handleDropOptionClick={(item: any) => {
                        handleDropOption(
                          item,
                          invoicerOptions,
                          setInvoicerOptions,
                          setIsInvoicer
                        );

                        let tempRecAccOptions: Array<any> = [];
                        item.receivableAccounts?.forEach((recAcc: any) => {
                          tempRecAccOptions.push({
                            ...recAcc,
                            isSelected: false,
                            label: recAcc.text,
                            value: recAcc.value,
                          });
                        });
                        setReceivableAccountOptions(tempRecAccOptions);
                      }}
                      handleDropdownClick={(b: boolean) => {
                        setIsInvoicer(b);
                      }}
                      isOpen={isInvoicer}
                      options={invoicerOptions}
                      title={`Invoicer`}
                      search
                    />
                  </div>
                )}

              {stepperOneData?.type &&
                stepperOneData?.type !== "Payroll" &&
                stepperOneData?.type !== "Credit Memo" && (
                  <div className="dropdown col-md-4 select-component">
                    <Dropdown
                      isDisabled={!stepperOneData?.type}
                      handleDropOptionClick={(item: any) => {
                        handleDropOption(
                          item,
                          receivableAccountOptions,
                          setReceivableAccountOptions,
                          setIsRecAcc
                        );
                      }}
                      handleDropdownClick={(b: boolean) => {
                        setIsRecAcc(b);
                      }}
                      isOpen={isRecAcc}
                      options={receivableAccountOptions}
                      title={`Receivable Account`}
                      search
                    />
                  </div>
                )}
            </div>

            <div className="row">
              {stepperOneData?.type &&
                stepperOneData?.type !== "Payroll" &&
                stepperOneData?.type !== "Credit Memo" && (
                  <div className="lastDropdown col-md-4 select-component">
                    <Dropdown
                      isDisabled={!stepperOneData?.type}
                      handleDropOptionClick={(item: any) => {
                        handleDropOption(
                          item,
                          currencyOptions,
                          setCurrencyOptions,
                          setIsCurrency
                        );
                      }}
                      handleDropdownClick={(b: boolean) => {
                        setIsCurrency(b);
                      }}
                      isOpen={isCurrency}
                      options={currencyOptions}
                      title={`Currency`}
                      search
                    />
                  </div>
                )}

              {stepperOneData?.type &&
                stepperOneData?.type !== "Payroll" &&
                stepperOneData?.type !== "Credit Memo" && (
                  <div className="lastDropdown col-md-4 select-component">
                    <Dropdown
                      isDisabled={!stepperOneData?.type}
                      handleDropOptionClick={(item: any) => {
                        handleDropOption(
                          item,
                          qbIdOptions,
                          setQbIdOptions,
                          setIsQbId
                        );
                      }}
                      handleDropdownClick={(b: boolean) => {
                        setIsQbId(b);
                      }}
                      isOpen={isQbId}
                      options={qbIdOptions}
                      title={`Quickbook ID`}
                      search
                    />
                  </div>
                )}
            </div>

            {stepperOneData?.type &&
              stepperOneData?.type !== "Payroll" &&
              stepperOneData?.type !== "Credit Memo" && (
                <div className="row">
                  <div className="dropdown col-md-4 select-component">
                    <Dropdown
                      isDisabled={!stepperOneData?.type}
                      handleDropOptionClick={(item: any) => {
                        handleDropOption(
                          item,
                          paymentTermsOptions,
                          setPaymentTermsOptions,
                          setIsPaymentTerms
                        );
                      }}
                      handleDropdownClick={(b: boolean) => {
                        setIsPaymentTerms(b);
                      }}
                      isOpen={isPaymentTerms}
                      options={paymentTermsOptions}
                      title={`Payment Terms`}
                      search
                    />
                  </div>
                  <div className="dropdown col-md-4 select-component">
                    <Dropdown
                      isDisabled={!stepperOneData?.type}
                      handleDropOptionClick={(item: any) => {
                        handleDropOption(
                          item,
                          paymentMethodOptions,
                          setPaymentMethodOptions,
                          setIsPaymentMethod
                        );
                      }}
                      handleDropdownClick={(b: boolean) => {
                        setIsPaymentMethod(b);
                      }}
                      isOpen={isPaymentMethod}
                      options={paymentMethodOptions}
                      title={`Payment Method`}
                      search
                    />
                  </div>
                </div>
              )}
            {stepperOneData?.type === "Payroll" && (
              <div className="row">
                <div className="col-md-4 select-component">
                  <Dropdown
                    handleDropOptionClick={(item: any) => {
                      handleDropOption(
                        item,
                        CountryOptions,
                        setCountryOptions,
                        setIsCountryOpen
                      );
                      setStepperOneData({
                        ...stepperOneData,
                        country: item.label,
                        countryId: item.value,
                      });
                    }}
                    handleDropdownClick={(b: boolean) => {
                      setIsCountryOpen(b);
                      setIsCustomerOpen(false);
                      setIstypeOpen(false);
                      setIsMonthOpen(false);
                      setIsYearOpen(false);
                    }}
                    isOpen={isCountryOpen}
                    options={CountryOptions}
                    title={`Countries`}
                  />
                </div>
              </div>
            )}

            {stepperOneData?.type === "Payroll" && (
              <div className="monthYearContainer row">
                <div
                  className="dropdown-margin col-lg-4 input-component"
                  onClick={() => {
                    setIsMonthOpen(!isMonthOpen);
                    setIsCustomerOpen(false);
                    setIstypeOpen(false);
                    setIsCountryOpen(false);
                    setIsYearOpen(false);
                  }}
                >
                  <Dropdown
                    handleDropOptionClick={(item: any) => {
                      handleDropOption(
                        item,
                        MonthOptions,
                        setMonthOptions,
                        setIsMonthOpen
                      );
                      setStepperOneData({
                        ...stepperOneData,
                        month: item.label,
                        monthId: item.value,
                      });
                    }}
                    handleDropdownClick={(b: boolean) => {
                      // setIsMonthOpen(b);
                    }}
                    isOpen={isMonthOpen}
                    options={MonthOptions}
                    title="Select Month"
                  />
                  <div className="calendar">
                    <Icon
                      icon="calendar"
                      width="30"
                      height="30"
                      color="#3E3E3E"
                    />
                  </div>
                </div>

                <div
                  className="year-dropdown col-lg-4 input-component"
                  onClick={() => {
                    setIsYearOpen(!isYearOpen);
                    setIsCustomerOpen(false);
                    setIstypeOpen(false);
                    setIsCountryOpen(false);
                    setIsMonthOpen(false);
                  }}
                >
                  <Dropdown
                    handleDropOptionClick={(item: any) => {
                      handleDropOption(
                        item,
                        YearOptions,
                        setYearOptions,
                        setIsYearOpen
                      );
                      setStepperOneData({
                        ...stepperOneData,
                        year: item.label,
                        yearId: item.value,
                      });
                    }}
                    handleDropdownClick={(b: boolean) => {
                      // setIsYearOpen(!isYearOpen);
                    }}
                    isOpen={isYearOpen}
                    options={YearOptions}
                    title="Select Year"
                  />

                  <div className="calendar">
                    <Icon
                      icon="calendar"
                      width="30"
                      height="30"
                      color="#3E3E3E"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NewInvoiceCreation;
