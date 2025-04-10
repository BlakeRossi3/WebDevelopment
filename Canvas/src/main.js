import { getRandomColor, getRandomInt } from "./utils.js";
import { drawRectangle, drawArc, drawLine } from "./canvas-util.js";

let ctx;
let paused = false;
let canvas;
let createRectangles = true;
let createArcs = true;
let createLines = true;

const init = () => {
    console.log("page loaded!");
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");
    ctx.fillStyle = "red";

    setupUI();
    update();
};

const update = () => {
    if (paused) return;
    requestAnimationFrame(update);
    if (createRectangles){
        drawRandomRect(ctx);
    }
    if (createArcs){
        drawRandomArc(ctx);
    } 
    if (createLines){
        drawRandomLine(ctx);
    }
};

const drawRandomRect = (ctx) => {
    drawRectangle(ctx, getRandomInt(0, 640), getRandomInt(0, 480), getRandomInt(10, 70), getRandomInt(10, 70), getRandomColor(), getRandomInt(1, 12), getRandomColor());
};

const drawRandomArc = (ctx) => {
    drawArc(ctx, getRandomInt(0, 640), getRandomInt(0, 480), getRandomInt(10, 70), 0, Math.PI * 2, getRandomColor(), getRandomInt(1, 12), getRandomColor());
};

const drawRandomLine = (ctx) => {
    drawLine(ctx, getRandomInt(0, 640), getRandomInt(0, 480), getRandomInt(0, 640), getRandomInt(0, 480), getRandomInt(1, 12), getRandomColor());
};

const canvasClicked = (e) => {
    let rect = e.target.getBoundingClientRect();
    let mouseX = e.clientX - rect.x;
    let mouseY = e.clientY - rect.y;
    console.log(mouseX, mouseY);
    for (let i = 0; i < 10; i++) {
        let x = getRandomInt(-100, 100) + mouseX;
        let y = getRandomInt(-100, 100) + mouseY;
        let radius = getRandomInt(10, 30);
        let color = getRandomColor();
        drawArc(ctx, x, y, radius, color, getRandomInt(1, 12), color);
    }
};

const setupUI = () => {
    document.querySelector("#btn-pause").onclick = () => {
        paused = true;
    };
    document.querySelector("#btn-play").onclick = () => {
        if (paused) {
            paused = false;
            update();
        }
    };
    document.querySelector("#btn-clear").onclick = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    canvas.onclick = canvasClicked;

    document.querySelector("#cb-rectangles").onclick = (e) => {
        createRectangles = e.target.checked;
    };
    document.querySelector("#cb-arcs").onclick = (e) => {
        createArcs = e.target.checked;
    };
    document.querySelector("#cb-lines").onclick = (e) => {
        createLines = e.target.checked;
    };
};

init();
