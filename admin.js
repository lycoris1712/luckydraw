import { db, collection, getDocs } from './admin.html';
import { launchConfetti } from './confetti.js';

const participantsDiv = document.getElementById("participants");
const countSpan = document.getElementById("count");
const spinBtn = document.getElementById("spin");
const winnerP = document.getElementById("winner");
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const radius = 200;
const center = {x: radius, y: radius};

async function getParticipants() {
  const snapshot = await getDocs(collection(db, "participants"));
  const participants = snapshot.docs.map(doc => doc.data());
  participantsDiv.innerHTML = "";
  participants.forEach(p => {
    const pEl = document.createElement("p");
    pEl.innerText = `${p.name} - ${p.number}`;
    participantsDiv.appendChild(pEl);
  });
  countSpan.innerText = participants.length;
  return participants;
}

function drawWheel(participants, rotation=0) {
  const segments = participants.length;
  const angle = 2 * Math.PI / segments;
  ctx.clearRect(0,0,400,400);

  participants.forEach((p, i) => {
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.arc(center.x, center.y, radius, i*angle + rotation, (i+1)*angle + rotation);
    ctx.fillStyle = i%2===0 ? "#4caf50" : "#2196f3";
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.translate(center.x, center.y);
    ctx.rotate((i+0.5)*angle + rotation);
    ctx.fillStyle = "#fff";
    ctx.textAlign = "right";
    ctx.font = "16px Arial";
    ctx.fillText(p.number, radius-10, 5);
    ctx.restore();
  });
}

function spinWheel(participants) {
  let rotation = 0;
  const spinTime = 4000;
  const start = Date.now();
  const segments = participants.length;

  function animate() {
    const now = Date.now();
    const elapsed = now - start;
    const t = Math.min(elapsed / spinTime, 1);
    const easeOut = 1 - Math.pow(1-t, 3);
    rotation = easeOut * Math.PI * 8;
    drawWheel(participants, rotation);

    if(t < 1){
      requestAnimationFrame(animate);
    } else {
      const winnerIndex = Math.floor(Math.random() * segments);
      const winner = participants[winnerIndex];
      winnerP.innerText = `${winner.name} - ${winner.number}`;
      launchConfetti();
    }
  }
  animate();
}

spinBtn.onclick = async () => {
  let participants = await getParticipants();
  if(participants.length === 0) return alert("No participants yet!");
  if(participants.length > 30){
    participants = participants.sort(() => 0.5 - Math.random()).slice(0,30);
  }
  spinWheel(participants);
};

getParticipants();
