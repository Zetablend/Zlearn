module.exports = (sequelize, DataTypes) => {
  const Courses = sequelize.define('Courses', {
    
    adminId:{
    type: DataTypes.INTEGER, 
      allowNull: false,
    }, 
    title:{
    type: DataTypes.STRING,
    allowNull: false,
    },
    description:{
    type: DataTypes.STRING,
    allowNull: false,
    },
    Instructor_name:{
    type: DataTypes.STRING,
    allowNull: false
    },
    course_image:{
    type: DataTypes.STRING,
    allowNull: true
    },
    course_video:{
    type: DataTypes.STRING,
    allowNull: true
    },
    sales:{
    type: DataTypes.INTEGER,
    defaultValue: 0
    },
    topics:{
    type: DataTypes.INTEGER,
    allowNull: false
    },
    Price:{
    type: DataTypes.INTEGER,
    allowNull: false
    },
    discount:{
    type: DataTypes.INTEGER,
    allowNull: false
    },
    Totaltime:{
    type: DataTypes.INTEGER,
    allowNull: false
    },
    status:{
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Published"
    },
    Category:{
    type: DataTypes.STRING,
    allowNull: false,  
    },
    subcategory:{
    type: DataTypes.STRING,
    allowNull: false,  
    },
    sellingtype:{
    type: DataTypes.JSON,
    allowNull: false,   
    }
   
   }
,{
    tableName: 'Coursess',
    timestamps: true,
    paranoid: true,
  });
 
  /*Courses.associate = (models) => {
    Courses.belongsTo(models.Admin, {
      foreignKey: 'adminId',
      as: 'Admin'
    });
     
  };*/
  return Courses;
};
