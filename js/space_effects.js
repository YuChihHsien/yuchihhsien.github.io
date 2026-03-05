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
        const entryY = 10 + (Math.random() * 70); // 10% to 80% height
        const angle = (Math.random() * 30) - 15; // -15 to +15 degrees

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
            rocket.style.right = '-120px';
            rocket.style.left = 'auto';
            rocket.style.transform = `scaleX(-1) rotateZ(${angle}deg)`;
        } else {
            rocket.style.left = '-120px';
            rocket.style.right = 'auto';
            rocket.style.transform = `rotateZ(${angle}deg)`;
        }

        this.container.appendChild(rocket);

        // Animation trigger
        setTimeout(() => {
            const travelDistance = window.innerWidth + 300;
            if (isRtl) {
                // Keep the scaleX(-1) to face left, maintain angle
                rocket.style.transform = `translateX(${-travelDistance}px) scaleX(-1) rotateZ(${angle}deg)`;
            } else {
                rocket.style.transform = `translateX(${travelDistance}px) rotateZ(${angle}deg)`;
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
