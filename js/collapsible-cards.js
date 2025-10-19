// === COLLAPSIBLE CARDS FUNCTIONALITY ===

/**
 * Toggle card expansion/collapse
 * @param {HTMLElement} header - The card header element that was clicked
 */
function toggleCard(header) {
    const card = header.parentElement;
    const isExpanded = card.classList.contains('expanded');
    
    // Close all other cards if this one is being opened
    if (!isExpanded) {
        closeAllCards();
    }
    
    // Toggle the current card
    card.classList.toggle('expanded');
    
    // Add smooth scroll to card if it's being opened
    if (!isExpanded) {
        setTimeout(() => {
            card.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest',
                inline: 'nearest'
            });
        }, 100);
    }
    
    // Update card state in localStorage for persistence
    updateCardState(card);
}

/**
 * Close all collapsible cards
 */
function closeAllCards() {
    const cards = document.querySelectorAll('.collapsible-card');
    cards.forEach(card => {
        card.classList.remove('expanded');
    });
}

/**
 * Open a specific card by its class name
 * @param {string} cardClass - The class name of the card to open
 */
function openCard(cardClass) {
    closeAllCards();
    const card = document.querySelector(`.collapsible-card.${cardClass}`);
    if (card) {
        card.classList.add('expanded');
        updateCardState(card);
        
        // Smooth scroll to the opened card
        setTimeout(() => {
            card.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest',
                inline: 'nearest'
            });
        }, 100);
    }
}

/**
 * Update card state in localStorage for persistence across page loads
 * @param {HTMLElement} card - The card element
 */
function updateCardState(card) {
    const cardClass = Array.from(card.classList).find(cls => 
        cls !== 'collapsible-card' && cls !== 'expanded'
    );
    
    if (cardClass) {
        const isExpanded = card.classList.contains('expanded');
        localStorage.setItem(`card-${cardClass}`, isExpanded.toString());
    }
}

/**
 * Clear all card states from localStorage
 */
function clearAllCardStates() {
    const cards = document.querySelectorAll('.collapsible-card');
    cards.forEach(card => {
        const cardClass = Array.from(card.classList).find(cls => 
            cls !== 'collapsible-card' && cls !== 'expanded'
        );
        
        if (cardClass) {
            localStorage.removeItem(`card-${cardClass}`);
        }
    });
}

/**
 * Restore card states from localStorage on page load
 */
function restoreCardStates() {
    const cards = document.querySelectorAll('.collapsible-card');
    cards.forEach(card => {
        const cardClass = Array.from(card.classList).find(cls => 
            cls !== 'collapsible-card' && cls !== 'expanded'
        );
        
        if (cardClass) {
            const savedState = localStorage.getItem(`card-${cardClass}`);
            if (savedState === 'true') {
                card.classList.add('expanded');
            }
        }
    });
}

/**
 * Initialize collapsible cards functionality
 */
function initCollapsibleCards() {
    // Clear any saved card states from localStorage
    clearAllCardStates();
    
    // Close all cards first to ensure clean state
    closeAllCards();
    
    // Don't restore saved states - always start with all cards closed
    // restoreCardStates();
    
    // Add keyboard support
    document.addEventListener('keydown', (e) => {
        // Close all cards with Escape key
        if (e.key === 'Escape') {
            closeAllCards();
        }
        
        // Number keys to open specific cards
        if (e.key >= '1' && e.key <= '9') {
            const cardIndex = parseInt(e.key) - 1;
            const cards = document.querySelectorAll('.collapsible-card');
            if (cards[cardIndex]) {
                openCard(cards[cardIndex].classList[1]); // Get the second class (type)
            }
        }
    });
    
    // Add touch/swipe support for mobile
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    });
    
    document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;
        
        // Swipe up to close all cards
        if (diff > swipeThreshold) {
            closeAllCards();
        }
    }
    
    // Add click outside to close functionality
    document.addEventListener('click', (e) => {
        const isCardClick = e.target.closest('.collapsible-card');
        const isCardHeader = e.target.closest('.card-header');
        
        // If clicking outside cards, close all
        if (!isCardClick && !isCardHeader) {
            closeAllCards();
        }
    });
    
    // Add animation end listeners for smooth transitions
    const cards = document.querySelectorAll('.collapsible-card');
    cards.forEach(card => {
        const cardBody = card.querySelector('.card-body');
        if (cardBody) {
            cardBody.addEventListener('transitionend', (e) => {
                if (e.propertyName === 'max-height') {
                    // Animation completed
                    card.classList.toggle('animation-complete', card.classList.contains('expanded'));
                }
            });
        }
    });
}

/**
 * Update mailbox preview with new data
 * @param {Array} notes - Array of note objects
 */
function updateMailboxPreview(notes) {
    const mailboxPreview = document.getElementById('mailbox-preview');
    if (!mailboxPreview) return;

    if (!notes || notes.length === 0) {
        mailboxPreview.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📭</div>
                <div class="empty-text">Chưa có thư nào từ anh...</div>
            </div>
        `;
        return;
    }

    // Show latest note
    const latestNote = notes[0];
    const date = new Date(latestNote.timestamp);
    const timeString = date.toLocaleDateString('vi-VN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    mailboxPreview.innerHTML = `
        <div class="preview-header">
            <div class="preview-title"> 💌 Từ: Anh</div>
            <div class="preview-time">${timeString}</div>
        </div>
        <div class="preview-text">
            ${latestNote.message.length > 80 ? 
                latestNote.message.substring(0, 80) + '...' : 
                latestNote.message}
        </div>
        <div class="preview-count">
            ${notes.length > 1 ? `+${notes.length - 1} thư khác` : ''}
        </div>
    `;
}

/**
 * Update countdown display
 * @param {Object} timeData - Object containing days, hours, minutes, seconds
 */
function updateCountdownDisplay(timeData) {
    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minutesEl = document.getElementById('countdown-minutes');
    const secondsEl = document.getElementById('countdown-seconds');
    
    if (daysEl) daysEl.textContent = String(timeData.days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(timeData.hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(timeData.minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(timeData.seconds).padStart(2, '0');
}

/**
 * Add smooth reveal animation to cards on page load
 */
function addRevealAnimation() {
    const cards = document.querySelectorAll('.collapsible-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

/**
 * Add hover effects and interactions
 */
function addInteractiveEffects() {
    const cards = document.querySelectorAll('.collapsible-card');
    
    cards.forEach(card => {
        const header = card.querySelector('.card-header');
        const icon = card.querySelector('.card-icon');
        
        // Add hover effects
        header.addEventListener('mouseenter', () => {
            if (!card.classList.contains('expanded')) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        header.addEventListener('mouseleave', () => {
            if (!card.classList.contains('expanded')) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
        
        // Add click ripple effect
        header.addEventListener('click', (e) => {
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = e.offsetX + 'px';
            ripple.style.top = e.offsetY + 'px';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.pointerEvents = 'none';
            
            header.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// CSS for ripple animation
const rippleCSS = `
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

// Add ripple CSS to head
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initCollapsibleCards();
    addRevealAnimation();
    addInteractiveEffects();
});

// Export functions for external use
window.toggleCard = toggleCard;
window.openCard = openCard;
window.closeAllCards = closeAllCards;
window.clearAllCardStates = clearAllCardStates;
window.updateMailboxPreview = updateMailboxPreview;
window.updateCountdownDisplay = updateCountdownDisplay;
