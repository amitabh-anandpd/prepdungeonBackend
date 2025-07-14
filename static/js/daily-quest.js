// Initialize Lucide icons
lucide.createIcons();

// Quest state
let timeRemaining = 67335; // 18:42:15 in seconds
let timerInterval;

// Initialize daily quest page
document.addEventListener('DOMContentLoaded', () => {
    initializeTimer();
    initializeQuestActions();
    initializeRefreshButton();
    animateElements();
});

function initializeTimer() {
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        if (timeRemaining <= 0) {
            // Reset to 24 hours when timer reaches 0
            timeRemaining = 86400;
            refreshDailyQuests();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;
    
    const timeDisplay = document.getElementById('time-remaining');
    if (timeDisplay) {
        timeDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

function initializeQuestActions() {
    const questActionBtns = document.querySelectorAll('.quest-action-btn:not(.completed)');
    
    questActionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const questScroll = btn.closest('.quest-scroll');
            const questType = questScroll.getAttribute('data-quest');
            
            handleQuestAction(questType, btn);
        });
    });
}

function handleQuestAction(questType, button) {
    switch (questType) {
        case 'test':
            showActionNotification('Redirecting to Test Center...');
            setTimeout(() => {
                window.location.href = 'test-center.html';
            }, 1500);
            break;
        case 'upload':
            showActionNotification('Opening Study Guide...');
            setTimeout(() => {
                window.location.href = 'study-guide.html';
            }, 1500);
            break;
        default:
            showActionNotification('Quest action initiated!');
    }
}

function initializeRefreshButton() {
    const refreshBtn = document.getElementById('refresh-quests');
    
    refreshBtn.addEventListener('click', () => {
        const refreshCount = parseInt(refreshBtn.querySelector('span').textContent.match(/\d+/)[0]);
        
        if (refreshCount > 0) {
            showRefreshAnimation();
            
            setTimeout(() => {
                // Update refresh count
                refreshBtn.querySelector('span').textContent = `Refresh (${refreshCount - 1} left)`;
                
                if (refreshCount - 1 === 0) {
                    refreshBtn.disabled = true;
                    refreshBtn.style.opacity = '0.5';
                }
                
                // Generate new quests
                generateNewQuests();
                
                showActionNotification('Daily quests refreshed!');
            }, 2000);
        }
    });
}

function showRefreshAnimation() {
    const refreshIcon = document.querySelector('#refresh-quests .btn-icon');
    refreshIcon.style.animation = 'spin 2s linear';
    
    setTimeout(() => {
        refreshIcon.style.animation = '';
    }, 2000);
}

function generateNewQuests() {
    const questBoard = document.querySelector('.quest-board');
    const activeQuests = questBoard.querySelectorAll('.quest-scroll.active');
    
    const newQuests = [
        {
            rank: 'B',
            title: 'Study for 30 minutes',
            description: 'Spend at least 30 minutes studying any subject',
            progress: 0,
            total: 1,
            rewards: [
                { icon: 'zap', value: '+40 XP' },
                { icon: 'star', value: '+12 CP' }
            ]
        },
        {
            rank: 'A',
            title: 'Score 85%+ on any test',
            description: 'Achieve a high score to demonstrate mastery',
            progress: 0,
            total: 1,
            rewards: [
                { icon: 'zap', value: '+60 XP' },
                { icon: 'star', value: '+20 CP' },
                { icon: 'trophy', value: 'High Score Badge' }
            ]
        }
    ];
    
    // Replace active quests with new ones
    activeQuests.forEach((quest, index) => {
        if (newQuests[index]) {
            updateQuestContent(quest, newQuests[index]);
        }
    });
}

function updateQuestContent(questElement, questData) {
    const questRank = questElement.querySelector('.quest-rank');
    const questTitle = questElement.querySelector('.quest-title');
    const questDescription = questElement.querySelector('.quest-description');
    const progressFill = questElement.querySelector('.progress-fill');
    const progressText = questElement.querySelector('.progress-text');
    const rewardsContainer = questElement.querySelector('.quest-rewards');
    
    questRank.textContent = questData.rank;
    questTitle.textContent = questData.title;
    questDescription.textContent = questData.description;
    
    const progressPercentage = (questData.progress / questData.total) * 100;
    progressFill.style.width = `${progressPercentage}%`;
    progressText.textContent = `${questData.progress} / ${questData.total} ${questData.title.includes('Test') ? 'Tests' : 'Tasks'}`;
    
    // Update rewards
    rewardsContainer.innerHTML = '';
    questData.rewards.forEach(reward => {
        const rewardItem = document.createElement('div');
        rewardItem.className = 'reward-item';
        rewardItem.innerHTML = `
            <i data-lucide="${reward.icon}" class="reward-icon"></i>
            <span>${reward.value}</span>
        `;
        rewardsContainer.appendChild(rewardItem);
    });
    
    lucide.createIcons();
}

