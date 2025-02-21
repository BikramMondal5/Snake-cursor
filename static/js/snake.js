class SnakeSegment {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Snake {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.segments = [];
        this.segmentCount = 40;
        this.segmentSpacing = 10;
        this.minDistanceFromCursor = 50;
        this.targetX = 0;
        this.targetY = 0;
        this.easing = 0.3;

        // Initialize segments
        for (let i = 0; i < this.segmentCount; i++) {
            this.segments.push(new SnakeSegment(0, 0));
        }

        // Setup event listeners
        this.setupEventListeners();

        // Start animation loop
        this.animate();

        // Handle canvas resize
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => {
            this.targetX = e.clientX;
            this.targetY = e.clientY;
        });
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    update() {
        // Calculate direction to cursor
        const dx = this.targetX - this.segments[0].x;
        const dy = this.targetY - this.segments[0].y;
        const distanceToCursor = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        // Only move if we're beyond the minimum distance
        if (distanceToCursor > this.minDistanceFromCursor) {
            // Calculate target point that maintains minimum distance
            const targetX = this.targetX - Math.cos(angle) * this.minDistanceFromCursor;
            const targetY = this.targetY - Math.sin(angle) * this.minDistanceFromCursor;

            // Move head directly towards target
            this.segments[0].x += (targetX - this.segments[0].x) * this.easing;
            this.segments[0].y += (targetY - this.segments[0].y) * this.easing;
        }

        // Update body segments
        for (let i = 1; i < this.segments.length; i++) {
            const segment = this.segments[i];
            const prevSegment = this.segments[i - 1];

            const dx = prevSegment.x - segment.x;
            const dy = prevSegment.y - segment.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const segmentAngle = Math.atan2(dy, dx);

            if (distance > this.segmentSpacing) {
                // Position segments with direct following
                segment.x = prevSegment.x - Math.cos(segmentAngle) * this.segmentSpacing;
                segment.y = prevSegment.y - Math.sin(segmentAngle) * this.segmentSpacing;
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw snake body with glossy effect
        for (let i = this.segments.length - 1; i >= 0; i--) {
            const segment = this.segments[i];
            const progress = i / this.segments.length;
            const radius = 15 - (progress * 5);

            // Enhanced gradient for glossy effect
            const gradient = this.ctx.createRadialGradient(
                segment.x - radius * 0.3,
                segment.y - radius * 0.3,
                radius * 0.1,
                segment.x,
                segment.y,
                radius
            );

            gradient.addColorStop(0, `rgba(144, 255, 144, ${0.9 - progress * 0.3})`);
            gradient.addColorStop(0.3, `rgba(64, 255, 64, ${0.8 - progress * 0.3})`);
            gradient.addColorStop(0.6, `rgba(32, 192, 32, ${0.7 - progress * 0.3})`);
            gradient.addColorStop(1, `rgba(0, 128, 0, ${0.6 - progress * 0.3})`);

            this.ctx.beginPath();
            this.ctx.arc(segment.x, segment.y, radius, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();

            // Enhanced highlight effect
            const highlightGradient = this.ctx.createRadialGradient(
                segment.x - radius * 0.5,
                segment.y - radius * 0.5,
                radius * 0.1,
                segment.x - radius * 0.3,
                segment.y - radius * 0.3,
                radius * 0.5
            );
            highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
            highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            this.ctx.beginPath();
            this.ctx.arc(segment.x, segment.y, radius, 0, Math.PI * 2);
            this.ctx.fillStyle = highlightGradient;
            this.ctx.fill();
        }
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize snake when window loads
window.addEventListener('load', () => {
    const canvas = document.getElementById('snakeCanvas');
    new Snake(canvas);
});
