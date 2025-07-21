let mediaRecorder;
let audioChunks = [];

document.getElementById("micBtn").onclick = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);

  mediaRecorder.onstop = () => {
    const blob = new Blob(audioChunks);
    const reader = new FileReader();
    reader.onloadend = () => {
      sendMessage(reader.result, "media");
    };
    reader.readAsDataURL(blob);
    audioChunks = [];
  };

  mediaRecorder.start();
  setTimeout(() => mediaRecorder.stop(), 4000); // 4-second recording
};
