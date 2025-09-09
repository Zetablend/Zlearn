'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Groupings', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId:{
      type: Sequelize.INTEGER, 
      allowNull: false,
       references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
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
    username:{
         type: Sequelize.STRING, 
         allowNull: false,
    },
    useremail: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    mentorname:{
    type:Sequelize.STRING,
    allowNull: false,
    },
    mentoremail:{
     type: Sequelize.STRING,
     allowNull: false,
     unique: true,
    },
   batchnumber:{
    type: Sequelize.STRING,
     allowNull: false,
   },
   field:{
    type: Sequelize.STRING,
     allowNull: false,
   },
   totalsessions:{
   type: Sequelize.INTEGER,
    allowNull: false,
   },
   joiningDate:{
    type: Sequelize.DATE,
    allowNull: false,
   },
      
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
