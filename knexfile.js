// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default{
  development: {
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
  }
};
