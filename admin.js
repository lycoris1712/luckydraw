import { db, collection, getDocs } from './admin.html';

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

// Spin the wheel for 30 participants only
spinBtn.onclick = async () => {
  const participants = await getParticipants();
  if(participants.length === 0) return alert("No participants yet!");

  // Pick 30 participants randomly (or all if less than 30)
  let pool = [];
  if(participants.length <= 30){
    pool = participants;
  } else {
    // Randomly select 30 participants from all
    const shuffled = participants.sort(() => 0.5 - Math.random());
    pool = shuffled.slice(0, 30);
  }

  const winner = pool[Math.floor(Math.random() * pool.length)];
  winnerP.innerText = `${winner.name} - ${winner.number}`;
};

getParticipants();
