// Chứa toàn bộ các hàm cho trang schedule.html

function runSchedulePage(data) {
    const scheduleGrid = document.getElementById('schedule-grid');
    if (!scheduleGrid) return; // Chỉ chạy khi ở đúng trang

    const scheduleData = data.schedule || [];

    // Tự động kiểm tra kích thước màn hình để chọn giao diện phù hợp
    if (window.innerWidth <= 768) {
        // Nếu là màn hình nhỏ (iPhone), vẽ giao diện di động
        renderMobileSchedule(scheduleData, scheduleGrid);
    } else {
        // Nếu là màn hình lớn, vẽ giao diện lưới như cũ
        drawScheduleGrid(scheduleGrid);
        renderEvents(scheduleData, scheduleGrid);
        setupRobustGridClickListener(scheduleGrid);
    }
}

// === HÀM VẼ GIAO DIỆN CHO DI ĐỘNG ===
function renderMobileSchedule(events, container) {
    container.innerHTML = ''; // Xóa lưới cũ
    container.className = 'schedule-mobile-container'; // Đổi class để áp dụng style mới

    // Sắp xếp sự kiện theo ngày và giờ (tạo bản sao để không thay đổi mảng gốc)
    const sortedEvents = [...events].sort((a, b) => {
        if (a.day !== b.day) return a.day - b.day;
        return a.startTime.localeCompare(b.startTime);
    });

    const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];
    let renderedDays = new Set(); // Theo dõi những ngày đã được render

    sortedEvents.forEach(event => {
        // Nếu sang ngày mới, tạo một card ngày mới
        if (!renderedDays.has(event.day)) {
            renderedDays.add(event.day);
            const dayCard = document.createElement('div');
            dayCard.className = 'mobile-day-card';
            dayCard.dataset.day = event.day; // Thêm dataset để dễ tìm
            dayCard.innerHTML = `<h2>${days[event.day - 2]}</h2>`;
            container.appendChild(dayCard);
        }

        // Tạo mục sự kiện
        const eventItem = document.createElement('div');
        eventItem.className = 'mobile-event-item';
        eventItem.style.borderLeftColor = event.color; // Dùng màu làm điểm nhấn

        eventItem.innerHTML = `
            <div class="event-time">${event.startTime} - ${event.endTime}</div>
            <div class="event-title">${event.title}</div>
        `;
        
        // Gắn sự kiện click để sửa
        eventItem.addEventListener('click', () => openEventModal(event));

        // Thêm sự kiện vào card của ngày tương ứng
        container.querySelector(`.mobile-day-card[data-day='${event.day}']`).appendChild(eventItem);
    });

    // Thêm nút "Thêm sự kiện" nổi
    const fab = document.createElement('button');
    fab.id = 'add-event-fab';
    fab.innerText = '+';
    fab.title = 'Thêm sự kiện mới';
    fab.addEventListener('click', () => openEventModal());
    document.body.appendChild(fab);
}

