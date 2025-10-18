// JavaScript cho hộp thư của em
let mailboxData = [];

// Khởi tạo hộp thư
async function initializeMailbox() {
    console.log('📨 Khởi tạo hộp thư...');
    
    try {
        // Load dữ liệu ban đầu
        const hisDataRef = db.collection('userInfo').doc('hisData');
        const hisDoc = await hisDataRef.get();
        
        if (hisDoc.exists && hisDoc.data().notesForHer) {
            mailboxData = hisDoc.data().notesForHer;
            updateMailbox(mailboxData);
        } else {
            showEmptyMailbox();
        }
        
        console.log('✅ Hộp thư đã được khởi tạo');
    } catch (error) {
        console.error('❌ Lỗi khi khởi tạo hộp thư:', error);
        showErrorMessage('Có lỗi xảy ra khi tải hộp thư');
    }
}

// Cập nhật hiển thị hộp thư
function updateMailbox(notes) {
    console.log('📬 Cập nhật hộp thư với', notes.length, 'thư');
    
    mailboxData = notes || [];
    const mailboxContent = document.getElementById('mailbox-content');
    
    if (!mailboxContent) return;
    
    if (mailboxData.length === 0) {
        showEmptyMailbox();
        return;
    }
    
    // Sắp xếp thư theo thời gian (mới nhất trước)
    const sortedNotes = [...mailboxData].sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
    });
    
    mailboxContent.innerHTML = '';
    
    sortedNotes.forEach((note, index) => {
        const mailItem = createMailItem(note, index);
        mailboxContent.appendChild(mailItem);
    });
}

// Tạo một item thư
function createMailItem(note, index) {
    const mailItem = document.createElement('div');
    mailItem.className = 'mail-item';
    
    // Format thời gian
    const date = new Date(note.timestamp);
    const timeString = date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    mailItem.innerHTML = `
        <div class="mail-header">
            <div class="mail-sender">
                <div class="sender-icon">👨‍💻</div>
                <span>Từ: Anh</span>
            </div>
            <div class="mail-time">${timeString}</div>
        </div>
        <div class="mail-content">
            ${note.message}
        </div>
    `;
    
    // Thêm hiệu ứng xuất hiện
    mailItem.style.animationDelay = `${index * 0.1}s`;
    
    return mailItem;
}

// Hiển thị hộp thư trống
function showEmptyMailbox() {
    const mailboxContent = document.getElementById('mailbox-content');
    if (!mailboxContent) return;
    
    mailboxContent.innerHTML = `
        <div class="empty-mailbox">
            <div class="empty-icon">📭</div>
            <h3>Hộp thư trống</h3>
            <p>Chưa có thư nào từ anh...<br>
            Anh sẽ gửi thư cho em sớm thôi! 💕</p>
        </div>
    `;
}

// Hiển thị thông báo lỗi
function showErrorMessage(message) {
    const mailboxContent = document.getElementById('mailbox-content');
    if (!mailboxContent) return;
    
    mailboxContent.innerHTML = `
        <div class="empty-mailbox">
            <div class="empty-icon">❌</div>
            <h3>Có lỗi xảy ra</h3>
            <p>${message}</p>
        </div>
    `;
}

// Làm mới hộp thư
async function refreshMailbox() {
    console.log('🔄 Làm mới hộp thư...');
    
    const refreshBtn = document.getElementById('refresh-mailbox-btn');
    if (refreshBtn) {
        refreshBtn.innerHTML = '🔄 Đang tải...';
        refreshBtn.disabled = true;
    }
    
    try {
        const hisDataRef = db.collection('userInfo').doc('hisData');
        const hisDoc = await hisDataRef.get();
        
        if (hisDoc.exists && hisDoc.data().notesForHer) {
            mailboxData = hisDoc.data().notesForHer;
            updateMailbox(mailboxData);
            console.log('✅ Đã làm mới hộp thư');
        } else {
            showEmptyMailbox();
        }
    } catch (error) {
        console.error('❌ Lỗi khi làm mới hộp thư:', error);
        showErrorMessage('Không thể làm mới hộp thư');
    } finally {
        if (refreshBtn) {
            refreshBtn.innerHTML = '🔄 Làm mới hộp thư';
            refreshBtn.disabled = false;
        }
    }
}

// Gắn event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Nút làm mới hộp thư
    const refreshBtn = document.getElementById('refresh-mailbox-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshMailbox);
    }
    
    console.log('📨 Mailbox event listeners đã được gắn');
});
