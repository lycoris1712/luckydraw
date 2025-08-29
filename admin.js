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

// Spin the wheel
spinBtn.onclick = async () => {
  const participants = await getParticipants();
  if(participants.length === 0) return alert("No participants yet!");
  const winner = participants[Math.floor(Math.random() * participants.length)];
  winnerP.innerText = `${winner.name} - ${winner.number}`;
};

getParticipants();
