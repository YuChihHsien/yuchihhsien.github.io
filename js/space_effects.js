/**
 * Space Flair Effects
 * Adds randomized "Easter Eggs" like streaking rockets to the background.
 */

class SpaceFlairController {
    constructor() {
        this.container = document.body;
        this.nextFlightTimer = null;
        this.init();
    }

    init() {
        // Start the first flight after a short delay
        this.scheduleNextFlight(15000); // 15s for first appearance
    }

    scheduleNextFlight(delay) {
        if (this.nextFlightTimer) clearTimeout(this.nextFlightTimer);

        const nextInterval = delay || 10000 + (Math.random() * 20000); // 10-30s
        this.nextFlightTimer = setTimeout(() => {
            this.launchRocket();
            this.scheduleNextFlight();
        }, nextInterval);
    }

    launchRocket() {
        const isRtl = Math.random() > 0.5;
        const entryY = 10 + (Math.random() * 50); // 10% to 60% height
        const targetY = 5 + (Math.random() * 80); // Random exit height

        // Calculate the angle based on trajectory
        const travelX = window.innerWidth + 300;
        const travelYPx = (targetY - entryY) * (window.innerHeight / 100);
        const flightAngleDeg = Math.atan2(travelYPx, travelX) * (180 / Math.PI);

        const rocket = document.createElement('div');
        rocket.className = `rocket-flair ${isRtl ? 'rtl' : ''}`;

        // Move trail and engine INSIDE the body for perfect grouping/rotation
        rocket.innerHTML = `
            <div class="rocket-body">
                <div class="rocket-window"></div>
                <div class="rocket-engine"></div>
                <div class="rocket-trail"></div>
            </div>
        `;

        // Initial setup
        rocket.style.top = `${entryY}vh`;
        if (isRtl) {
            rocket.style.right = '-150px';
            rocket.style.left = 'auto';
            // For RTL, we flip the ship and negate the angle to maintain its pitch relative to the flight direction
            rocket.style.transform = `scaleX(-1) rotateZ(${-flightAngleDeg}deg)`;
        } else {
            rocket.style.left = '-150px';
            rocket.style.right = 'auto';
            rocket.style.transform = `rotateZ(${flightAngleDeg}deg)`;
        }

        this.container.appendChild(rocket);

        // Animation trigger
        setTimeout(() => {
            const duration = 4000 + (Math.random() * 2000); // 4-6s flight (faster)
            rocket.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;

            if (isRtl) {
                rocket.style.transform = `translateX(${-travelX}px) translateY(${targetY - entryY}vh) scaleX(-1) rotateZ(${-flightAngleDeg}deg)`;
            } else {
                rocket.style.transform = `translateX(${travelX}px) translateY(${targetY - entryY}vh) rotateZ(${flightAngleDeg}deg)`;
            }
        }, 50);

        // Cleanup
        setTimeout(() => {
            if (rocket.parentElement) {
                this.container.removeChild(rocket);
            }
        }, 7000); // Flight takes 6s (CSS transition) + 1s buffer
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    // Only run on desktop for performance and cleaner mobile look
    if (window.innerWidth >= 768) {
        window.SpaceFlair = new SpaceFlairController();
    }
});
