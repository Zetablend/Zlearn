module.exports = (sequelize, DataTypes) => {
  const PlatformHelpArticle = sequelize.define("PlatformHelpArticle", {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileUrl: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('faq', 'guide'),
      allowNull: false
    },
    uploadedBy: {
      type: DataTypes.INTEGER,
      allowNull: true // FK to admin
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });

  return PlatformHelpArticle;
};
