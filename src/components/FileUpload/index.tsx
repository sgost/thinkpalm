import { FileHandler, FileUpload } from "atlasuikit";
import { urls, getHeaders, getDownloadFileUrl } from "../../urls/urls";
import axios from "axios";
import "../../layouts/views/InvoiceDetails/invoiceDetails.scss";
import { useState } from "react";
import { getPermissions } from "../Comman/Utils/utils";

export default function FileUploadWidget(props: any) {
  const { documents, setDocuments, isClient, cid, id, transactionType , status} = props;
  const tempToken = localStorage.getItem("accessToken");
  const [isFileError, setIsFileError] = useState<any>(null);
  /* istanbul ignore next */
  return (
    <div className="box2">
      <h3>Files</h3>
      <p>Upload files relevant for this Invoice.</p>
      <div className="boxsubcontainer">
        <div className="fileHandlerContainer">
          {documents.map((item: any, index: any) => {
            return (
              <FileHandler
                icons={{
                  prefix: {
                    color: "#526FD6",
                    height: "40",
                    icon: "docUpload",
                    width: "40",
                  },
                  suffix: [
                    getPermissions(transactionType, "Download")
                      ? {
                          color: "#526FD6",
                          height: "40",
                          icon: "download",
                          width: "40",
                          handleOnClick: () => {
                            const headers = {
                              headers: getHeaders(tempToken, cid, isClient),
                            };

                            const downloadApi = getDownloadFileUrl(
                              item.document.url
                            );
                            axios
                              .get(downloadApi, headers)
                              .then((res: any) => {
                                if (res.status === 200) {
                                  let a = document.createElement("a");
                                  a.href = res.data.url;
                                  a.download = `${res.data.name}`;
                                  a.click();
                                }
                              })
                              .catch((e: any) => {
                                console.log("error", e);
                              });
                          },
                        }
                      : {},
                    getPermissions(transactionType, "DeleteFile")
                      ? {
                          color: "#526FD6",
                          height: "30",
                          icon: "remove",
                          width: "30",
                          handleOnClick: () => {
                            const headers = getHeaders(
                              tempToken,
                              cid,
                              isClient
                            );

                            axios({
                              method: "DELETE",
                              url: urls.deleteFile,
                              data: {
                                invoiceId: id,
                                customerId: cid,
                                documentId: documents[index].documentId,
                              },
                              headers: headers,
                            })
                              .then(() => {
                                let cpy = [...documents];
                                cpy.splice(index, 1);
                                setDocuments(cpy);
                              })
                              .catch((e: any) => {
                                console.log(e);
                              });
                          },
                        }
                      : {},
                  ],
                }}
                label={{
                  // footer: "", //removing 235 MB untill api provides it
                  header: item.document.documentName,
                }}
              />
            );
          })}
        </div>

        {getPermissions(transactionType, "Browse") && (status !== "Declined") && (
          <div className="uploadConatiner">
            <FileUpload
              fileList={[]}
              formats={[".pdf", ".excel", ".jpeg", ".png", ".word"]}
              handleUpload={
                /* istanbul ignore next */
                (file: any) => {
                  const headers = getHeaders(tempToken, cid, isClient);
                  setTimeout(() => {
                    let formData = new FormData();
                    formData.append("asset", file[0]);
                    axios
                      .post(
                        urls.uploadFile,

                        formData,
                        {
                          headers: headers,
                        }
                      )
                      .then((res: any) => {

                        if(props.isPaymentPage){
                          props.paymentPageData.forEach((payitem: any)=> {
                            axios
                            .post(
                              urls.createDocument,
                              {
                                invoiceId: payitem.id,
                                customerId: payitem.customerId,
  
                                document: {
                                  url: res.data.url,
  
                                  documentName: res.data.fileName,
                                },
                              },
                              {
                                headers:  getHeaders(tempToken, payitem.customerId, isClient),
                              }
                            )
                            .then((response: any) => {
                              setDocuments([
                                ...documents,
                                {
                                  documentId: response.data.documentId,
                                  document: {
                                    documentName: res.data.fileName,
                                    url: res.data.url,
                                  },
                                },
                              ]);
                              setIsFileError(false);
                            })
                            .catch((e: any) => {
                              console.log(e);
                              setIsFileError(true);
                            });
                          })
                          return
                        }

                        axios
                          .post(
                            urls.createDocument,
                            {
                              invoiceId: id,
                              customerId: cid,

                              document: {
                                url: res.data.url,

                                documentName: res.data.fileName,
                              },
                            },
                            {
                              headers: headers,
                            }
                          )
                          .then((response: any) => {
                            setDocuments([
                              ...documents,
                              {
                                documentId: response.data.documentId,
                                document: {
                                  documentName: res.data.fileName,
                                  url: res.data.url,
                                },
                              },
                            ]);
                            setIsFileError(false);
                          })
                          .catch((e: any) => {
                            console.log(e);
                            setIsFileError(true);
                          });
                      })
                      .catch((e: any) => {
                        console.log(e);
                        setIsFileError(true);
                      });
                  });
                }
              }
              isError={isFileError}
              maxSize={25}
              resetFiles={function noRefCheck() {
                setIsFileError(null);
              }}
              title="Upload"
            />
          </div>
        )}
      </div>
    </div>
  );
}
