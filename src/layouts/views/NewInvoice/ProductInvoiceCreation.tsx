import { useEffect, useState } from "react";
import { Button, Dropdown, Icon, DatePicker } from "atlasuikit";
import { format } from "date-fns";
import axios from "axios";
import "./ProductInvoiceCreation.scss";
import {
  productInvoice,
  CountryApi,
  getHeaders,
} from "../../../urls/urls";

const ProductInvoiceCreation = ({
  todos,
  setTodos,
  setDateFrom,
  setCountryService,
  setProductService,
  setNewArrPush,
  Open,
  setOpen,
  setNewArrPushs,
  Opens,
  setOpens,
  productInitialData,
  setProductInitialData,
  tempData,
  setTempData,
  countryInitialData,
  setCountryInitialData,
  tempDataCountry,
  setTempDataCountry,
  CustomerOptions
}: any) => {
  const tempToken = localStorage.getItem("accessToken");
  const cid = localStorage.getItem("current-org-id");

  const headers = {
    headers: getHeaders(tempToken, cid, "false"),
  };

  //Product API
  let productApi = productInvoice();
  const [toggleState, setToggleState] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  //CountryAPI
  let countryApi = CountryApi();

  useEffect(() => {
    if (!productInitialData[0]?.length) {
      productFun(productApi);
      countryFun(countryApi);
    }
  }, []);

  const productFun = (productApi: any) => {
    axios
      .get(productApi, headers)
      .then((response: any) => {
        const temp: any = [];
        response?.data.map((item: any) =>
          temp.push({
            ...item,
            isSelected: false,
            label: item.glDescription,
            value: item.glDescription,
          })
        );
        setTempData(temp);
        setProductInitialData({ [0]: temp });
        setNewArrPush(temp);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const countryFun = (countryApi: any) => {
    axios
      .get(countryApi, headers)
      .then((response: any) => {
        const temp: any = [];
        response?.data.serviceCountries.map((item: any) =>
          temp.push({
            ...item,
            isSelected: false,
            label: item.text,
            value: item.order,
          })
        );
        setTempDataCountry(temp);
        setCountryInitialData({ [0]: temp });
        setNewArrPushs(temp);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const handleAdd = () => {
    setTodos([
      ...todos,
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

    const addition: any = Object.keys(productInitialData).length;
    setProductInitialData({ ...productInitialData, [addition]: tempData });

    const additionCountry: any = Object.keys(countryInitialData).length;
    setCountryInitialData({
      ...countryInitialData,
      [additionCountry]: tempDataCountry,
    });
    setTotalQuantity(0);
    setTotalAmount(0);
  };
  const remove = (item: any) => {
    setTodos(todos.filter((todo: any) => todo.id !== item.id));
  };

  const new_handle2 = (e: any, index: any) => {
    let kk = localStorage.getItem("name_value");
    let ss = {
      e: {
        target: {
          value: e,
          name: kk,
        },
      },
    };
    handleChange(ss.e, index);
  };

  const handleChange = (e: any, index: any) => {
    const tempData = [...todos];
    tempData[index][e.target.name] = e.target.value;
    setTodos(tempData);
  };

  const blockInvalidChar = (e: any) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

  return (
    <div>
      {todos?.map((item: any, i: any) => (
        <div className="newinvoice_main">
          <div>
            <div className="newinvoice-container new_Invoice_itme_summary">
              <div id="head_sec">
                <h3>Summary</h3>
                <div id="action_buttons">
                  {i != 0 && (
                    <div
                      id="icon_1"
                      data-testid="remove-item-button"
                      onClick={() => remove(item)}
                    >
                      <Icon
                        icon="trash"
                        size="small"
                        width="30"
                        height="30"
                        color="#526FD6"
                      />
                      Delete
                    </div>
                  )}
                </div>
              </div>

              <div id="container_main1" className="row">
                {/* Customer */}
                <div
                  className=" col-md-3 input-component"
                  data-testid="Date-picker"
                  onClick={() => localStorage.setItem("name_value", "date")}
                >
                  <DatePicker
                    handleDateChange={(date: any) => {
                      const startDate = format(date, "dd MMM yyyy");
                      setDateFrom(startDate);
                      new_handle2(startDate, i);
                    }}
                    inline={false}
                    label="Service Date"
                    placeholderText={item.date ? item.date : "Please Select"}
                  />
                </div>

                {/* Product Service */}

                <div
                  className=" mandotary-field textcolor col-md-3 select-component"
                  onClick={() => {
                    localStorage.setItem("name_value", "product");
                    setOpen(true);
                  }}
                  data-testid="product_name"
                >
                  <>
                    <input
                      type="text"
                      data-testid="product_open"
                      onClick={() => setOpen(true)}
                      id="click_input"
                      placeholder="Please Select"
                      autoComplete="off"
                    />
                    <Dropdown
                      handleDropOptionClick={(opt: any) => {
                        setProductService(opt.label);
                        setOpen(false);
                        let index = productInitialData[i].findIndex(
                          (e: any) => e.value === opt.value
                        );

                        let copy = [...tempData];
                        let typesValue = "";
                        copy.forEach((_e, i) => {
                          if (i === index) {
                            if (copy[index].isSelected) {
                              copy[index] = { ...opt, isSelected: false };
                            } else {
                              copy[index] = { ...opt, isSelected: true };
                            }
                          }
                        });
                        setProductInitialData({
                          ...productInitialData,
                          [i]: copy,
                        });
                        setNewArrPush(copy);
                        new_handle2(opt.label, i);
                      }}
                      handleDropdownClick={(bool: any) => {
                        setOpen(bool);
                        setToggleState(i);
                      }}
                      isOpen={toggleState == i ? Open : false}
                      title={`Product Service`}
                      search
                      options={
                        productInitialData && productInitialData[i]
                          ? productInitialData[i]
                          : []
                      }
                    />
                  </>
                </div>

                {/* Description */}

                <div className=" col-md-3 input-component">
                  <span id="desc_label">Description</span>
                  <input
                    type="text"
                    className="font-color"
                    defaultValue={item.description}
                    placeholder="Enter description"
                    id="description_input"
                    name="description"
                    data-testid="description_set"
                    onChange={(e) => handleChange(e, i)}
                  />
                </div>
              </div>

              <div id="container_main2" className="row">
                {/* Country Service */}
                <div
                  className=" mandotary-field textcolor col-md-3 input-component"
                  data-testid="Country_name"
                  onClick={() => {
                    localStorage.setItem("name_value", "country");
                    setOpens(true);
                  }}
                >
                  <input
                    type="text"
                    data-testid="Country_open"
                    onClick={() => setOpens(true)}
                    id="click_input"
                    placeholder="Please Select"
                    autoComplete="off"
                  />
                  <Dropdown
                    handleDropOptionClick={(opt: any) => {
                      setCountryService(opt.label);
                      setOpens(false);
                      let index = countryInitialData[i].findIndex(
                        (e: any) => e.value === opt.value
                      );

                      let copy = [...tempDataCountry];
                      copy.forEach((_e, ind) => {
                        if (ind === index) {
                          if (copy[index].isSelected) {
                            copy[index] = { ...opt, isSelected: false };
                          } else {
                            copy[index] = { ...opt, isSelected: true };
                          }
                        }
                      });
                      setCountryInitialData({
                        ...countryInitialData,
                        [i]: copy,
                      });

                      setNewArrPushs(copy);
                      new_handle2(opt.label, i);
                    }}
                    handleDropdownClick={(bool: any) => {
                      setOpens(bool);
                      setToggleState(i);
                    }}
                    isOpen={toggleState == i ? Opens : false}
                    title="Service Country"
                    search
                    options={
                      countryInitialData && countryInitialData[i]
                        ? countryInitialData[i]
                        : []
                    }
                  />
                </div>
                <div className=" col-md-3 input-component uantity_mount">
                  <div id="count_tags">
                    <span>
                      Quantity <span style={{ color: "red" }}>*</span>
                    </span>
                    <span>
                      Amount <span style={{ color: "red" }}>*</span>
                    </span>
                  </div>
                  <div id="dropdownCount_inputs">
                    <input
                      data-testid="Quantity"
                      placeholder="0"
                      type="number"
                      min="0"
                      pattern="[+-]?\d+(?:[.,]\d+)?"
                      defaultValue={item.quantity}
                      onKeyDown={(e) => {
                        ["e", "E", "+", "-", "."].includes(e.key) &&
                          e.preventDefault();
                      }}
                      className="inputField"
                      onChange={(e) => {
                        handleChange(e, i);
                        setTotalQuantity(JSON.parse(e.target.value));
                      }}
                      name="quantity"
                      autoComplete="off"
                    />
                    <input
                      data-testid="Amount"
                      placeholder="0"
                      type="number"
                      min="0"
                      defaultValue={item.amount}
                      onKeyDown={(e) => blockInvalidChar(e)}
                      className="inputField"
                      onChange={(e) => {
                        if (e.target.value.split(".")[1]?.length >= 2)
                          e.target.value = parseFloat(e.target.value).toFixed(
                            2
                          );
                        handleChange(e, i);
                        setTotalAmount(JSON.parse(e.target.value));
                      }}
                      name="amount"
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div id="container_main3" className="buttons">
              <span>Total Balance</span>
              {console.log('currencyOptions',CustomerOptions)}
              <Button
                label={
                  CustomerOptions.find( (e:any)=> e.isSelected )?.billingCurrency + " " +
                  (item.amount
                    ? item.quantity * item.amount
                    : 0
                  ).toLocaleString("en-US")
                }
                className="secondary-btn medium button"
                // handleOnClick={() => { }}
                data-testid="Button_Balance"
              />
            </div>
          </div>
        </div>
      ))}

      <div className="newinvoice-container2">
        <div id="icon_1" onClick={handleAdd} data-testid="Add-New-Item">
          <span>
            <Icon
              icon="add"
              size="small"
              width="20"
              height="20"
              color="white"
              style={{ margin: `0 4px 0 0` }}
            />
          </span>
          Add New Item
        </div>
      </div>
    </div>
  );
};

export default ProductInvoiceCreation;
