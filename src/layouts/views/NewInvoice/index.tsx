import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BreadCrumb, Layouts, Progress, Button } from "atlasuikit";
import NewInvoiceCreation from "./NewInvoiceCreation";
import InvoicePreviewPop from "./InvoicePreviewPop";
import ProductInvoiceCreation from "./ProductInvoiceCreation";
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
import {
  createManualInvoice,
  getHeaders,
  updateInvoiceStatus,
  urls,
} from "../../../urls/urls";
import { sharedSteps } from "../../../sharedColumns/sharedSteps";
// import { getFlagPath } from "../InvoiceDetails/getFlag";
const NewInvoice = () => {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([
    {
      id: Math.random(),
      date: "",
      product: "",
      description: "",
      country: "",
      quantity: "",
      amount: "",
    },
  ]);
  //ProductIncoice Data
  const [dateFrom, setDateFrom] = useState("");
  //Set Product Service
  const [productService, setProductService] = useState("");
  //set Country
  const [countryService, setCountryService] = useState("");
  //Description
  const [description, setDescription] = useState("");
  //Quantity, Amount
  const [quantity, setQuantity] = useState("");
  const [amount, setAmount] = useState("");
  const [newArrPush, setNewArrPush] = useState([]);
  const [Open, setOpen] = useState(false);
  const [newArrPushs, setNewArrPushs] = useState([]);
  const [Opens, setOpens] = useState(false);
  const [invoiceId, setInvoiceId] = useState();

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
    setOpens,
  };

  console.log(dateFrom);
  console.log("product_stepper", product_stepper);
  ///////////////////////////
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("accessToken");
  const permission: any = getDecodedToken();

  var CurrentYear = new Date().getFullYear();

  const [stepsCount, setStepsCount] = useState(1);
  const [hideTopCheck, setHideTopCheck] = useState(true);
  const [loading, setLoading] = useState(false);
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
      label: CurrentYear,
      value: CurrentYear,
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
  const [CreateManualPayrollRes, setCreateManualPayrollRes] = useState<any>({});

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
    loading,
    setLoading,
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
    loading,
    setLoading,
  };

  //stepper three payroll props
  const stepperThreeProps = {
    accessToken,
    newInvoiceEmployeeDetailTable,
    newInvoiceCountrySummaryTable,
    newInvoiceFeeSummaryOptions,
    CreateManualPayrollRes,
    stepperOneData,
    setTransactionType,
    loading,
    setLoading,
  };

  //stepper four payroll props
  const stepperFourProps = {
    CreateManualPayrollRes,
    stepperOneData,
    transactionType,
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

  const disableFunForStepOneProforma = () => {
    if (stepsCount == 1) {
      return !(
        stepperOneData?.customer !== "" &&
        stepperOneData?.type !== "" &&
        stepperOneData?.year !== "" &&
        stepperOneData?.month !== ""
      );
    }
  };

  const disableFunForStepOneMiscellaneous = () => {
    if (stepsCount == 1) {
      return !(
        stepperOneData?.customer !== "" &&
        stepperOneData?.type !== "" &&
        stepperOneData?.year !== "" &&
        stepperOneData?.month !== ""
      );
    }
  };

  const handleNextButtonClick = () => {
    if (stepsCount != 2 && stepperOneData.type == "Payroll") {
      setStepsCount(stepsCount + 1);
    }
    if (stepsCount == 2 && stepperOneData.type == "Payroll") {
      setLoading(true);
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
            setCreateManualPayrollRes(res.data);
            setStepsCount(stepsCount + 1);
            setLoading(false);
          }
        })
        .catch((e: any) => {
          console.log(e);
        });
    }
    if (stepsCount == 3 && stepperOneData.type == "Payroll") {
      setLoading(true);

      axios({
        method: "PUT",
        url: updateInvoiceStatus(CreateManualPayrollRes?.invoiceId),
        headers: getHeaders(accessToken, stepperOneData?.customerId, "false"),
      })
        .then((res: any) => {
          setLoading(false);
          setStepsCount(stepsCount + 1);
        })
        .catch((e: any) => {
          console.log("error", e);
        });
    }

    if (
      (stepsCount == 1 || stepsCount == 2) &&
      stepperOneData?.type === "Credit Memo"
    ) {
      setStepsCount(stepsCount + 1);
    }

    if (stepsCount == 3 && stepperOneData?.type === "Credit Memo") {
      // console.log("new arr", CustomerOptions);

      let invoiceItems = todos.map((e: any) => {
        return {
          ServiceDate: e.date, // ?
          ProductId: newArrPush.find((n: any) => n.label === e.product).id, // prod id
          Description: e.description,
          Amount: e.amount,
          Quantity: e.quantity,
          TotalAmount: e.amount * e.quantity, // multiple ?
          ServiceCountry: newArrPushs.find((n: any) => n.label === e.country)
            .value, // keyword? or id
          ModifiedBy: stepperOneData?.customerId, // ?
        };
      });

      let balance = 0;

      todos.forEach((item) => {
        balance += parseFloat(item.amount) * parseFloat(item.quantity);
      });

      const currDate = new Date();
      const dueDate = new Date();
      dueDate.setDate(currDate.getDate() + 1);

      let data = {
        CustomerId: stepperOneData?.customerId,
        CustomerName: stepperOneData.customer, // customer name
        CustomerLocation:
          CustomerOptions.find(
            (c: any) => c.customerId === stepperOneData?.customerId
          )?.billingAddressCountryName || "India", // loc name
        CurrencyId: 840, // tbd
        Status: 1, // hard code
        TransactionType: 4, // type
        // CreatedDate: currDate, // ? current date
        DueDate: currDate, // ? do not send
        CreatedDate: dueDate,

        // DueDate: "2022-05-23T12:31:21.125Z",
        TotalAmount: balance, //  total balance
        InvoiceBalance: balance, //  total balance
        IsClientVisible: true, // hard code
        CreatedBy: stepperOneData?.customerId, // ?do not send
        ModifiedBy: stepperOneData?.customerId, // ?do not send
        InvoiceDocuments: [],
        InvoiceItems: invoiceItems,
        InvoiceNotes: [],
        InvoiceRelatedInvoices: [],
        InvoiceRelatedRelatedInvoices: [],
      };
      console.log(data);

      axios({
        method: "POST",
        url: urls.createCreditMemo,
        headers: getHeaders(accessToken, stepperOneData?.customerId, "false"),
        data: data,
      })
        .then((res: any) => {
          console.log(res);
          setInvoiceId(res.data.id);
          setStepsCount(4);
        })
        .catch((e: any) => {
          console.log(e);
        });
    }

    if (stepsCount == 1 && stepperOneData?.type === "Miscellaneous") {
      setStepsCount(stepsCount + 1);
    }

    if (stepsCount == 2 && stepperOneData?.type === "Miscellaneous") {
      //API integration here
      setStepsCount(3);
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
                  : stepperOneData?.type === "Credit Memo" ||
                    stepperOneData?.type === "Proforma" ||
                    stepperOneData?.type === "Miscellaneous"
                  ? creditMemoSteps
                  : stepsInitial
              }
              type="step-progress"
            />
          }
          type="sidebar-inner-container"
          rightPanel={
            <>
              {stepsCount == 1 && <NewInvoiceCreation {...stepperOneProps} />}{" "}
              {stepsCount == 2 && stepperOneData?.type === "Payroll" && (
                <SelectEmployees {...stepperTwoProps} />
              )}
              {stepsCount == 2 && stepperOneData?.type === "Credit Memo" && (
                <ProductInvoiceCreation {...product_stepper} />
              )}
              {stepsCount == 2 && stepperOneData?.type === "Miscellaneous" && (
                <ProductInvoiceCreation {...product_stepper} />
              )}
              {stepsCount == 3 && stepperOneData?.type === "Payroll" && (
                <PreviewInvoice {...stepperThreeProps} />
              )}
              {stepsCount == 3 && stepperOneData?.type === "Credit Memo" && (
                <InvoicePreviewPop {...stepperOneProps} {...product_stepper} />
              )}
              {stepsCount == 3 && stepperOneData?.type === "Miscellaneous" && (
                <InvoicePreviewPop {...stepperOneProps} {...product_stepper} />
              )}
              {stepsCount == 4 && stepperOneData?.type === "Payroll" && (
                <FinishSTepper {...stepperFourProps} />
              )}
              {stepsCount === 4 && stepperOneData?.type === "Credit Memo" && (
                <FinishCreditMemo invoiceId={invoiceId} />
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
                : stepperOneData?.type === "Proforma"
                ? disableFunForStepOneProforma()
                : stepperOneData?.type === "Miscellaneous"
                ? disableFunForStepOneMiscellaneous()
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
