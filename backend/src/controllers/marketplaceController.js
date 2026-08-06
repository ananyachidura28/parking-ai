const prisma = require('../config/prisma');

exports.getListings = async (req, res) => {
  try {
    const { city, search } = req.query;

    const whereClause = {};
    if (city) whereClause.city = { contains: city };
    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { address: { contains: search } },
      ];
    }

    const listings = await prisma.marketplaceListing.findMany({
      where: whereClause,
      include: { user: { select: { fullName: true, email: true, phone: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, count: listings.length, listings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createListing = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, address, city, hourlyRate, dailyRate, availableFrom, availableTo, contactPhone, imageUrl } = req.body;

    const listing = await prisma.marketplaceListing.create({
      data: {
        userId,
        title,
        address,
        city,
        hourlyRate: parseFloat(hourlyRate),
        dailyRate: parseFloat(dailyRate || hourlyRate * 8),
        availableFrom: availableFrom || '08:00 AM',
        availableTo: availableTo || '08:00 PM',
        contactPhone: contactPhone || req.user.phone || '+91 9876543210',
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80',
      },
    });

    return res.status(201).json({ success: true, message: 'Parking space listed on Marketplace!', listing });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
