const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const player = {
    x: canvas.width / 2,
    y: canvas.height / 2 + 100,
    size: 30,
    speed: 5
};

const keys = {};

window.addEventListener("keydown", (event) => {
    keys[event.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (event) => {
    keys[event.key.toLowerCase()] = false;
});

function update() {

    if (keys["w"] || keys["arrowup"]) {
        player.y -= player.speed;
    }

    if (keys["s"] || keys["arrowdown"]) {
        player.y += player.speed;
    }

    if (keys["a"] || keys["arrowleft"]) {
        player.x -= player.speed;
    }

    if (keys["d"] || keys["arrowright"]) {
        player.x += player.speed;
    }

    // Keep player inside the screen
    player.x = Math.max(
        player.size / 2,
        Math.min(canvas.width - player.size / 2, player.x)
    );

    player.y = Math.max(
        player.size / 2,
        Math.min(canvas.height - player.size / 2, player.y)
    );
}

function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = "#11121a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Player
    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        player.x - player.size / 2,
        player.y - player.size / 2,
        player.size,
        player.size
    );
}

function gameLoop() {
    update();
    draw();

    requestAnimationFrame(gameLoop);
}

gameLoop();
