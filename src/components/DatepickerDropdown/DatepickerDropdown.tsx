import React, { useEffect, useState } from "react";
import { Icon, DatePicker } from "atlasuikit";
import "./DatepickerDropdown.scss";

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
}: Iprops) {
  const [selected, setSelected] = useState(null);
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
        <p className="text">{selected ? selected : "Please Select"}</p>
        <div className="icon">
          <Icon icon="chevronDown" size="small" title="Order Summary" />
        </div>
      </div>

      {isOpen && (
        <div className="openDropdownDatepicker">
          <DatePicker
            id="dp"
            handleDateChange={function noRefCheck() {}}
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
                onClick={() => handleDropOptionClick(item)}
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
