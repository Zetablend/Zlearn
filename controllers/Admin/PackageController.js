const { Package,Payment } = require('../../models');




// POST /packages
exports.createPackage = async (req, res) => {
  try {
    const { name, price, type, price_unit, mentor_experience_min, mentor_experience_max, best_for, session_count, session_duration_minutes, frequency, features } = req.body;

    

    const newPackage = await Package.create({
      name, price, type, price_unit, mentor_experience_min, mentor_experience_max, best_for,
      session_count, session_duration_minutes, frequency, features
    });

    res.status(201).json(newPackage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /packages/:id
exports.updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, type, price_unit, mentor_experience_min, mentor_experience_max, best_for, session_count, session_duration_minutes, frequency, features } = req.body;

    const pkg = await Package.findByPk(id);
    if (!pkg) return res.status(404).json({ message: 'Package not found' });

    

    await pkg.update({
      name, price, type, price_unit, mentor_experience_min, mentor_experience_max, best_for,
      session_count, session_duration_minutes, frequency, features
    });

    res.json(pkg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /packages/:id
exports.deletePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const pkg = await Package.findByPk(id);
    if (!pkg) return res.status(404).json({ message: 'Package not found' });

    await pkg.destroy();
    res.json({ message: 'Package deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserPackage = async (req, res) => {
  try {
    const { userId } = req.params;

    const payment = await Payment.findOne({where:{userId},raw: true,attributes: [
              'packagename'],}); 
    if (!payment) {
      return res.status(404).json({ message: 'User payment record not found' });
    }

    const { packagename } = payment;

    const pkg = await Package.findOne({where:{name:packagename}});
    if (!pkg) return res.status(404).json({ message: 'package not found' });

    res.status(200).json({ message: 'Package details fetched successfully',pkg });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getAllPackage = async (req, res) => {
  try {
    const pkg = await Package.findAll();
    if (!pkg.length) return res.status(404).json({ message: 'no package found' });
    res.status(200).json({ message: 'Package details fetched successfully',pkg });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
