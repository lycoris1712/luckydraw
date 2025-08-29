import { db, collection, getDocs } from './admin.html';
import { launchConfetti } from './confetti.js';

const participantsDiv = document.getElementById("participants");
const countSpan = document.getElementById("count");
const spinBtn = document.getElementById("spin");
const winnerP = document.getElementById("winner");

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

// Spin the wheel for 30 participants only with animation
spinBtn.onclick = async () => {
  const participants = await getParticipants();
  if(participants.length === 0) return alert("No participants yet!");

  // Pick 30 participants randomly (or all if less than 30)
  let pool = [];
  if(participants.length <= 30){
    pool = participants;
  } else {
    const shuffled = participants.sort(() => 0.5 - Math.random());
    pool = shuffled.slice(0, 30);
  }

  // Simple visual spin animation
  const wheelText = document.createElement("div");
  wheelText.style.fontSize = "2rem";
  wheelText.style.margin = "20px";
  wheelText.style.animation = "spin 3s ease-out";
  document.body.appendChild(wheelText);

  const spinDuration = 3000;
  const start = Date.now();

  function animateSpin() {
    const now = Date.now();
    const progress = (now-start)/spinDuration;
    const index = Math.floor(progress * pool.length);
    wheelText.innerText = pool[index % pool.length].number;
    if(progress < 1){
      requestAnimationFrame(animateSpin);
    } else {
      const winner = pool[Math.floor(Math.random() * pool.length)];
      winnerP.innerText = `${winner.name} - ${winner.number}`;
      launchConfetti();
      document.body.removeChild(wheelText);
    }
  }

  animateSpin();
};

getParticipants();