// --- CÁC HÀM CHO GIAO DIỆN MÁY TÍNH ---
function drawScheduleGrid(gridElement) {
    gridElement.innerHTML = '';
    const days = ['Time', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
    const timeSlots = ['7-9h', '9-11h', '11-13h', '13-15h', '15-17h', '17-19h', '19-21h', '21-23h'];
    days.forEach(day => {
        const dayCell = document.createElement('div');
        dayCell.className = 'day-header';
        dayCell.innerText = day;
        gridElement.appendChild(dayCell);
    });
    timeSlots.forEach(slot => {
        const timeCell = document.createElement('div');
        timeCell.className = 'time-slot';
        timeCell.innerText = slot;
        gridElement.appendChild(timeCell);
        for (let j = 2; j <= 8; j++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.day = j;
            cell.dataset.time = `${parseInt(slot.split('-')[0])}:00`;
            
            // Icons are now handled by CSS nth-child selectors
            
            gridElement.appendChild(cell);
        }
    });
}

function renderEvents(events, gridElement) {
    gridElement.querySelectorAll('.event-block').forEach(el => el.remove());
    
    // Các giá trị này PHẢI KHỚP với CSS
    const headerHeight = 50;
    const rowHeight = 80;
    const hourHeight = rowHeight / 2; // Chiều cao tương ứng với 1 giờ

    events.forEach(event => {
        const eventBlock = document.createElement('div');
        eventBlock.className = 'event-block';
        
        // Set data-id attribute for event identification
        if (event.id) {
            eventBlock.dataset.id = event.id;
            eventBlock.setAttribute('data-id', event.id);
        }
        
        // Tạo HTML structure với title và time
        eventBlock.innerHTML = `
            <div class="event-title">${event.title}</div>
            <div class="event-time">${event.startTime} - ${event.endTime}</div>
        `;
        eventBlock.style.backgroundColor = event.color;

        const [startHour, startMinute] = event.startTime.split(':').map(Number);
        const [endHour, endMinute] = event.endTime.split(':').map(Number);

        const totalStartMinutes = (startHour * 60 + startMinute) - (7 * 60);
        const topPosition = (totalStartMinutes / 60) * hourHeight + headerHeight;
        
        const totalDurationMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
        const eventHeight = (totalDurationMinutes / 60) * hourHeight;

        const dayIndex = parseInt(event.day) - 2;
        const timeColumnWidth = 80;
        const dayColumnWidth = (gridElement.offsetWidth - timeColumnWidth) / 7;
        const leftPosition = timeColumnWidth + (dayIndex * dayColumnWidth);
        
        eventBlock.style.top = `${topPosition}px`;
        eventBlock.style.height = `${Math.max(eventHeight - 2, 32)}px`;
        eventBlock.style.left = `${leftPosition}px`;
        eventBlock.style.width = `${dayColumnWidth - 4}px`;
        
        eventBlock.addEventListener('click', (e) => {
            e.stopPropagation();
            openEventModal(event);
        });

        gridElement.appendChild(eventBlock);
    });
}


// === HÀM XỬ LÝ CLICK ĐÃ GẮN "CAMERA GIÁM SÁT" CHI TIẾT ===
function setupRobustGridClickListener(gridElement) {
    if (!gridElement) return;

    let startX, startY;
    const dragThreshold = 10;

    console.log("Hệ thống lắng nghe click trên lịch đã sẵn sàng (phiên bản giám định).");

    gridElement.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        startY = e.clientY;
    });

    gridElement.addEventListener('mouseup', (e) => {
        const endX = e.clientX;
        const endY = e.clientY;

        if (Math.abs(endX - startX) > dragThreshold || Math.abs(endY - startY) > dragThreshold) {
            return;
        }
        if (e.target.classList.contains('event-block')) {
            return;
        }

        // console.log("--- BẮT ĐẦU GIÁM ĐỊNH CÚ CLICK ---");

        const gridRect = gridElement.getBoundingClientRect();
        const x = e.clientX - gridRect.left;
        const y = e.clientY - gridRect.top;

        // console.log(`Tọa độ click (so với lưới): X=${x.toFixed(2)}, Y=${y.toFixed(2)}`);
        
        const headerHeight = 50;
        const timeColumnWidth = 80;
        const rowHeight = 80;

        // console.log(`Đang kiểm tra với điều kiện: Y > ${headerHeight} và X > ${timeColumnWidth}`);

        if (y > headerHeight && x > timeColumnWidth) {
            // console.log("=> Điều kiện HỢP LỆ. Bắt đầu tính toán ô...");

            const dayColumnWidth = (gridElement.offsetWidth - timeColumnWidth) / 7;
            const dayIndex = Math.floor((x - timeColumnWidth) / dayColumnWidth);
            const timeIndex = Math.floor((y - headerHeight) / rowHeight);

            // console.log(`Chiều rộng cột ngày (tính toán): ${dayColumnWidth.toFixed(2)}px`);
            // console.log(`Chỉ số cột (dayIndex): ${dayIndex}`);
            // console.log(`Chỉ số hàng (timeIndex): ${timeIndex}`);
            
            if (dayIndex < 0 || dayIndex > 6 || timeIndex < 0 || timeIndex > 7) {
                console.error("LỖI TÍNH TOÁN: Chỉ số hàng hoặc cột nằm ngoài phạm vi. Click bị hủy.");
                return;
            }

            const day = dayIndex + 2;
            const startHour = 7 + (timeIndex * 2);
            const time = `${String(startHour).padStart(2, '0')}:00`;
            
            // console.log(`=> Kết quả: Ngày=${day}, Giờ=${time}. Đang mở cửa sổ...`);

            openEventModal();
            document.getElementById('event-day-select').value = day;
            document.getElementById('event-start-time-input').value = time;
        } else {
            console.error("LỖI: Điều kiện KHÔNG HỢP LỆ. Click được coi là nằm ngoài lưới chính.");
        }
        // console.log("--- KẾT THÚC GIÁM ĐỊNH ---");
    });
}


// === Các hàm xử lý Modal của Lịch Tuần ===
let currentEventId = null;

