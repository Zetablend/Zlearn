module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    userId:{
      type: DataTypes.INTEGER, 
      allowNull: false,
    },
    username:{
         type: DataTypes.STRING, 
         allowNull: false,
    },
    packagename: {
      type: DataTypes.STRING,
      allowNull: false,
      
    },
    amount:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status:{
      type: DataTypes.ENUM('pending', 'completed','cancelled'),
      allowNull: false, 
      defaultValue:'Pending' 
    },
    transaction_id:{
     type: DataTypes.INTEGER, 
      allowNull: false,
    },
    paymentgateway:{
      type: DataTypes.STRING,
      allowNull: false, 
    },
    date_of_payment:{
        allowNull: false,
        type: DataTypes.DATE,
        
    }

},{
    tableName: 'Payments',
    timestamps: true
  });

  return Payment;
};
