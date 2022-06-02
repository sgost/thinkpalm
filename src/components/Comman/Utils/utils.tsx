import moment from "moment";
import { Icon } from "atlasuikit";
import { useEffect } from "react";
import "./utils.scss";
import { getDecodedToken } from "../../getDecodedToken";
/* istanbul ignore next */
export const amountWithCommas = (amount: number, decimalDigits: number = 2) => {
  const roundedValue =
    decimalDigits > 2 ? amount : Math.round(amount * 100) / 100;
  const roundedString = roundedValue.toFixed(decimalDigits);
  let parts = roundedString.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};
/* istanbul ignore next */
export const customDate = (date: Date | string | null, format: string) => {
  if (date === null) return "";
  return moment(new Date(date)).format(format);
};
/* istanbul ignore next */
export const formatTimePeriod = (
  startDate: string | null,
  endDate: string | null
) => {
  let StartDate = null,
    EndDate = null,
    start = "-",
    end = "";
  if (startDate != null && startDate != "") {
    StartDate = moment(startDate).format("MM-DD-yyyy");
  }
  if (endDate != null && endDate != "") {
    EndDate = moment(endDate).format("MM-DD-yyyy");
  }

  if (StartDate != null) {
    start = moment(StartDate).format("MMM DD");
  }

  if (EndDate != null && StartDate != null) {
    if (moment(StartDate).format("MMM") === moment(EndDate).format("MMM")) {
      end = moment(EndDate).format("DD, yyyy");
    } else {
      end = moment(EndDate).format("MMM DD, yyyy");
    }
  }

  return start + " - " + end;
};
/* istanbul ignore next */
export const formatFileSize = (bytes: number, decimalPoint: number = 0) => {
  if (bytes == 0) return "0 Bytes";
  var k = 1000,
    dm = decimalPoint,
    sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(Number(bytes)) / Math.log(k));
  return (
    parseFloat((Number(bytes) / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  );
};
/* istanbul ignore next */
export const ToastContainer = ({
  showToast,
  setShowToast,
  message,
}: {
  showToast: boolean;
  setShowToast: (arg: boolean) => any;
  message: any;
}) => {
  useEffect(() => {
    if (showToast) {
      setTimeout(() => setShowToast(false), 4000);
    }
  }, [showToast]);

  return showToast ? (
    <div className="toast">
      <span>{message}</span>
      <span className="toast__action" onClick={() => setShowToast(false)}>
        <Icon icon="remove" color="#ffff" size="medium" viewBox="-6 -6 24 24" />
      </span>
    </div>
  ) : null;
};

export const Loader = () => {
  return (
    <div className="table-loader">
      <div className="lds-roller">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export const getPermissions = (transactionType: any, permission: string) => {
  const decTok = getDecodedToken();

  switch (transactionType) {
    case 3:
      return decTok.ProformaInvoice.includes(permission);
    case 4:
    return decTok.CreditMemoInvoice.includes(permission);
    case 2:
    return decTok.MiscellaneousInvoice.includes(permission);
    default:
      return false;
  }
};
