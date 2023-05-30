// Initialize the socket connection and set up event listeners
let socket;
let chatHistory = [];
function initChat(shouldInit) {
    if (shouldInit) {
      // Connect to the socket
      socket = io();
      // Receive new messages
      socket.on("message", (message) => {
        // Add the message to the chat history
        chatHistory.push(message);
        // Display the message
        displayMessage(message);
        for (let i = 0; i < 5; i++) {
          $(".chat-icon").fadeOut(200).fadeIn(200);
        }
      });
      
      // Load all chat messages
      socket.on("load all messages", (data) => {
        // If chat history is empty, reverse the data and display messages
        if (chatHistory.length === 0) {
          chatHistory = data.reverse();
          // Clear the chat element before adding messages
          $("#chat").empty(); 
          // Display all messages in the chat history
          chatHistory.forEach((message) => {
            displayMessage(message);
          });
        }
      });
      
      // Display a notification when a user joins the chat
      socket.on("user joined", (data) => {
        displayMessage({
          userName: "Notice",
          content: `${data.userName} joined the chat`,
        });
      });
      
      // Display a notification when a user leaves the chat
      socket.on("user left", (data) => {
        displayMessage({
          userName: "Notice",
          content: `${data.userName} left the chat`,
        });
      });
  
      // Emit user joined event
      let userName = $("#chat-user-name").val();
      let userId = $("#chat-user-id").val();
      socket.emit("user joined", { userName, userId });
    } else {
      // Disconnect the socket and emit the user left event
      if (socket) {
        // Emit user left event
        socket.emit("user left");
        socket.disconnect();
        socket = null;
      }
    }
  }

$("#chat-button").click(() => {
    const loggedIn = $("#chat-user-id").length > 0;
  
    if (loggedIn) {
      // Display the chat form
      $("#chat-container").show();
  
      // Initialize the socket connection
      initChat(true);
    } else {
      // Redirect the user to the login page
      window.location.href = "/users/login";
    }
});

$("#chat-close-button").click(() => {
  // Hide the chat form
  $("#chat-container").hide();

  // Disconnect the socket
  initChat(false);
});

/**
 * This is an event listener that is triggered when the chat form is submitted
 */
$("#chatForm").submit(() => {
  let text = $("#chat-input").val(),
    userName = $("#chat-user-name").val(),
    userId = $("#chat-user-id").val();
  socket.emit("message", { content: text, userId: userId, userName: userName });
  $("#chat-input").val("");
  return false;
});

/**
 * @param {*} message takes a message object as an argument and adds a new chat message to the chat window 
 * by creating a new list item element with the user name and message content.
 */
let displayMessage = (message) => {
    $("#chat").append(
      $("<li>").html(
        `<strong class="message ${getCurrentUserClass(
          message.user
        )}">${message.userName}</strong>: ${message.content}`
      )
    );
  };
  
/**takes a user ID as an argument and returns a string that represents the CSS class to apply to the message element, 
 * depending on whether it was sent by the current user or another user.
 */
let getCurrentUserClass = (id) => {
  let userId = $("#chat-user-id").val();
  return userId === id ? "current-user" : "other-user";
};