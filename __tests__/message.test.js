const { app, server } = require("../app");
const ioClient = require("socket.io-client");
const { saveMessage } = require("../controllers/messageController");
const request = require("supertest");

let clientSocket;

beforeAll((done) => {
    server.listen(() => {
        clientSocket = io(`http://localhost:${server.address().port}`);
        clientSocket.on("connect", done);
    });
});

afterAll(() => {
    clientSocket.close();
    server.close();
});

describe("Socket.io message tests", () => {
    test("should receive message", (done) => {
        const testMessage = {
            sender_id: 1,
            recipient_id: 2,
            sender_type: "client",
            recipient_type: "entertainer",
            messageText: "Test message",
            booking_id: 1
        };

        clientSocket.on("receive_message", (message) => {
            expect(message).toMatchObject(testMessage);
            done();
        });

        clientSocket.emit("send_message", testMessage);
    });
});