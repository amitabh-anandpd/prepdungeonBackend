// Initialize Lucide icons
lucide.createIcons();

// Screening state
let screeningData = {
    completed: ['mathematics', 'dbms', 'networks'],
    pending: ['os', 'dsa', 'se'],
    scores: {
        mathematics: 85,
        dbms: 72,
        networks: 78
    }
};

// Initialize screening page
document.addEventListener('DOMContentLoaded', () => {
    initializeSubjectCards();
    initializeRecommendations();
    animateElements();
    updateProgressStats();
});

function initializeSubjectCards() {
    const actionButtons = document.querySelectorAll('.action-btn');
    
    actionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const subjectCard = btn.closest('.subject-card');
            const subjectName = subjectCard.querySelector('.subject-name').textContent;
            const actionType = btn.textContent.trim();
            
            handleSubjectAction(subjectName, actionType, btn);
        });
    });
}

function handleSubjectAction(subjectName, actionType, button) {
    switch (actionType) {
        case 'View Results':
            showResultsModal(subjectName);
            break;
        case 'Retake Test':
            showRetakeConfirmation(subjectName);
            break;
        case 'Start Test':
            startScreeningTest(subjectName);
            break;
        default:
            showNotification(`Action "${actionType}" for ${subjectName}`, 'info');
    }
}

function showResultsModal(subjectName) {
    const score = screeningData.scores[subjectName.toLowerCase().replace(/\s+/g, '')] || 0;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-container results-modal">
            <div class="results-detail-card">
                <button class="modal-close">
                    <i data-lucide="x" class="close-icon"></i>
                </button>
                
                <div class="results-header">
                    <h2 class="results-title">${subjectName} - Detailed Results</h2>
                    <div class="score-display large">
                        <span class="score-value">${score}%</span>
                        <span class="score-label">Overall Score</span>
                    </div>
                </div>
                
                <div class="results-breakdown">
                    <h3 class="breakdown-title">Performance Breakdown</h3>
                    <div class="breakdown-grid">
                        ${generateBreakdownData(subjectName, score)}
                    </div>
                </div>
                
                <div class="recommendations">
                    <h3 class="recommendations-title">Recommendations</h3>
                    <div class="recommendation-list">
                        ${generateRecommendations(subjectName, score)}
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button class="action-btn secondary close-modal">Close</button>
                    <button class="action-btn primary retake-test">Retake Test</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Add modal styles
    addModalStyles();
    
    // Event listeners
    const closeButtons = modal.querySelectorAll('.modal-close, .close-modal');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.remove();
            document.body.style.overflow = 'auto';
        });
    });
    
    const retakeBtn = modal.querySelector('.retake-test');
    retakeBtn.addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = 'auto';
        showRetakeConfirmation(subjectName);
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

function generateBreakdownData(subjectName, score) {
    const breakdowns = {
        'Mathematics': [
            { topic: 'Algebra', score: Math.min(100, score + 10) },
            { topic: 'Calculus', score: Math.max(40, score - 15) },
            { topic: 'Statistics', score: Math.min(95, score + 5) }
        ],
        'Database Management': [
            { topic: 'SQL Queries', score: Math.min(90, score + 8) },
            { topic: 'Normalization', score: Math.max(35, score - 25) },
            { topic: 'Transactions', score: Math.min(85, score + 3) }
        ],
        'Computer Networks': [
            { topic: 'OSI Model', score: Math.min(95, score + 12) },
            { topic: 'TCP/IP', score: Math.max(50, score - 10) },
            { topic: 'Routing', score: Math.min(88, score + 2) }
        ]
    };
    
    const data = breakdowns[subjectName] || breakdowns['Mathematics'];
    
    return data.map(item => `
        <div class="breakdown-item">
            <span class="topic-name">${item.topic}</span>
            <div class="topic-score">
                <div class="score-bar">
                    <div class="score-fill" style="width: ${item.score}%"></div>
                </div>
                <span class="score-text">${item.score}%</span>
            </div>
        </div>
    `).join('');
}

function generateRecommendations(subjectName, score) {
    const recommendations = {
        'Mathematics': [
            'Focus on calculus fundamentals - practice derivatives and integrals daily',
            'Review algebra basics to strengthen your foundation',
            'Use visual aids for better understanding of complex concepts'
        ],
        'Database Management': [
            'Practice normalization with real-world examples',
            'Master SQL joins and subqueries through hands-on exercises',
            'Study transaction ACID properties in detail'
        ],
        'Computer Networks': [
            'Memorize OSI layer functions and protocols',
            'Practice subnetting and IP addressing',
            'Understand routing algorithms with network diagrams'
        ]
    };
    
    const recs = recommendations[subjectName] || recommendations['Mathematics'];
    
    return recs.map(rec => `
        <div class="recommendation-item">
            <i data-lucide="lightbulb" class="rec-icon"></i>
            <span>${rec}</span>
        </div>
    `).join('');
}

