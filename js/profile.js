// Chứa các hàm cho các trang của "anh" (him-dashboard.html và profile.html)

/**
 * Đây là hàm điều khiển chính cho các trang của "anh".
 * Nó được gọi từ app.js và quyết định chạy hàm nào dựa trên trang hiện tại.
 * @param {object} herData - Dữ liệu từ document 'herData'.
 * @param {object} hisData - Dữ liệu từ document 'hisData'.
 */
function runHimPages(herData, hisData) {
    runProfilePage(hisData); // Chạy hàm cho trang profile cá nhân.
    runHimDashboard(herData, hisData); // Chạy hàm cho trang bảng điều khiển.
}

// ===================================================================
// CÁC HÀM CHO TRANG PROFILE CÁ NHÂN (profile.html)
// ===================================================================

/**
 * Khởi chạy logic cho trang profile cá nhân.
 * @param {object} data - Dữ liệu của người dùng (hisData hoặc herData).
 */
function runProfilePage(data) {
    const profileContainer = document.querySelector('.profile-container');
    // Check này đảm bảo code chỉ chạy khi ở đúng trang profile.html
    if (!profileContainer) return;
    
    displayProfileData(data);
}

/**
 * Hiển thị dữ liệu profile lên giao diện.
 * @param {object} data - Dữ liệu của người dùng.
 */
function displayProfileData(data) {
    const profileImage = document.getElementById('profile-image');
    const profileName = document.getElementById('profile-name');
    const profileBio = document.getElementById('profile-bio');
    const interestsContainer = document.getElementById('profile-interests');

    if (profileImage && data.profileImageUrl) profileImage.src = data.profileImageUrl;
    if (profileName && data.name) profileName.innerText = data.name;
    if (profileBio && data.bio) profileBio.innerText = data.bio;
    if (interestsContainer && data.interests && Array.isArray(data.interests)) {
        interestsContainer.innerHTML = '';
        data.interests.forEach(interest => {
            const tag = document.createElement('span');
            tag.className = 'interest-tag';
            tag.innerText = interest;
            interestsContainer.appendChild(tag);
        });
    }
}


// ===================================================================
// CÁC HÀM CHO TRANG BẢNG ĐIỀU KHIỂN (him-dashboard.html)
// ===================================================================

/**
 * Khởi chạy logic cho trang bảng điều khiển của "anh".
 * @param {object} herData - Dữ liệu của "em" (để xem lịch).
 * @param {object} hisData - Dữ liệu của "anh" (để quản lý ý tưởng).
 */
function runHimDashboard(herData, hisData) {
    const dashboardContainer = document.querySelector('.dashboard-container');
    // Check này đảm bảo code chỉ chạy trên trang him-dashboard.html
    if (!dashboardContainer || !document.getElementById('save-note-btn')) return;

    // Chạy các widget
    setupNoteWidget();
    setupIdeaWidget(hisData.ideaBank || []);
    setupSchedulePreview(herData.schedule || []);
    setupDatePlanner(herData.dateNightPlan);
}

/**
 * Thiết lập logic cho Widget "Hộp Thư Gửi Em".
 */
