// Game state
let gameState = {
    xp: 2450,
    level: 12,
    streak: 7,
    testsCompleted: 24,
    averageScore: 87,
    dailyQuestProgress: 2,
    studyGuideProgress: 78,
    achievements: [
        { id: 1, name: 'First Steps', description: 'Complete your first quest', unlocked: true, progress: 100 },
        { id: 2, name: 'Week Warrior', description: 'Maintain a 7-day study streak', unlocked: true, progress: 100 },
        { id: 3, name: 'Knowledge Seeker', description: 'Complete 10 study sessions', unlocked: true, progress: 100 },
        { id: 4, name: 'Test Master', description: 'Score 90% or higher on 5 tests', unlocked: false, progress: 60 },
        { id: 5, name: 'Dedication', description: 'Study for 30 consecutive days', unlocked: false, progress: 23 },
        { id: 6, name: 'Perfect Score', description: 'Achieve 100% on any test', unlocked: false, progress: 0 }
    ]
};

// Leaderboard data
const leaderboardData = [
    { rank: 1, name: 'Sarah Chen', avatar: 'SC', xp: 15420, testsCompleted: 89, avgScore: 94 },
    { rank: 2, name: 'Mike Johnson', avatar: 'MJ', xp: 14850, testsCompleted: 76, avgScore: 91 },
    { rank: 3, name: 'Alex Rivera', avatar: 'AR', xp: 13920, testsCompleted: 82, avgScore: 89 },
    { rank: 4, name: 'You', avatar: 'AK', xp: 12450, testsCompleted: 24, avgScore: 87 },
    { rank: 5, name: 'Emma Davis', avatar: 'ED', xp: 11800, testsCompleted: 67, avgScore: 85 },
    { rank: 6, name: 'James Wilson', avatar: 'JW', xp: 10950, testsCompleted: 58, avgScore: 83 },
    { rank: 7, name: 'Lisa Park', avatar: 'LP', xp: 9870, testsCompleted: 45, avgScore: 81 },
    { rank: 8, name: 'David Kim', avatar: 'DK', xp: 8920, testsCompleted: 39, avgScore: 79 }
];

// Initialize demo
document.addEventListener('DOMContentLoaded', function() {
    // Create animated background
    createAnimatedBackground();
    
    // Animate elements on load
    setTimeout(() => {
        animateElements();
    }, 1000);

    // Add interactive feedback
    addInteractiveFeedback();
    
    // Start real-time updates
    startRealTimeUpdates();
    
    // Add keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Close windows when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('window-overlay')) {
            closeWindow(e.target);
        }
    });
    
    // Close windows with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeWindow = document.querySelector('.window-overlay.active');
            if (activeWindow) {
                closeWindow(activeWindow);
            }
        }
    });
});

// Create animated background
function createAnimatedBackground() {
    const background = document.createElement('div');
    background.className = 'animated-background';
    
    // Create gradient orbs
    for (let i = 1; i <= 4; i++) {
        const orb = document.createElement('div');
        orb.className = `gradient-orb orb-${i}`;
        background.appendChild(orb);
    }
    
    document.body.appendChild(background);
}

