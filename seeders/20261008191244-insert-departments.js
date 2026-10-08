'use strict';

module.exports = {
async up(queryInterface) {
const now = new Date();


await queryInterface.bulkInsert('departments', [
  { code: '05', name: 'Antioquia', created_at: now, updated_at: now },
  { code: '08', name: 'Atlántico', created_at: now, updated_at: now },
  { code: '11', name: 'Bogotá D.C.', created_at: now, updated_at: now },
  { code: '13', name: 'Bolívar', created_at: now, updated_at: now },
  { code: '15', name: 'Boyacá', created_at: now, updated_at: now },
  { code: '17', name: 'Caldas', created_at: now, updated_at: now },
  { code: '18', name: 'Caquetá', created_at: now, updated_at: now },
  { code: '19', name: 'Cauca', created_at: now, updated_at: now },
  { code: '20', name: 'Cesar', created_at: now, updated_at: now },
  { code: '23', name: 'Córdoba', created_at: now, updated_at: now },
  { code: '25', name: 'Cundinamarca', created_at: now, updated_at: now },
  { code: '27', name: 'Chocó', created_at: now, updated_at: now },
  { code: '41', name: 'Huila', created_at: now, updated_at: now },
  { code: '44', name: 'La Guajira', created_at: now, updated_at: now },
  { code: '47', name: 'Magdalena', created_at: now, updated_at: now },
  { code: '50', name: 'Meta', created_at: now, updated_at: now },
  { code: '52', name: 'Nariño', created_at: now, updated_at: now },
  { code: '54', name: 'Norte de Santander', created_at: now, updated_at: now },
  { code: '63', name: 'Quindío', created_at: now, updated_at: now },
  { code: '66', name: 'Risaralda', created_at: now, updated_at: now },
  { code: '68', name: 'Santander', created_at: now, updated_at: now },
  { code: '70', name: 'Sucre', created_at: now, updated_at: now },
  { code: '73', name: 'Tolima', created_at: now, updated_at: now },
  { code: '76', name: 'Valle del Cauca', created_at: now, updated_at: now },
  { code: '81', name: 'Arauca', created_at: now, updated_at: now },
  { code: '85', name: 'Casanare', created_at: now, updated_at: now },
  { code: '86', name: 'Putumayo', created_at: now, updated_at: now },
  { code: '88', name: 'Archipiélago de San Andrés, Providencia y Santa Catalina', created_at: now, updated_at: now },
  { code: '91', name: 'Amazonas', created_at: now, updated_at: now },
  { code: '94', name: 'Guainía', created_at: now, updated_at: now },
  { code: '95', name: 'Guaviare', created_at: now, updated_at: now },
  { code: '97', name: 'Vaupés', created_at: now, updated_at: now },
  { code: '99', name: 'Vichada', created_at: now, updated_at: now }
]);


},

async down(queryInterface) {
await queryInterface.bulkDelete('departments', null, {});
}
};
