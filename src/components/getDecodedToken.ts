import jwt_decode from "jwt-decode";

export const getDecodedToken = () => {
  const accessToken: any = localStorage.getItem("accessToken");
  const currentOrgId: any = localStorage.getItem("current-org-id");

  const decoded: any = jwt_decode(accessToken);
  //   console.log("token", currentOrgId, accessToken, decoded);

  // console.log(
  //   "per",
  //   decoded.Permissions[currentOrgId].Payments,
  //   decoded.Permissions[currentOrgId].Payments.InvoiceList.find(
  //     (str: any) => str === "Add"
  //   )
  // );

  return decoded.Permissions[currentOrgId].Payments || { InvoiceList: [] };

  //   const parseToken = JSON.parse(decoded);

  //   console.log("token", currentOrgId, parseToken);
};
