'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      mentor_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      batchnumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      averageScore:{
      type: Sequelize.FLOAT,
        allowNull: false
      },
      bayesionScore:{
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },

      sessionId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      date_of_session: {
        type: Sequelize.DATE,
        allowNull: false
      },

      sessionRating: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },

      feltHeard: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },

      mentorKnowledge: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },

      rightIssue: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },

      communicationRating: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },

      feedback: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      testimonials: {
        type: Sequelize.TEXT,
        allowNull: true
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Reviews');
  }
};
