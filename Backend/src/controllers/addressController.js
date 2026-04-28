const prisma = require('../config/db');

// ── GET all addresses for the logged-in user ──────────
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
    res.json({ success: true, data: addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── CREATE a new address ───────────────────────────────
exports.createAddress = async (req, res) => {
  try {
    const { label, name, address, apartment, city, state, pincode, phone, isDefault } = req.body;

    if (!name || !address || !city || !state || !pincode || !phone) {
      return res.status(400).json({ success: false, message: 'All required fields must be filled.' });
    }

    // If this is being set as default, clear others first
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user.id },
        data: { isDefault: false },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId: req.user.id,
        label: label || 'Home',
        name,
        address,
        apartment: apartment || null,
        city,
        state,
        pincode,
        phone,
        isDefault: isDefault || false,
      },
    });

    res.status(201).json({ success: true, data: newAddress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── DELETE an address ──────────────────────────────────
exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure the address belongs to this user
    const address = await prisma.address.findFirst({
      where: { id: parseInt(id), userId: req.user.id },
    });

    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found.' });
    }

    await prisma.address.delete({ where: { id: parseInt(id) } });
    res.json({ success: true, message: 'Address deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── SET an address as default ──────────────────────────
exports.setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure the address belongs to this user
    const address = await prisma.address.findFirst({
      where: { id: parseInt(id), userId: req.user.id },
    });

    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found.' });
    }

    // Clear all existing defaults for this user
    await prisma.address.updateMany({
      where: { userId: req.user.id },
      data: { isDefault: false },
    });

    // Set the new default
    const updated = await prisma.address.update({
      where: { id: parseInt(id) },
      data: { isDefault: true },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── UPDATE an address ─────────────────────────────────
exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { label, name, address, apartment, city, state, pincode, phone } = req.body;

    if (!name || !address || !city || !state || !pincode || !phone) {
      return res.status(400).json({ success: false, message: 'All required fields must be filled.' });
    }

    // Ensure the address belongs to this user
    const existing = await prisma.address.findFirst({
      where: { id: parseInt(id), userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Address not found.' });
    }

    const updated = await prisma.address.update({
      where: { id: parseInt(id) },
      data: {
        label: label || 'Home',
        name,
        address,
        apartment: apartment || null,
        city,
        state,
        pincode,
        phone,
      },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
