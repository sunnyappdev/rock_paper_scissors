function exampleNestedTimeouts() {
  // for timestamps
  const startTime = Date.now();
  const log = (msg) => {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[+${elapsed}s] ${msg}`);
  };

  log("exampleNestedTimeouts()");
  setTimeout(() => {
    log("Timeout 1: 2.5 seconds delay.");

    setTimeout(() => {
      log("Timeout 2: 4 seconds delay.");
      setTimeout(() => {
        log("Timeout 3: 3 seconds delay.");
      }, 3000);
    }, 4000);
  }, 2500);
}

function exampleSimulate() {
  // for timestamps
  const startTime = Date.now();
  const log = (msg) => {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[+${elapsed}s] ${msg}`);
  };

  log(`Round 1`);
  log("Player choose: ROCK");
  log("Computer choose: PAPER");

  log("ANIMATION: Begin to reveal computer choice. CSS takes 2 s.");

  // delay determining round winner and displaying results by 2.5 s
  setTimeout(() => {
    log("ROCK < PAPER");
    log("Computer wins!");
    log("Update scoreboard.");

    log("Play game sounds!!!");

    log("Incrementing round number.");

    // if this is is the last round
    if (1 === 1) {
      log("ANIMATION: Display game winner if this is last round.");

      // delay the self destruct animation to show game winner
      setTimeout(() => {
        log("ANIMATION: Self destruct animation begins. ");

        // delay replay game prompt so it appears after self destruct animation
        setTimeout(() => {
          //     document.getElementById("replayPrompt").style.display = "block";
          log("Display replay game prompt");
        }, 3000);
      }, 4000);
    }
  }, 2500);
}

// run with node.js
async function getJoke() {
  console.log("the getJoke function starts.");
  const response = await fetch("https://api.chucknorris.io/jokes/random");
  const data = await response.json();
  console.log(data.value);
}
(async () => {
  console.log("Hello World");
  await getJoke();
  console.log("App ends.");
})();
