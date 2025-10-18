// Contains functions for the countdown.html page (detailed period calendar)
function runFullPeriodCalendar(data) {
    // Calls the shared runPeriodCalendar function with specific IDs for the detailed page
    runPeriodCalendar(data, 'full-period-calendar', 'month-year-title-full', 'calendar-days-grid-full', 'prev-month-btn-full', 'next-month-btn-full', true);
}

// === Functions to handle the Period Calendar's Modal ===

// Opens the pop-up window to edit the period date
function openEditModal(date) {
    const modal = document.getElementById('edit-modal');
    if(!modal) return;
    
    const dateInput = document.getElementById('new-period-date-input');
    // Formats the date to a 'YYYY-MM-DD' string that the input field can understand
    dateInput.value = date.toISOString().split('T')[0];
    
    modal.classList.add('visible');
}

// Attaches event listeners to the buttons in the Period Calendar's modal

// Handles the "Cancel" button click
document.getElementById('cancel-button')?.addEventListener('click', () => {
    document.getElementById('edit-modal').classList.remove('visible');
});

// Handles the "Save" button click
document.getElementById('save-button')?.addEventListener('click', () => {
    const dateInput = document.getElementById('new-period-date-input');
    const newDate = new Date(dateInput.value);
    
    // Adjusts the date to avoid timezone issues where the date might be off by one day
    const correctedDate = new Date(newDate.getTime() + (newDate.getTimezoneOffset() * 60000));
    
    if (!isNaN(correctedDate.getTime())) { // Checks if the date is valid
        saveNewDateToFirestore(correctedDate);
    } else {
        showError("Ngày được chọn không hợp lệ!");
    }
});

// Function to save the new date to the database
function saveNewDateToFirestore(newDate) {
    const herDataRef = db.collection('userInfo').doc('herData');
    
    // Updates the 'lastPeriodStartDate' field in Firestore
    herDataRef.update({
        lastPeriodStartDate: firebase.firestore.Timestamp.fromDate(newDate)
    })
    .then(() => {
        showSuccess("Cập nhật thành công!");
        location.reload(); // Reloads the page to show the changes
    })
    .catch((error) => {
        console.error("Error updating document: ", error);
        showError("Đã xảy ra lỗi. Vui lòng thử lại.");
    });
}