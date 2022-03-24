import React, { useEffect } from "react";
import { Icon } from "atlasuikit";
import "./Dropdown.scss";

interface Iprops {
  title: string;
  isOpen: boolean;
  handleDropdownClick: Function;
  handleDropOptionClick: Function;
  options: Array<any>;
  dropdownLabel: any;
}

export default function Dropdown({
  title,
  isOpen,
  handleDropdownClick,
  handleDropOptionClick,
  options,
  dropdownLabel
}: Iprops) {

  const dropdownLabelFunc = () => {
    if (title === 'Type' && dropdownLabel.types !== ''){
      return dropdownLabel.types;
    }
    if(title === 'Status' && dropdownLabel.status !== '') {
      return dropdownLabel.status;
    }
    return 'Please Select'
  }

  return (
    <div onClick={() => handleDropdownClick()} className="dropdownContainer">
      <span className="title">{title}</span>
      <div className="dropdown">
        {dropdownLabelFunc()}
        <div className="icon">
          <Icon icon="chevronDown" size="large" title="Order Summary" />
        </div>
      </div>

      {isOpen && (
        <div className="openDropdown">
          {options.map((item) => {
            return (
              <div
                onClick={() => handleDropOptionClick(item)}
                className="openDropdownOption"
              >
                <span className="text">{item.label}</span>

                {item.isSelected && (
                  <div className="icon">
                    <Icon icon="checkMark" size="large" title="Order Summary" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
