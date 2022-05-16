import React, { useState, useEffect } from "react";
import { Checkbox, Button, ProfileHeader, Table, Icon } from "atlasuikit";
import axios from "axios";
import "./SelectEmployees.scss";
import { getEmployee, getHeaders } from "../../../urls/urls";
import { tableSharedColumns } from "../../../sharedColumns/sharedColumns";
import { getDecodedToken } from "../../../components/getDecodedToken";

const SelectEmployees = ({
  accessToken,
  setTableOptions,
  tableOptions,
  tableOptionsForNoData,
  stepperOneData,
  setEmployeeRowData,
  employeeRowData
}: any) => {



  const [cssForData, setCssForData] = useState(false);

  


  const [isAutoApprove, setIsAutoApprove] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [employeeApiData, setEmployeeApiData] = useState([]);


  const getEmployyeApiData = () => {

    const headers = {
      headers: getHeaders(
        accessToken,
        stepperOneData?.customerId,
        "false"
      ),
    };

    const apiUrl = getEmployee(
      stepperOneData?.customerId,
      stepperOneData?.countryId
    );
    axios
      .get(apiUrl, headers)
      .then((res: any) => {
        if (res.status === 200) {
          let employeeTableData: any = [];
          res?.data?.forEach((item: any) => {
            item?.employeeDetail?.compensation?.payItems?.forEach(
              (CompensationItems: any) => {
                employeeTableData.push({
                  payItemId: CompensationItems?.payItemId,
                  amount: CompensationItems?.amount,
                  currency: CompensationItems?.currency,
                  effectiveDate: CompensationItems?.effectiveDate,
                  //getting null in one object
                  // endDate: CompensationItems?.endDate,
                  finItemType: CompensationItems?.finItemType,
                  payItemFrequencyId: CompensationItems?.payItemFrequencyId,
                });
              }
            );
          });
          setEmployeeApiData(res.data);
          setTableOptions({ ...tableOptions, data: employeeTableData });
          setCssForData(true);
        }
      })
      .catch((e: any) => {
        console.log("error", e);
      });
  };

  useEffect(() => {
    getEmployyeApiData();
  }, []);

  const onRowCheckboxChange = (selectedRows: any) => {
    // alert(selectedRows)
  };

  return (
    <>
      <div className="select-employee-container">
        <div className="employee-header">
          <div>
            <h3>Select Employees</h3>
          </div>
          <div className="employee-checkbox">
            <Checkbox
              checked={isAutoApprove}
              onChange={(e: any) => {
                setIsAutoApprove(e.target.checked);
              }}
              label="Show Billed Payroll Items"
            />
          </div>
        </div>
        <div className={cssForData ? "" : "full-table-container"}>
          {employeeApiData && employeeApiData.length ? (
            employeeApiData.map((item: any, key: any) => {
              return (
                <div className={cssForData ? "full-table-container-after-data" : ""}>
                  <div className="user-detail">
                    <div className="table-header">
                      <ProfileHeader
                        user={{
                          name: `${item?.employeeDetail?.personalDetails?.firstName} ${item?.employeeDetail?.personalDetails?.lastName}`,
                          data: "",
                          img: item?.employeeDetail?.personalDetails?.photoUrl,
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
                          setShowTable(!showTable);
                          setEmployeeRowData(item);
                        }}
                      >
                        {item?.employeeDetail?.compensation?.payItems?.length ? (
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
                          ""
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
    </>
  );
};

export default SelectEmployees;
