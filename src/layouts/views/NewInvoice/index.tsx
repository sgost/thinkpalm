import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BreadCrumb, Layouts, Progress, Button, ToastNotification} from "atlasuikit";
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
import axios from "axios";
import {
  createManualInvoice,
  getHeaders,
  getUpdateCreditMemoUrl,
  calculateInvoiceUrl,
  updateInvoiceStatus,
  urls,
} from "../../../urls/urls";
import { sharedSteps } from "../../../sharedColumns/sharedSteps";
import { format } from "date-fns";
import { getManualInvoiceCreationPermissions } from "../../../components/Comman/Utils/utils";
const NewInvoice = () => {
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

  const navigate = useNavigate();

  const accessToken = localStorage.getItem("accessToken");

  let CurrentYear = new Date().getFullYear();

  const [stepsCount, setStepsCount] = useState(1);
  const [hideTopCheck, setHideTopCheck] = useState(true);
  const [loading, setLoading] = useState(false);
  const [vatValue, setVatValue] = useState<any>(0);

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

  const [CountryOptions, setCountryOptions] = useState([]);

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
  const [qbIdValue, setQbIdValue] = useState('')
  const [paymentTermsOptions, setPaymentTermsOptions] = useState<any>([]);
  const [paymentMethodOptions, setPaymentMethodOptions] = useState<any>([]);
  const [selectedRowDataLength, setSelectedRowDataLength] = useState(0);

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

  // calling initally dropdown options for stepper1 non-payroll invoices (NewInvoiceCreation.tsx)
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const cid = localStorage.getItem("current-org-id");
    axios
      .get(urls.subscriptionLookup, {
        headers: getHeaders(token, cid, "false"),
      })
      .then((res: any) => {
        setInvoicerOptions(
          res.data.invoicers.map((invoicer: any) => {
            return {
              ...invoicer,
              isSelected: false,
              label: invoicer.text,
              value: invoicer.value,
              receivableAccounts: invoicer.receivableAccounts,
            };
          })
        );
        setPaymentMethodOptions(
          res.data.paymentMethods.map((pm: any) => {
            return {
              ...pm,
              isSelected: false,
              label: pm.text,
              value: pm.value,
            };
          })
        );

        setCurrencyOptions(
          res.data.billingCurrencies.map((bc: any) => {
            return {
              ...bc,
              isSelected: false,
              label: bc.text,
              value: bc.value,
            };
          })
        );
      })
      .catch((err: any) => console.log(err));

    axios
      .get(urls.lookup, {
        headers: getHeaders(token, cid, "false"),
      })
      .then((res: any) => {
        setPaymentTermsOptions(
          res.data.otherDueTypes.map((od: any) => {
            return {
              ...od,
              isSelected: false,
              label: od.text,
              value: od.value,
            };
          })
        );
      })
      .catch((err: any) => console.log(err));

    setQbIdOptions([
      {
        isSelected: false,
        label: "test 1",
        value: "test1",
      },
    ]);
  }, []);

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
    invoicer: ""
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
    qbIdValue,
    setQbIdValue,
    paymentTermsOptions,
    setPaymentTermsOptions,
    paymentMethodOptions,
    setPaymentMethodOptions,
    setVatValue
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
    currencyOptions,
    vatValue,
    loading
  };

  const disableFunForStepOnePayroll = () => {
    if (loading) {
      return true;
    } else if (stepsCount == 1) {
      return !(
        stepperOneData?.customer !== "" &&
        stepperOneData?.type !== "" &&
        stepperOneData?.country !== "" &&
        stepperOneData?.year !== "" &&
        stepperOneData?.month !== ""
      );
    } else if (stepsCount == 2 && stepperOneData.type === "Payroll") {
      return Object.keys(selectedRowPostData).length === 0 ? true : false;
    } else {
      return false;
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
        paymentTermsOptions.findIndex((e: any) => e.isSelected === true) !== -1
      );
    }
    if (stepsCount == 1 && stepperOneData.type === "Credit Memo") {
      return !(
        stepperOneData?.customer !== "" &&
        invoiceDate !== "" &&
        invoicerOptions.findIndex((e: any) => e.isSelected === true) !== -1 &&
        currencyOptions.findIndex((e: any) => e.isSelected === true) !== -1);
    }

    let condition: any = [];
    let boolen = false;

    if (stepsCount == 2) {
      todos.forEach((item) => {
        if (
          item.product.length &&
          parseFloat(item.amount) > 0 &&
          item.date.length &&
          parseFloat(item.quantity) > 0 &&
          item.country.length && item.description !== ""
        ) {
          condition.push(false);
        } else {
          condition.push(true);
        }
      });
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
      if(CreateManualPayrollRes.invoiceId == null){
      const apiData = employeeApiData;

      let payLoadData = [];
      let count =0;
      for (const [key, _value] of Object.entries(selectedRowPostData)) {
        const newPreapredData = apiData[key];
        count = count + selectedRowPostData[key].length;
        newPreapredData.employeeDetail.compensation.payItems =
          selectedRowPostData[key];

        payLoadData.push(newPreapredData);
      }
      setSelectedRowDataLength(count);
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
      }else{

      
       let countReCal =0;
       for (const [key, _value] of Object.entries(selectedRowPostData)) {
         countReCal = countReCal + selectedRowPostData[key].length;
       }
     if(countReCal> selectedRowDataLength){
       setSelectedRowDataLength(countReCal);
       const apiDataReCal = employeeApiData;
     let payLoadDataReCal = [];
     for (const [key, _value] of Object.entries(selectedRowPostData)) {
       const newPreapredDataReCal = apiDataReCal[key];

       newPreapredDataReCal.employeeDetail.compensation.payItems =
         selectedRowPostData[key];

         payLoadDataReCal.push(newPreapredDataReCal);
     }

     const dataReCal = {
       customerId: stepperOneData?.customerId,
       userId: stepperOneData?.customerId,
       transactionType: 1,
       calendarTypeId: 0,
       countryId: stepperOneData?.countryId,
       month: stepperOneData?.monthId,
       year: stepperOneData?.yearId,
       employeeDetail: {
         employees: payLoadDataReCal,
       },
     };
     axios({
       method: "POST",
       url: calculateInvoiceUrl(CreateManualPayrollRes?.invoiceId),
       headers: getHeaders(accessToken, stepperOneData?.customerId, "false"),
       data: dataReCal,
     })
       .then((res: any) => {
         if (res.data) {
           setStepsCount(stepsCount + 1);
           setLoading(false);
         }
       })
       .catch((e: any) => {
         console.log(e);
       });

      } else{
       setStepsCount(stepsCount + 1);
       setLoading(false);
     }
     }
    }
    if (stepsCount == 3 && stepperOneData.type == "Payroll") {
      setLoading(true);

      axios({
        method: "PUT",
        url: updateInvoiceStatus(CreateManualPayrollRes?.invoiceId),
        headers: getHeaders(accessToken, stepperOneData?.customerId, "false"),
      })
        .then((_res: any) => {
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

  const handleInvoiceCreation = () => {
    setLoading(true)
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

    const payTerms = parseInt(paymentTermsOptions.find((e: any) => e.isSelected)?.text.split(" ")[0]);

    let dueDate = new Date(invoiceDate);
    let result = dueDate.setDate(invoiceDate.getDate() + payTerms + 1);
    const newDueDate = new Date(result);

    let transactionTypeVar = null;

    switch (stepperOneData?.type) {
      case "Proforma":
        transactionTypeVar = 3;
        break;

      case "Credit Memo":
        transactionTypeVar = 4;

        break;

      case "Miscellaneous":
        transactionTypeVar = 2;
        break;
    }

    const customer = CustomerOptions.find(
      (c: any) => c.customerId === stepperOneData?.customerId
    );

    const totalBalanceWithVatValue = balance + balance * (vatValue / 100)

    let data = {
      QbCustomerId: parseInt(qbIdValue),
      qbInvoiceNo: 0,
      CustomerId: stepperOneData?.customerId,
      CustomerName: stepperOneData.customer, // customer name
      CustomerLocation: customer?.billingAddress?.country || "", // currently its coming null thats why fallback is empty string , backend will provice it in future
      // CurrencyId: currencyId?.currency?.id, // backend will provide it
      Status: 1, // hard code
      TransactionType: transactionTypeVar, //
      // CreatedDate: currDate, // ? current date
      DueDate: newDueDate, //
      CreatedDate: format(invoiceDate, "yyyy-MM-dd"),
      submissiondate: format(invoiceDate, "yyyy-MM-dd"),
      // DueDate: "2022-05-23T12:31:21.125Z",
      TotalAmount: totalBalanceWithVatValue, //  total balance
      InvoiceBalance: totalBalanceWithVatValue, //  total balance
      IsClientVisible: true, // hard code
      CreatedBy: stepperOneData?.customerId, //
      ModifiedBy: stepperOneData?.customerId, //
      InvoiceDocuments: [],
      InvoiceItems: invoiceItems,
      InvoiceNotes: [],
      InvoiceRelatedInvoices: [],
      InvoiceRelatedRelatedInvoices: [],
      // PaymentMethod: paymentMethodOptions.find((e: any) => e.isSelected)?.value,
      InvoicerId: invoicerOptions.find((e: any) => e.isSelected)?.id,
      BankDetailId: stepperOneData.type === "Credit Memo" ? null : receivableAccountOptions.find((e: any) => e.isSelected)?.Id,
      CurrencyId: currencyOptions.find((e: any) => e.isSelected)?.value,
      PaymentTerms: paymentTermsOptions.find((e: any) => e.isSelected)?.value
    };

    console.log(data)
    return

    if (!isInvoiceCreated) {
      axios({
        method: "POST",
        url: urls.createCreditMemo,
        headers: getHeaders(accessToken, stepperOneData?.customerId, "false"),
        data: data,
      })
        .then((res: any) => {
          setLoading(false)
          setInvoiceId(res.data.id);
          setIsInvoiceCreated(true);
          SetinvoicePreviewData(res.data);
          setStepsCount(3);
        })
        .catch((e: any) => {
          setLoading(false)
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
          setLoading(false)
          setInvoiceId(res.data.id);
          SetinvoicePreviewData(res.data);
          setStepsCount(3);
        })
        .catch((e: any) => {
          setLoading(false)
          console.log(e);
        });
    }
  };

  const isNextButtonVisiable = ()=> {
    if(stepsCount == 2 && !getManualInvoiceCreationPermissions(stepperOneData?.type, 'Save')){
      return false
    }
    if(stepsCount == 4){
      return false
    }

    return true
  }

  const isPreviousButtonVisiable = () => {

    if(stepsCount == 3 && getManualInvoiceCreationPermissions(stepperOneData?.type, 'Edit')){
      return true
    }
    if(stepsCount == 2 && getManualInvoiceCreationPermissions(stepperOneData?.type, 'Edit')){
      return true
    }

    return false
  }

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
                  <FinishCreditMemo
                    invoiceId={invoiceId}
                    invoiceType={stepperOneData?.type} />
                )}
            </>
          }
        />
      </div>

      <div
        className={stepsCount === 1 ? "Stepper-buttons" : "stepper-two-buttons"}
      >
        <div>
          {isPreviousButtonVisiable() && (
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
        </div>
        {isNextButtonVisiable() && (
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

      {stepsCount == 2 && !getManualInvoiceCreationPermissions(stepperOneData?.type, 'Save') && 
        <ToastNotification
        showNotification
        toastMessage='You do not have save permission'
        toastPosition="bottom-right"
      />}
    </div>
  );
};

export default NewInvoice;
