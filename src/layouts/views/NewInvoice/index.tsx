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
  getUpdateCreditMemoUrl,
  updateInvoiceStatus,
  urls,
} from "../../../urls/urls";
import { sharedSteps } from "../../../sharedColumns/sharedSteps";
import { format } from "date-fns";
const NewInvoice = () => {
  const tempToken = localStorage.getItem("accessToken");
  const cid = localStorage.getItem("current-org-id");

  const [task, setTask] = useState("");
  const [productInitialData, setProductInitialData] = useState({});
  const [tempData, setTempData] = useState<any>([]);
  const [countryInitialData, setCountryInitialData] = useState({});
  const [tempDataCountry, setTempDataCountry] = useState<any>([]);
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
  const [newArrPush, setNewArrPush] = useState<any>([]);
  const [Open, setOpen] = useState(false);
  const [newArrPushs, setNewArrPushs] = useState<any>([]);
  const [Opens, setOpens] = useState(false);
  const [invoiceId, setInvoiceId] = useState();
  const [countriesData, setCountriesData] = useState<any>([]);

  const navigate = useNavigate();

  const accessToken = localStorage.getItem("accessToken");

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
      key: "summary",
      label: "Summary",
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
  const [CustomerOptions, setCustomerOption] = useState<any>([]);

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

  const [invoiceDate, setInvoiceDate] = useState<any>("");

  const [invoicerOptions, setInvoicerOptions] = useState<any>([]);
  const [receivableAccountOptions, setReceivableAccountOptions] = useState<any>(
    []
  );
  const [currencyOptions, setCurrencyOptions] = useState<any>([]);
  const [qbIdOptions, setQbIdOptions] = useState<any>([]);
  const [paymentTermsOptions, setPaymentTermsOptions] = useState<any>([]);
  const [paymentMethodOptions, setPaymentMethodOptions] = useState<any>([]);

  //stepper two payroll TableOptions
  const [tableOptions, setTableOptions] = useState({
    columns: [
      tableSharedColumns.payItemName,
      tableSharedColumns.amount,
      tableSharedColumns.currencyCode,
      tableSharedColumns.effectiveDate,
      tableSharedColumns.endDate,
      tableSharedColumns.scopesName,
      tableSharedColumns.payItemFrequencyName,
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

  //flag to stop multiple post calls for invoice Creation
  const [isInvoiceCreated, setIsInvoiceCreated] = useState(false);

  const [invoicePreviewData, SetinvoicePreviewData] = useState({});

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
    invoiceDate,
    setInvoiceDate,
    invoicerOptions,
    setInvoicerOptions,
    receivableAccountOptions,
    setReceivableAccountOptions,
    currencyOptions,
    setCurrencyOptions,
    qbIdOptions,
    setQbIdOptions,
    paymentTermsOptions,
    setPaymentTermsOptions,
    paymentMethodOptions,
    setPaymentMethodOptions,
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
    selectedRowPostData,
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
    invoicePreviewData,
  };

  //stepper four payroll props
  const stepperFourProps = {
    CreateManualPayrollRes,
    stepperOneData,
    transactionType,
  };

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
    stepperOneData,
    invoiceId,
    productInitialData,
    setProductInitialData,
    tempData,
    setTempData,
    countryInitialData,
    setCountryInitialData,
    tempDataCountry,
    setTempDataCountry,
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
      return Object.keys(selectedRowPostData).length === 0 ? true : false;
    }
  };

  const disableFunForStepOneCreditMemo = () => {
    if (stepsCount == 1 && stepperOneData.type !== "Credit Memo") {
      return !(
        stepperOneData?.customer !== "" &&
        stepperOneData?.type !== "" &&
        invoiceDate !== "" &&
        invoicerOptions.findIndex((e: any) => e.isSelected === true) !== -1 &&
        receivableAccountOptions.findIndex(
          (e: any) => e.isSelected === true
        ) !== -1 &&
        currencyOptions.findIndex((e: any) => e.isSelected === true) !== -1 &&
        paymentMethodOptions.findIndex((e: any) => e.isSelected === true) !== -1
      );
    }
    if (stepsCount == 1 && stepperOneData.type === "Credit Memo") {
      return !(stepperOneData?.customer !== "" && invoiceDate !== "");
    }

    let condition: any = [];
    let boolen = false;

    if (stepsCount == 2) {
      todos.forEach((item) => {
        if (
          item.product.length &&
          item.amount.length &&
          item.date.length &&
          item.quantity.length &&
          item.country.length
        ) {
          condition.push(false);
        } else {
          condition.push(true);
        }
      });
    }

    if (stepsCount == 3 && loading) {
      condition.push(true)
    } else {
      condition.push(false)
    }


    condition.forEach((element: any) => {
      if (element) {
        boolen = element;
      }
    });
    return boolen;
  };

  const handleNextButtonClick = () => {
    if (stepsCount != 2 && stepperOneData.type == "Payroll") {
      setStepsCount(stepsCount + 1);
    }
    if (stepsCount == 2 && stepperOneData.type == "Payroll") {
      setLoading(true);
      const apiData = employeeApiData;

      let payLoadData = [];
      for (const [key, value] of Object.entries(selectedRowPostData)) {
        const newPreapredData = apiData[key];

        newPreapredData.employeeDetail.compensation.payItems =
          selectedRowPostData[key];

        payLoadData.push(newPreapredData);
      }

      const data = {
        customerId: stepperOneData?.customerId,
        userId: stepperOneData?.customerId,
        transactionType: 1,
        calendarTypeId: 0,
        countryId: stepperOneData?.countryId,
        month: stepperOneData?.monthId,
        year: stepperOneData?.yearId,
        employeeDetail: {
          employees: payLoadData,
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
      stepsCount == 1 &&
      (stepperOneData?.type === "Credit Memo" ||
        stepperOneData?.type === "Proforma" ||
        stepperOneData?.type === "Miscellaneous")
    ) {
      setStepsCount(stepsCount + 1);
    }

    if (
      stepsCount == 2 &&
      (stepperOneData?.type === "Credit Memo" ||
        stepperOneData?.type === "Proforma" ||
        stepperOneData?.type === "Miscellaneous")
    ) {
      handleInvoiceCreation();
    }

    if (
      stepsCount == 3 &&
      (stepperOneData?.type === "Credit Memo" ||
        stepperOneData?.type === "Proforma" ||
        stepperOneData?.type === "Miscellaneous")
    ) {
      setStepsCount(4);
    }
  };

  useEffect(() => {
    if (!hideTopCheck) {
      navigate("/pay");
    }
  }, [hideTopCheck]);

  // useEffect(() => {
  //   axios
  //     .get(urls.countries)
  //     .then((countryRes: any) => {
  //       setCountriesData(countryRes.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  const handleInvoiceCreation = () => {
    let invoiceItems = todos.map((e: any) => {
      return {
        ServiceDate: e.date, // ?
        ProductId: newArrPush.find((n: any) => n.label === e.product)?.id, // prod id
        Description: e.description,
        Amount: e.amount,
        Quantity: e.quantity,
        TotalAmount: e.amount * e.quantity, // multiple ?
        ServiceCountry: newArrPushs.find((n: any) => n.label === e.country)
          ?.value, // keyword? or id
        ModifiedBy: stepperOneData?.customerId, // ?
      };
    });

    let balance = 0;

    todos.forEach((item) => {
      balance += parseFloat(item.amount) * parseFloat(item.quantity);
    });

    const payTerms =
      stepperOneData.type === "Credit Memo"
        ? 7
        : parseInt(
          paymentTermsOptions
            .find((e: any) => e.isSelected)
            ?.text.split(" ")[0]
        );

    // const currDate = new Date();
    const dueDate = new Date();
    // dueDate.setDate(invoiceDate.getDate() + 7);
    dueDate.setDate(invoiceDate.getDate() + payTerms);
    dueDate.setMonth(invoiceDate.getMonth());
    dueDate.setFullYear(invoiceDate.getFullYear());

    let transactionType = null;

    switch (stepperOneData?.type) {
      case "Proforma":
        transactionType = 3;
        break;

      case "Credit Memo":
        transactionType = 4;

        break;

      case "Miscellaneous":
        transactionType = 2;
        break;
    }

    const customer = CustomerOptions.find(
      (c: any) => c.customerId === stepperOneData?.customerId
    );

    const currencyId = currencyOptions.find(
      (c: any) => c.text === customer?.billingCurrency
    );

    let data = {
      CustomerId: stepperOneData?.customerId,
      CustomerName: stepperOneData.customer, // customer name
      CustomerLocation: customer?.billingAddress?.country || "", // currently its coming null thats why fallback is India , backend will provice it in future
      // CurrencyId: currencyId?.currency?.id, // backend will provide it
      Status: 1, // hard code
      TransactionType: transactionType, //
      // CreatedDate: currDate, // ? current date
      DueDate: dueDate, //
      CreatedDate: format(invoiceDate, "yyyy-MM-dd"),

      // DueDate: "2022-05-23T12:31:21.125Z",
      TotalAmount: balance, //  total balance
      InvoiceBalance: balance, //  total balance
      IsClientVisible: true, // hard code
      CreatedBy: stepperOneData?.customerId, //
      ModifiedBy: stepperOneData?.customerId, //
      InvoiceDocuments: [],
      InvoiceItems: invoiceItems,
      InvoiceNotes: [],
      InvoiceRelatedInvoices: [],
      InvoiceRelatedRelatedInvoices: [],
      PaymentMethod: paymentMethodOptions.find((e: any) => e.isSelected)?.value,
      InvoicerId: invoicerOptions.find((e: any) => e.isSelected)?.id,
      BankDetailId: receivableAccountOptions.find((e: any) => e.isSelected)?.id,
      CurrencyId:
        stepperOneData.type === "Credit Memo"
          ? currencyId?.value
          : currencyOptions.find((e: any) => e.isSelected)?.value,
    };

    if (!isInvoiceCreated) {
      axios({
        method: "POST",
        url: urls.createCreditMemo,
        headers: getHeaders(accessToken, stepperOneData?.customerId, "false"),
        data: data,
      })
        .then((res: any) => {
          setInvoiceId(res.data.id);
          setIsInvoiceCreated(true);
          SetinvoicePreviewData(res.data);
          setStepsCount(3);
        })
        .catch((e: any) => {
          console.log(e);
        });
    } else {
      axios({
        method: "PUT",
        url: getUpdateCreditMemoUrl(invoiceId),
        headers: getHeaders(accessToken, stepperOneData?.customerId, "false"),
        data: {
          ...invoicePreviewData,
          ...data,
        },
      })
        .then((res: any) => {
          setInvoiceId(res.data.id);
          SetinvoicePreviewData(res.data);
          setStepsCount(3);
        })
        .catch((e: any) => {
          console.log(e);
        });
    }
  };

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
                  : stepsCount === 2 && stepperOneData?.type === "Payroll"
                    ? "step2-right-panel"
                    : stepsCount === 2 && stepperOneData?.type !== "Payroll"
                      ? "step2-credit-memo"
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
              {stepsCount == 1 && <NewInvoiceCreation {...stepperOneProps} />}
              {stepsCount == 2 && stepperOneData?.type === "Payroll" && (
                <SelectEmployees {...stepperTwoProps} />
              )}
              {stepsCount == 2 &&
                (stepperOneData?.type === "Credit Memo" ||
                  stepperOneData?.type === "Proforma") && (
                  <ProductInvoiceCreation {...product_stepper} />
                )}
              {stepsCount == 2 && stepperOneData?.type === "Miscellaneous" && (
                <ProductInvoiceCreation {...product_stepper} />
              )}
              {stepsCount == 3 && stepperOneData?.type === "Payroll" && (
                <PreviewInvoice {...stepperThreeProps} />
              )}
              {stepsCount == 3 &&
                (stepperOneData?.type === "Credit Memo" ||
                  stepperOneData?.type === "Proforma") && (
                  <InvoicePreviewPop
                    {...stepperOneProps}
                    {...product_stepper}
                  />
                )}
              {stepsCount == 3 && stepperOneData?.type === "Miscellaneous" && (
                <InvoicePreviewPop {...stepperOneProps} {...product_stepper} />
              )}
              {stepsCount == 4 && stepperOneData?.type === "Payroll" && (
                <FinishSTepper {...stepperFourProps} />
              )}
              {stepsCount === 4 &&
                (stepperOneData?.type === "Credit Memo" ||
                  stepperOneData?.type === "Proforma" ||
                  stepperOneData?.type === "Miscellaneous") && (
                  <FinishCreditMemo invoiceId={invoiceId} />
                )}
            </>
          }
        />
      </div>

      <div
        className={stepsCount === 1 ? "Stepper-buttons" : "stepper-two-buttons"}
      >
        {(stepsCount == 2 || stepsCount == 3) && (
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
                : disableFunForStepOneCreditMemo()
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
