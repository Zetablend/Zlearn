'use strict';

module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: true // Null for group messages
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: true // Null for personal messages
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true // Optional if file only
    },
    type: {
      type: DataTypes.ENUM('text', 'image', 'file'),
      allowNull: false,
      defaultValue: 'text'
    },
    file_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {});

  Message.associate = function(models) {
    Message.belongsTo(models.MessageUser, { as: 'Sender', foreignKey: 'sender_id' });
    Message.belongsTo(models.MessageUser, { as: 'Receiver', foreignKey: 'receiver_id' });
    Message.belongsTo(models.Group, { foreignKey: 'group_id' });
  };

  return Message;
};