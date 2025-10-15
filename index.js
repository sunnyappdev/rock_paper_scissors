const choices = ["rock", "paper", "scissors"];

const choiceIcons = {
  rock: "🪨",
  paper: "📄",
  scissors: "✂️",
};

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

// start of helper code for audio
const sounds = {
  win: new Howl({
    src: ["https://sunnyappdev.github.io/rock_paper_scissors//round_win.mp3"],
  }),
  lose: new Howl({
    src: ["https://sunnyappdev.github.io/rock_paper_scissors/round_lose.wav"],
  }),
  gameWin: new Howl({
    src: ["https://sunnyappdev.github.io/rock_paper_scissors/game_winner.wav"],
  }),
};

// play after user action
function handleRoundResultAudio(result) {
  if (result === "win") {
    sounds.win.play();
  } else if (result === "lose") {
    sounds.lose.play();
  }
}

// after final game result
function playEndGameAudio(result) {
  if (result === "win") {
    sounds.gameWin.play();
  }
}

// ensure audio on mobile browser works
document.body.addEventListener(
  "click",
  () => {
    // First click initializes Howler’s audio context on mobile
    Howler.ctx.resume();
  },
  { once: true }
);
// end of helper code for audio

// player choice starts game!
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

// rock paper scissors logic and updates total variable
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

// keep track of changes in the total object
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

// function called in html file when replay game prompt added to DOM
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

  // clear round & game result & hide replay prompt
  document.getElementById("roundResult").textContent = "";
  document.getElementById("gameResult").textContent = "";
  document.getElementById("replayPrompt").style.display = "none";

  // clear the icons from match area
  const playerChoice = document.getElementById("playerMatchChoice");
  const compChoice = document.getElementById("computerMatchChoice");
  playerChoice.textContent = "";
  compChoice.textContent = "";
  playerChoice.classList.remove("show");
  compChoice.classList.remove("show");

  // show the match area again; previously hid it when replay prompt appeared
  document.getElementById("matchArea").classList.remove("hidden");
  document.querySelector(".vs-title").classList.remove("hidden");

  // clear scoreboard
  updateScoreboard(total);
}

// function called in html file when replay game prompt added to DOM
function endGame() {
  document.getElementById("replayPrompt").style.display = "none";
}

function displayWinner(total) {
  if (total.player.win > total.computer.win) {
    document.getElementById("gameResult").textContent = "You WIN";
    playEndGameAudio("gameWin");
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

  // for animation ... 2 seconds before computer choice displayed
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

    // play sounds
    if (result.player?.win) {
      handleRoundResultAudio("win");
    } else if (result.player?.loss) {
      handleRoundResultAudio("lose");
    }
    // TODO
    // else {
    //   gameSounds.play("tie");
    // }

    currRound++;

    // display winner and then self destruction animation
    if (currRound === rounds) {
      displayWinner(total);

      const gameResult = document.getElementById("gameResult");
      // TODO hide round result and make scoreboard also prominent
      gameResult.classList.add("show-winner");

      // delay the self destruct animation to show game winner
      setTimeout(() => {
        const main = document.querySelector("main");
        main.classList.add("self-destruct");

        // display prompt after self destruct animation ends (pure CSS animation 3 seconds)
        setTimeout(() => {
          main.classList.remove("self-destruct");

          // hide match area so replay prompt is prominent ... display again in reset function
          document.getElementById("matchArea").classList.add("hidden");
          document.querySelector(".vs-title").classList.add("hidden");

          gameResult.classList.remove("show-winner");

          document.getElementById("replayPrompt").style.display = "block";

          // user needs to click yes then replay prompt buttom will run resetGame()
          // I do not automatically need to run the reset game function here
          // resetGame();
        }, 3000); // show replay game prompt after self destruct animation
      }, 4000); // delay the self destruct animation to show game winner
    }
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
// improve UI ... footer buttons ... display game winner prominently before reset
// WTF async await instead of setTimeout!!!! think about this .... good for article
// add a character select .... Rocky, Cali, Uncle Alex
