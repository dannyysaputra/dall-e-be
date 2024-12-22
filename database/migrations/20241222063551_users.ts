import type { Knex } from "knex";
import { onUpdateTrigger } from "../../knexfile";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users', function (table) {
        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table.string('username').notNullable();
        table.string('email').unique().notNullable();
        table.string('password').notNullable();
        table.timestamps(true, true);
    })

    await knex.raw(onUpdateTrigger('users'));
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('users');
}

