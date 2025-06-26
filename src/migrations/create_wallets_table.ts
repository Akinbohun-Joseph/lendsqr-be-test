import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('wallets', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.decimal('balance', 15, 2).defaultTo(0.00);
    table.string('currency', 3).defaultTo('NGN');
    table.unique(['user_id']);
table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('wallets');
}
