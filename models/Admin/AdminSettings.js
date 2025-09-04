module.exports = (sequelize, DataTypes) => {
  const AdminSetting = sequelize.define('AdminSetting', {
    
    adminId:{
    type: DataTypes.INTEGER, 
      allowNull: false,
    }, 
    Notification:{
    type: DataTypes.BOOLEAN,
    defaultValue: false
    },
    MangeCourses:{
    type: DataTypes.BOOLEAN,
    defaultValue: false
    },
    MangeDocuments:{
    type: DataTypes.BOOLEAN,
    defaultValue: false
    },
    MangeTermsandConditions:{
    type: DataTypes.BOOLEAN,
    defaultValue: false
    },
    MangePosts:{
    type: DataTypes.BOOLEAN,
    defaultValue: false
    },
    MangeUserandMentorAccess:{
    type: DataTypes.BOOLEAN,
    defaultValue: false
    },
   
   }
,{
    tableName: 'AdminSettings',
    timestamps: true
  });
 
  /*AdminSetting.associate = (models) => {
    AdminSetting.belongsTo(models.Admin, {
      foreignKey: 'adminId',
      as: 'Admin'
    });
     
  };*/
  return AdminSetting;
};
