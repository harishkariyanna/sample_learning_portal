// Dashboard JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get employee name from localStorage or use default
    const employeeName = localStorage.getItem('employeeName') || 'Employee';
    document.getElementById('employeeName').textContent = employeeName;
    
    // Animate progress bar on load
    setTimeout(() => {
        const progressBar = document.querySelector('.progress-bar');
        progressBar.style.width = '0%';
        setTimeout(() => {
            progressBar.style.width = '70%';
        }, 100);
    }, 500);
    
    // Animate stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        }, index * 200);
    });
});

// Course enrollment function
function enrollCourse(courseName) {
    // Show confirmation modal or alert
    if (confirm(`Are you sure you want to enroll in "${courseName}"?`)) {
        // Simulate enrollment process
        const button = event.target;
        const originalText = button.textContent;
        
        button.textContent = 'Enrolling...';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = 'Enrolled!';
            button.classList.remove('btn-primary');
            button.classList.add('btn-success');
            
            // Show success message
            showNotification(`Successfully enrolled in ${courseName}!`, 'success');
            
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.classList.remove('btn-success');
                button.classList.add('btn-primary');
            }, 3000);
        }, 1500);
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}