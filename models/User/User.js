module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
   
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
       validate: { isEmail: true },
    },
    firstname:{
      type: DataTypes.STRING,
    },
    lastname:{
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    loginId:{
       type: DataTypes.INTEGER,
       allowNull: false, 
    },
    phonenumber:{
       type: DataTypes.STRING, 
    },
    profilepicture:{
       type: DataTypes.STRING,
       allowNull: true, 
    },
    usertype:{
       type: DataTypes.STRING,
       allowNull:false,
       defaultValue:'User'  
    },
    batchnumber:{
     type: DataTypes.STRING,
     allowNull: false,
     defaultValue:'Not Assigned' 
    },
    payment_status:{
      type: DataTypes.STRING,
      allowNull: false, 
      defaultValue:'Pending' 
    },
    field:{
      type: DataTypes.STRING,
     allowNull: false,
    },
    username:{
         type: DataTypes.STRING, 
         allowNull: false,
    },
     status:{
      type:DataTypes.ENUM('completed','active','discontinue'),
      allowNull: false,
       defaultValue: 'active',
    },
    introductionVideourl:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    timezone:{
       type: DataTypes.STRING,
      allowNull: true,
    },
      resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetTokenExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    }
},{
    tableName: 'Users',
    timestamps: true
  });

  // Hook: before creating the record
  User.beforeCreate((user, options) => {
    if (!user.username) {
      user.username = `${user.firstName}${user.lastName}`.toLowerCase();
    }
  });
 
  User.associate = function (models) {
     User.belongsTo(models.LoginDetail,{
      foreignKey: 'loginId',
      as: 'user'
    });
    User.hasMany(models.Bookmark, {
      foreignKey: 'userId',
      as: 'bookmarks'
    });
    User.hasMany(models.Grouping, {
      foreignKey: 'userId',
      as: 'groupings'
    });
    User.hasMany(models.Testimonial, {
      foreignKey: 'userId',
      as: 'testimonial'
    });
  };

  return User;
};
