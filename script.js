class SlotMachine {
  constructor() {
    this.names = [];
    this.isSpinning = false;
    this.lastWinner = null;
    this.lastWinners = []; // For triple mode
    this.reels = [];
    this.gameMode = "single"; // 'single' or 'triple'

    this.initializeElements();
    this.setupEventListeners();
    this.updateDisplay();
    this.setupSlotMachine();
  }

  initializeElements() {
    this.nameInput = document.getElementById("nameInput");
    this.addNameBtn = document.getElementById("addNameBtn");
    this.spinBtn = document.getElementById("spinBtn");
    this.clearBtn = document.getElementById("clearBtn");
    this.removeWinnerBtn = document.getElementById("removeWinnerBtn");
    this.namesList = document.getElementById("namesList");
    this.nameCount = document.getElementById("nameCount");
    this.result = document.getElementById("result");
    this.winnerText = document.getElementById("winnerText");
    this.lever = document.getElementById("lever");
    this.gameModeInputs = document.querySelectorAll('input[name="gameMode"]');

    // Get reels
    this.reels = [document.getElementById("reel1"), document.getElementById("reel2"), document.getElementById("reel3")];
  }

  setupEventListeners() {
    this.addNameBtn.addEventListener("click", () => this.addName());
    this.nameInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.addName();
    });
    this.spinBtn.addEventListener("click", () => this.pullLever());
    this.lever.addEventListener("click", () => this.pullLever());
    this.clearBtn.addEventListener("click", () => this.clearNames());
    this.removeWinnerBtn.addEventListener("click", () => this.removeWinner());

    // Game mode change listener
    this.gameModeInputs.forEach((input) => {
      input.addEventListener("change", (e) => {
        this.gameMode = e.target.value;
        this.updateDisplay();
        this.updateWinnerDisplay(this.gameMode === "single" ? "🎯 Single Winner Mode" : "🎰 Triple Winners Mode");
      });
    });
  }

  setupSlotMachine() {
    this.reels.forEach((reel, index) => {
      const strip = reel.querySelector(".reel-strip");
      this.populateReel(strip);
    });
  }

  populateReel(strip) {
    strip.innerHTML = "";

    if (this.names.length === 0) {
      // Show placeholder when no names
      for (let i = 0; i < 10; i++) {
        const item = document.createElement("div");
        item.className = "reel-item";
        item.textContent = "???";
        strip.appendChild(item);
      }
      return;
    }

    // Create a long strip with repeated names for smooth spinning
    const repeatCount = Math.max(10, this.names.length * 3);
    for (let i = 0; i < repeatCount; i++) {
      const item = document.createElement("div");
      item.className = "reel-item";
      item.textContent = this.names[i % this.names.length];
      strip.appendChild(item);
    }
  }

  addName() {
    const name = this.nameInput.value.trim();
    if (name && !this.names.includes(name)) {
      this.names.push(name);
      this.nameInput.value = "";
      this.updateDisplay();
      this.setupSlotMachine();
      this.updateWinnerDisplay("Ready to play!");
    } else if (this.names.includes(name)) {
      alert("This name is already in the machine!");
    }
  }

  removeName(name) {
    const index = this.names.indexOf(name);
    if (index > -1) {
      this.names.splice(index, 1);
      this.updateDisplay();
      this.setupSlotMachine();
    }
  }

  clearNames() {
    if (this.names.length > 0 && confirm("Are you sure you want to clear all names?")) {
      this.names = [];
      this.lastWinner = null;
      this.lastWinners = [];
      this.updateDisplay();
      this.setupSlotMachine();
      this.hideResult();
      this.updateWinnerDisplay("Add names to play!");
    }
  }

  removeWinner() {
    if (this.gameMode === "single" && this.lastWinner) {
      this.removeName(this.lastWinner);
      this.lastWinner = null;
      this.hideResult();
      this.updateWinnerDisplay("Ready to play!");
    } else if (this.gameMode === "triple" && this.lastWinners.length > 0) {
      // Remove all three winners
      this.lastWinners.forEach((winner) => this.removeName(winner));
      this.lastWinners = [];
      this.hideResult();
      this.updateWinnerDisplay("Ready to play!");
    }
  }

  updateDisplay() {
    this.nameCount.textContent = this.names.length;

    // Update names list
    this.namesList.innerHTML = "";
    this.names.forEach((name) => {
      const nameTag = document.createElement("span");
      nameTag.className = "name-tag";
      nameTag.textContent = name;

      if (this.gameMode === "single" && name === this.lastWinner) {
        nameTag.classList.add("winner");
      } else if (this.gameMode === "triple" && this.lastWinners.includes(name)) {
        nameTag.classList.add("winner");
      }

      this.namesList.appendChild(nameTag);
    });

    // Update button states
    this.spinBtn.disabled = this.names.length < 2 || this.isSpinning;
    this.clearBtn.disabled = this.names.length === 0;
    this.removeWinnerBtn.disabled =
      (this.gameMode === "single" && !this.lastWinner) || (this.gameMode === "triple" && this.lastWinners.length === 0);
    this.addNameBtn.disabled = this.isSpinning;
    this.nameInput.disabled = this.isSpinning;

    // Update game mode inputs
    this.gameModeInputs.forEach((input) => {
      input.disabled = this.isSpinning;
    });
  }

  pullLever() {
    if (this.isSpinning || this.names.length < 2) return;

    // Animate lever pull
    this.lever.classList.add("pulled");
    setTimeout(() => {
      this.lever.classList.remove("pulled");
    }, 200);

    this.startSpinning();
  }

  startSpinning() {
    this.isSpinning = true;
    this.updateDisplay();
    this.hideResult();
    this.updateWinnerDisplay("🎰 Spinning...");

    // Add spinning class to all reels with staggered animation
    this.reels.forEach((reel, index) => {
      setTimeout(() => {
        reel.classList.add("spinning");
      }, index * 200);
    });

    // Play spinning sound effect
    this.playSpinSound();

    // Slower, more dramatic stop times
    const stopTimes = [4000, 6000, 8000]; // Much slower
    const winners = [];

    this.reels.forEach((reel, index) => {
      setTimeout(() => {
        // Add slowing down effect
        reel.classList.add("slow-spin");
        setTimeout(() => {
          reel.classList.add("stopping");
          setTimeout(() => {
            this.stopReel(reel, index);
            const winner = this.getReelWinner(reel);
            winners[index] = winner;

            // Check if all reels have stopped
            if (index === this.reels.length - 1) {
              setTimeout(() => {
                this.checkForWin(winners);
              }, 1000);
            }
          }, 1000);
        }, 1000);
      }, stopTimes[index]);
    });
  }

  stopReel(reel, reelIndex) {
    reel.classList.remove("spinning", "slow-spin", "stopping");

    const strip = reel.querySelector(".reel-strip");
    const items = strip.querySelectorAll(".reel-item");

    if (items.length === 0) return;

    // Calculate random stop position
    const randomIndex = Math.floor(Math.random() * this.names.length);
    const itemHeight = 60; // Height of each reel item
    const stopPosition = -(randomIndex * itemHeight + 60); // +60 to center in window

    strip.style.transform = `translateY(${stopPosition}px)`;
    strip.style.transition = "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
  }

  getReelWinner(reel) {
    const strip = reel.querySelector(".reel-strip");
    const transform = strip.style.transform;
    const translateY = parseInt(transform.match(/-?\d+/)[0]);
    const itemHeight = 60;
    const itemIndex = Math.abs(Math.floor((translateY + 60) / itemHeight));

    if (this.names.length === 0) return "???";
    return this.names[itemIndex % this.names.length];
  }

  checkForWin(winners) {
    if (this.gameMode === "single") {
      // Single winner mode - center reel (index 1) determines the winner
      const winner = winners[1]; // Center reel

      // Check if all three reels show the same name for jackpot
      const isJackpot = winners.every((w) => w === winner && w !== "???");

      if (isJackpot) {
        this.showJackpot(winner);
      } else {
        this.showSingleResult(winner);
      }

      this.lastWinner = winner;
    } else {
      // Triple winners mode - all three reels show the winners
      const validWinners = winners.filter((w) => w !== "???");

      if (validWinners.length === 3) {
        // Check if all three are the same for super jackpot
        const isTripleJackpot = validWinners.every((w) => w === validWinners[0]);

        if (isTripleJackpot) {
          this.showTripleJackpot(validWinners[0]);
        } else {
          this.showTripleResult(validWinners);
        }

        this.lastWinners = validWinners;
      }
    }

    this.isSpinning = false;
    this.updateDisplay();
  }

  showJackpot(winner) {
    this.lastWinner = winner;
    this.updateWinnerDisplay(`🎰 JACKPOT! 🎰`);

    this.result.innerHTML = `
            <div class="result-display show jackpot">
                <h2>🎰💰 JACKPOT! 💰🎰</h2>
                <div class="winner-name">${winner}</div>
                <p>Triple Match! Incredible!</p>
            </div>
        `;

    // Enhanced celebration for jackpot
    this.playJackpotSound();
    this.startLightShow();
  }

  showSingleResult(winner) {
    this.updateWinnerDisplay(`🎯 Winner: ${winner}`);

    this.result.innerHTML = `
      <div class="result-display show">
        <h2>🎯 Single Winner! 🎯</h2>
        <div class="winner-name">${winner}</div>
        <p>Selected from the center reel!</p>
      </div>
    `;

    this.playCelebrationSound();
  }

  showTripleResult(winners) {
    this.updateWinnerDisplay(`🎰 Triple Winners!`);

    this.result.innerHTML = `
      <div class="result-display show">
        <h2>� Triple Winners! �</h2>
        <div class="winner-names">
          ${winners.map((winner) => `<div class="winner-name">${winner}</div>`).join("")}
        </div>
        <p>Congratulations to all three winners!</p>
      </div>
    `;

    this.playCelebrationSound();
  }

  showTripleJackpot(winner) {
    this.updateWinnerDisplay(`🎰💰 TRIPLE JACKPOT! 💰🎰`);

    this.result.innerHTML = `
      <div class="result-display show jackpot">
        <h2>🎰💰 TRIPLE JACKPOT! 💰🎰</h2>
        <div class="winner-name">${winner}</div>
        <p>All three reels match! INCREDIBLE!</p>
      </div>
    `;

    this.playJackpotSound();
    this.startLightShow();
  }

  updateWinnerDisplay(text) {
    this.winnerText.textContent = text;
  }

  hideResult() {
    this.result.innerHTML = "";
  }

  startLightShow() {
    const lights = document.querySelectorAll(".light");
    lights.forEach((light, index) => {
      light.style.animationDuration = "0.3s";
      setTimeout(() => {
        light.style.animationDuration = "1.5s";
      }, 3000);
    });
  }

  playSpinSound() {
    this.createSound([200, 250, 300], [0.1, 0.1, 0.1], "sine", 2);
  }

  playCelebrationSound() {
    this.createSound([523, 659, 784], [0.2, 0.2, 0.2], "sine", 0.5);
  }

  playJackpotSound() {
    // Play a series of ascending notes for jackpot
    const notes = [261, 329, 392, 523, 659, 784, 1047];
    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.createSound([freq], [0.3], "sine", 0.3);
      }, index * 200);
    });
  }

  createSound(frequencies, volumes, type = "sine", duration = 0.5) {
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
}

// Initialize the slot machine when the page loads
document.addEventListener("DOMContentLoaded", () => {
  window.slotMachine = new SlotMachine();

  // Add some default names for demo
  const defaultNames = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank"];
  defaultNames.forEach((name) => {
    slotMachine.names.push(name);
  });
  slotMachine.updateDisplay();
  slotMachine.setupSlotMachine();
  slotMachine.updateWinnerDisplay("🎰 Ready to Play!");
});
