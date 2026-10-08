'use strict';

const fs = require('fs');
const path = require('path');

module.exports = {
async up(queryInterface) {


const filePath = path.join(
  __dirname,
  '..',
  'divipola-municipios.json'
);

const data = JSON.parse(
  fs.readFileSync(filePath, 'utf8')
);

const [departments] = await queryInterface.sequelize.query(
  'SELECT id, code FROM departments'
);

const departmentMap = {};

departments.forEach((department) => {
  departmentMap[department.code] = department.id;
});

const now = new Date();

const cities = data.features
  .filter((feature) => {
    return feature.attributes.MPIO_TIPO === 'MUNICIPIO';
  })
  .map((feature) => {

    const {
      DPTO_CCDGO,
      MPIO_CDPMP,
      MPIO_CNMBRE
    } = feature.attributes;

    const departmentId = departmentMap[DPTO_CCDGO];

    if (!departmentId) {
      throw new Error(
        `Departamento no encontrado para código ${DPTO_CCDGO}`
      );
    }

    return {
      department_id: departmentId,
      code: String(MPIO_CDPMP),
      name: MPIO_CNMBRE,
      created_at: now,
      updated_at: now
    };
  });

await queryInterface.bulkInsert('cities', cities);


},

async down(queryInterface) {
await queryInterface.bulkDelete('cities', null, {});
}
};
