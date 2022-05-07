import React, { useState, useEffect } from 'react'
import { Checkbox, Button, ProfileHeader, Table, Icon } from 'atlasuikit'
import axios from "axios"
import './SelectEmployees.scss'



const SelectEmployees = ({ handleSteps, handleAllSteppersData, allStepsData }: any) => {

  const tempToken = localStorage.getItem("temptoken");
const [buttonHide, setButtonHide] = useState(false)
  const [tableOptions, setTableOptions] = useState(
    {
      columns: [
        {
          header: "Pay Item ID",
          isDefault: true,
          key: "payItemId",
          // key: "payItem",

        },
        {
          header: "Amount",
          isDefault: true,
          key: "amount",

        },
        {
          header: "Currency",
          isDefault: true,
          key: "currency",
        },
        {
          header: "Effective Date",
          isDefault: true,
          key: "effectiveDate",
        },
        // {
        //   header: "End Date",
        //   isDefault: true,
        //   key: "endDate",
        // },
        {
          header: "finItemType",
          isDefault: true,
          // key: "scope",
          key: "finItemType",
        },
        {
          header: "Frequency ID",
          isDefault: true,
          key: "payItemFrequencyId",
          // key: "frequency",
        },
      ],
      data: [],
    }
  );
  const [tableOptionsForNoData] = useState(
    {
      columns: [ ],
      data: [],
    }
  );

  const [isAutoApprove, setIsAutoApprove] = useState(false);
  const [showTable, setShowTable] = useState(false)
  const [employeeApiData, setEmployeeApiData] = useState([])
  const [employeeRowData, setEmployeeRowData] = useState<any>({})

  const getEmployyeApiData = () => {
    const headers = {
      headers: {
        authorization: `Bearer ${tempToken}`,
        "x-apng-base-region": "EMEA",
        "x-apng-customer-id": "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
        "x-apng-external": "false",
        "x-apng-inter-region": "0",
        "x-apng-target-region": "EMEA",
        customer_id: "a9bbee6d-797a-4724-a86a-5b1a2e28763f",
      },
    };
    const apiUrl = 'https://apigw-dev-eu.atlasbyelements.com/atlas-idg-service/api/PayrollChangeItems?customerId=a9bbee6d-797a-4724-a86a-5b1a2e28763f&countryId=7defc4f9-906d-437f-a6d9-c822ca2ecfd7'
    // const apiUrl = `https://apigw-dev-eu.atlasbyelements.com/atlas-idg-service/api/PayrollChangeItems?customerId=${allStepsData?.stepOneData?.customerId}&countryId=${allStepsData?.stepOneData?.countryId}`
    axios
      .get(apiUrl, headers)
      .then((res: any) => {
        // console.log('ress', res.data)
        if (res.status === 200) {

          let employeeTableData: any = [];
          res?.data?.forEach((item: any) => {
            item?.employeeDetail?.compensation?.payItems?.forEach((CompensationItems: any) => {
              employeeTableData.push({
                payItemId: CompensationItems?.payItemId,
                amount: CompensationItems?.amount,
                currency: CompensationItems?.currency,
                effectiveDate: CompensationItems?.effectiveDate,
                //getting null in one object 
                // endDate: CompensationItems?.endDate,
                finItemType: CompensationItems?.finItemType,
                payItemFrequencyId: CompensationItems?.payItemFrequencyId
              })
            })
          })
          setEmployeeApiData(res.data)
          setTableOptions({ ...tableOptions, data: employeeTableData })
          setButtonHide(true);
        }
      })
      .catch((e: any) => {
        console.log("error", e);
      });
  }


  useEffect(() => {
    getEmployyeApiData()
  }, [])



  const onRowCheckboxChange = (selectedRows: any) => {
    // alert(selectedRows)
  }


  return (
    <>
    <div className='select-employee-container'>
      <div className='employee-header'>
        <div>
          <h3>Select Employees</h3>
        </div>
        <div className='employee-checkbox'>
          <Checkbox
            checked={isAutoApprove}
            onChange={(e: any) => {
              setIsAutoApprove(e.target.checked);
            }}
            label="Show Billed Payroll Items"
          />
        </div>
      </div>
      {
        employeeApiData && employeeApiData.length ? employeeApiData.map((item: any, key: any) => {
          return (
            <div className='full-table-container'>
              <div className='user-detail'>
                <div
                  className='table-header'
                >
                  <ProfileHeader
                    user={
                      {
                        name: `${item?.employeeDetail?.personalDetails?.firstName} ${item?.employeeDetail?.personalDetails?.lastName}`,
                        data: "",
                        img: item?.employeeDetail?.personalDetails?.photoUrl,
                        // initials: "CY"
                      }
                    }
                  />
                </div>
                <div className='table-location'>
                  <div className='table-icon-location d-flax'>
                    <Icon
                      className="icon location"
                      color="#767676"
                      icon="location"
                      size="medium"
                    />

                    <h5>{item?.employeeDetail?.personalDetails?.homeAddress?.country}</h5>
                  </div>
                  <div className="table-up-down"
                  data-testid="showHide-button"
                    onClick={
                      () => {
                        setShowTable(!showTable);
                        setEmployeeRowData(item)
                      }
                    }
                  >
                    {
                      item?.employeeDetail?.compensation?.payItems?.length ?
                        <Icon
                          className="icon up"
                          color="#526FD6"
                          icon={
                            showTable === true && employeeRowData?.employeeDetail?.employeeID === item?.employeeDetail?.employeeID ?
                              "chevronUp"
                              :
                              "chevronDown"
                          }
                          size="medium"
                        />
                        : ""
                    }

                  </div>
                </div>
              </div>
              {
                showTable && employeeRowData?.employeeDetail?.employeeID === item?.employeeDetail?.employeeID &&
                <div className='table-container'>
                  <Table
                    options={
                      employeeRowData?.employeeDetail?.compensation?.payItems?.length ?
                        {
                          ...tableOptions,
                          enableMultiSelect: true,
                          isMultiSelectDisabled: true,
                          onRowCheckboxChange: onRowCheckboxChange,
                        } : {
                          ...tableOptionsForNoData,
                          enableMultiSelect: true,
                          isMultiSelectDisabled: true
                        }
                    }
                    colSort
                  />

                </div>
              }
            </div>
          )
        })
          :
          <></>
      }

{ buttonHide ? 
  <div className='step2-buttons'>
  <Button
    data-testid="back-button-steptwo"
    icon={{
      icon: 'chevronLeft',
      size: 'medium',
      color: '#fff'
    }}
    handleOnClick={() => {
      handleSteps(1)
    }}
    className="primary-blue medium previous-button"
    label="Previous"
  />
  <div className='step2-inside-button'>
    <Button
      label="Save"
      className="secondary-btn medium button"
      icon={{
        icon: 'add',
        size: 'medium',
        color: '#526FD6'
      }}
      handleOnClick={() => { }}
    />

    <Button
      // disabled={!(stepperOneData?.customer !== "" && stepperOneData?.type !== "" && stepperOneData?.country !== "" && stepperOneData?.year !== "" && stepperOneData?.month !== "")}
      data-testid="next-button-steptwo"
      icon={{
        icon: 'chevronRight',
        size: 'medium',
        color: '#fff'
      }}
      label="Next"
      className="primary-blue medium button next-button"
      handleOnClick={() => {
        handleSteps(3)
        handleAllSteppersData({}, 3)
      }}
    />
  </div>
</div> : <></>

}
    
    </div>
    </>

  )
}

export default SelectEmployees