'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AdminSettings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
    adminId:{
    type: Sequelize.INTEGER, 
      allowNull: false,
    }, 
    Notification:{
    type: Sequelize.BOOLEAN,
    defaultValue: false
    },
    MangeCourses:{
    type: Sequelize.BOOLEAN,
    defaultValue: false
    },
    MangeDocuments:{
    type: Sequelize.BOOLEAN,
    defaultValue: false
    },
    MangeTermsandConditions:{
    type: Sequelize.BOOLEAN,
    defaultValue: false
    },
    MangePosts:{
    type: Sequelize.BOOLEAN,
    defaultValue: false
    },
    MangeUserandMentorAccess:{
    type: Sequelize.BOOLEAN,
    defaultValue: false
    },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('AdminSettings');
  }
};
