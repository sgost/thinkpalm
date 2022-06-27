import axios from "axios";
import { getHeaders, getRelatedInvoiceUrl } from "../urls/urls";

export const getCreditMemoStep4Data = async (invoiceId: any) => {
  try {
    const tempToken = localStorage.getItem("accessToken");
    const cid = localStorage.getItem("current-org-id");
    const headers = {
      headers: getHeaders(tempToken, cid, false),
    };
    let res: any = await axios.get(getRelatedInvoiceUrl(invoiceId), headers);
    return res;
  } catch (error) {
    console.log(error);
  }
};
