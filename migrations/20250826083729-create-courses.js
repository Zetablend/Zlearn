'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Coursess', {
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
    title:{
    type: Sequelize.STRING,
    allowNull: false,
    },
    description:{
    type:Sequelize.STRING,
    allowNull: false,
    },
    Instructor_name:{
    type: Sequelize.STRING,
    allowNull: false
    },
    course_image:{
    type: Sequelize.STRING,
    allowNull: true
    },
    course_video:{
    type:Sequelize.STRING,
    allowNull: true
    },
    sales:{
    type: Sequelize.INTEGER,
    defaultValue: 0
    },
    topics:{
    type: Sequelize.INTEGER,
    allowNull: false
    },
    Price:{
    type: Sequelize.INTEGER,
    allowNull: false
    },
    discount:{
    type: Sequelize.INTEGER,
    allowNull: false
    },
    Totaltime:{
    type: Sequelize.INTEGER,
    allowNull: false
    },
    status:{
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "Published"
    },
    Category:{
    type: Sequelize.STRING,
    allowNull: false,  
    },
    subcategory:{
    type: Sequelize.STRING,
    allowNull: false,  
    },
    sellingtype:{
    type: Sequelize.JSON,
    allowNull: false,   
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
    await queryInterface.dropTable('Coursess');
  }
};
