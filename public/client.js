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
else {
  msg.classList.add("message");

  // Set text color based on username
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

// Predefined set of colors
const colors = ["#00ff7f", "#00bfff", "#ff4500", "#ff69b4", "#ffff00", "#ff8c00", "#adff2f", "#7b68ee"];

// Simple hash function to get consistent color per username
function getColor(username) {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

