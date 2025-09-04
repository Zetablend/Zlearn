'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Goalprogresss', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
     
     mentorId:{
      type: Sequelize.INTEGER, 
      allowNull: false,
       references: {
        model: 'mentors',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    mentorId: Sequelize.INTEGER,
    goals: Sequelize.JSON,
    description: Sequelize.TEXT,
    completedgoals: {type:Sequelize.JSON,
      allowNull: true,},
    prerequirisation: Sequelize.TEXT,
    completedhours:{type:Sequelize.INTEGER,
     allowNull: false,
    },
    batchId: {
    type: Sequelize.INTEGER,
    allowNull: false,},
      
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Groupings');
  }
};
