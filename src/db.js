import knex from "knex";
import 'dotenv/config';

export default knex(
{
    client: process.env.DB_CLIENT,
    connection: {
        database: process.env.DB_NAME,
        user:     process.env.DB_USER,
        password: process.env.DB_PASSWORD
    },
    migrations: {
        tableName: 'migrations',
        directory: './db/migrations'
    },
    seeds: {
        directory: './db/seeds'
    }
});