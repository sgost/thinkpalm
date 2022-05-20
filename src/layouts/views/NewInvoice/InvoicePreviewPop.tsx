import { useState } from "react";
import { Icon, Modal } from "atlasuikit";
import "./InvoicePreviewPop.scss";

const InvoicePreviewPop = ({
    accessToken,
    stepperOneData,
    YearOptions,
    MonthOptions,
    CountryOptions,
    CustomerOptions,
    typeOptions,

    todos,
    dateFrom,
    productService,
    countryService,
    description,
    quantity,
    amount,
    newArrPush,
    Open,
    newArrPushs,
    Opens,
}: any) => {

    console.log('accessToken', accessToken)
    console.log('stepperOneData', stepperOneData)
    console.log('YearOptions', YearOptions)
    console.log('MonthOptions', MonthOptions)
    console.log('CountryOptions', CountryOptions)
    console.log('CustomerOptions', CustomerOptions)
    console.log('typeOptions', typeOptions)
    console.log('dateFrom', dateFrom)
    console.log('productService', productService)

    console.log('description', description)
    console.log('quantity', quantity)
    console.log('amount', amount)
    console.log('countryService', countryService)
    console.log('newArrPush', newArrPush)
    console.log('Open', Open)
    console.log('newArrPushs', newArrPushs)
    console.log('Opens', Opens)


    const [opend, setOpend] = useState(false)

    const emptyAmount: any = []
    const amountPush = todos.map((item: any) => emptyAmount.push(item.balance))
    const newAmount = emptyAmount.reduce((partialSum, a) => partialSum + a, 0)

    console.log('todos', todos)
    console.log('emptyAmount', emptyAmount)
    console.log('amountPush', amountPush)
    console.log('newAmount', newAmount)


    return (
        <div id="popover_main" style={{ background: `white`, padding: `40px 80px`, borderRadius: `0.5rem` }}>
            <div id="popover" >
                <div id="body_main" >
                    <h1 id="title">Invoice Preview</h1>
                    <p id="description">Please preview the new payroll invoice has been created. You can access it right from here
                        or from the
                        Invoices listing page.</p>
                    <button id="button" onClick={() => setOpend(true)}>Preview Invoice</button>
                </div>

                {/* POPUP */}
                <Modal isOpen={opend}>
                    <div id="invoice_pop" onClick={() => setOpend(false)}>
                        <span id="close"><Icon
                            color="white"
                            icon="remove"
                            size="large"
                        /></span>
                        <div id="invoice_head">
                            <div id="head_title">
                                <h1><span><Icon
                                    color="#17224E"
                                    icon="invoices"
                                    size="large"
                                    className="title_icon"
                                /></span>Credit Memo No. 791230</h1>
                            </div>
                            <div id="head_price">
                                {todos.map((item) =>
                                    <span>USD {item.balance}</span>
                                )}
                            </div>
                        </div>

                        <div id="invoice_body">
                            <div id="body_top">
                                <div id="cards">
                                    <h3>From</h3>
                                    <span id="description">Elements Global Services</span>
                                </div>
                                <div id="cards">
                                    <div id="cards_sub_div">
                                        <h3>To</h3>
                                        <span id="name">Camila Lopez</span>
                                        <span id="content">1101 15th Street NW 90001, Los Angeles, CA United States of America</span>
                                    </div>
                                </div>
                                <div id="cards">
                                    {todos.map((item) =>
                                        <div id="cards_date_container">
                                            <h3>Invoice Date</h3>
                                            <span id="description">{item.date}</span>
                                        </div>
                                    )}
                                </div>
                                <div id="cards">
                                    <div id="cards_date_container">
                                        <h3>Location</h3>
                                        <span id="description">Nigeria</span>
                                    </div>
                                    <div id="cards_date_container">
                                        <h3>Region</h3>
                                        <span id="description">EMEA</span>
                                    </div>
                                    <div id="cards_date_container">
                                        <h3>Billing Currency</h3>
                                        <span id="description">USD</span>
                                    </div>
                                </div>
                            </div>
                            <div id='cards_main_div'>
                                {todos.map((item) =>
                                    <div id="body_center">
                                        <h3 id="title">Summary</h3>
                                        <div id="body_center_cards">
                                            <div id="cards">
                                                <div id="cards_date_container">
                                                    <h3>Invoice Date</h3>
                                                    <span id="description">{item.date}</span>
                                                </div>
                                                <div id="cards_date_container">
                                                    <h3>Service Country</h3>
                                                    <span id="description">{item.country}</span>
                                                </div>
                                            </div>
                                            <div id="cards">
                                                <div id="cards_date_container">
                                                    <h3>Invoice Type</h3>
                                                    <span id="description">{item.product}</span>
                                                </div>
                                                <div id="cards_date_container">
                                                    <h3>Quantity</h3>
                                                    <span id="description">{item.quantity}</span>
                                                </div>
                                            </div>
                                            <div id="cards">
                                                <div id="cards_date_container">
                                                    <h3>Description</h3>
                                                    <span id="description">{item.description}</span>
                                                </div>
                                                <div id="cards_date_container">
                                                    <h3>Amount</h3>
                                                    <span id="description">{item.amount}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div id="invoice_bottom">
                                <span id="bal_text">Total Balance</span>
                                <span id="button">USD {newAmount}</span>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div >
        </div >
    );
};

export default InvoicePreviewPop;