function showRetakeConfirmation(subjectName) {
    const confirmation = document.createElement('div');
    confirmation.className = 'modal-overlay';
    confirmation.innerHTML = `
        <div class="modal-container confirmation-modal">
            <div class="confirmation-card">
                <div class="confirmation-header">
                    <i data-lucide="refresh-cw" class="confirmation-icon"></i>
                    <h3 class="confirmation-title">Retake ${subjectName} Test?</h3>
                    <p class="confirmation-message">This will replace your current score. Are you sure you want to proceed?</p>
                </div>
                
                <div class="confirmation-actions">
                    <button class="action-btn secondary cancel-retake">Cancel</button>
                    <button class="action-btn primary confirm-retake">Yes, Retake Test</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(confirmation);
    document.body.style.overflow = 'hidden';
    
    // Event listeners
    const cancelBtn = confirmation.querySelector('.cancel-retake');
    const confirmBtn = confirmation.querySelector('.confirm-retake');
    
    cancelBtn.addEventListener('click', () => {
        confirmation.remove();
        document.body.style.overflow = 'auto';
    });
    
    confirmBtn.addEventListener('click', () => {
        confirmation.remove();
        document.body.style.overflow = 'auto';
        startScreeningTest(subjectName);
    });
    
    // Close on outside click
    confirmation.addEventListener('click', (e) => {
        if (e.target === confirmation) {
            confirmation.remove();
            document.body.style.overflow = 'auto';
        }
    });
    
    lucide.createIcons();
}

function startScreeningTest(subjectName) {
    showLoadingNotification(`Preparing ${subjectName} screening test...`);
    
    setTimeout(() => {
        // Redirect to appropriate test page
        const testType = getTestTypeForSubject(subjectName);
        window.location.href = `test-${testType}.html`;
    }, 2000);
}

function getTestTypeForSubject(subjectName) {
    const testTypes = {
        'Mathematics': 'mcq',
        'Database Management': 'conceptual',
        'Computer Networks': 'speed',
        'Operating Systems': 'conceptual',
        'Data Structures & Algorithms': 'mcq',
        'Software Engineering': 'mcq'
    };
    
    return testTypes[subjectName] || 'mcq';
}

function initializeRecommendations() {
    const recButtons = document.querySelectorAll('.rec-btn');
    
    recButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const actionText = btn.textContent.trim();
            
            if (actionText.includes('Study Guide')) {
                showNotification('Redirecting to Study Guide...', 'info');
                setTimeout(() => {
                    window.location.href = 'study-guide.html';
                }, 1500);
            } else if (actionText.includes('Practice Test')) {
                showNotification('Opening practice tests...', 'info');
                setTimeout(() => {
                    window.location.href = 'test-center.html';
                }, 1500);
            } else if (actionText.includes('Start Next Test')) {
                const nextSubject = screeningData.pending[0];
                if (nextSubject) {
                    startScreeningTest(getSubjectDisplayName(nextSubject));
                }
            } else if (actionText.includes('Advanced Tests')) {
                showNotification('Advanced test challenges coming soon!', 'info');
            }
        });
    });
}

function getSubjectDisplayName(subjectKey) {
    const displayNames = {
        'os': 'Operating Systems',
        'dsa': 'Data Structures & Algorithms',
        'se': 'Software Engineering'
    };
    
    return displayNames[subjectKey] || subjectKey;
}

function updateProgressStats() {
    const completedCount = screeningData.completed.length;
    const totalCount = screeningData.completed.length + screeningData.pending.length;
    const averageScore = Math.round(
        Object.values(screeningData.scores).reduce((a, b) => a + b, 0) / 
        Object.values(screeningData.scores).length
    );
    
    // Update progress bar
    const progressFill = document.querySelector('.overall-progress .progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressFill && progressText) {
        const percentage = (completedCount / totalCount) * 100;
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `Overall Progress: ${Math.round(percentage)}%`;
    }
    
    // Update stats
    const statElements = document.querySelectorAll('.progress-stats .stat span');
    if (statElements.length >= 6) {
        statElements[1].textContent = `${completedCount} / ${totalCount} Completed`;
        statElements[3].textContent = `${averageScore}% Average Score`;
    }
}

function animateElements() {
    const subjectCards = document.querySelectorAll('.subject-card');
    const recommendationCards = document.querySelectorAll('.recommendation-card');
    
    // Animate subject cards
    subjectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
    });
    
    // Animate recommendation cards
    setTimeout(() => {
        recommendationCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateX(-20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateX(0)';
            }, index * 200);
        });
    }, 1000);
    
    // Animate progress bar
    setTimeout(() => {
        const progressFill = document.querySelector('.overall-progress .progress-fill');
        if (progressFill) {
            const width = progressFill.style.width;
            progressFill.style.width = '0%';
            setTimeout(() => {
                progressFill.style.width = width;
            }, 100);
        }
    }, 500);
}

function addModalStyles() {
    if (document.querySelector('style[data-modal-styles]')) return;
    
    const style = document.createElement('style');
    style.setAttribute('data-modal-styles', '');
    style.textContent = `
        .results-modal {
            max-width: 800px;
        }
        
        .results-detail-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 2rem;
            position: relative;
            max-height: 90vh;
            overflow-y: auto;
        }
        
        .results-header {
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .results-title {
            font-family: 'Orbitron', monospace;
            font-size: 1.5rem;
            color: #ffffff;
            margin-bottom: 1rem;
        }
        
        .score-display.large {
            background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
            padding: 1.5rem;
            border-radius: 15px;
            display: inline-block;
        }
        
        .score-display.large .score-value {
            font-size: 2.5rem;
            font-weight: 700;
        }
        
        .breakdown-title,
        .recommendations-title {
            font-family: 'Orbitron', monospace;
            color: #ffffff;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .breakdown-grid {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .breakdown-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
        }
        
        .topic-name {
            color: #ffffff;
            font-weight: 500;
        }
        
        .topic-score {
            display: flex;
            align-items: center;
            gap: 1rem;
            min-width: 150px;
        }
        
        .score-bar {
            flex: 1;
            height: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            overflow: hidden;
        }
        
        .score-fill {
            height: 100%;
            background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
            border-radius: 10px;
            transition: width 1s ease;
        }
        
        .score-text {
            color: #ffffff;
            font-weight: 600;
            font-size: 0.875rem;
            min-width: 40px;
        }
        
        .recommendation-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .recommendation-item {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
        }
        
        .rec-icon {
            width: 1.25rem;
            height: 1.25rem;
            color: #8b5cf6;
            flex-shrink: 0;
            margin-top: 0.125rem;
        }
        
        .modal-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
        }
        
        .confirmation-modal {
            max-width: 400px;
        }
        
        .confirmation-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 2rem;
            text-align: center;
        }
        
        .confirmation-header {
            margin-bottom: 2rem;
        }
        
        .confirmation-icon {
            width: 3rem;
            height: 3rem;
            color: #8b5cf6;
            margin-bottom: 1rem;
        }
        
        .confirmation-title {
            font-family: 'Orbitron', monospace;
            color: #ffffff;
            margin-bottom: 1rem;
        }
        
        .confirmation-message {
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.6;
        }
        
        .confirmation-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
        }
        
        @media (max-width: 768px) {
            .results-detail-card {
                padding: 1.5rem;
            }
            
            .breakdown-item,
            .recommendation-item {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.5rem;
            }
            
            .topic-score {
                width: 100%;
                min-width: auto;
            }
            
            .modal-actions,
            .confirmation-actions {
                flex-direction: column;
            }
        }
    `;
    
    document.head.appendChild(style);
}

function showLoadingNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'loading-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <div class="loading-spinner">
                <i data-lucide="loader-2" class="spinner-icon"></i>
            </div>
            <span>${message}</span>
        </div>
    `;
    
    // Add loading notification styles
    if (!document.querySelector('style[data-loading-notification]')) {
        const style = document.createElement('style');
        style.setAttribute('data-loading-notification', '');
        style.textContent = `
            .loading-notification {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(59, 130, 246, 0.9);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(59, 130, 246, 0.3);
                border-radius: 20px;
                padding: 2rem;
                z-index: 9999;
                animation: fadeIn 0.5s ease;
                text-align: center;
                min-width: 300px;
            }
            
            .loading-notification .notification-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1rem;
                color: #ffffff;
                font-weight: 500;
            }
            
            .loading-spinner {
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .spinner-icon {
                width: 2rem;
                height: 2rem;
                color: #ffffff;
                animation: spin 1s linear infinite;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
            
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    lucide.createIcons();
    
    // Remove notification after redirect
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 2500);
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