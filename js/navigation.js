// Navigation logic để xử lý back button
function setupBackButton() {
    const backButton = document.getElementById('back-to-dashboard-btn');
    if (!backButton) return;

    // Lấy tham số URL để xác định nguồn gốc
    const urlParams = new URLSearchParams(window.location.search);
    const from = urlParams.get('from');

    // Xác định link quay lại dựa trên nguồn gốc
    let backUrl;
    if (from === 'him') {
        backUrl = 'him-dashboard.html';
    } else {
        // Mặc định quay về her-dashboard (tương thích ngược)
        backUrl = 'her-dashboard.html';
    }

    // Cập nhật href của nút back
    backButton.href = backUrl;
    
    // Thêm event listener để log (debug)
    backButton.addEventListener('click', function(e) {
        console.log(`Navigating back to: ${backUrl} (from: ${from || 'default'})`);
    });
}

// Chạy khi DOM loaded
document.addEventListener('DOMContentLoaded', setupBackButton);
