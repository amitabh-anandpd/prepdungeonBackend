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

const socialButtons = document.querySelectorAll('.social-btn');

socialButtons.forEach(button => {
    button.addEventListener('click', () => {
        const provider = button.textContent.trim();
        showNotification(`${provider} authentication coming soon!`, 'info');
    });
});

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