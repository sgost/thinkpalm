import { Icon, DatePicker } from "atlasuikit";
import { format } from "date-fns";
import { useEffect, useRef } from "react";
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
  setIsOpen,
  handleDropdownClick,
  handleDropOptionClick,
  setDateTo,
  setDateFrom,
  selectedDate,
  setSelectedDate,
}: any) {
  const displayDate = () => {
    if (selectedDate.startDate && selectedDate.endDate) {
      return `${selectedDate.startDate} - ${selectedDate.endDate}`;
    } else if (selectedDate.endDate) {
      return selectedDate.endDate;
    } else if (selectedDate.startDate) {
      return selectedDate.startDate;
    } else if (selectedDate.day) {
      return selectedDate.day;
    } else {
      return "Please Select";
    }
  };

  const options = [
    "Today",
    "Yesterday",
    "This Week",
    "This Month",
    "This Quarter",
    "This Year",
  ];

  const wrapperRef = useRef();
  useEffect(() => {
    options.forEach((e) => {
      if (e.isSelected) {
        setSelected(e.label);
      }
    });
  }, [options]);

  const HandleOutSideClick = (ref: any) => {
    useEffect(() => {
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          setIsOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  };
  HandleOutSideClick(wrapperRef);

  return (
    <div ref={wrapperRef} data-testid="datedd" className="dropdownContainer">
      <span className="title">{title}</span>
      <div onClick={() => handleDropdownClick()} className="dropdown">
        <span className="text"> {displayDate()}</span>
        <div className="icon">
          {isOpen ? (
            <Icon
              icon="chevronUp"
              size="large"
              width="40"
              height="40"
              color="#3E3E3E"
            />
          ) : (
            <Icon
              icon="chevronDown"
              size="large"
              width="40"
              height="40"
              color="#3E3E3E"
            />
          )}
        </div>
      </div>

      <div className="openDropdownDatepickerWithRangeContainer">
        {isOpen && (
          <div className="openDropdownDatepickerWithRange">
            <DatePicker
              id="dp"
              handleDateChange={function noRefCheck(e: any) {
                if (e.startDate) {
                  const startDate = format(e.startDate, "yyyy-MM-dd");
                  setDateFrom(startDate);
                  const startFormatDate = format(e.startDate, "d MMM yyyy");
                  setSelectedDate({
                    ...selectedDate,
                    startDate: startFormatDate,
                  });
                }

                if (e.endDate) {
                  const endDate = format(e.endDate, "yyyy-MM-dd");
                  setDateTo(endDate);
                  const endFormatDate = format(e.endDate, "d MMM yyyy");
                  setSelectedDate({ ...selectedDate, endDate: endFormatDate });
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
                    setSelectedDate({ ...selectedDate, day: item });
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
    </div>
  );
}
