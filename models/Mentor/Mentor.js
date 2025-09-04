module.exports = (sequelize, DataTypes) => {
  const Mentor = sequelize.define("Mentor", {
    full_name: DataTypes.STRING,
    
    phone_number: DataTypes.STRING,
    profilepicture:{
       type: DataTypes.STRING,
       allowNull: true, 
    },
    awsid:{
      type: DataTypes.STRING,
       allowNull: true, 
    },
    loginId:{
       type: DataTypes.INTEGER,
       allowNull: false, 
    },
    resume_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    experiences_certification_file_paths: {type: DataTypes.JSON,allowNull: true,},
    certificates_urls: {
      type: DataTypes.JSON,
      allowNull: true
    },
    portfolio_urls: {
      type: DataTypes.JSON,
      allowNull: true
    },
    whatsapp_available: DataTypes.BOOLEAN,
    country: DataTypes.STRING,
    city: DataTypes.STRING,
    preferred_languages: DataTypes.JSON,
    title: DataTypes.STRING,
    specialisations: DataTypes.JSON,
    years_of_experience: DataTypes.TINYINT,
    education_background: DataTypes.TEXT,
    preferred_age_groups: DataTypes.JSON,
    client_capacity: DataTypes.TINYINT,
    availability: DataTypes.TEXT,
    brief_bio: DataTypes.TEXT,
    mentoring_style: DataTypes.TEXT,
    languages_spoken: DataTypes.JSON,
    areas_of_competence: DataTypes.JSON,
    linkedin_profile: DataTypes.STRING,
    personal_website: DataTypes.STRING,
    testimonials: DataTypes.TEXT,
    testimonials_file_paths: {type:DataTypes.JSON,allowNull:true},
    motivation: DataTypes.TEXT,
    impact_goal: DataTypes.TEXT,
    additional_info: DataTypes.TEXT,
    agreed_terms: DataTypes.BOOLEAN,
    consented_background_check: DataTypes.BOOLEAN,
    allow_profile_display: DataTypes.BOOLEAN,
    bayesScore: {
  type: DataTypes.FLOAT,
  defaultValue: 0
},
totalstudents:{
type: DataTypes.INTEGER,
       allowNull: true, 
},
    Status: {
      type: DataTypes.ENUM('active', 'inactive','pending','rejected','cancelled'), allowNull: false ,
  defaultValue: 'pending',
},
    
  },{
    tableName: 'mentors',
    timestamps: true,
    paranoid:true
  });

   Mentor.associate = (models) => {
    Mentor.belongsTo(models.LoginDetail,{
      foreignKey: 'loginId',
      as: 'mentor'
    })
    Mentor.hasMany(models.Goalprogress, {
      foreignKey: 'mentorId',
      as: 'goal'
    });
    Mentor.hasMany(models.MentorResource, {
      foreignKey: 'mentorId',
      as: 'resources'
    });
     Mentor.hasMany(models.Grouping, {
      foreignKey: 'mentorId',
      as: 'students'
    });
    Mentor.hasMany(models.Testimonial, {
      foreignKey: 'MentorId',
      as: 'testimonial'
    });
    Mentor.hasMany(models.Session,{
      foreignKey: 'mentorId',
      as: 'programs'
    })
  };

  return Mentor;
};


