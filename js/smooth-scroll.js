// Smooth scroll optimization cho website
class SmoothScroll {
    constructor() {
        this.isScrolling = false;
        this.scrollTimeout = null;
        this.lastScrollY = 0;
        this.init();
    }

    init() {
        // Passive event listeners for better performance
        window.addEventListener('scroll', this.throttleScroll.bind(this), { passive: true });
        window.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        window.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true });
        window.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
        
        // Initialize scroll-based animations
        this.initializeScrollAnimations();
    }

    throttleScroll() {
        if (!this.isScrolling) {
            requestAnimationFrame(() => {
                this.handleScroll();
                this.isScrolling = false;
            });
            this.isScrolling = true;
        }
    }

    handleScroll() {
        const scrollY = window.scrollY;
        const direction = scrollY > this.lastScrollY ? 'down' : 'up';
        
        // Add subtle parallax effects for cards
        this.updateParallaxEffects(scrollY);
        
        // Update scroll direction for animations
        document.body.setAttribute('data-scroll-direction', direction);
        
        this.lastScrollY = scrollY;
    }

    updateParallaxEffects(scrollY) {
        // Subtle parallax for dashboard cards
        document.querySelectorAll('.dashboard-card').forEach((card, index) => {
            const speed = 0.02 + (index * 0.005); // Very subtle movement
            const yPos = -(scrollY * speed);
            card.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });

        // Parallax for calendar and schedule containers
        const calendarContainer = document.querySelector('.calendar-page-container');
        if (calendarContainer) {
            const speed = 0.01;
            const yPos = -(scrollY * speed);
            calendarContainer.style.transform = `translate3d(0, ${yPos}px, 0)`;
        }

        const scheduleContainer = document.querySelector('.schedule-container');
        if (scheduleContainer) {
            const speed = 0.01;
            const yPos = -(scrollY * speed);
            scheduleContainer.style.transform = `translate3d(0, ${yPos}px, 0)`;
        }
    }

    handleTouchStart(e) {
        // Optimize touch interactions
        document.body.classList.add('touch-active');
    }

    handleTouchMove(e) {
        // Allow smooth touch scrolling
        if (e.touches.length === 1) {
            // Prevent default only for specific cases
            const target = e.target.closest('.no-touch-scroll');
            if (target) {
                e.preventDefault();
            }
        }
    }

    handleTouchEnd(e) {
        // Clean up touch state
        setTimeout(() => {
            document.body.classList.remove('touch-active');
        }, 150);
    }

    initializeScrollAnimations() {
        // Add intersection observer for scroll-triggered animations
        const observerOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    // Unobserve after animation to improve performance
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.observeElements(observer);
            });
        } else {
            this.observeElements(observer);
        }
    }

    observeElements(observer) {
        // Observe dashboard cards
        document.querySelectorAll('.dashboard-card').forEach(card => {
            observer.observe(card);
        });

        // Observe calendar elements
        document.querySelectorAll('.day-cell, .calendar-header').forEach(element => {
            observer.observe(element);
        });

        // Observe schedule elements
        document.querySelectorAll('.event-block, .day-header').forEach(element => {
            observer.observe(element);
        });
    }

    // Smooth scroll to element
    scrollToElement(element, offset = 0) {
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    // Smooth scroll to top
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Initialize smooth scroll when DOM is ready
let smoothScrollInstance;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        smoothScrollInstance = new SmoothScroll();
    });
} else {
    smoothScrollInstance = new SmoothScroll();
}

// Export for global use
window.smoothScroll = smoothScrollInstance;
