import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BreadCrumb, Layouts, Progress, Button } from "atlasuikit";
import NewInvoiceCreation from "./NewInvoiceCreation";
import SelectEmployees from "./SelectEmployees";
import PreviewInvoice from "./PreviewInvoice"
import "./index.scss";
import FinishSTepper from "./FinishStepper";
import { tableSharedColumns } from "../../../sharedColumns/sharedColumns";
import { getDecodedToken } from "../../../components/getDecodedToken";
// import { getFlagPath } from "../InvoiceDetails/getFlag";
const NewInvoice = () => {
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("accessToken");
  const permission: any = getDecodedToken();

  const [stepsCount, setStepsCount] = useState(1);
  const [hideTopCheck, setHideTopCheck] = useState(true);

  const stepsName = [
    {
      key: "new-invoice",
      label: "New Invoice",
    },
    {
      key: "select-employees",
      label: "Select Employees",
    },
    {
      key: "invoice-preview",
      label: "Invoice Preview",
    },
    {
      key: "finish",
      label: "FINISH!",
    },
  ];

  // DropdownOptions
  const [CustomerOptions, setCustomerOption] = useState([]);

  const [typeOptions, setTypeOptions] = useState([
    tableSharedColumns.payroll,
    tableSharedColumns.proforma,
    tableSharedColumns.Miscellaneous,
    tableSharedColumns.createMemo,
  ]);

  const [CountryOptions, setCountryOptions] = useState([
    // {
    //   isSelected: false,
    //   label: "sdfgh",
    //   value: "swaesrdgtf",
    // }

  ]);

  const [MonthOptions, setMonthOptions] = useState([
    {
      isSelected: false,
      label: "January",
      value: "0",
    },
    {
      isSelected: false,
      label: "Feburary",
      value: "1",
    },
    {
      isSelected: false,
      label: "March",
      value: "2",
    },
    {
      isSelected: false,
      label: "April",
      value: "3",
    },
    {
      isSelected: false,
      label: "May",
      value: "4",
    },
    {
      isSelected: false,
      label: "June",
      value: "5",
    },
    {
      isSelected: false,
      label: "July",
      value: "6",
    },
    {
      isSelected: false,
      label: "August",
      value: "7",
    },
    {
      isSelected: false,
      label: "September",
      value: "8",
    },
    {
      isSelected: false,
      label: "October",
      value: "9",
    },
    {
      isSelected: false,
      label: "November",
      value: "10",
    },
    {
      isSelected: false,
      label: "December",
      value: "11",
    },
  ]);

  const [YearOptions, setYearOptions] = useState([
    {
      isSelected: false,
      label: "2019",
      value: "0",
    },
    {
      isSelected: false,
      label: "2020",
      value: "1",
    },
    {
      isSelected: false,
      label: "2021",
      value: "2",
    },
    {
      isSelected: false,
      label: "2022",
      value: "3",
    },
    {
      isSelected: false,
      label: "2023",
      value: "4",
    },
    {
      isSelected: false,
      label: "2024",
      value: "5",
    },
  ]);

  //stepper two TableOptions
  const [tableOptions, setTableOptions] = useState({
    columns: [
      {
        header: "Pay Item ID",
        isDefault: true,
        key: "payItemId",
        // key: "payItem",
      },
      {
        header: "Amount",
        isDefault: true,
        key: "amount",
      },
      tableSharedColumns.currency
      ,
      {
        header: "Effective Date",
        isDefault: true,
        key: "effectiveDate",
      },
      // {
      //   header: "End Date",
      //   isDefault: true,
      //   key: "endDate",
      // },
      {
        header: "finItemType",
        isDefault: true,
        // key: "scope",
        key: "finItemType",
      },
      {
        header: "Frequency ID",
        isDefault: true,
        key: "payItemFrequencyId",
        // key: "frequency",
      },
    ],
    data: [],
  });
  const [tableOptionsForNoData] = useState({
    columns: [],
    data: [],
  });

  //stepper Three TableOptions 
  const newInvoiceEmployeeDetailTable: any = {
    columns: [
      tableSharedColumns.employeeID,
      tableSharedColumns.name,
      tableSharedColumns.grossWages,
      tableSharedColumns.allowances,
      tableSharedColumns.expenseReimb,
      tableSharedColumns.employerLiability,
      tableSharedColumns.countryVAT,
      tableSharedColumns.adminFees,
      tableSharedColumns.healthcareBenefits
    ],
    data: [
      {
        employeeID: "73917",
        name: "Camila Lopez",
        grossWages: "USD 20,000.00",
        allowances: "USD 200.00",
        expenseReimb: "USD 400.00",
        employerLiability: "USD 7,210.00",
        countryVAT: "0.63",
        adminFees: "USD 650.00",
        healthcareBenefits: "USD 0.00"
      }
    ],
    showDefaultColumn: true,
  };

  const newInvoiceCountrySummaryTable: any = {
    columns: [
      tableSharedColumns.country,
      tableSharedColumns.currency,
      tableSharedColumns.employees,
      tableSharedColumns.grossWages,
      tableSharedColumns.allowances,
      tableSharedColumns.expenseReimb,
      tableSharedColumns.employerLiability,
      tableSharedColumns.countryVAT,
      tableSharedColumns.exchangeRate,
      tableSharedColumns.total
    ],
    data: [
      {
        country: {
          value: "Spain",
          // img: { src: getFlagPath("ES") },
        },
        currency: "EUR",
        employees: "14",
        grossWages: "95,000",
        allowances: "13,690",
        expenseReimb: "950.00",
        employerLiability: "2,000.00",
        countryVAT: "0.00",
        exchangeRate: "0.75355",
        total: "121,411.97"
      }
    ],
    showDefaultColumn: true,
  }

  const newInvoiceFeeSummaryOptions: any = {
    columns: [
      tableSharedColumns.country,
      tableSharedColumns.currency,
      tableSharedColumns.adminFees,
      tableSharedColumns.OnOffboardings,
      tableSharedColumns.fxRate,
      tableSharedColumns.fxBill,
      tableSharedColumns.benefits,
      tableSharedColumns.employeeContribution,
      tableSharedColumns.total
    ],
    data: [
      {
        country: {
          value: "Spain",
          // img: { src: getFlagPath("ES") },
        },
        currency: "EUR",
        adminFees: "3.900.00",
        OnOffboardings: "0.00",
        fxRate: "1,5",
        fxBill: "95,000.00",
        benefits: "3,780.00",
        employeeContribution: "0.00",
        total: "121,411.97"
      }
    ],
    showDefaultColumn: true,
  }

  //stepper one  Data 
  const [stepperOneData, setStepperOneData] = useState(
    {
      customer: "",
      type: "",
      country: "",
      month: "",
      year: "",
      customerId: "",
      countryId: "",
      typeId: "",
    }
  );

  //stepper Two Row Data 
  const [employeeRowData, setEmployeeRowData] = useState<any>({});

  // steppers one Props 
  const stepperOneProps = {
    accessToken,
    stepperOneData,
    setStepperOneData,
    YearOptions,
    setYearOptions,
    MonthOptions,
    setMonthOptions,
    CountryOptions,
    setCountryOptions,
    CustomerOptions,
    setCustomerOption,
    typeOptions,
    setTypeOptions
  }
  //stepper two props 
  const stepperTwoProps = {

    accessToken,
    setTableOptions,
    tableOptions,
    tableOptionsForNoData,
    stepperOneData,
    setEmployeeRowData,
    employeeRowData
  }

  const stepperThreeProps = {
    accessToken,
    newInvoiceEmployeeDetailTable,
    newInvoiceCountrySummaryTable,
    newInvoiceFeeSummaryOptions
  }

  const disableFunForStepOne = () => {
    if (stepsCount == 1) {
      return !(
        stepperOneData?.customer !== "" &&
        stepperOneData?.type !== "" &&
        stepperOneData?.country !== "" &&
        stepperOneData?.year !== "" &&
        stepperOneData?.month !== ""
      )
    }
  }

  useEffect(() => {
    if (!hideTopCheck) {
      navigate("/pay");
    }
  }, [hideTopCheck]);

  return (
    <div className="newinvoice-container">
      <div className="breadcrumbs">
        <BreadCrumb
          hideHeaderTitle={hideTopCheck}
          hideHeaderTabs={hideTopCheck}
          steps={[
            {
              isActive: true,
              key: "Invoices",
              label: "Invoices",
              onClickLabel: () => {
                setHideTopCheck(false);
              },
            },
            {
              key: "profile",
              label: "New Invoice",
            },
          ]}
        />
      </div>
      <div className="detail-container">
        <Layouts
          config={{
            leftPanelConfig: {
              className: "",
              style: {},
            },
            rightPanelConfig: {
              className:
                stepsCount === 1
                  ? ""
                  : stepsCount === 2
                    ? "step2-right-panel"
                    : "",
            },
          }}
          leftPanel={
            <Progress
              currentStep={stepsCount}
              steps={stepsName}
              type="step-progress"
            />
          }
          type="sidebar-inner-container"
          rightPanel={
            <>
              {stepsCount == 1 ? (
                <NewInvoiceCreation
                  {...stepperOneProps}

                />
              ) : stepsCount == 2 ? (
                <SelectEmployees
                  {...stepperTwoProps}
                />
              ) : stepsCount == 3 ? (
                <PreviewInvoice
                  {...stepperThreeProps}
                />
              ) : stepsCount == 4 ? (
                <FinishSTepper
                />
              ) : (
                <></>
              )}
            </>
          }
        />
      </div>

      <div className={stepsCount === 1 ? "Stepper-buttons" : "stepper-two-buttons"}>
        {stepsCount != 1 &&
          <Button
            data-testid="back-button"
            icon={{
              icon: "chevronLeft",
              size: "medium",
              color: "#fff",
            }}
            handleOnClick={() => {
              setStepsCount(stepsCount - 1);
            }}
            className="primary-blue medium previous-button"
            label="Previous"
          />
        }
        {stepsCount != 4 &&
          <Button
            disabled={disableFunForStepOne()}
            data-testid="next-button"
            icon={{
              icon: "chevronRight",
              size: "medium",
              color: "#fff",
            }}
            label="Next"
            className="primary-blue medium button next-button"
            handleOnClick={() => {
              setStepsCount(stepsCount + 1);

            }}
          />
        }
      </div>
    </div>
  );
};

export default NewInvoice;
