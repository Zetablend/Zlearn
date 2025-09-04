'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Packages', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('individual', 'group'),
        allowNull: false
      },
      price_unit: {
        type: Sequelize.ENUM('per_session', 'per_month'),
        allowNull: false
      },
      mentor_experience_min: Sequelize.INTEGER,
      mentor_experience_max: Sequelize.INTEGER,
      best_for: Sequelize.STRING,
      session_count: Sequelize.INTEGER,
      session_duration_minutes: Sequelize.INTEGER,
      frequency: Sequelize.STRING,
      features: {
        type: Sequelize.JSON,
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Packages');
  }
};
