import { Scrollbars } from "react-custom-scrollbars";
import {
    Button,
    Icon,
    NoDataCard,
    Checkbox,
} from "atlasuikit";
import moment from "moment";
import { useState } from "react";
import {
    urls,
    getHeaders,
} from "../../urls/urls";
import axios from "axios";
import '../../layouts/views/InvoiceDetails/invoiceDetails.scss'
import { getDecodedToken } from "../getDecodedToken";
import { getPermissions } from "../Comman/Utils/utils";

export default function NotesWidget(props: any) {
    const { notes, isClient, cid, id, setNotes, transactionType } = props;
    const [noteText, setNoteText] = useState("");
    const [isVisibleToCustomer, setIsVisibleToCustomer] = useState(false);
    const [isExportToQb, setIsExportToQb] = useState(false);
    const [isVisibleOnPDFInvoice, setisVisibleOnPDFInvoice] = useState(false);
    const tempToken = localStorage.getItem("accessToken");
    const permission: any = getDecodedToken();

    /* istanbul ignore next */
    return (
        <div className="box">
            <h3>Notes</h3>

            <Scrollbars
                renderView={(props: any) => (
                    <div
                        {...props}
                        style={{
                            overflowX: "hidden",
                        }}
                        className="filesscroll"
                    />
                )}
                renderTrackVertical={(props: any) => (
                    <div
                        style={{ backgroundColor: "black" }}
                        {...props}
                        className="track-vertical"
                    />
                )}
                renderThumbVertical={(props: any) => (
                    <div
                        style={{ backgroundColor: "gray" }}
                        {...props}
                        className="thumb-vertical"
                    />
                )}
                style={{ width: "110%", height: "26.75rem" }}
            >
                <div className="notesContainer">
                    {!notes.length ? (
                        <div>
                            <NoDataCard
                                title=""
                                bodyContents={[
                                    "No notes have been added yet.",
                                    "Add one below!",
                                ]}
                                style={{
                                    height: "19rem",
                                    width: "auto",
                                }}
                            />
                        </div>
                    ) : (
                        notes.map((item: any) => {
                            return (
                                <div className="notesSubContainer">
                                    <div className="noteInfoBtn">
                                        <div className="noteInfo">
                                            <span>
                                                test@email.com (You){" "}
                                                {moment(item.createdDate).format(
                                                    "hh:mm A DD MMM, YYYY "
                                                )}
                                            </span>
                                            <Icon color="#b4b3bb" icon="info" size="small" />
                                        </div>
                                        <div className="noteBtn">
                                            <Icon color="#526FD6" icon="edit" size="small" />

                                            <svg
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 26"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fill-rule="evenodd"
                                                    clip-rule="evenodd"
                                                    d="M4.38086 3.85719H19.619V22.1429C19.619 22.9512 19.2979 23.7264 18.7263 24.2979C18.1548 24.8694 17.3796 25.1905 16.5713 25.1905H7.42848C6.6202 25.1905 5.84503 24.8694 5.27349 24.2979C4.70195 23.7264 4.38086 22.9512 4.38086 22.1429V3.85719ZM11.9999 0.80957C12.7688 0.809327 13.5093 1.09971 14.0731 1.62252C14.6369 2.14532 14.9822 2.86191 15.0399 3.62862L15.0475 3.85719H8.95229C8.95229 3.04891 9.27338 2.27374 9.84492 1.7022C10.4165 1.13066 11.1916 0.80957 11.9999 0.80957V0.80957Z"
                                                    stroke="#E32C15"
                                                    stroke-width="1.5"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                                <path
                                                    d="M1.33398 3.85742H22.6673"
                                                    stroke="#E32C15"
                                                    stroke-width="1.5"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                                <path
                                                    d="M8.95312 8.42871V20.6192"
                                                    stroke="#E32C15"
                                                    stroke-width="1.5"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                                <path
                                                    d="M15.0488 8.42871V20.6192"
                                                    stroke="#E32C15"
                                                    stroke-width="1.5"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="note">
                                        <p>{item.note}</p>
                                    </div>

                                </div>
                            );
                        })
                    )}
                </div>
            </Scrollbars>

            {getPermissions(transactionType, "Publish") && <>
                <div className="inpContinaer">
                    <textarea
                        maxLength={400}
                        value={noteText}
                        onChange={(e: any) => setNoteText(e.target.value)}
                        placeholder="Add a note here..."
                    />
                    <span>Characters left: {400 - noteText.length}</span>
                </div>
                <div className="btnContainer">
                    {isClient == "false" && (
                        <div className="btnContainercheckbox">
                            <div className="check_wrapper">
                                <Checkbox
                                    onChange={(e: any) => {
                                        setIsVisibleToCustomer(e.target.checked);
                                    }}
                                    checked={isVisibleToCustomer}
                                />
                                <label className="check_label" onClick={() => setIsVisibleToCustomer(!isVisibleToCustomer)}>Visible to Customer</label>
                            </div>
                            <div className="check_wrapper">
                                <Checkbox
                                    label="Export to Quickbooks"
                                    onChange={(e: any) => {
                                        setIsExportToQb(e.target.checked);
                                    }}
                                    checked={isExportToQb}
                                />
                                <label className="check_label" onClick={() => setIsExportToQb(!isExportToQb)}>Export to Quickbooks</label>
                            </div>
                            <div className="check_wrapper">
                                <Checkbox
                                    label="Visible on PDF Invoice"
                                    onChange={(e: any) => {
                                        setisVisibleOnPDFInvoice(e.target.checked);
                                    }}
                                    checked={isVisibleOnPDFInvoice}
                                />
                                <label className="check_label" onClick={() => setisVisibleOnPDFInvoice(!isVisibleOnPDFInvoice)}>Visible on PDF Invoice</label>
                            </div>
                        </div>
                    )}
                    {permission.InvoiceDetails.includes("Publish") && (
                        <Button
                            disabled={
                                !noteText.length || noteText.length > 400 ? true : false
                            }
                            handleOnClick={() => {
                                const url = urls.saveNote;
                                let currDate = new Date();

                                axios({
                                    method: "POST",
                                    url: url,
                                    headers: getHeaders(tempToken, cid, isClient),
                                    data: {
                                        invoiceId: id,
                                        noteType: "2",
                                        note: noteText,
                                        isCustomerVisible: isVisibleToCustomer,
                                        exportToQuickbooks: isExportToQb,
                                        createdDate: currDate,
                                        modifiedBy: "00000000-0000-0000-0000-000000000000",
                                        modifiedByUser: null,
                                        displayInPDF: isVisibleOnPDFInvoice,
                                        customerId: cid,
                                    },
                                })
                                    .then((res: any) => {
                                        setNotes([res.data, ...notes]);
                                        setNoteText("");
                                    })
                                    .catch((e: any) => {
                                        console.log(e);
                                    });
                            }}
                            className="primary-blue small"
                            label="Save"
                        />
                    )}
                </div>
            </>}
        </div>
        // </div>
    )
}