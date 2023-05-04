'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn('Tags', 'produtoId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Produtos',
        key: 'id'
      },
      onDelete: 'SET NULL'
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Tags', 'produtoId')
  }
};