function setupNoteWidget() {
    const saveBtn = document.getElementById('save-note-btn');
    const noteInput = document.getElementById('note-input');
    if(!saveBtn) return;

    saveBtn.addEventListener('click', async () => {
        const text = noteInput.value.trim();
        if (!text) {
            alert('Vui lòng viết gì đó!');
            return;
        }

        try {
            await db.collection('loveNotes').add({
                text: text,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            alert('Đã gửi lời nhắn vào hộp thư! ❤️');
            noteInput.value = '';
        } catch (error) {
            console.error("Lỗi khi lưu lời nhắn:", error);
            alert("Đã có lỗi xảy ra.");
        }
    });
}

/**
 * Thiết lập logic cho Widget "Ngân Hàng Ý Tưởng" (Bản xem trước).
 * @param {string[]} initialIdeas - Mảng các ý tưởng từ Firestore.
 */
function setupIdeaWidget(initialIdeas) {
    const ideaList = document.getElementById('idea-preview-list');
    if (!ideaList) return;

    ideaList.innerHTML = '';
    const ideasToShow = initialIdeas.slice(-3).reverse(); // Lấy 3 ý tưởng gần nhất

    if (ideasToShow.length === 0) {
        ideaList.innerHTML = '<p>Chưa có ý tưởng nào...</p>';
    } else {
        ideasToShow.forEach(ideaText => {
            const p = document.createElement('p');
            p.innerText = `- ${ideaText}`;
            ideaList.appendChild(p);
        });
    }
}

/**
 * Thiết lập logic cho Widget xem trước "Lịch Tuần Của Em".
 * @param {object[]} schedule - Mảng các sự kiện từ Firestore.
 */
function setupSchedulePreview(schedule) {
    const previewEl = document.getElementById('next-event-preview');
    if (!previewEl) return;

    if (!schedule || schedule.length === 0) {
        previewEl.innerHTML = '<p>Tuần này em rảnh!</p>';
        return;
    }
    
    // Tìm sự kiện sắp tới (logic đơn giản: lấy sự kiện đầu tiên trong danh sách)
    const nextEvent = schedule[0]; 
    previewEl.innerHTML = `
        <p>Sự kiện tiếp theo</p>
        <div class="event-title">${nextEvent.title}</div>
        <div class="event-time">${nextEvent.startTime}</div>
    `;
}

/**
 * Thiết lập logic cho Widget "Kế Hoạch Hẹn Hò".
 * @param {object} plan - Object kế hoạch hẹn hò từ Firestore.
 */
function setupDatePlanner(plan) {
    const displayEl = document.getElementById('date-plan-display');
    const manageBtn = document.getElementById('manage-date-plan-btn');
    const modal = document.getElementById('date-plan-modal');
    if (!displayEl) return;

    // Hiển thị kế hoạch hiện tại
    if (plan && plan.isActive) {
        const date = plan.dateTime.toDate();
        displayEl.innerHTML = `
            <div class="plan-title">${plan.title}</div>
            <div class="plan-time">${date.toLocaleDateString('vi-VN')} - ${date.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</div>
            <p>${plan.location}</p>
        `;
    } else {
        displayEl.innerHTML = '<p>Chưa có kế hoạch nào. Hãy tạo một buổi hẹn bất ngờ!</p>';
    }

    // Xử lý nút bấm mở modal
    manageBtn.addEventListener('click', () => {
        if (plan && plan.isActive) { // Điền thông tin cũ nếu có
            document.getElementById('date-title-input').value = plan.title;
            const date = plan.dateTime.toDate();
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
            document.getElementById('date-time-input').value = date.toISOString().slice(0,16);
            document.getElementById('date-location-input').value = plan.location;
            document.getElementById('date-note-input').value = plan.note;
        }
        modal.classList.add('visible');
    });

    // Xử lý các nút trong modal
    document.getElementById('cancel-date-plan-button')?.addEventListener('click', () => modal.classList.remove('visible'));
    
    document.getElementById('save-date-plan-button')?.addEventListener('click', async () => {
        const newPlan = {
            isActive: true,
            title: document.getElementById('date-title-input').value,
            dateTime: new Date(document.getElementById('date-time-input').value),
            location: document.getElementById('date-location-input').value,
            note: document.getElementById('date-note-input').value,
        };
        const herDataRef = db.collection('userInfo').doc('herData');
        await herDataRef.update({ dateNightPlan: newPlan });
        alert('Đã gửi lời mời hẹn hò! ❤️');
        location.reload();
    });

    document.getElementById('delete-date-plan-button')?.addEventListener('click', async () => {
        if (!confirm('Bạn có chắc muốn hủy kế hoạch hẹn hò này?')) return;
        const herDataRef = db.collection('userInfo').doc('herData');
        await herDataRef.update({ 'dateNightPlan.isActive': false });
        alert('Đã hủy kế hoạch.');
        location.reload();
    });
}