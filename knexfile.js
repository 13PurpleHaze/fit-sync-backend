import 'dotenv/config';

export default{
  client: process.env.DB_CLIENT,
    connection: {
        database: process.env.DB_NAME,
        user:     proccess.env.DB_USER,
        password: procccess.env.DB_PASSWORD
    },
    pool: {
        min: process.env.DB_MIN_POOL,
        max: process.env.DB_MAX_POOL
    },
    migrations: {
        tableName: 'migrations',
        directory: './db/migrations'
    },
    seeds: {
        directory: './db/seeds'
    }
};
