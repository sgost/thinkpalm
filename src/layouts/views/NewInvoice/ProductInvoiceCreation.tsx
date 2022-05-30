import { useEffect, useState } from "react";
import { Button, Dropdown, Icon, DatePicker } from "atlasuikit";
import { format } from "date-fns";
import axios from "axios";
import "./ProductInvoiceCreation.scss";
import {
  getCountryByCustomer,
  urls,
  productInvoice,
  CountryApi,
} from "../../../urls/urls";
import { tableSharedColumns } from "../../../sharedColumns/sharedColumns";
import { loadavg } from "os";

const ProductInvoiceCreation = ({
  todos,
  setTodos,
  setDateFrom,
  setCountryService,
  setProductService,
  newArrPush,
  setNewArrPush,
  Open,
  setOpen,
  newArrPushs,
  setNewArrPushs,
  Opens,
  setOpens,
}: any) => {
  //Product API
  let productApi = productInvoice();
  const [toggleState, setToggleState] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  //CountryAPI
  let countryApi = CountryApi();

  useEffect(() => {
    productFun(productApi);
    countryFun(countryApi);
  }, []);

  const productFun = (productApi: any) => {
    axios
      .get(productApi)
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
        setNewArrPush(temp);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const countryFun = (countryApi: any) => {
    axios
      .get(countryApi)
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


  return (
    <div>
      {todos?.map((item: any, i: any) => (
        <div className="newinvoice_main">
          <div>
            <div className="newinvoice-container">
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

              <div id="container_main1">
                {/* Customer */}
                <div
                  className="year-dropdown"
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
                    minDate={new Date()}
                    placeholderText={item.date ? item.date : "Please Select"}
                  />
                </div>

                {/* Product Service */}

                <div
                  className="dropdownP mandotary-field textcolor"
                  onClick={() => {
                    localStorage.setItem("name_value", "product");
                    setOpen(true);
                  }}
                  data-testid="product_name"
                >
                  <input
                    type="text"
                    value={item.product}
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
                      let index = newArrPush.findIndex(
                        (e: any) => e.value === opt.value
                      );

                      let copy = [...newArrPush];
                      let typesValue = "";
                      copy.forEach((e, i) => {
                        if (i === index) {
                          if (copy[index].isSelected) {
                            copy[index] = { ...opt, isSelected: false };
                          } else {
                            copy[index] = { ...opt, isSelected: true };
                          }
                        }
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
                    options={newArrPush}
                  />
                </div>

                {/* Description */}

                <div className="dropdownP">
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

              <div id="container_main2">
                {/* Country Service */}
                <div
                  className="dropdownP mandotary-field textcolor"
                  data-testid="Country_name"
                  onClick={() => {
                    localStorage.setItem("name_value", "country");
                    setOpens(true);
                  }}
                >
                  <input
                    type="text"
                    value={item.country}
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
                      let index = newArrPushs.findIndex(
                        (e: any) => e.value === opt.value
                      );

                      let copy = [...newArrPushs];
                      copy.forEach((e, ind) => {
                        if (ind === index) {
                          if (copy[index].isSelected) {
                            copy[index] = { ...copy[index], isSelected: false };
                          } else {
                            copy[index] = { ...opt, isSelected: true };
                          }
                        }
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
                    options={newArrPushs}
                  />
                </div>
                <div className="dropdownCount">
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
                      defaultValue={item.quantity}
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
                      className="inputField"
                      onChange={(e) => {
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
              <Button
                label={
                  "USD " +
                  (item.amount
                    ? item.quantity * item.amount
                    : totalQuantity * totalAmount
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
