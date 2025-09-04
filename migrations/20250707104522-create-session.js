'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Sessions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
    mentorname:{
    type: Sequelize.STRING,
    allowNull: false,
    },
     mentorId:{
      type: Sequelize.INTEGER,
     allowNull: false,
},
studentscount:{
    type: Sequelize.INTEGER,
     allowNull: false,
   },
    
   batchId:{
    type: Sequelize.INTEGER,
     allowNull: false,
   },
   goal:{
    type: Sequelize.STRING,
     allowNull: false,
   },
   session_number:{
   type: Sequelize.INTEGER,
    allowNull: false,
   }, 
   summarydocument:{
    type:Sequelize.STRING,
    allowNull: true,
   },
    timezone:{
     type: Sequelize.STRING,
    allowNull: false,
   },
   sessionstart_time:{
    type:Sequelize.TIME,
    allowNull: false,
   },
   sessionend_time: {
        type: Sequelize.TIME,
        allowNull: false},
   session_date: {
        type: Sequelize.DATEONLY,
        allowNull: false},
    session_status:{
    type:Sequelize.STRING,
    allowNull: false,
    defaultValue:'active'
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
    await queryInterface.dropTable('Sessions');
  }
};
