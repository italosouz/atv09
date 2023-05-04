'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn('Produtos', 'precoPromocao', {
      type: Sequelize.DECIMAL
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Produtos', 'precoPromocao');
  }
};
