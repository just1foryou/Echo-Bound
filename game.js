const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = {
    x: 150,
    y: 250,
    size: 30,
    speed: 4
};

const keys = {};

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Keyboard controls
window.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});

// Touch buttons
const touch = {
    up: false,
    down: false,
    left: false,
    right: false
};

function setupButton(id, direction) {
    const button = document.getElementById(id);

    if (!button) return;

    button.addEventListener("touchstart", (e) => {
        e.preventDefault();
        touch[direction] = true;
    });

    button.addEventListener("touchend", (e) => {
        e.preventDefault();
        touch[direction] = false;
    });

    button.addEventListener("touchcancel", () => {
        touch[direction] = false;
    });
}

setupButton("up", "up");
setupButton("down", "down");
setupButton("left", "left");
setupButton("right", "right");

function update() {

    if (keys["w"] || keys["arrowup"] || touch.up) {
        player.y -= player.speed;
    }

    if (keys["s"] || keys["arrowdown"] || touch.down) {
        player.y += player.speed;
    }

    if (keys["a"] || keys["arrowleft"] || touch.left) {
        player.x -= player.speed;
    }

    if (keys["d"] || keys["arrowright"] || touch.right) {
        player.x += player.speed;
    }

    // Screen boundaries
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
