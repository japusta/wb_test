import axios from "axios";
import dayjs from "dayjs";
import knex from "#postgres/knex.js";
import env from "#config/env/env.js";

interface WBItem {
  warehouseName: string;
  boxDeliveryAndStorageExpr: string;
  boxDeliveryBase: string;
  boxDeliveryLiter: string;
  boxStorageBase: string;
  boxStorageLiter: string;
}

export async function fetchAndStoreTariffs(): Promise<void> {
  const today = dayjs().format("YYYY-MM-DD");
  const url = "https://common-api.wildberries.ru/api/v1/tariffs/box";

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${env.TARIFFS_API_TOKEN}`,
    },
    params: { date: today },
    timeout: 20000,
  });

  const warehouseList: WBItem[] = response.data?.response?.data?.warehouseList;

  if (!Array.isArray(warehouseList)) {
    console.log("warehouseList пуст или не массив");
    return;
  }

  const rows = warehouseList.map((w) => ({
    date: today,
    warehouse_name: w.warehouseName,
    box_delivery_and_storage_expr: w.boxDeliveryAndStorageExpr,
    box_delivery_base: w.boxDeliveryBase,
    box_delivery_liter: w.boxDeliveryLiter,
    box_storage_base: w.boxStorageBase,
    box_storage_liter: w.boxStorageLiter,
  }));

  await knex("tariffs")
    .insert(rows)
    .onConflict(["date", "warehouse_name"])
    .merge();

  console.log(`Сохранено тарифов: ${rows.length}`);
}
