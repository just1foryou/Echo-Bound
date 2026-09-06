const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function gameLoop() {
    ctx.fillStyle = "#080a10";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Test player
    ctx.fillStyle = "white";
    ctx.fillRect(107, 287, 26, 26);

    // Test terminal
    ctx.fillStyle = "#303747";
    ctx.fillRect(250, 180, 45, 55);

    requestAnimationFrame(gameLoop);
}

gameLoop();
