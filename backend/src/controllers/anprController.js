const prisma = require('../config/prisma');

exports.simulateANPREntry = async (req, res) => {
  try {
    const { plateNumber, locationId } = req.body;

    if (!plateNumber) {
      return res.status(400).json({ success: false, message: 'plateNumber is required' });
    }

    const cleanPlate = plateNumber.toUpperCase().trim();

    // Resolve location by ID or slug
    let targetLocation = null;
    if (locationId) {
      targetLocation = await prisma.parkingLocation.findFirst({
        where: {
          OR: [
            { id: locationId },
            { slug: locationId },
          ],
        },
      });
    }
    if (!targetLocation) {
      targetLocation = await prisma.parkingLocation.findFirst();
    }

    const realLocationId = targetLocation.id;

    // Look for active reservation for this vehicle
    const vehicle = await prisma.vehicle.findUnique({
      where: { plateNumber: cleanPlate },
    });

    let activeReservation = null;
    if (vehicle) {
      activeReservation = await prisma.reservation.findFirst({
        where: {
          vehicleId: vehicle.id,
          locationId: realLocationId,
          status: 'ACTIVE',
        },
        include: { slot: true, location: true },
      });
    }

    if (activeReservation) {
      // Mark entry time and change slot status to OCCUPIED
      await prisma.$transaction([
        prisma.reservation.update({
          where: { id: activeReservation.id },
          data: { entryTime: new Date() },
        }),
        prisma.slot.update({
          where: { id: activeReservation.slotId },
          data: { status: 'OCCUPIED' },
        }),
      ]);

      if (req.io) {
        req.io.emit('anpr_gate_event', {
          type: 'ENTRY',
          plateNumber: cleanPlate,
          locationName: activeReservation.location.name,
          slotNumber: activeReservation.slot.slotNumber,
          timestamp: new Date(),
        });
        req.io.emit('slot_status_changed', {
          slotId: activeReservation.slotId,
          locationId: realLocationId,
          newStatus: 'OCCUPIED',
        });
      }

      return res.json({
        success: true,
        action: 'BARRIER_RAISED',
        message: `Welcome! ANPR recognized plate ${cleanPlate}. Proceed to Slot ${activeReservation.slot.slotNumber}`,
        reservation: activeReservation,
      });
    } else {
      // Unreserved drive-in vehicle -> Auto assign open slot
      const availableSlot = await prisma.slot.findFirst({
        where: { locationId: realLocationId, status: 'AVAILABLE' },
      });

      if (!availableSlot) {
        return res.status(400).json({
          success: false,
          action: 'BARRIER_CLOSED',
          message: 'Parking Lot is 100% full. No open slots available.',
        });
      }

      await prisma.slot.update({
        where: { id: availableSlot.id },
        data: { status: 'OCCUPIED' },
      });

      if (req.io) {
        req.io.emit('anpr_gate_event', {
          type: 'ENTRY_UNRESERVED',
          plateNumber: cleanPlate,
          slotNumber: availableSlot.slotNumber,
          timestamp: new Date(),
        });
        req.io.emit('slot_status_changed', {
          slotId: availableSlot.id,
          locationId: realLocationId,
          newStatus: 'OCCUPIED',
        });
      }

      return res.json({
        success: true,
        action: 'BARRIER_RAISED',
        message: `Drive-in verified for ${cleanPlate}. Auto-assigned Slot ${availableSlot.slotNumber}`,
        assignedSlot: availableSlot,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.simulateANPRExit = async (req, res) => {
  try {
    const { plateNumber, locationId } = req.body;

    if (!plateNumber) {
      return res.status(400).json({ success: false, message: 'plateNumber is required' });
    }

    const cleanPlate = plateNumber.toUpperCase().trim();

    // Resolve location by ID or slug
    let targetLocation = null;
    if (locationId) {
      targetLocation = await prisma.parkingLocation.findFirst({
        where: {
          OR: [
            { id: locationId },
            { slug: locationId },
          ],
        },
      });
    }
    if (!targetLocation) {
      targetLocation = await prisma.parkingLocation.findFirst();
    }

    const realLocationId = targetLocation.id;

    const vehicle = await prisma.vehicle.findUnique({
      where: { plateNumber: cleanPlate },
    });

    let activeReservation = null;
    if (vehicle) {
      activeReservation = await prisma.reservation.findFirst({
        where: {
          vehicleId: vehicle.id,
          locationId: realLocationId,
          status: 'ACTIVE',
        },
        include: { slot: true, location: true },
      });
    }

    if (activeReservation) {
      const exitTime = new Date();
      await prisma.$transaction([
        prisma.reservation.update({
          where: { id: activeReservation.id },
          data: { status: 'COMPLETED', exitTime },
        }),
        prisma.slot.update({
          where: { id: activeReservation.slotId },
          data: { status: 'AVAILABLE' },
        }),
      ]);

      if (req.io) {
        req.io.emit('anpr_gate_event', {
          type: 'EXIT',
          plateNumber: cleanPlate,
          locationName: activeReservation.location.name,
          slotNumber: activeReservation.slot.slotNumber,
          timestamp: exitTime,
        });
        req.io.emit('slot_status_changed', {
          slotId: activeReservation.slotId,
          locationId: realLocationId,
          newStatus: 'AVAILABLE',
        });
      }

      return res.json({
        success: true,
        action: 'BARRIER_RAISED',
        message: `Exit logged for ${cleanPlate}. Have a safe journey! Receipt generated.`,
        invoice: {
          plateNumber: cleanPlate,
          slotNumber: activeReservation.slot.slotNumber,
          duration: '1.5 hrs',
          totalPaid: `₹${activeReservation.totalAmount}`,
          paidAt: exitTime,
        },
      });
    }

    // Default exit release if slot was manually occupied
    return res.json({
      success: true,
      action: 'BARRIER_RAISED',
      message: `Exit verified for ${cleanPlate}. Barrier opened.`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

