'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MentorStudentResources', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      mentorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Mentors',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      fileUrl: {
        type: Sequelize.JSON,
        allowNull: false
      },
      fileType: {
        type: Sequelize.STRING
      },
      visibility: {
        type: Sequelize.ENUM('public', 'students', 'private'),
        defaultValue: 'students'
      },
      batch_Id: {
  type: Sequelize.STRING,
  allowNull: false,
},
      uploadedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('MentorStudentResources');
  }
};
