const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = {
    x: 120,
    y: 300,
    size: 26,
    speed: 4
};

const keys = {};

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// =========================
// KEYBOARD
// =========================

window.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});

// =========================
// TOUCH CONTROLS
// =========================

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

// =========================
// ROOM
// =========================

const room = {
    x: 40,
    y: 70,
    width: 0,
    height: 0
};

function updateRoom() {
    room.width = canvas.width - 80;
    room.height = canvas.height - 150;
}

updateRoom();
window.addEventListener("resize", updateRoom);

// =========================
// TERMINAL
// =========================

const terminal = {
    x: 250,
    y: 180,
    width: 45,
    height: 55,
    active: true
};

let message = "";
let messageTimer = 0;

// =========================
// COLLISION
// =========================

function isCollidingWithTerminal(x, y) {
    const half = player.size / 2;

    return (
        x + half > terminal.x &&
        x - half < terminal.x + terminal.width &&
        y + half > terminal.y &&
        y - half < terminal.y + terminal.height
    );
}

function movePlayer(dx, dy) {

    const newX = player.x + dx;
    const newY = player.y + dy;

    // Room boundaries
    const half = player.size / 2;

    if (
        newX - half >= room.x &&
        newX + half <= room.x + room.width &&
        !isCollidingWithTerminal(newX, player.y)
    ) {
        player.x = newX;
    }

    if (
        newY - half >= room.y &&
        newY + half <= room.y + room.height &&
        !isCollidingWithTerminal(player.x, newY)
    ) {
        player.y = newY;
    }
}

// =========================
// INTERACTION
// =========================

function distanceToTerminal() {

    const centerX = terminal.x + terminal.width / 2;
    const centerY = terminal.y + terminal.height / 2;

    return Math.hypot(
        player.x - centerX,
        player.y - centerY
    );
}

function interact() {

    if (distanceToTerminal() < 75) {

        message =
            "TERMINAL: POWER SYSTEM OFFLINE\n" +
            "Manual restoration required.";

        messageTimer = 300;
    }
}

window.addEventListener("keydown", (e) => {

    if (e.key.toLowerCase() === "e") {
        interact();
    }

});

// =========================
// UPDATE
// =========================

function update() {

    let dx = 0;
    let dy = 0;

    if (keys["w"] || keys["arrowup"] || touch.up) {
        dy -= player.speed;
    }

    if (keys["s"] || keys["arrowdown"] || touch.down) {
        dy += player.speed;
    }

    if (keys["a"] || keys["arrowleft"] || touch.left) {
        dx -= player.speed;
    }

    if (keys["d"] || keys["arrowright"] || touch.right) {
        dx += player.speed;
    }

    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
        dx *= 0.707;
        dy *= 0.707;
    }

    movePlayer(dx, dy);

    if (messageTimer > 0) {
        messageTimer--;
    }
}

// =========================
// DRAW
// =========================

function draw() {

    // Background
    ctx.fillStyle = "#080a10";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Room
    ctx.fillStyle = "#151923";
    ctx.fillRect(
        room.x,
        room.y,
        room.width,
        room.height
    );

    // Room border
    ctx.strokeStyle = "#454b5c";
    ctx.lineWidth = 4;

    ctx.strokeRect(
        room.x,
        room.y,
        room.width,
        room.height
    );

    // Floor grid
    ctx.strokeStyle = "#202532";
    ctx.lineWidth = 1;

    for (
        let x = room.x + 40;
        x < room.x + room.width;
        x += 40
    ) {
        ctx.beginPath();
        ctx.moveTo(x, room.y);
        ctx.lineTo(x, room.y + room.height);
        ctx.stroke();
    }

    for (
        let y = room.y + 40;
        y < room.y + room.height;
        y += 40
    ) {
        ctx.beginPath();
        ctx.moveTo(room.x, y);
        ctx.lineTo(room.x + room.width, y);
        ctx.stroke();
    }

    // Room title
    ctx.fillStyle = "#9da7bd";
    ctx.font = "bold 14px Arial";
    ctx.fillText(
        "ASTRA-9 // DOCKING BAY",
        room.x + 15,
        room.y - 15
    );

    // Terminal
    ctx.fillStyle = "#303747";

    ctx.fillRect(
        terminal.x,
        terminal.y,
        terminal.width,
        terminal.height
    );

    ctx.strokeStyle = "#69758d";
    ctx.strokeRect(
        terminal.x,
        terminal.y,
        terminal.width,
        terminal.height
    );

    // Terminal screen
    ctx.fillStyle = "#8ff0ff";

    ctx.fillRect(
        terminal.x + 8,
        terminal.y + 8,
        terminal.width - 16,
        18
    );

    // Terminal label
    ctx.fillStyle = "#aab4c8";
    ctx.font = "11px Arial";

    ctx.fillText(
        "TERMINAL",
        terminal.x - 3,
        terminal.y + terminal.height + 15
    );

    // Player
    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        player.x - player.size / 2,
        player.y - player.size / 2,
        player.size,
        player.size
    );

    // Interaction hint
    if (distanceToTerminal() < 75) {

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 13px Arial";

        ctx.fillText(
            "[ E ] INTERACT",
            player.x - 45,
            player.y - 25
        );
    }

    // Message box
    if (messageTimer > 0) {

        const boxWidth = Math.min(
            canvas.width - 40,
            520
        );

        const boxX =
            (canvas.width - boxWidth) / 2;

        const boxY =
            canvas.height - 125;

        ctx.fillStyle = "rgba(0,0,0,0.88)";

        ctx.fillRect(
            boxX,
            boxY,
            boxWidth,
            80
        );

        ctx.strokeStyle = "#69758d";
        ctx.strokeRect(
            boxX,
            boxY,
            boxWidth,
            80
        );

        ctx.fillStyle = "#ffffff";
        ctx.font = "14px Arial";

        const lines = message.split("\n");

        lines.forEach((line, index) => {

            ctx.fillText(
                line,
                boxX + 18,
                boxY + 28 + index * 22
            );

        });
    }
}

// =========================
// GAME LOOP
// =========================

function gameLoop() {

    update();
    draw();

    requestAnimationFrame(gameLoop);
}

gameLoop();
