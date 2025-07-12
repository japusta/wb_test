import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("tariffs", (table) => {
    table.increments("id").primary();
    table.date("date").notNullable();

    table.string("warehouse_name").notNullable();
    table.string("box_delivery_and_storage_expr").notNullable();
    table.string("box_delivery_base").notNullable();
    table.string("box_delivery_liter").notNullable();
    table.string("box_storage_base").notNullable();
    table.string("box_storage_liter").notNullable();

    table.unique(["date", "warehouse_name"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("tariffs");
}
