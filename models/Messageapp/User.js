module.exports = (sequelize, DataTypes) => {
  const MessageUser = sequelize.define('MessageUser', {
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    role: { type: DataTypes.ENUM('admin', 'mentor', 'student'), defaultValue: 'student' },
    is_approved: { type: DataTypes.BOOLEAN, defaultValue: false },
    profile_picture: DataTypes.STRING
  });

  MessageUser.associate = (models) => {
    MessageUser.hasMany(models.Message, { foreignKey: 'sender_id' });
    MessageUser.hasMany(models.Message, { foreignKey: 'receiver_id' });
    MessageUser.belongsToMany(models.Group, { through: models.GroupUser, foreignKey: 'user_id' });
  };

  return MessageUser;
};