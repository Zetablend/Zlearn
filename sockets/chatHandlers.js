const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const AWS = require('../config/s3');


const onlineUsers = new Map(); 

module.exports = (io, socket, sequelize) => {
  const { MessageUser, Message, Group, GroupUser } = sequelize.models;

  const uploadToS3 = async (fileBuffer, fileName, mimeType, folder = 'chat_uploads') => {
    const Key = `${folder}/${uuidv4()}_${fileName}`;
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key,
      Body: fileBuffer,
      ContentType: mimeType,
      ACL: 'public-read'
    };
    const { Location } = await AWS.upload(uploadParams).promise();
    return Location;
  };

  socket.on('upload_file', async ({ senderId, receiverId, groupId, fileName, mimeType, base64Data, isGroup }) => {
    try {
      const buffer = Buffer.from(base64Data, 'base64');
      const s3Url = await uploadToS3(buffer, fileName, mimeType);

      const msg = await Message.create({
        sender_id: senderId,
        receiver_id: !isGroup ? receiverId : null,
        group_id: isGroup ? groupId : null,
        type: 'file',
        file_url: s3Url,
        message: fileName
      });

      const message = await Message.findByPk(msg.id, { include: [{ model: MessageUser, as: 'Sender' }] });

      if (receiverId) {
      io.to(`user_${receiverId}`).emit('new_message', message);
      const summary = await getUnreadSummary(receiverId);
      io.to(`user_${receiverId}`).emit('unread_notification_summary', summary);
    } else if (groupId) {
      const members = await GroupUser.findAll({ where: { group_id: groupId } });
       for (const member of members) {
    if (member.user_id !== senderId) {
      io.to(`user_${member.user_id}`).emit('new_group_message', message);
      const summary = await getUnreadSummary(member.user_id);
      io.to(`user_${member.user_id}`).emit('unread_notification_summary', summary);
    }
  }
    }
      io.to('admin_room').emit('log', `📁 File uploaded: ${fileName}`);
    } catch (error) {
      console.error('Upload error:', error);
      socket.emit('error', 'Upload failed');
    }
  });

  const getUnreadSummary = async (userId) => {
    const personal = await Message.findAll({
      where: {
        receiver_id: userId,
        is_read: false
      },
      include: [{ model: User, as: 'Sender', attributes: ['id', 'name'] }]
    });

    const groupMemberships = await GroupUser.findAll({ where: { user_id: userId } });
    const groupIds = groupMemberships.map(g => g.group_id);

    const groupMsgs = await Message.findAll({
      where: {
        group_id: { [Op.in]: groupIds },
        sender_id: { [Op.ne]: userId },
        is_read: false
      },
      include: [
        { model: User, as: 'Sender', attributes: ['id', 'name'] },
        { model: Group, attributes: ['id', 'name'] }
      ]
    });

    const fromUsers = {};
    const fromGroups = {};

    personal.forEach(msg => {
      const sid = msg.sender_id;
      if (!fromUsers[sid]) fromUsers[sid] = { senderId: sid, name: msg.Sender.name, count: 0 };
      fromUsers[sid].count++;
    });

    groupMsgs.forEach(msg => {
      const gid = msg.group_id;
      if (!fromGroups[gid]) fromGroups[gid] = { groupId: gid, name: msg.Group.name, count: 0 };
      fromGroups[gid].count++;
    });

    return {
      totalUnread: personal.length + groupMsgs.length,
      fromUsers: Object.values(fromUsers),
      fromGroups: Object.values(fromGroups)
    };
  };

  socket.on('user_online', async (userId) => {
    const user = await MessageUser.findByPk(userId);
    if (!user) return;

    socket.userId = userId;
    onlineUsers.set(userId, socket.id);

    socket.join(`user_${userId}`);
    if (user.role === 'admin') socket.join('admin_room');

    socket.emit('contacts', await getContacts(userId));
    socket.emit('groups', await getGroups(userId));

    const summary = await getUnreadSummary(userId);
    socket.emit('unread_notification_summary', summary);

    io.emit('user_status_update', {
      userId,
      status: 'online'
    });
  });

  socket.on('disconnect', () => {
    const userId = socket.userId;
    if (userId) {
      onlineUsers.delete(userId);
      io.emit('user_status_update', {
        userId,
        status: 'offline'
      });
    }
  });

  socket.on('read_message', async ({ messageIds, readerId }) => {
    if (!Array.isArray(messageIds)) return;
    await Message.update(
      { is_read: true },
      { where: { id: { [Op.in]: messageIds }, receiver_id: readerId } }
    );

    const summary = await getUnreadSummary(readerId);
    socket.emit('unread_notification_summary', summary);
  });

  const getContacts = async (userId) => {
    const users = await MessageUser.findAll({
      where: {
        id: { [Op.ne]: userId },
        is_approved: true
      },
      attributes: ['id', 'name', 'email', 'profile_picture', 'role']
    });
    return users.map(user => ({
      ...user.toJSON(),
      isOnline: onlineUsers.has(user.id)
    }));
  };

  const getGroups = async (userId) => {
  const user = await MessageUser.findByPk(userId);

  let groups;

  if (user.role === 'admin') {
    // Admin can see all groups
    groups = await Group.findAll();
  } else {
    // Others see only groups they're part of
    const groupUsers = await GroupUser.findAll({ where: { user_id: userId } });
    const groupIds = groupUsers.map(g => g.group_id);
    groups = await Group.findAll({ where: { id: groupIds } });
  }

  // Attach participants to each group
  const groupDetails = await Promise.all(groups.map(async group => {
    const members = await GroupUser.findAll({
      where: { group_id: group.id },
      include: [{ model: MessageUser, attributes: ['id', 'name', 'profile_picture'] }]
    });

    return {
      id: group.id,
      name: group.name,
      participants: members.map(m => ({
        id: m.User.id,
        name: m.User.name,
        profile_picture: m.User.profile_picture,
        isOnline: onlineUsers.has(m.User.id)
      }))
    };
  }));

  return groupDetails;
};


    socket.on('read_message', async ({ messageIds, readerId }) => {
    if (!Array.isArray(messageIds)) return;
    await Message.update(
      { is_read: true },
      { where: { id: { [Op.in]: messageIds }, receiver_id: readerId } }
    );

    const summary = await getUnreadSummary(readerId);
    socket.emit('unread_notification_summary', summary);
  });

 

  socket.on('send_personal_message', async ({ senderId, receiverId, message, type, file_url }) => {
    const msg = await Message.create({ sender_id: senderId, receiver_id: receiverId, message, type, file_url });
    const full = await Message.findByPk(msg.id, { include: [{ model: MessageUser, as: 'Sender' }] });

    io.to(`messageuser_${receiverId}`).emit('receive_personal_message', full);
    io.to(`messageuser_${senderId}`).emit('receive_personal_message', full);
    const summary = await getUnreadSummary(receiverId);
    io.to(`user_${receiverId}`).emit('unread_notification_summary', summary);
    //io.to('admin_room').emit('receive_personal_message', full);
  });

 socket.on('send_group_message', async ({ senderId, groupId, message, type, file_url }) => {
  const msg = await Message.create({
    sender_id: senderId,
    group_id: groupId,
    content: message,
    type,
    file_url,
    is_read: false
  });

  const full = await Message.findByPk(msg.id, {
    include: [{ model: MessageUser, as: 'Sender', attributes: ['id', 'name', 'profile_picture'] }]
  });

  io.to(`group_${groupId}`).emit('receive_group_message', full);

  const members = await GroupUser.findAll({ where: { group_id: groupId } });

  for (const member of members) {
    if (member.user_id !== senderId) {
      const summary = await getUnreadSummary(member.user_id);
      io.to(`user_${member.user_id}`).emit('unread_notification_summary', summary);
    }
  }
});


  socket.on('join_group', async ({ userId, groupId }) => {
    socket.join(`group_${groupId}`);
  });

  socket.on('typing', ({ room, MessageuserId }) => {
    socket.to(room).emit('typing', MessageuserId);
  });

  socket.on('edit_message', async ({ messageId, messageuserId, newText }) => {
    const msg = await Message.findByPk(messageId);
    if (msg && msg.sender_id === messageuserId) {
      await msg.update({ message: newText });
      io.to(`messageuser_${msg.receiver_id || msg.sender_id}`).emit('message_edited', msg);
    }
  });

  socket.on('delete_message', async ({ messageId, messageuserId }) => {
    const msg = await Message.findByPk(messageId);
    if (msg && msg.sender_id === messageuserId) {
      await msg.destroy();
      io.to(`messageuser_${msg.receiver_id || msg.sender_id}`).emit('message_deleted', messageId);
    }
  });

  

  socket.on('admin_approve_user', async ({ messageuserId }) => {
    const messageuser = await MessageUser.findByPk(messageuserId);
    if (!messageuser) return socket.emit('error', 'User not found');

    await messageuser.update({ is_approved: true });
    io.to('admin_room').emit('log', `✅ ${messageuser.role} ${messageuser.email} approved`);
    io.to(`messageuser_${messageuserId}`).emit('approved', true);
  });


  socket.on('admin_add_mentor', async ({ name, email }) => {
    const [mentor, created] = await User.findOrCreate({
      where: { email },
      defaults: { name, role: 'mentor', is_approved: true }
    });
    if (!created && mentor.role === 'mentor' && !mentor.is_approved) {
      await mentor.update({ is_approved: true });
    }
    io.to('admin_room').emit('log', `👤 Mentor ${email} added`);
    socket.emit('mentor_added', mentor);
  });

  socket.on('admin_delete_user', async ({ userId }) => {
    const user = await MessageUser.findByPk(userId);
    if (user) {
      await user.destroy();
      io.to('admin_room').emit('log', `🗑️ Deleted user ${user.email}`);
      socket.emit('user_deleted', userId);
    } else {
      socket.emit('error', 'User not found');
    }
  });
  socket.on('admin_create_group', async ({ name, created_by, messageuser_ids }) => {
    const group = await Group.create({ name, created_by });
    await Promise.all(messageuser_ids.map(messageuser_id => GroupUser.create({ messageuser_id, group_id: group.id })));

    io.to('admin_room').emit('log', `📢 Group "${name}" created with users: ${messageuser_ids.join(', ')}`);
    messageuser_ids.forEach(uid => {
      io.to(`messageuser_${uid}`).emit('group_joined', group);
    });
  });

  // ✅ Admin adds users to existing group
  socket.on('admin_add_to_group', async ({ group_id, messageuser_ids }) => {
    await Promise.all(messageuser_ids.map(messageuser_id => GroupUser.findOrCreate({ where: { messageuser_id, group_id } })));
    const group = await Group.findByPk(group_id);

    io.to('admin_room').emit('log', `➕ Users added to group "${group.name}"`);
    messageuser_ids.forEach(uid => {
      io.to(`messageuser_${uid}`).emit('group_joined', group);
    });
  });

  // ✅ Admin removes users from group
  socket.on('admin_remove_from_group', async ({ group_id, messageuser_ids }) => {
    await Promise.all(messageuser_ids.map(messageuser_id =>
      GroupUser.destroy({ where: { messageuser_id, group_id } })
    ));
    const group = await Group.findByPk(group_id);

    io.to('admin_room').emit('log', `➖ Users removed from group "${group.name}"`);
    messageuser_ids.forEach(uid => {
      io.to(`messageuser_${uid}`).emit('group_left', group_id);
    });
  });
   socket.on('admin_rename_group', async ({ group_id, new_name }) => {
    const group = await Group.findByPk(group_id);
    if (!group) return socket.emit('error', 'Group not found');

    await group.update({ name: new_name });
    io.to(`group_${group_id}`).emit('group_renamed', { group_id, new_name });
    io.to('admin_room').emit('log', `✏️ Group renamed to "${new_name}"`);
  });

  // ✅ Admin deletes group
  socket.on('admin_delete_group', async ({ group_id }) => {
    const group = await Group.findByPk(group_id);
    if (!group) return socket.emit('error', 'Group not found');

    await GroupUser.destroy({ where: { group_id } });
    await Message.destroy({ where: { group_id } });
    await group.destroy();

    io.to(`group_${group_id}`).emit('group_deleted', group_id);
    io.to('admin_room').emit('log', `🗑️ Group "${group.name}" deleted`);
  });
};


