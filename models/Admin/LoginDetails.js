module.exports = (sequelize, DataTypes) => {
  const LoginDetail = sequelize.define("LoginDetail", {
    
    email: { type: DataTypes.STRING, unique: true },
    password: {
      type: DataTypes.STRING,
    },
    role: {
    type: DataTypes.ENUM('user', 'mentor','superadmin','admin'), allowNull: false ,
    defaultValue: 'user',
},
    
  },{
    tableName: 'LoginDetails',
    timestamps: true,
paranoid: true,});

   LoginDetail.associate = (models) => {
    
    LoginDetail.hasOne(models.Mentor, {
      foreignKey: 'loginId',
      as: 'mentor'
    });
    LoginDetail.hasOne(models.User, {
      foreignKey: 'loginId',
      as: 'user'
    });
    
  };

  return LoginDetail;
};


