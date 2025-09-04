module.exports = (sequelize, DataTypes) => {
  const PlatformFeedback = sequelize.define("PlatformFeedback", {
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    submittedBy: {
      type: DataTypes.STRING,
      allowNull: true, // Optional: FK to user or admin
    },
    pageOrSection: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('new', 'reviewed', 'resolved'),
      defaultValue: 'new'
    }
  });

  return PlatformFeedback;
};
