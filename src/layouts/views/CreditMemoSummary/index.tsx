import { Cards, Button, Dropdown, Logs, DatePicker, Icon } from "atlasuikit";
import axios from "axios";
import moment from "moment";
import LogsCompo from "../Logs/index"
import { useEffect, useState } from "react";
import {
  getHeaders,
  productInvoice,
  updateCreditMemoUrl,
} from "../../../urls/urls";
import FileUploadWidget from "../../../components/FileUpload";
import Input from "../../../components/Input/input";
import NotesWidget from "../../../components/Notes";
import "./creditMemoSummary.scss";
import { getPermissions } from "../../../../src/components/Comman/Utils/utils";

export default function CreditMemoSummary(props: any) {
  const {
    notes,
    setNotes,
    documents,
    setDocuments,
    isClient,
    cid,
    id,
    currency,
    creditMemoData,
    serviceCountries,
    vatValue,
    setCreditMemoData,
    status,
    isLogsOpen,
    changeLogs,
    setIsLogsOpen,
    dataAvailable,
    logsData,
    viewLimit,
    setInitial,
    setLimitFor,
    setChangeLogs,
    setDataAvailable,
    initail,
    limitFor
  } = props;



  console.log('propspropspropsprops', props)


  const [newServiceDate, setNewServiceDate] = useState<Date>(new Date());
  const [newDescription, setNewDescription] = useState("");
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [newAmount, setNewAmount] = useState<any>(0);
  const [newCountry, setNewCountry] = useState<any>();
  const [newProduct, setNewProduct] = useState<any>();
  const [newTotalAmount, setNewTotalAmount] = useState<any>();
  const [openProductService, setOpenProductService] = useState(false);
  const [openEditProductService, setOpenEditProductService] = useState<any>();
  const [openCountryService, setOpenCountryService] = useState(false);
  const [openEditCountryService, setOpenEditCountryService] = useState<any>();
  const [openLogs, setOpenLogs] = useState(false);
  const [addSectionCheck, setAddSectionCheck] = useState(false);
  const [editCheck, setEditCheck] = useState<any>();
  const [fieldValues, setFieldValues] = useState(creditMemoData.invoiceItems);
  const [vatAmount, setVatAmount] = useState<any>();
  const [subTotalAmount, setSubTotalAmount] = useState<any>(
    creditMemoData.totalAmount
  );
  const [rawProducts, setRawProducts] = useState<any>();
  const [countryOptions, setCountryOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [multipleProductArr, setMultipleProductArr] = useState<any>([]);
  const [multipleCountryArr, setMultipleCountryArr] = useState<any>([]);
  const [payload, setPayload] = useState<any>(creditMemoData);
  const showAddFields = () => {
    setAddSectionCheck(true);
  };
  useEffect(() => {
    reCalculateTotal();
  }, [creditMemoData]);
  useEffect(() => {
    updateDropdowns();
  }, [fieldValues])
  useEffect(() => {
    axios
      .get(productInvoice())
      .then((resp) => {
        if (resp.status == 200) {
          let arr: any = [];
          for (let i of creditMemoData.invoiceItems) {
            arr.push(
              resp.data.map((x: any) => {
                return {
                  isSelected: x.id == i.productId,
                  label: x.glDescription,
                  value: x.id,
                };
              })
            );
          }
          setMultipleProductArr(arr);
          setProductOptions(
            resp.data.map((x: any) => {
              return {
                isSelected: false,
                label: x.glDescription,
                value: x.id,
              };
            })
          );
          setRawProducts(resp.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });


  }, []);

  useEffect(() => {

    if (serviceCountries) {
      setCountryOptions(
        serviceCountries.map((x: any) => {
          return {
            isSelected: false,
            label: x.text,
            value: x.value,
          };
        })
      );
      let countryArr: any = [];
      creditMemoData.invoiceItems.forEach((item: any) => {
        countryArr.push(
          serviceCountries.map((x: any) => {
            return {
              isSelected: x.value == item.serviceCountry,
              label: x.text,
              value: x.value,
            };
          })
        );
      });
      setMultipleCountryArr(countryArr);
    }

  }, [serviceCountries])


  const toCurrencyFormat = (amount: any) => {
    const cFormat = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
    return cFormat.format(amount).slice(1);
  };
  /* istanbul ignore next */
  const handleOptionClick = (args: any) => {
    const {
      option,
      dropOptions,
      updateIsOpen,
      isDropOpen,
      updateOptions,
      type,
    } = args;
    updateIsOpen(!isDropOpen);
    let updatedOptions = dropOptions.map((opt: any) => {
      opt.isSelected = option.value === opt.value;
      return opt;
    });
    if (type == "country") {
      setNewCountry(option);
    } else if (type == "product") {
      setNewProduct(option);
    }
    updateOptions(updatedOptions);
  };
  /* istanbul ignore next */
  const CountryDropOptionClick = (option: any) =>
    handleOptionClick({
      option,
      dropOptions: countryOptions,
      updateIsOpen: setOpenCountryService,
      isDropOpen: openCountryService,
      updateOptions: setCountryOptions,
      type: "country",
    });

  const productDropOptionClick = (option: any) =>
    handleOptionClick({
      option,
      dropOptions: productOptions,
      updateIsOpen: setOpenProductService,
      isDropOpen: openProductService,
      updateOptions: setProductOptions,
      type: "product",
    });
  /* istanbul ignore next */
  const saveInvoiceItems = () => {
    setNewTotalAmount(newQuantity * newAmount);
    let obj: any = {};
    obj.serviceDate = newServiceDate;
    obj.productId = newProduct.value;
    obj.description = newDescription;
    obj.totalAmount = newQuantity * newAmount;
    obj.quantity = newQuantity;
    obj.serviceCountry = newCountry.value;
    obj.amount = newAmount;
    obj.invoiceId = creditMemoData.id;
    payload?.invoiceItems.push(obj);
    cleanNewObject();
    reCalculateTotal();
    callUpdateAPI();
  };

  const editInvoiceItems = (index: number) => {
    fieldValues[index].totalAmount =
      fieldValues[index].quantity * fieldValues[index].amount;
    payload.invoiceItems[index] = fieldValues[index];
    callUpdateAPI();
  };

  const deleteInvoiceItem = (index: number) => {
    payload.invoiceItems.splice(index, 1);
    callUpdateAPI();
  };

  /* istanbul ignore next */
  const callUpdateAPI = (): any => {
    reCalculateTotal();
    const tempToken = localStorage.getItem("accessToken");
    var headers = getHeaders(tempToken, cid, isClient);
    console.log(payload);
    // return;
    axios
      .put(updateCreditMemoUrl(creditMemoData?.id), payload, {
        headers: headers,
      })
      .then((resp) => {
        if ((resp.status == 200 || resp.status == 201) && resp.data) {
          setAddSectionCheck(false);
          setEditCheck(creditMemoData.invoiceItems.length + 1);
          setFieldValues(resp.data.invoiceItems);
          setCreditMemoData(resp.data);
          setPayload(resp.data);
        }
      })
      .catch(() => {
        console.log("update call failed");
      });
  };
  /* istanbul ignore next */
  const cleanNewObject = () => {
    setNewServiceDate(new Date());
    setProductOptions(
      rawProducts.map((x: any) => {
        return {
          isSelected: false,
          label: x.glDescription,
          value: x.id,
        };
      })
    );
    setNewCountry(null);
    setNewProduct(null);
    setNewDescription("");
    setCountryOptions(
      serviceCountries.map((x: any) => {
        return {
          isSelected: false,
          label: x.text,
          value: x.value,
        };
      })
    );
    setNewQuantity(0);
    setNewAmount(0);
    setNewTotalAmount("");
  };
  /* istanbul ignore next */
  const reCalculateTotal = () => {
    var subtotal = 0;
    for (let a of creditMemoData.invoiceItems) {
      // removed parseInt beacuse it is creating problem in decimal values
      // subtotal = subtotal + parseInt(a.totalAmount);
      subtotal = subtotal + a.totalAmount;
    }
    setSubTotalAmount(subtotal);
    setVatAmount(subtotal * (vatValue / 100));
    payload.totalAmount = subtotal + subtotal * (vatValue / 100);
    if (creditMemoData.status != 9) {
      payload.invoiceBalance = subtotal + subtotal * (vatValue / 100);
    } else {
      payload.invoiceBalance = 0
    }
  };
  /* istanbul ignore next */
  const updateDropdowns = () => {
    let countryArr: any = []
    if (serviceCountries) {
      fieldValues.forEach((item: any) => {
        countryArr.push(
          serviceCountries.map((x: any) => {
            return {
              isSelected: x.value == item.serviceCountry,
              label: x.text,
              value: x.value,
            };
          })
        );
      });
      setMultipleCountryArr(countryArr);
    }

    let arr: any = [];
    if (rawProducts) {
      for (let i of fieldValues) {
        arr.push(
          rawProducts.map((x: any) => {
            return {
              isSelected: x.id == i.productId,
              label: x.glDescription,
              value: x.id,
            };
          })
        );
      }
      setMultipleProductArr(arr);
    }
  };
  /* istanbul ignore next */
  const setEditDescription = (index: number, value: any) => {
    fieldValues[index].description = value;
    setFieldValues([...fieldValues]);
  };
  /* istanbul ignore next */
  const setEditQuantity = (index: number, value: any) => {
    fieldValues[index].quantity = value;
    setFieldValues([...fieldValues]);
  };
  /* istanbul ignore next */
  const setEditTotal = (index: number, value: any) => {
    var newValue = value.replace(",", "");
    newValue = newValue.substring(0, value.length - 3);
    fieldValues[index].totalAmount = newValue;
    setFieldValues([...fieldValues]);
  };
  /* istanbul ignore next */
  const setEditAmount = (index: number, value: any) => {
    var newValue = value.replace(",", "");
    fieldValues[index].amount = newValue;
    setFieldValues([...fieldValues]);
  };
  /* istanbul ignore next */
  const handleArrOptionClick = (
    selOption: any,
    options: any,
    set: any,
    setIsOpen: any,
    index: number,
    type: any
  ) => {
    let arr = [...options];

    arr[index].forEach((e: any, i: number) => {
      if (e.value === selOption.value) {
        arr[index][i] = {
          ...e,
          label: e.label,
          value: e.value,
          isSelected: !e.isSelected,
        };
      } else {
        arr[index][i] = {
          ...arr[index][i],
          isSelected: false,
        };
      }
    });
    set([]);
    setTimeout(() => {
      set([...arr]);
    }, 1);
    setIsOpen(creditMemoData.invoiceItems.length + 1);
    if (type == "product") {
      payload.invoiceItems[index].productId = selOption.value;
    } else if (type == "country") {
      payload.invoiceItems[index].serviceCountry = selOption.value;
    }
  };

  return (
    <div className="credit-summary-wrapper">
      <Cards className="summary-card">
        {fieldValues.map((item: any, index: number) => {
          return (
            <>
              <div className="top">
                {index == 0 && <span className="title">Summary</span>}
                {index != 0 && <span className="title"></span>}
                <div className="top-action">
                  {editCheck != index &&
                    (creditMemoData.status == 1 ||
                      creditMemoData.status == 2) && (
                      <>
                        {index != 0 &&
                          getPermissions(
                            creditMemoData?.transactionType,
                            "DeleteItem"
                          ) && (
                            <Button
                              data-testid="delete-summary-button"
                              icon={{
                                color: "#526fd5",
                                icon: "trash",
                                size: "large",
                              }}
                              className="secondary-btn no-border medium delete"
                              label="Delete Items"
                              handleOnClick={() => {
                                deleteInvoiceItem(index);
                              }}
                            />
                          )}
                        {getPermissions(
                          creditMemoData?.transactionType,
                          "Edit"
                        ) && status !== "Declined" && (
                            <Button
                              data-testid="edit-summary-button"
                              className="primary-blue medium edit"
                              icon={{
                                color: "#fff",
                                icon: "edit",
                                size: "medium",
                              }}
                              label="Edit"
                              handleOnClick={() => {
                                setEditCheck(index);
                              }}
                            />
                          )}
                      </>
                    )}
                  {editCheck == index && (
                    <>
                      <Button
                        data-testid="cancel-edit-summary-button"
                        className="secondary-btn no-border medium save"
                        label="Cancel Edit"
                        handleOnClick={() => {
                          setEditCheck(creditMemoData.invoiceItems.length);
                        }}
                      />
                      <Button
                        data-testid="save-edit-summary-button"
                        className="primary-blue medium save-changes"
                        label="Save Changes"
                        handleOnClick={() => {
                          editInvoiceItems(index);
                        }}
                      />
                    </>
                  )}
                </div>
              </div>
              <div className="UI-align-boxes margin-top ui-datepicker-req">
                <div className="UI-line-text-box">
                  <DatePicker
                    value={moment(item.serviceDate).format("DD MMM YYYY")}
                    label="Service Date"
                    disabled={editCheck != index}
                    handleDateChange={(date: any) => {
                      fieldValues[index].serviceDate = date;
                      setFieldValues([...fieldValues]);
                    }}
                  />
                </div>
                <div className="UI-line-text-box ui-dropdown-req">
                  <Dropdown
                    handleDropOptionClick={(option: any) =>
                      handleArrOptionClick(
                        option,
                        multipleProductArr,
                        setMultipleProductArr,
                        setOpenEditProductService,
                        index,
                        "product"
                      )
                    }
                    handleDropdownClick={(e: any) => {
                      e
                        ? setOpenEditProductService(index)
                        : setOpenEditProductService(fieldValues.length + 1);
                    }}
                    isOpen={openEditProductService == index}
                    isDisabled={editCheck != index}
                    options={multipleProductArr[index] || []}
                    title="Product Service"
                    search
                  />
                </div>
                <div className="UI-line-text-box">
                  <Input
                    setValue={(value: any) => {
                      setEditDescription(index, value);
                    }}
                    value={item.description}
                    label="Description"
                    type="text"
                    placeholder="Enter description"
                    disable={editCheck != index}
                  ></Input>
                </div>
                <div className="UI-line-text-box ui-dropdown-req">
                  <Dropdown
                    handleDropOptionClick={(option: any) =>
                      handleArrOptionClick(
                        option,
                        multipleCountryArr,
                        setMultipleCountryArr,
                        setOpenEditCountryService,
                        index,
                        "country"
                      )
                    }
                    handleDropdownClick={(e: any) => {
                      e
                        ? setOpenEditCountryService(index)
                        : setOpenEditCountryService(fieldValues.length + 1);
                    }}
                    isOpen={openEditCountryService == index}
                    isDisabled={editCheck != index}
                    options={multipleCountryArr[index] || []}
                    title="Service Country"
                    search
                  />
                </div>
              </div>
              <div className="UI-align-boxes margin-top-4">
                <div className="line-sec-width UI-flex">
                  <div className="quantity-box">
                    <Input
                      setValue={(value: any) => {
                        setEditQuantity(index, value);
                      }}
                      value={item.quantity}
                      label="Quantity"
                      type="number"
                      placeholder="Please enter"
                      disable={editCheck != index}
                      required={true}
                    ></Input>
                  </div>
                  <div className="amount-box">
                    <Input
                      setValue={(value: any) => {
                        setEditAmount(index, value);
                      }}
                      value={
                        editCheck == index
                          ? item.amount
                          : toCurrencyFormat(item.amount)
                      }
                      label="Amount"
                      type="amount"
                      placeholder="Please enter"
                      disable={editCheck != index}
                      required={true}
                    ></Input>
                  </div>
                </div>
                <div className="line-sec-width">
                  <Input
                    value={toCurrencyFormat(item.amount * item.quantity)}
                    setValue={(value: any) => {
                      setEditTotal(index, value);
                    }}
                    label="Total Amount"
                    type="text"
                    placeholder="Please enter"
                    disable={true}
                  ></Input>
                </div>
              </div>
              <div className="line-between"></div>
            </>
          );
        })}
        {addSectionCheck && (
          <>
            <div className="top">
              <span className="title"></span>
              <div className="top-action">
                {addSectionCheck && (
                  <>
                    <Button
                      className="secondary-btn no-border medium save"
                      label="Cancel"
                      handleOnClick={() => {
                        setAddSectionCheck(false);
                        cleanNewObject();
                      }}
                    />
                    <Button
                      className="primary-blue medium save"
                      label="Save"
                      handleOnClick={saveInvoiceItems}
                      disabled={
                        !newServiceDate ||
                        newQuantity == 0 ||
                        newQuantity == null ||
                        newAmount == "0" ||
                        newAmount == "" ||
                        !newCountry ||
                        !newProduct
                      }
                    />
                  </>
                )}
              </div>
            </div>
            <div className="UI-align-boxes margin-top ui-datepicker-req">
              <div className="UI-line-text-box">
                <DatePicker
                  value={moment(newServiceDate).format("DD MMM YYYY")}
                  label="Service Date"
                  disabled={false}
                  handleDateChange={(date: any) => {
                    setNewServiceDate(date);
                  }}
                />
              </div>
              <div className="UI-line-text-box ui-dropdown-req">
                <Dropdown
                  search
                  handleDropOptionClick={productDropOptionClick}
                  handleDropdownClick={setOpenProductService}
                  isOpen={openProductService}
                  isDisabled={false}
                  options={productOptions}
                  title="Product Service"
                />
              </div>
              <div className="UI-line-text-box">
                <Input
                  setValue={setNewDescription}
                  value={newDescription}
                  label="Description"
                  placeholder="Enter description"
                  type="text"
                  disable={false}
                ></Input>
              </div>
              <div className="UI-line-text-box ui-dropdown-req">
                <Dropdown
                  search
                  handleDropOptionClick={CountryDropOptionClick}
                  handleDropdownClick={setOpenCountryService}
                  isOpen={openCountryService}
                  isDisabled={false}
                  options={countryOptions}
                  title="Service Country"
                />
              </div>
            </div>
            <div className="UI-align-boxes margin-top-4">
              <div className="line-sec-width UI-flex">
                <div className="quantity-box">
                  <Input
                    value={newQuantity}
                    setValue={setNewQuantity}
                    label="Quantity"
                    type="number"
                    disable={false}
                    required={true}
                  ></Input>
                </div>
                <div className="amount-box">
                  <Input
                    value={newAmount}
                    setValue={(e: any) => {
                      setNewAmount(e);
                    }}
                    label="Amount"
                    type="amount"
                    disable={false}
                    required={true}
                  ></Input>
                </div>
              </div>
              <div className="line-sec-width">
                <Input
                  value={(newQuantity * newAmount).toString()}
                  setValue={setNewTotalAmount}
                  label="Total Amount"
                  type="text"
                  disable={true}
                ></Input>
              </div>
            </div>
            <div className="line-between"></div>
          </>
        )}
        <div className="feeSummaryCalc">
          <div className="rowBox">
            <div className="rowFee">
              <p className="title">Subtotal Due</p>
              <p className="amount">
                {currency} {toCurrencyFormat(subTotalAmount)}
              </p>
            </div>
            <div className="rowFee no-border">
              <p className="title">VAT Amount</p>
              <p className="amount">
                {currency} {toCurrencyFormat(vatAmount)}
              </p>
            </div>
            <div className="totalRow">
              <p>Total Balance</p>
              <p className="total">
                {currency} {toCurrencyFormat(subTotalAmount + vatAmount)}
              </p>
            </div>
          </div>
        </div>
      </Cards>
      {(creditMemoData.status == 1 || creditMemoData.status == 2) &&
        getPermissions(creditMemoData?.transactionType, "Add") && (
          <Cards className="add-item">
            <Button
              data-testid="Invoice-Add-New-Summary"
              label="Add New Item"
              className="secondary-btn large no-border"
              icon={{
                viewBox: "-2 0 24 24",
                icon: "circularAdd",
                size: "large",
                color: "#526FD6",
              }}
              handleOnClick={showAddFields}
              disabled={addSectionCheck}
            />
          </Cards>
        )}
      <div className="filesNotes">
        <NotesWidget
          status={status}
          notes={notes}
          setNotes={setNotes}
          isClient={isClient}
          cid={cid}
          id={id}
          transactionType={creditMemoData?.transactionType}
        ></NotesWidget>
        <FileUploadWidget
          status={status}
          documents={documents}
          setDocuments={setDocuments}
          isClient={isClient}
          cid={cid}
          id={id}
          transactionType={creditMemoData?.transactionType}
        ></FileUploadWidget>
      </div>
      <LogsCompo
        isLogsOpen={isLogsOpen}
        changeLogs={changeLogs}
        setIsLogsOpen={setIsLogsOpen}
        dataAvailable={dataAvailable}
        logsData={logsData}
        viewLimit={viewLimit}
        setInitial={setInitial}
        setLimitFor={setLimitFor}
        setChangeLogs={setChangeLogs}
        setDataAvailable={setDataAvailable}
        initail={initail}
        limitFor={limitFor}
      ></LogsCompo>
    </div>
  );
}
