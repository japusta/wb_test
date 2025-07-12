import dotenv from "dotenv";
import "dotenv/config";
import { z } from "zod";

dotenv.config();

const isDocker = process.env.IS_DOCKER === "true";
const resolvedPostgresHost = isDocker ? "postgres" : (process.env.POSTGRES_HOST ?? "localhost");

const envSchema = z.object({
    NODE_ENV: z.union([z.undefined(), z.enum(["development", "production"])]),
    POSTGRES_HOST: z.string(),
    POSTGRES_PORT: z
        .string()
        .regex(/^[0-9]+$/)
        .transform((value) => parseInt(value)),
    POSTGRES_DB: z.string(),
    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),
    GOOGLE_SERVICE_ACCOUNT_JSON: z.string(),
    TEST_SPREADSHEET_ID: z.string(),
    GOOGLE_SHEETS_TARIFFS_RANGE: z.string(),
    APP_CRON_SCHEDULE: z.string().optional(),
    TARIFFS_API_TOKEN: z.string(),
    APP_PORT: z.union([
        z.undefined(),
        z
            .string()
            .regex(/^[0-9]+$/)
            .transform((value) => parseInt(value)),
    ]),
});

const env = envSchema.parse({
    POSTGRES_HOST: resolvedPostgresHost,
    POSTGRES_PORT: process.env.POSTGRES_PORT,
    POSTGRES_DB: process.env.POSTGRES_DB,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    NODE_ENV: process.env.NODE_ENV,
    APP_PORT: process.env.APP_PORT,
    GOOGLE_SERVICE_ACCOUNT_JSON: process.env.GOOGLE_SERVICE_ACCOUNT_JSON, 
    GOOGLE_SHEETS_TARIFFS_RANGE: process.env.GOOGLE_SHEETS_TARIFFS_RANGE,
    TEST_SPREADSHEET_ID: process.env.TEST_SPREADSHEET_ID,
    APP_CRON_SCHEDULE: process.env.APP_CRON_SCHEDULE,
    TARIFFS_API_TOKEN: process.env.TARIFFS_API_TOKEN,
});

export default env;
