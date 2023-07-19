export const seed = async function(knex) {
  await knex('roles').del()
  await knex('roles').insert([
    {role_id: 1, title: 'user'},
    {role_id: 2, title: 'admin'},
  ]);
};
