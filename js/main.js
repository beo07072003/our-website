// // Chờ cho toàn bộ nội dung HTML được tải xong
// window.addEventListener('DOMContentLoaded', () => {
//     if (typeof db === 'undefined') {
//         console.error("Firebase chưa được khởi tạo! Hãy kiểm tra lại đoạn mã trong HTML.");
//         return;
//     }

//     const herDataRef = db.collection('userInfo').doc('herData');

//     herDataRef.get().then((doc) => {
//         if (doc.exists) {
//             const data = doc.data();
//             runLoveCounter(data);
//             runCountdown(data);
//             runPeriodCalendar(data, 'period-calendar-widget', 'month-year-title-dash', 'calendar-days-grid-dash', 'prev-month-btn-dash', 'next-month-btn-dash', false);
//             runFullPeriodCalendar(data);
//             runSchedulePage(data);
//         } else {
//             console.error("Lỗi: Không tìm thấy document 'herData'!");
//         }
//     }).catch((error) => {
//         console.error("Lỗi khi lấy dữ liệu từ Firestore:", error);
//         alert("Đã xảy ra lỗi khi kết nối tới cơ sở dữ liệu.");
//     });
// });

// // ===================================================================
// // CÁC HÀM CHO DASHBOARD VÀ LỊCH DÂU
// // ===================================================================

// function runLoveCounter(data) {
//     const loveDaysElement = document.getElementById('love-days');
//     if (!loveDaysElement || !data.startDate) return;
//     const startDate = data.startDate.toDate();
//     const today = new Date();
//     const timeDiff = today.getTime() - startDate.getTime();
//     const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
//     loveDaysElement.innerText = daysDiff;
// }

// function runCountdown(data) {
//     const countdownContainerDash = document.getElementById('countdown-timer');
//     if (!countdownContainerDash || !data.specialDate) return;
//     const targetDate = data.specialDate.toDate();
//     const daysSpan = document.getElementById('countdown-days');
//     const hoursSpan = document.getElementById('countdown-hours');
//     const minutesSpan = document.getElementById('countdown-minutes');
//     const secondsSpan = document.getElementById('countdown-seconds');

//     const interval = setInterval(() => {
//         const now = new Date().getTime();
//         const distance = targetDate - now;
//         if (distance < 0) {
//             clearInterval(interval);
//             countdownContainerDash.innerHTML = "<span class='card-countdown-finished'>Chúc Mừng Ngày Đặc Biệt!</span>";
//             return;
//         }
//         const days = Math.floor(distance / (1000 * 60 * 60 * 24));
//         const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//         const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//         const seconds = Math.floor((distance % (1000 * 60)) / 1000);
//         if (daysSpan) daysSpan.innerText = String(days).padStart(2, '0');
//         if (hoursSpan) hoursSpan.innerText = String(hours).padStart(2, '0');
//         if (minutesSpan) minutesSpan.innerText = String(minutes).padStart(2, '0');
//         if (secondsSpan) secondsSpan.innerText = String(seconds).padStart(2, '0');
//     }, 1000);
// }

// function runPeriodCalendar(data, containerId, titleId, gridId, prevBtnId, nextBtnId, allowEditing) {
//     const calendarElement = document.getElementById(containerId);
//     if (!calendarElement || !data.lastPeriodStartDate) return;
//     const lastPeriodStartDate = data.lastPeriodStartDate.toDate();
//     const cycleLength = data.cycleLength;
//     const periodDuration = data.periodDuration;
//     const monthYearTitle = document.getElementById(titleId);
//     const calendarGrid = document.getElementById(gridId);
//     const prevMonthBtn = document.getElementById(prevBtnId);
//     const nextMonthBtn = document.getElementById(nextBtnId);
//     let currentDate = new Date();

