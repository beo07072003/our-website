// === FLOATING HEARTS ANIMATION - OPTIMIZED ===

let heartCount = 0;
let maxHearts = 15; // Giới hạn số hearts để tránh lag
let heartCreationActive = false;

// Detect mobile device
function isMobile() {
    return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Set max hearts based on device
if (isMobile()) {
    maxHearts = 8; // Ít hearts hơn trên mobile
}

function createFloatingHeart() {
    // Kiểm tra số lượng hearts hiện tại
    const currentHearts = document.querySelectorAll('.heart').length;
    if (currentHearts >= maxHearts) {
        return; // Không tạo thêm nếu đã đủ
    }
    
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = '💕';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDelay = '0s'; // Bỏ delay để tránh conflict
    // Adjust size and duration based on device
    if (isMobile()) {
        heart.style.fontSize = (Math.random() * 6 + 12) + 'px'; // 12-18px on mobile
        heart.style.animationDuration = (Math.random() * 3 + 6) + 's'; // 6-9s on mobile
    } else {
        heart.style.fontSize = (Math.random() * 10 + 15) + 'px'; // 15-25px on desktop
        heart.style.animationDuration = (Math.random() * 4 + 8) + 's'; // 8-12s on desktop
    }
    
    // Thêm ID để track
    heart.id = 'heart-' + (++heartCount);
    
    const heartsContainer = document.getElementById('floating-hearts');
    if (heartsContainer) {
        heartsContainer.appendChild(heart);
        
        // Auto remove sau animation
        setTimeout(() => {
            if (heart.parentNode) {
                heart.remove();
            }
        }, 15000); // Tăng thời gian để đảm bảo animation hoàn thành
    }
}

// Tạo hearts liên tục với interval ngẫu nhiên
function startHeartCreation() {
    if (!heartCreationActive) return;
    
    createFloatingHeart();
    // Adjust delay based on device
    const nextDelay = isMobile() ? 
        Math.random() * 3000 + 2000 : // 2-5 giây trên mobile
        Math.random() * 2000 + 1000;  // 1-3 giây trên desktop
    setTimeout(startHeartCreation, nextDelay);
}

// Bắt đầu animation
function initFloatingHearts() {
    if (heartCreationActive) return; // Tránh duplicate
    
    heartCreationActive = true;
    
    // Tạo hearts ban đầu - ít hơn trên mobile
    const initialHearts = isMobile() ? 2 : 3;
    for (let i = 0; i < initialHearts; i++) {
        setTimeout(() => createFloatingHeart(), i * 500);
    }
    
    // Bắt đầu tạo hearts liên tục
    setTimeout(() => {
        startHeartCreation();
    }, 2000);
}

// Dừng animation (nếu cần)
function stopFloatingHearts() {
    heartCreationActive = false;
    const hearts = document.querySelectorAll('.heart');
    hearts.forEach(heart => heart.remove());
}

// Auto start khi DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Delay một chút để đảm bảo trang đã load xong
    setTimeout(initFloatingHearts, 1000);
});

// Cleanup khi page unload
window.addEventListener('beforeunload', function() {
    stopFloatingHearts();
});
