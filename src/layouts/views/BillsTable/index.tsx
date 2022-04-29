import { Table, Modal, Cards, Icon, FileHandler, Button } from 'atlasuikit';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { amountWithCommas, customDate, formatFileSize, formatTimePeriod } from '../../../components/Comman/Utils/utils'  // 'src/components/Comman/Utils/utils';
import { profileImageEmpty } from '../../../assets/icons/index';
import "./billTable.scss";

/* istanbul ignore next */
export const getFlagURL = (code: string, size?: string) => {
    return `https://flagcdn.com/${size ? size : '20x15'
        }/${code.toLocaleLowerCase()}.png`;
};

export default function BillsTable(props: any) {
    const customerId = props.customerId;
    const basecontractorURL = "https://apigw-dev-eu.atlasbyelements.com/billingservice/api/billing/";
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

    useEffect(() => {
        console.log(customerId);
        let data: any = [];
        let paysConverted = 0;
        props.tableData.data.forEach((item: any) => {
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
    }, [])

    const toCurrencyFormat = (amount: any) => {
        const cFormat = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        });

        return cFormat.format(amount).slice(1);
    };
    /* istanbul ignore next */
    const openBillDetailModal = (rowData : any) => {
        setOpenModal(!openModal); 
        axios
        .get(basecontractorURL+endpoint+"BillReferenceNumber=" + rowData.referenceNo + "&CustomerId=" + customerId, { headers: { accept: "text/plain", customerid: customerId } })
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
    const getBillingPeriodText = () => {
        const format = "DD MMM YYYY";
        const startDate = customDate(clickedApiData.startDate, format);
        const endDate = customDate(clickedApiData.endDate, format);
        return formatTimePeriod(startDate, endDate);
    };
    /* istanbul ignore next */
    const getSignedDownloadURL = async (payload: any = {}) => {
        axios
        .get(documentDownloadApi + payload.fileID, { headers: { accept: "*/*"} })
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
                handleRowClick= {(rowData: any)=> {openBillDetailModal(rowData)}}
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
                    handleClose={setOpenModal}
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
                                        color="#17224E"
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
                                    <div className='title'><span>{clickedApiData.customer?.name} || {"Global Enterprise Solutions"}</span></div>
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
                                                        getSignedDownloadURL({ fileID: clickedApiData.documents[0]?.documentId }).then(( data:any ) => {
                                                            window.open(data?.url, '_blank');
                                                        });
                                                    },
                                                    disabled: !(clickedApiData?.documents
                                                        && clickedApiData.documents?.length > 0)
                                                }
                                            ]
                                        }}
                                        label={{
                                            // footer: "2MB",
                                            footer: formatFileSize(clickedApiData.documents[0] && clickedApiData.documents[0].size),
                                            // header: "Faizan"
                                            header: clickedApiData.documents[0] && clickedApiData.documents[0].fileName
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="mt-5">
                                <span className="sup-label">Billing Period</span>
                                <div className="bill-identity">
                                    <span className="info">{getBillingPeriodText()}</span>
                                    {/* <span className="info">{"1-21 Jan 2022"}</span> */}
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
                                {/* Bill Total<span>{currentBillDetails?.contractor?.currencyCode} {amountWithCommas(billTotal)}</span> */}
                            </div>
                            
                        </div>
                        <div className='action-btns'>
                            <div className='justification margin-right'>
                                <Button
                                    label="Reject Bill"
                                    className="secondary-btn medium secondary-button"
                                />
                                <Button
                                    className="primary-blue medium primary"
                                    label="Move To Next Invoice"
                                />
                            </div>
                        </div>
                    </div>}
                    {!clickedApiData &&<div>
                        Something Went Wrong
                        </div>}
                </Modal>
            </div>
        </div>

    );
}