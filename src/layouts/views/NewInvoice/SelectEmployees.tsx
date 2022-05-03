import React from 'react'
import { DatePicker, Button, ProfileHeader, Dropdown } from 'atlasuikit'
const SelectEmployees = ({handleSteps} :any) => {
  return (
    <>
    <div>SelectEmployees</div>
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
    </>
    
  )
}

export default SelectEmployees