function openEventModal(event = null) {
    const modal = document.getElementById('event-modal');
    if (!modal) return;
    const title = document.getElementById('modal-title');
    const titleInput = document.getElementById('event-title-input');
    const daySelect = document.getElementById('event-day-select');
    const colorInput = document.getElementById('event-color-input');
    const startTimeInput = document.getElementById('event-start-time-input');
    const endTimeInput = document.getElementById('event-end-time-input');
    const deleteButton = document.getElementById('delete-event-button');
    
    if (event) { // Chế độ Sửa
        title.innerText = 'Sửa Sự Kiện';
        currentEventId = event.id;
        titleInput.value = event.title;
        daySelect.value = event.day;
        colorInput.value = event.color;
        startTimeInput.value = event.startTime;
        endTimeInput.value = event.endTime;
        deleteButton.style.display = 'inline-block';
    } else { // Chế độ Thêm mới
        title.innerText = 'Thêm Sự Kiện Mới';
        currentEventId = null;
        titleInput.value = '';
        colorInput.value = '#FFC0CB';
        startTimeInput.value = '';
        endTimeInput.value = '';
        deleteButton.style.display = 'none';
    }
    modal.classList.add('visible');
}

// Gắn sự kiện cho các nút trong modal LỊCH TUẦN
document.addEventListener('DOMContentLoaded', () => {
    // console.log('📅 Schedule page loaded');
    // console.log('🔍 showSuccess function available:', typeof showSuccess);
    // console.log('🔍 showWarning function available:', typeof showWarning);
    // console.log('🔍 notifications object available:', typeof window.notifications);
    
    // Đợi một chút để đảm bảo notifications.js đã load xong
    setTimeout(() => {
        // console.log('🔍 After delay - showSuccess function available:', typeof showSuccess);
        // console.log('🔍 After delay - showWarning function available:', typeof showWarning);
        // console.log('🔍 After delay - notifications object available:', typeof window.notifications);
    }, 1000);
});

document.getElementById('cancel-event-button')?.addEventListener('click', () => {
    document.getElementById('event-modal').classList.remove('visible');
});

document.getElementById('delete-event-button')?.addEventListener('click', async () => {
    // console.log('🗑️ Delete button clicked');
    // console.log('🔍 showSuccess function available:', typeof showSuccess);
    // console.log('🔍 showWarning function available:', typeof showWarning);
    
    if (!currentEventId) return;
    
    // Hiển thị thông báo xác nhận đẹp thay vì confirm()
    const confirmed = await showConfirmDialog('Xác nhận xóa', 'Bạn có chắc muốn xóa sự kiện này?');
    if (!confirmed) return;
    
    const herDataRef = db.collection('userInfo').doc('herData');
    const doc = await herDataRef.get();
    const existingSchedule = doc.data().schedule || [];
    const newSchedule = existingSchedule.filter(event => event.id !== currentEventId);
    
    await herDataRef.update({ schedule: newSchedule });
    
    // Fallback nếu showSuccess không có sẵn
    if (typeof showSuccess === 'function') {
        showSuccess('Đã xóa sự kiện!');
    } else if (typeof window.notifications === 'object' && window.notifications.success) {
        window.notifications.success('Đã xóa sự kiện!');
    } else {
        console.error('❌ Không thể hiển thị thông báo thành công');
        alert('Đã xóa sự kiện!');
    }
    location.reload();
});

document.getElementById('save-event-button')?.addEventListener('click', async () => {
    // console.log('💾 Save button clicked');
    // console.log('🔍 showSuccess function available:', typeof showSuccess);
    // console.log('🔍 showWarning function available:', typeof showWarning);
    
    const newEvent = {
        id: currentEventId || Date.now().toString(),
        title: document.getElementById('event-title-input').value,
        day: document.getElementById('event-day-select').value,
        color: document.getElementById('event-color-input').value,
        startTime: document.getElementById('event-start-time-input').value,
        endTime: document.getElementById('event-end-time-input').value,
    };

    if (!newEvent.title || !newEvent.startTime || !newEvent.endTime) {
        // Fallback nếu showWarning không có sẵn
        if (typeof showWarning === 'function') {
            showWarning('Vui lòng điền đủ thông tin!');
        } else if (typeof window.notifications === 'object' && window.notifications.warning) {
            window.notifications.warning('Vui lòng điền đủ thông tin!');
        } else {
            console.error('❌ Không thể hiển thị thông báo cảnh báo');
            alert('Vui lòng điền đủ thông tin!');
        }
        return;
    }

    const herDataRef = db.collection('userInfo').doc('herData');
    const doc = await herDataRef.get();
    let schedule = doc.data().schedule || [];

    if (currentEventId) { // Nếu là sửa, thay thế sự kiện cũ
        schedule = schedule.map(event => event.id === currentEventId ? newEvent : event);
    } else { // Nếu là thêm mới, đẩy vào mảng
        schedule.push(newEvent);
    }

    await herDataRef.update({ schedule: schedule });
    
    // Fallback nếu showSuccess không có sẵn
    if (typeof showSuccess === 'function') {
        showSuccess('Đã lưu thành công!');
    } else if (typeof window.notifications === 'object' && window.notifications.success) {
        window.notifications.success('Đã lưu thành công!');
    } else {
        alert('Đã lưu thành công!');
    }
    location.reload();
});