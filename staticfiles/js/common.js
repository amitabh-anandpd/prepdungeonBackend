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

document.addEventListener("DOMContentLoaded", () => {
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
