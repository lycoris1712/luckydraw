const API_URL = "https://script.google.com/macros/s/AKfycbxhOr3ywsJhEcQfpbBsxr6Vxq-17bc5ZRfqpqogiLXxH99Goco5EQaG6L8oEa0sYYEy/exec";

// Generate cinema seats (300–1300)
const seatsContainer = document.getElementById("seats");
for (let i = 300; i <= 1300; i++) {
  let seat = document.createElement("div");
  seat.className = "seat";
  seat.innerText = i;
  seat.id = "seat-" + i;
  seatsContainer.appendChild(seat);
}

// Handle form submit
document.getElementById("luckyForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  let name = document.getElementById("name").value;

  // Generate random number
  let number = Math.floor(Math.random() * (1300 - 300 + 1)) + 300;

  // Save to Google Sheet
  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ name, number })
  });

  document.getElementById("result").innerText = 
    🎉 Hi ${name}, your lucky number is ${number}!;

  loadSeats(); // refresh seats
});

// Load taken seats from Google Sheets
async function loadSeats() {
  let res = await fetch(API_URL);
  let data = await res.json();

  data.forEach(player => {
    let seat = document.getElementById("seat-" + player.number);
    if (seat) seat.classList.add("taken");
  });
}

// 🎡 Spin the Wheel
document.getElementById("spinButton").addEventListener("click", async () => {
  let res = await fetch(API_URL);
  let data = await res.json();

  if (data.length === 0) {
    alert("No players yet!");
    return;
  }

  let randomWinner = data[Math.floor(Math.random() * data.length)];

  alert(`🎉 The winner is ${randomWinner.name} with number ${randomWinner.number}!`);
});

loadSeats(); // initial load
