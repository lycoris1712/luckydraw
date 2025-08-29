import { db, collection, addDoc, getDocs } from './index.html';

const seatGrid = document.getElementById('seat-grid');
const submitBtn = document.getElementById('submit-btn');
const nameInput = document.getElementById('name-input');
const confirmation = document.getElementById('confirmation');

const allNumbers = Array.from({length: 1001}, (_, i) => 300 + i); // 300-1300

// Render seats for layout
async function renderSeats() {
  seatGrid.innerHTML = "";
  const snapshot = await getDocs(collection(db, "participants"));
  const takenNumbers = snapshot.docs.map(doc => doc.data().number);

  allNumbers.forEach(num => {
    const seat = document.createElement("div");
    seat.className = "seat";
    seat.style.backgroundColor = takenNumbers.includes(num) ? "grey" : "green";
    seat.innerText = num;
    seatGrid.appendChild(seat);
  });
}

// Assign random number to new participant
async function assignNumber(name) {
  const snapshot = await getDocs(collection(db, "participants"));
  const takenNumbers = snapshot.docs.map(doc => doc.data().number);

  if(snapshot.docs.length >= 30) {
    confirmation.innerText = "Sorry, the lucky draw is full (30 participants).";
    return;
  }

  const availableNumbers = allNumbers.filter(n => !takenNumbers.includes(n));
  const randomIndex = Math.floor(Math.random() * availableNumbers.length);
  const assignedNumber = availableNumbers[randomIndex];

  await addDoc(collection(db, "participants"), {
    name: name,
    number: assignedNumber,
    timestamp: new Date()
  });

  confirmation.innerText = `Hi ${name}, your lucky number is ${assignedNumber}!`;
  await renderSeats();
}

// Submit button click
submitBtn.onclick = () => {
  const name = nameInput.value.trim();
  if(!name) return alert("Please enter your name.");
  assignNumber(name);
  nameInput.value = "";
}

// Initial render
renderSeats();
