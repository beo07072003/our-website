// Hệ thống đồng bộ thời gian thực với Firebase
class RealtimeSync {
    constructor() {
        this.listeners = new Map();
        this.isInitialized = false;
    }

    // Khởi tạo hệ thống đồng bộ
    init() {
        if (typeof db === 'undefined') {
            console.error('Firebase chưa được khởi tạo!');
            return;
        }
        this.isInitialized = true;
        // console.log('🔄 Hệ thống đồng bộ thời gian thực đã được khởi tạo');
    }

    // Lắng nghe thay đổi dữ liệu của "em"
    listenToHerData(callback) {
        if (!this.isInitialized) {
            console.error('RealtimeSync chưa được khởi tạo!');
            return;
        }

        const herDataRef = db.collection('userInfo').doc('herData');
        
        const unsubscribe = herDataRef.onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                // console.log('📱 Dữ liệu "em" đã được cập nhật:', data);
                callback(data);
            } else {
                // console.log('📱 Không tìm thấy dữ liệu "em"');
                callback({});
            }
        }, (error) => {
            console.error('❌ Lỗi khi lắng nghe dữ liệu "em":', error);
        });

        // Lưu listener để có thể hủy sau
        this.listeners.set('herData', unsubscribe);
        return unsubscribe;
    }

    // Lắng nghe thay đổi dữ liệu của "anh"
    listenToHisData(callback) {
        if (!this.isInitialized) {
            console.error('RealtimeSync chưa được khởi tạo!');
            return;
        }

        const hisDataRef = db.collection('userInfo').doc('hisData');
        
        const unsubscribe = hisDataRef.onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                // console.log('👨‍💻 Dữ liệu "anh" đã được cập nhật:', data);
                callback(data);
            } else {
                // console.log('👨‍💻 Không tìm thấy dữ liệu "anh"');
                callback({});
            }
        }, (error) => {
            console.error('❌ Lỗi khi lắng nghe dữ liệu "anh":', error);
        });

        // Lưu listener để có thể hủy sau
        this.listeners.set('hisData', unsubscribe);
        return unsubscribe;
    }

    // Lắng nghe thay đổi lịch tuần
    listenToSchedule(callback) {
        return this.listenToHerData((data) => {
            if (data.schedule) {
                // console.log('📅 Lịch tuần đã được cập nhật:', data.schedule);
                callback(data.schedule);
            }
        });
    }

    // Lắng nghe thay đổi ý tưởng
    listenToIdeas(callback) {
        return this.listenToHisData((data) => {
            if (data.ideaBank) {
                // console.log('💡 Ý tưởng đã được cập nhật:', data.ideaBank);
                callback(data.ideaBank);
            }
        });
    }

    // Lắng nghe thay đổi ghi chú
    listenToNotes(callback) {
        return this.listenToHisData((data) => {
            if (data.noteForHer) {
                // console.log('💌 Ghi chú đã được cập nhật:', data.noteForHer);
                callback(data.noteForHer);
            }
        });
    }

    // Lắng nghe thay đổi hộp thư
    listenToMailbox(callback) {
        return this.listenToHisData((data) => {
            if (data.notesForHer) {
                // console.log('📨 Hộp thư đã được cập nhật:', data.notesForHer);
                callback(data.notesForHer);
            }
        });
    }

    // Cập nhật dữ liệu với thời gian thực
    async updateData(userType, field, value) {
        if (!this.isInitialized) {
            console.error('RealtimeSync chưa được khởi tạo!');
            return;
        }

        try {
            const docRef = db.collection('userInfo').doc(`${userType}Data`);
            await docRef.update({
                [field]: value,
                lastUpdated: new Date().toISOString()
            });
            
            // console.log(`✅ Đã cập nhật ${field} cho ${userType}:`, value);
            return true;
        } catch (error) {
            console.error(`❌ Lỗi khi cập nhật ${field} cho ${userType}:`, error);
            return false;
        }
    }

    // Cập nhật lịch tuần
    async updateSchedule(schedule) {
        return await this.updateData('her', 'schedule', schedule);
    }

    // Cập nhật ý tưởng
    async updateIdeas(ideas) {
        return await this.updateData('his', 'ideaBank', ideas);
    }

    // Cập nhật ghi chú
    async updateNote(note) {
        return await this.updateData('his', 'noteForHer', note);
    }

    // Hủy tất cả listeners
    cleanup() {
        this.listeners.forEach((unsubscribe, key) => {
            // console.log(`🔇 Hủy listener cho ${key}`);
            unsubscribe();
        });
        this.listeners.clear();
        this.isInitialized = false;
        // console.log('🧹 Đã dọn dẹp tất cả listeners');
    }

    // Hủy listener cụ thể
    unsubscribe(listenerKey) {
        if (this.listeners.has(listenerKey)) {
            this.listeners.get(listenerKey)();
            this.listeners.delete(listenerKey);
            // console.log(`🔇 Đã hủy listener: ${listenerKey}`);
        }
    }

    // Hiển thị trạng thái kết nối
    showConnectionStatus() {
        const statusElement = document.createElement('div');
        statusElement.id = 'realtime-status';
        statusElement.innerHTML = `
            <div style="
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(76, 175, 80, 0.9);
                color: white;
                padding: 8px 12px;
                border-radius: 20px;
                font-size: 0.8em;
                font-weight: bold;
                z-index: 10000;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                gap: 8px;
            ">
                <span>🔄</span>
                <span>Đồng bộ thời gian thực</span>
            </div>
        `;
        document.body.appendChild(statusElement);

        // Tự động ẩn sau 3 giây
        setTimeout(() => {
            if (statusElement && statusElement.parentNode) {
                statusElement.remove();
            }
        }, 3000);
    }
}

// Tạo instance global
const realtimeSync = new RealtimeSync();

// Tự động khởi tạo khi DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Đợi Firebase khởi tạo
    const initRealtime = () => {
        if (typeof db !== 'undefined') {
            realtimeSync.init();
            realtimeSync.showConnectionStatus();
        } else {
            // Thử lại sau 200ms để giảm CPU usage
            setTimeout(initRealtime, 200);
        }
    };
    
    initRealtime();
});

// Export cho sử dụng global
window.realtimeSync = realtimeSync;