//     function generateCalendar(date) {
//         if (!calendarGrid) return;
//         calendarGrid.innerHTML = '';
//         const year = date.getFullYear();
//         const month = date.getMonth();
//         if (monthYearTitle) monthYearTitle.innerText = `Tháng ${month + 1} ${year}`;
//         const firstDayOfMonth = new Date(year, month, 1);
//         const daysInMonth = new Date(year, month + 1, 0).getDate();
//         let startingDay = firstDayOfMonth.getDay();
//         if (startingDay === 0) startingDay = 7;
//         for (let i = 1; i < startingDay; i++) {
//             const emptyCell = document.createElement('div');
//             emptyCell.classList.add('day-cell', 'empty-day');
//             calendarGrid.appendChild(emptyCell);
//         }
//         const periodDays = new Set();
//         let currentPeriodStart = new Date(lastPeriodStartDate);
//         while (currentPeriodStart > new Date(year, month - 1, 1)) {
//             currentPeriodStart.setDate(currentPeriodStart.getDate() - cycleLength);
//         }
//         while (currentPeriodStart < new Date(year, month + 2, 1)) {
//             for (let i = 0; i < periodDuration; i++) {
//                 const periodDate = new Date(currentPeriodStart);
//                 periodDate.setDate(periodDate.getDate() + i);
//                 periodDays.add(periodDate.toDateString());
//             }
//             currentPeriodStart.setDate(currentPeriodStart.getDate() + cycleLength);
//         }
//         const today = new Date();
//         for (let day = 1; day <= daysInMonth; day++) {
//             const dayCell = document.createElement('div');
//             dayCell.classList.add('day-cell');
//             dayCell.innerText = day;
//             const thisDate = new Date(year, month, day);
//             if (allowEditing) {
//                 dayCell.style.cursor = "pointer";
//                 dayCell.title = "Nhấn để đặt làm ngày bắt đầu chu kỳ mới";
//                 dayCell.addEventListener('click', () => openEditModal(thisDate));
//             }
//             if (thisDate.toDateString() === today.toDateString()) {
//                 dayCell.classList.add('today');
//             }
//             if (periodDays.has(thisDate.toDateString())) {
//                 dayCell.classList.add('period-day');
//             }
//             calendarGrid.appendChild(dayCell);
//         }
//     }
//     if (prevMonthBtn) prevMonthBtn.addEventListener('click', () => {
//         currentDate.setMonth(currentDate.getMonth() - 1);
//         generateCalendar(currentDate);
//     });
//     if (nextMonthBtn) nextMonthBtn.addEventListener('click', () => {
//         currentDate.setMonth(currentDate.getMonth() + 1);
//         generateCalendar(currentDate);
//     });
//     generateCalendar(currentDate);
// }

// function runFullPeriodCalendar(data) {
//     runPeriodCalendar(data, 'full-period-calendar', 'month-year-title-full', 'calendar-days-grid-full', 'prev-month-btn-full', 'next-month-btn-full', true);
// }


// // ===================================================================
// // CÁC HÀM CHO TRANG LỊCH TUẦN
// // ===================================================================

// function runSchedulePage(data) {
//     const scheduleGrid = document.getElementById('schedule-grid');
//     if (!scheduleGrid) return;
//     const scheduleData = data.schedule || [];
//     drawScheduleGrid(scheduleGrid);
//     renderEvents(scheduleData, scheduleGrid);
//     setupRobustGridClickListener(scheduleGrid);
// }

// function drawScheduleGrid(gridElement) {
//     gridElement.innerHTML = '';
//     const days = ['', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
//     const timeSlots = ['7-9h', '9-11h', '11-13h', '13-15h', '15-17h', '17-19h', '19-21h', '21-23h'];
//     days.forEach(day => {
//         const dayCell = document.createElement('div');
//         dayCell.className = 'day-header';
//         dayCell.innerText = day;
//         gridElement.appendChild(dayCell);
//     });
//     timeSlots.forEach(slot => {
//         const timeCell = document.createElement('div');
//         timeCell.className = 'time-slot';
//         timeCell.innerText = slot;
//         gridElement.appendChild(timeCell);
//         for (let j = 2; j <= 8; j++) {
//             const cell = document.createElement('div');
//             cell.className = 'grid-cell';
//             cell.dataset.day = j;
//             cell.dataset.time = `${parseInt(slot.split('-')[0])}:00`;
//             gridElement.appendChild(cell);
//         }
//     });
// }

// function renderEvents(events, gridElement) {
//     gridElement.querySelectorAll('.event-block').forEach(el => el.remove());
    
