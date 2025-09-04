module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    name: DataTypes.STRING,
    created_by: DataTypes.INTEGER
  });

  Group.associate = (models) => {
    Group.hasMany(models.Message, { foreignKey: 'group_id' });
    Group.belongsToMany(models.MessageUser, { through: models.GroupUser, foreignKey: 'group_id' });
  };

  return Group;
};