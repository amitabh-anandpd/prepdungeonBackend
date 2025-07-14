// Initialize Lucide icons
lucide.createIcons();

// Leaderboard state
let currentPeriod = 'weekly';
let currentBoard = 'global';
let isPrivate = false;

// Initialize leaderboard
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
    initializePrivacyToggle();
    animateElements();
    updateLeaderboardData();
});

function initializeFilters() {
    const timeFilters = document.querySelectorAll('.filter-btn');
    const boardFilters = document.querySelectorAll('.board-btn');
    
    // Time period filters
    timeFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            timeFilters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentPeriod = btn.getAttribute('data-period');
            updateLeaderboardData();
        });
    });
    
    // Board type filters
    boardFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            boardFilters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentBoard = btn.getAttribute('data-board');
            updateLeaderboardData();
        });
    });
}

function initializePrivacyToggle() {
    const privacyCheckbox = document.getElementById('privacy-checkbox');
    
    privacyCheckbox.addEventListener('change', (e) => {
        isPrivate = e.target.checked;
        updatePrivacyStatus();
        showPrivacyNotification(isPrivate);
    });
}

function updatePrivacyStatus() {
    const currentUserRow = document.querySelector('.table-row.current-user');
    
    if (isPrivate) {
        currentUserRow.style.opacity = '0.6';
        currentUserRow.style.filter = 'blur(1px)';
    } else {
        currentUserRow.style.opacity = '1';
        currentUserRow.style.filter = 'none';
    }
}

function showPrivacyNotification(isPrivate) {
    const message = isPrivate 
        ? 'Your profile is now private and hidden from other users'
        : 'Your profile is now public and visible to other users';
    
    showNotification(message, 'info');
}

function updateLeaderboardData() {
    // Simulate loading
    showLoadingState();
    
    setTimeout(() => {
        const leaderboardData = getLeaderboardData(currentPeriod, currentBoard);
        updatePodium(leaderboardData.podium);
        updateTable(leaderboardData.table);
        updateMiniLeaderboards(leaderboardData.mini);
        hideLoadingState();
    }, 1000);
}

