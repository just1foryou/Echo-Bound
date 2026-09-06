alert("NEW GAME.JS LOADED");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// =========================
// PLAYER
// =========================

const player = {
    x: 120,
    y: 300,
    size: 26,
    speed: 4
};

// =========================
// INPUT
// =========================

const keys = {};

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
    }, { passive: false });

    button.addEventListener("touchend", (e) => {
        e.preventDefault();
        touch[direction] = false;
    }, { passive: false });

    button.addEventListener("touchcancel", () => {
        touch[direction] = false;
    });
}

setupButton("up", "up");
setupButton("down", "down");
setupButton("left", "left");
setupButton("right", "right");

// =========================
// CANVAS
// =========================

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    updateRoom();
}

window.addEventListener("resize", resizeCanvas);

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
    room.width = Math.max(100, canvas.width - 80);
    room.height = Math.max(100, canvas.height - 150);
}

// =========================
// OBJECTS
// =========================

const terminal = {
    x: 250,
    y: 180,
    width: 45,
    height: 55,
    active: true
};

const powerPanel = {
    x: 450,
    y: 300,
    width: 50,
    height: 60,
    active: true
};

// =========================
// MESSAGE
// =========================

let message = "";
let messageTimer = 0;

// =========================
// COLLISION
// =========================

function isCollidingWithObjects(x, y) {

    const half = player.size / 2;

    const terminalCollision =
        x + half > terminal.x &&
        x - half < terminal.x + terminal.width &&
        y + half > terminal.y &&
        y - half < terminal.y + terminal.height;

    const panelCollision =
        x + half > powerPanel.x &&
        x - half < powerPanel.x + powerPanel.width &&
        y + half > powerPanel.y &&
        y - half < powerPanel.y + powerPanel.height;

    return terminalCollision || panelCollision;
}

// =========================
// PLAYER MOVEMENT
// =========================

function movePlayer(dx, dy) {

    const half = player.size / 2;

    const newX = player.x + dx;
    const newY = player.y + dy;

    // Horizontal movement
    if (
        newX - half >= room.x &&
        newX + half <= room.x + room.width &&
        !isCollidingWithObjects(newX, player.y)
    ) {
        player.x = newX;
    }

    // Vertical movement
    if (
        newY - half >= room.y &&
        newY + half <= room.y + room.height &&
        !isCollidingWithObjects(player.x, newY)
    ) {
        player.y = newY;
    }
}

// =========================
// TERMINAL DISTANCE
// =========================

function distanceToTerminal() {

    const centerX =
        terminal.x + terminal.width / 2;

    const centerY =
        terminal.y + terminal.height / 2;

    return Math.hypot(
        player.x - centerX,
        player.y - centerY
    );
}

// =========================
// INTERACTION
// =========================

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

const interactButton =
    document.getElementById("interact");

if (interactButton) {

    interactButton.addEventListener("touchstart", (e) => {
        e.preventDefault();
        interact();
    }, { passive: false });
}

// =========================
// UPDATE
// =========================

function update() {

    let dx = 0;
    let dy = 0;

    if (
        keys["w"] ||
        keys["arrowup"] ||
        touch.up
    ) {
        dy -= player.speed;
    }

    if (
        keys["s"] ||
        keys["arrowdown"] ||
        touch.down
    ) {
        dy += player.speed;
    }

    if (
        keys["a"] ||
        keys["arrowleft"] ||
        touch.left
    ) {
        dx -= player.speed;
    }

    if (
        keys["d"] ||
        keys["arrowright"] ||
        touch.right
    ) {
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
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // =========================
    // ROOM
    // =========================

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

    // =========================
    // FLOOR GRID
    // =========================

    ctx.strokeStyle = "#202532";
    ctx.lineWidth = 1;

    for (
        let x = room.x + 40;
        x < room.x + room.width;
        x += 40
    ) {

        ctx.beginPath();

        ctx.moveTo(x, room.y);
        ctx.lineTo(
            x,
            room.y + room.height
        );

        ctx.stroke();
    }

    for (
        let y = room.y + 40;
        y < room.y + room.height;
        y += 40
    ) {

        ctx.beginPath();

        ctx.moveTo(room.x, y);
        ctx.lineTo(
            room.x + room.width,
            y
        );

        ctx.stroke();
    }

    // =========================
    // ROOM TITLE
    // =========================

    ctx.fillStyle = "#9da7bd";
    ctx.font = "bold 14px Arial";

    ctx.fillText(
        "ASTRA-9 // DOCKING BAY",
        room.x + 15,
        room.y - 15
    );

    // =========================
    // TERMINAL
    // =========================

    ctx.fillStyle = "#303747";

    ctx.fillRect(
        terminal.x,
        terminal.y,
        terminal.width,
        terminal.height
    );

    ctx.strokeStyle = "#69758d";
    ctx.lineWidth = 1;

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

    // =========================
    // POWER PANEL
    // =========================

    ctx.fillStyle = "#252b38";

    ctx.fillRect(
        powerPanel.x,
        powerPanel.y,
        powerPanel.width,
        powerPanel.height
    );

    ctx.strokeStyle = "#69758d";

    ctx.strokeRect(
        powerPanel.x,
        powerPanel.y,
        powerPanel.width,
        powerPanel.height
    );

    // Panel light
    ctx.fillStyle = "#ffcc66";

    ctx.fillRect(
        powerPanel.x + 10,
        powerPanel.y + 10,
        12,
        12
    );

    // Panel label
    ctx.fillStyle = "#aab4c8";
    ctx.font = "10px Arial";

    ctx.fillText(
        "POWER",
        powerPanel.x + 3,
        powerPanel.y + powerPanel.height + 14
    );

    // =========================
    // PLAYER
    // =========================

    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        player.x - player.size / 2,
        player.y - player.size / 2,
        player.size,
        player.size
    );

    // =========================
    // INTERACTION HINT
    // =========================

    if (distanceToTerminal() < 75) {

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 13px Arial";

        ctx.fillText(
            "[ E ] INTERACT",
            player.x - 45,
            player.y - 25
        );
    }

    // =========================
    // MESSAGE BOX
    // =========================

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
// START GAME
// =========================

resizeCanvas();
gameLoop();

function gameLoop() {

    update();
    draw();

    requestAnimationFrame(gameLoop);
}