// Window management functions
function createWindow(title, content, className = '') {
    const windowId = `window-${Date.now()}`;
    const windowHTML = `
        <div class="window-overlay ${className}" id="${windowId}">
            <div class="separate-window">
                <div class="window-header">
                    <div class="window-controls">
                        <div class="window-control close" onclick="closeWindow(document.getElementById('${windowId}'))"></div>
                        <div class="window-control minimize" onclick="showNotification('Window minimized', 'info')"></div>
                        <div class="window-control maximize" onclick="showNotification('Window maximized', 'info')"></div>
                    </div>
                    <div class="window-title">${title}</div>
                </div>
                <div class="window-content">
                    ${content}
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', windowHTML);
    const windowElement = document.getElementById(windowId);
    
    // Show window
    setTimeout(() => {
        windowElement.classList.add('active');
    }, 10);
    
    return windowElement;
}

function closeWindow(windowElement) {
    windowElement.classList.remove('active');
    setTimeout(() => {
        windowElement.remove();
    }, 300);
}

// Calendar Window
function openCalendarWindow() {
    const calendarContent = `
        <div class="calendar-window">
            <div class="calendar-header">
                <div class="month-nav">
                    <button class="month-btn" onclick="showNotification('Previous month', 'info')">‹</button>
                    <h2 class="month-title">December 2024</h2>
                    <button class="month-btn" onclick="showNotification('Next month', 'info')">›</button>
                </div>
            </div>
            <div class="calendar-full-grid">
                <div class="calendar-day-header">Sun</div>
                <div class="calendar-day-header">Mon</div>
                <div class="calendar-day-header">Tue</div>
                <div class="calendar-day-header">Wed</div>
                <div class="calendar-day-header">Thu</div>
                <div class="calendar-day-header">Fri</div>
                <div class="calendar-day-header">Sat</div>
                ${generateCalendarDays()}
            </div>
        </div>
    `;
    
    createWindow('Study Calendar', calendarContent, 'calendar-window');
    showNotification('Calendar opened', 'success');
}

function generateCalendarDays() {
    let daysHTML = '';
    const today = 17;
    
    for (let i = 1; i <= 31; i++) {
        const isToday = i === today;
        const events = getEventsForDay(i);
        
        daysHTML += `
            <div class="calendar-day-full ${isToday ? 'today' : ''}" data-day="${i}" onclick="selectFullCalendarDay(this)">
                <div class="day-number-full">${i}</div>
                <div class="day-events-full">
                    ${events.map(event => `<div class="event-full event ${event.type}">${event.name}</div>`).join('')}
                </div>
            </div>
        `;
    }
    
    return daysHTML;
}

function getEventsForDay(day) {
    const events = {
        15: [{ type: 'study', name: 'Study' }],
        16: [{ type: 'test', name: 'Test' }],
        17: [{ type: 'quest', name: 'Quest' }],
        18: [{ type: 'review', name: 'Review' }],
        20: [{ type: 'study', name: 'Study' }, { type: 'test', name: 'Mock Exam' }],
        22: [{ type: 'quest', name: 'Daily Quest' }],
        25: [{ type: 'review', name: 'Week Review' }]
    };
    
    return events[day] || [];
}

function selectFullCalendarDay(dayElement) {
    // Remove active class from all days
    document.querySelectorAll('.calendar-day-full').forEach(d => d.classList.remove('today'));
    // Add active class to clicked day
    dayElement.classList.add('today');
    
    const dayNumber = dayElement.querySelector('.day-number-full').textContent;
    showNotification(`Selected day ${dayNumber}`, 'success');
}

// Leaderboard Window
function openLeaderboardWindow() {
    const leaderboardContent = `
        <div class="leaderboard-window">
            <h2 style="margin-bottom: 2rem; color: #ffffff; text-align: center;">🏆 Global Leaderboard</h2>
            <div class="leaderboard-list">
                ${leaderboardData.map(player => `
                    <div class="leaderboard-item ${player.name === 'You' ? 'current-user' : ''}">
                        <div class="rank ${player.rank === 1 ? 'first' : player.rank === 2 ? 'second' : player.rank === 3 ? 'third' : ''}">#${player.rank}</div>
                        <div class="player-avatar">${player.avatar}</div>
                        <div class="player-info">
                            <div class="player-name">${player.name}</div>
                            <div class="player-stats">${player.testsCompleted} tests • ${player.avgScore}% avg</div>
                        </div>
                        <div class="player-score">
                            <div class="score-value">${player.xp.toLocaleString()}</div>
                            <div class="score-label">XP</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    createWindow('Leaderboard', leaderboardContent, 'leaderboard-window');
    showNotification('Leaderboard opened - You\'re ranked #4!', 'info');
}

// Profile Window
function openProfileWindow() {
    const profileContent = `
        <div class="profile-window">
            <div class="profile-header">
                <div class="profile-avatar">AK</div>
                <div class="profile-info">
                    <h2>Alex Kumar</h2>
                    <div class="profile-title">Level ${gameState.level} Study Warrior</div>
                    <div class="profile-stats">
                        <div class="profile-stat">
                            <div class="stat-number">${gameState.xp.toLocaleString()}</div>
                            <div class="stat-label">Total XP</div>
                        </div>
                        <div class="profile-stat">
                            <div class="stat-number">${gameState.streak}</div>
                            <div class="stat-label">Day Streak</div>
                        </div>
                        <div class="profile-stat">
                            <div class="stat-number">${gameState.testsCompleted}</div>
                            <div class="stat-label">Tests Done</div>
                        </div>
                        <div class="profile-stat">
                            <div class="stat-number">${gameState.averageScore}%</div>
                            <div class="stat-label">Avg Score</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="profile-sections">
                <div class="profile-section">
                    <h3 class="section-title">Recent Achievements</h3>
                    <div class="recent-achievements">
                        ${gameState.achievements.filter(a => a.unlocked).slice(0, 3).map(achievement => `
                            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
                                <div style="font-size: 1.5rem;">🏆</div>
                                <div>
                                    <div style="font-weight: 600; color: #ffffff;">${achievement.name}</div>
                                    <div style="font-size: 0.875rem; color: rgba(255, 255, 255, 0.7);">${achievement.description}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="profile-section">
                    <h3 class="section-title">Study Progress</h3>
                    <div class="study-progress">
                        <div style="margin-bottom: 1rem;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>AWS Solutions Architect</span>
                                <span>${gameState.studyGuideProgress}%</span>
                            </div>
                            <div style="width: 100%; height: 0.5rem; background: rgba(255, 255, 255, 0.2); border-radius: 4px; overflow: hidden;">
                                <div style="height: 100%; width: ${gameState.studyGuideProgress}%; background: linear-gradient(135deg, var(--primary-cyan), var(--primary-magenta)); border-radius: 4px;"></div>
                            </div>
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>Daily Quest Progress</span>
                                <span>${Math.round((gameState.dailyQuestProgress / 3) * 100)}%</span>
                            </div>
                            <div style="width: 100%; height: 0.5rem; background: rgba(255, 255, 255, 0.2); border-radius: 4px; overflow: hidden;">
                                <div style="height: 100%; width: ${(gameState.dailyQuestProgress / 3) * 100}%; background: linear-gradient(135deg, var(--yellow-glow), var(--primary-magenta)); border-radius: 4px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    createWindow('Profile', profileContent, 'profile-window');
    showNotification('Profile opened', 'success');
}

// Achievements Window
function openAchievementsWindow() {
    const achievementsContent = `
        <div class="achievements-window">
            <h2 style="margin-bottom: 2rem; color: #ffffff; text-align: center;">🏅 Achievements</h2>
            <div class="achievements-grid">
                ${gameState.achievements.map(achievement => `
                    <div class="achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}">
                        <div class="achievement-icon">${achievement.unlocked ? '🏆' : '🔒'}</div>
                        <div class="achievement-name">${achievement.name}</div>
                        <div class="achievement-description">${achievement.description}</div>
                        <div class="achievement-progress">
                            <div class="achievement-progress-fill" style="width: ${achievement.progress}%"></div>
                        </div>
                        <div style="font-size: 0.75rem; color: rgba(255, 255, 255, 0.6); margin-top: 0.5rem;">
                            ${achievement.progress}% Complete
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    createWindow('Achievements', achievementsContent, 'achievements-window');
    showNotification(`Achievements opened - ${gameState.achievements.filter(a => a.unlocked).length}/${gameState.achievements.length} unlocked!`, 'info');
}

// Settings Window
function openSettingsWindow() {
    const settingsContent = `
        <div class="settings-window">
            <h2 style="margin-bottom: 2rem; color: #ffffff;">⚙️ Settings</h2>
            <div class="settings-sections">
                <div class="setting-group">
                    <h3>Study Preferences</h3>
                    <label class="checkbox-label">
                        <input type="checkbox" checked>
                        <span>Daily quest notifications</span>
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" checked>
                        <span>Study streak reminders</span>
                    </label>
                </div>
                <div class="setting-group">
                    <h3>Difficulty Level</h3>
                    <div class="difficulty-buttons">
                        <button class="difficulty-btn" onclick="setDifficulty(this, 'Beginner')">Beginner</button>
                        <button class="difficulty-btn active" onclick="setDifficulty(this, 'Intermediate')">Intermediate</button>
                        <button class="difficulty-btn" onclick="setDifficulty(this, 'Advanced')">Advanced</button>
                    </div>
                </div>
                <div class="setting-group">
                    <h3>Study Goals</h3>
                    <label class="checkbox-label">
                        <input type="checkbox" checked>
                        <span>30 minutes daily study</span>
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox">
                        <span>Weekend intensive sessions</span>
                    </label>
                </div>
            </div>
        </div>
    `;
    
    createWindow('Settings', settingsContent, 'settings-window');
    showNotification('Settings opened! Use Alt+S as shortcut', 'info');
}

function setDifficulty(button, difficulty) {
    // Remove active class from all difficulty buttons
    document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
    // Add active class to clicked button
    button.classList.add('active');
    showNotification(`Difficulty set to ${difficulty}`, 'success');
}

// New Quest Window
function openNewQuestWindow() {
    const newQuestContent = `
        <div class="new-quest-window">
            <h2 style="margin-bottom: 2rem; color: #ffffff;">🎯 Create New Quest</h2>
            <form class="quest-form" onsubmit="createQuest(event)">
                <div class="form-group">
                    <label class="form-label">Quest Name</label>
                    <input type="text" class="form-input" placeholder="Enter quest name..." required />
                </div>
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea class="form-textarea" placeholder="Describe your quest..."></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Quest Type</label>
                    <div class="quest-types">
                        <div class="quest-type" data-type="study" onclick="selectQuestType(this)">
                            <div class="quest-type-icon">📚</div>
                            <div class="quest-type-name">Study</div>
                        </div>
                        <div class="quest-type" data-type="test" onclick="selectQuestType(this)">
                            <div class="quest-type-icon">📝</div>
                            <div class="quest-type-name">Test</div>
                        </div>
                        <div class="quest-type" data-type="practice" onclick="selectQuestType(this)">
                            <div class="quest-type-icon">🎯</div>
                            <div class="quest-type-name">Practice</div>
                        </div>
                        <div class="quest-type" data-type="review" onclick="selectQuestType(this)">
                            <div class="quest-type-icon">🔄</div>
                            <div class="quest-type-name">Review</div>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Difficulty</label>
                    <select class="form-select">
                        <option value="easy">Easy (+10 XP)</option>
                        <option value="medium" selected>Medium (+25 XP)</option>
                        <option value="hard">Hard (+50 XP)</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeWindow(this.closest('.window-overlay'))">Cancel</button>
                    <button type="submit" class="btn btn-primary">Create Quest</button>
                </div>
            </form>
        </div>
    `;
    
    createWindow('New Quest', newQuestContent, 'new-quest-window');
    showNotification('New Quest window opened', 'info');
}

function selectQuestType(element) {
    // Remove selected class from all quest types
    document.querySelectorAll('.quest-type').forEach(type => type.classList.remove('selected'));
    // Add selected class to clicked type
    element.classList.add('selected');
}

function createQuest(event) {
    event.preventDefault();
    const questName = event.target.querySelector('.form-input').value;
    if (questName.trim()) {
        showNotification(`Quest "${questName}" created successfully! +25 XP`, 'success');
        gameState.xp += 25;
        updateXPDisplay();
        closeWindow(event.target.closest('.window-overlay'));
    } else {
        showNotification('Please enter a quest name', 'warning');
    }
}

// Syllabus Window
function openSyllabusWindow() {
    const syllabusContent = `
        <div class="syllabus-window">
            <h2 style="margin-bottom: 2rem; color: #ffffff;">📋 Complete Syllabus Tracker</h2>
            <div class="syllabus-sections">
                <div class="syllabus-section completed">
                    <div class="section-header">
                        <h3>☑️ Cloud Computing Fundamentals</h3>
                        <span class="completion-badge">100%</span>
                    </div>
                    <div class="section-topics">
                        <div class="topic completed">✅ Introduction to Cloud Computing</div>
                        <div class="topic completed">✅ Cloud Service Models (IaaS, PaaS, SaaS)</div>
                        <div class="topic completed">✅ Cloud Deployment Models</div>
                        <div class="topic completed">✅ AWS Global Infrastructure</div>
                        <div class="topic completed">✅ AWS Core Services Overview</div>
                    </div>
                </div>
                
                <div class="syllabus-section in-progress">
                    <div class="section-header">
                        <h3>🔄 Security & Compliance</h3>
                        <span class="completion-badge">67%</span>
                    </div>
                    <div class="section-topics">
                        <div class="topic completed">✅ AWS Identity and Access Management (IAM)</div>
                        <div class="topic completed">✅ Security Groups and NACLs</div>
                        <div class="topic completed">✅ AWS CloudTrail</div>
                        <div class="topic completed">✅ AWS Config</div>
                        <div class="topic in-progress">🔄 AWS Security Best Practices</div>
                        <div class="topic pending">⏳ Compliance Frameworks</div>
                        <div class="topic pending">⏳ Data Encryption</div>
                        <div class="topic pending">⏳ Incident Response</div>
                    </div>
                </div>
                
                <div class="syllabus-section pending">
                    <div class="section-header">
                        <h3>⏳ Advanced Networking</h3>
                        <span class="completion-badge">0%</span>
                    </div>
                    <div class="section-topics">
                        <div class="topic pending">⏳ VPC Design Patterns</div>
                        <div class="topic pending">⏳ Direct Connect</div>
                        <div class="topic pending">⏳ Route 53 Advanced Features</div>
                        <div class="topic pending">⏳ CloudFront Distribution</div>
                        <div class="topic pending">⏳ Load Balancing Strategies</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    createWindow('Syllabus Tracker', syllabusContent, 'syllabus-window');
    showNotification('Complete syllabus tracker opened', 'info');
}

// Interactive functions
function completeDailyQuest(card) {
    const progressBar = card.querySelector('.progress-fill');
    const progressText = card.querySelector('.progress-text');
    
    // Simulate progress update
    setTimeout(() => {
        progressBar.style.width = '100%';
        progressText.textContent = '3/3 completed';
        
        // Show completion feedback
        setTimeout(() => {
            showNotification('🎉 Daily Quest completed! +50 XP earned', 'success');
            
            // Update XP display
            gameState.xp += 50;
            updateXPDisplay();
            
            // Create floating XP animation
            createFloatingXP(card, 50);
            
            // Update quest progress
            gameState.dailyQuestProgress = 3;
        }, 500);
    }, 1000);
}

function openStudyGuide() {
    showNotification('📖 Opening AWS Solutions Architect Study Guide...', 'info');
    
    // Simulate loading
    setTimeout(() => {
        showNotification('Study guide loaded! Current progress: 78%', 'success');
    }, 1500);
}

function selectCalendarDay(day) {
    // Remove active class from all days
    document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('today'));
    // Add active class to clicked day
    day.classList.add('today');
    
    const dayNumber = day.querySelector('.day-number').textContent;
    showNotification(`Selected day ${dayNumber}`, 'success');
}

function showDetailedStats(card) {
    const statType = card.querySelector('.stat-content h4').textContent;
    let message = '';
    
    switch(statType) {
        case 'Study Streak':
            message = `🔥 Amazing ${gameState.streak}-day streak! Keep it up to unlock the "Study Master" achievement!`;
            break;
        case 'Tests Completed':
            message = `📊 You've completed ${gameState.testsCompleted} tests with an average score of ${gameState.averageScore}%!`;
            break;
        case 'Average Score':
            message = `⭐ Your ${gameState.averageScore}% average puts you in the top 15% of learners!`;
            break;
        default:
            message = 'Detailed statistics coming soon!';
    }
    
    showNotification(message, 'info');
}

function openSyllabusDetail(item) {
    const title = item.querySelector('h4').textContent;
    const status = item.classList.contains('completed') ? 'completed' : 
                  item.classList.contains('in-progress') ? 'in-progress' : 'pending';
    
    let message = '';
    switch(status) {
        case 'completed':
            message = `✅ ${title} is complete! Review materials or take a practice test.`;
            break;
        case 'in-progress':
            message = `📚 Continue studying ${title}. You're making great progress!`;
            break;
        case 'pending':
            message = `🎯 ${title} is scheduled for next week. Get ready!`;
            break;
    }
    
    showNotification(message, status === 'completed' ? 'success' : 'info');
}

function showActivityDetail(item) {
    const title = item.querySelector('h4').textContent;
    const xp = item.querySelector('.activity-xp')?.textContent || '+0 XP';
    
    showNotification(`${title} - Earned ${xp}! Keep up the great work!`, 'success');
}

function updateXPDisplay() {
    const xpValue = document.getElementById('xp-counter');
    if (xpValue) {
        xpValue.textContent = gameState.xp.toLocaleString();
        
        // Animate XP change
        xpValue.style.color = '#ffb000';
        xpValue.style.textShadow = '0 0 15px rgba(255, 176, 0, 0.8)';
        setTimeout(() => {
            xpValue.style.color = '';
            xpValue.style.textShadow = '';
        }, 1000);
    }
}

function createFloatingXP(element, xp) {
    const floatingXP = document.createElement('div');
    floatingXP.textContent = `+${xp} XP`;
    floatingXP.style.cssText = `
        position: absolute;
        color: #ffb000;
        font-weight: 600;
        font-size: 0.875rem;
        pointer-events: none;
        z-index: 1000;
        animation: floatUp 2s ease-out forwards;
        text-shadow: 0 0 10px rgba(255, 176, 0, 0.8);
    `;
    
    const rect = element.getBoundingClientRect();
    floatingXP.style.left = (rect.left + rect.width / 2) + 'px';
    floatingXP.style.top = rect.top + 'px';
    
    document.body.appendChild(floatingXP);
    
    setTimeout(() => {
        floatingXP.remove();
    }, 2000);
}

// Animation functions
function animateElements() {
    // Animate action cards
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });

    // Animate stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, (index + 2) * 200);
    });

    // Animate syllabus items
    const syllabusItems = document.querySelectorAll('.syllabus-item');
    syllabusItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, (index + 4) * 150);
    });

    // Animate activity items
    const activityItems = document.querySelectorAll('.activity-item');
    activityItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, (index + 7) * 150);
    });
}

