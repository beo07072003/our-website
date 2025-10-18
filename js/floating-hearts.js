// === FLOATING HEARTS ANIMATION - OPTIMIZED ===

let heartCount = 0;
const maxHearts = 15; // Giới hạn số hearts để tránh lag
let heartCreationActive = false;

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
    heart.style.fontSize = (Math.random() * 10 + 15) + 'px';
    heart.style.animationDuration = (Math.random() * 4 + 8) + 's'; // Random duration 8-12s
    
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
    const nextDelay = Math.random() * 2000 + 1000; // 1-3 giây
    setTimeout(startHeartCreation, nextDelay);
}

// Bắt đầu animation
function initFloatingHearts() {
    if (heartCreationActive) return; // Tránh duplicate
    
    heartCreationActive = true;
    
    // Tạo hearts ban đầu
    for (let i = 0; i < 3; i++) {
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
