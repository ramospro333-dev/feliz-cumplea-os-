
const welcome = document.getElementById("welcome");
const scene = document.getElementById("scene");
const startButton = document.getElementById("startButton");
const replayButton = document.getElementById("replayButton");

const starsContainer = document.getElementById("stars");
const floatingHeartsContainer = document.getElementById("floatingHearts");
const firefliesContainer = document.getElementById("fireflies");

const branches = document.getElementById("branches");
const twigs = document.getElementById("twigs");
const treeHearts = document.getElementById("treeHearts");

const SVG_NS = "http://www.w3.org/2000/svg";

const random = (min, max) => Math.random() * (max - min) + min;

// --------------------------------------------------
// ESTRELLAS DEL FONDO
// --------------------------------------------------

function createStars() {
  if (!starsContainer) return;

  starsContainer.innerHTML = "";

  for (let i = 0; i < 115; i++) {
    const star = document.createElement("span");

    star.className = "star";
    star.style.left = `${random(0, 100)}%`;
    star.style.top = `${random(0, 100)}%`;
    star.style.setProperty("--size", `${random(1, 3)}px`);
    star.style.setProperty("--duration", `${random(2, 6)}s`);
    star.style.setProperty("--delay", `${random(-6, 0)}s`);

    starsContainer.appendChild(star);
  }
}

// --------------------------------------------------
// CORAZONES QUE FLOTAN EN EL FONDO
// --------------------------------------------------

function createFloatingHearts() {
  if (!floatingHeartsContainer) return;

  floatingHeartsContainer.innerHTML = "";

  for (let i = 0; i < 22; i++) {
    const heart = document.createElement("span");

    heart.className = "floating-heart";
    heart.textContent = "♥";
    heart.style.left = `${random(0, 100)}%`;
    heart.style.fontSize = `${random(9, 21)}px`;
    heart.style.setProperty("--duration", `${random(12, 25)}s`);
    heart.style.setProperty("--delay", `${random(-25, 0)}s`);
    heart.style.setProperty("--drift", `${random(-90, 90)}px`);

    floatingHeartsContainer.appendChild(heart);
  }
}

// --------------------------------------------------
// LUCIÉRNAGAS
// --------------------------------------------------

function createFireflies() {
  if (!firefliesContainer) return;

  firefliesContainer.innerHTML = "";

  for (let i = 0; i < 24; i++) {
    const light = document.createElement("span");

    light.className = "firefly";
    light.style.left = `${random(5, 95)}%`;
    light.style.top = `${random(5, 95)}%`;
    light.style.setProperty("--duration", `${random(3, 8)}s`);
    light.style.setProperty("--delay", `${random(-8, 0)}s`);
    light.style.setProperty("--drift-x", `${random(-35, 35)}px`);
    light.style.setProperty("--drift-y", `${random(-30, 30)}px`);

    firefliesContainer.appendChild(light);
  }
}

// --------------------------------------------------
// RAMAS PRINCIPALES Y RAMAS PEQUEÑAS
// --------------------------------------------------

function createBranch(path, width, opacity = 1) {
  const branch = document.createElementNS(SVG_NS, "path");

  branch.setAttribute("d", path);
  branch.setAttribute("fill", "none");
  branch.setAttribute("stroke", "#9b6178");
  branch.setAttribute("stroke-width", width);
  branch.setAttribute("stroke-linecap", "round");
  branch.setAttribute("stroke-linejoin", "round");
  branch.setAttribute("opacity", opacity);

  twigs.appendChild(branch);
}