// Enhanced interactive feedback
function addInteractiveFeedback() {
    // Add hover effects to clickable elements
    const clickableElements = document.querySelectorAll('button, .action-card, .stat-card, .syllabus-item, .activity-item, .calendar-day');
    
    clickableElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.cursor = 'pointer';
        });
        
        element.addEventListener('click', () => {
            createRipple(element);
        });
    });

    // Add pulse animation to status indicators
    const statusDots = document.querySelectorAll('.status-dot, .online-indicator');
    statusDots.forEach(dot => {
        dot.style.animation = 'pulse 2s infinite';
    });

    // Animate progress bars
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 1000);
    });
}

// Utility functions
function createRipple(element) {
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(0, 245, 255, 0.3)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (rect.width / 2 - size / 2) + 'px';
    ripple.style.top = (rect.height / 2 - size / 2) + 'px';
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Alt + S to open settings
        if (e.altKey && e.key === 's') {
            e.preventDefault();
            openSettingsWindow();
        }
        
        // Alt + Q for quick quest
        if (e.altKey && e.key === 'q') {
            e.preventDefault();
            const dailyQuest = document.querySelector('.daily-quest');
            if (dailyQuest) {
                dailyQuest.click();
            }
        }
        
        // Alt + C for calendar
        if (e.altKey && e.key === 'c') {
            e.preventDefault();
            openCalendarWindow();
        }
        
        // Alt + N for new quest
        if (e.altKey && e.key === 'n') {
            e.preventDefault();
            openNewQuestWindow();
        }
        
        // Alt + L for leaderboard
        if (e.altKey && e.key === 'l') {
            e.preventDefault();
            openLeaderboardWindow();
        }
        
        // Alt + P for profile
        if (e.altKey && e.key === 'p') {
            e.preventDefault();
            openProfileWindow();
        }
        
        // Alt + A for achievements
        if (e.altKey && e.key === 'a') {
            e.preventDefault();
            openAchievementsWindow();
        }
    });
}

