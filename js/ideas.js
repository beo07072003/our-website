window.addEventListener('DOMContentLoaded', () => {
    // Check xem có phải trang ideas.html không
    if (!document.getElementById('full-idea-list')) return;
    if (typeof db === 'undefined') return;

    const ideaListEl = document.getElementById('full-idea-list');
    const addBtn = document.getElementById('add-idea-btn-full');
    const inputEl = document.getElementById('idea-input-full');
    let ideas = [];

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
        if (!newIdea) return;
        
        // Thêm vào mảng tạm
        ideas.push(newIdea);
        
        // Cập nhật lên Firebase với realtime sync
        const success = await window.realtimeSync.updateIdeas(ideas);
        
        if (success) {
            inputEl.value = '';
            console.log('✅ Đã thêm ý tưởng mới:', newIdea);
        } else {
            console.error('❌ Lỗi khi thêm ý tưởng');
            alert('Có lỗi xảy ra khi thêm ý tưởng!');
        }
    });

    // Xử lý nút Xóa (dùng event delegation)
    ideaListEl.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-idea-btn')) {
            const indexToDelete = parseInt(e.target.dataset.index);
            if (confirm(`Bạn có chắc muốn xóa ý tưởng: "${ideas[indexToDelete]}"?`)) {
                // Xóa khỏi mảng tạm
                const deletedIdea = ideas[indexToDelete];
                ideas.splice(indexToDelete, 1);
                
                // Cập nhật lên Firebase với realtime sync
                const success = await window.realtimeSync.updateIdeas(ideas);
                
                if (success) {
                    console.log('✅ Đã xóa ý tưởng:', deletedIdea);
                } else {
                    console.error('❌ Lỗi khi xóa ý tưởng');
                    alert('Có lỗi xảy ra khi xóa ý tưởng!');
                    // Khôi phục lại ý tưởng nếu lỗi
                    ideas.splice(indexToDelete, 0, deletedIdea);
                }
            }
        }
    });
});