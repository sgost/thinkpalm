
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { HashRouter } from "react-router-dom";
import CreditMemoSummary from "..";
import MockAdapter from "axios-mock-adapter";
import { mockapidata } from "../../InvoiceDetails/test/mockdata";
import axios from "axios";
import { urls } from '../../../../urls/urls'

const id = "ab9d400a-0b11-4a21-8505-7646f6caed8d";
const cid = "a9bbee6d-797a-4724-a86a-5b1a2e28763f";
localStorage.setItem("accessToken", "1234");
describe("Credit Memo Summary",() => {
    beforeAll(()=>{
        const mock = new MockAdapter(axios);
        mock.onPost(urls.uploadFile).reply(200, mockapidata.uploadFile);
        mock.onPost(urls.createDocument).reply(200, mockapidata.createDocument);
    })
    test("Render CM", ()=>{
        render(
            <HashRouter>
                <CreditMemoSummary 
                    notes={mockapidata.notes}
                    documents= {mockapidata.resData.invoice.invoiceDocuments} 
                    id={id}
                    cid={cid}
                    isClient={"true"}
                    setNotes={()=>{}}
                    setDocuments={()=>{}}
                ></CreditMemoSummary>
            </HashRouter>
        );
    })
})
describe("Notes fail",() => {
    beforeAll(()=>{
        const mock = new MockAdapter(axios);
        mock.onPost(urls.uploadFile).reply(200, mockapidata.uploadFile);
        mock.onPost(urls.createDocument).reply(200, mockapidata.createDocument);
    })
    test("Render CM", async ()=>{
        render(
            <HashRouter>
                <CreditMemoSummary 
                    notes={[]}
                    documents= {mockapidata.resData.invoice.invoiceDocuments} 
                    id={id}
                    cid={cid}
                    isClient={"false"}
                    setNotes={()=>{}}
                    setDocuments={()=>{}}
                ></CreditMemoSummary>
            </HashRouter>
        );
        const input = await waitFor(() =>
        screen.getByPlaceholderText(/Add a note here.../)
        );
        fireEvent.change(input, { target: { value: "FWIfRJDL9AuOIDLBZOMlIdfkjhdkfjhsdjfhjfhgdfjhdgfjdsgfjhdgfLUACmHyPxGCAYVluVrEp8qqIo1oMiiq6KSeeqLz5kdVdsi9ZkGlMmOr5tU3lVLHsMveDIxnXW94wRfw1PaNBQjOMwx6GMMjlNJpgHdhNuqU35KeNMUbh5BSKW8NSvtWj7EHBGgeaQWv2Mip4t4Y902auYg7lCe5SXcNg2uOiA1wo9frMt89RdUHbpiAfVx5GJ42eJrzACNeeMmAlzELmL2Zyk3qWJWSJa64a3vMASalMhGag4RdLpNLQK6b9rmgLXYTUQg3vIH7VH7odGP3oxiZGFD1CktANJR501MOKWjXdAlyXd4V6z9BstN62s1Oy3k3MeoMAsMSO1Nt5qBxn8cnX29dWGkcqZ0DBzEAv81lSerQfzMVxkzOWuzhXd35EaGVkpqFOQJtPuSjdfsdfsdfdsfdsfsdsfdsfsdfsdfdsfsd" } });
        const publish = screen.getByText(/Save/);
        fireEvent.click(publish);
    });

})