//     // Các giá trị này PHẢI KHỚP với CSS
//     const headerHeight = 50;  // chiều cao hàng header
//     const rowHeight = 80;     // chiều cao mỗi hàng giờ
//     const hourHeight = rowHeight / 2; // Chiều cao tương ứng với 1 giờ (vì mỗi hàng là 2 tiếng)

//     events.forEach(event => {
//         const eventBlock = document.createElement('div');
//         eventBlock.className = 'event-block';
//         eventBlock.innerText = event.title;
//         eventBlock.style.backgroundColor = event.color;

//         const [startHour, startMinute] = event.startTime.split(':').map(Number);
//         const [endHour, endMinute] = event.endTime.split(':').map(Number);

//         const totalStartMinutes = (startHour * 60 + startMinute) - (7 * 60);
//         const topPosition = (totalStartMinutes / 60) * hourHeight + headerHeight;
        
//         const totalDurationMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
//         const eventHeight = (totalDurationMinutes / 60) * hourHeight;

//         const dayIndex = parseInt(event.day) - 2;
//         const timeColumnWidth = 80;
//         const dayColumnWidth = (gridElement.offsetWidth - timeColumnWidth) / 7;
//         const leftPosition = timeColumnWidth + (dayIndex * dayColumnWidth);
        
//         eventBlock.style.top = `${topPosition}px`;
//         eventBlock.style.height = `${eventHeight - 2}px`;
//         eventBlock.style.left = `${leftPosition}px`;
//         eventBlock.style.width = `${dayColumnWidth - 4}px`;
        
//         eventBlock.addEventListener('click', (e) => {
//             e.stopPropagation();
//             openEventModal(event);
//         });

//         gridElement.appendChild(eventBlock);
//     });
// }

// function setupRobustGridClickListener(gridElement) {
//     if (!gridElement) return;

//     let startX, startY;
//     const dragThreshold = 10; // Ngưỡng di chuyển để coi là DRAG

//     gridElement.addEventListener('mousedown', (e) => {
//         // Ghi lại vị trí bắt đầu
//         startX = e.clientX;
//         startY = e.clientY;
//     });

//     gridElement.addEventListener('mouseup', (e) => {
//         const endX = e.clientX;
//         const endY = e.clientY;

//         // Kiểm tra xem có phải là hành động kéo chuột không
//         if (Math.abs(endX - startX) > dragThreshold || Math.abs(endY - startY) > dragThreshold) {
//             return; 
//         }

//         // Bỏ qua nếu click vào một sự kiện đã có
//         if (e.target.classList.contains('event-block')) {
//             return;
//         }

//         // --- TÍNH TOÁN TỌA ĐỘ CHÍNH XÁC ---
//         const gridRect = gridElement.getBoundingClientRect(); // Lấy thông tin vị trí của toàn bộ lưới lịch
//         const x = e.clientX - gridRect.left; // Tọa độ X so với mép trái của LƯỚI
//         const y = e.clientY - gridRect.top;  // Tọa độ Y so với mép trên của LƯỚI

//         // Các hằng số kích thước (PHẢI KHỚP với CSS)
//         const headerHeight = 50;
//         const timeColumnWidth = 80;
//         const rowHeight = 80;

//         // Bây giờ, kiểm tra với tọa độ đã được tính toán lại
//         if (y > headerHeight && x > timeColumnWidth) {
//             const dayColumnWidth = (gridElement.offsetWidth - timeColumnWidth) / 7;
            
//             // Tính toán ngày và giờ dựa trên tọa độ mới
//             const dayIndex = Math.floor((x - timeColumnWidth) / dayColumnWidth);
//             const timeIndex = Math.floor((y - headerHeight) / rowHeight);

//             const day = dayIndex + 2;
//             const startHour = 7 + (timeIndex * 2);
//             const time = `${String(startHour).padStart(2, '0')}:00`;

//             // Mở cửa sổ và điền thông tin
//             openEventModal();
//             document.getElementById('event-day-select').value = day;
//             document.getElementById('event-start-time-input').value = time;
//         }
//     });
// }


// // ===================================================================
// // CÁC HÀM XỬ LÝ CỬA SỔ POP-UP (MODAL)
// // ===================================================================

// let currentEventId = null;

