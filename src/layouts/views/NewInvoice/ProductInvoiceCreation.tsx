import { useEffect, useState } from "react";
import { Button, Dropdown, Icon, DatePicker } from "atlasuikit";
import { format } from "date-fns";
import axios from "axios";
import "./ProductInvoiceCreation.scss";
import { getCountryByCustomer, urls, productInvoice, CountryApi } from "../../../urls/urls";
import { tableSharedColumns } from "../../../sharedColumns/sharedColumns";
import { loadavg } from "os";

const ProductInvoiceCreation = ({
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
}: any) => {

    //Product API

    const [totalBal, setTotalBal] = useState("00")
    const [totalAmo, setTotalAmo] = useState("0000")
    console.log('totalBal', totalBal)
    let productApi = productInvoice();

    //CountryAPI

    let countryApi = CountryApi();
    console.log('countryApi', countryApi)

    useEffect(() => {
        callAgain()
    }, [])



    const callAgain = () => {
        axios.get(productApi).then((response: any) => {
            const temp: any = []
            response?.data.map((item: any) => temp.push({
                "isSelected": false,
                "label": item.glDescription,
                "value": item.glDescription
            }))
            setNewArrPush(temp)
        })

        axios.get(countryApi).then((response: any) => {
            const temp: any = []
            response?.data.locations.map((item: any) => temp.push({
                "isSelected": false,
                "label": item.integrationId,
                "value": item.order
            }))
            setNewArrPushs(temp)
        })
    }


    var finalBal: any = totalBal * totalAmo

    const handleAdd = () => {
        setTodos([...todos, { id: Math.random(), date: "", product: "", description: "", country: "", quantity: "", amount: "" }]);
    }

    const remove = (item: any) => {
        setTodos(todos.filter((todo) => todo.id !== item.id));
    }


    const new_handle = (e) => {
        console.log(e)
        localStorage.setItem('name_value', e.target.name)
    }

    const new_handle2 = (e, index) => {
        let kk = localStorage.getItem('name_value')

        let ss = {
            e: {
                target: {
                    value: e,
                    name: kk
                }
            }
        }

        handleChange(ss.e, index)
    }

    const handleChange = (e, index) => {
        const tempData = todos
        tempData[index][e.target.name] = e.target.value
        console.log(tempData)
        setTodos(tempData);
    }

    console.log('todos', todos)



    return (
        <div>
            {todos?.map((item, i) =>
                <div className="newinvoice_main" >

                    <div>
                        <div className="newinvoice-container">

                            <div id="head_sec">
                                <h3>Summary</h3>
                                <div id="action_buttons">
                                    <div id="icon_1" data-testid="remove-item-button" onClick={() => remove(item)}>
                                        <Icon
                                            icon="trash"
                                            size="small"
                                            width="30"
                                            height="30"
                                            color="#526FD6"
                                        />
                                        Delete
                                    </div>
                                </div>
                            </div>


                            <div id="container_main1">
                                {/* Customer */}
                                <div
                                    className="year-dropdown"
                                    onClick={() => localStorage.setItem('name_value', "date")}
                                >
                                    {/* <input defaultValue={item.date} onClick={(e) => new_handle(e)} name="date" id="click_input" /> */}
                                    <DatePicker
                                        handleDateChange={(date) => {
                                            const startDate = format(date, "dd MMM yyyy");
                                            setDateFrom(startDate)
                                            new_handle2(startDate, i)
                                        }
                                        }
                                        inline={false}
                                        label="Invoice Date"
                                        data-testid="Date-picker"
                                        minDate={new Date()}
                                    />

                                </div>

                                {/* Product Service */}

                                <div className="dropdownP" onClick={() => localStorage.setItem('name_value', "product")}>
                                    {/* <input defaultValue={item.product} onClick={(e) => new_handle(e)} name="product" id="click_input" /> */}
                                    <Dropdown
                                        handleDropOptionClick={(opt) => {
                                            setProductService(opt.label);
                                            setOpen(false)
                                            let index = newArrPush.findIndex((e: any) => e.value === opt.value);

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

                                            setNewArrPush(copy)

                                            new_handle2(opt.label, i)
                                        }}
                                        handleDropdownClick={(bool: any) => {
                                            setOpen(bool);
                                        }}
                                        isOpen={Open}
                                        title={`Product Service`}
                                        options={newArrPush}
                                    />
                                </div>


                                {/* Product Service */}

                                <div className="dropdownP">
                                    <span id="desc_label">Description<span style={{ color: `red` }}>*</span></span>
                                    <input type="text" defaultValue={item.description} placeholder="Description" id="description_input" name="description" onChange={(e) => handleChange(e, i)} />
                                </div>
                            </div>



                            <div id="container_main2">
                                {/* Product Service */}

                                <div className="dropdownP" onClick={() => localStorage.setItem('name_value', "country")}>
                                    {/* <input defaultValue={item.country} onClick={(e) => new_handle(e)} name="country" id="click_input" /> */}
                                    <Dropdown
                                        handleDropOptionClick={(opt: any) => {
                                            setCountryService(opt.label)
                                            setOpens(false)
                                            let index = newArrPushs.findIndex((e: any) => e.value === opt.value);

                                            let copy = [...newArrPushs];
                                            copy.forEach((e, i) => {
                                                if (i === index) {
                                                    if (copy[index].isSelected) {
                                                        copy[index] = { ...opt, isSelected: false };
                                                    } else {
                                                        copy[index] = { ...opt, isSelected: true };
                                                    }
                                                }
                                            });
                                            setNewArrPushs(copy)
                                            new_handle2(opt.label, i)
                                        }}
                                        handleDropdownClick={(bool: any) => {
                                            setOpens(bool);
                                        }}
                                        isOpen={Opens}
                                        title={`Country Service`}
                                        options={newArrPushs}
                                    />
                                </div>
                                <div className="dropdownCount">
                                    <div id="count_tags">
                                        <span>Quantity <span style={{ color: 'red' }}>*</span></span>
                                        <span>Amount <span style={{ color: 'red' }}>*</span></span>
                                    </div>
                                    <div id="dropdownCount_inputs">
                                        <input placeholder="0" defaultValue={item.quantity} className="inputField" onChange={(e) => { handleChange(e, i); setTotalBal(e.target.value) }} name="quantity" />
                                        <input placeholder="00" defaultValue={item.amount} className="inputField" onChange={(e) => { handleChange(e, i), setTotalAmo(e.target.value) }} name="amount" />
                                    </div>
                                </div>

                            </div>
                        </div>


                        <div id="container_main3" className="buttons">
                            <span>
                                Total Balance
                            </span>
                            <Button
                                label={("USD " + item.quantity * item.amount)}
                                className="secondary-btn medium button"
                                handleOnClick={() => { }}
                            />
                        </div>
                    </div>

                </div>
            )}

            <div className="newinvoice-container2" data-testid="Add-New-Item">
                <div id="icon_1" onClick={handleAdd}>
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
        </div >
    );
};

export default ProductInvoiceCreation;