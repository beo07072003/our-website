// Hệ thống thông báo đẹp thay thế alert()
class NotificationSystem {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // Tạo container nếu chưa có
        this.container = document.getElementById('notification-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'notification-container';
            this.container.className = 'notification-container';
            document.body.appendChild(this.container);
        }
    }

    show(message, type = 'info', duration = 4000, options = {}) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Icon tương ứng với loại thông báo
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        // Tạo HTML cho thông báo
        notification.innerHTML = `
            <div class="notification-header">
                <div style="display: flex; align-items: center;">
                    <span class="notification-icon">${icons[type] || icons.info}</span>
                    <span class="notification-title">${options.title || this.getDefaultTitle(type)}</span>
                </div>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="notification-message">${message}</div>
            <div class="notification-progress"></div>
        `;

        // Thêm class important nếu cần
        if (options.important) {
            notification.classList.add('important');
        }

        // Thêm vào container
        this.container.appendChild(notification);

        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Auto remove sau duration
        if (duration > 0) {
            // Tạo thanh progress
            const progressBar = notification.querySelector('.notification-progress');
            if (progressBar) {
                progressBar.style.width = '100%';
                progressBar.style.transition = `width ${duration}ms linear`;
                setTimeout(() => {
                    progressBar.style.width = '0%';
                }, 10);
            }

            setTimeout(() => {
                this.hide(notification);
            }, duration);
        }

        return notification;
    }

    hide(notification) {
        if (notification && notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400);
        }
    }

    getDefaultTitle(type) {
        const titles = {
            success: 'Thành công',
            error: 'Lỗi',
            warning: 'Cảnh báo',
            info: 'Thông báo'
        };
        return titles[type] || 'Thông báo';
    }

    // Các phương thức tiện ích
    success(message, options = {}) {
        return this.show(message, 'success', 4000, options);
    }

    error(message, options = {}) {
        return this.show(message, 'error', 6000, options);
    }

    warning(message, options = {}) {
        return this.show(message, 'warning', 5000, options);
    }

    info(message, options = {}) {
        return this.show(message, 'info', 4000, options);
    }

    // Thông báo quan trọng (không tự động ẩn)
    important(message, type = 'info', options = {}) {
        return this.show(message, type, 0, { ...options, important: true });
    }

    // Dialog xác nhận đẹp thay thế confirm()
    showConfirmDialog(title, message) {
        return new Promise((resolve) => {
            // Tạo modal xác nhận
            const modal = document.createElement('div');
            modal.className = 'confirm-modal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10001;
                backdrop-filter: blur(5px);
            `;

            modal.innerHTML = `
                <div class="confirm-dialog" style="
                    background: white;
                    border-radius: 16px;
                    padding: 24px;
                    max-width: 400px;
                    width: 90%;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    transform: scale(0.9);
                    transition: transform 0.3s ease;
                ">
                    <div class="confirm-header" style="
                        display: flex;
                        align-items: center;
                        margin-bottom: 16px;
                    ">
                        <div style="
                            width: 40px;
                            height: 40px;
                            background: linear-gradient(135deg, #ff6b6b, #ee5a24);
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-right: 12px;
                            font-size: 18px;
                            line-height: 1;
                            flex-shrink: 0;
                        ">⚠️</div>
                        <h3 style="
                            margin: 0;
                            color: #333;
                            font-size: 18px;
                            font-weight: 600;
                        ">${title}</h3>
                    </div>
                    <div class="confirm-message" style="
                        color: #666;
                        margin-bottom: 24px;
                        line-height: 1.5;
                    ">${message}</div>
                    <div class="confirm-buttons" style="
                        display: flex;
                        gap: 12px;
                        justify-content: flex-end;
                    ">
                        <button class="confirm-cancel" style="
                            padding: 10px 20px !important;
                            border: 2px solid #e0e0e0 !important;
                            background: white !important;
                            color: #666 !important;
                            border-radius: 8px !important;
                            cursor: pointer !important;
                            font-weight: 500 !important;
                            transition: all 0.2s ease !important;
                            font-size: 14px !important;
                            text-align: center !important;
                            display: inline-block !important;
                        ">Hủy</button>
                        <button class="confirm-ok" style="
                            padding: 10px 20px !important;
                            border: none !important;
                            background: linear-gradient(135deg, #ff6b6b, #ee5a24) !important;
                            color: white !important;
                            border-radius: 8px !important;
                            cursor: pointer !important;
                            font-weight: 500 !important;
                            transition: all 0.2s ease !important;
                            font-size: 14px !important;
                            text-align: center !important;
                            display: inline-block !important;
                        ">Xóa</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Animation
            setTimeout(() => {
                modal.querySelector('.confirm-dialog').style.transform = 'scale(1)';
            }, 10);

            // Event listeners
            const cancelBtn = modal.querySelector('.confirm-cancel');
            const okBtn = modal.querySelector('.confirm-ok');

            const cleanup = () => {
                modal.querySelector('.confirm-dialog').style.transform = 'scale(0.9)';
                setTimeout(() => {
                    if (modal.parentNode) {
                        modal.parentNode.removeChild(modal);
                    }
                }, 300);
            };

            cancelBtn.addEventListener('click', () => {
                cleanup();
                resolve(false);
            });

            okBtn.addEventListener('click', () => {
                cleanup();
                resolve(true);
            });

            // Close on backdrop click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    cleanup();
                    resolve(false);
                }
            });

            // Close on Escape key
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    cleanup();
                    resolve(false);
                    document.removeEventListener('keydown', handleEscape);
                }
            };
            document.addEventListener('keydown', handleEscape);
        });
    }
}

// Khởi tạo hệ thống thông báo global
window.notifications = new NotificationSystem();

// Hàm tiện ích để thay thế alert()
window.showNotification = function(message, type = 'info', options = {}) {
    return window.notifications.show(message, type, 4000, options);
};

// Hàm tiện ích cho các loại thông báo phổ biến
window.showSuccess = function(message, options = {}) {
    return window.notifications.success(message, options);
};

window.showError = function(message, options = {}) {
    return window.notifications.error(message, options);
};

window.showWarning = function(message, options = {}) {
    return window.notifications.warning(message, options);
};

window.showInfo = function(message, options = {}) {
    return window.notifications.info(message, options);
};

// Hàm tiện ích cho dialog xác nhận
window.showConfirmDialog = function(title, message) {
    return window.notifications.showConfirmDialog(title, message);
};
