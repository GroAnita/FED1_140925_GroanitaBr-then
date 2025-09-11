// Alert/modal functions
function showCustomAlert(message, title = "Alert") { /* ...existing code... */ }
function closeCustomAlert() { /* ...existing code... */ }
function showPurchaseSuccess() { /* ...existing code... */ }
function closePurchaseSuccess() { /* ...existing code... */ }
function showAlert(message) { /* ...existing code... */ }
function closeAlert() { /* ...existing code... */ }
function initializeCustomAlert() { /* ...existing code... */ }
// Initialize Custom Alert confirmedPurchase Modal
function initializeCustomAlert() {
    const alertModal = document.getElementById('customAlert');
    const closeBtn = document.querySelector('.alert-close');
    const okBtn = document.getElementById('alertOkBtn');
    
    if (closeBtn) {
        closeBtn.onclick = closeCustomAlert;
    }
    
    if (okBtn) {
        okBtn.onclick = closeCustomAlert;
    }
    
    // Closing when I am clicking outside the modal
    if (alertModal) {
        alertModal.onclick = function(event) {
            if (event.target === alertModal) {
                closeCustomAlert();
            }
        }
    }
    
    // Initialize Purchase Success Modal (only on my checkout page)
    if (isCheckoutPage) {
        const successModal = document.getElementById('purchaseSuccessModal');
        const successCloseBtn = document.querySelector('.success-close');
        const successOkBtn = document.getElementById('successOkBtn');
        
        if (successCloseBtn) {
            successCloseBtn.onclick = closePurchaseSuccess;
        }
        
        if (successOkBtn) {
            successOkBtn.onclick = function() {
                closePurchaseSuccess();
                // Redirect to home page for continuing shopping
                window.location.href = 'index.html';
            };
        }
        
        // Closing when I am clicking outside the success modal
        if (successModal) {
            successModal.onclick = function(event) {
                if (event.target === successModal) {
                    closePurchaseSuccess();
                }
            }
        }
    }
}