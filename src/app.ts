import { fetchAndStoreTariffs } from "#services/tariffService.js";
import { updateSheets } from "#services/sheetsService.js";
import cron from "node-cron";
import env from "#config/env/env.js";

// при старте сразу выполним
await fetchAndStoreTariffs();
await updateSheets();

// планируем  в 01:00
cron.schedule(env.APP_CRON_SCHEDULE ?? "0 1 * * *", async () => {
  console.log("[Cron] Starting daily tasks...");
  await fetchAndStoreTariffs();
  await updateSheets();
  console.log("[Cron] Daily tasks finished");
});

 (`Service started, listening on cron schedule: ${env.APP_CRON_SCHEDULE}`);