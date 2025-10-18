window.addEventListener('DOMContentLoaded', async () => {
    if (typeof db === 'undefined') {
        console.error("Firebase chưa được khởi tạo!");
        return;
    }

    try {
        // Tải đồng thời cả hai "hồ sơ" của "anh" và "em"
        const herDataRef = db.collection('userInfo').doc('herData');
        const hisDataRef = db.collection('userInfo').doc('hisData');

        // Promise.all sẽ "đứng chờ" cho đến khi cả hai hồ sơ được tải về xong
        const [herDoc, hisDoc] = await Promise.all([herDataRef.get(), hisDataRef.get()]);

        // Gán dữ liệu vào biến, nếu không có thì dùng object rỗng
        const herData = herDoc.exists ? herDoc.data() : {};
        const hisData = hisDoc.exists ? hisDoc.data() : {};

        // === BẮT ĐẦU RA LỆNH CHO CÁC TRANG HOẠT ĐỘNG ===

        // 1. Chạy các hàm cho trang của "em" (nếu có)
        runHerDashboard(herData);
        runSchedulePage(herData);
        runFullPeriodCalendar(herData);
        displayDateInvitation(herData.dateNightPlan);

        // 2. Chạy các hàm cho trang của "anh" (nếu có)
        runHimPages(herData, hisData);

    } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        showError("Đã xảy ra lỗi khi kết nối.");
    }
});