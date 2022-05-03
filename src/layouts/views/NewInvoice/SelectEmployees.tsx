import React from 'react'
import { Checkbox, Button, ProfileHeader, Table, Icon } from 'atlasuikit'
import './SelectEmployees.scss'

const tableOptions: any = []


const SelectEmployees = ({ handleSteps }: any) => {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: 'space-around' }}>
        <div>
          <h3>SelectEmployees</h3>
        </div>
        <div>
          <Checkbox
            checked
            onChange={function noRefCheck() { }}
            label="Show Billed Payroll Items"
          />
        </div>
      </div>
      <div style={{backgroundColor: 'blue', display: 'flex'}}>
        <div 
        // style={{backgroundColor: 'red'}}
        >
          <ProfileHeader
            user={
              {
                name: "Chioma Yakubu",
                data: "USA",
                img: null,
                initials: "CY"
              }
            }
          />
        </div>
        <div style={{ display: "flex", justifyContent: 'space-between', backgroundColor: 'red', }}>
        <Icon
              className="icon"
              color="#000"
              icon="location"
              size="medium"
            />
            <h5>Nigeria</h5>
            <Icon
              className="icon"
              color="#000"
              icon="chevronUp"
              size="medium"
            />
        </div>
      </div>
      <div>
      <Table
        options={{
            ...tableOptions,
            enableMultiSelect: true,
            onRowCheckboxChange: (selectedRows: any) => {
                console.log(selectedRows);
            },
            disableRowCheckbox: { key: 'contractor_id', value: 'C451515321' },
            isMultiSelectDisabled: true
        }}
        colSort
    />

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