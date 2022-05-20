import { Table, Modal, Cards, Icon, FileHandler, Button, Banner } from 'atlasuikit';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { amountWithCommas, customDate, formatFileSize, formatTimePeriod, ToastContainer } from '../../../components/Comman/Utils/utils'  // 'src/components/Comman/Utils/utils';
import { profileImageEmpty } from '../../../assets/icons/index';
import "./billTable.scss";

/* istanbul ignore next */
export const getFlagURL = (code: string, size?: string) => {
    return `https://flagcdn.com/${size ? size : '20x15'
        }/${code.toLocaleLowerCase()}.png`;
};

export default function BillsTable(props: any) {
    const customerId = props.customerId;
    const invoiceId = props.invoiceId
    const basecontractorURL = "https://apigw-dev-eu.atlasbyelements.com/billingservice/api/billing/";
    const rejectEndPoint = "bill/reject"
    const documentDownloadApi = "https://apigw-dev-eu.atlasbyelements.com/contractorpay/api/document/personal/download?fileID="
    const endpoint = "customer/bills?"
    const TableColumns = {
        columns: [
            { header: "Bill Reference No.", isDefault: true, key: "referenceNo" },
            { header: "Contractor Name", isDefault: true, key: "contractorName" },
            { header: "Contractor ID", isDefault: true, key: "contractor_id" },
            { header: "Country", isDefault: true, key: "country" },
            { header: "Pay Amount", isDefault: true, key: "payAmount" },
            { header: "FX Rate", isDefault: true, key: "exchangeRate" },
            { header: "Pay Converted", isDefault: true, key: "payConverted" },
            { header: "Total", isDefault: true, key: "total" }
        ],
        showDefaultColumn: true,
    }
    const [tableData, setTableData] = useState<any>([]);
    const [totalPayConverted, setTotalPayConverted] = useState<number>(0);
    const [openModal, setOpenModal] = useState(false);
    const [clickedApiData, setClickedApiData] = useState<any>(null);
    const [rejectBanner, setRejectBanner] = useState(false);
    const [moveNextBanner, setMoveNextBanner] = useState(false);
    const [openRejectReason, setOpenRejectReason] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [rawData, setRawData] = useState<any>([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    useEffect(() => {
        let data: any = [];
        let paysConverted = 0;
        rawData.forEach((item: any) => {
            data.push({
                referenceNo: item.billReferenceNo || '-',
                contractorName: {
                    value: item.contractorName || '-',
                    img: { src: item.imageUrl || profileImageEmpty, shape: 'round' }
                },
                contractor_id: item.contractorId || '-',
                country: {
                    value: item.countryName || '-',
                    img: { src: item.countryCode ? getFlagURL(item.countryCode) : null }
                },
                payAmount: (item.billingCurrencyCode || '-') + ' ' + toCurrencyFormat(item.payAmount),
                exchangeRate: item.exchangeRate.toFixed(2),
                payConverted: props.currency + ' ' + toCurrencyFormat(item.payAmount * item.exchangeRate.toFixed(2)),
                total: props.currency + ' ' + toCurrencyFormat(item.payAmount * item.exchangeRate.toFixed(2))
            })
            paysConverted = paysConverted + (item.payAmount * item.exchangeRate.toFixed(2));
        })
        setTotalPayConverted(paysConverted);
        setTableData(data);
    }, [rawData])

    useEffect(() => {
        if (props?.tableData?.data) {
            setRawData(props?.tableData?.data || []);
        }
    }, [props.tableData])

    const toCurrencyFormat = (amount: any) => {
        const cFormat = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        });

        return cFormat.format(amount).slice(1);
    };
    /* istanbul ignore next */
    const openBillDetailModal = (rowData: any) => {
        setOpenModal(!openModal);
        axios
            .get(basecontractorURL + endpoint + "BillReferenceNumber=" + rowData.referenceNo + "&CustomerId=" + customerId, { headers: { accept: "text/plain", customerid: customerId } })
            .then((response: any) => {
                if (response.status == 200) {
                    setClickedApiData(response.data.data.data[0]);
                    console.log(response.data.data.data[0]);
                } else {
                    console.log("Bill API failing on contractor service");
                }
            })
            .catch((e: any) => {
                console.log("error", e);
            });

    }
    /* istanbul ignore next */
    const rejectBillCall = () => {
        let payload: any = [{
            id: clickedApiData?.id,
            reason: rejectReason
        }];
        axios
            .post(basecontractorURL + rejectEndPoint, payload, { headers: { accept: "text/plain" } })
            .then((response: any) => {

                if (response.status == 200 && response.data.responseCode == 200) {
                    if (moveNextBanner) {
                        setMoveNextBanner(false);
                        setOpenRejectReason(false);
                        setRejectReason('');
                        setOpenModal(false);
                        setShowToast(true);
                        setToastMessage(`Bill Reference No. ${clickedApiData?.referenceNumber} has been moved to a new invoice and Invoice No. ${invoiceId} has been Voided.`);
                        props.navigate("/pay");
                    } else {
                        setRejectBanner(false);
                        setOpenRejectReason(false);
                        setRejectReason('');
                        setOpenModal(false);
                        setRawData(rawData.filter((x: any) => x.billReferenceNo != clickedApiData.referenceNumber));
                        setShowToast(true);
                        setToastMessage(`${clickedApiData?.referenceNumber} has been rejected.`);
                    }
                } else {
                    console.log("Bill reject API failing on contractor service");
                }

            })
            .catch((e: any) => {
                console.log("error", e);
            });
    }
    /* istanbul ignore next */
    const getBillingPeriodText = () => {
        const format = "DD MMM YYYY";
        const startDate = customDate(clickedApiData.startDate, format);
        const endDate = customDate(clickedApiData.endDate, format);
        return formatTimePeriod(startDate, endDate);
    };
    /* istanbul ignore next */
    const getSignedDownloadURL = async (payload: any = {}) => {
        axios
            .get(documentDownloadApi + payload.fileID, { headers: { accept: "*/*" } })
            .then((response: any) => {
                if (response.status == 200) {
                    return response.data;
                } else {
                    console.log("Document Download API failing on contractor service");
                }
            })
            .catch((e: any) => {
                console.log("error", e);
            });
    };
    return (
        <div className="invoice_bill_table">
            <Table
                options={{
                    ...TableColumns,
                    ...{ data: tableData }
                }}
                handleRowClick={(rowData: any) => { openBillDetailModal(rowData) }}
                colSort
                pagination
                pagingOptions={[15, 30, 45, 60]}

            />
            <div className="feeSummaryCalc">
                <div className="rowFee">
                    <p className="title">Pay Converted Total</p>
                    <p className="amount">{props.currency} {toCurrencyFormat(totalPayConverted)}</p>
                </div>
                <div className="totalRow">
                    <p>Total Due</p>
                    <p className='total'>{props.currency} {toCurrencyFormat(totalPayConverted)}</p>
                </div>
            </div>
            <div className='modal-wrapper'>
                <Modal
                    className="zero-padding"
                    handleClose={() => { setOpenModal(false); setRejectBanner(false) }}
                    width="79.625rem"
                    height="auto"
                    isOpen={openModal}
                >
                    {clickedApiData && <div className='modal-content'>
                        <Cards className="view-bills" style={{
                            background: "#E0E5F8"
                        }}>
                            <div className='section-1'>
                                <div className="bill-status">{clickedApiData.customerViewStatus.billStatus}</div>
                                <div className="mt-4">
                                    <Icon
                                        icon="invoices"
                                        width="30"
                                        height="30"
                                        color="#041e42"
                                        viewBox="-2 0 24 24" />
                                    <span className="reference-description">Bill Reference No. {clickedApiData.referenceNumber}</span>
                                </div>
                            </div>
                            <div className='section-2'>
                                Total&nbsp;&nbsp;{clickedApiData.contractor?.currencyCode} <span>{amountWithCommas(clickedApiData.total)}</span>
                            </div>
                        </Cards>
                        <div className='bill-details'>
                            <div className='bill-details__section'>
                                <div className='bill-details__info'>
                                    <label>From</label>
                                    <div className='title'><span>{clickedApiData.contractor.name}</span></div>
                                    <div className='sub-title'><span>Contractor ID {clickedApiData.contractor?.contractorId}</span></div>
                                </div>
                            </div>
                            <div className='bill-details__section'>
                                <div className='bill-details__info'>
                                    <label>To</label>
                                    <div className='title'><span>{clickedApiData.customer?.name ? clickedApiData.customer?.name : "Global Enterprise Solutions"}</span></div>
                                    <div className='sub-title'><span>1101 15th Street NW 90001, Los Angeles, CA United States of America</span></div>
                                </div>
                            </div>
                            <div className='bill-details__section'>
                                <div className='bill-details__info'>
                                    <label>Billing Period</label>
                                    <div className='title'><span>{getBillingPeriodText()}</span></div>
                                    {/* <div className='title'><span>{"1-31 Jan 2022"}</span></div> */}
                                    <label>Bill Sent</label>
                                    <div className='title'><span>{customDate(clickedApiData.submittedDate, "DD MMM YYYY")}</span></div>
                                    {/* <div className='title'><span>{"21 Jan 2022"}</span></div> */}
                                </div>
                            </div>
                            <div className='bill-details__section'>
                                <div className='bill-details__info'>
                                    <label>Contractor's Currency</label>
                                    <div className='title'><span>{clickedApiData.contractor?.currencyCode}</span></div>
                                    <label>Billing Currency</label>
                                    <div className='title'><span>{props.currency}</span></div>
                                </div>
                            </div>
                        </div>
                        <div className='line-between'></div>
                        <div className='file-row'>
                            <div className="a-cards__title"><span>Bill Details</span></div>
                            <div className="bills-file-handler">
                                <div className="file-handler-column">
                                    <FileHandler
                                        icons={{
                                            prefix: {
                                                color: '#526FD6',
                                                height: '35',
                                                icon: 'multipleFiles',
                                                width: '35'
                                            },
                                            suffix: [
                                                {
                                                    color: '#526FD6',
                                                    height: '35',
                                                    icon: 'download',
                                                    width: '35',
                                                    handleOnClick: /* istanbul ignore next */ async () => {
                                                        getSignedDownloadURL({ fileID: clickedApiData.documents[0]?.documentId }).then((data: any) => {
                                                            window.open(data?.url, '_blank');
                                                        });
                                                    },
                                                    disabled: !(clickedApiData?.documents
                                                        && clickedApiData.documents?.length > 0)
                                                }
                                            ]
                                        }}
                                        label={{
                                            footer: formatFileSize(clickedApiData.documents[0] && clickedApiData.documents[0].size),
                                            header: clickedApiData.documents[0] && clickedApiData.documents[0].fileName
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="mt-5">
                                <span className="sup-label">Billing Period</span>
                                <div className="bill-identity">
                                    <span className="info">{getBillingPeriodText()}</span>
                                </div>
                            </div>
                            <div className="mt-5 d-flex description-number">
                                <div>
                                    <span className="sup-label">Billing Description</span>
                                    <div className="bill-identity">
                                        <span className="info">{clickedApiData.description}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 d-flex bill-total">
                                <div className='justification'>
                                    <span>Bill Total</span><span className='total-value'>{clickedApiData?.contractor?.currencyCode} {amountWithCommas(clickedApiData.total)}</span>
                                </div>
                            </div>

                        </div>
                        <div className='margin-top'>
                            {rejectBanner && <Banner type="warning">
                                <div
                                    style={{
                                        display: 'flex',
                                        width: '100%',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Icon
                                        className="reject-banner-icon"
                                        color="orange"
                                        icon="info"
                                        viewBox="3 0 24 24"
                                    />
                                    <span className='info-banner'>
                                        <strong>Heads up!</strong> This bill was approved and added to <strong>Invoice {invoiceId}</strong>. Are you sure you want to reject it and remove it from this invoice?
                                    </span>
                                </div>
                            </Banner>}
                            {moveNextBanner && <Banner type="warning">
                                <div
                                    style={{
                                        display: 'flex',
                                        width: '100%',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Icon
                                        className="reject-banner-icon"
                                        color="orange"
                                        icon="info"
                                        viewBox="3 0 24 24"
                                    />
                                    <span className='info-banner'>
                                        <strong>Heads up!</strong> This bill is currently included in <strong>Invoice {invoiceId}</strong>.
                                        If you move it to the next invoice, this invoice will be voided and the bill will automatically be
                                        added to the next invoice that is generated for you. Do you want to continue?
                                    </span>
                                </div>
                            </Banner>}
                        </div>
                        <div className='action-btns'>

                            <div className='justification margin-right'>
                                {!(rejectBanner || moveNextBanner) && <><Button
                                    label="Reject Bill"
                                    className="secondary-btn medium secondary-button reject-button"
                                    handleOnClick={() => { setRejectBanner(true) }}
                                />
                                    <Button
                                        className="primary-blue medium primary next-invoice-button"
                                        label="Move To Next Invoice"
                                        handleOnClick={() => { setMoveNextBanner(true) }}
                                    />
                                </>}

                                {moveNextBanner ? (<>
                                    <Button
                                        label="Cancel"
                                        className="secondary-btn medium secondary-button cancel-button"
                                        handleOnClick={() => { setMoveNextBanner(false) }}
                                    />
                                    <Button
                                        className="primary-blue medium primary move-to-next-button"
                                        label="Yes, Move To Next Invoice"
                                        handleOnClick={() => { setOpenRejectReason(true) }}
                                    />
                                </>) : (<>
                                    {rejectBanner && <><Button
                                        label="Cancel"
                                        className="secondary-btn medium secondary-button cancel-button"
                                        handleOnClick={() => { setRejectBanner(false) }}

                                    />
                                        <Button
                                            className="primary-blue medium primary approve-reject-button"
                                            label="Yes, Reject Bill"
                                            handleOnClick={() => { setOpenRejectReason(true) }}
                                        /></>}
                                </>)}

                            </div>
                        </div>
                        <Modal
                            className="zero-padding"
                            handleClose={setOpenRejectReason}
                            width="32.5rem"
                            height="auto"
                            isOpen={openRejectReason}
                        >
                            <div className='reject-reason-wrapper'>
                                <div className='reason-heading'>
                                    Add A Rejection Reason
                                </div>
                                <div className='reject-text'>
                                    Please add a comment for <strong>{clickedApiData.contractor.name}</strong> about why you rejected this bill.
                                </div>
                                <div className="form-group">
                                    <label>
                                        Bill Rejection Reason<span className="required">*</span>
                                    </label>
                                    <textarea
                                        name="reason"
                                        className="a-input"
                                        placeholder="Please Enter a Reason"
                                        maxLength={400}
                                        onChange={(e) => {
                                            setRejectReason(e.target.value);
                                            console.log(e.target.value);
                                        }}
                                        value={rejectReason}
                                        rows={4}
                                        data-testid="reject-reason-text"
                                    />
                                </div>
                                <div className='reject-action'>
                                    <Button
                                        label="Cancel"
                                        className="secondary-btn medium secondary-button cancel-button"
                                        handleOnClick={() => { setRejectBanner(false); setOpenRejectReason(false); setRejectReason('') }}
                                    />
                                    <Button
                                        className="primary-blue medium primary cancel-button"
                                        label="Reject"
                                        handleOnClick={() => { rejectBillCall() }}
                                    />
                                </div>
                            </div>
                        </Modal>
                    </div>}
                    {!clickedApiData && <div>
                        Loading...
                    </div>}
                </Modal>
            </div>
            <ToastContainer showToast={showToast} setShowToast={setShowToast} message={toastMessage} />
        </div>

    );
}