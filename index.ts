const canvas = document.createElement("canvas");
const container = document.getElementById("canvas-container");
if (container) {
  container.appendChild(canvas);
}

const canvasSize = Math.min(innerHeight * 0.95, innerWidth * 0.9);

canvas.width = canvasSize;
canvas.height = canvasSize;

const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("No context");

type PokemonType = {
  index: number;
  name: string;
  color: string;
};

const types: PokemonType[] = [
  { index: 0, name: "normal", color: "#989a62" },
  { index: 1, name: "fire", color: "#ec6b1a" },
  { index: 2, name: "water", color: "#5476f0" },
  { index: 3, name: "grass", color: "#65c338" },
  { index: 4, name: "electric", color: "#f7ca0b" },
  { index: 5, name: "ice", color: "#86d0d0" },
  { index: 6, name: "fighting", color: "#b31b1a" },
  { index: 7, name: "poison", color: "#8e2391" },
  { index: 8, name: "ground", color: "#d9b64f" },
  { index: 9, name: "flying", color: "#9774ef" },
  { index: 10, name: "psychic", color: "#f63a74" },
  { index: 11, name: "bug", color: "#98af00" },
  { index: 12, name: "rock", color: "#aa9222" },
  { index: 13, name: "ghost", color: "#5c4088" },
  { index: 14, name: "dragon", color: "#5b00fb" },
  { index: 15, name: "dark", color: "#5d4637" },
  { index: 16, name: "steel", color: "#a9a8c6" },
  { index: 17, name: "fairy", color: "#ff80db" },
];

const getRandomType = (): PokemonType => {
  const randomIndex = Math.floor(Math.random() * types.length);
  return types[randomIndex]!;
};

const typeChart = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.5, 0, 1, 1, 0.5, 1],
  [1, 0.5, 0.5, 2, 1, 2, 1, 1, 1, 1, 1, 2, 0.5, 1, 0.5, 1, 2, 1],
  [1, 2, 0.5, 0.5, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 0.5, 1, 1, 1],
  [1, 0.5, 2, 0.5, 1, 1, 1, 0.5, 2, 0.5, 1, 0.5, 2, 1, 0.5, 1, 0.5, 1],
  [1, 1, 2, 0.5, 0.5, 1, 1, 1, 0, 2, 1, 1, 1, 1, 0.5, 1, 1, 1],
  [1, 0.5, 0.5, 2, 1, 0.5, 1, 1, 2, 2, 1, 1, 1, 1, 2, 1, 0.5, 1],
  [2, 1, 1, 1, 1, 2, 1, 0.5, 1, 0.5, 0.5, 0.5, 2, 0, 1, 2, 2, 0.5],
  [1, 1, 1, 2, 1, 1, 1, 0.5, 0.5, 1, 1, 1, 0.5, 0.5, 1, 1, 0, 2],
  [1, 2, 1, 0.5, 2, 1, 1, 2, 1, 0, 1, 0.5, 2, 1, 1, 1, 2, 1],
  [1, 1, 1, 2, 0.5, 1, 2, 1, 1, 1, 1, 2, 0.5, 1, 1, 1, 0.5, 1],
  [1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 0.5, 1, 1, 1, 1, 0, 0.5, 1],
  [1, 0.5, 1, 2, 1, 1, 0.5, 0.5, 1, 0.5, 2, 1, 1, 0.5, 1, 2, 0.5, 0.5],
  [1, 2, 1, 1, 1, 2, 0.5, 1, 0.5, 2, 1, 2, 1, 1, 1, 1, 0.5, 1],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 0.5, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 0.5, 0],
  [1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1, 2, 1, 1, 2, 1, 0.5, 1, 0.5],
  [1, 0.5, 0.5, 1, 0.5, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 0.5, 2],
  [1, 0.5, 1, 1, 1, 1, 2, 0.5, 1, 1, 1, 1, 1, 1, 2, 2, 0.5, 1],
] as const;

const maxHealth = 10;
const attack = 0.5;

class Pokemon {
  type: PokemonType | undefined;
  x: number;
  y: number;
  nextType: PokemonType | undefined;
  health: number = maxHealth;
  nextHealth: number | undefined;

  constructor(x: number, y: number, type?: PokemonType) {
    this.x = x;
    this.y = y;
    this.type = type;
  }

  private getCellData(
    x: number,
    y: number
  ): { damageMod: number; type?: PokemonType } {
    if (!this.type) return { damageMod: 0 };
    const row = grid[y];
    if (!row) return { damageMod: 0 };
    const pokemon = row[x];
    if (!pokemon || !pokemon.type) return { damageMod: 0 };
    return {
      damageMod: typeChart[pokemon.type.index]![this.type.index]!,
      type: pokemon.type,
    };
  }

  private getNeighborData() {
    return [
      this.getCellData(this.x, this.y - 1),
      this.getCellData(this.x, this.y + 1),
      this.getCellData(this.x - 1, this.y),
      this.getCellData(this.x + 1, this.y),
    ];
  }

