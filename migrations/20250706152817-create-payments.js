'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Payments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id:{
      type: Sequelize.INTEGER, 
      allowNull: false,
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
    status:{
      type:Sequelize.ENUM('pending', 'completed','cancelled'),
      allowNull: false, 
      defaultValue:'Pending' 
    },
    transaction_id:{
     type: Sequelize.INTEGER, 
      allowNull: false,
    },
    paymentgateway:{
      type: Sequelize.STRING,
      allowNull: false, 
    },
    date_of_payment:{
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
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
    await queryInterface.dropTable('Payments');
  }
};
