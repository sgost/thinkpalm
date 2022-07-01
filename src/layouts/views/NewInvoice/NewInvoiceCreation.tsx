import { useEffect, useState } from "react";
import { Dropdown, Icon, DatePicker } from "atlasuikit";
import axios from "axios";
import "./NewInvoiceCreation.scss";
import { getCountryByCustomer, getHeaders, urls } from "../../../urls/urls";
import { Loader } from "../../../components/Comman/Utils/utils";
import moment from "moment";
import Input from "../../../components/Input/input";
import jwt_decode from "jwt-decode";

const NewInvoiceCreation = ({
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
  qbIdValue,
  setQbIdValue,
  paymentTermsOptions,
  setPaymentTermsOptions,
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

  const tempToken : any = localStorage.getItem("accessToken");
  const currentOrgId: any = localStorage.getItem("current-org-id");

  const preparedCustomerData = (data: any) => {
    return data?.map((item: any) => {
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
  };

  const getCustomerDropdownOptions = () => {
    let allCustomerapi = urls.getCustomersByIds;

    const headers = getHeaders(tempToken, currentOrgId, "false");
    let decToken : any = jwt_decode(tempToken);
    let custIds : any = Object.keys(decToken.Permissions)

    setLoading(true);

    axios
      .post(
        allCustomerapi,
        {
          customerIds: custIds,
        },
        {
          headers: headers,
        }
      )
      .then((response: any) => {
        const preData: any = preparedCustomerData(response.data);
        setCustomerOption(preData);
        setLoading(false);
      })
      .catch((e: any) => {
        console.log(e);
      });
  };

  const preparedPayrollCustomerData = (data: any) => {
    return data?.customers?.map((item: any) => {
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
  };

  const getPayrollCustomerDropdownOptions = () => {
    let allPayrollCustomerapi = urls.allPayrollCustomerSubscriptionapi;

    const headers = {
      headers: getHeaders(tempToken, currentOrgId, "false"),
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
    return data?.map((item: any) => {
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
  };

  const getCountryDropdwonOptions = () => {
    let api = getCountryByCustomer(stepperOneData?.customerId);

    const headers = {
      headers: getHeaders(tempToken, currentOrgId, "false")
    }

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
                    setIsInvoicer(false);
                    setIsRecAcc(false);
                    setIsCurrency(false);
                    setIsQbId(false);
                    setIsPaymentTerms(false);
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
                    setIsInvoicer(false);
                    setIsRecAcc(false);
                    setIsCurrency(false);
                    setIsQbId(false);
                    setIsPaymentTerms(false);
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
              {stepperOneData?.type && stepperOneData?.type !== "Payroll" && (
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
                      setIsRecAcc(false);
                      setIsCurrency(false);
                      setIsQbId(false);
                      setIsPaymentTerms(false);
                      setIstypeOpen(false);
                      setIsCustomerOpen(false);
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
                        setIsInvoicer(false);
                        setIsCurrency(false);
                        setIsQbId(false);
                        setIsPaymentTerms(false);
                        setIstypeOpen(false);
                        setIsCustomerOpen(false);
                      }}
                      isOpen={isRecAcc}
                      options={receivableAccountOptions}
                      title={`Receivable Account`}
                      search
                    />
                  </div>
                )}
              {stepperOneData?.type &&
                stepperOneData?.type !== "Payroll" &&
                stepperOneData?.type === "Credit Memo" && (
                  <div className="dropdown col-md-4 select-component">
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
                        setIsInvoicer(false);
                        setIsRecAcc(false);
                        setIsQbId(false);
                        setIsPaymentTerms(false);
                        setIstypeOpen(false);
                        setIsCustomerOpen(false);
                      }}
                      isOpen={isCurrency}
                      options={currencyOptions}
                      title={`Currency`}
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
                      handleDropOptionClick={(items: any) => {
                        handleDropOption(
                          items,
                          currencyOptions,
                          setCurrencyOptions,
                          setIsCurrency
                        );
                      }}
                      handleDropdownClick={(bool: boolean) => {
                        setIsCurrency(bool);
                        setIsInvoicer(false);
                        setIsRecAcc(false);
                        setIsQbId(false);
                        setIsPaymentTerms(false);
                        setIstypeOpen(false);
                        setIsCustomerOpen(false);
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
                          paymentTermsOptions,
                          setPaymentTermsOptions,
                          setIsPaymentTerms
                        );
                      }}
                      handleDropdownClick={(b: boolean) => {
                        setIsPaymentTerms(b);
                        setIsRecAcc(false);
                        setIsCurrency(false);
                        setIsQbId(false);
                        setIsInvoicer(false);
                      }}
                      isOpen={isPaymentTerms}
                      options={paymentTermsOptions}
                      title={`Payment Terms`}
                      search
                    />
                  </div>
                )}
            </div>

            {stepperOneData?.type && stepperOneData?.type !== "Payroll" && (
              <div className="row">
                <div className="col-md-4">
                  <Input
                    required
                    className="qbInput"
                    type="number"
                    label="Financial System ID"
                    value={qbIdValue}
                    setValue={setQbIdValue}
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
                      setIsCustomerOpen(false);
                      setIsMonthOpen(false);
                      setIsYearOpen(false);
                      setIsInvoicer(false);
                      setIsRecAcc(false);
                      setIsCurrency(false);
                      setIsQbId(false);
                      setIsPaymentTerms(false);
                      setIstypeOpen(false);
                      setIsCustomerOpen(false);
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
                    setIsCustomerOpen(false);
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
                    handleDropdownClick={(_b: boolean) => {
                      setIsInvoicer(false);
                      setIsRecAcc(false);
                      setIsCurrency(false);
                      setIsQbId(false);
                      setIsPaymentTerms(false);
                      setIstypeOpen(false);
                      setIsCustomerOpen(false);
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
                    setIsCustomerOpen(false);
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
                    handleDropdownClick={(_optionClick: boolean) => {
                      setIsInvoicer(false);
                      setIsRecAcc(false);
                      setIsCurrency(false);
                      setIsQbId(false);
                      setIsPaymentTerms(false);
                      setIstypeOpen(false);
                      setIsCustomerOpen(false);
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
