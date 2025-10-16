// Chờ cho toàn bộ nội dung HTML được tải xong rồi mới chạy mã JavaScript
window.addEventListener('DOMContentLoaded', () => {

    // --- LOGIC CHO TRANG ĐẾM NGÀY YÊU ---
    const loveDaysElement = document.getElementById('love-days');

    // Chỉ chạy code này nếu tìm thấy phần tử có id='love-days' (tức là đang ở trang love-counter.html)
    if (loveDaysElement) {
        // !! THAY ĐỔI NGÀY BẮT ĐẦU CỦA BẠN Ở ĐÂY !!
        const startDate = new Date('2023-01-20'); // Format: 'Năm-Tháng-Ngày'

        const today = new Date();
        const timeDiff = today.getTime() - startDate.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

        loveDaysElement.innerText = daysDiff;
    }


    // --- LOGIC CHO TRANG ĐẾM NGƯỢC SỰ KIỆN ---
    const countdownContainer = document.getElementById('countdown-timer');

    // Chỉ chạy code này nếu tìm thấy phần tử có id='countdown-timer' (tức là đang ở trang countdown.html)
    if (countdownContainer) {
        // !! THAY ĐỔI NGÀY SỰ KIỆN CỦA BẠN Ở ĐÂY !!
        const targetDate = new Date('2025-12-24T00:00:00'); // Format: 'Năm-Tháng-NgàyTGiờ:Phút:Giây'

        const daysSpan = document.getElementById('days');
        const hoursSpan = document.getElementById('hours');
        const minutesSpan = document.getElementById('minutes');
        const secondsSpan = document.getElementById('seconds');

        // Cập nhật bộ đếm mỗi giây
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(interval);
                countdownContainer.innerText = "Chúc Mừng Ngày Đặc Biệt!";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            daysSpan.innerText = String(days).padStart(2, '0');
            hoursSpan.innerText = String(hours).padStart(2, '0');
            minutesSpan.innerText = String(minutes).padStart(2, '0');
            secondsSpan.innerText = String(seconds).padStart(2, '0');

        }, 1000);
    }

});