const domains = ["chatgpt", "openai", "midjourney", "claude"];

let isKlimasau = false;
for (const domain of domains) {
  if (location.href.includes(domain)) {
    isKlimasau = true;
    break;
  }
}

if (isKlimasau) {
  const extensionUrl = chrome?.runtime
    ? chrome.runtime.getURL("piggy_sheet.png")
    : "piggy_sheet.png";

  const screamUrl = chrome?.runtime
    ? chrome.runtime.getURL("scream.mp3")
    : "scream.mp3";

  const tiniUrl = chrome?.runtime
    ? chrome.runtime.getURL("tini.mp3")
    : "tini.mp3";

  const tini2Url = chrome?.runtime
    ? chrome.runtime.getURL("tini-2.mp3")
    : "tini-2.mp3";

  const styleElement = document.createElement("style");
  styleElement.textContent = `
      .piggy {
        width: 32px;
        height: 32px;
        background: url('${extensionUrl}');
        image-rendering: pixelated;
        transform: scale(4);
        transform-origin: top left;
        animation: play 0.4s steps(4) infinite;
        position: absolute;
        z-index: 9999;
      }

      .flipped {
        transform: scale(-4, 4) translateX(-32px);
        transform-origin: top left;
      }

      .hit {
        background-position: -96px 0 !important; /* First row, third column */
        animation: none !important;
      }

      @keyframes play {
        from { background-position: 0 -32px; }
        to { background-position: -128px -32px; }
      }

      .klimasau {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(0deg);
        font-size: 3em;
        font-weight: bold;
        color: red;
        text-align: center;
        display: none; /* Hidden initially */
        z-index: 10000;
        animation: pulseRotate 2s infinite;
        font-family: sans-serif;
        text-shadow: 2px 2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000, 0px 2px 0 #000, 2px 0px 0 #000, -2px 0px 0 #000, 0px -2px 0 #000;
      }

      @keyframes pulseRotate {
        0% {
          transform: translate(-50%, -50%) scale(1) rotate(0deg);
        }
        25% {
          transform: translate(-50%, -50%) scale(1.2) rotate(10deg);
        }
        50% {
          transform: translate(-50%, -50%) scale(1) rotate(0deg);
        }
        75% {
          transform: translate(-50%, -50%) scale(1.2) rotate(-10deg);
        }
        100% {
          transform: translate(-50%, -50%) scale(1) rotate(0deg);
        }
      }
    `;
  document.head.appendChild(styleElement);

  class Piggy {
    constructor(isFlipped = false) {
      this.div = document.createElement("div");
      this.div.className = "piggy";
      if (isFlipped) {
        this.div.classList.add("flipped");
      }
      document.body.appendChild(this.div);
      this.isFlipped = isFlipped;
      this.speed = Math.random() * 2 + 1;
      this.resetPosition();
    }

    resetPosition() {
      const viewportHeight = window.innerHeight;
      const randomY = Math.random() * viewportHeight;
      if (this.isFlipped) {
        this.div.style.left = `${window.innerWidth}px`;
        this.div.style.top = `${randomY}px`;
      } else {
        this.div.style.left = `-128px`;
        this.div.style.top = `${randomY}px`;
      }
    }

    updatePosition() {
      const currentLeft = parseFloat(this.div.style.left);
      if (this.isFlipped) {
        this.div.style.left = `${currentLeft - this.speed}px`;
        if (currentLeft < -128) {
          this.resetPosition();
        }
      } else {
        this.div.style.left = `${currentLeft + this.speed}px`;
        if (currentLeft > window.innerWidth) {
          this.resetPosition();
        }
      }
    }

    hit() {
      this.div.classList.add("hit");
    }
  }

  let interacted = false;
  const piggies = [];

  for (let i = 0; i < 50; i++) {
    const isFlipped = Math.random() > 0.5;
    const piggy = new Piggy(isFlipped);
    piggies.push(piggy);
  }

  function updatePiggies() {
    if (interacted) piggies.forEach((piggy) => piggy.updatePosition());
    requestAnimationFrame(updatePiggies);
  }

  requestAnimationFrame(updatePiggies);

  function hitPiggy(event) {
    if (!interacted) {
      interacted = true;
      return;
    }
    const target = event.target;
    let piggyToHit = null;

    if (target.classList.contains("piggy")) {
      piggyToHit = piggies.find((piggy) => piggy.div === target);
    }

    if (!piggyToHit && piggies.length > 0) {
      piggyToHit = piggies[Math.floor(Math.random() * piggies.length)];
    }

    if (piggyToHit) {
      piggyToHit.hit();

      const sounds = [screamUrl, tiniUrl, tini2Url];
      const randomSoundUrl = sounds[Math.floor(Math.random() * sounds.length)];
      const sound = new Audio(randomSoundUrl);
      sound.play();

      const index = piggies.indexOf(piggyToHit);
      if (index > -1) {
        piggies.splice(index, 1);
      }

      if (piggies.length === 0) {
        displayKlimasau();
      }
    }
  }

  function displayKlimasau() {
    const klimasau = document.createElement("div");
    klimasau.className = "klimasau";
    klimasau.innerText = "KLIMASAU";
    document.body.appendChild(klimasau);
    klimasau.style.display = "block";
  }

  document.addEventListener("click", hitPiggy);
  document.addEventListener("touchstart", hitPiggy);
  document.addEventListener("keydown", hitPiggy);
}
