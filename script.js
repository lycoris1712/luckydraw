import { db, collection, addDoc, getDocs } from './index.html';

const seatGrid = document.getElementById('seat-grid');
const seats = Array.from({length: 1001}, (_, i) => 300 + i); // 300-1300

// Fetch taken seats from Firebase
async function getTakenSeats() {
  const snapshot = await getDocs(collection(db, "participants"));
  return snapshot.docs.map(doc => doc.data().number);
}

async function initSeats() {
  const takenSeats = await getTakenSeats();

  seats.forEach(num => {
    const seat = document.createElement('button');
    seat.innerText = num;
    seat.disabled = takenSeats.includes(num);
    seat.onclick = async () => {
      const name = prompt("Enter your name:");
      if(name) {
        await addDoc(collection(db, "participants"), {
          name: name,
          number: num,
          timestamp: new Date()
        });
        alert(`Your lucky number is ${num}, ${name}!`);
        seat.disabled = true;
        seat.style.background = "gray";
      }
    };
    seatGrid.appendChild(seat);
  });
}

initSeats();
