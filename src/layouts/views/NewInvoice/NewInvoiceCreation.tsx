import { useEffect, useState } from "react";
import { Button, Dropdown, Icon, DatePicker } from "atlasuikit";
import axios from "axios";
import "./NewInvoiceCreation.scss";
import { getCountryByCustomer, urls } from "../../../urls/urls";
import { Loader } from "../../../components/Comman/Utils/utils";

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
}: any) => {
  // Dropdown open
  const [isCustomerOpen, setIsCustomerOpen] = useState(false);
  const [istypeOpen, setIstypeOpen] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);

  const preparedCustomerData = (data: any) => {
    const newData = data?.map((item: any) => {
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
    let allPayrollCustomerapi = urls.allPayrollCustomerSubscriptionapi
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
        console.log("cutomer payroll api")
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
    if (
      stepperOneData?.type === "Credit Memo" ||
      stepperOneData?.type === "Proforma" ||
      stepperOneData?.type === "Miscellaneous"
    ) {
      getCustomerDropdownOptions();
    }
  }, [stepperOneData?.type]);

  useEffect(() => {
    if (
      stepperOneData?.type === "Payroll"
    ) {
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
          <div className="newinvoice-container">
            <h3>New Invoice</h3>

            <div className="dropdownRow">
              <div className="dropdown">
                <Dropdown
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

              <div className="dropdown">
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
            </div>

            {stepperOneData?.type !== "Payroll" && (
              <div className="dpStepContainer">
                <DatePicker
                  handleDateChange={function (date: any) {
                    setInvoiceDate(date);
                  }}
                  label="Invoice Date"
                  minDate={new Date()}
                  required={true}
                  // placeholderText={
                  //   invoiceDate
                  //     ? invoiceDate
                  //         ?.toString()
                  //         ?.slice(4, 15)
                  //         ?.replaceAll(" ", "/")
                  //     : "Please Select"
                  // }
                />
              </div>
            )}

            {stepperOneData?.type === "Payroll" && (
              <div className="dropdownC">
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
            )}

            {stepperOneData?.type === "Payroll" && (
              <div className="monthYearContainer">
                <div
                  className="dropdown-margin"
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
                  className="year-dropdown"
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
