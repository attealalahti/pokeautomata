const canvas = document.createElement("canvas");
const container = document.getElementById("canvas-container");
if (container) {
  container.appendChild(canvas);
}

const canvasSize = 600;
const cellsPerRow = 10;
const cellSize = canvasSize / cellsPerRow;

canvas.width = canvasSize;
canvas.height = canvasSize;

type PokemonType = {
  name: string;
  color: string;
};
/*
type PokemonType =
  | "normal"
  | "fire"
  | "water"
  | "grass"
  | "electric"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";


const types = new Map<PokemonType, string>();
types.set("normal", "989a62");
types.set("fire", "ec6b1a");
types.set("water", "5476f0");
types.set("grass", "65c338");
types.set("electric", "f7ca0b");
types.set("ice", "86d0d0");
types.set("fighting", "b31b1a");
types.set("poison", "8e2391");
types.set("ground", "d9b64f");
types.set("flying", "9774ef");
types.set("psychic", "f63a74");
types.set("bug", "98af00");
types.set("rock", "aa9222");
types.set("ghost", "5c4088");
types.set("dragon", "5b00fb");
types.set("dark", "5d4637");
types.set("steel", "a9a8c6");
types.set("fairy", "ff80db");
*/

const types: PokemonType[] = [
  { name: "normal", color: "#989a62" },
  { name: "fire", color: "#ec6b1a" },
  { name: "water", color: "#5476f0" },
  { name: "grass", color: "#65c338" },
  { name: "electric", color: "#f7ca0b" },
  { name: "ice", color: "#86d0d0" },
  { name: "fighting", color: "#b31b1a" },
  { name: "poison", color: "#8e2391" },
  { name: "ground", color: "#d9b64f" },
  { name: "flying", color: "#9774ef" },
  { name: "psychic", color: "#f63a74" },
  { name: "bug", color: "#98af00" },
  { name: "rock", color: "#aa9222" },
  { name: "ghost", color: "#5c4088" },
  { name: "dragon", color: "#5b00fb" },
  { name: "dark", color: "#5d4637" },
  { name: "steel", color: "#a9a8c6" },
  { name: "fairy", color: "#ff80db" },
];

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
];

const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("No context");

const drawCell = (x: number, y: number, color: string) => {
  ctx.fillStyle = color;
  ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
};

drawCell(0, 0, types[2]!.color);
drawCell(0, 1, types[10]!.color);
drawCell(1, 1, types[4]!.color);
