import React, { useState, useEffect } from 'react'
import { Checkbox, Button, ProfileHeader, Table, Icon } from 'atlasuikit'
import axios from "axios"
import './SelectEmployees.scss'



const SelectEmployees = ({ handleSteps, handleAllSteppersData, allStepsData }: any) => {

  const tempToken = localStorage.getItem("temptoken");
  const [tableOptions] = useState(
    {
      columns: [
        {
          
          isDefault: true,
          key: "payItem",
          header: "Pay Item",
        },
        {
          key: "amount",
          header: "Amount",
          isDefault: true,
         
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
        {
          header: "End Date",
          isDefault: true,
          key: "endDate",
        },
        {
          header: "Scope",
          isDefault: true,
          key: "scope",
        },
        {
          header: "Frequency",
          isDefault: true,
          key: "frequency",
        },
      ],
      data: [
        {
          payItem: "Allowance",
          amount: "1300.00",
          currency: "USD",
          effectiveDate: "1 Sept 2022",
          endDate: "1 Sept 2022",
          scope: "AR, Payout",
          frequency: "Single"
        },
       
      ],
    }
  );
  const [isAutoApprove, setIsAutoApprove] = useState(false);
  const [showTable, setShowTable] = useState(false)

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
        // console.log('ress', res)
        // setFeeData(res);
      })
      .catch((e: any) => {
        console.log("error", e);
      });

  }


  useEffect(() => {
    getEmployyeApiData()
  }, [])



  return (
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
      <div className='full-table-container'>
        <div className='user-detail'>
          <div
            className='table-header'
          >
            <ProfileHeader
              user={
                {
                  name: "Chioma Yakubu",
                  data: "",
                  img: null,
                  initials: "CY"
                }
              }
            />
          </div>
          <div className='table-location'>
            <Icon
              className="icon location"
              color="#767676"
              icon="location"
              size="medium"
            />
            <h5>Nigeria</h5>
            <div
              onClick={() => setShowTable(!showTable)}
            >
              <Icon
                className="icon up"
                color="#526FD6"
                icon={
                  showTable === true ?
                    "chevronUp"
                    :
                    "chevronDown"
                }
                size="medium"
              />
            </div>
          </div>
        </div>
        {
          showTable &&
          <div className='table-container'>
            <Table
              options={{
                ...tableOptions,
                enableMultiSelect: true,
                isMultiSelectDisabled: true
              }}
              colSort
            />

          </div>
        }
      </div>

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
              handleAllSteppersData({} ,3)
            }}
          />
        </div>
      </div>
    </div>

  )
}

export default SelectEmployees