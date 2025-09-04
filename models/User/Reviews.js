module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    userId:{
      type: DataTypes.INTEGER, 
      allowNull: false,
    },
    testimonials:{
       type: DataTypes.TEXT,
       allowNull: true, 
    },
    averageScore:{
      type: DataTypes.FLOAT,
        allowNull: false
      },
    bayesionScore:{
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
    sessionratings:{
      type: DataTypes.INTEGER, 
      allowNull: true, 
      defaultValue:0
    },
    feltHeard:{type: DataTypes.INTEGER,defaultValue:0},
    mentorKnowledge:{type: DataTypes.INTEGER,defaultValue:0},
    rightIssue:{type: DataTypes.INTEGER,defaultValue:0},
    communicationRating: {type:DataTypes.INTEGER,defaultValue:0},
    feedback: {type:DataTypes.TEXT,allowNull: true},
    mentorId:{
      type: DataTypes.INTEGER,
       allowNull: false,   
    },
    batchnumber:{
       type: DataTypes.STRING,
       allowNull: false,   
    },
    session_id:{
       type: DataTypes.INTEGER,
       allowNull: false,  
    },
    date_of_session:{
       type: DataTypes.DATE,
       allowNull: false, 
    },
},{
    tableName: 'Reviews',
    timestamps: true
  });
  Review.associate = (models) => {
    Review.belongsTo(models.User, { foreignKey: 'userId' });
    Review.belongsTo(models.Mentor, { foreignKey: 'mentorId' });
  };

  return Review;
};
