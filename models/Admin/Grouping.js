module.exports = (sequelize, DataTypes) => {
  const Grouping = sequelize.define('Grouping', {
    userId:{
      type: DataTypes.INTEGER, 
      allowNull: false,
      
    },
    mentorId:{
    type: DataTypes.INTEGER, 
      allowNull: false,
      
    }, 
    username:{
         type: DataTypes.STRING, 
         allowNull: false,
    },
    useremail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    mentorname:{
    type: DataTypes.STRING,
    allowNull: false,
    },
    mentoremail:{
     type: DataTypes.STRING,
     allowNull: false,
     
    },
   batchnumber:{
    type: DataTypes.STRING,
     allowNull: false,
   },
   field:{
    type: DataTypes.STRING,
     allowNull: false,
   },
   totalsessions:{
   type: DataTypes.INTEGER,
    allowNull: false,
   },
   joiningDate:{
    type: DataTypes.DATE,
    allowNull: false,
   },
   }
,{
    tableName: 'Groupings',
    timestamps: true
  });
 
  Grouping.associate = (models) => {
    Grouping.belongsTo(models.Mentor, {
      foreignKey: 'mentorId',
      as: 'mentor'
    });
    Grouping.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
     
  };
  return Grouping;
};
