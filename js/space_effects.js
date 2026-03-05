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

        const nextInterval = delay || 20000 + (Math.random() * 25000); // 20-45s
        this.nextFlightTimer = setTimeout(() => {
            this.launchRocket();
            this.scheduleNextFlight();
        }, nextInterval);
    }

    launchRocket() {
        const isRtl = Math.random() > 0.5;
        const entryY = 10 + (Math.random() * 70); // 10% to 80% height

        const rocket = document.createElement('div');
        rocket.className = `rocket-flair ${isRtl ? 'rtl' : ''}`;

        rocket.innerHTML = `
            <div class="rocket-trail"></div>
            <div class="rocket-engine"></div>
            <div class="rocket-body">
                <div class="rocket-window"></div>
            </div>
        `;

        // Initial setup
        rocket.style.top = `${entryY}vh`;
        if (isRtl) {
            rocket.style.right = '-100px';
            rocket.style.left = 'auto';
        } else {
            rocket.style.left = '-100px';
            rocket.style.right = 'auto';
        }

        this.container.appendChild(rocket);

        // Animation trigger
        // Small timeout to ensure DOM placement before transform
        setTimeout(() => {
            const targetX = window.innerWidth + 200;
            if (isRtl) {
                rocket.style.transform = `translateX(${-targetX}px) scaleX(-1)`;
            } else {
                rocket.style.transform = `translateX(${targetX}px)`;
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
