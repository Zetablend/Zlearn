'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MessageUsers', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      name: Sequelize.STRING,
      email: { type: Sequelize.STRING, unique: true },
      role: { type: Sequelize.ENUM('admin', 'mentor', 'student'), defaultValue: 'student' },
      is_approved: { type: Sequelize.BOOLEAN, defaultValue: false },
      profile_picture: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('MessageUsers');
  }
};