// Require the Message model
const Message = require("../models/message");

// Export a function that takes in the socket.io server object as an argument
module.exports = (io) => {
  // Listen for new socket connections
  io.on("connection", (client) => {
    console.log("new connection");
    // Listen for a "user joined" event and broadcast it to all other clients
    client.on("user joined", (data) => {
      client.userName = data.userName;
      client.userId = data.userId;
      client.broadcast.emit("user joined", { userName: data.userName, userId: data.userId });
    });
    // Listen for a "user left" event and broadcast it to all other clients
    client.on("user left", () => {
      client.broadcast.emit("user left", { userName: client.userName, userId: client.userId });
    });
    // Listen for a "disconnect" event and broadcast it to all other clients
    client.on("disconnect", () => {
      client.broadcast.emit("user disconnected");
      console.log("user disconnected");
    });
    // Listen for a "message" event and save the message to the database
    client.on("message", (data) => {
      let messageAttributes = {
        content: data.content,
        userName: data.userName,
        user: data.userId,
      };
      Message.create(messageAttributes)
        .then(() => {
          // Broadcast the message to all clients
          io.emit("message", messageAttributes);
        })
        .catch((error) => {
          console.log(`error: ${error.message}`);
        });
    });
    // Load the 20 most recent messages from the database and send them to the client
    Message.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .then((messages) => {
        client.emit("load all messages", messages.reverse());
      });
  });
};