function createTwigs() {
  if (!twigs) return;

  twigs.innerHTML = "";

  // Ramas distribuidas por toda la copa.
  const mainBranches = [
    { x: 300, y: 490, angle: -140, length: 115 },
    { x: 300, y: 470, angle: -40, length: 125 },
    { x: 290, y: 420, angle: -120, length: 105 },
    { x: 310, y: 405, angle: -55, length: 115 },
    { x: 295, y: 365, angle: -105, length: 95 },
    { x: 305, y: 345, angle: -65, length: 100 },
    { x: 285, y: 310, angle: -130, length: 90 },
    { x: 315, y: 285, angle: -45, length: 95 },
    { x: 295, y: 260, angle: -105, length: 80 },
    { x: 305, y: 225, angle: -65, length: 75 }
  ];

  mainBranches.forEach((branch) => {
    const radians = (branch.angle * Math.PI) / 180;
    const endX = branch.x + Math.cos(radians) * branch.length;
    const endY = branch.y + Math.sin(radians) * branch.length;

    const middleX = (branch.x + endX) / 2 + random(-12, 12);
    const middleY = (branch.y + endY) / 2 + random(-12, 12);

    createBranch(
      `M ${branch.x} ${branch.y} Q ${middleX} ${middleY} ${endX} ${endY}`,
      random(3, 6),
      random(0.65, 1)
    );

    // Ramificaciones que salen de cada rama.
    for (let i = 1; i <= 5; i++) {
      const t = i / 6;
      const x = branch.x + (endX - branch.x) * t;
      const y = branch.y + (endY - branch.y) * t;

      const side = Math.random() < 0.5 ? -1 : 1;
      const twigAngle = radians + side * random(0.55, 1.2);
      const twigLength = random(22, 48);

      const twigX = x + Math.cos(twigAngle) * twigLength;
      const twigY = y + Math.sin(twigAngle) * twigLength;

      const curveX = (x + twigX) / 2 + random(-8, 8);
      const curveY = (y + twigY) / 2 + random(-8, 8);

      createBranch(
        `M ${x} ${y} Q ${curveX} ${curveY} ${twigX} ${twigY}`,
        random(1.5, 3.2),
        random(0.55, 0.95)
      );

      // Pequeñas puntas para que la silueta tenga más ramitas.
      if (Math.random() > 0.25) {
        const tipAngle = twigAngle + side * random(0.35, 0.8);
        const tipLength = random(12, 26);

        const tipX = twigX + Math.cos(tipAngle) * tipLength;
        const tipY = twigY + Math.sin(tipAngle) * tipLength;

        createBranch(
          `M ${twigX} ${twigY} L ${tipX} ${tipY}`,
          random(1, 2),
          random(0.45, 0.8)
        );
      }
    }
  });
}

// --------------------------------------------------
// FORMA DE LA COPA DEL ÁRBOL
// --------------------------------------------------

function isInsideCanopy(x, y) {
  // El árbol tendrá una copa ancha, con bordes irregulares.
  // La zona está expresada en las coordenadas del SVG 600 x 760.

  const centerX = 300;
  const centerY = 315;

  const normalizedX = (x - centerX) / 225;
  const normalizedY = (y - centerY) / 225;

  const ellipse = normalizedX ** 2 + normalizedY ** 2;

  // Pequeñas irregularidades naturales en la silueta.
  const variation =
    Math.sin(x * 0.045) * 0.055 +
    Math.cos(y * 0.052) * 0.045;

  return (
    ellipse < 1.04 + variation &&
    y > 82 &&
    y < 535
  );
}

// --------------------------------------------------
// HOJAS EN FORMA DE CORAZÓN
// --------------------------------------------------

function createLeaf(x, y, size, index) {
  const leaf = document.createElement("span");

  leaf.className = "heart-leaf";
  leaf.textContent = "♥";

  leaf.style.left = `${(x / 600) * 100}%`;
  leaf.style.top = `${(y / 760) * 100}%`;
  leaf.style.fontSize = `${size}px`;

  const colors = [
    "#f5a8c7",
    "#e989b4",
    "#d66e9e",
    "#f6bfd3",
    "#c95b8d",
    "#ffc6d9",
    "#e7a0d0",
    "#b95a83"
  ];

  leaf.style.color = colors[Math.floor(random(0, colors.length))];
  leaf.style.setProperty("--leaf-rotation", `${random(-35, 35)}deg`);
  leaf.style.setProperty("--sway-duration", `${random(3, 7)}s`);

  // Todas las hojas aparecen en pocos segundos, no una tras otra
  // durante varios minutos.
  leaf.style.setProperty("--appear-delay", `${random(0, 2.5)}s`);

  leaf.dataset.x = x;
  leaf.dataset.y = y;
  leaf.dataset.size = size;
  leaf.dataset.index = index;

  treeHearts.appendChild(leaf);

  return leaf;
}

