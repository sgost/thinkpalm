import { Cards, Button, Dropdown, Logs } from 'atlasuikit';
import { useState } from 'react';
import FileUploadWidget from '../../../components/FileUpload';
import Input from '../../../components/Input/input';
import NotesWidget from '../../../components/Notes';
import "./creditMemoSummary.scss";

export default function CreditMemoSummary(props: any) {

    const { notes, setNotes, documents, setDocuments, isClient, cid, id } = props
    const [serviceDate, setServiceDate] = useState('');
    const [openProductService, setOpenProductService] = useState(false);
    const [openLogs, setOpenLogs] = useState(false);

    /* istanbul ignore next */
    return (
        <div className="credit-summary-wrapper">
            <Cards className="summary-card">
                <div>
                    <div className='top'>
                        <span className='title'>Summary</span>
                        <Button
                            className="primary-blue medium edit"
                            icon={{
                                color: '#fff',
                                icon: 'edit',
                                size: 'medium'
                            }}
                            label="Edit"
                        />
                    </div>
                    <div className='UI-align-boxes'>
                        <div className='UI-line-text-box'>
                            <Input
                                defaultValue=""
                                label="Service Date"
                                type="text"
                                disable={true}
                                name="service-date-input"
                                placeholder="Please enter"
                            ></Input>
                        </div>
                        <div className='UI-line-text-box'>
                            <Dropdown
                                handleDropOptionClick={function noRefCheck() { }}
                                handleDropdownClick={setOpenProductService}
                                isOpen={openProductService}
                                name="Flavours1"
                                isDisabled={true}
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
                                disable={true}
                            ></Input>
                        </div>
                        <div className='UI-line-text-box'>
                            <Input
                                defaultValue=""
                                label="Service Country"
                                type="text"
                                name="service-date-input"
                                placeholder="Please enter"
                                disable={true}
                            ></Input>
                        </div>
                    </div>
                    <div className='UI-align-boxes margin-top-4'>
                        <div className='quantity-box'>
                            <Input
                                defaultValue=""
                                label="Quantity"
                                type="number"
                                name="service-date-input"
                                placeholder="Please enter"
                                disable={true}
                            ></Input>
                        </div>
                        <div className='amount-box'>
                            <Input
                                defaultValue=""
                                label="Amount"
                                type="number"
                                name="service-date-input"
                                placeholder="Please enter"
                                disable={true}
                            ></Input>
                        </div>
                        <div className='UI-line-text-box'>
                            <Input
                                defaultValue=""
                                label="Total Amount"
                                type="number"
                                name="service-date-input"
                                placeholder="Please enter"
                                disable={true}
                            ></Input>
                        </div>
                    </div>
                    <div className='line-between'></div>
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
                </div>
            </Cards>
            <Cards className="add-item">
                <Button
                    label="Secondary Button"
                    className="secondary-btn large no-border"
                    icon={{
                        icon: 'circularAdd',
                        size: 'large',
                        color: '#526FD6'
                    }}
                />
            </Cards>
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