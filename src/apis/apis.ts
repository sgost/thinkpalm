import axios from "axios";
import { getRelatedInvoiceUrl } from "../urls/urls";

export const getCreditMemoStep4Data = async (invoiceId: any) => {
  try {
    let res: any = await axios.get(getRelatedInvoiceUrl(invoiceId));
    return res;
  } catch (error) {
    console.log(error);
  }
};
