'use strict';

module.exports = (sequelize, DataTypes) => {
  const RequestChangeMentor = sequelize.define('RequestChangeMentor', {
    fullname:DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    userId: DataTypes.INTEGER,
    currentMentorName: DataTypes.INTEGER,
    requestedMentorName: DataTypes.INTEGER,
    reason:{type: DataTypes.JSON,allowNull:false},
    supportNeed:{type: DataTypes.TEXT,allowNull:false},
    coachingStyle:{type: DataTypes.STRING,allowNull:false},
    languagePreference:DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
    },
    confidentialityAcknowledged:{type: DataTypes.BOOLEAN,allowNull:false,defaultValue:false},
    responseMessage: DataTypes.TEXT,
  });

  RequestChangeMentor.associate = function(models) {
    RequestChangeMentor.belongsTo(models.User, { foreignKey: 'userId' });
    
  };

  return RequestChangeMentor;
};
