'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('mentors', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      full_name: Sequelize.STRING,
    
    phone_number: Sequelize.STRING,
    whatsapp_available: Sequelize.BOOLEAN,
    profilepicture:{
       type: Sequelize.STRING,
       allowNull: true, 
    },
     awsid:{
      type: Sequelize.STRING,
       allowNull: true, 
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
   
    country: Sequelize.STRING,
    city: Sequelize.STRING,
    preferred_languages: Sequelize.JSON,
    title: Sequelize.STRING,
    specialisations: Sequelize.JSON,
    years_of_experience: Sequelize.TINYINT,
    education_background: Sequelize.TEXT,
    preferred_age_groups: Sequelize.JSON,
    client_capacity: Sequelize.TINYINT,
    availability: Sequelize.TEXT,
    brief_bio: Sequelize.TEXT,
    mentoring_style: Sequelize.TEXT,
    languages_spoken: Sequelize.JSON,
    areas_of_competence: Sequelize.JSON,
    linkedin_profile: Sequelize.STRING,
    personal_website: Sequelize.STRING,
    testimonials: Sequelize.TEXT,
    testimonials_file_paths: {type:Sequelize.JSON,allowNull:true},
    motivation: Sequelize.TEXT,
    impact_goal: Sequelize.TEXT,
    additional_info: Sequelize.TEXT,
    agreed_terms: Sequelize.BOOLEAN,
    consented_background_check: Sequelize.BOOLEAN,
    allow_profile_display:Sequelize.BOOLEAN,
     bayesScore: {
  type: Sequelize.FLOAT,
  defaultValue: 0
},
   totalstudents:{
type: Sequelize.INTEGER,
       allowNull: true, 
},
    Status: {
      type: Sequelize.ENUM('active', 'inactive','pending','rejected','cancelled'), allowNull: false ,
  defaultValue: 'pending',
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
      },
      deletedAt:{
        type: Sequelize.DATE,
        allowNull: true,}
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('mentors');
  }
};
