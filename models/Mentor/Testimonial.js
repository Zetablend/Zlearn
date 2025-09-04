module.exports = (sequelize, DataTypes) => {
  const Testimonial = sequelize.define('Testimonial', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    mentorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {});

  Testimonial.associate = function(models) {
    Testimonial.belongsTo(models.User, { foreignKey: 'userId' });
    Testimonial.belongsTo(models.Mentor, { foreignKey: 'mentorId' });
  };

  return Testimonial;
};
