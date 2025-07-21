// Initialize Lucide icons
lucide.createIcons();

// Results state
let testResults = {
    score: 85,
    correctAnswers: 17,
    totalQuestions: 20,
    timeTaken: 272, // seconds
    testType: 'MCQ',
    subject: 'Mathematics',
    topicBreakdown: {
        'Algebra': { correct: 6, total: 6, percentage: 100 },
        'Calculus': { correct: 7, total: 9, percentage: 78 },
        'Statistics': { correct: 4, total: 5, percentage: 80 }
    }
};

// Initialize results page
document.addEventListener('DOMContentLoaded', () => {
    loadTestResults();
    initializeFilters();
    initializeActionButtons();
    animateResults();
});

function loadTestResults() {
    // Try to load results from localStorage
    const storedResults = localStorage.getItem('testResults');
    if (storedResults) {
        testResults = { ...testResults, ...JSON.parse(storedResults) };
    }
    
    updateResultsDisplay();
}

function updateResultsDisplay() {
    // Update main score
    const mainScore = document.getElementById('main-score');
    const correctAnswers = document.getElementById('correct-answers');
    const timeTaken = document.getElementById('time-taken');
    const accuracy = document.getElementById('accuracy');
    
    if (mainScore) mainScore.textContent = `${testResults.score}%`;
    if (correctAnswers) correctAnswers.textContent = `${testResults.correctAnswers} / ${testResults.totalQuestions}`;
    if (timeTaken) timeTaken.textContent = formatTime(testResults.timeTaken);
    if (accuracy) accuracy.textContent = `${testResults.score}%`;
    
    // Update score circle
    updateScoreCircle(testResults.score);
    
    // Update score badge
    updateScoreBadge(testResults.score);
    
    // Update topic breakdown
    updateTopicBreakdown();
    
    // Update rewards
    updateRewards();
}

function updateScoreCircle(score) {
    const circle = document.querySelector('.progress-ring-fill');
    if (circle) {
        const circumference = 2 * Math.PI * 50; // radius = 50
        const offset = circumference - (score / 100) * circumference;
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = offset;
    }
}

function updateScoreBadge(score) {
    const badge = document.querySelector('.score-badge');
    if (badge) {
        let badgeText = '';
        let badgeClass = '';
        
        if (score >= 90) {
            badgeText = 'Excellent';
            badgeClass = 'excellent';
        } else if (score >= 80) {
            badgeText = 'Very Good';
            badgeClass = 'very-good';
        } else if (score >= 70) {
            badgeText = 'Good';
            badgeClass = 'good';
        } else if (score >= 60) {
            badgeText = 'Fair';
            badgeClass = 'fair';
        } else {
            badgeText = 'Needs Improvement';
            badgeClass = 'poor';
        }
        
        badge.textContent = badgeText;
        badge.className = `score-badge ${badgeClass}`;
    }
}

function updateTopicBreakdown() {
    const topicItems = document.querySelectorAll('.topic-item');
    const topics = Object.keys(testResults.topicBreakdown);
    
    topicItems.forEach((item, index) => {
        if (topics[index]) {
            const topic = testResults.topicBreakdown[topics[index]];
            const topicName = item.querySelector('.topic-name');
            const topicScore = item.querySelector('.topic-score');
            const topicFill = item.querySelector('.topic-fill');
            const topicQuestions = item.querySelector('.topic-questions');
            
            if (topicName) topicName.textContent = topics[index];
            if (topicScore) topicScore.textContent = `${topic.percentage}%`;
            if (topicFill) {
                topicFill.style.width = `${topic.percentage}%`;
                // Update class based on performance
                topicFill.className = `topic-fill ${getPerformanceClass(topic.percentage)}`;
            }
            if (topicQuestions) topicQuestions.textContent = `${topic.correct}/${topic.total} correct`;
        }
    });
}

function getPerformanceClass(percentage) {
    if (percentage >= 90) return 'excellent';
    if (percentage >= 80) return 'very-good';
    if (percentage >= 70) return 'good';
    if (percentage >= 60) return 'fair';
    return 'poor';
}

