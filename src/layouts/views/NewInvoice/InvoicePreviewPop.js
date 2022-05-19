import { useEffect, useState } from "react";
import { Button, Dropdown, Icon, DatePicker, Modal } from "atlasuikit";
import { format } from "date-fns";
import axios from "axios";
import "./InvoicePreviewPop.scss";
import { getCountryByCustomer, urls, productInvoice, CountryApi } from "../../../urls/urls";
import { tableSharedColumns } from "../../../sharedColumns/sharedColumns";

const InvoicePreviewPop = ({
    handleSteps,
    allStepsData,
    handleAllSteppersData,
}: any) => {

    const [open, setOpen] = useState(false)


    return (
        <div id="popover_main">
            <div id="popover">
                <div id="body_main">
                    <h1 id="title">Invoice Preview</h1>
                    <p id="description">Please preview the new payroll invoice has been created. You can access it right from here
                        or from the
                        Invoices listing page.</p>
                    <button id="button" onClick={() => setOpen(true)}>Preview Invoice</button>
                </div>``

                {/* POPUP */}
                <Modal isOpen={open}>
                    <div id="invoice_pop" onClick={() => setOpen(false)}>
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
                                <span>USD 300,523.15</span>
                                <span>USD 300,523.15</span>
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
                                    <div id="cards_date_container">
                                        <h3>Invoice Date</h3>
                                        <span id="description">01 Nov 2021</span>
                                    </div>
                                    <div id="cards_date_container">
                                        <h3>Invoice Date</h3>
                                        <span id="description">01 Nov 2021</span>
                                    </div>
                                    <div id="cards_date_container">
                                        <h3>Invoice Date</h3>
                                        <span id="description">01 Nov 2021</span>
                                    </div>
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

                            <div id="body_center">
                                <h3 id="title">Summary</h3>
                                <div id="body_center_cards">
                                    <div id="cards">
                                        <div id="cards_date_container">
                                            <h3>Invoice Date</h3>
                                            <span id="description">01 Nov 2021</span>
                                        </div>
                                        <div id="cards_date_container">
                                            <h3>Service Country</h3>
                                            <span id="description">USA- United States of America</span>
                                        </div>
                                    </div>
                                    <div id="cards">
                                        <div id="cards_date_container">
                                            <h3>Invoice Date</h3>
                                            <span id="description">Contract Termination Fee</span>
                                        </div>
                                        <div id="cards_date_container">
                                            <h3>Quantity</h3>
                                            <span id="description">50</span>
                                        </div>
                                    </div>
                                    <div id="cards">
                                        <div id="cards_date_container">
                                            <h3>Description</h3>
                                            <span id="description">Some option</span>
                                        </div>
                                        <div id="cards_date_container">
                                            <h3>Amount</h3>
                                            <span id="description">1,000.00</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="invoice_bottom">
                                <span id="bal_text">Total Balance</span>
                                <span id="button">USD 130,913.15</span>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div >
        </div >
    );
};

export default InvoicePreviewPop;