function createTreeLeaves() {
  if (!treeHearts) return;

  treeHearts.innerHTML = "";

  // Distribución densa para que la copa no se vea vacía.
  // Se intenta colocar más de una capa de corazones.
  const targetLeaves = 850;
  let created = 0;
  let attempts = 0;

  while (created < targetLeaves && attempts < 18000) {
    attempts++;

    const x = random(50, 550);
    const y = random(75, 545);

    if (!isInsideCanopy(x, y)) continue;

    // El centro y las zonas intermedias tienen mayor densidad.
    const centerDistance = Math.sqrt(
      ((x - 300) / 225) ** 2 +
      ((y - 315) / 225) ** 2
    );

    if (Math.random() > 0.93 && centerDistance > 0.75) {
      continue;
    }

    const size = random(7, 12);

    createLeaf(x, y, size, created);
    created++;
  }

  // Refuerzo de hojas en los bordes para una copa más frondosa.
  for (let i = 0; i < 130; i++) {
    const x = random(75, 525);
    const y = random(100, 500);

    if (!isInsideCanopy(x, y)) continue;

    createLeaf(x, y, random(8, 13), created);
    created++;
  }
}

// --------------------------------------------------
// CAÍDA SUAVE Y RENOVACIÓN DE LAS HOJAS
// --------------------------------------------------

let fallingInterval = null;

function detachLeaf() {
  const leaves = treeHearts.querySelectorAll(".heart-leaf");

  if (leaves.length === 0) return;

  const leaf = leaves[Math.floor(random(0, leaves.length))];

  if (leaf.dataset.falling === "true") return;

  leaf.dataset.falling = "true";

  const rect = leaf.getBoundingClientRect();
  const parentRect = treeHearts.getBoundingClientRect();

  const startX = rect.left - parentRect.left;
  const startY = rect.top - parentRect.top;

  const fallingHeart = document.createElement("span");

  fallingHeart.className = "falling-heart";
  fallingHeart.textContent = "♥";
  fallingHeart.style.left = `${startX}px`;
  fallingHeart.style.top = `${startY}px`;
  fallingHeart.style.fontSize = leaf.style.fontSize;
  fallingHeart.style.color = leaf.style.color;
  fallingHeart.style.setProperty("--fall-distance", `${random(120, 260)}px`);
  fallingHeart.style.setProperty("--fall-drift", `${random(-110, 110)}px`);
  fallingHeart.style.setProperty("--fall-duration", `${random(5, 9)}s`);

  treeHearts.appendChild(fallingHeart);

  // La hoja original se queda en su lugar mientras el corazón cae.
  // Luego aparece una hoja nueva para mantener la copa frondosa.
  setTimeout(() => {
    fallingHeart.remove();

    leaf.dataset.falling = "false";

    leaf.style.animation = "leafRegrow 1.4s ease-out both";
    leaf.style.opacity = "0";

    setTimeout(() => {
      leaf.style.animation = "";
      leaf.style.opacity = "";
    }, 1500);
  }, 8500);
}

function startFallingLeaves() {
  if (fallingInterval) {
    clearInterval(fallingInterval);
  }

  // Caen pocos corazones cada cierto tiempo para que el árbol
  // nunca pierda una gran cantidad de hojas de golpe.
  fallingInterval = setInterval(() => {
    const numberOfHearts = Math.random() < 0.25 ? 2 : 1;

    for (let i = 0; i < numberOfHearts; i++) {
      detachLeaf();
    }
  }, 1200);
}

// --------------------------------------------------
// BOTONES DE LA PÁGINA
// --------------------------------------------------

function openGift() {
  welcome.hidden = true;
  scene.hidden = false;

  createTreeLeaves();
  startFallingLeaves();
}

function returnToWelcome() {
  scene.hidden = true;
  welcome.hidden = false;

  if (fallingInterval) {
    clearInterval(fallingInterval);
    fallingInterval = null;
  }

  treeHearts.innerHTML = "";
}

startButton.addEventListener("click", openGift);
replayButton.addEventListener("click", returnToWelcome);

// --------------------------------------------------
// INICIAR LAS DECORACIONES DEL FONDO
// --------------------------------------------------

createStars();
createFloatingHearts();
createFireflies();
createTwigs();
