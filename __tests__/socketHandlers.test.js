const { createServer } = require('http');
const { Server } = require('socket.io');
const ioClient = require('socket.io-client');
const { Pool } = require('pg');
const pool = new Pool();

describe('Socket.io Tests', () => {
  let clientSocket;
  let httpServer;
  let httpServerAddr;
  let ioServer;

  beforeAll((done) => {
    httpServer = createServer().listen();
    httpServerAddr = httpServer.address();
    ioServer = new Server(httpServer, {
      cors: {
        origin: "*",
      },
    });

    require('../socketHandlers')(ioServer);

    clientSocket = ioClient(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`);

    clientSocket.on('connect', done);
  });

  afterAll((done) => {
    ioServer.close();
    clientSocket.close();
    httpServer.close(done);
  });

  test('should join a room and send a message', (done) => {
    const testMessage = {
      sender_id: 1,
      recipient_id: 2,
      message_text: 'Hello',
      booking_id: 1,
    };

    clientSocket.emit('joinRoom', testMessage.sender_id);

    clientSocket.on('receiveMessage', (message) => {
      expect(message).toMatchObject({
        sender_id: testMessage.sender_id,
        recipient_id: testMessage.recipient_id,
        message: testMessage.message_text,
      });
      done();
    });

    clientSocket.emit('sendMessage', testMessage);
  });

  test('should save message to the database', async () => {
    // Send the message to ensure it gets saved in the database
    clientSocket.emit('sendMessage', {
      sender_id: 1,
      recipient_id: 2,
      message_text: 'Hello',
      booking_id: 1,
    });

    // Wait for the message to be processed and saved
    await new Promise((resolve) => setTimeout(resolve, 500));

    const res = await pool.query('SELECT * FROM messages WHERE sender_id = 1 AND recipient_id = 2 ORDER BY created_at DESC LIMIT 1');
    expect(res.rows[0]).toMatchObject({
      sender_id: 1,
      recipient_id: 2,
      message: 'Hello',
    });
  });
});