const prisma = require('../config/prisma');

exports.createReservation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { locationId, slotId, vehicleId, durationHours = 2, paymentMethod = 'UPI' } = req.body;

    // 1. Verify Slot is AVAILABLE
    const slot = await prisma.slot.findUnique({
      where: { id: slotId },
      include: { location: true },
    });

    if (!slot) {
      return res.status(404).json({ success: false, message: 'Parking slot not found' });
    }

    if (slot.status !== 'AVAILABLE') {
      return res.status(400).json({ success: false, message: 'Selected slot is no longer available. Please pick another slot.' });
    }

    // 2. Ensure Vehicle exists or get primary vehicle
    let userVehicleId = vehicleId;
    if (!userVehicleId) {
      const firstVehicle = await prisma.vehicle.findFirst({ where: { userId } });
      if (!firstVehicle) {
        return res.status(400).json({ success: false, message: 'Please add a vehicle before making a reservation' });
      }
      userVehicleId = firstVehicle.id;
    }

    // 3. Calculate Total Amount
    const totalAmount = slot.hourlyPrice * durationHours;
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=PARK-${slot.slotNumber}-${Date.now()}`;

    const realLocationId = slot.locationId;

    // 4. Create Reservation & Update Slot Status in a transaction
    const [reservation, updatedSlot] = await prisma.$transaction([
      prisma.reservation.create({
        data: {
          userId,
          locationId: realLocationId,
          slotId,
          vehicleId: userVehicleId,
          startTime,
          endTime,
          totalAmount,
          status: 'ACTIVE',
          qrCodeUrl,
        },
      }),
      prisma.slot.update({
        where: { id: slotId },
        data: { status: 'RESERVED' },
      }),
    ]);

    // 5. Create Payment record
    const payment = await prisma.payment.create({
      data: {
        reservationId: reservation.id,
        userId,
        amount: totalAmount,
        status: 'COMPLETED',
        method: paymentMethod,
        transactionId: `TXN-${Date.now()}`,
      },
    });

    // 6. Award Loyalty Points
    await prisma.user.update({
      where: { id: userId },
      data: {
        loyaltyPoints: { increment: Math.floor(totalAmount / 10) },
      },
    });

    // 7. Emit Socket broadcast if io is attached
    if (req.io) {
      req.io.emit('slot_status_changed', {
        slotId: slot.id,
        locationId: realLocationId,
        slotNumber: slot.slotNumber,
        newStatus: 'RESERVED',
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Slot successfully reserved!',
      reservation: {
        ...reservation,
        slot,
        payment,
      },
    });
  } catch (error) {
    console.error('Reservation Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserReservations = async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      where: { userId: req.user.id },
      include: {
        location: true,
        slot: { include: { floor: true } },
        vehicle: true,
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, count: reservations.length, reservations });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getActiveReservation = async (req, res) => {
  try {
    const active = await prisma.reservation.findFirst({
      where: {
        userId: req.user.id,
        status: 'ACTIVE',
      },
      include: {
        location: true,
        slot: { include: { floor: true } },
        vehicle: true,
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, activeReservation: active });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: { slot: true },
    });

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    if (reservation.userId !== req.user.id && req.user.role !== 'ADMINISTRATOR') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this reservation' });
    }

    await prisma.$transaction([
      prisma.reservation.update({
        where: { id },
        data: { status: 'CANCELLED' },
      }),
      prisma.slot.update({
        where: { id: reservation.slotId },
        data: { status: 'AVAILABLE' },
      }),
    ]);

    if (req.io) {
      req.io.emit('slot_status_changed', {
        slotId: reservation.slotId,
        locationId: reservation.locationId,
        slotNumber: reservation.slot.slotNumber,
        newStatus: 'AVAILABLE',
      });
    }

    return res.json({ success: true, message: 'Reservation cancelled successfully and slot released' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
