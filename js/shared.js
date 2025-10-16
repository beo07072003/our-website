// =======================================================
// !! CHỈ CẦN SỬA PHIÊN BẢN Ở ĐÂY CHO TOÀN BỘ WEB !!
const currentVersion = "1.2"; // Đổi số này mỗi khi bạn cập nhật CSS/JS
// =======================================================


// Tự động chèn file CSS và JS vào trang
document.write(`
    <link rel="stylesheet" href="css/style.css?v=${currentVersion}">
    <script defer src="js/main.js?v=${currentVersion}"></script>
`);