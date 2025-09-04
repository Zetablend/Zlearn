module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    userId: DataTypes.STRING,
    title: DataTypes.STRING,
    message: DataTypes.TEXT,
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  

  return Notification;
};
