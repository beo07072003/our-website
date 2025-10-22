window.addEventListener('DOMContentLoaded', () => {
    // Check xem có phải trang ideas.html không
    if (!document.getElementById('full-idea-list')) return;
    if (typeof db === 'undefined') return;

    const ideaListEl = document.getElementById('full-idea-list');
    const addBtn = document.getElementById('add-idea-btn-full');
    const inputEl = document.getElementById('idea-input-full');
    let ideas = [];

    // Custom Alert Function
    const showCustomAlert = (message) => {
        return new Promise((resolve) => {
            const alertOverlay = document.getElementById('custom-alert');
            const alertMessage = document.getElementById('alert-message');
            const alertOkBtn = document.getElementById('alert-ok-btn');

            alertMessage.textContent = message;
            alertOverlay.classList.add('show');

            const handleOk = () => {
                alertOverlay.classList.remove('show');
                alertOkBtn.removeEventListener('click', handleOk);
                resolve();
            };

            alertOkBtn.addEventListener('click', handleOk);
        });
    };

    // Custom Confirm Function
    const showCustomConfirm = (message) => {
        return new Promise((resolve) => {
            const confirmOverlay = document.getElementById('custom-confirm');
            const confirmMessage = document.getElementById('confirm-message');
            const confirmYesBtn = document.getElementById('confirm-yes-btn');
            const confirmNoBtn = document.getElementById('confirm-no-btn');

            confirmMessage.textContent = message;
            confirmOverlay.classList.add('show');

            const handleYes = () => {
                confirmOverlay.classList.remove('show');
                confirmYesBtn.removeEventListener('click', handleYes);
                confirmNoBtn.removeEventListener('click', handleNo);
                resolve(true);
            };

            const handleNo = () => {
                confirmOverlay.classList.remove('show');
                confirmYesBtn.removeEventListener('click', handleYes);
                confirmNoBtn.removeEventListener('click', handleNo);
                resolve(false);
            };

            confirmYesBtn.addEventListener('click', handleYes);
            confirmNoBtn.addEventListener('click', handleNo);
        });
    };

    // Hàm để hiển thị tất cả ý tưởng
    const renderIdeas = () => {
        ideaListEl.innerHTML = '';
        if (ideas.length === 0) {
            ideaListEl.innerHTML = '<p>Chưa có ý tưởng nào...</p>';
            return;
        }
        ideas.forEach((ideaText, index) => {
            const item = document.createElement('div');
            item.className = 'idea-item';
            item.innerHTML = `
                <span class="idea-text">${ideaText}</span>
                <button class="delete-idea-btn" data-index="${index}">X</button>
            `;
            ideaListEl.appendChild(item);
        });
    };

    // Đợi realtime sync khởi tạo
    const waitForRealtimeSync = () => {
        return new Promise((resolve) => {
            const check = () => {
                if (window.realtimeSync && window.realtimeSync.isInitialized) {
                    resolve();
                } else {
                    setTimeout(check, 100);
                }
            };
            check();
        });
    };

    // Khởi tạo với đồng bộ thời gian thực
    const initIdeas = async () => {
        try {
            await waitForRealtimeSync();
            
            // Lắng nghe thay đổi ý tưởng theo thời gian thực
            window.realtimeSync.listenToIdeas((newIdeas) => {
                ideas = newIdeas || [];
                renderIdeas();
                console.log('💡 Ý tưởng đã được cập nhật theo thời gian thực');
            });

            console.log('✅ Trang ý tưởng đã được thiết lập đồng bộ thời gian thực!');
        } catch (error) {
            console.error('❌ Lỗi khi thiết lập đồng bộ thời gian thực:', error);
        }
    };

    initIdeas();

    // Xử lý nút Thêm
    addBtn.addEventListener('click', async () => {
        const newIdea = inputEl.value.trim();
        if (!newIdea) {
            await showCustomAlert('Vui lòng nhập ý tưởng trước khi thêm!');
            return;
        }
        
        // Thêm vào mảng tạm
        ideas.push(newIdea);
        
        // Cập nhật lên Firebase với realtime sync
        const success = await window.realtimeSync.updateIdeas(ideas);
        
        if (success) {
            inputEl.value = '';
            await showCustomAlert('✅ Đã thêm ý tưởng mới thành công!');
            console.log('✅ Đã thêm ý tưởng mới:', newIdea);
        } else {
            console.error('❌ Lỗi khi thêm ý tưởng');
            await showCustomAlert('❌ Có lỗi xảy ra khi thêm ý tưởng!');
        }
    });

    // Xử lý nút Xóa (dùng event delegation)
    ideaListEl.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-idea-btn')) {
            const indexToDelete = parseInt(e.target.dataset.index);
            const confirmed = await showCustomConfirm(`Bạn có chắc muốn xóa ý tưởng: "${ideas[indexToDelete]}"?`);
            
            if (confirmed) {
                // Xóa khỏi mảng tạm
                const deletedIdea = ideas[indexToDelete];
                ideas.splice(indexToDelete, 1);
                
                // Cập nhật lên Firebase với realtime sync
                const success = await window.realtimeSync.updateIdeas(ideas);
                
                if (success) {
                    await showCustomAlert('✅ Đã xóa ý tưởng thành công!');
                    console.log('✅ Đã xóa ý tưởng:', deletedIdea);
                } else {
                    console.error('❌ Lỗi khi xóa ý tưởng');
                    await showCustomAlert('❌ Có lỗi xảy ra khi xóa ý tưởng!');
                    // Khôi phục lại ý tưởng nếu lỗi
                    ideas.splice(indexToDelete, 0, deletedIdea);
                }
            }
        }
    });

    // Hỗ trợ Enter key để thêm ý tưởng
    inputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addBtn.click();
        }
    });
});