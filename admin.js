import { db, collection, getDocs } from './admin.html';

const participantsDiv = document.getElementById("participants");
const winnerP = document.getElementById("winner");
const spinBtn = document.getElementById("spin");

// Show all participants
async function showParticipants() {
  participantsDiv.innerHTML = "";
  const snapshot = await getDocs(collection(db, "participants"));
  const participants = snapshot.docs.map(doc => doc.data());
  participants.forEach(p => {
    const pEl = document.createElement("p");
    pEl.innerText = `${p.name} - ${p.number}`;
    participantsDiv.appendChild(pEl);
  });
  return participants;
}

// Spin the wheel
spinBtn.onclick = async () => {
  const participants = await showParticipants();
  if(participants.length === 0) return alert("No participants yet!");
  const winner = participants[Math.floor(Math.random() * participants.length)];
  winnerP.innerText = `${winner.name} - ${winner.number}`;
};
showParticipants();
