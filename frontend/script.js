const socket = io("https://render-vexw.onrender.com");
let myName = prompt("Enter your name");
let selectedUser = "";
const Socket = io("http://localhost:10000"); // or your deployed server

socket.emit("register-user", myName);

const userList = document.getElementById("userList");
const chatBox = document.getElementById("chatBox");
const msgInput = document.getElementById("msgInput");

document.getElementById("sendBtn").onclick = () => {
  if (msgInput.value && selectedUser) {
    sendMessage(msgInput.value, "text");
    msgInput.value = "";
  }
};

document.getElementById("mediaInput").onchange = (e) => {
  const file = e.target.files[0];
  if (file && selectedUser) {
    const reader = new FileReader();
    reader.onload = () => {
      sendMessage(reader.result, "media");
    };
    reader.readAsDataURL(file);
  }
};

function sendMessage(content, type) {
  socket.emit("private-message", {
    to: selectedUser,
    message: content,
    type,
  });

  renderMessage({ from: myName, message: content, type, time: new Date().toLocaleTimeString() }, true);
}

socket.on("receive-message", (data) => {
  if (data.from === selectedUser) renderMessage(data, false);
});

socket.on("user-list", (users) => {
  userList.innerHTML = "";
  users.filter(u => u !== myName).forEach(u => {
    const li = document.createElement("li");
    li.textContent = u;
    li.onclick = () => {
      selectedUser = u;
      chatBox.innerHTML = "";
    };
    userList.appendChild(li);
  });
});

function renderMessage({ from, message, type, time }, isMe) {
  const msgDiv = document.createElement("div");
  msgDiv.className = "message " + (isMe ? "from-me" : "from-other");

  if (type === "media") {
    const img = document.createElement("img");
    img.src = message;
    msgDiv.appendChild(img);
  } else {
    msgDiv.textContent = `${message} (${time})`;
  }

  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}
