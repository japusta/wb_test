import { google } from "googleapis";
import { JWT } from "google-auth-library";
import knex from "#postgres/knex.js";
import env from "#config/env/env.js";
import fs from "fs";
import path from "path";

export async function updateSheets(): Promise<void> {

  const keyFilePath = path.resolve(env.GOOGLE_SERVICE_ACCOUNT_JSON); // преобразует ./... в абсолютный путь
  const keyData = JSON.parse(fs.readFileSync(keyFilePath, "utf-8"));

  const auth = new JWT({
    email: keyData.client_email,
    key: keyData.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

const spreadsheetIds = await knex("spreadsheets").select("spreadsheet_id");
  const rows = await knex("tariffs")
    .select(
      "date",
      "warehouse_name",
      "box_delivery_and_storage_expr",
      "box_delivery_base",
      "box_delivery_liter",
      "box_storage_base",
      "box_storage_liter"
    )
    .orderBy("warehouse_name", "asc");

  const values = rows.map((r) => [
    r.date,
    r.warehouse_name,
    r.box_delivery_and_storage_expr,
    r.box_delivery_base,
    r.box_delivery_liter,
    r.box_storage_base,
    r.box_storage_liter,
  ]);
  const sortedValues = values.sort((a, b) => Number(a[2]) - Number(b[2]));

  for (const { spreadsheet_id } of spreadsheetIds) {
    await sheets.spreadsheets.values.clear({
      spreadsheetId: spreadsheet_id,
      range: env.GOOGLE_SHEETS_TARIFFS_RANGE,
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId: spreadsheet_id,
      range: env.GOOGLE_SHEETS_TARIFFS_RANGE,
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [
            "Date",
            "Warehouse",
            "Coef %",
            "Delivery 1L",
            "Delivery per L",
            "Storage 1L",
            "Storage per L",
          ],
          ...sortedValues,
        ],
      },
    });
  }

  console.log(`Обновлено Google-таблиц: ${spreadsheetIds.length}`);
}
