import { Table, Modal, Cards, Icon, FileHandler, Button, Banner } from 'atlasuikit';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useEffect, useState } from 'react';
import { amountWithCommas, customDate, formatFileSize, formatTimePeriod, ToastContainer } from '../../../components/Comman/Utils/utils'  // 'src/components/Comman/Utils/utils';
import { profileImageEmpty } from '../../../assets/icons/index';
import {
    urls
} from "../../../urls/urls";
import cn from "classnames";
import "./billTable.scss";

/* istanbul ignore next */
export const getFlagURL = (code: string, size?: string) => {
    return `https://flagcdn.com/${size ? size : '20x15'
        }/${code.toLocaleLowerCase()}.png`;
};

export default function BillsTable(props: any) {
    const currentOrgId: any = localStorage.getItem("current-org-id");
    const accessToken: any = localStorage.getItem("accessToken");
    const decoded: any = jwt_decode(accessToken);
    var listingRole = decoded.Permissions[currentOrgId].ContractorPay.Bill.includes("ElementsGeneralList");
    const customerId = props.customerId;
    const invoiceId = props.invoiceId;
    const total = props.totalAmount;
    const basecontractorURL = urls.contractorBillingService;
    const rejectEndPoint = "bill/reject"
    const moveToNextEndPoint = "bill/removeinvoice"
    const documentDownloadApi = "https://apigw-dev-eu.atlasbyelements.com/contractorpay/api/document/personal/download?fileID="
    const customerEndpoint = "customer/bills?";
    const elementsEndpoint = "elements/bills?";
    const TableColumns = {
        columns: [
            { header: "Bill Ref No.", isDefault: true, key: "referenceNo" },
            { header: "Contractor Name", isDefault: true, key: "contractorName" },
            { header: "Contractor ID", isDefault: true, key: "contractor_id" },
            { header: "Country", isDefault: true, key: "country" },
            { header: "Pay Amount", isDefault: true, key: "payAmount" },
            { header: "FX Rate", isDefault: true, key: "exchangeRate" },
            { header: "Pay Converted", isDefault: true, key: "payConverted" },
            { header: "Same Currency Fees", isDefault: true, key: "sameCurrencyFee" },
            { header: "FX Fees", isDefault: true, key: "fxFee" },
            { header: "Money Transfer Fees", isDefault: true, key: "moneyTransferFee" },
            { header: "Total", isDefault: true, key: "total" }
        ],
        showDefaultColumn: true,
    }
    const [tableData, setTableData] = useState<any>([]);
    const [openModal, setOpenModal] = useState(false);
    const [clickedApiData, setClickedApiData] = useState<any>(null);
    const [rejectBanner, setRejectBanner] = useState(false);
    const [moveNextBanner, setMoveNextBanner] = useState(false);
    const [openRejectReason, setOpenRejectReason] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [rawData, setRawData] = useState<any>([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const { state }: any = props;
    localStorage.removeItem("redirectingReferenceNumber");
    localStorage.removeItem("voidedInvoice");

    /* istanbul ignore next */
    useEffect(() => {
        if (state?.referenceNumber) {
            setShowToast(true);
            const message = state.isMoveBills ? `Bill No. ${state.referenceNumber} Has Been Moved To The Next Invoice.` : `Bill No. ${state.referenceNumber} Has Been Rejected and Removed From The Invoice.`
            setToastMessage(message);
        }
    }, [state?.referenceNumber, state?.isMoveBills]);

    /* istanbul ignore next */
    useEffect(() => {
        let data: any = [];
        rawData?.invoiceBills?.forEach((item: any) => {
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
                exchangeRate: item.exchangeRate,
                payConverted: props.currency + ' ' + toCurrencyFormat(item.payConverted),
                sameCurrencyFee: props.currency + ' ' + toCurrencyFormat(item.sameCurrencyFee || 0),
                fxFee: props.currency + ' ' + toCurrencyFormat(item.fxFee || 0),
                moneyTransferFee: props.currency + ' ' + toCurrencyFormat(item.moneyTransferFee || 0),
                total: props.currency + ' ' + toCurrencyFormat((item.payAmount * item.exchangeRate) + (item.sameCurrencyFee || 0) + (item.fxFee || 0) + (item.moneyTransferFee || 0))
            });
        });
        setTableData(data);
    }, [rawData])

    /* istanbul ignore next */
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
            .get(basecontractorURL + (listingRole ? elementsEndpoint : customerEndpoint) + "BillReferenceNumber=" + rowData.referenceNo + "&CustomerId=" + customerId, {
                headers: {
                    accept: "text/plain",
                    customerid: currentOrgId || "",
                    authorization: `Bearer ${localStorage.accessToken}`
                }
            })
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
    const handleInvoiceRedirect = (_invoiceId: string, isMoveBills: boolean) => {
        const data = rawData.filter((x: any) => x.billReferenceNo !== clickedApiData.referenceNumber);
        if (data.length === 0) {
            localStorage.removeItem("redirectingInvoiceState");
            localStorage.setItem("redirectingReferenceNumber", clickedApiData?.referenceNumber);
            localStorage.setItem("voidedInvoice", JSON.stringify({
                invoiceId: _invoiceId,
                isMoveBills
            }));
        }
        else localStorage.setItem("redirectingInvoiceState", JSON.stringify({
            invoiceId,
            referenceNumber: clickedApiData?.referenceNumber,
            isMoveBills
        }));
        props.navigate("/pay");
    };

    /* istanbul ignore next */
    const rejectBillCall = () => {
        let payload: any = [{
            id: clickedApiData?.id,
            reason: rejectReason
        }];
        axios
            .post(basecontractorURL + rejectEndPoint, payload, {
                headers: {
                    accept: "text/plain", authorization: `Bearer ${localStorage.accessToken}`,
                    customerid: customerId
                }
            })
            .then((response: any) => {

                if (response.status === 200 && response.data.responseCode === 200) {
                    handleInvoiceRedirect(props.invoiceId, false);
                } else {
                    console.log("Bill reject API failing on contractor service");
                }

            })
            .catch((e: any) => {
                console.log("error", e);
            });
    }

    /* istanbul ignore next */
    const postMoveToNextBill = () => {
        let payload: any = {
            BillId: clickedApiData?.id
        };

        const APIFails = () => {
            setMoveNextBanner(false);
            setOpenModal(false);
            setShowToast(true);
            setToastMessage(`Failed to void the Invoice. Please try again!`);
            props.navigate("/pay");
        }

        axios
            .post(basecontractorURL + moveToNextEndPoint, payload, {
                headers: {
                    accept: "text/plain", authorization: `Bearer ${localStorage.accessToken}`,
                    customerid: customerId
                }
            })
            .then((response: any) => {
                if (response.status === 200 && response.data.responseCode === 200) {
                    if (moveNextBanner) {
                        handleInvoiceRedirect(props.invoiceId, true);
                    }
                } else { APIFails() }
            })
            .catch(() => APIFails());
    }
    /* istanbul ignore next */
    const getBillingPeriodText = () => {
        const format = "DD MMM YYYY";
        const startDate = customDate(clickedApiData.startDate, format);
        const endDate = customDate(clickedApiData.endDate, format);
        return formatTimePeriod(startDate, endDate);
    };

    /* istanbul ignore next */
    function blobToBase64(blob: any) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
                resolve(reader.result);
            };
        });
    }

    /* istanbul ignore next */
    function fetchImageAsBase64(req: any) {
        const url = `${basecontractorURL}${req}`;
        return new Promise((resolve) => {
            const headers = new Headers({
                authorization: `Bearer ${localStorage.accessToken}`,
                "customerid": customerId
            });
            fetch(url, { headers })
                .then((response) => response.blob())
                .then((blob) => blobToBase64(blob))
                .then((base64) => resolve(base64));
        });
    }
    /* istanbul ignore next */
    const downloadFile = (fileUrl: string | null, fileName: string) => {
        if (!fileUrl) return;

        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    /* istanbul ignore next */
    const downloadBills = async (payload: any = {}) => {
        return fetchImageAsBase64(`download?documentId=${payload.fileId}`)
            .then((response: any) => {
                return response;
            })
            .catch((e) => {
                console.log("error in document download", e);
            });
    };

    /* istanbul ignore next */
    const handleClose = () => {
        setRejectBanner(false);
        setOpenRejectReason(false);
        setRejectReason('');
        setMoveNextBanner(false);
    }

    /* istanbul ignore next */
    return (
        <div className="invoice_bill_table">
            {!props.isSubscription && <div className={cn("table-container", {
                "hide-pagination": (tableData?.length <= 15)
            })}>
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
            </div>}
            {props.isSubscription && <div className="fee-details">
                <div className="fee-details-header">
                    <p className="title">Fee Details</p>
                    <p className="subscription-plan">
                        <span className="title">Subscription Plan</span>
                        <span className="chip">{props.subscriptionType}</span>
                    </p>
                </div>
                <div className="fee-details-body">
                    <div className="fee-details-row">
                        <div className="fee-details-row_item">
                            <p className="heading">Subscription Fees</p>
                            <p className="fee-value">{props.currency} {toCurrencyFormat(rawData?.subscriptionFees || 0)}</p>
                        </div>
                        <div className="fee-details-row_item">
                            <p className="heading">Start Date</p>
                            <p className="fee-value">{customDate(rawData?.startDate, "DD MMM YYYY")}</p>
                        </div>
                        <div className="fee-details-row_item">
                            <p className="heading">End Date</p>
                            <p className="fee-value">{customDate(rawData?.endDate, "DD MMM YYYY")}</p>
                        </div>
                    </div>
                    <div className="fee-details-row">
                        <div className="fee-details-row_item">
                            <p className="heading">Per Contractor Per Fee</p>
                            <p className="fee-value">{props.currency} {toCurrencyFormat(rawData?.perFee || 0)}</p>
                        </div>
                        <div className="fee-details-row_item">
                            <p className="heading">Number of Active Contractors</p>
                            <p className="fee-value">{rawData.activeContractors || 0}</p>
                        </div>
                        <div className="fee-details-row_item">
                            <p className="heading">Contractor Tiered Fee</p>
                            <p className="fee-value">{props.currency} {toCurrencyFormat(rawData?.tieredFee || 0)}</p>
                        </div>
                    </div>
                </div>
            </div>}
            <div className="feeSummaryCalc">
                {
                    !props.isSubscription && <>
                        <div className="rowFee">
                            <p className="title">Pay Converted Total</p>
                            <p className="amount">{props.currency} {toCurrencyFormat(rawData?.payConvertedTotal || 0)}</p>
                        </div>
                        <div className="rowFee">
                            <p className="title">Funding Fee</p>
                            <p className="amount">{props.currency} {toCurrencyFormat(rawData?.fundingFee || 0)}</p>
                        </div>
                        <div className="rowFee">
                            <p className="title">Same Currency Fees Total</p>
                            <p className="amount">{props.currency} {toCurrencyFormat(rawData?.sameCurrencyFeesTotal || 0)}</p>
                        </div>
                        <div className="rowFee">
                            <p className="title">FX Fees Total</p>
                            <p className="amount">{props.currency} {toCurrencyFormat(rawData?.fxFeesTotal || 0)}</p>
                        </div>
                        <div className="rowFee">
                            <p className="title">Money Transfer Fees Total</p>
                            <p className="amount">{props.currency} {toCurrencyFormat(rawData?.moneyTransferFeesTotal || 0)}</p>
                        </div>
                    </>
                }
                {
                    props.isSubscription && <>
                        <div className="rowFee">
                            <p className="title">Subscription Fee</p>
                            <p className="amount">{props.currency} {toCurrencyFormat(rawData?.subscriptionFee || 0)}</p>
                        </div>
                        {props.subscriptionType === "Monthly" && <div className="rowFee">
                            <p className="title">Contractor Tiered Fee</p>
                            <p className="amount">{props.currency} {toCurrencyFormat(rawData?.tieredFee || 0)}</p>
                        </div>}
                        {props.subscriptionType === "Annually" && <div className="rowFee">
                            <p className="title">Discount</p>
                            <p className="amount">{rawData?.discount || 0}%</p>
                        </div>}
                    </>
                }
                <div className="totalRow">
                    <p>Total Due</p>
                    <p className='total'>{props.currency} {toCurrencyFormat(rawData?.totalDue || 0)}</p>
                </div>
            </div>
            <div className='modal-wrapper'>
                <Modal
                    className="zero-padding"
                    handleClose={() => { setOpenModal(false); setRejectBanner(false); setMoveNextBanner(false) }}
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
                                                        downloadBills({
                                                            fileId: clickedApiData.documents[0]?.documentId
                                                        }).then((blobUrl: any) => downloadFile(blobUrl, clickedApiData.documents[0] && clickedApiData.documents[0].fileName));
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
                            {(rejectBanner) && <Banner type="warning">
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
                                    {tableData.length === 1 ? (
                                        <span className='info-banner'>
                                            <strong>Heads up!</strong> This bill was approved and added to <strong>Invoice {invoiceId}</strong>. If you reject or remove the last bill,
                                            then the invoice will be automatically voided. Are you sure you want to reject it and remove it from this invoice?
                                        </span>
                                    ) : (
                                        <span className='info-banner'>
                                            <strong>Heads up!</strong> This bill was approved and added to <strong>Invoice {invoiceId}</strong>. Are you sure you want to reject it and remove it from this invoice?
                                        </span>
                                    )}
                                </div>
                            </Banner>}
                            {(moveNextBanner) && <Banner type="warning">
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
                                    {tableData.length === 1 ? (
                                        <span className='info-banner'>
                                            <strong>Heads up!</strong> This bill is currently included in <strong>Invoice {invoiceId}</strong>.
                                            If you move it to the next invoice, this invoice will be voided and the bill will automatically be
                                            added to the next invoice that is generated for you. Do you want to continue?
                                        </span>
                                    ) : (
                                        <span className='info-banner'>
                                            <strong>Heads up!</strong> This bill is currently included in <strong>Invoice {invoiceId}</strong>.
                                            If you move it to the next invoice, the bill will be automatically added to
                                            the next invoice generated. Do you want to continue?
                                        </span>
                                    )}
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
                                    {(props?.billStatus === "Pending Approval" || props?.billStatus === "Invoiced") && rawData?.length > 1 && (
                                        <Button
                                            className="primary-blue medium primary next-invoice-button"
                                            label="Move To Next Invoice"
                                            handleOnClick={() => { setMoveNextBanner(true) }}
                                        />
                                    )}
                                </>}

                                {(moveNextBanner) ? (<>
                                    <Button
                                        label="Cancel"
                                        className="secondary-btn medium secondary-button cancel-button"
                                        handleOnClick={() => { setMoveNextBanner(false) }}
                                    />
                                    <Button
                                        className="primary-blue medium primary move-to-next-button"
                                        label="Yes, Move To Next Invoice"
                                        handleOnClick={postMoveToNextBill}
                                    />
                                </>) : (<>
                                    {rejectBanner && <><Button
                                        label="Cancel"
                                        className="secondary-btn medium secondary-button cancel-button"
                                        handleOnClick={() => { setMoveNextBanner(false); setRejectBanner(false) }}

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
                            handleClose={() => { setOpenRejectReason(false); setRejectBanner(false); setMoveNextBanner(false) }}
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
                                        handleOnClick={() => handleClose()}
                                    />
                                    <Button
                                        className="primary-blue medium primary cancel-button"
                                        disabled={rejectReason?.length === 0}
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
            <ToastContainer showToast={showToast} setShowToast={setShowToast} message={toastMessage} duration={10} />
        </div>

    );
}