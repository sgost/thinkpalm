import { useEffect, useState } from "react";
import { Button, Dropdown, Icon, DatePicker } from "atlasuikit";
import { format } from "date-fns";
import axios from "axios";
import "./ProductInvoiceCreation.scss";
import { getCountryByCustomer, urls, productInvoice, CountryApi } from "../../../urls/urls";
import { tableSharedColumns } from "../../../sharedColumns/sharedColumns";

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

    console.log(newArrPush)

    let finalBal = quantity * amount



    const submitHandler = (e) => {
        e.preventDefault();
        const newTodos = [...todos, { id: Math.random(), date: dateFrom, product: productService, description: description, country: countryService, quantity: quantity, amount: amount, balance: finalBal }];
        setTodos(newTodos);
        setDateFrom("")
        setDescription("")
        setQuantity("")
        setAmount("")
    }

    const remove = (i: any) => {
        setTodos(todos.filter((todo, index) => todo.id !== i.id));
    }
    console.log(todos)


    //Product API

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



    return (
        <div>

            <div className="newinvoice_main" >

                <div>
                    <div className="newinvoice-container">

                        <div id="head_sec">
                            <h3>Summary</h3>
                            <div id="action_buttons">
                                {/* <div id="icon_1" data-testid="remove-item-button" onClick={() => remove()}>
                                    <Icon
                                        icon="trash"
                                        size="small"
                                        width="30"
                                        height="30"
                                        color="#526FD6"
                                    />
                                    Delete
                                </div> */}

                                {/* <div id="icon_1">
                                        <Icon
                                            icon="edit"
                                            size="small"
                                            width="20"
                                            height="20"
                                            color="#526FD6"
                                            style={{ margin: `0 4px 0 0` }}
                                        />
                                        Edit
                                    </div> */}
                            </div>
                        </div>


                        <div id="container_main1">
                            {/* Customer */}
                            <div
                                className="year-dropdown"
                            >
                                <DatePicker
                                    handleDateChange={(date: any) => {
                                        const startDate = format(date, "dd MMM yyyy");
                                        setDateFrom(startDate)
                                    }
                                    }
                                    inline={false}
                                    label="Invoice Date"
                                    data-testid="Date-picker"
                                    minDate={new Date()}
                                />

                            </div>

                            {/* Product Service */}

                            <div className="dropdownP">
                                <Dropdown
                                    handleDropOptionClick={(opt: any) => {
                                        setProductService(opt.label)
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
                                <input type="text" value={description} placeholder="Description" id="description_input" onChange={(e) => setDescription(e.target.value)} />
                            </div>
                        </div>



                        <div id="container_main2">
                            {/* Product Service */}

                            <div className="dropdownP">
                                <Dropdown
                                    handleDropOptionClick={(opt: any) => {
                                        setCountryService(opt.label)
                                        setOpens(false)
                                        let index = newArrPushs.findIndex((e: any) => e.value === opt.value);

                                        let copy = [...newArrPushs];
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
                                        setNewArrPushs(copy)
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
                                    <input placeholder="0" value={quantity} className="inputField" onChange={(e) => setQuantity(e.target.value)} />
                                    <input placeholder="00" value={amount} className="inputField" onChange={(e) => setAmount(e.target.value)} />
                                </div>
                            </div>

                        </div>
                    </div>


                    <div id="container_main3" className="buttons">
                        {todos.length === 0 ? <button style={{ border: `none`, outline: `none`, padding: `15px 30px`, borderRadius: `5px`, margin: `0 4rem 0 0`, color: `white`, background: `#201cdf8f`, fontSize: `13px`, cursor: `pointer` }} onClick={submitHandler}>Save</button> :
                            ""
                        }
                        <span>
                            Total Balance
                        </span>
                        <Button
                            label={quantity !== "" || amount !== "" ? ("USD " + finalBal) : "USD 0000"}
                            className="secondary-btn medium button"
                            handleOnClick={() => { }}
                        />
                    </div>
                </div>

            </div>


            {todos.length === 0 ? "" :
                <div className="newinvoice-container2" data-testid="Add-New-Item">
                    <div id="icon_1" onClick={submitHandler}>
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
            }

            {todos?.map((item, i) =>
                <div id="detail_card_main" key={i}>
                    <div id="detail_cards">
                        <div id="card_head_detail">
                            <h3 id="detail_title">Summary</h3>
                            <div id="card_detail_btns">
                                <p id="delete" onClick={() => remove(item)}>
                                    <Icon
                                        icon="trash"
                                        size="small"
                                        width="30"
                                        height="30"
                                        color="#526FD6"
                                    />Delete</p>
                            </div>
                        </div>
                        <div id="top_row">
                            <div id="roe_detatil_card">
                                <span id="detail_card_title">Invoice Date</span>
                                <p>{item.date}</p>
                            </div>
                            <div id="roe_detatil_card">
                                <span id="detail_card_title">Product Service</span>
                                <p>{item.product}</p>
                            </div>
                            <div id="roe_detatil_card">
                                <span id="detail_card_title">Description</span>
                                <p>{item.description}</p>
                            </div>
                            <div id="roe_detatil_card">
                                <span id="detail_card_title">Country Service</span>
                                <p>{item.country}</p>
                            </div>
                            <div id="roe_detatil_card">
                                <span id="detail_card_title">Quantity</span>
                                <p>{item.quantity}</p>
                            </div>
                            <div id="roe_detatil_card">
                                <span id="detail_card_title">Amount</span>
                                <p>{item.balance}</p>
                            </div>
                        </div>
                        <div id="balance_row">
                            <span id="detail_balance_text">Total Balance</span>
                            <span id="detail_card_balance">USD 500</span>
                        </div>
                    </div>
                </div>
            )}

            {/* <div className="stepper-one-buttons">
                <Button
                    data-testid="next-button"
                    icon={{
                        icon: "chevronRight",
                        size: "medium",
                        color: "#fff",
                    }}
                    label="Next"
                    className="primary-blue medium button next-button"
                    handleOnClick={() => {
                    }}
                />
            </div> */}
        </div >
    );
};

export default ProductInvoiceCreation;