import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BreadCrumb, Layouts, Progress, Button } from "atlasuikit";
import NewInvoiceCreation from "./NewInvoiceCreation";
import SelectEmployees from "./SelectEmployees";
import PreviewInvoice from "./PreviewInvoice";
import "./index.scss";
import FinishCreditMemo from "./FinishCreditMemo";
import FinishSTepper from "./FinishStepper";
import {
  tableSharedColumns,
  monthNameOptions,
} from "../../../sharedColumns/sharedColumns";
import { getDecodedToken } from "../../../components/getDecodedToken";
import axios from "axios";
import { createManualInvoice, getHeaders } from "../../../urls/urls";
import { sharedSteps } from "../../../sharedColumns/sharedSteps";
// import { getFlagPath } from "../InvoiceDetails/getFlag";
const NewInvoice = () => {
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("accessToken");
  const permission: any = getDecodedToken();

  const [stepsCount, setStepsCount] = useState(1);
  const [hideTopCheck, setHideTopCheck] = useState(true);
  //steps for payroll
  const stepsName = [
    sharedSteps.newInvoice,
    sharedSteps.selectEmployees,
    sharedSteps.invoicePreview,
    sharedSteps.finish,
  ];

  //credit memo steps
  const creditMemoSteps = [
    sharedSteps.newInvoice,
    {
      key: "productService",
      label: "Product Service",
    },
    sharedSteps.invoicePreview,
    sharedSteps.finish,
  ];
  // initial steps
  const stepsInitial = [
    sharedSteps.newInvoice,
    sharedSteps.initial2,
    sharedSteps.initial2,
    sharedSteps.initial2,
  ];

  // payroll DropdownOptions
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
    monthNameOptions.january,
    monthNameOptions.feburary,
    monthNameOptions.march,
    monthNameOptions.april,
    monthNameOptions.may,
    monthNameOptions.june,
    monthNameOptions.july,
    monthNameOptions.august,
    monthNameOptions.september,
    monthNameOptions.october,
    monthNameOptions.november,
    monthNameOptions.december,
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

  //stepper two payroll TableOptions
  const [tableOptions, setTableOptions] = useState({
    columns: [
      {
        header: "Pay Item",
        isDefault: true,
        key: "payItemName",
      },
      {
        header: "Amount",
        isDefault: true,
        key: "amount",
      },
      tableSharedColumns.currencyCode,
      {
        header: "Effective Date",
        isDefault: true,
        key: "effectiveDate",
      },
      {
        header: "End Date",
        isDefault: true,
        key: "endDate",
      },
      {
        header: "Scope",
        isDefault: true,
        key: "scopesName",
      },
      {
        header: "Frequency",
        isDefault: true,
        key: "payItemFrequencyName",
      },
    ],
    data: [],
  });
  const [tableOptionsForNoData] = useState({
    columns: [],
    data: [],
  });

  //stepper Three payroll TableOptions
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
      tableSharedColumns.healthcareBenefits,
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
      tableSharedColumns.total,
    ],
    showDefaultColumn: true,
  };

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
      tableSharedColumns.total,
    ],
    showDefaultColumn: true,
  };

  //stepper one  Data
  const [stepperOneData, setStepperOneData] = useState({
    customer: "",
    type: "",
    country: "",
    month: "",
    year: "",
    customerId: "",
    countryId: "",
    typeId: "",
    yearId: "",
    monthId: "",
  });

  //stepper Two payroll Row Data
  const [employeeRowData, setEmployeeRowData] = useState<any>({});
  const [employeeApiData, setEmployeeApiData] = useState([]);
  const [selectedRowPostData, setSelectedRowPostData] = useState<any>({});
  const [CreateManualPayrollRes, setCreateManualPayrollRes] = useState({})

  // stepper three data
  const [transactionType, setTransactionType] = useState();

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
    setTypeOptions,
  };
  //stepper two payroll props
  const stepperTwoProps = {
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
  };

   //stepper three payroll props
  const stepperThreeProps = {
    accessToken,
    newInvoiceEmployeeDetailTable,
    newInvoiceCountrySummaryTable,
    newInvoiceFeeSummaryOptions,
    CreateManualPayrollRes,
    stepperOneData,
    setTransactionType
  };

   //stepper four payroll props
  const stepperFourProps = {
    CreateManualPayrollRes,
    stepperOneData,
    transactionType
  };

  const disableFunForStepOnePayroll = () => {
    if (stepsCount == 1) {
      return !(
        stepperOneData?.customer !== "" &&
        stepperOneData?.type !== "" &&
        stepperOneData?.country !== "" &&
        stepperOneData?.year !== "" &&
        stepperOneData?.month !== ""
      );
    }
    if (stepsCount == 2 && stepperOneData.type === "Payroll") {
      return selectedRowPostData?.length > 0 ? false : true;
    }
  };

  const disableFunForStepOneCreditMemo = () => {
    if (stepsCount == 1) {
      return !(
        stepperOneData?.customer !== "" &&
        stepperOneData?.type !== "" &&
        // stepperOneData?.country !== "" &&
        stepperOneData?.year !== "" &&
        stepperOneData?.month !== ""
      );
    }
    if (stepsCount == 2 && stepperOneData.type === "Payroll") {
      return selectedRowPostData?.length > 0 ? false : true;
    }
  };

  const handleNextButtonClick = () => {
    if (stepsCount != 2) {
      setStepsCount(stepsCount + 1);
    }
    if (stepsCount == 2 && stepperOneData.type == "Payroll") {
      const PrepareData = employeeRowData;
      PrepareData.employeeDetail.compensation.payItems = selectedRowPostData;
      const data = {
        customerId: stepperOneData?.customerId,
        userId: stepperOneData?.customerId,
        transactionType: 1,
        calendarTypeId: 0,
        countryId: stepperOneData?.countryId,
        month: stepperOneData?.monthId,
        year: stepperOneData?.yearId,
        employeeDetail: {
          employees: [PrepareData.employeeDetail],
        },
      };
      axios({
        method: "POST",
        url: createManualInvoice(),
        headers: getHeaders(accessToken, stepperOneData?.customerId, "false"),
        data: data,
      })
        .then((res: any) => {
          if (res.data) {
            setCreateManualPayrollRes(res.data)
            setStepsCount(stepsCount + 1);
          }
        })
        .catch((e: any) => {
          console.log(e);
        });
    }
  };

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
              steps={
                stepperOneData?.type === "Payroll"
                  ? stepsName
                  : stepperOneData?.type === "Credit Memo"
                    ? creditMemoSteps
                    : stepsInitial
              }
              type="step-progress"
            />
          }
          type="sidebar-inner-container"
          rightPanel={
            <>
              {stepsCount == 1 ? (
                <NewInvoiceCreation {...stepperOneProps} />
              ) : stepsCount == 2 ? (
                <SelectEmployees {...stepperTwoProps} />
              ) : stepsCount == 3 ? (
                <PreviewInvoice {...stepperThreeProps} />
              ) : stepsCount == 4 && stepperOneData?.type === "Payroll" ? (
                <FinishSTepper {...stepperFourProps} />
              ) : (
                <></>
              )}
              {stepsCount === 4 && stepperOneData?.type === "Credit Memo" && (
                <FinishCreditMemo />
              )}
            </>
          }
        />
      </div>

      <div
        className={stepsCount === 1 ? "Stepper-buttons" : "stepper-two-buttons"}
      >
        {stepsCount != 1 && (
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
        )}
        {stepsCount != 4 && (
          <Button
            disabled={
              stepperOneData?.type === "Payroll"
                ? disableFunForStepOnePayroll()
                : stepperOneData?.type === "Credit Memo"
                  ? disableFunForStepOneCreditMemo()
                  : true
            }
            data-testid="next-button"
            icon={{
              icon: "chevronRight",
              size: "medium",
              color: "#fff",
            }}
            label="Next"
            className="primary-blue medium button next-button"
            handleOnClick={() => {
              handleNextButtonClick();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default NewInvoice;
