import React, { useEffect, useState } from "react";
import { Icon, DatePicker } from "atlasuikit";
import "./DatepickerDropdown.scss";
import { format } from 'date-fns'

interface Iprops {
  title: string;
  isOpen: boolean;
  handleDropdownClick: Function;
  handleDropOptionClick: Function;
}

export default function DatepickerDropdown({
  title,
  isOpen,
  handleDropdownClick,
  handleDropOptionClick,
  setDateTo,
  setDateFrom
}: any) {

  const [selected, setSelected] = useState({
    startDate: '',
    endDate: '',
    day: ''
  });

  const displayDate = () => {
    if (selected.startDate && selected.endDate) {
      return `${selected.startDate} to ${selected.endDate}`
    }
    else if (selected.endDate) {
      return selected.endDate
    }
    else if (selected.startDate) {
      return selected.startDate
    }
    else if (selected.day) {
      return selected.day
    }
    else {
      return 'Please Select'
    }
  }


  const options = [
    "Today",
    "Yesterday",
    "This Week",
    "This Month",
    "This Quarter",
    "This Year",
  ];

  // useEffect(() => {
  //   options.forEach((e) => {
  //     if (e.isSelected) {
  //       setSelected(e.label);
  //     }
  //   });
  // }, [options]);

  return (
    <div data-testid="datedd" className="dropdownContainer">
      <span className="title">{title}</span>
      <div onClick={() => handleDropdownClick()} className="dropdown">
        {displayDate()}
        <div className="icon">
          <Icon icon="chevronDown" size="small" title="Order Summary" />
        </div>
      </div>

      {isOpen && (
        <div className="openDropdownDatepicker">
          <DatePicker
            id="dp"
            handleDateChange={function noRefCheck(e: any) {
              if (e.startDate) {
                const startDate = format(e.startDate, "yyyy-MM-dd")
                setDateFrom(startDate)
                setSelected({ ...selected, startDate: startDate })
              }

              if (e.endDate) {
                const endDate = format(e.endDate, "yyyy-MM-dd")
                setDateTo(endDate)
                setSelected({ ...selected, endDate: endDate })
              }
            }}
            // label="Start Date"
            required
            range
          />
          {/* <DatePicker
            handleDateChange={function noRefCheck() {}}
            label="End Date"
            required
            range
          /> */}
          {options.map((item) => {
            return (
              <div
                onClick={() => {
                  handleDropOptionClick(item);
                  setSelected({ ...selected, day: item })
                }}
                className="openDropdownOption"
              >
                <span className="text">{item}</span>

                {/* {item.isSelected && (
                  <div className="icon">
                    <Icon icon="checkMark" size="small" title="Order Summary" />
                  </div>
                )} */}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