// function openEditModal(date) {
//     const modal = document.getElementById('edit-modal');
//     if (!modal) return;
//     const dateInput = document.getElementById('new-period-date-input');
//     dateInput.value = date.toISOString().split('T')[0];
//     modal.classList.add('visible');
// }

// function openEventModal(event = null) {
//     const modal = document.getElementById('event-modal');
//     if (!modal) return;
//     const title = document.getElementById('modal-title');
//     const titleInput = document.getElementById('event-title-input');
//     const daySelect = document.getElementById('event-day-select');
//     const colorInput = document.getElementById('event-color-input');
//     const startTimeInput = document.getElementById('event-start-time-input');
//     const endTimeInput = document.getElementById('event-end-time-input');
//     const deleteButton = document.getElementById('delete-event-button');
//     if (event) {
//         title.innerText = 'Sửa Sự Kiện';
//         currentEventId = event.id;
//         titleInput.value = event.title;
//         daySelect.value = event.day;
//         colorInput.value = event.color;
//         startTimeInput.value = event.startTime;
//         endTimeInput.value = event.endTime;
//         deleteButton.style.display = 'inline-block';
//     } else {
//         title.innerText = 'Thêm Sự Kiện Mới';
//         currentEventId = null;
//         titleInput.value = '';
//         colorInput.value = '#FFC0CB';
//         deleteButton.style.display = 'none';
//     }
//     modal.classList.add('visible');
// }

// // --- GẮN SỰ KIỆN CHO CÁC NÚT BẤM CỦA TẤT CẢ MODAL ---

// document.getElementById('cancel-button')?.addEventListener('click', () => {
//     document.getElementById('edit-modal').classList.remove('visible');
// });
// document.getElementById('save-button')?.addEventListener('click', () => {
//     const dateInput = document.getElementById('new-period-date-input');
//     const newDate = new Date(dateInput.value);
//     const correctedDate = new Date(newDate.getTime() + (newDate.getTimezoneOffset() * 60000));
//     if (!isNaN(correctedDate.getTime())) saveNewDateToFirestore(correctedDate);
// });

// function saveNewDateToFirestore(newDate) {
//     const herDataRef = db.collection('userInfo').doc('herData');
//     herDataRef.update({
//         lastPeriodStartDate: firebase.firestore.Timestamp.fromDate(newDate)
//     }).then(() => {
//         alert("Cập nhật thành công!");
//         location.reload();
//     });
// }

// document.getElementById('cancel-event-button')?.addEventListener('click', () => {
//     document.getElementById('event-modal').classList.remove('visible');
// });
// document.getElementById('delete-event-button')?.addEventListener('click', async () => {
//     if (!currentEventId || !confirm('Bạn có chắc muốn xóa sự kiện này?')) return;
//     const herDataRef = db.collection('userInfo').doc('herData');
//     const doc = await herDataRef.get();
//     const existingSchedule = doc.data().schedule || [];
//     const newSchedule = existingSchedule.filter(event => event.id !== currentEventId);
//     await herDataRef.update({
//         schedule: newSchedule
//     });
//     alert('Đã xóa sự kiện!');
//     location.reload();
// });
// document.getElementById('save-event-button')?.addEventListener('click', async () => {
//     const newEvent = {
//         id: currentEventId || Date.now().toString(),
//         title: document.getElementById('event-title-input').value,
//         day: document.getElementById('event-day-select').value,
//         color: document.getElementById('event-color-input').value,
//         startTime: document.getElementById('event-start-time-input').value,
//         endTime: document.getElementById('event-end-time-input').value,
//     };
//     if (!newEvent.title || !newEvent.startTime || !newEvent.endTime) {
//         alert('Vui lòng điền đủ thông tin!');
//         return;
//     }
//     const herDataRef = db.collection('userInfo').doc('herData');
//     const doc = await herDataRef.get();
//     let schedule = doc.data().schedule || [];
//     if (currentEventId) {
//         schedule = schedule.map(event => event.id === currentEventId ? newEvent : event);
//     } else {
//         schedule.push(newEvent);
//     }
//     await herDataRef.update({
//         schedule: schedule
//     });
//     alert('Đã lưu thành công!');
//     location.reload();
// });