  updateInstant() {
    const neighborData = this.getNeighborData();

    const weaknesses = neighborData.filter((data) => data.damageMod === 2);
    const randomIndex = Math.floor(Math.random() * weaknesses.length);
    const successfulAttacker = weaknesses[randomIndex];
    if (successfulAttacker) {
      this.nextType = successfulAttacker.type;
    } else {
      this.nextType = this.type;
    }
  }

  updateHealthBased() {
    const neighborData = this.getNeighborData();
    this.nextHealth = this.health;
    for (const neighbor of neighborData) {
      this.nextHealth -= neighbor.damageMod * attack;
    }

    this.nextType = this.type;
    if (this.nextHealth > 0) return;

    this.nextHealth = maxHealth;
    neighborData.sort(() => Math.random() - 0.5);
    neighborData.sort((a, b) => b.damageMod - a.damageMod);

    this.nextType = neighborData[0]?.type;
  }

  commitUpdate() {
    this.type = this.nextType;
    if (this.nextHealth !== undefined) this.health = this.nextHealth;
  }
}

const gridSizeInput = <HTMLInputElement>document.getElementById("grid-size");
if (!gridSizeInput) throw new Error("No grid size input");

let grid: Pokemon[][] = [];
let cellsPerRow = 0;
let cellSize = 0;

const minGridSize = 10;
const maxGridSize = 300;

const createGrid = () => {
  cellsPerRow = Number(gridSizeInput.value);
  cellSize = canvasSize / cellsPerRow;

  grid = [];
  for (let i = 0; i < cellsPerRow; i++) {
    const row: Pokemon[] = [];
    for (let j = 0; j < cellsPerRow; j++) {
      row.push(new Pokemon(j, i));
    }
    grid.push(row);
  }
};

createGrid();

let selectedType = types[0] as PokemonType;
const changeSelectedType = (typeName: string) => {
  const newType = types.find((type) => type.name === typeName);
  if (newType) {
    selectedType = newType;
  }
};

const populateRandomly = () => {
  for (const row of grid) {
    for (const pokemon of row) {
      pokemon.type = getRandomType();
      pokemon.nextType = undefined;
    }
  }
  drawGrid();
};

const getMousePositionOnGrid = (evt: MouseEvent) => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: Math.floor((evt.clientX - rect.left) / cellSize),
    y: Math.floor((evt.clientY - rect.top) / cellSize),
  };
};

const paintType = (evt: MouseEvent) => {
  const { x, y } = getMousePositionOnGrid(evt);
  const row = grid[y];
  if (!row) return;
  const pokemon = row[x];
  if (!pokemon) return;
  if (evt.buttons === 1) {
    pokemon.type = selectedType;
  } else if (evt.buttons === 2) {
    pokemon.type = undefined;
  }
  drawGrid();
};

let mouseDown = 0;
document.body.addEventListener("mousedown", () => mouseDown++);
document.body.addEventListener("mouseup", () => mouseDown--);

canvas.addEventListener("mousedown", paintType);
canvas.addEventListener("mousemove", (evt) => {
  if (mouseDown > 0) paintType(evt);
});
canvas.addEventListener("contextmenu", (evt) => evt.preventDefault());

const methodInput = <HTMLSelectElement>document.getElementById("method");
if (!methodInput) throw new Error("No method input");

let method = methodInput.value;
methodInput.addEventListener("change", () => {
  method = methodInput.value;
  mouseDown++;
});

const drawCell = (x: number, y: number, color: string) => {
  ctx.fillStyle = color;
  ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
};

const drawGrid = () => {
  for (const row of grid) {
    for (const pokemon of row) {
      if (pokemon.type) {
        drawCell(pokemon.x, pokemon.y, pokemon.type.color);
      } else {
        drawCell(pokemon.x, pokemon.y, "white");
      }
    }
  }
};

const updateAndDrawGrid = () => {
  for (const row of grid) {
    for (const pokemon of row) {
      if (method === "health-based") {
        pokemon.updateHealthBased();
      } else {
        pokemon.updateInstant();
      }
    }
  }
  for (const row of grid) {
    for (const pokemon of row) {
      pokemon.commitUpdate();
      if (pokemon.type) {
        drawCell(pokemon.x, pokemon.y, pokemon.type.color);
      } else {
        drawCell(pokemon.x, pokemon.y, "white");
      }
    }
  }
};

gridSizeInput.addEventListener("change", () => {
  const value = Number(gridSizeInput.value);
  if (value < minGridSize || value > maxGridSize) return;
  createGrid();
  drawGrid();
});

let updatesPerSecond = 0;
let speed = 0;
let interval: number | undefined = undefined;

const speedInput = <HTMLInputElement>document.getElementById("speed-range");
const speedDisplay = document.getElementById("speed-display");

if (!speedInput || !speedDisplay) throw new Error("No speed controls");

const updateSpeed = () => {
  updatesPerSecond = Number(speedInput.value);
  speed = updatesPerSecond === 0 ? 0 : 1000 / updatesPerSecond;
  speedDisplay.textContent = `${updatesPerSecond} updates/second`;

  if (interval !== undefined) clearInterval(interval);
  if (speed > 0) interval = setInterval(updateAndDrawGrid, speed);
};

speedInput.addEventListener("change", updateSpeed);

updateSpeed();
