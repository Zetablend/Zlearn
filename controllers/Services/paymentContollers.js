const { Payment } = require('../../models');

exports.getpaymentDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const payment = await Payment.findOne({where:{userId}}); 
    if (!payment) {
      return res.status(404).json({ message: 'User payment record not found' });
    }

    res.status(200).json({ message: 'Payment details fetched successfully',payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};