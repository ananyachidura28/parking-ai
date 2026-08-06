const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'parksmart_ai_jwt_super_secret_key_2026', {
    expiresIn: '30d',
  });
};

exports.register = async (req, res) => {
  try {
    const { email, password, fullName, phone, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        phone,
        role: role || 'CUSTOMER',
        loyaltyPoints: 100,
        walletBalance: 200.0,
      },
    });

    const token = generateToken(user.id);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        loyaltyPoints: user.loyaltyPoints,
        walletBalance: user.walletBalance,
        membershipTier: user.membershipTier,
      },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user.id);

    return res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        loyaltyPoints: user.loyaltyPoints,
        walletBalance: user.walletBalance,
        membershipTier: user.membershipTier,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        vehicles: true,
        reservations: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { location: true, slot: true, payment: true },
        },
      },
    });

    return res.json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.googleLoginSim = async (req, res) => {
  try {
    const { email, fullName } = req.body;
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      const hashedPassword = await bcrypt.hash('google_oauth_pass_' + Date.now(), 10);
      user = await prisma.user.create({
        data: {
          email,
          fullName: fullName || 'Google User',
          password: hashedPassword,
          role: 'CUSTOMER',
          loyaltyPoints: 150,
          walletBalance: 300.0,
        },
      });
    }

    const token = generateToken(user.id);

    return res.json({
      success: true,
      message: 'Google login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        loyaltyPoints: user.loyaltyPoints,
        walletBalance: user.walletBalance,
        membershipTier: user.membershipTier,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.addVehicle = async (req, res) => {
  try {
    const { plateNumber, make, model, color, isEV } = req.body;

    const existing = await prisma.vehicle.findUnique({ where: { plateNumber } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Vehicle plate number already registered' });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        userId: req.user.id,
        plateNumber: plateNumber.toUpperCase(),
        make,
        model,
        color,
        isEV: Boolean(isEV),
      },
    });

    return res.status(201).json({ success: true, vehicle });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
