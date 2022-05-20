import { Cards, Button, Dropdown, Logs, DatePicker } from 'atlasuikit';
import axios from 'axios';
import { te } from 'date-fns/locale';
import moment from "moment";
import { useEffect, useState } from 'react';
import { updateCreditMemoUrl, urls } from '../../../urls/urls';
import FileUploadWidget from '../../../components/FileUpload';
import Input from '../../../components/Input/input';
import NotesWidget from '../../../components/Notes';
import "./creditMemoSummary.scss";

export default function CreditMemoSummary(props: any) {

    const { notes, setNotes, documents, setDocuments, isClient, cid, id, currency, creditMemoData, serviceCountries, vatValue } = props
    const [newServiceDate, setNewServiceDate] = useState<Date>();
    const [newDescription, setNewDescription] = useState('');
    const [newQuantity, setNewQuantity] = useState<number>();
    const [newAmount, setNewAmount] = useState<any>();
    const [newTotalAmount, setNewTotalAmount] = useState<any>();
    const [openProductService, setOpenProductService] = useState(false);
    const [openCountryService, setOpenCountryService] = useState(false);
    const [openLogs, setOpenLogs] = useState(false);
    const [addSectionCheck, setAddSectionCheck] = useState(false);
    const [editCheck, setEditCheck] = useState(true);
    const [fieldValues, setFieldValues] = useState(creditMemoData.invoiceItems);
    const [vatAmount, setVatAmount] = useState<any>();
    const [rawProducts, setRawProducts] = useState<any>();
    const [countryOptions, setCountryOptions] = useState([]);
    const [productOptions, setProductOptions] = useState([]);
    const [multipleProductArr, setMultipleProductArr] = useState<any>([]);
    const [multipleCountryArr, setMultipleCountryArr] = useState<any>([]);
    const [isProductOpen , setIsProductOpen] = useState()
    const [isCountryOpen , setIsCountryOpen] = useState()
    const showAddFields = () => {
        setAddSectionCheck(true);
    }
    useEffect(() => {
        axios.get(urls.products).then((resp) => {
            if (resp.status == 200) {
                let arr:any = []
                // creditMemoData?.invoiceItems?.foreach((item: any) => {
                //     arr.push(resp.data.map((x: any) => {
                //         return {
                //             isSelected: false,
                //             label: x.glDescription,
                //             value: x.id
                //         }
                //     }))
                // })
                console.log(creditMemoData.invoiceItems);
                for(let i of creditMemoData.invoiceItems){
                    arr.push(resp.data.map((x: any) => {
                                return {
                                    isSelected: x.id == i.productId,
                                    label: x.glDescription,
                                    value: x.id
                                }
                            }))
                }
                console.log(arr)
                setMultipleProductArr(arr);
                setProductOptions(
                    resp.data.map((x: any) => {
                        return {
                            isSelected: false,
                            label: x.glDescription,
                            value: x.id
                        }
                    })
                )
                setRawProducts(resp.data);
            }
        }).catch((err) => {
            console.log(err)
        })
        setCountryOptions(
            serviceCountries.map((x: any) => {
                return {
                    isSelected: false,
                    label: x.text,
                    value: x.value
                }
            })
        )
        let countryArr:any = [];
        creditMemoData.invoiceItems.forEach((item: any) => {
            countryArr.push(serviceCountries.map((x: any) => {
                return {
                    isSelected: x.value == item.serviceCountry,
                    label: x.text,
                    value: x.value
                }
            }))
        })
        setMultipleCountryArr(countryArr);
        setVatAmount(creditMemoData.totalAmount * (vatValue / 100));

    }, [])
    // useEffect(()=>{
    //     if(countryOptions.length > 0){
    //         updateOptions(countryOptions, creditMemoData.invoiceItems[0].serviceCountry, setCountryOptions)
    //     }
    // },[countryOptions])

    const toCurrencyFormat = (amount: number) => {
        const cFormat = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        });
        return cFormat.format(amount).slice(1);
    };
    /* istanbul ignore next */
    const updateOptions = (dropOptions: any, value: any, updateOption: any) => {
        let updatedOptions = dropOptions.map((opt: any) => {
            opt.isSelected = value == opt.value;
            return opt;
        });
        updateOption(updatedOptions);
    }
    /* istanbul ignore next */
    const handleOptionClick = (args: any) => {
        const { option, dropOptions, updateIsOpen, isDropOpen, updateOptions } = args;
        updateIsOpen(!isDropOpen);
        let updatedOptions = dropOptions.map((opt: any) => {
            opt.isSelected = option.value === opt.value;
            return opt;
        });

        updateOptions(updatedOptions);
    };
    /* istanbul ignore next */
    const CountryDropOptionClick = (option: any) => handleOptionClick({
        option,
        dropOptions: countryOptions,
        updateIsOpen: setOpenCountryService,
        isDropOpen: openCountryService,
        updateOptions: setCountryOptions,
    });
    /* istanbul ignore next */
    const productDropOptionClick = (option: any) => handleOptionClick({
        option,
        dropOptions: productOptions,
        updateIsOpen: setOpenProductService,
        isDropOpen: openProductService,
        updateOptions: setProductOptions,
    });
    /* istanbul ignore next */
    const saveInvoiceItems = () => {
        let serviceProduct: any = productOptions.filter((x: any) => x.isSelected)[0];
        let country: any = countryOptions.filter((x: any) => x.isSelected)[0];
        let obj: any = {};
        obj.serviceDate = newServiceDate;
        obj.productId = serviceProduct.value;
        obj.description = newDescription;
        obj.totalAmount = newTotalAmount;
        obj.quantity = newQuantity;
        obj.serviceCountry = country.value;
        obj.amount = newAmount;
        obj.invoiceId = creditMemoData.id;
        var payload = creditMemoData;
        payload.invoiceItems.push(obj);
        cleanNewObject();
        axios.put(updateCreditMemoUrl(creditMemoData?.id), payload).then((resp) => {
            if (resp.status == 200) {
                console.log(resp)
                setAddSectionCheck(false);
            }
        }).catch((err) => {
            console.log("update call failed");
        })
    }
    /* istanbul ignore next */
    const cleanNewObject = () => {
        setNewServiceDate(new Date);
        setProductOptions(rawProducts.map((x: any) => {
            return {
                isSelected: false,
                label: x.glDescription,
                value: x.id
            }
        })
        )
        setNewDescription('');
        setCountryOptions(
            serviceCountries.map((x: any) => {
                return {
                    isSelected: false,
                    label: x.text,
                    value: x.value
                }
            })
        )
        setNewQuantity(0);
        setNewAmount('');
        setNewTotalAmount('');
    }
    const handleArrOptionClick = (
        selOption: any,
        options: any,
        set: any,
        setIsOpen: any,
        index: number
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
  
        // let countryTableTemp = [...countryTable];
        // setCountryTable([]);
        set(arr);
        setIsOpen(null);
  
        // setTimeout(() => {
        //   setCountryTable(countryTableTemp);
        // }, 1);
      };

    /* istanbul ignore next */
    return (
        <div className="credit-summary-wrapper">
            <Cards className="summary-card">
                <div className='top'>
                    <span className='title'>Summary</span>
                    <div className='top-action'>
                        {addSectionCheck && <Button
                            className="primary-blue medium save"
                            icon={{
                                color: '#fff',
                                icon: 'edit',
                                size: 'medium'
                            }}
                            label="Save"
                            handleOnClick={saveInvoiceItems}
                        />}
                        {editCheck && !addSectionCheck && (creditMemoData.status == 1 || creditMemoData.status == 2) && <Button
                            className="primary-blue medium edit"
                            icon={{
                                color: '#fff',
                                icon: 'edit',
                                size: 'medium'
                            }}
                            label="Edit"
                            handleOnClick={() => { setEditCheck(false) }}
                        />}
                        {!editCheck && <>
                            <Button
                                className="secondary-btn no-border medium save"
                                label="Cancel Edit"
                                handleOnClick={() => { setEditCheck(true) }}
                            />
                            <Button
                                className="primary-blue medium save-changes"
                                label="Save Changes"
                                handleOnClick={() => { setEditCheck(true) }}
                            />
                        </>}
                    </div>
                </div>
                {fieldValues.map((item: any, index: number) => {
                    // console.log(fieldValues)
                    return (
                        <>
                            <div className='UI-align-boxes margin-top'>
                                <div className='UI-line-text-box'>
                                    <DatePicker
                                        value={moment(item.serviceDate).format('DD MMM YYYY')}
                                        label="Service Date"
                                        disabled={editCheck}
                                        handleDateChange={(date: any) => { console.log(date) }}
                                    />
                                </div>
                                <div className='UI-line-text-box'>
                                    <Dropdown
                                        // handleDropOptionClick={function noRefCheck() { }}
                                        handleDropOptionClick={(option: any) =>
                                            handleArrOptionClick(
                                              option,
                                              multipleProductArr,
                                              setMultipleProductArr,
                                              setIsProductOpen,
                                              index
                                            )
                                          }
                                        handleDropdownClick={() => { console.log(productOptions)}}
                                        isOpen={false}
                                        isDisabled={editCheck}
                                        options={multipleProductArr[index] || []}//error
                                        title="Product Service"
                                    />
                                </div>
                                <div className='UI-line-text-box'>
                                    <Input
                                        value={item.description}
                                        label="Description"
                                        type="text"
                                        name="service-date-input"
                                        placeholder="Please enter"
                                        disable={editCheck}
                                    ></Input>
                                </div>
                                <div className='UI-line-text-box'>
                                    <Dropdown
                                        // handleDropOptionClick={function noRefCheck() { }}
                                        handleDropOptionClick={(option: any) =>
                                            handleArrOptionClick(
                                              option,
                                              multipleCountryArr,
                                              setMultipleCountryArr,
                                              setIsCountryOpen,
                                              index
                                            )
                                          }
                                        handleDropdownClick={() => { }}
                                        isOpen={false}
                                        isDisabled={editCheck}
                                        options={multipleCountryArr[index] || []}
                                        title="Service Country"
                                    />
                                </div>
                            </div>
                            <div className='UI-align-boxes margin-top-4'>
                                <div className='line-sec-width UI-flex'>
                                    <div className='quantity-box'>
                                        <Input
                                            value={item.quantity}
                                            label="Quantity"
                                            type="number"
                                            name="service-date-input"
                                            placeholder="Please enter"
                                            disable={editCheck}
                                        ></Input>
                                    </div>
                                    <div className='amount-box'>
                                        <Input
                                            value={toCurrencyFormat(item.amount)}
                                            label="Amount"
                                            type="text"
                                            name="service-date-input"
                                            placeholder="Please enter"
                                            disable={editCheck}
                                        ></Input>
                                    </div>
                                </div>
                                <div className='line-sec-width'>
                                    <Input
                                        value={toCurrencyFormat(item.totalAmount)}
                                        label="Total Amount"
                                        type="text"
                                        name="service-date-input"
                                        placeholder="Please enter"
                                        disable={editCheck}
                                    ></Input>
                                </div>
                            </div>
                            <div className='line-between'></div>
                        </>
                    )
                })}
                {addSectionCheck && <>
                    <div className='UI-align-boxes margin-top'>
                        <div className='UI-line-text-box'>
                            <DatePicker
                                value={moment(newServiceDate).format('DD MMM YYYY')}
                                label="Service Date"
                                disabled={false}
                                handleDateChange={(date: any) => { setNewServiceDate(date) }}
                            />
                        </div>
                        <div className='UI-line-text-box'>
                            <Dropdown
                                handleDropOptionClick={productDropOptionClick}
                                handleDropdownClick={setOpenProductService}
                                isOpen={openProductService}
                                isDisabled={false}
                                options={productOptions}
                                title="Product Service"
                            />
                        </div>
                        <div className='UI-line-text-box'>
                            <Input
                                setValue={setNewDescription}
                                value={newDescription}
                                label="Description"
                                type="text"
                                name="service-date-input"
                                disable={false}
                            ></Input>
                        </div>
                        <div className='UI-line-text-box'>
                            <Dropdown
                                handleDropOptionClick={CountryDropOptionClick}
                                handleDropdownClick={setOpenCountryService}
                                isOpen={openCountryService}
                                isDisabled={false}
                                options={countryOptions}
                                title="Service Country"
                            />
                        </div>
                    </div>
                    <div className='UI-align-boxes margin-top-4'>
                        <div className='line-sec-width UI-flex'>
                            <div className='quantity-box'>
                                <Input
                                    value={newQuantity}
                                    setValue={setNewQuantity}
                                    label="Quantity"
                                    type="number"
                                    name="service-date-input"
                                    disable={false}
                                ></Input>
                            </div>
                            <div className='amount-box'>
                                <Input
                                    value={newAmount}
                                    setValue={setNewAmount}
                                    label="Amount"
                                    type="text"
                                    name="service-date-input"
                                    disable={false}
                                ></Input>
                            </div>
                        </div>
                        <div className='line-sec-width'>
                            <Input
                                value={newTotalAmount}
                                setValue={setNewTotalAmount}
                                label="Total Amount"
                                type="text"
                                name="service-date-input"
                                disable={false}
                            ></Input>
                        </div>
                    </div>
                    <div className='line-between'></div>
                </>}
                <div className="feeSummaryCalc">
                    <div className="rowFee">
                        <p className="title">Subtotal Due</p>
                        {/* <p className="amount">{props.currency} {toCurrencyFormat(totalPayConverted)}</p> */}
                        <p className="amount">{currency} {toCurrencyFormat(creditMemoData.totalAmount)}</p>
                    </div>
                    <div className="rowFee no-border">
                        <p className="title">VAT Amount</p>
                        {/* <p className="amount">{props.currency} {toCurrencyFormat(totalPayConverted)}</p> */}
                        <p className="amount">{currency} {toCurrencyFormat(vatAmount)}</p>
                    </div>
                    <div className="totalRow">
                        <p>Total Balance</p>
                        <p className='total'>{currency} {toCurrencyFormat(creditMemoData.totalAmount + vatAmount)}</p>
                        {/* <p className='total'>{props.currency} {toCurrencyFormat(totalAmount)}</p> */}
                    </div>
                </div>
            </Cards>
            {(creditMemoData.status == 1 || creditMemoData.status == 2) && <Cards className="add-item">
                <Button
                    label="Add New Item"
                    className="secondary-btn large no-border"
                    icon={{
                        icon: 'circularAdd',
                        size: 'large',
                        color: '#526FD6'
                    }}
                    handleOnClick={showAddFields}
                />
            </Cards>}
            <div className='filesNotes'>
                <NotesWidget
                    notes={notes}
                    setNotes={setNotes}
                    isClient={isClient}
                    cid={cid}
                    id={id}
                ></NotesWidget>
                <FileUploadWidget
                    documents={documents}
                    setDocuments={setDocuments}
                    isClient={isClient}
                    cid={cid}
                    id={id}
                ></FileUploadWidget>
            </div>
            <Cards className='UI-change-log'>
                <Logs
                    data={[
                        {
                            customerEmail: 'danielal@email.com',
                            date: 'Sat May 14 2022',
                            fieldName: 'pay type',
                            newValue: 'NGN 70',
                            oldValue: 'NGN 65'
                        },
                        {
                            customerEmail: 'danielal@email.com',
                            date: '2',
                            fieldName: 'pay type',
                            newValue: 'NGN 70',
                            oldValue: 'NGN 65'
                        },
                        {
                            customerEmail: 'danielal@email.com',
                            date: '3',
                            fieldName: 'pay type',
                            newValue: 'NGN 70',
                            oldValue: 'NGN 65'
                        },
                        {
                            customerEmail: 'danielal@email.com',
                            date: '4',
                            fieldName: 'pay type',
                            newValue: 'NGN 70',
                            oldValue: 'NGN 65'
                        },
                        {
                            customerEmail: 'danielal@email.com',
                            date: '5',
                            fieldName: 'pay type',
                            newValue: 'NGN 70',
                            oldValue: 'NGN 65'
                        }
                    ]}
                    isOpen={openLogs}
                    handleUpDown={() => { setOpenLogs(!openLogs) }}
                    handleViewMore={function noRefCheck() { }}
                    name="View-change-log"
                    title="View Change Log"
                />
            </Cards>
        </div>
    )
}