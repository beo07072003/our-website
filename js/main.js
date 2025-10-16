// Chờ cho toàn bộ nội dung HTML được tải xong rồi mới chạy mã JavaScript
window.addEventListener('DOMContentLoaded', () => {

    // --- LOGIC CHO TRANG ĐẾM NGÀY YÊU ---
    const loveDaysElement = document.getElementById('love-days');
    if (loveDaysElement) {
        // !! THAY ĐỔI NGÀY BẮT ĐẦU CỦA BẠN Ở ĐÂY !!
        const startDate = new Date('2023-01-20'); // Format: 'Năm-Tháng-Ngày'

        const today = new Date();
        const timeDiff = today.getTime() - startDate.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
        loveDaysElement.innerText = daysDiff;
    }


    // --- LOGIC CHO TRANG LỊCH THEO DÕI CHU KỲ ---
    const calendarElement = document.getElementById('period-calendar');
    if (calendarElement) {
        // ===============================================================
        // !! CHỈNH SỬA THÔNG TIN CHU KỲ CỦA BẠN GÁI BẠN Ở ĐÂY !!
        // ===============================================================
        const lastPeriodStartDate = new Date('2025-10-01'); // 1. Ngày bắt đầu của kỳ kinh gần nhất
        const cycleLength = 29;                             // 2. Độ dài trung bình của chu kỳ (ví dụ: 28 ngày)
        const periodDuration = 7;                           // 3. Kỳ kinh kéo dài trong bao nhiêu ngày (ví dụ: 5 ngày)
        // ===============================================================

        const monthYearTitle = document.getElementById('month-year-title');
        const calendarGrid = document.getElementById('calendar-days-grid');
        const prevMonthBtn = document.getElementById('prev-month-btn');
        const nextMonthBtn = document.getElementById('next-month-btn');

        let currentDate = new Date();

        function generateCalendar(date) {
            calendarGrid.innerHTML = ''; // Xóa lịch cũ
            const year = date.getFullYear();
            const month = date.getMonth(); // 0-11

            monthYearTitle.innerText = `Tháng ${month + 1} ${year}`;

            const firstDayOfMonth = new Date(year, month, 1);
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            
            // Lấy ngày trong tuần của ngày đầu tiên (0=CN, 1=T2, ..., 6=T7)
            let startingDay = firstDayOfMonth.getDay();
            if (startingDay === 0) startingDay = 7; // Chuyển Chủ Nhật về cuối tuần

            // Tạo các ô trống cho đầu tháng
            for (let i = 1; i < startingDay; i++) {
                const emptyCell = document.createElement('div');
                emptyCell.classList.add('day-cell', 'empty-day');
                calendarGrid.appendChild(emptyCell);
            }

            // Tính toán tất cả các ngày "dâu"
            const periodDays = new Set();
            let currentPeriodStart = new Date(lastPeriodStartDate);
            
            // Lùi về các kỳ trước để bao phủ cả tháng trước đó
            while(currentPeriodStart > new Date(year, month - 1, 1)) {
                currentPeriodStart.setDate(currentPeriodStart.getDate() - cycleLength);
            }
            
            // Tiến tới các kỳ sau để bao phủ tháng hiện tại và tháng sau
            while(currentPeriodStart < new Date(year, month + 2, 1)) {
                 for (let i = 0; i < periodDuration; i++) {
                    const periodDate = new Date(currentPeriodStart);
                    periodDate.setDate(periodDate.getDate() + i);
                    periodDays.add(periodDate.toDateString());
                }
                currentPeriodStart.setDate(currentPeriodStart.getDate() + cycleLength);
            }

            // Tạo các ô ngày trong tháng
            const today = new Date();
            for (let day = 1; day <= daysInMonth; day++) {
                const dayCell = document.createElement('div');
                dayCell.classList.add('day-cell');
                dayCell.innerText = day;

                const thisDate = new Date(year, month, day);

                // Đánh dấu ngày hôm nay
                if (thisDate.toDateString() === today.toDateString()) {
                    dayCell.classList.add('today');
                }
                
                // Đánh dấu ngày "dâu"
                if (periodDays.has(thisDate.toDateString())) {
                    dayCell.classList.add('period-day');
                }

                calendarGrid.appendChild(dayCell);
            }
        }
        
        // Nút chuyển tháng
        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            generateCalendar(currentDate);
        });

        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            generateCalendar(currentDate);
        });

        // Hiển thị lịch lần đầu tiên
        generateCalendar(currentDate);
    }
});