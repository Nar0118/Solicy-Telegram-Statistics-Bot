import {
  googleAuthenticate,
  getMembers,
  getSetlikeObject,
  findMemberReportInfo,
  getSheetName,
  reportConstructor,
} from "../../common/helpers/GoogleUpdate.helper.js";
import { GoogleAuth } from "google-auth-library";
// @ts-ignore
import { SCOPES } from "../../common/utils/messages.js";

export const uploadDailyDataGoogleSheet = async (
  dailyReactions: any,
  yourSheetKey: string,
  credentialsPath: any,
  messageCount: any
) => {
  // Connect to Google and get the sheet that's needed (you'll need to implement this logic)
  const gs = await googleAuthenticate(credentialsPath, yourSheetKey);

  // Get members from the sheet (you'll need to implement this logic)
  const members = getMembers(gs);

  let successRate: string | number = 0;

  if ("Positive" in dailyReactions && "Total" in dailyReactions) {
    if (dailyReactions["Total"] !== 0) {
      successRate = (
        dailyReactions["Positive"] / dailyReactions["Total"]
      ).toFixed(2);
    }
  }

  const firstRow = [
    dailyReactions["date"],
    dailyReactions["Total"],
    dailyReactions["Positive"],
    successRate,
  ];

  // Remove 'Total' and empty cells from the set (you'll need to implement this logic)
  const setMembers = getSetlikeObject(members);

  // Appending user info for each user
  for (const member of setMembers) {
    if ("Voters" in dailyReactions) {
      const memberData = findMemberReportInfo(
        member,
        dailyReactions["Voters"],
        messageCount
      );

      if (memberData) {
        firstRow.push(...memberData);
      } else {
        firstRow.push(0, 0, 0);
      }
    } else {
      firstRow.push(0, 0, 0);
    }
  }

  const now = new Date();
  now.setHours(now.getHours() + 4);
  const rowData = now.toISOString().split("T")[0];
  const findReg = new RegExp(rowData);
  const cell = gs.find(findReg);

  // Update the Google Sheet with the data (you'll need to implement this logic)
  await gs.update(`A${cell.row}`, [firstRow]);
};

export const reportMonthDataGoogleSheet = async (
  yourSheetKey: string,
  credentialsPath: any
) => {
  // Get the sheet name (you'll need to implement this logic)
  const sheetName = getSheetName();

  // Authenticate to Google
  const auth = new GoogleAuth({
    keyFile: credentialsPath,
    scopes: SCOPES,
  });

  const authClient = await auth.getClient();
  // @ts-ignore
  const sheets = google.sheets("v4");

  // Get the spreadsheet by key and sheet name (you'll need to implement this logic)
  const sheetsResponse = await sheets.spreadsheets.get({
    auth: authClient,
    spreadsheetId: yourSheetKey,
  });

  const gs = sheetsResponse.data.sheets.find(
    (sheet: any) => sheet.properties.title === sheetName
  );

  const now = new Date();
  now.setHours(now.getHours() + 4);
  const lastDate = now.toISOString().split("T")[0];
  const dateSet = lastDate.split("-");
  const monthData = [];
  let day = parseInt(dateSet[2]);
  const deferenceDateCellNumber = 3;

  while (day >= 1) {
    monthData.push(gs.row_values(day + deferenceDateCellNumber));
    day -= 1;
  }

  const members = gs.data.values[2];
  let membersCell = 5;

  const monthReportData = {};

  for (const dayData of monthData) {
    if (dayData.length < 2) {
      continue;
    }

    while (membersCell <= members.length) {
      const memberFullName = members[membersCell - 1];

      if (memberFullName in monthReportData) {
        try {
          // @ts-ignore
          monthReportData[memberFullName]["Total"] += parseInt(
            dayData[membersCell - 1]
          );
          // @ts-ignore
          monthReportData[memberFullName]["Approved"] += parseInt(
            dayData[membersCell]
          );
        } catch {
          // @ts-ignore
          monthReportData[memberFullName]["Total"] = 0;
          // @ts-ignore
          monthReportData[memberFullName]["Approved"] = 0;
        }

        try {
          // @ts-ignore
          monthReportData[memberFullName]["Success rate"] = // @ts-ignore
            (
              // @ts-ignore
              monthReportData[memberFullName]["Approved"] /
              // @ts-ignore
              monthReportData[memberFullName]["Total"]
            ).toFixed(2);
        } catch {
          // @ts-ignore
          monthReportData[memberFullName]["Success rate"] = 0;
        }
      } else {
        try {
          // @ts-ignore
          monthReportData[memberFullName] = {
            Total: parseInt(dayData[membersCell - 1]),
            Approved: parseInt(dayData[membersCell]),
            "Success rate": (
              parseInt(dayData[membersCell]) /
              parseInt(dayData[membersCell - 1])
            ).toFixed(2),
          };
        } catch {
          // @ts-ignore
          monthReportData[memberFullName] = {
            Total: 0,
            Approved: 0,
            "Success rate": 0,
          };
        }
      }

      membersCell += 3;
    }

    membersCell = 5;
  }

  // Generate the report (you'll need to implement this logic)
  const report = reportConstructor(monthReportData);
  let step = 40;

  // Update the Google Sheet with the report data (you'll need to implement this logic)
  for (const row of report) {
    await gs.update(`A${step}`, [row]);
    step += 1;
  }
};
