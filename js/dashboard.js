// Chứa các hàm cho trang her-dashboard.html
function runHerDashboard(data) {
    // Chỉ chạy các hàm này nếu các element tương ứng tồn tại trên trang
    runLoveCounter(data);
    runCountdown(data);
    // Chạy widget lịch dâu
    runPeriodCalendar(data, 'period-calendar-widget', 'month-year-title-dash', 'calendar-days-grid-dash', 'prev-month-btn-dash', 'next-month-btn-dash', false);
}

function runLoveCounter(data) {
    const el = document.getElementById('love-days');
    if (!el || !data.startDate) return;
    const startDate = data.startDate.toDate();
    const today = new Date();
    const timeDiff = today.getTime() - startDate.getTime();
    el.innerText = Math.floor(timeDiff / (1000 * 3600 * 24));
}

// NỘI DUNG HOÀN CHỈNH CỦA runCountdown
function runCountdown(data) {
    const countdownContainerDash = document.getElementById('countdown-timer');
    if (!countdownContainerDash || !data.specialDate) return;

    const targetDate = data.specialDate.toDate();
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
        
        // Also update collapsible cards countdown if available
        if (typeof updateCountdownDisplay === 'function') {
            updateCountdownDisplay({
                days: days,
                hours: hours,
                minutes: minutes,
                seconds: seconds
            });
        }
    }, 1000);
}

// NỘI DUNG HOÀN CHỈNH CỦA runPeriodCalendar
function runPeriodCalendar(data, containerId, titleId, gridId, prevBtnId, nextBtnId, allowEditing) {
    const calendarElement = document.getElementById(containerId);
    if (!calendarElement || !data.lastPeriodStartDate) return;

    const lastPeriodStartDate = data.lastPeriodStartDate.toDate();
    const cycleLength = data.cycleLength;
    const periodDuration = data.periodDuration;

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

            if (allowEditing) {
                dayCell.style.cursor = "pointer";
                dayCell.title = "Nhấn để đặt làm ngày bắt đầu chu kỳ mới";
                dayCell.addEventListener('click', () => openEditModal(thisDate));
            }
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

// === Logic cho Lời Mời Hẹn Hò (HÀM BỊ THIẾU) ===
function displayDateInvitation(plan) {
    const card = document.getElementById('date-invitation-card');
    // Chỉ chạy nếu tìm thấy card trên trang
    if (!card) return;

    // Kiểm tra xem có kế hoạch và nó đang hoạt động không
    if (plan && plan.isActive) {
        const date = plan.dateTime.toDate();
        document.getElementById('invitation-title').innerText = plan.title;
        document.getElementById('invitation-time').innerText = `${date.toLocaleDateString('vi-VN')} lúc ${date.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}`;
        document.getElementById('invitation-location').innerText = plan.location;
        document.getElementById('invitation-note').innerText = `"${plan.note}"`;
        
        // Hiện tấm thiệp mời lên
        card.style.display = 'flex'; 
    }
}