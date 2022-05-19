import { useEffect, useState } from "react";
import { Button, Dropdown, Icon, DatePicker } from "atlasuikit";
import { format } from "date-fns";
import axios from "axios";
import "./ProductInvoiceCreation.scss";
import { getCountryByCustomer, urls, productInvoice, CountryApi } from "../../../urls/urls";
import { tableSharedColumns } from "../../../sharedColumns/sharedColumns";

const ProductInvoiceCreation = ({
    handleSteps,
    allStepsData,
    handleAllSteppersData,
}: any) => {


    const [addForm, setAddForm] = useState([1])

    console.log(addForm)

    const onAddForm = () => {
        setAddForm([...addForm, 1])

    }

    const removeHandler = ({ item, i }: any) => {
        const newTodos = addForm.splice(i, 1)
        setAddForm(newTodos)
    }

    const [dateFrom, setDateFrom] = useState("");

    console.log('dateFrom', dateFrom)



    //Product API

    const [newArrPush, setNewArrPush] = useState([])
    const [Open, setOpen] = useState(false)
    let productApi = productInvoice();
    //CountryAPI

    let countryApi = CountryApi();
    const [countryopen, setCountryopen] = useState(false)
    const [countryApiData, setCountryApiData] = useState([]);

    useEffect(() => {
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
            response.data.map((item: any) => {
                temp.push({
                    "isSelected": false,
                    "label": item.name,
                    "value": item.code
                })
                setCountryApiData(temp)
            })
        })

    }, [])


    //Description
    const [description, setDescription] = useState("")
    //Quantity, Amount
    const [quantity, setQuantity] = useState("")
    const [amount, setAmount] = useState("")

    return (
        <div>
            {addForm?.map((item, i) =>
                <div className="newinvoice_main" key={i}>

                    <div>
                        <div className="newinvoice-container">

                            <div id="head_sec">
                                <h3>Summary</h3>
                                <div id="action_buttons">
                                    {addForm.length === 1 ? "" :
                                        <div id="icon_1" data-testid="remove-item-button" onClick={() => removeHandler({ item, i })}>
                                            <Icon
                                                icon="trash"
                                                size="small"
                                                width="30"
                                                height="30"
                                                color="#526FD6"
                                            />
                                            Delete
                                        </div>}

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
                                            const startDate = format(date, "yyyy-MM-dd");
                                            setDateFrom(startDate)
                                        }
                                        }
                                        inline={false}
                                        label="Invoice Date"
                                        data-testid="Date-picker"
                                        minDate={new Date("2022-05-18T04:42:14.220Z")}
                                    />

                                </div>

                                {/* Product Service */}

                                <div className="dropdownP">
                                    <Dropdown
                                        handleDropOptionClick={(opt: any) => {
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
                                            setCountryopen(false)
                                            let index = countryApiData.findIndex((e: any) => e.value === opt.value);
                                            let copy = [...countryApiData];
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
                                        }}
                                        handleDropdownClick={(bool: any) => {
                                            setCountryopen(bool)
                                        }}
                                        isOpen={countryopen}
                                        options={countryApiData}
                                        title={`Service Country`}
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
                            <span>
                                Total Balance
                            </span>
                            <Button
                                label={quantity !== "" || amount !== "" ? ("USD " + quantity * amount) : "USD 0000"}
                                className="secondary-btn medium button"
                                handleOnClick={() => { }}
                            />
                        </div>
                    </div>

                </div>
            )}


            <div className="newinvoice-container2" data-testid="Add-New-Item" onClick={() => onAddForm()}>
                <div id="icon_1">
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