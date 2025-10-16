    // Chứa các hàm cho trang him-dashboard.html
function runHimDashboard() {
    const profileCard = document.querySelector('.profile-card');
    if (!profileCard) return;

    const hisDataRef = db.collection('userInfo').doc('hisData');
    hisDataRef.get().then((doc) => {
        if (doc.exists) {
            const data = doc.data();
            // ... (copy toàn bộ nội dung của hàm runHimDashboard cũ vào đây)
        }
    });
}