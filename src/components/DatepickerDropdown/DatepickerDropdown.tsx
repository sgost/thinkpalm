import { Icon, DatePicker } from "atlasuikit";
import { format } from 'date-fns'
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
  setDateTo,
  setDateFrom,
  selectedDate,
  setSelectedDate
}: any) {

  const displayDate = () => {

    if (selectedDate.startDate && selectedDate.endDate) {
      return (
        `${selectedDate.startDate} - ${selectedDate.endDate}`
      )
    }
    else if (selectedDate.endDate) {
      return selectedDate.endDate
    }
    else if (selectedDate.startDate) {
      return selectedDate.startDate
    }
    else if (selectedDate.day) {
      return selectedDate.day
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
          <Icon icon="chevronDown" size="large" title="Order Summary" />
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
                const startFormatDate = format(e.startDate, "d MMM yyyy")
                setSelectedDate({ ...selectedDate, startDate: startFormatDate })
              }

              if (e.endDate) {
                const endDate = format(e.endDate, "yyyy-MM-dd")
                setDateTo(endDate)
                const endFormatDate = format(e.endDate, "d MMM yyyy")
                setSelectedDate({ ...selectedDate, endDate: endFormatDate })
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
                  setSelectedDate({ ...selectedDate, day: item })
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
