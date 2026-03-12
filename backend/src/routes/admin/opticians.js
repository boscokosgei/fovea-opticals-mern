// backend/src/routes/admin/opticians.js
const express = require('express');
const router = express.Router();
const Optician = require('../../models/Optician');

// GET all opticians
router.get('/', async (req, res) => {
  try {
    const opticians = await Optician.find().sort({ name: 1 });
    res.json(opticians);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single optician
router.get('/:id', async (req, res) => {
  try {
    const optician = await Optician.findById(req.params.id);
    if (!optician) {
      return res.status(404).json({ error: 'Optician not found' });
    }
    res.json(optician);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create optician
router.post('/', async (req, res) => {
  try {
    const optician = new Optician(req.body);
    await optician.save();
    res.status(201).json(optician);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update optician
router.put('/:id', async (req, res) => {
  try {
    const optician = await Optician.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!optician) {
      return res.status(404).json({ error: 'Optician not found' });
    }
    res.json(optician);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE optician
router.delete('/:id', async (req, res) => {
  try {
    const optician = await Optician.findByIdAndDelete(req.params.id);
    if (!optician) {
      return res.status(404).json({ error: 'Optician not found' });
    }
    res.json({ message: 'Optician deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;