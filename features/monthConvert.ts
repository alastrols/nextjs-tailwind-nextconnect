import dayjs, { Dayjs } from "dayjs";
export default function monthConvert(month: String | null) {
  if (month == "01") {
    return "January";
  } else if (month == "02") {
    return "February";
  } else if (month == "03") {
    return "March";
  } else if (month == "04") {
    return "April";
  } else if (month == "05") {
    return "May";
  } else if (month == "06") {
    return "June";
  } else if (month == "07") {
    return "July";
  } else if (month == "08") {
    return "August";
  } else if (month == "09") {
    return "September";
  } else if (month == "10") {
    return "October";
  } else if (month == "11") {
    return "November";
  } else if (month == "12") {
    return "December";
  }
}
export function dateConvert(date: any) {
  if (date != null) {
    const dateValue = dayjs(date, "YYYY-MM-DD").toDate();
    const day = dateValue.getDate();
    let month: any = dateValue.getMonth() + 1;
    if (month <= 9) {
      month = "0" + month;
    }
    const year = dateValue.getFullYear();
    const dateConvert = year + "-" + month + "-" + day;
    return dateConvert;
  } else {
    return null;
  }
}

export function monthConvertDMY(date: any) {
  const split = date.split("-");
  const month = monthConvert(split[1]);
  const day = split[2] + " " + month + " " + split[0];
  return day;
}
