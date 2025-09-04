'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Userqueryinfos', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      // 1. Basic Information
      full_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      phone_number: {
        type: Sequelize.STRING,
      },
      age_range: {
        type: Sequelize.ENUM('Under 18', '18–24', '25–30', '31–40', '40+'),
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
       status:{
      type:Sequelize.ENUM('pending','registered','not interested'),
      allowNull: false,
       defaultValue: 'pending',
    },

      // 2. Support Type (up to 2)
      support_type: {
        type: Sequelize.JSON,
      },


      // 3. Current Situation
      current_situation: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      // 4. Fields of Interest (up to 2)
      interest_field: {
        type: Sequelize.JSON,
      },
     

      // 5. Mentor/Coach Preferences
      preferred_gender: {
        type: Sequelize.ENUM('Female', 'Male', 'No preference'),
      },
      preferred_style: {
        type: Sequelize.STRING,
      },
      preferred_mode: {
        type: Sequelize.STRING,
      },

      // 7. Final Note
      final_note: {
        type: Sequelize.TEXT,
      },

      // 8. Consent
      terms_accepted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      match_understood: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Userqueryinfos');
  }
};
