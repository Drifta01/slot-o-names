function createSlotMachine() {
  // Private variables
  let names = [];
  let isSpinning = false;
  let lastWinner = null;
  let lastWinners = []; // For triple mode
  let reels = [];
  let gameMode = "single"; // 'single' or 'triple'

  // DOM elements
  let nameInput, addNameBtn, spinBtn, clearBtn, removeWinnerBtn;
  let namesList, nameCount, result, winnerText, lever, gameModeInputs;

  function initializeElements() {
    nameInput = document.getElementById("nameInput");
    addNameBtn = document.getElementById("addNameBtn");
    spinBtn = document.getElementById("spinBtn");
    clearBtn = document.getElementById("clearBtn");
    removeWinnerBtn = document.getElementById("removeWinnerBtn");
    namesList = document.getElementById("namesList");
    nameCount = document.getElementById("nameCount");
    result = document.getElementById("result");
    winnerText = document.getElementById("winnerText");
    lever = document.getElementById("lever");
    gameModeInputs = document.querySelectorAll('input[name="gameMode"]');

    // Get grid cells (3x3 grid)
    reels = [];
    for (let i = 0; i < 9; i++) {
      const cell = document.getElementById(`cell${i}`);
      if (cell) {
        reels.push(cell);
      }
    }
  }

  function setupEventListeners() {
    addNameBtn.addEventListener("click", () => addName());
    nameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") addName();
    });
    spinBtn.addEventListener("click", () => pullLever());
    lever.addEventListener("click", () => pullLever());
    clearBtn.addEventListener("click", () => clearNames());
    removeWinnerBtn.addEventListener("click", () => removeWinner());

    // Game mode change listener
    gameModeInputs.forEach((input) => {
      input.addEventListener("change", (e) => {
        gameMode = e.target.value;
        updateDisplay();
        updateWinnerDisplay(gameMode === "single" ? "🎯 Single Winner Mode" : "🎰 Triple Winners Mode");
      });
    });
  }

  function setupSlotMachine() {
    reels.forEach((cell, index) => {
      if (cell) {
        populateCell(cell, index);
      }
    });
  }

  function populateCell(cell, index) {
    if (names.length === 0) {
      cell.textContent = "???";
      cell.className = "grid-cell";
      return;
    }

    // Initially show a random name
    const randomName = names[Math.floor(Math.random() * names.length)];
    cell.textContent = randomName;
    cell.className = "grid-cell";
    cell.style.animation = "none"; // Reset any previous animations
    cell.addEventListener("animationend", () => {
      cell.style.animation = ""; // Reset animation after it ends
    });
  }

  function addName() {
    const name = nameInput.value.trim();
    if (name && !names.includes(name)) {
      names.push(name);
      nameInput.value = "";
      updateDisplay();
      setupSlotMachine();
      updateWinnerDisplay("Ready to play!");
    } else if (names.includes(name)) {
      alert("This name is already in the machine!");
    }
  }

  function removeName(name) {
    const index = names.findIndex((n) => n === name);
    if (index > -1) {
      names.splice(index, 1);
      updateDisplay();
      setupSlotMachine();
    }
  }

  function clearNames() {
    if (names.length > 0 && confirm("Are you sure you want to clear all names?")) {
      names = [];
      lastWinner = null;
      lastWinners = [];
      updateDisplay();
      setupSlotMachine();
      hideResult();
      updateWinnerDisplay("Add names to play!");
    }
  }

  function removeWinner() {
    if (gameMode === "single" && lastWinner) {
      removeName(lastWinner);
      lastWinner = null;
      hideResult();
      updateWinnerDisplay("Ready to play!");
    } else if (gameMode === "triple" && lastWinners.length > 0) {
      // Remove all three winners
      lastWinners.forEach((winner) => removeName(winner));
      lastWinners = [];
      hideResult();
      updateWinnerDisplay("Ready to play!");
    }
  }

  function updateDisplay() {
    nameCount.textContent = names.length;

    // Update names list
    namesList.replaceChildren();
    names.forEach((name) => {
      const nameTag = document.createElement("span");
      nameTag.className = "name-tag";
      nameTag.textContent = name;

      if (gameMode === "single" && name === lastWinner) {
        nameTag.classList.add("winner");
      } else if (gameMode === "triple" && lastWinners.includes(name)) {
        nameTag.classList.add("winner");
      }

      namesList.appendChild(nameTag);
    });

    // Update button states
    spinBtn.disabled = names.length < 2 || isSpinning;
    clearBtn.disabled = names.length === 0;
    removeWinnerBtn.disabled =
      (gameMode === "single" && !lastWinner) || (gameMode === "triple" && lastWinners.length === 0);
    addNameBtn.disabled = isSpinning;
    nameInput.disabled = isSpinning;

    // Update game mode inputs
    gameModeInputs.forEach((input) => {
      input.disabled = isSpinning;
    });
  }

  function pullLever() {
    if (isSpinning || names.length < 2) return;

    // Animate lever pull
    lever.classList.add("pulled");
    setTimeout(() => {
      lever.classList.remove("pulled");
    }, 200);

    startSpinning();
  }

  function startSpinning() {
    isSpinning = true;
    updateDisplay();
    hideResult();
    updateWinnerDisplay("🎰 Spinning...");

    // Add spinning animation to all cells
    reels.forEach((cell, index) => {
      if (cell) {
        cell.classList.add("spinning");
        // Start rapid name changes during spin
        startCellAnimation(cell, index);
      }
    });

    // Play spinning sound effect
    playSpinSound();

    // Stop spinning after delay
    setTimeout(() => {
      stopSpinning();
    }, 3000);
  }

  function startCellAnimation(cell, index) {
    if (names.length === 0) return;

    const animationInterval = setInterval(() => {
      if (!isSpinning) {
        clearInterval(animationInterval);
        return;
      }
      // Rapidly change the displayed name
      const randomName = names[Math.floor(Math.random() * names.length)];
      cell.textContent = randomName;
    }, 100); // Change name every 100ms during spin
  }

  function stopSpinning() {
    const winners = [];

    // Stop all animations and set final values
    reels.forEach((cell, index) => {
      if (cell) {
        cell.classList.remove("spinning");

        // Set final random name for this cell
        if (names.length > 0) {
          const finalName = names[Math.floor(Math.random() * names.length)];
          cell.textContent = finalName;
          winners[index] = finalName;
        } else {
          cell.textContent = "???";
          winners[index] = "???";
        }
      }
    });

    setTimeout(() => {
      checkForWin(winners);
    }, 500);
  }

  function checkForWin(winners) {
    if (gameMode === "single") {
      // Single winner mode - center cell (index 4 in 3x3 grid) determines the winner
      const winner = winners[4]; // Center cell

      // Check for center row winning pattern
      const patterns = checkWinningPatterns(winners);

      if (patterns.jackpot) {
        showJackpot(winner);
      } else {
        showSingleResult(winner);
      }

      lastWinner = winner;
    } else {
      // Triple winners mode - check for center row pattern only
      const patterns = checkWinningPatterns(winners);

      if (patterns.line) {
        showTripleResult(patterns.lineWinners);
        lastWinners = patterns.lineWinners;
      } else {
        // Show center winner as fallback
        showSingleResult(winners[4]);
        lastWinner = winners[4];
      }
    }

    isSpinning = false;
    updateDisplay();
  }

  function checkWinningPatterns(winners) {
    // Check for winning patterns in 3x3 grid - only center row matters
    const patterns = {
      jackpot: false,
      line: false,
      winningName: null,
      lineWinners: [],
    };

    // Only check the center row (middle horizontal line: cells 3, 4, 5)
    const centerRow = [3, 4, 5];
    const [a, b, c] = centerRow;

    if (winners[a] === winners[b] && winners[b] === winners[c] && winners[a] !== "???") {
      patterns.line = true;
      patterns.lineWinners = [winners[a], winners[b], winners[c]];
      patterns.winningName = winners[a];

      // If all three in the center row are the same, it's also a jackpot
      patterns.jackpot = true;
    }

    return patterns;
  }

  function showJackpot(winner) {
    lastWinner = winner;
    updateWinnerDisplay(`🎰 JACKPOT! 🎰`);

    result.innerHTML = `
            <div class="result-display show jackpot">
                <h2>🎰💰 JACKPOT! 💰🎰</h2>
                <div class="winner-name">${winner}</div>
                <p>Center cell winner!</p>
            </div>
        `;

    // Enhanced celebration for jackpot
    playJackpotSound();
    startLightShow();
  }

  function showSingleResult(winner) {
    updateWinnerDisplay(`🎯 Winner: ${winner}`);

    result.innerHTML = `
      <div class="result-display show">
        <h2>🎯 Single Winner! 🎯</h2>
        <div class="winner-name">${winner}</div>
        <p>Selected from the center cell!</p>
      </div>
    `;

    playCelebrationSound();
  }

  function showTripleResult(winners) {
    updateWinnerDisplay(`🎰 Center Row Winners!`);

    result.innerHTML = `
      <div class="result-display show">
        <h2>🎊 Center Row Winners! 🎊</h2>
        <div class="winner-names">
          <div class="winner-name">${winners[0]}</div>
        </div>
        <p>Three in a row in the center!</p>
      </div>
    `;

    playCelebrationSound();
  }

  function showTripleJackpot(winner) {
    updateWinnerDisplay(`🎰💰 CENTER ROW JACKPOT! 💰🎰`);

    result.innerHTML = `
      <div class="result-display show jackpot">
        <h2>🎰💰 CENTER ROW JACKPOT! 💰🎰</h2>
        <div class="winner-name">${winner}</div>
        <p>All center row cells match! INCREDIBLE!</p>
      </div>
    `;

    playJackpotSound();
    startLightShow();
  }

  function updateWinnerDisplay(text) {
    winnerText.textContent = text;
  }

  function hideResult() {
    result.replaceChildren();
  }

  function startLightShow() {
    const lights = document.querySelectorAll(".light");
    lights.forEach((light, index) => {
      light.style.animationDuration = "0.3s";
      setTimeout(() => {
        light.style.animationDuration = "1.5s";
      }, 3000);
    });
  }

  function playSpinSound() {
    createSound([200, 250, 300], [0.1, 0.1, 0.1], "sine", 2);
  }

  function playCelebrationSound() {
    createSound([523, 659, 784], [0.2, 0.2, 0.2], "sine", 0.5);
  }

  function playJackpotSound() {
    // Play a series of ascending notes for jackpot
    const notes = [261, 329, 392, 523, 659, 784, 1047];
    notes.forEach((freq, index) => {
      setTimeout(() => {
        createSound([freq], [0.3], "sine", 0.3);
      }, index * 200);
    });
  }

  function createSound(frequencies, volumes, type = "sine", duration = 0.5) {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();

      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = freq;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volumes[index] || 0.1, audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      });
    } catch (error) {
      // Silently fail if audio context is not available
    }
  }
  // Initialize the slot machine
  initializeElements();
  setupEventListeners();
  updateDisplay();
  setupSlotMachine();

  // Return public interface
  return {
    addName,
    removeName,
    clearNames,
    removeWinner,
    pullLever,
    updateDisplay,
    setupSlotMachine,
    updateWinnerDisplay,
    // Expose names array for external access
    get names() {
      return names;
    },
    set names(value) {
      names = value;
    },
  };
}

// Initialize the slot machine when the page loads
document.addEventListener("DOMContentLoaded", () => {
  window.slotMachine = createSlotMachine();

  // Add some default names for demo
  const defaultNames = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank"];
  defaultNames.forEach((name) => {
    slotMachine.names.push(name);
  });
  slotMachine.updateDisplay();
  slotMachine.setupSlotMachine();
  slotMachine.updateWinnerDisplay("🎰 Ready to Play!");
});
