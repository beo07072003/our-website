// Chờ cho toàn bộ nội dung HTML được tải xong rồi mới chạy mã JavaScript
window.addEventListener('DOMContentLoaded', () => {

    // --- LOGIC CHO ĐẾM NGÀY YÊU ---
    const loveDaysElement = document.getElementById('love-days');
    if (loveDaysElement) {
        const startDate = new Date('2025-07-01'); // Thay đổi ngày của bạn
        const today = new Date();
        const timeDiff = today.getTime() - startDate.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
        loveDaysElement.innerText = daysDiff;
    }

    // --- LOGIC CHO ĐẾM NGƯỢC TRÊN DASHBOARD ---
    const countdownContainerDash = document.getElementById('countdown-timer');
    if (countdownContainerDash) {
        const targetDate = new Date('2025-12-24T00:00:00'); // Thay đổi ngày của bạn
        const daysSpan = document.getElementById('countdown-days');
        const hoursSpan = document.getElementById('countdown-hours');
        const minutesSpan = document.getElementById('countdown-minutes');
        const secondsSpan = document.getElementById('countdown-seconds');

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(interval);
                countdownContainerDash.innerHTML = "<span class='card-countdown-finished'>Chúc Mừng Ngày Đặc Biệt!</span>";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if(daysSpan) daysSpan.innerText = String(days).padStart(2, '0');
            if(hoursSpan) hoursSpan.innerText = String(hours).padStart(2, '0');
            if(minutesSpan) minutesSpan.innerText = String(minutes).padStart(2, '0');
            if(secondsSpan) secondsSpan.innerText = String(seconds).padStart(2, '0');
        }, 1000);
    }

    // --- HÀM TẠO LỊCH "DÂU" (DÙNG CHUNG) ---
    function setupPeriodCalendar(containerId, titleId, gridId, prevBtnId, nextBtnId) {
        const calendarElement = document.getElementById(containerId);
        if (!calendarElement) return; // Nếu không tìm thấy container thì dừng lại

        // ===============================================================
        // !! CHỈNH SỬA THÔNG TIN CHU KỲ CỦA BẠN GÁI BẠN Ở ĐÂY !!
        // ===============================================================
        const lastPeriodStartDate = new Date('2025-10-01'); // 1. Ngày bắt đầu của kỳ kinh gần nhất
        const cycleLength = 29;                             // 2. Độ dài trung bình của chu kỳ
        const periodDuration = 7;                           // 3. Kỳ kinh kéo dài trong bao nhiêu ngày
        // ===============================================================

        const monthYearTitle = document.getElementById(titleId);
        const calendarGrid = document.getElementById(gridId);
        const prevMonthBtn = document.getElementById(prevBtnId);
        const nextMonthBtn = document.getElementById(nextBtnId);

        let currentDate = new Date();

        function generateCalendar(date) {
            if (!calendarGrid) return;
            calendarGrid.innerHTML = '';
            const year = date.getFullYear();
            const month = date.getMonth();

            if (monthYearTitle) monthYearTitle.innerText = `Tháng ${month + 1} ${year}`;

            const firstDayOfMonth = new Date(year, month, 1);
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            
            let startingDay = firstDayOfMonth.getDay();
            if (startingDay === 0) startingDay = 7; 

            for (let i = 1; i < startingDay; i++) {
                const emptyCell = document.createElement('div');
                emptyCell.classList.add('day-cell', 'empty-day');
                calendarGrid.appendChild(emptyCell);
            }

            const periodDays = new Set();
            let currentPeriodStart = new Date(lastPeriodStartDate);
            
            while(currentPeriodStart > new Date(year, month - 1, 1)) {
                currentPeriodStart.setDate(currentPeriodStart.getDate() - cycleLength);
            }
            
            while(currentPeriodStart < new Date(year, month + 2, 1)) {
                 for (let i = 0; i < periodDuration; i++) {
                    const periodDate = new Date(currentPeriodStart);
                    periodDate.setDate(periodDate.getDate() + i);
                    periodDays.add(periodDate.toDateString());
                }
                currentPeriodStart.setDate(currentPeriodStart.getDate() + cycleLength);
            }

            const today = new Date();
            for (let day = 1; day <= daysInMonth; day++) {
                const dayCell = document.createElement('div');
                dayCell.classList.add('day-cell');
                dayCell.innerText = day;

                const thisDate = new Date(year, month, day);

                if (thisDate.toDateString() === today.toDateString()) {
                    dayCell.classList.add('today');
                }
                
                if (periodDays.has(thisDate.toDateString())) {
                    dayCell.classList.add('period-day');
                }
                calendarGrid.appendChild(dayCell);
            }
        }
        
        if (prevMonthBtn) prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            generateCalendar(currentDate);
        });

        if (nextMonthBtn) nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            generateCalendar(currentDate);
        });

        generateCalendar(currentDate);
    }

    // --- GỌI HÀM TẠO LỊCH CHO DASHBOARD ---
    setupPeriodCalendar(
        'period-calendar-widget',       // ID của container trên dashboard
        'month-year-title-dash',      // ID của tiêu đề tháng/năm
        'calendar-days-grid-dash',    // ID của lưới ngày
        'prev-month-btn-dash',        // ID của nút lùi
        'next-month-btn-dash'         // ID của nút tiến
    );

    // --- GỌI HÀM TẠO LỊCH CHO TRANG CHI TIẾT ---
    setupPeriodCalendar(
        'full-period-calendar',       // ID của container trên trang chi tiết
        'month-year-title-full',      // ID của tiêu đề tháng/năm
        'calendar-days-grid-full',    // ID của lưới ngày
        'prev-month-btn-full',        // ID của nút lùi
        'next-month-btn-full'         // ID của nút tiến
    );

});