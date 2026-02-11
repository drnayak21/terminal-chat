// connect browser to server
const socket = io();

// get HTML elements
const loginDiv = document.getElementById("login");
const chatDiv = document.getElementById("chat");

const usernameInput = document.getElementById("usernameInput");
const messageInput = document.getElementById("messageInput");

const messagesDiv = document.getElementById("messages");
const onlineCount = document.getElementById("onlineCount");

// store username
let username = "";


// USERNAME JOIN (Enter key)
usernameInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const name = usernameInput.value.trim();
    if (!name) return;

    username = name;
    socket.emit("join", username);

    loginDiv.style.display = "none";
    chatDiv.style.display = "flex";

    messageInput.focus();
  }
});

// SEND MESSAGE (Enter key)
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const message = messageInput.value.trim();
    if (!message) return;

    socket.emit("sendMessage", { user: username, text: message });
    messageInput.value = "";
  }
});





socket.on("message", (data) => {
  const msg = document.createElement("div");

  // SYSTEM messages → center
  if (data.user === "SYSTEM") {
    msg.classList.add("system");
    msg.textContent = `[ ${data.text} ]`;
  } 
  // YOUR messages → LEFT
  else if (data.user === username) {
    msg.classList.add("message", "self");
    msg.textContent = `${data.user}: ${data.text}`;
  } 
  // OTHER users → RIGHT
  else {
    msg.classList.add("message", "other");
    msg.textContent = `${data.user}: ${data.text}`;
  }

  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});



// update online users count
socket.on("onlineUsers", (users) => {
  onlineCount.textContent = users.length;
});


