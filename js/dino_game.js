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
            this.width = 30 + Math.random() * 30;
            this.height = 40 + Math.random() * 40;
            this.x = canvas.width;
            this.y = dino.groundY - this.height;
            this.color = '#ef4444'; // Error/Obstacle color
            this.type = Math.random() > 0.8 ? 'flying' : 'static';

            if (this.type === 'flying') {
                this.y -= 60; // Higher up
            }
        }

        update() {
            this.x -= gameSpeed;
        }

        draw() {
            // Draw a glitchy-looking rectangle
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);

            // Add a "glitch" line
            if (frames % 10 < 5) {
                ctx.fillStyle = '#fff';
                ctx.fillRect(this.x, this.y + 5, this.width, 2);
            }
            ctx.shadowBlur = 0;
        }
    }

    function spawnObstacle() {
        if (frames % 100 === 0) {
            obstacles.push(new Obstacle());
        }
    }

    function handleObstacles() {
        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].update();
            obstacles[i].draw();

            // Collision Detection
            if (
                dino.x < obstacles[i].x + obstacles[i].width &&
                dino.x + dino.width > obstacles[i].x &&
                dino.y < obstacles[i].y + obstacles[i].height &&
                dino.y + dino.height > obstacles[i].y
            ) {
                gameOver();
            }

            // Remove off-screen obstacles
            if (obstacles[i].x + obstacles[i].width < 0) {
                obstacles.splice(i, 1);
                score++;
                if (score % 10 === 0) gameSpeed += 0.5;
            }
        }
    }

    function drawDino() {
        // Pixelated Robot/Dino
        ctx.fillStyle = dino.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = dino.color;

        // Body
        ctx.fillRect(dino.x, dino.y, dino.width, dino.height);

        // "Eye" visor
        ctx.fillStyle = '#fff';
        ctx.fillRect(dino.x + 25, dino.y + 10, 10, 4);

        // Small detail lines
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(dino.x + 5, dino.y + 20, 30, 2);

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
