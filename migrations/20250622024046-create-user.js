'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
     
      firstname: {
        type: Sequelize.STRING,
      },
      lastname: {
        type: Sequelize.STRING,
      },
      loginId:{
       type: Sequelize.INTEGER,
       allowNull: false, 
       references: {
          model: "LoginDetails", // must match table name
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
     
      phonenumber:{
       type: Sequelize.STRING, 
      },
      profilepicture: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      batchnumber:{
      type: Sequelize.STRING,
     allowNull: false,
     defaultValue:'Not Assigned' 
    },
    payment_status:{
      type: Sequelize.STRING,
      allowNull: false, 
      defaultValue:'Pending' 
    },
    field:{
      type: Sequelize.STRING,
     allowNull: false,
    },
      usertype: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'User',
      },
       status:{
      type: Sequelize.ENUM('completed','active','discontinue'),
      allowNull: false,
       defaultValue: 'active',
    },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      introductionVideourl:{
      type: Sequelize.STRING,
      allowNull: true,
    },
     timezone:{
       type: Sequelize.STRING,
      allowNull: true,
    },
      resetToken: {
      type: Sequelize.STRING,
      allowNull: true,
      },
      resetTokenExpiry: {
      type: Sequelize.DATE,
      allowNull: true,
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
    await queryInterface.dropTable('Users');
  }
};
