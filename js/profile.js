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
    setupCountdownEvent(hisData.countdownEvent);
}

/**
 * Thiết lập logic cho Widget "Hộp Thư Gửi Em".
 */
function setupNoteWidget() {
    const saveBtn = document.getElementById('save-note-btn');
    const noteInput = document.getElementById('note-input');
    if(!saveBtn) return;

        saveBtn.addEventListener('click', async () => {
            const noteText = noteInput.value.trim();
            if (!noteText) {
                showWarning('Vui lòng nhập nội dung thư!');
                return;
            }
            
            // Disable button để tránh double click
            saveBtn.disabled = true;
            saveBtn.textContent = 'Đang gửi...';
            
            try {
                // console.log('🔍 Bắt đầu gửi thư...');
                // console.log('🔍 Firebase db object:', typeof db);
                
                if (typeof db === 'undefined') {
                    throw new Error('Firebase chưa được khởi tạo!');
                }
                
                const hisDataRef = db.collection('userInfo').doc('hisData');
                // console.log('🔍 Reference created:', hisDataRef);
                
                // Lấy dữ liệu hiện tại
                // console.log('🔍 Đang lấy dữ liệu hiện tại...');
                const hisDoc = await hisDataRef.get();
                // console.log('🔍 Document exists:', hisDoc.exists);
                
                const currentData = hisDoc.exists ? hisDoc.data() : {};
                const existingNotes = currentData.notesForHer || [];
                // console.log('🔍 Existing notes count:', existingNotes.length);
                
                // Tạo thư mới
                const newNote = {
                    message: noteText,
                    timestamp: new Date().toISOString(),
                    id: Date.now().toString()
                };
                // console.log('🔍 New note created:', newNote);
                
                // Thêm thư mới vào danh sách
                const updatedNotes = [newNote, ...existingNotes];
                // console.log('🔍 Updated notes count:', updatedNotes.length);
                
                // Cập nhật lên Firebase
                // console.log('🔍 Đang cập nhật lên Firebase...');
                // console.log('🔍 Data to update:', {
                //     notesForHer: updatedNotes,
                //     lastUpdated: new Date().toISOString()
                // });
                
                await hisDataRef.update({
                    notesForHer: updatedNotes,
                    lastUpdated: new Date().toISOString()
                });
                // console.log('✅ Firebase update completed!');
                
                // Verify the update
                const verifyDoc = await hisDataRef.get();
                const verifyData = verifyDoc.data();
                // console.log('🔍 Verification - notesForHer count:', verifyData.notesForHer?.length || 0);
                // console.log('🔍 Verification - latest note:', verifyData.notesForHer?.[0]);
                
                noteInput.value = '';
                showSuccess('Đã gửi thư thành công! 💌 Em sẽ nhận được thư ngay lập tức!');
                
                // console.log('✅ Đã gửi thư mới:', newNote);
                
                // Test: Kiểm tra xem hộp thư có được lưu không
                setTimeout(async () => {
                    try {
                        const testDoc = await hisDataRef.get();
                        const testData = testDoc.data();
                        // console.log('🧪 Test - Hộp thư trong database:', testData.notesForHer?.length || 0, 'thư');
                        // if (testData.notesForHer && testData.notesForHer.length > 0) {
                        //     console.log('🧪 Test - Thư mới nhất:', testData.notesForHer[0]);
                        // }
                    } catch (error) {
                        console.error('🧪 Test - Lỗi khi kiểm tra:', error);
                    }
                }, 1000);
                
            } catch (error) {
                console.error("Lỗi khi gửi thư:", error);
                showError("Đã có lỗi xảy ra khi gửi thư.");
            } finally {
                // Re-enable button
                saveBtn.disabled = false;
                saveBtn.textContent = 'Gửi vào hộp thư';
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
    
    // Tìm sự kiện sắp tới dựa trên timeline thực tế
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Chủ nhật, 1 = Thứ 2, ..., 6 = Thứ 7
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;
    
    // Debug: Log thời gian hiện tại chi tiết
    // console.log(`🕐 Detailed current time:`, {
    //     now: now.toString(),
    //     currentDay: currentDay,
    //     currentHour: currentHour,
    //     currentMinute: currentMinute,
    //     currentTime: currentTime,
    //     timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    // });
    
    // Convert currentDay to match schedule format (2 = Thứ 2, 3 = Thứ 3, ..., 8 = Chủ nhật)
    const scheduleCurrentDay = currentDay === 0 ? 8 : currentDay + 1;
    
    // Debug: Log thông tin thời gian hiện tại
    // console.log(`🕐 Current time debug:`, {
    //     currentDay: currentDay,
    //     scheduleCurrentDay: scheduleCurrentDay,
    //     currentHour: currentHour,
    //     currentMinute: currentMinute,
    //     currentTime: currentTime,
    //     dayName: currentDay === 0 ? 'Chủ nhật' : ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][currentDay - 1]
    // });
    
    let nextEvent = null;
    let earliestEvent = null;
    
    // Sắp xếp events theo timeline (tạo bản sao để không thay đổi mảng gốc)
    const sortedEvents = [...schedule].sort((a, b) => {
        if (a.day !== b.day) return a.day - b.day;
        return a.startTime.localeCompare(b.startTime);
    });
    
    // Debug: Log thứ tự sự kiện
    // console.log('📅 Schedule events (sorted):', sortedEvents.map(e => `${e.day}-${e.startTime}: ${e.title}`));
    
    // Debug: Kiểm tra sự kiện Chủ nhật
    const sundayEvents = sortedEvents.filter(e => e.day === 8);
    // console.log('📅 Sunday events:', sundayEvents.map(e => `${e.startTime}: ${e.title}`));
    // console.log('📅 Sunday events count:', sundayEvents.length);
    
    // Debug: Kiểm tra nếu hôm nay là Chủ nhật
    if (scheduleCurrentDay === 8) {
        // console.log('📅 Today is Sunday! Looking for Sunday events...');
        const todaySundayEvents = sundayEvents.filter(e => {
            const [eventHour, eventMinute] = e.startTime.split(':').map(Number);
            const eventTime = eventHour * 60 + eventMinute;
            return eventTime > currentTime;
        });
        // console.log('📅 Sunday events after current time:', todaySundayEvents.map(e => `${e.startTime}: ${e.title}`));
    }
    
    // Tìm sự kiện sắp tới
    for (const event of sortedEvents) {
        const [eventHour, eventMinute] = event.startTime.split(':').map(Number);
        const eventTime = eventHour * 60 + eventMinute;
        
        // Debug: Kiểm tra parsing thời gian
        // console.log(`⏰ Time parsing for ${event.title}:`, {
        //     startTime: event.startTime,
        //     eventHour: eventHour,
        //     eventMinute: eventMinute,
        //     eventTime: eventTime,
        //     isNaN: isNaN(eventTime)
        // });
        
        // console.log(`🔍 Checking event: ${event.title} (Day: ${event.day}, Time: ${event.startTime}, EventTime: ${eventTime}, CurrentTime: ${currentTime})`);
        // console.log(`   - Is today? ${Number(event.day) === scheduleCurrentDay} (event.day: ${event.day} (${typeof event.day}), scheduleCurrentDay: ${scheduleCurrentDay} (${typeof scheduleCurrentDay}))`);
        // console.log(`   - Time not passed? ${eventTime > currentTime} (eventTime: ${eventTime}, currentTime: ${currentTime})`);
        // console.log(`   - Comparison: Number(${event.day}) === ${scheduleCurrentDay} = ${Number(event.day) === scheduleCurrentDay}`);
        
        // Nếu event trong ngày hiện tại và thời gian chưa qua
        if (Number(event.day) === scheduleCurrentDay && eventTime > currentTime) {
            nextEvent = event;
            // console.log(`✅ Found next event today: ${event.title}`);
            break;
        }
        // Xử lý trường hợp Chủ nhật: nếu hôm nay là Chủ nhật và có sự kiện Chủ nhật
        else if (scheduleCurrentDay === 8 && Number(event.day) === 8) {
            // Nếu thời gian chưa qua, chọn sự kiện này
            if (eventTime > currentTime) {
                nextEvent = event;
                // console.log(`✅ Found next event Sunday: ${event.title}`);
                break;
            }
        }
        
        // Lưu event đầu tiên làm fallback (chỉ khi chưa có nextEvent)
        if (!nextEvent && !earliestEvent) {
            earliestEvent = event;
            // console.log(`📌 Set as earliest event: ${event.title}`);
        }
    }
    
    // Nếu không tìm thấy sự kiện chưa qua trong ngày hôm nay, chọn sự kiện gần nhất trong ngày hôm nay
    if (!nextEvent) {
        // Tìm tất cả sự kiện trong ngày hôm nay
        const todayEvents = sortedEvents.filter(event => Number(event.day) === scheduleCurrentDay);
        
        if (todayEvents.length > 0) {
            // Sắp xếp sự kiện hôm nay theo thời gian (từ muộn nhất đến sớm nhất)
            todayEvents.sort((a, b) => {
                const [aHour, aMinute] = a.startTime.split(':').map(Number);
                const [bHour, bMinute] = b.startTime.split(':').map(Number);
                const aTime = aHour * 60 + aMinute;
                const bTime = bHour * 60 + bMinute;
                return bTime - aTime; // Sắp xếp giảm dần (muộn nhất trước)
            });
            
            nextEvent = todayEvents[0]; // Chọn sự kiện muộn nhất trong ngày hôm nay
            // console.log(`✅ Found latest event today: ${nextEvent.title}`);
        }
    }
    
    // Nếu không tìm thấy event trong ngày hôm nay, tìm event trong ngày tương lai
    if (!nextEvent) {
        for (const event of sortedEvents) {
            const [eventHour, eventMinute] = event.startTime.split(':').map(Number);
            const eventTime = eventHour * 60 + eventMinute;
            
            // Nếu event trong ngày tương lai
            if (Number(event.day) > scheduleCurrentDay) {
                nextEvent = event;
                // console.log(`✅ Found next event future: ${event.title}`);
                break;
            }
        }
    }
    
    // Nếu không tìm thấy event sắp tới trong tuần này, tìm event sớm nhất trong tuần tiếp theo
    if (!nextEvent) {
        // Tìm event sớm nhất trong tuần tiếp theo
        // Nếu hôm nay là Chủ nhật (8), tìm event từ Thứ 2 (2) trở đi
        // Nếu không phải Chủ nhật, tìm event từ ngày tiếp theo trở đi
        const nextWeekEvent = sortedEvents.find(event => {
            if (scheduleCurrentDay === 8) {
                // Nếu hôm nay là Chủ nhật, tìm event từ Thứ 2 trở đi
                return Number(event.day) >= 2;
            } else {
                // Nếu không phải Chủ nhật, tìm event từ ngày tiếp theo trở đi
                return Number(event.day) > scheduleCurrentDay;
            }
        });
        
        if (nextWeekEvent) {
            nextEvent = nextWeekEvent;
            // console.log(`🔄 Using next week event: ${nextWeekEvent.title}`);
        } else if (earliestEvent) {
            // Fallback cuối cùng: event sớm nhất trong tuần
            nextEvent = earliestEvent;
            // console.log(`🔄 Using earliest event as fallback: ${earliestEvent?.title}`);
        }
    }
    
    // console.log(`🎯 Final selected event: ${nextEvent?.title} (Day: ${nextEvent?.day}, Time: ${nextEvent?.startTime})`);
    // console.log(`🎯 Event selection reason:`, {
    //     isSunday: scheduleCurrentDay === 8,
    //     selectedEventDay: nextEvent?.day,
    //     selectedEventTime: nextEvent?.startTime,
    //     currentTime: currentTime,
    //     wasTimePassed: nextEvent ? (() => {
    //         const [eventHour, eventMinute] = nextEvent.startTime.split(':').map(Number);
    //         const eventTime = eventHour * 60 + eventMinute;
    //         return eventTime <= currentTime;
    //     })() : null
    // });
    
    // Format ngày hiển thị
    const dayNames = ['', '', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];
    const dayName = dayNames[nextEvent.day] || `Ngày ${nextEvent.day}`;
    
    previewEl.innerHTML = `
        <p>Sự kiện tiếp theo</p>
        <div class="event-title">${nextEvent.title}</div>
        <div class="event-time">${dayName} - ${nextEvent.startTime}</div>
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
        showSuccess('Đã gửi lời mời hẹn hò! ❤️');
        location.reload();
    });

    document.getElementById('delete-date-plan-button')?.addEventListener('click', async () => {
        if (!confirm('Bạn có chắc muốn hủy kế hoạch hẹn hò này?')) return;
        const herDataRef = db.collection('userInfo').doc('herData');
        await herDataRef.update({ 'dateNightPlan.isActive': false });
        showInfo('Đã hủy kế hoạch.');
        location.reload();
    });
}

/**
 * Thiết lập logic cho Widget "Sự Kiện Đếm Ngược".
 */
function setupCountdownEvent(eventData) {
    const saveBtn = document.getElementById('save-event-btn');
    const clearBtn = document.getElementById('clear-event-btn');
    
    if (!saveBtn || !clearBtn) return;

    // Load dữ liệu hiện tại nếu có
    if (eventData) {
        document.getElementById('event-title').value = eventData.title || '';
        document.getElementById('event-date').value = eventData.date || '';
        document.getElementById('event-time').value = eventData.time || '';
        document.getElementById('event-location').value = eventData.location || '';
        document.getElementById('event-description').value = eventData.description || '';
    }

    // Xử lý lưu sự kiện
    saveBtn.addEventListener('click', async () => {
        const eventData = {
            title: document.getElementById('event-title').value.trim(),
            date: document.getElementById('event-date').value,
            time: document.getElementById('event-time').value,
            location: document.getElementById('event-location').value.trim(),
            description: document.getElementById('event-description').value.trim()
        };

        // Validation
        if (!eventData.title) {
            showWarning('Vui lòng nhập tên sự kiện!');
            return;
        }
        if (!eventData.date) {
            showWarning('Vui lòng chọn ngày diễn ra!');
            return;
        }
        if (!eventData.time) {
            showWarning('Vui lòng chọn giờ bắt đầu!');
            return;
        }
        if (!eventData.location) {
            showWarning('Vui lòng nhập địa điểm!');
            return;
        }

        // Disable button
        saveBtn.disabled = true;
        saveBtn.textContent = 'Đang lưu...';

        try {
            if (typeof db === 'undefined') {
                throw new Error('Firebase chưa được khởi tạo!');
            }

            const hisDataRef = db.collection('userInfo').doc('hisData');
            await hisDataRef.update({ countdownEvent: eventData });
            
            showSuccess('Đã lưu sự kiện đếm ngược! ⏰');
            
            // Cập nhật her-dashboard nếu có
            const herDataRef = db.collection('userInfo').doc('herData');
            await herDataRef.update({ countdownEvent: eventData });
            
        } catch (error) {
            console.error('Lỗi khi lưu sự kiện:', error);
            showError('Có lỗi xảy ra khi lưu sự kiện!');
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = '💾 Lưu Sự Kiện';
        }
    });

    // Xử lý xóa sự kiện
    clearBtn.addEventListener('click', async () => {
        if (!await showConfirmDialog('Xác nhận xóa', 'Bạn có chắc muốn xóa sự kiện đếm ngược này?')) {
            return;
        }

        clearBtn.disabled = true;
        clearBtn.textContent = 'Đang xóa...';

        try {
            if (typeof db === 'undefined') {
                throw new Error('Firebase chưa được khởi tạo!');
            }

            const hisDataRef = db.collection('userInfo').doc('hisData');
            await hisDataRef.update({ countdownEvent: null });
            
            // Xóa form
            document.getElementById('event-title').value = '';
            document.getElementById('event-date').value = '';
            document.getElementById('event-time').value = '';
            document.getElementById('event-location').value = '';
            document.getElementById('event-description').value = '';
            
            showSuccess('Đã xóa sự kiện đếm ngược!');
            
            // Cập nhật her-dashboard nếu có
            const herDataRef = db.collection('userInfo').doc('herData');
            await herDataRef.update({ countdownEvent: null });
            
        } catch (error) {
            console.error('Lỗi khi xóa sự kiện:', error);
            showError('Có lỗi xảy ra khi xóa sự kiện!');
        } finally {
            clearBtn.disabled = false;
            clearBtn.textContent = '🗑️ Xóa Sự Kiện';
        }
    });
}