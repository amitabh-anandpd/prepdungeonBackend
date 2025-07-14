// Initialize Lucide icons
lucide.createIcons();

// Tab switching functionality
const tabButtons = document.querySelectorAll('.tab-btn');
const authForms = document.querySelectorAll('.auth-form');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        
        // Remove active class from all tabs and forms
        tabButtons.forEach(btn => btn.classList.remove('active'));
        authForms.forEach(form => form.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding form
        button.classList.add('active');
        document.getElementById(`${targetTab}-form`).classList.add('active');
    });
});

// Password visibility toggle
const togglePasswordButtons = document.querySelectorAll('.toggle-password');

togglePasswordButtons.forEach(button => {
    button.addEventListener('click', () => {
        const input = button.previousElementSibling;
        const icon = button.querySelector('.eye-icon');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.setAttribute('data-lucide', 'eye-off');
        } else {
            input.type = 'password';
            icon.setAttribute('data-lucide', 'eye');
        }
        
        // Reinitialize Lucide icons to update the changed icon
        lucide.createIcons();
    });
});

// Form validation and submission
const forms = document.querySelectorAll('.form');

forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const isLoginForm = form.closest('#login-form');
        
        // Basic validation
        const inputs = form.querySelectorAll('.form-input[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#ef4444';
                setTimeout(() => {
                    input.style.borderColor = '';
                }, 3000);
            }
        });
        
        if (!isValid) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Email validation
        const emailInput = form.querySelector('input[type="email"]');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(emailInput.value)) {
            emailInput.style.borderColor = '#ef4444';
            showNotification('Please enter a valid email address', 'error');
            setTimeout(() => {
                emailInput.style.borderColor = '';
            }, 3000);
            return;
        }
        
        // Password confirmation for signup
        if (!isLoginForm) {
            const password = form.querySelector('input[placeholder="Create a password"]').value;
            const confirmPassword = form.querySelector('input[placeholder="Confirm your password"]').value;
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            if (password.length < 8) {
                showNotification('Password must be at least 8 characters long', 'error');
                return;
            }
        }
        
        // Simulate form submission
        const submitButton = form.querySelector('.auth-btn');
        const originalText = submitButton.innerHTML;
        
        submitButton.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Processing...';
        submitButton.disabled = true;
        
        // Reinitialize icons for the loader
        lucide.createIcons();
        
        setTimeout(() => {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            lucide.createIcons();
            
            if (isLoginForm) {
                showNotification('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                showNotification('Account created successfully! Please check your email to verify your account.', 'success');
                // Switch to login tab after successful signup
                setTimeout(() => {
                    document.querySelector('[data-tab="login"]').click();
                }, 2000);
            }
        }, 2000);
    });
});

// Social login buttons
const socialButtons = document.querySelectorAll('.social-btn');

socialButtons.forEach(button => {
    button.addEventListener('click', () => {
        const provider = button.textContent.trim();
        showNotification(`${provider} authentication coming soon!`, 'info');
    });
});

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
    
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 2rem;
            right: 2rem;
            z-index: 9999;
            max-width: 400px;
            background: rgba(31, 41, 55, 0.95);
            backdrop-filter: blur(24px);
            border-radius: 0.75rem;
            border: 1px solid rgba(55, 65, 81, 0.5);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
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
            color: #3b82f6;
        }
        
        .notification-message {
            color: #ffffff;
            font-size: 0.875rem;
            flex: 1;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: #6b7280;
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
        
        @media (max-width: 640px) {
            .notification {
                top: 1rem;
                right: 1rem;
                left: 1rem;
                max-width: none;
            }
        }
    `;
    
    if (!document.querySelector('style[data-notification-styles]')) {
        style.setAttribute('data-notification-styles', '');
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

// Add CSS for spinning animation
const spinStyle = document.createElement('style');
spinStyle.textContent = `
    .animate-spin {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
`;
document.head.appendChild(spinStyle);

// Smooth scrolling and focus management
document.addEventListener('DOMContentLoaded', () => {
    // Focus first input when form becomes active
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.classList.contains('auth-form') && target.classList.contains('active')) {
                    const firstInput = target.querySelector('.form-input');
                    if (firstInput) {
                        setTimeout(() => firstInput.focus(), 100);
                    }
                }
            }
        });
    });
    
    authForms.forEach(form => {
        observer.observe(form, { attributes: true });
    });
    
    // Focus first input on page load
    const activeForm = document.querySelector('.auth-form.active');
    if (activeForm) {
        const firstInput = activeForm.querySelector('.form-input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 500);
        }
    }
});