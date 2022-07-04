import { Scrollbars } from "react-custom-scrollbars";
import { Button, Icon, NoDataCard, Checkbox } from "atlasuikit";
import moment from "moment";
import { useEffect, useState } from "react";
import { urls, getHeaders, saveEditNoteApi } from "../../urls/urls";
import axios from "axios";
import "../../layouts/views/InvoiceDetails/invoiceDetails.scss";
import { getDecodedToken } from "../getDecodedToken";
import { getPermissions } from "../Comman/Utils/utils";

export default function NotesWidget(props: any) {
  const {
    notes,
    isClient,
    cid,
    id,
    setNotes,
    transactionType,
    status,
    isPaymentPage,
    setPaymentNote,
    creditMemoData
  } = props;
  const [noteText, setNoteText] = useState("");
  const [isVisibleToCustomer, setIsVisibleToCustomer] = useState(false);
  const [isExportToQb, setIsExportToQb] = useState(false);
  const [isVisibleOnPDFInvoice, setisVisibleOnPDFInvoice] = useState(false);
  const tempToken = localStorage.getItem("accessToken");
  const permission: any = getDecodedToken();
  const [payloads, setPayloads] = useState<any>(creditMemoData);

  useEffect(() => {
    if (isPaymentPage) {
      setPaymentNote({
        note: noteText,
        isVisibleToCustomer,
        isExportToQb,
        isVisibleOnPDFInvoice,
      });
    }
  }, [noteText, isVisibleToCustomer, isExportToQb, isVisibleOnPDFInvoice]);


  //save note
  const editNote = (value: any, index: any) => {
    let noteNum;
    creditMemoData.invoiceNotes.map((item, i) => {
      if (i == index) {
        noteNum = item.id;
      }
    })

    console.log('noteNum', noteNum)
    console.log('ee', value);
    console.log('index', index);
    notes[index].note = value;
    setNotes([...notes])
    saveEditNote(noteNum)
  }

  console.log('notes', notes)


  const saveEditNote = (index: any) => {
    const url = saveEditNoteApi(index);
    let currDate = new Date();

    axios({
      method: "PUT",
      url: url,
      headers: getHeaders(tempToken, cid, isClient),
      data: {
        invoiceId: id,
        noteType: "1",
        note: false,
        isCustomerVisible: true,
        exportToQuickbooks: true,
        createdDate: currDate,
        modifiedBy: id,
        modifiedByUser: {
          document: {
            invoiceNotes: payloads.invoiceNotes
          }
        },
        displayInPDF: isVisibleOnPDFInvoice,
        customerId: cid,
      },
    })
      .then((res: any) => {
        setNotes([res.data, ...notes]);
        setNoteText("");
        console.log('ress', res)
      })
      .catch((e: any) => {
        console.log(e);
      });
  }



  console.log('creditMemoData', creditMemoData)
  /* istanbul ignore next */
  return (
    <div className="box">
      <h3>Notes</h3>

      {!isPaymentPage && (
        <Scrollbars
          renderView={(propss: any) => (
            <div
              {...propss}
              style={{
                overflowX: "hidden",
              }}
              className="filesscroll"
            />
          )}
          renderTrackVertical={(property: any) => (
            <div
              style={{ backgroundColor: "black" }}
              {...property}
              className="track-vertical"
            />
          )}
          renderThumbVertical={(properties: any) => (
            <div
              style={{ backgroundColor: "gray" }}
              {...properties}
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
              notes.map((item: any, index: number) => {
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
                        <span onClick={() => saveEditNote(index)}>
                          <Icon color="#526FD6" icon="edit" size="small" />
                        </span>
                        <span>
                          <Icon color="#E32C15" icon="trash" size="large" />
                        </span>
                      </div>
                    </div>
                    <div className="note">
                      <input type="text" value={item.note} className="noteInput" onChange={(e) => editNote(e.target.value, index)} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Scrollbars>
      )}

      {getPermissions(transactionType, "Publish") && (
        <>
          <div className="inpContinaer">
            <textarea
              maxLength={400}
              value={noteText}
              onChange={(e: any) => setNoteText(e.target.value)}
              placeholder="Add a note here..."
              disabled={status === "Declined"}
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
                  <label
                    className="check_label"
                    onClick={() => setIsVisibleToCustomer(!isVisibleToCustomer)}
                  >
                    Visible to Customer
                  </label>
                </div>
                <div className="check_wrapper">
                  <Checkbox
                    label="Export to Quickbooks"
                    onChange={(e: any) => {
                      setIsExportToQb(e.target.checked);
                    }}
                    checked={isExportToQb}
                  />
                  <label
                    className="check_label"
                    onClick={() => setIsExportToQb(!isExportToQb)}
                  >
                    Export to Quickbooks
                  </label>
                </div>
                <div className="check_wrapper">
                  <Checkbox
                    label="Visible on PDF Invoice"
                    onChange={(e: any) => {
                      setisVisibleOnPDFInvoice(e.target.checked);
                    }}
                    checked={isVisibleOnPDFInvoice}
                  />
                  <label
                    className="check_label"
                    onClick={() =>
                      setisVisibleOnPDFInvoice(!isVisibleOnPDFInvoice)
                    }
                  >
                    Visible on PDF Invoice
                  </label>
                </div>
              </div>
            )}
            {permission.InvoiceDetails.includes("Publish") && !isPaymentPage && (
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
        </>
      )}
    </div>
    // </div>
  );
}
