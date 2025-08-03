function clearErrorNotification() {
    fetch('/clear-error-notification/')
        .then(res => res.json())
        .then(data => {
            if (data.status === 'cleared') {
                alert('Session cleared!');
            }
        });
}

function clearQuestionIds() {
    fetch('/clear-question-ids/')
        .then(res => res.json())
        .then(data => {
            if (data.status === 'cleared') {
                alert('Session cleared!');
            }
        });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i data-lucide="${getNotificationIcon(type)}" class="notification-icon"></i>
            <span class="notification-message">${message}</span>
            <button class="notification-close">
                <i data-lucide="x" class="close-icon"></i>
            </button>
        </div>
    `;
    
    // Add notification styles if not already present
    if (!document.querySelector('style[data-notification-styles]')) {
        const style = document.createElement('style');
        style.setAttribute('data-notification-styles', '');
        style.textContent = `
            .notification {
                position: fixed;
                top: 2rem;
                right: 2rem;
                z-index: 9999;
                max-width: 400px;
                background: rgba(10, 10, 15, 0.95);
                backdrop-filter: blur(24px);
                border-radius: 15px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                animation: slideInRight 0.3s ease-out;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 1rem;
            }
            
            .notification-icon {
                width: 1.25rem;
                height: 1.25rem;
                flex-shrink: 0;
            }
            
            .notification-success .notification-icon {
                color: #10b981;
            }
            
            .notification-error .notification-icon {
                color: #ef4444;
            }
            
            .notification-info .notification-icon {
                color: #8b5cf6;
            }
            
            .notification-message {
                color: #ffffff;
                font-size: 0.875rem;
                flex: 1;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: rgba(255, 255, 255, 0.6);
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 0.25rem;
                transition: color 0.3s ease;
            }
            
            .notification-close:hover {
                color: #ffffff;
            }
            
            .close-icon {
                width: 1rem;
                height: 1rem;
            }
            
            .animate-spin {
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes slideOutRight {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100%);
                }
            }
            
            .uploaded-files {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                margin-top: 1rem;
            }
            
            .uploaded-file {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                background: rgba(255, 255, 255, 0.1);
                padding: 0.5rem;
                border-radius: 8px;
                font-size: 0.875rem;
                color: rgba(255, 255, 255, 0.8);
            }
            
            .uploaded-file i {
                width: 1rem;
                height: 1rem;
                color: #8b5cf6;
            }
            
            @media (max-width: 640px) {
                .notification {
                    top: 1rem;
                    right: 1rem;
                    left: 1rem;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    lucide.createIcons();
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success':
            return 'check-circle';
        case 'error':
            return 'alert-circle';
        case 'info':
        default:
            return 'info';
    }
}

function showTaskCompletion(taskName, reward) {
    const notification = document.createElement('div');
    notification.className = 'task-completion-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                <i data-lucide="check-circle" class="success-icon"></i>
            </div>
            <div class="notification-text">
                <h4>Task Completed!</h4>
                <p>${taskName}</p>
                <span class="reward-text">${reward} earned</span>
            </div>
        </div>
    `;
    
    // Add notification styles
    if (!document.querySelector('style[data-task-notification]')) {
        const style = document.createElement('style');
        style.setAttribute('data-task-notification', '');
        style.textContent = `
            .task-completion-notification {
                position: fixed;
                top: 2rem;
                right: 2rem;
                background: rgba(16, 185, 129, 0.9);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(16, 185, 129, 0.3);
                border-radius: 15px;
                padding: 1rem;
                z-index: 9999;
                animation: slideInRight 0.5s ease, fadeOut 0.5s ease 2.5s;
                max-width: 300px;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .notification-icon {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                padding: 0.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .success-icon {
                width: 1.5rem;
                height: 1.5rem;
                color: #ffffff;
            }
            
            .notification-text h4 {
                color: #ffffff;
                font-weight: 600;
                margin-bottom: 0.25rem;
            }
            
            .notification-text p {
                color: rgba(255, 255, 255, 0.9);
                font-size: 0.875rem;
                margin-bottom: 0.25rem;
            }
            
            .reward-text {
                color: #ffffff;
                font-weight: 700;
                font-size: 0.875rem;
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    lucide.createIcons();
    
    // Remove notification after animation
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.slice(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function showSomeAnimation(title, message) {
    
    const overlay = document.createElement('div');
    overlay.className = 'completion-overlay';
    overlay.innerHTML = `
        <div class="completion-content">
            <div class="completion-icon">
                <i data-lucide="loader-circle" class="success-icon"></i>
            </div>
            <h2 class="completion-title">${title}</h2>
            <p class="completion-message">${message}</p>
            <div class="loading-bar">
                <div class="loading-fill"></div>
            </div>
        </div>
    `;
    
    // Add completion styles
    const style = document.createElement('style');
    style.textContent = `
        .completion-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            animation: fadeIn 0.5s ease;
        }
        
        .completion-content {
            text-align: center;
            max-width: 400px;
            padding: 2rem;
        }
        
        .completion-icon {
            margin-bottom: 1.5rem;
        }
        
        .success-icon {
            width: 4rem;
            height: 4rem;
            color: #10b981;
            animation: scaleIn 0.6s ease;
        }
        
        .completion-title {
            font-family: 'Bungee', cursive;
            font-size: 2rem;
            color: #ffffff;
            margin-bottom: 1rem;
            animation: slideUp 0.8s ease;
        }
        
        .completion-message {
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 2rem;
            animation: slideUp 1s ease;
        }
        
        .loading-bar {
            width: 100%;
            height: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            overflow: hidden;
        }
        
        .loading-fill {
            height: 100%;
            background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
            border-radius: 10px;
            width: 0%;
            animation: loadingProgress 5s ease forwards;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes scaleIn {
            from { transform: scale(0); }
            to { transform: scale(1); }
        }
        
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes loadingProgress {
            from { width: 0%; }
            to { width: 95%; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(overlay);
    
    // Reinitialize icons
    lucide.createIcons();
}

document.addEventListener("DOMContentLoaded", () => {
    window.showNotification = showNotification;
    if ("notification" in window && "notification_type" in window) {
        const notification = window.notification;
        const notificationType = window.notification_type;

        if (notification && notificationType) {
            showNotification(notification, notificationType);
            fetch("/clear-notification/", {
                method: "POST",
                headers: {
                    "X-CSRFToken": getCookie('csrftoken'),
                    "Content-Type": "application/json",
                },
            })
            .then(response => {
                if (!response.ok) {
                    console.log("Notification Cleared!");
                }
            })
            .catch(error => {
                console.error("Error clearing notification:", error);
            });
        }
    }
});
