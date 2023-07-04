import knex from "knex";

export default knex(
{
    client: 'postgresql',
    connection: {
    database: 'fit_sync_dev',
    user:     'postgres',
    password: 'admin'
    },
    migrations: {
    tableName: 'migrations',
    directory: './db/migrations'
    },
    seeds: {
    directory: './db/seeds'
    }
});