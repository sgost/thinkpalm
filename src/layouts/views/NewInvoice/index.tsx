import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BreadCrumb, Layouts, Progress, Button } from "atlasuikit";
import NewInvoiceCreation from "./NewInvoiceCreation";
import InvoicePreviewPop from "./InvoicePreviewPop"
import ProductInvoiceCreation from "./ProductInvoiceCreation"
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

  const [task, setTask] = useState("")
  const [todos, setTodos] = useState([{ id: Math.random(), date: "", product: productService, description: "", country: "", quantity: "", amount: "" }])
  //ProductIncoice Data
  const [dateFrom, setDateFrom] = useState("");
  //Set Product Service
  const [productService, setProductService] = useState("")
  //set Country
  const [countryService, setCountryService] = useState("")
  //Description
  const [description, setDescription] = useState("")
  //Quantity, Amount
  const [quantity, setQuantity] = useState("")
  const [amount, setAmount] = useState("")
  const [newArrPush, setNewArrPush] = useState([])
  const [Open, setOpen] = useState(false)
  const [newArrPushs, setNewArrPushs] = useState([])
  const [Opens, setOpens] = useState(false)


  //Product Stepper2 Data
  const product_stepper = {
    task,
    setTask,
    todos,
    setTodos,
    dateFrom,
    setDateFrom,
    countryService,
    setCountryService,
    productService,
    setProductService,
    description,
    setDescription,
    quantity,
    setQuantity,
    amount,
    setAmount,
    newArrPush,
    setNewArrPush,
    Open,
    setOpen,
    newArrPushs,
    setNewArrPushs,
    Opens,
    setOpens
  }

  console.log(dateFrom)
  console.log('product_stepper', product_stepper)
  ///////////////////////////
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
        healthcareBenefits: "USD 0.00",
      },
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
        total: "121,411.97",
      },
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
        total: "121,411.97",
      },
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

  const stepperThreeProps = {
    accessToken,
    newInvoiceEmployeeDetailTable,
    newInvoiceCountrySummaryTable,
    newInvoiceFeeSummaryOptions,
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
    setStepsCount(stepsCount + 1);
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
          console.log("resss", res);
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
                // <NewInvoiceCreation {...stepperOneProps} />
                <ProductInvoiceCreation {...product_stepper} />
              ) : stepsCount == 2 ? (
                stepperOneData?.type === "Payroll" ? <SelectEmployees {...stepperTwoProps} /> : <ProductInvoiceCreation {...product_stepper} />
              ) : stepsCount == 3 ? (
                stepperOneData?.type === "Payroll" ?
                  <PreviewInvoice {...stepperThreeProps} />
                  :
                  <InvoicePreviewPop {...stepperOneProps} {...product_stepper} />
              ) : stepsCount == 4 && stepperOneData?.type === "Payroll" ? (
                <FinishSTepper />
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
