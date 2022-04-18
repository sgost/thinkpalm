import { render } from "@testing-library/react"
import BillsTable from ".."

describe("Bills Table",() => {
    test("Render", ()=>{
        render(
            <BillsTable></BillsTable>
        );
    })
})