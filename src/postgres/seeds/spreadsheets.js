/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function seed(knex) {
    await knex("spreadsheets")
        .insert([{ spreadsheet_id: process.env.TEST_SPREADSHEET_ID }])
        .onConflict(["spreadsheet_id"])
        .ignore();
}
