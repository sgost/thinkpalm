import { render } from "@testing-library/react"
import BillsTable from ".."
import { BillsByInvoiceId } from "../mockBills";

describe("Bills Table",() => {
    test("Render", ()=>{
        render(
            <BillsTable currency={"USD"} tableData={BillsByInvoiceId}></BillsTable>
        );
    })
})