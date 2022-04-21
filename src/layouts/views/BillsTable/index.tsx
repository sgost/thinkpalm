import { Table } from 'atlasuikit';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getFlagPath } from '../InvoiceDetails/getFlag';
import "./billTable.scss"
import { BillsByInvoiceId } from './mockBills';

/* istanbul ignore next */
export const getFlagURL = (code: string, size?: string) => {
    return `https://flagcdn.com/${size ? size : '20x15'
        }/${code.toLocaleLowerCase()}.png`;
};

export default function BillsTable(props: any) {

    const BillTableApi = (invoiceNo: any) => {
        const URL = "https://apigw-dev-eu.atlasbyelements.com/billingservice/api/billing/bill/GetBillDetailsPerInvoice/"
        axios({
            method: "GET",
            url: URL + invoiceNo,
            headers: {
                "accept": 'text/plain'
            },
        })
            .then((res: any) => {
                console.log(res);
                return res;
            })
            .catch((e: any) => {
                console.log("error", e);
            });
    }
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
    const [totalAdminFee, setTotalAdminFee] = useState<number>(0);

    useEffect(() => {
        let data: any = [];
        let paysConverted = 0;
        let adminFees = 0
        BillsByInvoiceId.forEach((item) => {
            data.push({
                referenceNo: item.billReferenceNo,
                contractorName: {
                    value: item.contractorName,
                    img: { src: item.contractorProfilePicSrc, shape: 'round' }
                },
                contractor_id: item.contractorId,
                country: {
                    value: item.countryName,
                    img: { src: getFlagURL(item.countryCode) }
                },
                payAmount: item.billingCurrencyCode + ' ' + toCurrencyFormat(item.payAmmount),
                exchangeRate: item.exchangeRate.toFixed(2),
                payConverted: props.currency + ' ' + toCurrencyFormat(item.payAmmount * item.exchangeRate),
                adminFee: props.currency + ' ' + toCurrencyFormat(item.adminFee),
                total: props.currency + ' ' + toCurrencyFormat((item.payAmmount * item.exchangeRate) + item.adminFee)
            })
            paysConverted += item.payAmmount * item.exchangeRate;
            adminFees += item.adminFee;
        })
        setTotalAdminFee(adminFees);
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
    return (
        <div className="invoice_bill_table">
            <Table
                options={{
                    ...TableColumns,
                    ...{ data: tableData }
                }}
                colSort
                pagination={false} />
            <div className="feeSummaryCalc">
                <div className="rowFee">
                    <p className="title">Pay Converted Total</p>
                    <p className="amount">{props.currency} {toCurrencyFormat(totalPayConverted)}</p>
                </div>
                <div className="row2">
                    <p className="title">Admin Fee Total</p>
                    <p className="amount">{props.currency} {toCurrencyFormat(totalAdminFee)}</p>
                </div>
                <div className="totalRow">
                    <p>Total Due</p>
                    <p className='total'>{props.currency} {toCurrencyFormat((totalAdminFee + totalPayConverted))}</p>
                </div>
            </div>
        </div>

    );
}