import axios from "axios";
import { getCreditMemoStep4Url } from "../urls/urls";

export const getCreditMemoStep4Data = async (invoiceId: any) => {
  try {
    let res: any = await axios.get(getCreditMemoStep4Url(invoiceId));
    return res;
  } catch (error) {
    console.log(error);
  }
};
