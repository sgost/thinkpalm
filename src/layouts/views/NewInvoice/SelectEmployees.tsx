import React, { useState } from 'react'
import { Checkbox, Button, ProfileHeader, Table, Icon } from 'atlasuikit'
import './SelectEmployees.scss'

const tableOptions: any = {
  columns: [
    {
      header: "Pay Item",
      isDefault: true,
      key: "payItem",
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
    {
      payItem: "Monthly Allowance",
      amount: "1300.00",
      currency: "USD",
      effectiveDate: "1 Aug 2022",
      endDate: "1 Aug 2023",
      scope: "AP",
      frequency: "Recurring"
    },
    {
      payItem: "Allowance",
      amount: "1300.00",
      currency: "USD",
      effectiveDate: "1 Apr 2022",
      endDate: "30 Apr 2022",
      scope: "AR, AP",
      frequency: "Single"
    }
  ],
}

const SelectEmployees = ({ handleSteps }: any) => {

  const [isAutoApprove, setIsAutoApprove] = useState(false);
  const [showTable, setShowTable] = useState(false)


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
      <Button
        type="button"
        handleOnClick={() => {

          handleSteps(1)
        }}
        className="secondary-btn medium"

        label="back"
      />
      <Button
        type="button"
        handleOnClick={() => {

          handleSteps(3)
        }}
        className="secondary-btn medium"

        label="next"
      />
    </div>

  )
}

export default SelectEmployees