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
        this.scheduleNextFlight(5000); // 5s for first appearance
    }

    scheduleNextFlight(delay) {
        if (this.nextFlightTimer) clearTimeout(this.nextFlightTimer);

        const nextInterval = delay || 3000 + (Math.random() * 7000); // 3-10s
        this.nextFlightTimer = setTimeout(() => {
            // Randomly pick between rocket and meteor
            if (Math.random() > 0.45) {
                this.launchRocket();
            } else {
                this.launchMeteor();
            }
            this.scheduleNextFlight();
        }, nextInterval);
    }

    launchRocket() {
        const isRtl = Math.random() > 0.5;
        const entryY = 10 + (Math.random() * 50); // 10% to 60% height
        const targetY = 5 + (Math.random() * 80); // Random exit height
        const scale = 0.6 + (Math.random() * 0.7); // Randomized size (0.6x to 1.3x)

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
        const initialScaleX = isRtl ? -scale : scale;
        const initialRotation = isRtl ? -flightAngleDeg : flightAngleDeg;

        if (isRtl) {
            rocket.style.right = '-150px';
            rocket.style.left = 'auto';
        } else {
            rocket.style.left = '-150px';
            rocket.style.right = 'auto';
        }

        rocket.style.transform = `scale(${initialScaleX}, ${scale}) rotateZ(${initialRotation}deg)`;

        this.container.appendChild(rocket);

        // Animation trigger
        setTimeout(() => {
            const duration = 4000 + (Math.random() * 2000); // 4-6s flight
            rocket.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;

            const targetX = isRtl ? -travelX : travelX;
            rocket.style.transform = `translateX(${targetX}px) translateY(${targetY - entryY}vh) scale(${initialScaleX}, ${scale}) rotateZ(${initialRotation}deg)`;
        }, 50);

        // Cleanup
        setTimeout(() => {
            if (rocket.parentElement) {
                this.container.removeChild(rocket);
            }
        }, 7000);
    }

    launchMeteor() {
        const isRtl = Math.random() > 0.5;
        const entryY = 5 + (Math.random() * 40); // Usually higher up
        const targetY = 30 + (Math.random() * 60); // Descending path

        const travelX = window.innerWidth + 400;
        const travelYPx = (targetY - entryY) * (window.innerHeight / 100);
        const flightAngleDeg = Math.atan2(travelYPx, travelX) * (180 / Math.PI);

        const meteor = document.createElement('div');
        meteor.className = `meteor-flair ${isRtl ? 'rtl' : ''}`;

        // Initial setup
        meteor.style.top = `${entryY}vh`;
        const initialRotation = isRtl ? -flightAngleDeg : flightAngleDeg;

        if (isRtl) {
            meteor.style.right = '-200px';
            meteor.style.left = 'auto';
        } else {
            meteor.style.left = '-200px';
            meteor.style.right = 'auto';
        }

        meteor.style.transform = `rotateZ(${initialRotation}deg)`;
        this.container.appendChild(meteor);

        // Animation (Meteors are FAST but visible)
        setTimeout(() => {
            const duration = 1200 + (Math.random() * 800); // 1.2-2.0s
            meteor.style.transition = `transform ${duration}ms linear`;

            const targetX = isRtl ? -travelX : travelX;
            meteor.style.transform = `translateX(${targetX}px) translateY(${targetY - entryY}vh) rotateZ(${initialRotation}deg)`;
        }, 30);

        // Cleanup
        setTimeout(() => {
            if (meteor.parentElement) {
                this.container.removeChild(meteor);
            }
        }, 2000);
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    // Only run on desktop for performance and cleaner mobile look
    if (window.innerWidth >= 768) {
        window.SpaceFlair = new SpaceFlairController();
    }
});