function refreshDailyQuests() {
    showActionNotification('New daily quests available!');
    
    // Reset all quest progress
    const activeQuests = document.querySelectorAll('.quest-scroll.active');
    activeQuests.forEach(quest => {
        const progressFill = quest.querySelector('.progress-fill');
        const progressText = quest.querySelector('.progress-text');
        
        progressFill.style.width = '0%';
        progressText.textContent = progressText.textContent.replace(/\d+/, '0');
    });
    
    // Reset refresh button
    const refreshBtn = document.getElementById('refresh-quests');
    refreshBtn.querySelector('span').textContent = 'Refresh (1 left)';
    refreshBtn.disabled = false;
    refreshBtn.style.opacity = '1';
}

// Quest completion simulation
function completeQuest(questType) {
    const questScroll = document.querySelector(`[data-quest="${questType}"]`);
    if (!questScroll || questScroll.classList.contains('completed')) return;
    
    // Update quest to completed state
    questScroll.classList.remove('active');
    questScroll.classList.add('completed');
    
    const questStatus = questScroll.querySelector('.quest-status');
    const progressFill = questScroll.querySelector('.progress-fill');
    const progressText = questScroll.querySelector('.progress-text');
    const actionBtn = questScroll.querySelector('.quest-action-btn');
    
    questStatus.textContent = 'Completed';
    progressFill.style.width = '100%';
    progressFill.classList.add('completed');
    progressText.textContent = 'Completed!';
    
    actionBtn.classList.add('completed');
    actionBtn.innerHTML = '<i data-lucide="check" class="btn-icon"></i> Completed';
    
    // Show completion modal
    showQuestCompletionModal(questType);
    
    lucide.createIcons();
}

function showQuestCompletionModal(questType) {
    const modal = document.getElementById('quest-completion-modal');
    const questName = modal.querySelector('.quest-name');
    const rewardsList = modal.querySelector('.reward-list');
    
    // Update modal content based on quest type
    const questData = getQuestData(questType);
    questName.textContent = questData.title;
    
    rewardsList.innerHTML = '';
    questData.rewards.forEach(reward => {
        const rewardItem = document.createElement('div');
        rewardItem.className = 'reward-item';
        rewardItem.innerHTML = `
            <i data-lucide="${reward.icon}" class="reward-icon"></i>
            <span>${reward.value}</span>
        `;
        rewardsList.appendChild(rewardItem);
    });
    
    // Show modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    lucide.createIcons();
}

function getQuestData(questType) {
    const questDatabase = {
        'test': {
            title: 'Complete 1 Test',
            rewards: [
                { icon: 'zap', value: '+50 XP' },
                { icon: 'star', value: '+15 CP' }
            ]
        },
        'score': {
            title: 'Score 90%+ in any test',
            rewards: [
                { icon: 'zap', value: '+75 XP' },
                { icon: 'star', value: '+25 CP' },
                { icon: 'crown', value: 'Excellence Badge' }
            ]
        },
        'upload': {
            title: 'Upload study material',
            rewards: [
                { icon: 'zap', value: '+30 XP' },
                { icon: 'star', value: '+10 CP' }
            ]
        }
    };
    
    return questDatabase[questType] || questDatabase['test'];
}

// Modal close functionality
document.addEventListener('DOMContentLoaded', () => {
    const closeModalBtn = document.getElementById('close-quest-modal');
    const modal = document.getElementById('quest-completion-modal');
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }
        });
    }
});

// Simulate quest completion for demo
setTimeout(() => {
    // Simulate completing the test quest after 5 seconds
    // completeQuest('test');
}, 5000);

function showActionNotification(message) {
    showNotification(message, 'info');
}

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

function animateElements() {
    const questScrolls = document.querySelectorAll('.quest-scroll');
    const achievementCards = document.querySelectorAll('.achievement-card');
    
    // Animate quest scrolls
    questScrolls.forEach((scroll, index) => {
        scroll.style.opacity = '0';
        scroll.style.transform = 'translateY(30px)';
        scroll.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            scroll.style.opacity = '1';
            scroll.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Animate achievement cards
    setTimeout(() => {
        achievementCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateX(-20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateX(0)';
            }, index * 150);
        });
    }, 800);
}