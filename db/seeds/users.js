export const seed = async function(knex) {
  await knex('users').del()
  await knex('users').insert([
    {first_name: 'Nikita1', sur_name: "Ivanov", age: 20, gender: true, role_id: '2', login: 'nikita1', password: '$2b$08$nSVHurQqTRi28RZYfen7COI2GVrY4oF7sHrxdAVfXGSoxYVvroajO'},
    {first_name: 'Nikita2', sur_name: "Ivanov", age: 34, gender: true, role_id: '2', login: 'nikita2', password: '$2b$08$nSVHurQqTRi28RZYfen7COI2GVrY4oF7sHrxdAVfXGSoxYVvroajO'},
    {first_name: 'Nikita3', sur_name: "Ivanov", age: 20, gender: false, login: 'nikita3', password: '$2b$08$nSVHurQqTRi28RZYfen7COI2GVrY4oF7sHrxdAVfXGSoxYVvroajO'},
    {first_name: 'Nikita4', sur_name: "Ivanov", age: 51, gender: false, login: 'nikita4', password: '$2b$08$nSVHurQqTRi28RZYfen7COI2GVrY4oF7sHrxdAVfXGSoxYVvroajO'},
    {first_name: 'Nikita5', sur_name: "Ivanov", age: 15, gender: true, login: 'nikita5', password: '$2b$08$nSVHurQqTRi28RZYfen7COI2GVrY4oF7sHrxdAVfXGSoxYVvroajO'},
    {first_name: 'Nikita6', sur_name: "Ivanov", age: 20, gender: false, login: 'nikita6', password: '$2b$08$nSVHurQqTRi28RZYfen7COI2GVrY4oF7sHrxdAVfXGSoxYVvroajO'},
    {first_name: 'Nikita7', sur_name: "Ivanov", age: 19, gender: true, login: 'nikita7', password: '$2b$08$nSVHurQqTRi28RZYfen7COI2GVrY4oF7sHrxdAVfXGSoxYVvroajO'},
    {first_name: 'Nikita8', sur_name: "Ivanov", age: 21, gender: true, login: 'nikita8', password: '$2b$08$nSVHurQqTRi28RZYfen7COI2GVrY4oF7sHrxdAVfXGSoxYVvroajO'},
    {first_name: 'Nikita9', sur_name: "Ivanov", age: 25, gender: true, login: 'nikita9', password: '$2b$08$nSVHurQqTRi28RZYfen7COI2GVrY4oF7sHrxdAVfXGSoxYVvroajO'},
    {first_name: 'Nikita10', sur_name: "Ivanov", age: 22, gender: true, login: 'nikita10', password: '$2b$08$nSVHurQqTRi28RZYfen7COI2GVrY4oF7sHrxdAVfXGSoxYVvroajO'},
    {first_name: 'Nikita11', sur_name: "Ivanov", age: 22, gender: true, login: 'nikita11', password: '$2b$08$nSVHurQqTRi28RZYfen7COI2GVrY4oF7sHrxdAVfXGSoxYVvroajO'},
    {first_name: 'Nikita12', sur_name: "Ivanov", age: 24, gender: true, login: 'nikita12', password: '$2b$08$nSVHurQqTRi28RZYfen7COI2GVrY4oF7sHrxdAVfXGSoxYVvroajO'},
    {first_name: 'Nikita13', sur_name: "Ivanov", age: 25, gender: false, login: 'nikita13', password: '$2b$08$nSVHurQqTRi28RZYfen7COI2GVrY4oF7sHrxdAVfXGSoxYVvroajO'},
    {first_name: 'Nikita14', sur_name: "Ivanov", age: 25, gender: true, login: 'nikita14', password: '$2b$08$nSVHurQqTRi28RZYfen7COI2GVrY4oF7sHrxdAVfXGSoxYVvroajO'},
    {first_name: 'Nikita15', sur_name: "Ivanov", age: 25, gender: false, login: 'nikita15', password: '$2b$08$nSVHurQqTRi28RZYfen7COI2GVrY4oF7sHrxdAVfXGSoxYVvroajO'},
    {first_name: 'Nikita16', sur_name: "Ivanov", age: 25, gender: true, login: 'nikita16', password: '$2b$08$nSVHurQqTRi28RZYfen7COI2GVrY4oF7sHrxdAVfXGSoxYVvroajO'},
    {first_name: 'Nikita17', sur_name: "Ivanov", age: 25, gender: true, login: 'nikita17', password: '$2b$08$nSVHurQqTRi28RZYfen7COI2GVrY4oF7sHrxdAVfXGSoxYVvroajO'},
    {first_name: 'Nikita18', sur_name: "Ivanov", age: 25, gender: true, login: 'nikita18', password: '$2b$08$nSVHurQqTRi28RZYfen7COI2GVrY4oF7sHrxdAVfXGSoxYVvroajO'},
  ]);
};
