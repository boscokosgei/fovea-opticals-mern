// backend/src/routes/admin.js
const express = require('express');
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const Optician = require('../models/Optician');
const User = require('../models/User');
const router = express.Router();

// Get dashboard stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const stats = {
      totalAppointments: await Appointment.countDocuments(),
      todayAppointments: await Appointment.countDocuments({
        appointmentDate: { $gte: today, $lt: tomorrow }
      }),
      totalServices: await Service.countDocuments(),
      totalOpticians: await Optician.countDocuments(),
      totalUsers: await User.countDocuments(),
      pendingAppointments: await Appointment.countDocuments({ status: 'scheduled' }),
      recentAppointments: await Appointment.find()
        .populate('service')
        .populate('optician')
        .sort({ createdAt: -1 })
        .limit(10)
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all appointments (admin view)
router.get('/appointments', async (req, res) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 20 } = req.query;
    
    const query = {};
    
    if (status) query.status = status;
    if (startDate || endDate) {
      query.appointmentDate = {};
      if (startDate) query.appointmentDate.$gte = new Date(startDate);
      if (endDate) query.appointmentDate.$lte = new Date(endDate);
    }

    const appointments = await Appointment.find(query)
      .populate('service')
      .populate('optician')
      .sort({ appointmentDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Appointment.countDocuments(query);

    res.json({
      appointments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update appointment status
router.put('/appointments/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['scheduled', 'confirmed', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('service').populate('optician');

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Manage services
router.post('/services', async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/services/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/services/:id', async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Manage opticians
router.post('/opticians', async (req, res) => {
  try {
    const optician = new Optician(req.body);
    await optician.save();
    res.status(201).json(optician);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/opticians/:id', async (req, res) => {
  try {
    const optician = await Optician.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(optician);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/opticians/:id', async (req, res) => {
  try {
    await Optician.findByIdAndDelete(req.params.id);
    res.json({ message: 'Optician deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;