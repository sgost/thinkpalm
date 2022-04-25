import { Table } from 'atlasuikit';
import { useEffect, useState } from 'react';
import { profileImageEmpty } from '../../../assets/icons/index';
import "./billTable.scss";

/* istanbul ignore next */
export const getFlagURL = (code: string, size?: string) => {
    return `https://flagcdn.com/${size ? size : '20x15'
        }/${code.toLocaleLowerCase()}.png`;
};

export default function BillsTable(props: any) {

    /* istanbul ignore next */
    const base = "https://apigw-dev-eu.atlasbyelements.com/billingservice/api/billing/bill/GetBillDetailsPerInvoice/"
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

    useEffect(() => {
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
    return (
        <div className="invoice_bill_table">
            <Table
                options={{
                    ...TableColumns,
                    ...{ data: tableData }
                }}
                colSort
                pagination
                pagingOptions={[15, 30, 45, 60]} />
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
        </div>

    );
}