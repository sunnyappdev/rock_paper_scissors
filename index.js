const choices = ["rock", "paper", "scissors"];

const choiceIcons = {
  rock: "🪨",
  paper: "📄",
  scissors: "✂️",
};

// --- SOUND SPRITE SETUP ---
const gameSounds = new Howl({
  src: [
    "https://assets.mixkit.co/sfx/preview/mixkit-extra-bonus-in-a-video-game-2045.mp3",
    "https://assets.mixkit.co/sfx/preview/mixkit-player-losing-or-failing-2042.mp3",
    "https://assets.mixkit.co/sfx/preview/mixkit-game-level-completed-2059.mp3",
  ],
  sprite: {
    win: [0, 1800], // segment 1 (e.g., 0–1.8s)
    lose: [2000, 2000], // segment 2 (e.g., 2–4s)
    tie: [4000, 2000], // optional placeholder sound
  },
});

// to make audio work on mobile
document.addEventListener(
  "click",
  () => {
    if (!gameSounds._sounds.length) return;
    gameSounds.play("tie");
    gameSounds.stop();
  },
  { once: true }
);

let total = {
  player: {
    win: 0,
    loss: 0,
    tie: 0,
  },
  computer: {
    win: 0,
    loss: 0,
    tie: 0,
  },
};

let currRound = 0;

function playerChoose(choice, rounds) {
  console.log(`Player chooses: ${choice}.`);

  simulate(choice);
}

function computerChoose() {
  const idxComputer = Math.floor(Math.random() * choices.length);
  const computerChoice = choices[idxComputer];

  console.log(`Computer chooses: ${computerChoice}.`);
  return computerChoice;
}

function highlightChoice(choice) {
  const btns = document.querySelectorAll(".choices button");
  btns.forEach((btn) => btn.classList.remove("selected"));

  const selectedBtn = Array.from(btns).find((b) =>
    b.textContent.toLowerCase().includes(choice)
  );
  selectedBtn.classList.add("selected");
  setTimeout(() => selectedBtn.classList.remove("selected"), 500);
}

function playGame(playerChoice, computerChoice) {
  if (playerChoice === "rock") {
    if (computerChoice === "scissors") {
      total.player.win += 1;
      total.computer.loss += 1;
    } else if (computerChoice === "paper") {
      total.player.loss += 1;
      total.computer.win += 1;
    }
    // computerChoice === "rock"
    else {
      total.player.tie += 1;
      total.computer.tie += 1;
    }
    return;
  } else if (playerChoice === "paper") {
    if (computerChoice === "scissors") {
      total.player.loss += 1;
      total.computer.win += 1;
    } else if (computerChoice === "paper") {
      total.player.tie += 1;
      total.computer.tie += 1;
    }
    // computerChoice === "rock"
    else {
      total.player.win += 1;
      total.computer.loss += 1;
    }
    return;
  } else if (playerChoice === "scissors") {
    if (computerChoice === "scissors") {
      total.player.tie += 1;
      total.computer.tie += 1;
    } else if (computerChoice === "paper") {
      total.player.win += 1;
      total.computer.loss += 1;
    }
    // computerChoice === "rock"
    else {
      total.player.loss += 1;
      total.computer.win += 1;
    }
    return;
  }
}

function updateScoreboard(total) {
  const playerWins = total.player.win;
  const computerWins = total.computer.win;
  const ties = total.player.tie;

  document.getElementById("pWin").textContent = playerWins;
  document.getElementById("cWin").textContent = computerWins;
  document.getElementById("ties").textContent = ties;
}

function displayRoundResult(result, currRound) {
  let winLoss = "";
  if (result.player?.win) {
    winLoss = "WIN";
  } else if (result.player?.loss) {
    winLoss = "LOSE";
  } else {
    winLoss = "TIED";
  }

  document.getElementById("roundResult").textContent = `Round ${
    currRound + 1
  }:  ${winLoss}.`;
}

