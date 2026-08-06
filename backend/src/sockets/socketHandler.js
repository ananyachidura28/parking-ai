function initSocketIO(io) {
  io.on('connection', (socket) => {
    console.log(`⚡ Client connected to Socket.IO: ${socket.id}`);

    // Join location room for live slot changes
    socket.on('join_location', (locationId) => {
      socket.join(`location_${locationId}`);
      console.log(`Socket ${socket.id} joined location room: location_${locationId}`);
    });

    socket.on('leave_location', (locationId) => {
      socket.leave(`location_${locationId}`);
    });

    // Real-time slot status toggle simulation
    socket.on('toggle_slot_status', ({ slotId, locationId, newStatus }) => {
      io.to(`location_${locationId}`).emit('slot_status_changed', {
        slotId,
        locationId,
        newStatus,
        updatedAt: new Date(),
      });
      io.emit('slot_status_changed', { slotId, locationId, newStatus, updatedAt: new Date() });
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });
}

module.exports = initSocketIO;