// Real-time updates
function startRealTimeUpdates() {
    // Update study streak randomly
    setInterval(() => {
        const streakElement = document.getElementById('streak-counter');
        if (streakElement && Math.random() > 0.98) { // 2% chance every interval
            if (gameState.streak < 30) { // Cap at 30 days
                gameState.streak++;
                streakElement.textContent = gameState.streak;
                showNotification(`Study streak increased to ${gameState.streak} days! 🔥`, 'success');
            }
        }
    }, 10000); // Check every 10 seconds
    
    // Simulate random achievements
    setInterval(() => {
        if (Math.random() > 0.995) { // 0.5% chance
            const achievements = [
                'Speed Reader - Read 10 pages in under 5 minutes!',
                'Night Owl - Studied past midnight!',
                'Early Bird - Started studying before 6 AM!',
                'Perfectionist - Scored 100% on a practice test!',
                'Consistent - Studied 5 days in a row!'
            ];
            
            const randomAchievement = achievements[Math.floor(Math.random() * achievements.length)];
            showNotification(`🏆 Achievement Unlocked: ${randomAchievement}`, 'success');
            
            // Add XP for achievement
            gameState.xp += 25;
            updateXPDisplay();
        }
    }, 15000); // Check every 15 seconds
}

// Console welcome message
console.log('🎮 Prep Dungeon Demo loaded successfully!');
console.log('🎯 Try these keyboard shortcuts:');
console.log('   Alt+S: Open Settings');
console.log('   Alt+Q: Quick Quest');
console.log('   Alt+C: Open Calendar');
console.log('   Alt+N: Create New Quest');
console.log('   Alt+L: Open Leaderboard');
console.log('   Alt+P: Open Profile');
console.log('   Alt+A: Open Achievements');
console.log('   Escape: Close Modal');