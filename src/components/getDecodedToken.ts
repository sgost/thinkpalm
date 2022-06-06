import jwt_decode from "jwt-decode";

export const getDecodedToken = () => {
  const accessToken: any = localStorage.getItem("accessToken");
  const currentOrgId: any = localStorage.getItem("current-org-id");

  const decoded: any = jwt_decode(accessToken);


  /* istanbul ignore next */
  return decoded.Permissions[currentOrgId].Payments || { InvoiceList: [] };

};
