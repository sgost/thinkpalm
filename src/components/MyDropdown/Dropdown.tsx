import React, { useEffect, useState } from "react";
import { Icon } from "atlasuikit";
import "./Dropdown.scss";

interface Iprops {
  title: string;
  isOpen: boolean;
  handleDropdownClick: Function;
  handleDropOptionClick: Function;
  options: Array<any>;
  selectedDropdown: any;
  setSelectedDropdown: any
}

export default function Dropdown({
  title,
  isOpen,
  handleDropdownClick,
  handleDropOptionClick,
  options,
  selectedDropdown,
  setSelectedDropdown
}: Iprops) {

  useEffect(() => {
    options.forEach((e) => {
      if (e.isSelected) {
        setSelectedDropdown(e.label);
      }
    });
  }, [options]);

  return (
    <div onClick={() => handleDropdownClick()} className="dropdownContainer">
      <span className="title">{title}</span>
      <div className="dropdown">
        <p className="text">{selectedDropdown ? selectedDropdown : "Please Select"}</p>
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
