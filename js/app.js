// File này sẽ là file chính, chạy đầu tiên sau khi Firebase được khởi tạo.
window.addEventListener('DOMContentLoaded', () => {
    if (typeof db === 'undefined') {
        console.error("Firebase chưa được khởi tạo! Hãy kiểm tra lại đoạn mã trong HTML.");
        return;
    }

    const herDataRef = db.collection('userInfo').doc('herData');

    // Lấy dữ liệu một lần và truyền cho các hàm tương ứng
    herDataRef.get().then((doc) => {
        if (doc.exists) {
            const data = doc.data();
            
            // Chạy các hàm tương ứng với từng trang
            runHerDashboard(data); // Hàm trong dashboard.js
            runSchedulePage(data); // Hàm trong schedule.js
            runFullPeriodCalendar(data); // Hàm trong period-calendar.js
            
        } else {
            console.error("Lỗi: Không tìm thấy document 'herData'!");
        }
    }).catch((error) => {
        console.error("Lỗi khi lấy dữ liệu từ Firestore:", error);
    });

    // Hàm cho trang profile không cần dữ liệu chung 'herData' nên gọi riêng
    runHimDashboard(); // Hàm trong profile.js
});