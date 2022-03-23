import React, { useEffect, useState } from "react";
import { Icon } from "atlasuikit";
import "./Dropdown.scss";

interface Iprops {
  title: string;
  isOpen: boolean;
  handleDropdownClick: Function;
  handleDropOptionClick: Function;
  options: Array<any>;
  setSelectedDropdown: any;
  dropdownLabel: any;
}

export default function Dropdown({
  title,
  isOpen,
  handleDropdownClick,
  handleDropOptionClick,
  options,
  setSelectedDropdown,
  dropdownLabel
}: Iprops) {

  useEffect(() => {
    options.forEach((e) => {
      if (e.isSelected) {
        setSelectedDropdown(e.label);
      }
    });
  }, [options]);

  const dropdownLabelFunc = () => {
    if (title === 'Types' && dropdownLabel.types !== ''){
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
          <Icon icon="chevronDown" size="small" title="Order Summary" />
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
                    <Icon icon="checkMark" size="small" title="Order Summary" />
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