function updateRewards() {
    // Calculate XP based on score
    const baseXP = 50;
    const bonusXP = Math.floor((testResults.score - 50) / 10) * 5;
    const totalXP = Math.max(baseXP + bonusXP, 25);
    
    // Calculate CP based on performance
    const baseCp = 15;
    const bonusCP = testResults.score >= 80 ? 10 : 5;
    const totalCP = baseCp + bonusCP;
    
    // Update reward displays
    const xpReward = document.querySelector('.reward-item:nth-child(1) .reward-amount');
    const cpReward = document.querySelector('.reward-item:nth-child(2) .reward-amount');
    
    if (xpReward) xpReward.textContent = `+${totalXP} XP`;
    if (cpReward) cpReward.textContent = `+${totalCP} CP`;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
}

function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const questionItems = document.querySelectorAll('.question-item');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active filter
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            // Filter questions
            questionItems.forEach(item => {
                if (filter === 'all') {
                    item.style.display = 'block';
                } else {
                    if (item.classList.contains(filter)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                }
            });
        });
    });
}

function initializeActionButtons() {
    const retakeBtn = document.getElementById('retake-test');
    const shareBtn = document.getElementById('share-results');
    const continueBtn = document.getElementById('continue-learning');
    
    if (retakeBtn) {
        retakeBtn.addEventListener('click', () => {
            showConfirmationModal('Retake Test', 'Are you sure you want to retake this test? Your current score will be replaced.', () => {
                showNotification('Redirecting to test...', 'info');
                setTimeout(() => {
                    window.location.href = 'test-center.html';
                }, 1500);
            });
        });
    }
    
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            shareResults();
        });
    }
    
    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            showNotification('Redirecting to dashboard...', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        });
    }
    
    // Recommendation action buttons
    const recActionBtns = document.querySelectorAll('.rec-action-btn');
    recActionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const actionText = btn.textContent.trim();
            
            if (actionText.includes('Study Session')) {
                showNotification('Opening study materials...', 'info');
                setTimeout(() => {
                    window.location.href = 'study-guide.html';
                }, 1500);
            } else if (actionText.includes('Speed Test')) {
                showNotification('Preparing speed test...', 'info');
                setTimeout(() => {
                    window.location.href = 'test-speed.html';
                }, 1500);
            } else if (actionText.includes('Study Group')) {
                showNotification('Study groups feature coming soon!', 'info');
            }
        });
    });
}

function shareResults() {
    if (navigator.share) {
        navigator.share({
            title: 'My PrepDungeon Test Results',
            text: `I scored ${testResults.score}% on my ${testResults.subject} test!`,
            url: window.location.href
        }).catch(console.error);
    } else {
        // Fallback: copy to clipboard
        const shareText = `I scored ${testResults.score}% on my ${testResults.subject} test on PrepDungeon! 🎉`;
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('Results copied to clipboard!', 'success');
        }).catch(() => {
            showNotification('Unable to share results', 'error');
        });
    }
}

function showConfirmationModal(title, message, onConfirm) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-container confirmation-modal">
            <div class="confirmation-card">
                <div class="confirmation-header">
                    <i data-lucide="help-circle" class="confirmation-icon"></i>
                    <h3 class="confirmation-title">${title}</h3>
                    <p class="confirmation-message">${message}</p>
                </div>
                
                <div class="confirmation-actions">
                    <button class="action-btn secondary cancel-btn">Cancel</button>
                    <button class="action-btn primary confirm-btn">Confirm</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Event listeners
    const cancelBtn = modal.querySelector('.cancel-btn');
    const confirmBtn = modal.querySelector('.confirm-btn');
    
    cancelBtn.addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = 'auto';
    });
    
    confirmBtn.addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = 'auto';
        onConfirm();
    });
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = 'auto';
        }
    });
    
    lucide.createIcons();
}

function animateResults() {
    // Animate score circle
    setTimeout(() => {
        updateScoreCircle(testResults.score);
    }, 500);
    
    // Animate topic bars
    setTimeout(() => {
        const topicFills = document.querySelectorAll('.topic-fill');
        topicFills.forEach((fill, index) => {
            const width = fill.style.width;
            fill.style.width = '0%';
            setTimeout(() => {
                fill.style.width = width;
            }, index * 200);
        });
    }, 1000);
    
    // Animate cards
    const cards = document.querySelectorAll('.score-card, .performance-card, .rewards-card, .analysis-card, .recommendation-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
    });
    
    // Animate question items
    setTimeout(() => {
        const questionItems = document.querySelectorAll('.question-item');
        questionItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 100);
        });
    }, 2000);
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