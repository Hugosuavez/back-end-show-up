const { Pool } = require('pg');
const pool = new Pool();

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);

    // Join a room based on user id
    socket.on('joinRoom', (userId) => {
      socket.join(userId);
    });

    // Listen for message events
    socket.on('sendMessage', async (message) => {
      const { sender_id, recipient_id, message_text, booking_id } = message;

      try {
        // Save message to the database
        const result = await pool.query(
          'INSERT INTO messages (sender_id, recipient_id, sender_type, recipient_type, message, booking_id, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *',
          [sender_id, recipient_id, 'client', 'entertainer', message_text, booking_id]
        );
        const savedMessage = result.rows[0];

        // Emit the message to the recipient
        io.to(recipient_id).emit('receiveMessage', savedMessage);

        // Emit the message to the sender
        socket.emit('receiveMessage', savedMessage);
      } catch (error) {
        console.error('Error saving message:', error);
        socket.emit('errorMessage', 'Failed to send message');
      }
    });

    socket.on('disconnect', () => {
      console.log('user disconnected:', socket.id);
    });
  });
};