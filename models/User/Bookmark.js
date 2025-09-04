module.exports = (sequelize, DataTypes) => {
  const Bookmark = sequelize.define('Bookmark', {
    userId: DataTypes.INTEGER,
    resourceId: DataTypes.INTEGER
  });

  Bookmark.associate = function (models) {
    Bookmark.belongsTo(models.User, { foreignKey: 'userId',as: 'user'  });
    Bookmark.belongsTo(models.MentorResource, { foreignKey: 'resourceId' ,as: 'resource'});
  };

  return Bookmark;
};
