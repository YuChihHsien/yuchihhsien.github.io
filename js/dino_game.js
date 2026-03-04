/**
 * Lab Experiment 05: Cyber Runner (Dino Game Clone)
 * A side-scrolling runner with a cyberpunk aesthetic.
 */

function initDinoGame(canvasId, containerId) {
    const canvas = document.getElementById(canvasId);
    const container = document.getElementById(containerId);
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');

    // Game State
    let isGameRunning = false;
    let score = 0;
    let gameSpeed = 5;
    let frames = 0;
    let obstacles = [];

    // Dino Object
    const dino = {
        x: 50,
        y: 0,
        width: 40,
        height: 40,
        dy: 0,
        jumpForce: 12,
        gravity: 0.6,
        groundY: 0,
        isJumping: false,
        color: '#3b82f6' // Accent Color
    };

    function resize() {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        dino.groundY = canvas.height * 0.7;
        dino.y = dino.groundY - dino.height;
    }

    window.addEventListener('resize', resize);
    resize();

    // Input Handling
    function jump() {
        if (!isGameRunning) {
            resetGame();
            return;
        }
        if (!dino.isJumping) {
            dino.dy = -dino.jumpForce;
            dino.isJumping = true;
        }
    }

    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            e.preventDefault();
            jump();
        }
    });

    canvas.addEventListener('mousedown', (e) => {
        e.preventDefault();
        jump();
    });

    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        jump();
    });

    function resetGame() {
        score = 0;
        gameSpeed = 5;
        frames = 0;
        obstacles = [];
        dino.y = dino.groundY - dino.height;
        dino.dy = 0;
        dino.isJumping = false;
        isGameRunning = true;
        animate();
    }

    class Obstacle {
        constructor() {
            this.width = 30 + Math.random() * 20;
            this.height = 40 + Math.random() * 30;
            this.x = canvas.width;
            this.y = dino.groundY - this.height;
            this.color = '#ef4444'; // Error/Obstacle color
            this.type = Math.random() > 0.8 ? 'flying' : 'static';

            if (this.type === 'flying') {
                this.y -= 70;
            }
        }

        update() {
            this.x -= gameSpeed;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;

            if (this.type === 'static') {
                // Cyber Cactus Shape
                const w = this.width;
                const h = this.height;
                const x = this.x;
                const y = this.y;

                // Main stem (pixelated)
                ctx.fillRect(x + w * 0.3, y, w * 0.4, h);
                // Left arm
                ctx.fillRect(x, y + h * 0.3, w * 0.3, h * 0.1);
                ctx.fillRect(x, y + h * 0.1, w * 0.1, h * 0.2);
                // Right arm
                ctx.fillRect(x + w * 0.7, y + h * 0.4, w * 0.3, h * 0.1);
                ctx.fillRect(x + w * 0.9, y + h * 0.2, w * 0.1, h * 0.2);
            } else {
                // Cyber Drone/Bird
                ctx.fillRect(this.x, this.y, this.width, this.height * 0.4);
                // Animated "wings"
                const wingPos = Math.sin(frames * 0.2) * 10;
                ctx.fillRect(this.x + 5, this.y - 5 + wingPos, 10, 5);
                ctx.fillRect(this.x + this.width - 15, this.y - 5 + wingPos, 10, 5);
            }

            ctx.shadowBlur = 0;
        }
    }

    function spawnObstacle() {
        // Dynamic spawning logic
        if (frames % Math.floor(100 - gameSpeed * 2) === 0) {
            obstacles.push(new Obstacle());
        }
    }

    function handleObstacles() {
        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].update();
            obstacles[i].draw();

            // Collision Detection (Narrowed hitboxes for fairness)
            if (
                dino.x + 5 < obstacles[i].x + obstacles[i].width - 5 &&
                dino.x + dino.width - 5 > obstacles[i].x + 5 &&
                dino.y + 5 < obstacles[i].y + obstacles[i].height - 5 &&
                dino.y + dino.height - 5 > obstacles[i].y + 5
            ) {
                gameOver();
            }

            // Remove off-screen obstacles
            if (obstacles[i].x + obstacles[i].width < 0) {
                obstacles.splice(i, 1);
                score++;
                if (score % 5 === 0) gameSpeed += 0.2;
            }
        }
    }

    function drawDino() {
        ctx.fillStyle = dino.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = dino.color;

        const x = dino.x;
        const y = dino.y;
        const w = dino.width;
        const h = dino.height;

        // Cyber T-Rex Shape (Pixel art style)
        // Head
        ctx.fillRect(x + w * 0.5, y, w * 0.5, h * 0.35);
        // Snout visor
        ctx.fillStyle = '#fff';
        ctx.fillRect(x + w * 0.8, y + h * 0.05, w * 0.2, h * 0.1);

        ctx.fillStyle = dino.color;
        // Neck/Body
        ctx.fillRect(x + w * 0.3, y + h * 0.2, w * 0.4, h * 0.5);
        // Tail
        ctx.fillRect(x, y + h * 0.4, w * 0.3, h * 0.2);
        // Legs (animated)
        const legOffset = dino.isJumping ? 0 : Math.sin(frames * 0.5) * 5;
        ctx.fillRect(x + w * 0.3, y + h * 0.7, w * 0.15, h * 0.3 + legOffset);
        ctx.fillRect(x + w * 0.55, y + h * 0.7, w * 0.15, h * 0.3 - legOffset);

        ctx.shadowBlur = 0;
    }

    function drawGround() {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, dino.groundY);
        ctx.lineTo(canvas.width, dino.groundY);
        ctx.stroke();

        // Animated Ground Grid Lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        for (let i = 0; i < canvas.width; i += 50) {
            const x = (i - (frames * gameSpeed) % 50);
            ctx.beginPath();
            ctx.moveTo(x, dino.groundY);
            ctx.lineTo(x - 20, canvas.height);
            ctx.stroke();
        }
    }

    function drawScore() {
        ctx.fillStyle = '#fff';
        ctx.font = '700 20px "Space Grotesk"';
        ctx.textAlign = 'right';
        ctx.fillText(`SYSTEM_STABILITY: ${score * 10}%`, canvas.width - 30, 50);
    }

    function gameOver() {
        isGameRunning = false;
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#ef4444';
        ctx.font = '800 40px "Space Grotesk"';
        ctx.textAlign = 'center';
        ctx.fillText('CRITICAL_FAILURE', canvas.width / 2, canvas.height / 2 - 20);

        ctx.fillStyle = '#fff';
        ctx.font = '400 18px "Space Grotesk"';
        ctx.fillText('PRESS SPACE OR CLICK TO REBOOT', canvas.width / 2, canvas.height / 2 + 30);
    }

    function animate() {
        if (!isGameRunning) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Physics
        dino.dy += dino.gravity;
        dino.y += dino.dy;

        if (dino.y > dino.groundY - dino.height) {
            dino.y = dino.groundY - dino.height;
            dino.dy = 0;
            dino.isJumping = false;
        }

        drawGround();
        drawDino();
        spawnObstacle();
        handleObstacles();
        drawScore();

        frames++;
        requestAnimationFrame(animate);
    }

    // Initial Screen
    ctx.fillStyle = '#fff';
    ctx.font = '700 20px "Space Grotesk"';
    ctx.textAlign = 'center';
    ctx.fillText('READY_TO_RUN.EXE', canvas.width / 2, canvas.height / 2);
    ctx.font = '400 14px "Space Grotesk"';
    ctx.fillText('CLICK TO START', canvas.width / 2, canvas.height / 2 + 30);
}
