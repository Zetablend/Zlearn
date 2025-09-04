module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {

    mentorname:{
    type: DataTypes.STRING,
    allowNull: false,
    },
    mentorId:{
      type: DataTypes.INTEGER,
     allowNull: false,
},
   batchId:{
    type: DataTypes.INTEGER,
     allowNull: false,
   },
   goal:{
    type: DataTypes.STRING,
     allowNull: false,
   },
   sessionId:{
   type: DataTypes.STRING,
    allowNull: false,
   },
   studentscount:{
    type: DataTypes.INTEGER,
     allowNull: false,
   },
   sessionstart_time:{
    type:DataTypes.TIME,
    allowNull: false,
   },
   summarydocument:{
    type:DataTypes.STRING,
    allowNull: true,
   },
   sessionend_time:{
    type:DataTypes.TIME,
    allowNull: false,
   },
   meetlink:{
   type: DataTypes.STRING,
    allowNull: false,
   },
   timezone:{
     type: DataTypes.STRING,
    allowNull: false,
   },
   calenderlink:{
     type: DataTypes.STRING,
    allowNull: false,
   },
   session_date:{
    type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        isNotPast(value) {
          const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
          if (value < today) {
            throw new Error('Date cannot be in the past.');
          }
        }
      },
    
   },
   session_status:{
    type: DataTypes.ENUM('active', 'completed', 'cancelled'),
    allowNull: false,
    defaultValue:'active'
   },

},{
    tableName: 'Sessions',
    timestamps: true
  });
  Session.associate = function (models) {
    
    Session.belongsTo(models.Mentor, {
      foreignKey: 'mentorId',
      as: 'programs'
    });
    
  };

  return Session;
};

/*DELIMITER $$

CREATE EVENT IF NOT EXISTS update_session_status
ON SCHEDULE EVERY 1 MINUTE
DO
BEGIN
  UPDATE Sessions
  SET session_status = 'completed'
  WHERE 
    session_status = 'active'
    AND TIMESTAMP(session_date, session_time) < NOW();
END $$

DELIMITER ;*/