function compare(prev, curr) {
  let change = { player: {}, computer: {} };
  for (const side of ["player", "computer"]) {
    for (const key of ["win", "loss", "tie"]) {
      if (curr[side][key] !== prev[side][key]) {
        // console.log(
        //   `${side}.${key} changed by ${curr[side][key] - prev[side][key]}`
        // );
        change[side][key] = curr[side][key] - prev[side][key];
      }
    }
  }
  return change;
}

function resetGame() {
  currRound = 0;

  total.player = {
    win: 0,
    loss: 0,
    tie: 0,
  };

  total.computer = {
    win: 0,
    loss: 0,
    tie: 0,
  };

  // clear round & game result & hide prompt
  document.getElementById("roundResult").textContent = "";
  document.getElementById("gameResult").textContent = "";
  document.getElementById("replayPrompt").style.display = "none";

  // clear scoreboard
  updateScoreboard(total);
}

function endGame() {
  document.getElementById("replayPrompt").style.display = "none";
}

function displayWinner(total) {
  if (total.player.win > total.computer.win) {
    document.getElementById("gameResult").textContent = "You WIN";
    return;
  } else if (total.player.win === total.computer.win) {
    document.getElementById("gameResult").textContent = "It's a TIE";
    return;
  } else {
    document.getElementById("gameResult").textContent = "You LOSE";
    return;
  }
}

function updateMatchArea(playerChoice, computerChoice) {
  const playerDiv = document.getElementById("playerMatchChoice");
  const compDiv = document.getElementById("computerMatchChoice");
  const matchArea = document.getElementById("matchArea");

  // glow animation for match area
  matchArea.classList.add("active");

  playerDiv.textContent = choiceIcons[playerChoice];
  playerDiv.classList.add("show");

  // clear previous computer choice
  compDiv.innerHTML = "";

  // show computer thinking orb
  const orb = document.createElement("div");
  orb.classList.add("computer-thinking");
  compDiv.appendChild(orb);

  // show result after 2s
  setTimeout(() => {
    orb.remove();
    compDiv.innerHTML = choiceIcons[computerChoice];
    compDiv.classList.add("show");
    matchArea.classList.remove("active");
  }, 2000);
}

function simulate(playerChoice) {
  const roundSelect = document.getElementById("roundSelect");
  const rounds = parseInt(roundSelect.value, 10);

  highlightChoice(playerChoice);

  console.log(`Round ${currRound + 1}`);

  const computerChoice = computerChoose();

  // for animation
  updateMatchArea(playerChoice, computerChoice);

  // delay determining round winner and calculating results
  setTimeout(() => {
    const prevTotals = {
      player: { ...total.player },
      computer: { ...total.computer },
    };

    playGame(playerChoice, computerChoice);

    const result = compare(prevTotals, total);
    console.log("result: \n", result);
    displayRoundResult(result, currRound);
    updateScoreboard(total);

    // TODO doesn't work
    // play sounds
    if (result.player?.win) {
      gameSounds.play("win");
    } else if (result.player?.loss) {
      gameSounds.play("lose");
    } else {
      gameSounds.play("tie");
    }

    currRound++;

    if (currRound === rounds) {
      displayWinner(total);

      // self destruct animation
      const main = document.querySelector("main");
      main.classList.add("self-destruct");

      // document.getElementById("replayPrompt").style.display = "block";

      // TODO
      setTimeout(() => {
        document.getElementById("replayPrompt").style.display = "block";
      }, 3000); // show replay after animation

      return;
    }
    return;
  }, 2500);
}

function shareGame() {
  const shareData = {
    title: "Rock Paper Scissors by Sunny App Dev",
    text: "Can you beat the AI at rock paper scissors?",
    url: window.location.href,
  };

  if (navigator.share) {
    navigator
      .share(shareData)
      .catch((err) => console.error("Share failed:", err));
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert("Game link copied to clipboard!");
    });
  }
}

// TODO
// TODO
// choose a character .... Rocky, Cali, Uncle Alex
// host on glitch?
