module.exports = (sequelize, DataTypes) => {
  const GroupUser = sequelize.define('GroupUser', {
    group_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  });

  return GroupUser;
};