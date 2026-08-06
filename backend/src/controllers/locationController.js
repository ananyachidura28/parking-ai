const prisma = require('../config/prisma');
const { recommendBestSlot } = require('../services/aiRecommender');

exports.getLocations = async (req, res) => {
  try {
    const { category, search, hasEV, city } = req.query;

    const whereClause = {};

    if (category) {
      whereClause.category = category.toUpperCase();
    }

    if (city) {
      whereClause.city = { contains: city };
    }

    if (hasEV === 'true') {
      whereClause.hasEVCharging = true;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { address: { contains: search } },
        { city: { contains: search } },
      ];
    }

    const locations = await prisma.parkingLocation.findMany({
      where: whereClause,
      include: {
        floors: true,
        slots: {
          select: {
            id: true,
            status: true,
            type: true,
            isEVCharger: true,
          },
        },
      },
      orderBy: { rating: 'desc' },
    });

    // Calculate dynamic live available counts
    const formattedLocations = locations.map((loc) => {
      const availableCount = loc.slots.filter((s) => s.status === 'AVAILABLE').length;
      const evCount = loc.slots.filter((s) => s.isEVCharger && s.status === 'AVAILABLE').length;
      const occupiedCount = loc.slots.filter((s) => s.status === 'OCCUPIED').length;
      const reservedCount = loc.slots.filter((s) => s.status === 'RESERVED').length;

      return {
        ...loc,
        availableSlotsCount: availableCount,
        availableEVCount: evCount,
        occupiedSlotsCount: occupiedCount,
        reservedSlotsCount: reservedCount,
      };
    });

    return res.json({ success: true, count: formattedLocations.length, locations: formattedLocations });
  } catch (error) {
    console.error('Get Locations Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLocationBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const location = await prisma.parkingLocation.findUnique({
      where: { slug },
      include: {
        floors: {
          include: {
            slots: true,
          },
        },
        reviews: {
          include: {
            user: { select: { fullName: true, avatarUrl: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!location) {
      return res.status(404).json({ success: false, message: 'Parking location not found' });
    }

    // Get flat slots array
    const allSlots = location.floors.flatMap((f) => f.slots);

    const availableSlots = allSlots.filter((s) => s.status === 'AVAILABLE');
    const occupiedSlots = allSlots.filter((s) => s.status === 'OCCUPIED');
    const reservedSlots = allSlots.filter((s) => s.status === 'RESERVED');

    return res.json({
      success: true,
      location,
      summary: {
        total: allSlots.length,
        available: availableSlots.length,
        occupied: occupiedSlots.length,
        reserved: reservedSlots.length,
        evAvailable: availableSlots.filter((s) => s.isEVCharger).length,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAIRecommendation = async (req, res) => {
  try {
    const { locationId } = req.params;
    const { isEV, requiresDisabledAccess, preferVIP } = req.query;

    let targetLocation = await prisma.parkingLocation.findFirst({
      where: {
        OR: [
          { id: locationId },
          { slug: locationId },
        ],
      },
    });

    const realLocationId = targetLocation ? targetLocation.id : locationId;

    const availableSlots = await prisma.slot.findMany({
      where: {
        locationId: realLocationId,
        status: 'AVAILABLE',
      },
      include: { floor: true },
    });

    if (availableSlots.length === 0) {
      return res.status(404).json({ success: false, message: 'No available slots currently at this location' });
    }

    const recommendedSlot = recommendBestSlot(availableSlots, {
      isEV: isEV === 'true',
      requiresDisabledAccess: requiresDisabledAccess === 'true',
      preferVIP: preferVIP === 'true',
    });

    return res.json({
      success: true,
      recommendedSlot,
      reason: `AI matched ${recommendedSlot.slotNumber} in ${recommendedSlot.zone} based on your distance to elevator, EV charger requirement, and current floor occupancy.`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
