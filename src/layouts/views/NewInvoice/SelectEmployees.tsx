import React, { useState, useEffect } from "react";
import { Checkbox, Button, ProfileHeader, Table, Icon } from "atlasuikit";
import axios from "axios";
import "./SelectEmployees.scss";
import { getEmployee, getHeaders } from "../../../urls/urls";
import { format } from "date-fns";
import { Loader } from "../../../components/Comman/Utils/utils";

const SelectEmployees = ({
  accessToken,
  setTableOptions,
  tableOptions,
  tableOptionsForNoData,
  stepperOneData,
  setEmployeeRowData,
  employeeRowData,
  employeeApiData,
  setEmployeeApiData,
  setSelectedRowPostData,
  loading,
  setLoading,
}: any) => {
  const [cssForData, setCssForData] = useState(false);
  const [isPayrollItemsChecked, setIsPayrollItemsChecked] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [showNoEmployeeText, setShowNoEmployeeText] = useState('');

  const getEmployyeApiData = () => {
    const headers = {
      headers: getHeaders(accessToken, stepperOneData?.customerId, "false"),
    };

    const apiUrl = getEmployee(
      stepperOneData?.customerId,
      stepperOneData?.countryId,
      stepperOneData?.monthId,
      stepperOneData?.yearId
    );


    setLoading(true);

    axios
      .get(apiUrl, headers)
      .then((res: any) => {
        if (res.status === 200) {
          setEmployeeApiData(res.data);
          setCssForData(true);
          setLoading(false);
        }
      })
      .catch((e: any) => {
        if (e.response.data.includes('No Employees found under this customer')) {
          setLoading(false);
          setShowNoEmployeeText('No Employees found under this customer');
        } else {
          setLoading(false)
          setShowNoEmployeeText("An error occurred while fetching employees for this customer")
        }
      });
  };

  useEffect(() => {
    getEmployyeApiData();
  }, []);

  const onRowCheckboxChange = (selectedRows: any) => {
    setSelectedRowPostData(selectedRows);
  };

  const preparedTableData = (item: any, check: any) => {
    let employeeTableData: any = [];
    item?.employeeDetail?.compensation?.payItems?.forEach(
      (CompensationItems: any) => {
        if (check == true) {
          if (CompensationItems.isInvoiced != true) {
            employeeTableData.push({
              ...CompensationItems,
              payItemName: CompensationItems.payItemName || "",
              amount: CompensationItems?.amount || "",
              currencyCode: CompensationItems?.currencyCode || "",
              effectiveDate: CompensationItems?.effectiveDate
                ? format(
                    new Date(CompensationItems?.effectiveDate),
                    "d MMM yyyy"
                  )
                : "",
              endDate: CompensationItems?.endDate
                ? format(new Date(CompensationItems?.endDate), "d MMM yyyy")
                : "",
              scopesName: CompensationItems?.scopesName || "",
              payItemFrequencyName:
                CompensationItems?.payItemFrequencyName || "",
              id: CompensationItems?.payItemId,
            });
          }
          setTableOptions({ ...tableOptions, data: employeeTableData });
        }
        if (check == false) {
          employeeTableData.push({
            ...CompensationItems,
            payItemName: CompensationItems.payItemName || "",
            amount: CompensationItems?.amount || "",
            currencyCode: CompensationItems?.currencyCode || "",
            effectiveDate: CompensationItems?.effectiveDate
              ? format(new Date(CompensationItems?.effectiveDate), "d MMM yyyy")
              : "",
            endDate: CompensationItems?.endDate
              ? format(new Date(CompensationItems?.endDate), "d MMM yyyy")
              : "",
            scopesName: CompensationItems?.scopesName || "",
            payItemFrequencyName: CompensationItems?.payItemFrequencyName || "",
            id: CompensationItems?.payItemId,
          });

          setTableOptions({ ...tableOptions, data: employeeTableData });
        }
      }
    );
  };

  const onRowIconClick = (item: any) => {
    setShowTable(!showTable);
    setEmployeeRowData(item);
    if (!isPayrollItemsChecked) {
      preparedTableData(item, true);
    }
    if (isPayrollItemsChecked) {
      preparedTableData(item, false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : showNoEmployeeText ? (
        <h3>{showNoEmployeeText}</h3>
      ) : (
        <div className="select-employee-container">
          <div className="employee-header">
            <div>
              <h3>Select Employees</h3>
            </div>
            <div className="employee-checkbox">
              <Checkbox
                checked={isPayrollItemsChecked}
                onChange={(e: any) => {
                  setIsPayrollItemsChecked(e.target.checked);
                  if (e.target.checked === true) {
                    preparedTableData(employeeRowData, false);
                  }
                  if (e.target.checked === false) {
                    preparedTableData(employeeRowData, true);
                  }
                }}
                label="Show Billed Payroll Items"
              />
            </div>
          </div>
          <div className={cssForData ? "" : "full-table-container"}>
            {employeeApiData && employeeApiData.length ? (
              employeeApiData.map((item: any, key: any) => {
                return (
                  <div
                    className={
                      cssForData ? "full-table-container-after-data" : ""
                    }
                  >
                    <div className="user-detail">
                      <div className="table-header">
                        <ProfileHeader
                          user={{
                            name: `${item?.employeeDetail?.personalDetails?.firstName} ${item?.employeeDetail?.personalDetails?.lastName}`,
                            data: "",
                            img: item?.employeeDetail?.personalDetails
                              ?.photoUrl,
                            // initials: "CY"
                          }}
                        />
                      </div>
                      <div className="table-location">
                        <div className="table-icon-location d-flax">
                          <Icon
                            className="icon location"
                            color="#767676"
                            icon="location"
                            size="medium"
                          />

                          <h5>
                            {
                              item?.employeeDetail?.personalDetails?.homeAddress
                                ?.country
                            }
                          </h5>
                        </div>
                        <div
                          className="table-up-down"
                          data-testid="showHide-button"
                          onClick={() => {
                            onRowIconClick(item);
                          }}
                        >
                          {item?.employeeDetail?.compensation?.payItems
                            ?.length ? (
                            <Icon
                              className="icon up"
                              color="#526FD6"
                              icon={
                                showTable === true &&
                                employeeRowData?.employeeDetail?.employeeID ===
                                  item?.employeeDetail?.employeeID
                                  ? "chevronUp"
                                  : "chevronDown"
                              }
                              size="medium"
                            />
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    </div>
                    {showTable &&
                      employeeRowData?.employeeDetail?.employeeID ===
                        item?.employeeDetail?.employeeID && (
                        <div className="table-container">
                          <Table
                            options={
                              employeeRowData?.employeeDetail?.compensation
                                ?.payItems?.length
                                ? {
                                    ...tableOptions,
                                    enableMultiSelect: true,
                                    disableRowCheckbox: {
                                      key: "isInvoiced",
                                      value: true,
                                    },
                                    isMultiSelectDisabled: true,
                                    onRowCheckboxChange: onRowCheckboxChange,
                                  }
                                : {
                                    ...tableOptionsForNoData,
                                    enableMultiSelect: true,
                                    isMultiSelectDisabled: true,
                                  }
                            }
                            colSort
                          />
                        </div>
                      )}
                  </div>
                );
              })
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SelectEmployees;
