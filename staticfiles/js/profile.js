// Initialize Lucide icons
lucide.createIcons();

// Profile state
let profileData = {
    name: 'Scholar Adventurer',
    email: 'scholar@prepdungeon.com',
    college: 'Tech University',
    branch: 'computer-science',
    year: '3',
    preferredTestType: 'mcq',
    dailyGoal: '60',
    notifications: true,
    autoSchedule: false,
    theme: 'dark',
    animations: true,
    reduceMotion: false
};

// Initialize profile page
document.addEventListener('DOMContentLoaded', () => {
    initializeSettings();
    initializeThemeOptions();
    animateElements();
    updateProfileStats();
});

function initializeSettings() {
    const saveButtons = document.querySelectorAll('.save-btn');
    
    saveButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const settingsCard = btn.closest('.settings-card');
            const cardTitle = settingsCard.querySelector('.card-title').textContent;
            
            handleSettingsSave(cardTitle, settingsCard);
        });
    });
    
    // Initialize form values
    populateFormValues();
}

function populateFormValues() {
    // Academic info
    const collegeInput = document.querySelector('input[value="Tech University"]');
    const branchSelect = document.querySelector('select option[value="computer-science"]');
    const yearSelect = document.querySelector('select option[value="3"]');
    
    if (branchSelect) branchSelect.selected = true;
    if (yearSelect) yearSelect.selected = true;
    
    // Study preferences
    const testTypeSelect = document.querySelector('select option[value="mcq"]');
    const goalSelect = document.querySelector('select option[value="60"]');
    
    if (testTypeSelect) testTypeSelect.selected = true;
    if (goalSelect) goalSelect.selected = true;
    
    // Toggle states
    const notificationToggle = document.querySelector('.toggle-input');
    if (notificationToggle) notificationToggle.checked = profileData.notifications;
    
    // Theme selection
    const themeRadio = document.querySelector('input[value="dark"]');
    if (themeRadio) themeRadio.checked = true;
}

function handleSettingsSave(cardTitle, settingsCard) {
    const button = settingsCard.querySelector('.save-btn');
    const originalText = button.innerHTML;
    
    // Show loading state
    button.innerHTML = '<i data-lucide="loader-2" class="btn-icon animate-spin"></i> Saving...';
    button.disabled = true;
    
    // Simulate save operation
    setTimeout(() => {
        // Update profile data based on card type
        updateProfileData(cardTitle, settingsCard);
        
        // Show success state
        button.innerHTML = '<i data-lucide="check" class="btn-icon"></i> Saved!';
        
        // Reset button after 2 seconds
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
            lucide.createIcons();
        }, 2000);
        
        // Show success notification
        showNotification(`${cardTitle} updated successfully!`, 'success');
        
        lucide.createIcons();
    }, 1500);
}

function updateProfileData(cardTitle, settingsCard) {
    switch (cardTitle) {
        case 'Academic Information':
            const college = settingsCard.querySelector('input[placeholder="Enter your institution"]').value;
            const branch = settingsCard.querySelector('select').value;
            const year = settingsCard.querySelectorAll('select')[1].value;
            
            profileData.college = college || profileData.college;
            profileData.branch = branch;
            profileData.year = year;
            break;
            
        case 'Study Preferences':
            const testType = settingsCard.querySelector('select').value;
            const goal = settingsCard.querySelectorAll('select')[1].value;
            const notifications = settingsCard.querySelector('.toggle-input').checked;
            const autoSchedule = settingsCard.querySelectorAll('.toggle-input')[1].checked;
            
            profileData.preferredTestType = testType;
            profileData.dailyGoal = goal;
            profileData.notifications = notifications;
            profileData.autoSchedule = autoSchedule;
            break;
            
        case 'Appearance':
            const selectedTheme = settingsCard.querySelector('input[name="theme"]:checked').value;
            const animations = settingsCard.querySelector('.toggle-input').checked;
            const reduceMotion = settingsCard.querySelectorAll('.toggle-input')[1].checked;
            
            profileData.theme = selectedTheme;
            profileData.animations = animations;
            profileData.reduceMotion = reduceMotion;
            
            applyTheme(selectedTheme);
            break;
    }
}

function initializeThemeOptions() {
    const themeOptions = document.querySelectorAll('.theme-option input');
    
    themeOptions.forEach(option => {
        option.addEventListener('change', (e) => {
            if (e.target.checked) {
                previewTheme(e.target.value);
            }
        });
    });
}

function previewTheme(theme) {
    // Add theme preview class to body
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${theme}`);
    
    showNotification(`Theme preview: ${theme.charAt(0).toUpperCase() + theme.slice(1)} mode`, 'info');
}

function applyTheme(theme) {
    // Apply theme permanently
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${theme}`);
    
    // Store in localStorage
    localStorage.setItem('theme', theme);
}

function updateProfileStats() {
    // Animate stat values
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach(stat => {
        const finalValue = stat.textContent;
        const isNumeric = /^\d+/.test(finalValue);
        
        if (isNumeric) {
            const numericValue = parseInt(finalValue);
            animateCounter(stat, 0, numericValue, 1000);
        }
    });
    
    // Animate XP bar
    setTimeout(() => {
        const xpFill = document.querySelector('.xp-fill');
        if (xpFill) {
            const width = xpFill.style.width;
            xpFill.style.width = '0%';
            setTimeout(() => {
                xpFill.style.width = width;
            }, 500);
        }
    }, 500);
    
    // Animate badge progress bars
    setTimeout(() => {
        const progressBars = document.querySelectorAll('.badge-progress .progress-fill');
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }, 1000);
}

function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    const suffix = element.textContent.replace(/^\d+/, '');
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function animateElements() {
    const statCards = document.querySelectorAll('.stat-card');
    const badgeCards = document.querySelectorAll('.badge-card');
    const settingsCards = document.querySelectorAll('.settings-card');
    
    // Animate stat cards
    statCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Animate badge cards
    setTimeout(() => {
        badgeCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, index * 150);
        });
    }, 600);
    
    // Animate settings cards
    setTimeout(() => {
        settingsCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateX(-20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateX(0)';
            }, index * 200);
        });
    }, 1200);
}

// Avatar edit functionality
document.addEventListener('DOMContentLoaded', () => {
    const avatarEditBtn = document.querySelector('.avatar-edit-btn');
    
    if (avatarEditBtn) {
        avatarEditBtn.addEventListener('click', () => {
            showNotification('Avatar upload feature coming soon!', 'info');
        });
    }
});

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