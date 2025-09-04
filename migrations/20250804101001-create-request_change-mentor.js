'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RequestChangeMentors', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
       fullname:Sequelize.STRING,
      email: { type: Sequelize.STRING, unique: true },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      currentMentorName: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      requestedMentorName: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      supportNeed:{type: Sequelize.TEXT,allowNull:false},
    coachingStyle:{type: Sequelize.STRING,allowNull:false},
    languagePreference:Sequelize.STRING,
      reason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
        allowNull: false,
      },
      responseMessage: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      confidentialityAcknowledged:{type: Sequelize.BOOLEAN,allowNull:false,defaultValue:false},
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('RequestChangeMentors');
  },
};
