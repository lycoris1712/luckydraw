const SHEET_URL = "https://script.google.com/macros/s/AKfycbysj-eMQ4wOAQZOnxJ8TchNGW5C7p8ZozCAGjKdnMpCKUd3yD-bHEVT6hN1mr_jlM5e/exec";
const START_NUM = 300;
const END_NUM = 1300;

document.addEventListener("DOMContentLoaded", () => {
  loadSeats();

  const form = document.getElementById("registerForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    if (!name) return;

    let taken = await fetch(SHEET_URL).then(res => res.json());
    let takenNumbers = taken.map(item => parseInt(item.number));

    // find available numbers
    let available = [];
    for (let i = START_NUM; i <= END_NUM; i++) {
      if (!takenNumbers.includes(i)) available.push(i);
    }

    if (available.length === 0) {
      document.getElementById("result").innerText = "Sorry, all numbers taken!";
      return;
    }

    // pick random available number
    let rand = available[Math.floor(Math.random() * available.length)];

    // save to Google Sheets
    await fetch(SHEET_URL, {
      method: "POST",
      body: JSON.stringify({ name: name, number: rand }),
    });

    document.getElementById("result").innerText = 
      🎉 Congratulations ${name}, your lucky number is ${rand}!;

    loadSeats(); // refresh seats
  });
});

async function loadSeats() {
  const container = document.getElementById("seatContainer");
  container.innerHTML = "";

  let taken = await fetch(SHEET_URL).then(res => res.json());
  let takenNumbers = taken.map(item => parseInt(item.number));

  for (let i = START_NUM; i <= END_NUM; i++) {
    const seat = document.createElement("div");
    seat.classList.add("seat");
    seat.innerText = i;

    if (takenNumbers.includes(i)) {
      seat.classList.add("taken");
    }

    container.appendChild(seat);
  }
}
