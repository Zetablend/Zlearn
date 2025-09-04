module.exports = (sequelize, DataTypes) => {
  const Package = sequelize.define('Package', {
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.ENUM('individual', 'group'), allowNull: false },
    price_unit: { type: DataTypes.ENUM('per_session', 'per_month'), allowNull: false },
    mentor_experience_min: DataTypes.INTEGER,
    mentor_experience_max: DataTypes.INTEGER,
    best_for: DataTypes.STRING,
    session_count: DataTypes.INTEGER,
    session_duration_minutes: DataTypes.INTEGER,
    frequency: DataTypes.STRING,
    features: { type: DataTypes.JSON },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
  });

  return Package;
};
