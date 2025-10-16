window.addEventListener('DOMContentLoaded', () => {
    // Check xem có phải trang ideas.html không
    if (!document.getElementById('full-idea-list')) return;
    if (typeof db === 'undefined') return;

    const hisDataRef = db.collection('userInfo').doc('hisData');
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

    // Tải dữ liệu ban đầu
    hisDataRef.get().then(doc => {
        if (doc.exists && doc.data().ideaBank) {
            ideas = doc.data().ideaBank;
            renderIdeas();
        }
    });

    // Xử lý nút Thêm
    addBtn.addEventListener('click', async () => {
        const newIdea = inputEl.value.trim();
        if (!newIdea) return;
        
        ideas.push(newIdea); // Thêm vào mảng tạm
        await hisDataRef.update({ ideaBank: ideas }); // Cập nhật lên DB
        
        inputEl.value = '';
        renderIdeas(); // Vẽ lại danh sách
    });

    // Xử lý nút Xóa (dùng event delegation)
    ideaListEl.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-idea-btn')) {
            const indexToDelete = parseInt(e.target.dataset.index);
            if (confirm(`Bạn có chắc muốn xóa ý tưởng: "${ideas[indexToDelete]}"?`)) {
                ideas.splice(indexToDelete, 1); // Xóa khỏi mảng tạm
                await hisDataRef.update({ ideaBank: ideas }); // Cập nhật lên DB
                renderIdeas(); // Vẽ lại danh sách
            }
        }
    });
});