function getLeaderboardData(period, board) {
    // Simulated data - in real app, this would come from API
    const data = {
        weekly: {
            global: {
                podium: [
                    { name: 'Alex Rodriguez', level: 6, xp: 3245, avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' },
                    { name: 'Sarah Chen', level: 5, xp: 2847, avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' },
                    { name: 'Mike Johnson', level: 4, xp: 2156, avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' }
                ],
                table: [
                    { rank: 4, name: 'You', level: 3, xp: 1892, time: '2h 15m', score: '78%', quests: 42, isCurrentUser: true },
                    { rank: 5, name: 'Emma Wilson', level: 3, xp: 1756, time: '1h 45m', score: '82%', quests: 38 },
                    { rank: 6, name: 'David Kim', level: 2, xp: 1423, time: '3h 20m', score: '75%', quests: 29 },
                    { rank: 7, name: 'Lisa Zhang', level: 3, xp: 1298, time: '1h 30m', score: '88%', quests: 35 },
                    { rank: 8, name: 'Ryan Taylor', level: 2, xp: 1156, time: '2h 45m', score: '71%', quests: 24 }
                ],
                mini: {
                    speed: [
                        { rank: 1, name: 'Alex Rodriguez', stat: '45s avg' },
                        { rank: 2, name: 'Sarah Chen', stat: '52s avg' },
                        { rank: 3, name: 'Mike Johnson', stat: '58s avg' }
                    ],
                    accuracy: [
                        { rank: 1, name: 'Lisa Zhang', stat: '96.5%' },
                        { rank: 2, name: 'Emma Wilson', stat: '94.2%' },
                        { rank: 3, name: 'Alex Rodriguez', stat: '92.8%' }
                    ],
                    streak: [
                        { rank: 1, name: 'Sarah Chen', stat: '28 days' },
                        { rank: 2, name: 'David Kim', stat: '21 days' },
                        { rank: 3, name: 'You', stat: '7 days' }
                    ]
                }
            },
            friends: {
                podium: [
                    { name: 'Sarah Chen', level: 5, xp: 2847, avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' },
                    { name: 'You', level: 3, xp: 1892, avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' },
                    { name: 'Emma Wilson', level: 3, xp: 1756, avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' }
                ],
                table: [
                    { rank: 4, name: 'David Kim', level: 2, xp: 1423, time: '3h 20m', score: '75%', quests: 29 },
                    { rank: 5, name: 'Lisa Zhang', level: 3, xp: 1298, time: '1h 30m', score: '88%', quests: 35 }
                ],
                mini: {
                    speed: [
                        { rank: 1, name: 'Sarah Chen', stat: '52s avg' },
                        { rank: 2, name: 'You', stat: '67s avg' },
                        { rank: 3, name: 'Emma Wilson', stat: '71s avg' }
                    ],
                    accuracy: [
                        { rank: 1, name: 'Lisa Zhang', stat: '96.5%' },
                        { rank: 2, name: 'Emma Wilson', stat: '94.2%' },
                        { rank: 3, name: 'You', stat: '78.3%' }
                    ],
                    streak: [
                        { rank: 1, name: 'David Kim', stat: '21 days' },
                        { rank: 2, name: 'You', stat: '7 days' },
                        { rank: 3, name: 'Sarah Chen', stat: '5 days' }
                    ]
                }
            }
        }
    };
    
    return data[period][board];
}

function updatePodium(podiumData) {
    const podiumPlayers = document.querySelectorAll('.podium-player');
    
    // Update in order: second, first, third
    const order = [1, 0, 2]; // second, first, third
    
    order.forEach((dataIndex, podiumIndex) => {
        const player = podiumData[dataIndex];
        const podiumElement = podiumPlayers[podiumIndex];
        
        if (player && podiumElement) {
            const avatar = podiumElement.querySelector('.player-avatar img');
            const name = podiumElement.querySelector('.player-name');
            const level = podiumElement.querySelector('.level');
            const score = podiumElement.querySelector('.score');
            
            avatar.src = player.avatar;
            avatar.alt = player.name;
            name.textContent = player.name;
            level.textContent = `Lv. ${player.level}`;
            score.textContent = `${player.xp.toLocaleString()} XP`;
        }
    });
}

function updateTable(tableData) {
    const tableContent = document.querySelector('.table-content');
    const headerRow = tableContent.querySelector('.table-row.header');
    
    // Clear existing rows except header
    const existingRows = tableContent.querySelectorAll('.table-row:not(.header)');
    existingRows.forEach(row => row.remove());
    
    // Add new rows
    tableData.forEach(player => {
        const row = document.createElement('div');
        row.className = `table-row ${player.isCurrentUser ? 'current-user' : ''}`;
        
        row.innerHTML = `
            <div class="rank-col">
                <span class="rank-number">${player.rank}</span>
            </div>
            <div class="player-col">
                <div class="player-info">
                    <div class="player-avatar small">
                        <img src="${getPlayerAvatar(player.name)}" alt="${player.name}">
                    </div>
                    <div class="player-details">
                        <span class="player-name">${player.name}</span>
                        <span class="player-badge">${getPlayerBadge(player.level)}</span>
                    </div>
                </div>
            </div>
            <div class="level-col">
                <span class="level-badge">Lv. ${player.level}</span>
            </div>
            <div class="xp-col">${player.xp.toLocaleString()}</div>
            <div class="time-col">${player.time}</div>
            <div class="score-col">${player.score}</div>
            <div class="quests-col">${player.quests}</div>
        `;
        
        tableContent.appendChild(row);
    });
}

function updateMiniLeaderboards(miniData) {
    const speedBoard = document.querySelector('.achievement-board:nth-child(1) .mini-leaderboard');
    const accuracyBoard = document.querySelector('.achievement-board:nth-child(2) .mini-leaderboard');
    const streakBoard = document.querySelector('.achievement-board:nth-child(3) .mini-leaderboard');
    
    updateMiniBoard(speedBoard, miniData.speed);
    updateMiniBoard(accuracyBoard, miniData.accuracy);
    updateMiniBoard(streakBoard, miniData.streak);
}

function updateMiniBoard(boardElement, data) {
    boardElement.innerHTML = '';
    
    data.forEach(player => {
        const row = document.createElement('div');
        row.className = 'mini-row';
        row.innerHTML = `
            <span class="mini-rank">${player.rank}</span>
            <span class="mini-name">${player.name}</span>
            <span class="mini-stat">${player.stat}</span>
        `;
        boardElement.appendChild(row);
    });
}

function getPlayerAvatar(name) {
    const avatars = {
        'You': 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        'Emma Wilson': 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        'David Kim': 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        'Lisa Zhang': 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
        'Ryan Taylor': 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop'
    };
    
    return avatars[name] || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop';
}

function getPlayerBadge(level) {
    if (level >= 5) return 'Scholar';
    if (level >= 3) return 'Apprentice';
    return 'Novice';
}

function showLoadingState() {
    const tableContent = document.querySelector('.table-content');
    const podium = document.querySelector('.podium');
    
    // Add loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-spinner">
            <i data-lucide="loader-2" class="spinner-icon"></i>
        </div>
        <span class="loading-text">Updating leaderboard...</span>
    `;
    
    // Add loading styles
    if (!document.querySelector('style[data-loading-styles]')) {
        const style = document.createElement('style');
        style.setAttribute('data-loading-styles', '');
        style.textContent = `
            .loading-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(10, 10, 15, 0.8);
                backdrop-filter: blur(5px);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 1rem;
                z-index: 10;
                border-radius: 20px;
            }
            
            .loading-spinner {
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .spinner-icon {
                width: 2rem;
                height: 2rem;
                color: #8b5cf6;
                animation: spin 1s linear infinite;
            }
            
            .loading-text {
                color: rgba(255, 255, 255, 0.8);
                font-size: 0.875rem;
            }
            
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add loading to table and podium
    tableContent.style.position = 'relative';
    podium.style.position = 'relative';
    
    tableContent.appendChild(loadingOverlay.cloneNode(true));
    podium.appendChild(loadingOverlay.cloneNode(true));
    
    lucide.createIcons();
}

function hideLoadingState() {
    const loadingOverlays = document.querySelectorAll('.loading-overlay');
    loadingOverlays.forEach(overlay => overlay.remove());
}

function animateElements() {
    const podiumPlayers = document.querySelectorAll('.podium-player');
    const tableRows = document.querySelectorAll('.table-row:not(.header)');
    const achievementBoards = document.querySelectorAll('.achievement-board');
    
    // Animate podium
    podiumPlayers.forEach((player, index) => {
        player.style.opacity = '0';
        player.style.transform = 'translateY(30px)';
        player.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            player.style.opacity = '1';
            player.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Animate table rows
    setTimeout(() => {
        tableRows.forEach((row, index) => {
            row.style.opacity = '0';
            row.style.transform = 'translateX(-20px)';
            row.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            
            setTimeout(() => {
                row.style.opacity = '1';
                row.style.transform = 'translateX(0)';
            }, index * 100);
        });
    }, 600);
    
    // Animate achievement boards
    setTimeout(() => {
        achievementBoards.forEach((board, index) => {
            board.style.opacity = '0';
            board.style.transform = 'translateY(20px)';
            board.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                board.style.opacity = '1';
                board.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }, 1200);
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