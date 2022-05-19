import { Cards, Button, Dropdown, Logs, DatePicker } from 'atlasuikit';
import { te } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import FileUploadWidget from '../../../components/FileUpload';
import Input from '../../../components/Input/input';
import NotesWidget from '../../../components/Notes';
import "./creditMemoSummary.scss";

export default function CreditMemoSummary(props: any) {

    const { notes, setNotes, documents, setDocuments, isClient, cid, id, invoiceStatusId, invoiceItems } = props
    const [serviceDate, setServiceDate] = useState('');
    const [openProductService, setOpenProductService] = useState(false);
    const [openLogs, setOpenLogs] = useState(false);
    const [addSectionCheck, setAddSectionCheck] = useState(false);
    const [editCheck, setEditCheck] = useState(true);
    const [fieldValues, setFieldValues] = useState(invoiceItems);
    const showAddFields = () => {
        setAddSectionCheck(true);
    }
    useEffect(() => {
      
    
    }, [])
    
    const toCurrencyFormat = (amount: number) => {
        const cFormat = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        });
        return cFormat.format(amount).slice(1);
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
                            handleOnClick={() => { setAddSectionCheck(false) }}
                        />}
                        {editCheck && (invoiceStatusId == 1 || invoiceStatusId == 2) && <Button
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
                {fieldValues.map((item: any) => {
                    return (
                        <>
                            <div className='UI-align-boxes margin-top'>
                                <div className='UI-line-text-box'>
                                    <DatePicker
                                        label="Service Date"
                                        disabled={editCheck}
                                        handleDateChange={(date: any) => { console.log(date) }}
                                    />
                                </div>
                                <div className='UI-line-text-box'>
                                    <Dropdown
                                        handleDropOptionClick={function noRefCheck() { }}
                                        handleDropdownClick={setOpenProductService}
                                        isOpen={openProductService}
                                        name="Flavours1"
                                        isDisabled={editCheck}
                                        options={[
                                            {
                                                isSelected: false,
                                                label: 'Chocolate',
                                                value: 'chocolate'
                                            },
                                            {
                                                isSelected: false,
                                                label: 'Strawberry',
                                                value: 'strawberry'
                                            },
                                            {
                                                isSelected: false,
                                                label: 'Vanilla',
                                                value: 'vanilla'
                                            }
                                        ]}
                                        title="Product Service"
                                    />
                                </div>
                                <div className='UI-line-text-box'>
                                    <Input
                                        defaultValue={item.description}
                                        label="Description"
                                        type="text"
                                        name="service-date-input"
                                        placeholder="Please enter"
                                        disable={editCheck}
                                    ></Input>
                                </div>
                                <div className='UI-line-text-box'>
                                    <Dropdown
                                        handleDropOptionClick={function noRefCheck() { }}
                                        handleDropdownClick={setOpenProductService}
                                        isOpen={openProductService}
                                        name="Flavours1"
                                        isDisabled={editCheck}
                                        options={[
                                            {
                                                isSelected: false,
                                                label: 'Chocolate',
                                                value: 'chocolate'
                                            },
                                            {
                                                isSelected: false,
                                                label: 'Strawberry',
                                                value: 'strawberry'
                                            },
                                            {
                                                isSelected: false,
                                                label: 'Vanilla',
                                                value: 'vanilla'
                                            }
                                        ]}
                                        title="Service Country"
                                    />
                                </div>
                            </div>
                            <div className='UI-align-boxes margin-top-4'>
                                <div className='line-sec-width UI-flex'>
                                    <div className='quantity-box'>
                                        <Input
                                            defaultValue={item.quantity}
                                            label="Quantity"
                                            type="number"
                                            name="service-date-input"
                                            placeholder="Please enter"
                                            disable={editCheck}
                                        ></Input>
                                    </div>
                                    <div className='amount-box'>
                                        <Input
                                            defaultValue={toCurrencyFormat(item.amount)}
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
                                        defaultValue={toCurrencyFormat(item.totalAmount)}
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
                                label="Service Date"
                                disabled={false}
                                handleDateChange={(date: any) => { console.log(date) }}
                            />
                        </div>
                        <div className='UI-line-text-box'>
                            <Dropdown
                                handleDropOptionClick={function noRefCheck() { }}
                                handleDropdownClick={setOpenProductService}
                                isOpen={openProductService}
                                name="Flavours1"
                                isDisabled={false}
                                options={[
                                    {
                                        isSelected: false,
                                        label: 'Chocolate',
                                        value: 'chocolate'
                                    },
                                    {
                                        isSelected: false,
                                        label: 'Strawberry',
                                        value: 'strawberry'
                                    },
                                    {
                                        isSelected: false,
                                        label: 'Vanilla',
                                        value: 'vanilla'
                                    }
                                ]}
                                title="Product Service"
                            />
                        </div>
                        <div className='UI-line-text-box'>
                            <Input
                                defaultValue=""
                                label="Description"
                                type="text"
                                name="service-date-input"
                                placeholder="Please enter"
                                disable={false}
                            ></Input>
                        </div>
                        <div className='UI-line-text-box'>
                            <Dropdown
                                handleDropOptionClick={function noRefCheck() { }}
                                handleDropdownClick={setOpenProductService}
                                isOpen={openProductService}
                                name="Flavours1"
                                isDisabled={editCheck}
                                options={[
                                    {
                                        isSelected: false,
                                        label: 'Chocolate',
                                        value: 'chocolate'
                                    },
                                    {
                                        isSelected: false,
                                        label: 'Strawberry',
                                        value: 'strawberry'
                                    },
                                    {
                                        isSelected: false,
                                        label: 'Vanilla',
                                        value: 'vanilla'
                                    }
                                ]}
                                title="Service Country"
                            />
                        </div>
                    </div>
                    <div className='UI-align-boxes margin-top-4'>
                        <div className='line-sec-width UI-flex'>
                            <div className='quantity-box'>
                                <Input
                                    defaultValue=""
                                    label="Quantity"
                                    type="number"
                                    name="service-date-input"
                                    placeholder="Please enter"
                                    disable={false}
                                ></Input>
                            </div>
                            <div className='amount-box'>
                                <Input
                                    defaultValue=""
                                    label="Amount"
                                    type="number"
                                    name="service-date-input"
                                    placeholder="Please enter"
                                    disable={false}
                                ></Input>
                            </div>
                        </div>
                        <div className='line-sec-width'>
                            <Input
                                defaultValue=""
                                label="Total Amount"
                                type="number"
                                name="service-date-input"
                                placeholder="Please enter"
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
                        <p className="amount">{"USD"} {"1000.00"}</p>
                    </div>
                    <div className="rowFee no-border">
                        <p className="title">VAT Amount</p>
                        {/* <p className="amount">{props.currency} {toCurrencyFormat(totalPayConverted)}</p> */}
                        <p className="amount">{"USD"} {"1000.00"}</p>
                    </div>
                    <div className="totalRow">
                        <p>Total Balance</p>
                        <p className='total'>{"USD"} {"2000.00"}</p>
                        {/* <p className='total'>{props.currency} {toCurrencyFormat(totalPayConverted)}</p> */}
                    </div>
                </div>
            </Cards>
            {(invoiceStatusId == 1 || invoiceStatusId == 2) && <Cards className="add-item">
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