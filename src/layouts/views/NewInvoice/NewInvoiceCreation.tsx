import { useEffect, useState } from 'react'
import { Button, Dropdown, Icon } from 'atlasuikit'
import axios from 'axios';
import './NewInvoiceCreation.scss'


const NewInvoiceCreation = ({ handleSteps }: any) => {

  const token = localStorage.getItem("temptoken");

  // Dropdown open
  const [isCustomerOpen, setIsCustomerOpen] = useState(false);
  const [istypeOpen, setIstypeOpen] = useState(false)
  const [isCountryOpen, setIsCountryOpen] = useState(false)
  const [isMonthOpen, setIsMonthOpen] = useState(false)
  const [isYearOpen, setIsYearOpen] = useState(false)


  // DropdownOptions
  const [CustomerOptions, setCustomerOption] = useState([]);

  const [typeOptions, setTypeOptions] = useState([
    // {
    //   isSelected: false,
    //   label: "Contractor Invoice",
    //   value: "contractorInvoice",
    // },
    // {
    //   isSelected: false,
    //   label: "Credit Memo",
    //   value: 4,
    // },
    {
      isSelected: false,
      label: "Payroll",
      value: 1,
    },
    // {
    //   isSelected: false,
    //   label: "Miscellaneous",
    //   value: 2,
    // },
    // {
    //   isSelected: false,
    //   label: "Proforma",
    //   value: 3,
    // },
    // {
    //   isSelected: false,
    //   label: "LateFee ",
    //   value: 5,
    // },
    // {
    //   isSelected: false,
    //   label: "Payment ",
    //   value: 6,
    // },
  ])

  const [CountryOptions, setCountryOptions] = useState([
    // {
    //   isSelected: false,
    //   label: "America",
    //   value: "0",
    // },
    // {
    //   isSelected: false,
    //   label: "India",
    //   value: "1",
    // },
  ]);

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
  const [stepperOneData, setStepperOneData] = useState({
    customer: "",
    type: "",
    country: "",
    month: "",
    year: "",
    customerId: ""
  })


  const preparedCustomerData = (data: any) => {

    const newData = data?.map((item: any) => {
      return {
        isSelected: false,
        label: item.name,
        value: item.customerId,
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
      return {
        isSelected: false,
        label: item.name,
        value: item.name
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

  useEffect(() => {
    getCustomerDropdownOptions();
  }, [])

  useEffect(() => {
    if (stepperOneData.customerId) {
      getCountryDropdwonOptions()
    }
  }, [stepperOneData?.customerId])


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
              title={
                <>
                  Customer
                  <span style={{ color: 'red' }}>*</span>
                </>
              }
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
                setStepperOneData({ ...stepperOneData, type: item.label })
              }
              }
              handleDropdownClick={(b: boolean) => {
                setIstypeOpen(b);
              }}
              isOpen={istypeOpen}
              options={typeOptions}
              title={
                <>
                  Type
                  <span style={{ color: 'red' }}>*</span>
                </>
              }
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
                setStepperOneData({ ...stepperOneData, country: item.label })
              }
              }
              handleDropdownClick={(b: boolean) => {
                setIsCountryOpen(b);
              }}
              isOpen={isCountryOpen}
              options={CountryOptions}
              title={
                <>
                  Country
                  <span style={{ color: 'red' }}>*</span>
                </>
              }
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
                  setStepperOneData({ ...stepperOneData, month: item.label })
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
                  setStepperOneData({ ...stepperOneData, year: item.label })
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
          disabled={!(stepperOneData?.customer !== "" && stepperOneData?.type !== "" && stepperOneData?.country !== "" && stepperOneData?.year !== "" && stepperOneData?.month !== "") }
     
          icon={{
            icon: 'chevronRight',
            size: 'medium',
            color: '#fff'
          }}
          label="Next"
          className="primary-blue medium button next-button"
          handleOnClick={() => {
            handleSteps(2)
          }}
        />
      </div>

    </>
  )
}

export default NewInvoiceCreation