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

// store generated colors per username
const usernameColors = {};

// function to generate a random color
function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r},${g},${b})`;
}

// assign a color for each username (random first time)
function getColor(username) {
  if (!usernameColors[username]) {
    usernameColors[username] = getRandomColor();
  }
  return usernameColors[username];
}

socket.on("message", (data) => {
  const msg = document.createElement("div");

  // SYSTEM messages → center
  if (data.user === "SYSTEM") {
    msg.classList.add("system");
    msg.textContent = `[ ${data.text} ]`;
  } 
  else {
    msg.classList.add("message");

    // Set text color based on username (random)
    msg.style.color = getColor(data.user);

    // Align self vs other
    if (data.user === username) {
      msg.classList.add("self");
      msg.style.textAlign = "left";
    } else {
      msg.classList.add("other");
      msg.style.textAlign = "right";
    }

    msg.textContent = `${data.user}: ${data.text}`;
  }

  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// update online users count
socket.on("onlineUsers", (users) => {
  onlineCount.textContent = users.length;
});


