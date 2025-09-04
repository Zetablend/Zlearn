const { RequestChangeMentor, User, Mentor } = require('../../models');
const io = require("../../index");

exports.createRequest = async (req, res) => {
  try {
    const { userId,fullname,email, ...data } = req.body;

    const request = await RequestChangeMentor.create({
      userId,
      fullname,email,
      ...data
    });
   
   

    io.emit('mentor-change-request', {
      userName: fullname,
      userEmail: email,
      requestId: request.id,
      message: `🆕 Mentor change request submitted by ${fullname}`,
    });

    res.status(201).json({ message: 'Mentor change request submitted', request });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await RequestChangeMentor.findAll();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch requests' });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, responseMessage } = req.body;

    const request = await RequestChangeMentor.findByPk(id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = status;
    request.responseMessage = responseMessage;
    await request.save();

    res.json({ message: 'Request updated', request });
  } catch (error) {
    res.status(500).json({ error: 'Unable to update request' });
  }
};
