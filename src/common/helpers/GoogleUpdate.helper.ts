import { google } from "googleapis";
import { GoogleAuth } from "google-auth-library";
import { MONTHS } from "../utils/constants";
const drive = google.drive("v3");

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive",
];

export const getSheetName = () => {
  const now = new Date();
  now.setHours(now.getHours() + 4);
  const dateStr = now.toISOString().split("T")[0];
  const [year, month, day] = dateStr.split("-");
  return MONTHS[parseInt(month) - 1];
};

export const googleAuthenticate = async (
  credentialsPath: any,
  yourSheetKey: any
) => {
  const auth = new GoogleAuth({
    keyFile: credentialsPath,
    scopes: SCOPES,
  });
  const authClient = await auth.getClient();
  const sheets = google.sheets("v4");
  const sheetName = getSheetName();

  const sheetsResponse = await sheets.spreadsheets.get({
    // @ts-ignore
    auth: authClient,
    spreadsheetId: yourSheetKey,
  });
  // @ts-ignore
  const gs = sheetsResponse.data.sheets.find(
    // @ts-ignore
    (sheet) => sheet.properties.title === sheetName
  );

  return gs;
};

export const getMembers = (gs: any) => {
  return gs.data.values[1];
};

export const getSetlikeObject = (members: any[]) => {
  return members.filter((member) => member !== "" && member !== "Total");
};

export const calculateSuccessRate = (
  messageCounts: any,
  fullName: string,
  voter: any
) => {
  const totalMessages = messageCounts[fullName];
  const successRate =
    totalMessages !== 0 ? (voter.positive_count / totalMessages).toFixed(2) : 0;
  return [totalMessages, voter.positive_count, successRate];
};

export const findMemberReportInfo = (
  fullName: string,
  voters: any,
  messageCounts: any
) => {
  for (const voter of voters) {
    if (!voter.full_name) {
      continue;
    }
    const nameArr = fullName.split(" ");
    const name = nameArr[0];
    const surname = nameArr.length > 1 ? nameArr[1] : "";

    if (voter.full_name === fullName) {
      if ("positive_count" in voter && fullName in messageCounts) {
        return calculateSuccessRate(messageCounts, fullName, voter);
      } else {
        return [0, 0, 0];
      }
    } else if (
      voter.full_name.includes(name) &&
      voter.full_name.includes(surname)
    ) {
      return calculateSuccessRate(messageCounts, voter.full_name, voter);
    }
  }
};

export const reportConstructor = (monthReportData: any) => {
  const report = [];
  const headers = ["  ", "Total", "Approved", "Success rate"];
  report.push(headers);
  let totalApproved = 0;
  let globalTotal = 0;

  for (const member in monthReportData) {
    totalApproved += monthReportData[member].Approved;
    globalTotal += parseInt(monthReportData[member].Total);
    const reportRow = [
      member,
      monthReportData[member].Total,
      monthReportData[member].Approved,
      monthReportData[member]["Success rate"],
    ];
    report.push(reportRow);
  }
  report.push(["Total", globalTotal, totalApproved]);
  return report;
};
