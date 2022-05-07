import { useEffect, useState } from 'react'
import { Button, Dropdown, Icon } from 'atlasuikit'
import axios from 'axios';
import './NewInvoiceCreation.scss'


const NewInvoiceCreation = ({ handleSteps, allStepsData, handleAllSteppersData }: any) => {

  const token = localStorage.getItem("accessToken");

  // Dropdown open
  const [isCustomerOpen, setIsCustomerOpen] = useState(false);
  const [istypeOpen, setIstypeOpen] = useState(false)
  const [isCountryOpen, setIsCountryOpen] = useState(false)
  const [isMonthOpen, setIsMonthOpen] = useState(false)
  const [isYearOpen, setIsYearOpen] = useState(false)


  // DropdownOptions
  const [CustomerOptions, setCustomerOption] = useState([]);

  const [typeOptions, setTypeOptions] = useState([
    {
      isSelected: false,
      label: "Payroll",
      value: "1",
    },
  ])

  const [CountryOptions, setCountryOptions] = useState([]);

  const [MonthOptions, setMonthOptions] = useState([
    {
      isSelected: false,
      label: "January",
      value: "0",
    },
    {
      isSelected: false,
      label: "Feburary",
      value: "1",
    },
    {
      isSelected: false,
      label: "March",
      value: "2",
    },
    {
      isSelected: false,
      label: "April",
      value: "3",
    },
    {
      isSelected: false,
      label: "May",
      value: "4",
    },
    {
      isSelected: false,
      label: "June",
      value: "5",
    },
    {
      isSelected: false,
      label: "July",
      value: "6",
    },
    {
      isSelected: false,
      label: "August",
      value: "7",
    },
    {
      isSelected: false,
      label: "September",
      value: "8",
    },
    {
      isSelected: false,
      label: "October",
      value: "9",
    },
    {
      isSelected: false,
      label: "November",
      value: "10",
    },
    {
      isSelected: false,
      label: "December",
      value: "11",
    },
  ]);

  const [YearOptions, setYearOptions] = useState([
    {
      isSelected: false,
      label: "2019",
      value: "0",
    },
    {
      isSelected: false,
      label: "2020",
      value: "1",
    },
    {
      isSelected: false,
      label: "2021",
      value: "2",
    },
    {
      isSelected: false,
      label: "2022",
      value: "3",
    },
    {
      isSelected: false,
      label: "2023",
      value: "4",
    },
    {
      isSelected: false,
      label: "2024",
      value: "5",
    },
  ]);

  // Stepper One Data
  const [stepperOneData, setStepperOneData] = useState(allStepsData.stepOneData)


  const preparedCustomerData = (data: any) => {

    const newData = data?.map((item: any) => {
      if (item.customerId === allStepsData?.stepOneData?.customerId) {
        return {
          isSelected: true,
          label: item.name,
          value: item.customerId,
        }
      } else {
        return {
          isSelected: false,
          label: item.name,
          value: item.customerId,
        }
      }

    })
    return newData
  }

  const getCustomerDropdownOptions = () => {
    let api = `https://apigw-dev-eu.atlasbyelements.com/cs/api/Customer/GetAll`;
    const headers = {
      headers: {
        authorization: `Bearer ${token}`
      },
    };

    axios
      .get(api, headers)
      .then((res: any) => {
        const preData: any = preparedCustomerData(res.data)
        setCustomerOption(preData);
      })
      .catch((e: any) => {
        console.log("error", e);
      });
  }

  const preparedCountryData = (data: any) => {
    const newData = data?.map((item: any) => {
      if (item.id === allStepsData?.stepOneData?.countryId) {

        return {
          isSelected: true,
          label: item.name,
          value: item.id
        }
      } else {
        return {
          isSelected: false,
          label: item.name,
          value: item.id
        }
      }

    })
    return newData
  }

  const getCountryDropdwonOptions = () => {
    let api = `https://apigw-dev-eu.atlasbyelements.com/atlas-subscriptionservice/api/Subscription/GetEORSubscriptionCountriesByCustomer?CustomerId=${stepperOneData.customerId}`;
    const headers = {
      headers: {
        authorization: `Bearer ${token}`
      },
    };

    axios
      .get(api, headers)
      .then((res: any) => {
        const preData: any = preparedCountryData(res.data)
        setCountryOptions(preData)
      })
      .catch((e: any) => {
        console.log("error", e);
      });
  }

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

  const handleDropOptionForAlreadyFilled = (
    item: any,
    options: any,
    set: any,
    setIsOpen: any
  ) => {

    let arr = [...options];

    arr.forEach((e, i) => {
      if (e.value === item) {
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
    getCustomerDropdownOptions();
  }, [])

  useEffect(() => {
    if (stepperOneData.customerId) {
      getCountryDropdwonOptions()
    }
  }, [stepperOneData?.customerId])


  useEffect(() => {
    if (allStepsData?.stepOneData?.yearId &&
      allStepsData?.stepOneData?.monthId &&
      allStepsData?.stepOneData?.typeId) {

      handleDropOptionForAlreadyFilled(
        allStepsData?.stepOneData?.typeId,
        typeOptions,
        setTypeOptions,
        setIstypeOpen
      )

      handleDropOptionForAlreadyFilled(
        allStepsData?.stepOneData?.monthId,
        MonthOptions,
        setMonthOptions,
        setIsMonthOpen
      )

      handleDropOptionForAlreadyFilled(
        allStepsData?.stepOneData?.yearId,
        YearOptions,
        setYearOptions,
        setIsYearOpen
      )
    }

  }, [allStepsData?.stepOneData])



  return (
    <>
      <div>
        <div className='newinvoice-container'>

          <h3>New Invoice</h3>

          <div className='dropdown'>
            <Dropdown
              handleDropOptionClick={(item: any) => {
                handleDropOption(
                  item,
                  CustomerOptions,
                  setCustomerOption,
                  setIsCustomerOpen
                );
                setStepperOneData({ ...stepperOneData, customer: item.label, customerId: item.value })
              }
              }
              handleDropdownClick={(b: boolean) => {
                setIsCustomerOpen(b);
              }}
              isOpen={isCustomerOpen}
              options={CustomerOptions}
              title={`Customer`}
            />
          </div>

          <div className='dropdowns'>
            <Dropdown
              handleDropOptionClick={(item: any) => {
                handleDropOption(
                  item,
                  typeOptions,
                  setTypeOptions,
                  setIstypeOpen
                );
                setStepperOneData({ ...stepperOneData, type: item.label, typeId: item.value })
              }
              }
              handleDropdownClick={(b: boolean) => {
                setIstypeOpen(b);
              }}
              isOpen={istypeOpen}
              options={typeOptions}
              title={`Type`}
            />
          </div>

          <div className='dropdownC'>
            <Dropdown
              handleDropOptionClick={(item: any) => {
                handleDropOption(
                  item,
                  CountryOptions,
                  setCountryOptions,
                  setIsCountryOpen
                );
                setStepperOneData({ ...stepperOneData, country: item.label, countryId: item.value })
              }
              }
              handleDropdownClick={(b: boolean) => {
                setIsCountryOpen(b);
              }}
              isOpen={isCountryOpen}
              options={CountryOptions}
              title={`Country`}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'row', zIndex: '1' }}>
            <div
              className='dropdown-margin'
              onClick={() => setIsMonthOpen(!isMonthOpen)}
            >
              <Dropdown
                handleDropOptionClick={(item: any) => {
                  handleDropOption(
                    item,
                    MonthOptions,
                    setMonthOptions,
                    setIsMonthOpen
                  );
                  setStepperOneData({ ...stepperOneData, month: item.label, monthId: item.value })
                }
                }
                handleDropdownClick={(b: boolean) => {
                  // setIsMonthOpen(b);
                }}
                isOpen={isMonthOpen}
                options={MonthOptions}
                title="Select Month"
              />
              <div className='calendar'>
                <Icon
                  icon="calendar"
                  size="small"
                  width="30"
                  height="30"
                  color="#3E3E3E"
                />
              </div>
            </div>

            <div
              className='year-dropdown'
              onClick={() => setIsYearOpen(!isYearOpen)}
            >
              <Dropdown
                handleDropOptionClick={(item: any) => {
                  handleDropOption(
                    item,
                    YearOptions,
                    setYearOptions,
                    setIsYearOpen
                  );
                  setStepperOneData({ ...stepperOneData, year: item.label, yearId: item.value })
                }
                }
                handleDropdownClick={(b: boolean) => {
                  // setIsYearOpen(!isYearOpen);
                }}
                isOpen={isYearOpen}
                options={YearOptions}
                title="Select Year"
              />

              <div
                className='calendar'
              >
                <Icon
                  icon="calendar"
                  size="small"
                  width="30"
                  height="30"
                  color="#3E3E3E"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className='buttons'>
        <Button
          label="Save"
          className="secondary-btn medium button"
          icon={{
            icon: 'add',
            size: 'medium',
            color: '#526FD6'
          }}
          handleOnClick={() => {

          }}
        />

        <Button
          disabled={!(stepperOneData?.customer !== "" && stepperOneData?.type !== "" && stepperOneData?.country !== "" && stepperOneData?.year !== "" && stepperOneData?.month !== "")}
          data-testid="next-button"
          icon={{
            icon: 'chevronRight',
            size: 'medium',
            color: '#fff'
          }}
          label="Next"
          className="primary-blue medium button next-button"
          handleOnClick={() => {
            handleSteps(2)
            handleAllSteppersData(stepperOneData, 2)
          }}
        />
      </div>

    </>
  )
}

export default NewInvoiceCreation