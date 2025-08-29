const participantsDiv = document.getElementById("participants");
const countSpan = document.getElementById("count");
const spinBtn = document.getElementById("spin");
const winnerP = document.getElementById("winner");
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const radius = 200;
const center = {x: radius, y: radius};

// Local participant list (simulate what tourists picked)
let participants = []; // will be updated by manual adding or sync later

// Example: for testing, pre-fill some participants
for(let i=300; i<=350; i++){ // just 50 for test
  participants.push({name: "User"+i, number: i});
}

// Draw wheel segments
function drawWheel(list, rotation=0){
  const segments = list.length;
  const angle = 2 * Math.PI / segments;
  ctx.clearRect(0,0,400,400);
  list.forEach((p,i)=>{
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

// Spin wheel function
function spinWheel(){
  const spinParticipants = participants.slice(0,30); // pick first 30
  if(spinParticipants.length === 0){
    alert("No participants!");
    return;
  }

  let rotation = 0;
  const spinTime = 4000;
  const start = Date.now();
  const segments = spinParticipants.length;

  function animate(){
    const now = Date.now();
    const elapsed = now-start;
    const t = Math.min(elapsed/spinTime,1);
    const easeOut = 1 - Math.pow(1-t,3);
    rotation = easeOut * Math.PI * 8;
    drawWheel(spinParticipants, rotation);
    if(t<1){
      requestAnimationFrame(animate);
    }else{
      const winnerIndex = Math.floor(Math.random()*segments);
      const winner = spinParticipants[winnerIndex];
      winnerP.innerText = `${winner.name} - ${winner.number}`;
      window.launchConfetti();
    }
  }
  animate();
}

// Render participants list
function renderParticipants(){
  participantsDiv.innerHTML="";
  participants.forEach(p=>{
    const pEl = document.createElement("p");
    pEl.innerText = `${p.name} - ${p.number}`;
    participantsDiv.appendChild(pEl);
  });
  countSpan.innerText = participants.length;
}

// Button click
spinBtn.onclick = spinWheel;

// Initial rendering
renderParticipants();
drawWheel(participants.slice(0,30));
