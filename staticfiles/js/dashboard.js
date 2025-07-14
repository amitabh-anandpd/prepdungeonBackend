// Initialize Lucide icons
lucide.createIcons();

// Dashboard state
let focusTimer = null;
let focusTimeRemaining = 1500; // 25 minutes in seconds

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
    animateElements();
});

function initializeDashboard() {
    // Check if user has completed onboarding
    const learningPath = localStorage.getItem('learningPath');
    if (!learningPath) {
        // Redirect to onboarding if not completed
        window.location.href = 'onboarding.html';
        return;
    }
    
    // Initialize components
    initializeTasks();
    initializeFocusMode();
    initializeAlerts();
    updateUserStats();
}

// Task management
function initializeTasks() {
    const taskItems = document.querySelectorAll('.task-item:not(.completed)');
    
    taskItems.forEach(task => {
        task.addEventListener('click', () => {
            toggleTask(task);
        });
    });
}

function toggleTask(taskElement) {
    const checkbox = taskElement.querySelector('.task-checkbox');
    const taskName = taskElement.querySelector('.task-name');
    
    if (!taskElement.classList.contains('completed')) {
        // Mark as completed
        taskElement.classList.add('completed');
        checkbox.innerHTML = '<i data-lucide="check" class="check-icon"></i>';
        
        // Show completion notification
        const reward = taskElement.querySelector('.task-reward').textContent;
        showTaskCompletion(taskName.textContent, reward);
        
        // Update XP
        updateXP(parseInt(reward.replace('+', '').replace(' XP', '')));
        
        // Reinitialize icons
        lucide.createIcons();
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

// Focus mode functionality
function initializeFocusMode() {
    const focusBtn = document.querySelector('.focus-btn');
    const timerText = document.querySelector('.timer-text');
    
    focusBtn.addEventListener('click', () => {
        if (focusTimer) {
            // Stop focus session
            clearInterval(focusTimer);
            focusTimer = null;
            focusBtn.innerHTML = '<i data-lucide="play" class="btn-icon"></i> Start Focus Session';
            focusTimeRemaining = 1500; // Reset to 25 minutes
            timerText.textContent = '25:00';
        } else {
            // Start focus session
            startFocusSession();
        }
        lucide.createIcons();
    });
}

function startFocusSession() {
    const focusBtn = document.querySelector('.focus-btn');
    const timerText = document.querySelector('.timer-text');
    
    focusBtn.innerHTML = '<i data-lucide="pause" class="btn-icon"></i> Stop Session';
    
    focusTimer = setInterval(() => {
        focusTimeRemaining--;
        
        const minutes = Math.floor(focusTimeRemaining / 60);
        const seconds = focusTimeRemaining % 60;
        timerText.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (focusTimeRemaining <= 0) {
            // Focus session completed
            clearInterval(focusTimer);
            focusTimer = null;
            completeFocusSession();
        }
    }, 1000);
    
    lucide.createIcons();
}

function completeFocusSession() {
    const focusBtn = document.querySelector('.focus-btn');
    const timerText = document.querySelector('.timer-text');
    
    focusBtn.innerHTML = '<i data-lucide="check" class="btn-icon"></i> Session Complete!';
    timerText.textContent = '00:00';
    
    // Show completion notification
    showFocusCompletion();
    
    // Update XP
    updateXP(50);
    
    // Reset after 3 seconds
    setTimeout(() => {
        focusBtn.innerHTML = '<i data-lucide="play" class="btn-icon"></i> Start Focus Session';
        timerText.textContent = '25:00';
        focusTimeRemaining = 1500;
        lucide.createIcons();
    }, 3000);
    
    lucide.createIcons();
}

function showFocusCompletion() {
    const notification = document.createElement('div');
    notification.className = 'focus-completion-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                <i data-lucide="zap" class="focus-icon"></i>
            </div>
            <div class="notification-text">
                <h4>Focus Session Complete!</h4>
                <p>Great job staying focused for 25 minutes!</p>
                <div class="rewards">
                    <span class="reward-item">+50 XP</span>
                    <span class="reward-item">+10 CP</span>
                </div>
            </div>
        </div>
    `;
    
    // Add focus notification styles
    if (!document.querySelector('style[data-focus-notification]')) {
        const style = document.createElement('style');
        style.setAttribute('data-focus-notification', '');
        style.textContent = `
            .focus-completion-notification {
                position: fixed;
                top: 2rem;
                right: 2rem;
                background: linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(236, 72, 153, 0.9) 100%);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(139, 92, 246, 0.3);
                border-radius: 15px;
                padding: 1rem;
                z-index: 9999;
                animation: slideInRight 0.5s ease, fadeOut 0.5s ease 3.5s;
                max-width: 320px;
            }
            
            .focus-icon {
                width: 1.5rem;
                height: 1.5rem;
                color: #ffffff;
            }
            
            .rewards {
                display: flex;
                gap: 1rem;
                margin-top: 0.5rem;
            }
            
            .reward-item {
                background: rgba(255, 255, 255, 0.2);
                color: #ffffff;
                padding: 0.25rem 0.75rem;
                border-radius: 20px;
                font-size: 0.875rem;
                font-weight: 600;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    lucide.createIcons();
    
    // Remove notification after animation
    setTimeout(() => {
        notification.remove();
    }, 4000);
}

// Alert management
function initializeAlerts() {
    const alertActions = document.querySelectorAll('.alert-action');
    
    alertActions.forEach(action => {
        action.addEventListener('click', (e) => {
            e.preventDefault();
            const alertItem = action.closest('.alert-item');
            const subject = alertItem.querySelector('.alert-subject').textContent;
            const topic = alertItem.querySelector('.alert-topic').textContent;
            
            // Simulate navigation to practice/review
            showActionNotification(`Starting ${action.textContent.toLowerCase()} for ${subject} - ${topic}`);
        });
    });
}

function showActionNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'action-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i data-lucide="arrow-right" class="action-icon"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add action notification styles
    if (!document.querySelector('style[data-action-notification]')) {
        const style = document.createElement('style');
        style.setAttribute('data-action-notification', '');
        style.textContent = `
            .action-notification {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                background: rgba(59, 130, 246, 0.9);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(59, 130, 246, 0.3);
                border-radius: 15px;
                padding: 1rem;
                z-index: 9999;
                animation: slideInUp 0.5s ease, fadeOut 0.5s ease 2.5s;
                max-width: 300px;
            }
            
            .action-notification .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                color: #ffffff;
                font-weight: 500;
            }
            
            .action-icon {
                width: 1.25rem;
                height: 1.25rem;
                color: #ffffff;
            }
            
            @keyframes slideInUp {
                from { transform: translateY(100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
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

// XP and stats management
function updateXP(xpGained) {
    const xpValue = document.querySelector('.xp-value');
    const xpFill = document.querySelector('.xp-fill');
    const xpNext = document.querySelector('.xp-next');
    
    // Get current XP from display
    const currentXPText = xpValue.textContent;
    const [current, max] = currentXPText.split(' / ').map(str => parseInt(str.replace(' XP', '')));
    
    const newCurrent = current + xpGained;
    const newPercentage = (newCurrent / max) * 100;
    
    // Update display
    xpValue.textContent = `${newCurrent} / ${max} XP`;
    xpFill.style.width = `${Math.min(newPercentage, 100)}%`;
    xpNext.textContent = `${Math.max(0, max - newCurrent)} XP to Level 4`;
    
    // Check for level up
    if (newCurrent >= max) {
        showLevelUp();
    }
}

function showLevelUp() {
    const notification = document.createElement('div');
    notification.className = 'levelup-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <div class="levelup-icon">
                <i data-lucide="star" class="star-icon"></i>
            </div>
            <div class="levelup-text">
                <h3>LEVEL UP!</h3>
                <p>You've reached Level 4!</p>
                <span class="level-badge">Lv. 4</span>
            </div>
        </div>
    `;
    
    // Add levelup notification styles
    if (!document.querySelector('style[data-levelup-notification]')) {
        const style = document.createElement('style');
        style.setAttribute('data-levelup-notification', '');
        style.textContent = `
            .levelup-notification {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, rgba(255, 215, 0, 0.9) 0%, rgba(255, 193, 7, 0.9) 100%);
                backdrop-filter: blur(20px);
                border: 2px solid rgba(255, 215, 0, 0.5);
                border-radius: 20px;
                padding: 2rem;
                z-index: 9999;
                animation: levelUpAnimation 3s ease;
                text-align: center;
                box-shadow: 0 0 50px rgba(255, 215, 0, 0.5);
            }
            
            .levelup-icon {
                margin-bottom: 1rem;
            }
            
            .star-icon {
                width: 3rem;
                height: 3rem;
                color: #ffffff;
                animation: spin 2s linear infinite;
            }
            
            .levelup-text h3 {
                font-family: 'Bungee', cursive;
                font-size: 2rem;
                color: #ffffff;
                margin-bottom: 0.5rem;
                text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            }
            
            .levelup-text p {
                color: rgba(255, 255, 255, 0.9);
                margin-bottom: 1rem;
            }
            
            .level-badge {
                background: rgba(255, 255, 255, 0.2);
                color: #ffffff;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                font-weight: 700;
                font-size: 1.125rem;
            }
            
            @keyframes levelUpAnimation {
                0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                20% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
                80% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(0.9); opacity: 0; }
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

function updateUserStats() {
    // Update user stats in navigation
    const userStatValues = document.querySelectorAll('.user-stats .stat-value');
    // This would typically fetch from a backend API
    // For now, we'll use placeholder values
}

// Animation functions
function animateElements() {
    const cards = document.querySelectorAll('.dashboard-card');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
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
    }, 800);
}