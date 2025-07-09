class SlotMachine {
  constructor() {
    this.names = [];
    this.isSpinning = false;
    this.lastWinner = null;
    this.reels = [];

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
      this.updateDisplay();
      this.setupSlotMachine();
      this.hideResult();
      this.updateWinnerDisplay("Add names to play!");
    }
  }

  removeWinner() {
    if (this.lastWinner) {
      this.removeName(this.lastWinner);
      this.lastWinner = null;
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

      if (name === this.lastWinner) {
        nameTag.classList.add("winner");
      }

      this.namesList.appendChild(nameTag);
    });

    // Update button states
    this.spinBtn.disabled = this.names.length < 2 || this.isSpinning;
    this.clearBtn.disabled = this.names.length === 0;
    this.removeWinnerBtn.disabled = !this.lastWinner;
    this.addNameBtn.disabled = this.isSpinning;
    this.nameInput.disabled = this.isSpinning;
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

    // Add spinning class to all reels
    this.reels.forEach((reel) => {
      reel.classList.add("spinning");
    });

    // Play spinning sound effect
    this.playSpinSound();

    // Stop reels one by one with different timings
    const stopTimes = [2000, 3000, 4000];
    const winners = [];

    this.reels.forEach((reel, index) => {
      setTimeout(() => {
        this.stopReel(reel, index);
        const winner = this.getReelWinner(reel);
        winners[index] = winner;

        // Check if all reels have stopped
        if (index === this.reels.length - 1) {
          setTimeout(() => {
            this.checkForWin(winners);
          }, 500);
        }
      }, stopTimes[index]);
    });
  }

  stopReel(reel, reelIndex) {
    reel.classList.remove("spinning");

    const strip = reel.querySelector(".reel-strip");
    const items = strip.querySelectorAll(".reel-item");

    if (items.length === 0) return;

    // Calculate random stop position
    const randomIndex = Math.floor(Math.random() * this.names.length);
    const itemHeight = 60; // Height of each reel item
    const stopPosition = -(randomIndex * itemHeight + 60); // +60 to center in window

    strip.style.transform = `translateY(${stopPosition}px)`;
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
    // Check if all three reels show the same name
    const isJackpot = winners.every((winner) => winner === winners[0] && winner !== "???");

    if (isJackpot) {
      this.showJackpot(winners[0]);
    } else {
      // Pick a random winner from the three reels
      const validWinners = winners.filter((w) => w !== "???");
      const randomWinner = validWinners[Math.floor(Math.random() * validWinners.length)];
      this.showResult(randomWinner);
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

  showResult(winner) {
    this.lastWinner = winner;
    this.updateWinnerDisplay(`Winner: ${winner}`);

    this.result.innerHTML = `
            <div class="result-display show">
                <h2>🎉 Winner! 🎉</h2>
                <div class="winner-name">${winner}</div>
                <p>Congratulations!</p>
            </div>
        `;

    this.playCelebrationSound();
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
