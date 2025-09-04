module.exports = (sequelize, DataTypes) => {
  const MentorResource = sequelize.define('MentorResource', {
    mentorId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    fileUrl: DataTypes.JSON,
    fileType: DataTypes.STRING,
    visibility: DataTypes.ENUM('public', 'students', 'private'),
    uploadedAt: DataTypes.DATE,
    batch_Id: {
    type: DataTypes.INTEGER,
    allowNull: false,}
  });

  MentorResource.associate = function (models) {
    MentorResource.belongsTo(models.Mentor, {
      foreignKey: 'mentorId',
      as: 'mentor'
    });
    MentorResource.hasMany(models.Bookmark, {
      foreignKey: 'resorceId',
      as: 'bookmarks'
    });
  };

  return MentorResource;
};
