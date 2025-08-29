const seatGrid = document.getElementById('seat-grid');
const submitBtn = document.getElementById('submit-btn');
const nameInput = document.getElementById('name-input');
const confirmation = document.getElementById('confirmation');

let allNumbers = Array.from({length: 1001}, (_, i) => 300 + i);
let takenNumbers = [];

function renderSeats() {
  seatGrid.innerHTML = "";
  allNumbers.forEach(num => {
    const seat = document.createElement("div");
    seat.className = "seat";
    seat.style.backgroundColor = takenNumbers.includes(num) ? "grey" : "green";
    seat.innerText = num;
    seatGrid.appendChild(seat);
  });
}

function assignNumber(name) {
  const availableNumbers = allNumbers.filter(n => !takenNumbers.includes(n));
  if(availableNumbers.length === 0){
    confirmation.innerText = "Sorry, all numbers (300–1300) are taken!";
    return;
  }
  const randomIndex = Math.floor(Math.random() * availableNumbers.length);
  const assignedNumber = availableNumbers[randomIndex];
  takenNumbers.push(assignedNumber);
  confirmation.innerHTML = `<div class="confirmation-card">Hi ${name}, your lucky number is ${assignedNumber}!</div>`;
  window.launchConfetti();
  renderSeats();
}

submitBtn.onclick = () => {
  const name = nameInput.value.trim();
  if(!name) return alert("Please enter your name.");
  assignNumber(name);
  nameInput.value = "";
}

renderSeats();
