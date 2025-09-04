module.exports = (sequelize, DataTypes) => {
  const Goalprogress = sequelize.define("Goalprogress", {
     mentorId: DataTypes.INTEGER,
    goals: DataTypes.JSON,
    description: DataTypes.TEXT,
    completedgoals: {type:DataTypes.JSON,
      allowNull: true,
    },
    prerequirisation: DataTypes.TEXT,
    completedhours:{type:DataTypes.INTEGER,
     allowNull: false,
    },
    batchId: {
    type: DataTypes.INTEGER,
    allowNull: false,}},{
    tableName: 'Goalprogresss',
    timestamps: true
  });

   Goalprogress.associate = (models) => {
   
    Goalprogress.belongsTo(models.Mentor, {
      foreignKey: 'mentorId',
      as: 'goal'
    });
     
  };

  return Goalprogress;
};


