const { google } = require("googleapis");

const config = {
  xc: process.env.XC,
  sam: process.env.SAM,
  sheetId: process.env.SHEETID,
};

async function main() {
  const gAuth = await google.auth.getClient({
    keyFile: "./service.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const gSheets = google.sheets({
    version: "v4",
    auth: gAuth,
  });

  const res = await fetch("https://api.smallcase.com/sam/investment/total", {
    headers: {
      "x-sc-sam": config.sam,
      "x-csrf-Token": config.xc,
      "x-sc-publishertype": "distributor",
      "x-sc-publisher": "smallcase-website",
    },
  });

  if (res.status !== 200) {
    throw new Error("Invalid sc response");
  }

  const { data } = await res.json();

  const date = new Date().toLocaleString("en-In", { dateStyle: "long" });
  const mfValue = data.mutualFund.returns.networth;
  const scValue = data.smallcase.IN.returns.networth;
  const totalValue = data.total.returns.networth;
  const totalPnL = data.total.returns.totalPnl;
  const totalInv = data.total.returns.investment;

  await gSheets.spreadsheets.values.append({
    spreadsheetId: config.sheetId,
    range: "Sheet1!A1",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[date, mfValue, scValue, totalValue, totalInv, totalPnL]],
    },
  });

  console.log("Data added successfully:");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
