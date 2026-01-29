export const setupAlertSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket.IO] New client connected: ${socket.id}`);

    // Subscribe to alerts for a specific region
    socket.on('subscribe_region', (data) => {
      const { region } = data;
      if (region) {
        const roomName = `region:${region}`;
        socket.join(roomName);
        console.log(`[Socket.IO] ${socket.id} subscribed to ${roomName}`);
        
        // Send confirmation
        socket.emit('subscribed', { region, message: `Subscribed to ${region} alerts` });
      }
    });

    // Unsubscribe from a region
    socket.on('unsubscribe_region', (data) => {
      const { region } = data;
      if (region) {
        const roomName = `region:${region}`;
        socket.leave(roomName);
        console.log(`[Socket.IO] ${socket.id} unsubscribed from ${roomName}`);
      }
    });

    // Subscribe to all alerts (admin feature)
    socket.on('subscribe_all_alerts', () => {
      socket.join('all-alerts');
      console.log(`[Socket.IO] ${socket.id} subscribed to all alerts`);
      socket.emit('subscribed_all', { message: 'Subscribed to all disaster alerts' });
    });

    // Request alerts for a specific region
    socket.on('get_region_alerts', async (data, callback) => {
      const { region } = data;
      if (region && callback) {
        // In a real scenario, fetch from DB via controller
        callback({ success: true, region, message: `Fetched alerts for ${region}` });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`[Socket.IO] Error on ${socket.id}:`, error);
    });
  });

  return io;
};
