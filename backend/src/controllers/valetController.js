const prisma = require('../config/prisma');

exports.requestValet = async (req, res) => {
  try {
    const userId = req.user.id;
    const { vehicleId, keyTagNumber } = req.body;

    let targetVehicleId = vehicleId;
    if (!targetVehicleId) {
      const firstVehicle = await prisma.vehicle.findFirst({ where: { userId } });
      if (!firstVehicle) {
        return res.status(400).json({ success: false, message: 'Please add a vehicle first' });
      }
      targetVehicleId = firstVehicle.id;
    }

    const ticket = await prisma.valetTicket.create({
      data: {
        userId,
        vehicleId: targetVehicleId,
        keyTagNumber: keyTagNumber || `VALET-KEY-${Math.floor(100 + Math.random() * 900)}`,
        status: 'REQUESTED',
      },
      include: { vehicle: true },
    });

    if (req.io) {
      req.io.emit('valet_ticket_update', ticket);
    }

    return res.status(201).json({ success: true, message: 'Valet service requested successfully', ticket });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getValetTickets = async (req, res) => {
  try {
    const isValetStaff = req.user.role === 'VALET_STAFF' || req.user.role === 'ADMINISTRATOR';

    const whereClause = isValetStaff ? {} : { userId: req.user.id };

    const tickets = await prisma.valetTicket.findMany({
      where: whereClause,
      include: { user: true, vehicle: true },
      orderBy: { requestedAt: 'desc' },
    });

    return res.json({ success: true, tickets });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateValetStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status, parkingSlot } = req.body; // PARKED, RETRIEVAL_REQUESTED, DELIVERED

    const updated = await prisma.valetTicket.update({
      where: { id: ticketId },
      data: {
        status,
        parkingSlot: parkingSlot || undefined,
        deliveredAt: status === 'DELIVERED' ? new Date() : undefined,
      },
      include: { user: true, vehicle: true },
    });

    if (req.io) {
      req.io.emit('valet_ticket_update', updated);
    }

    return res.json({ success: true, message: `Valet status updated to ${status}`, ticket: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
