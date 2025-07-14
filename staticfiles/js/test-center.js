// Initialize Lucide icons
lucide.createIcons();

// Test Center state
let selectedDungeon = null;

// Initialize test center
document.addEventListener('DOMContentLoaded', () => {
    initializeDungeons();
    initializeModal();
    animateElements();
});

function initializeDungeons() {
    const dungeonCards = document.querySelectorAll('.dungeon-card');
    
    dungeonCards.forEach(card => {
        card.addEventListener('click', () => {
            const subject = card.getAttribute('data-subject');
            openDungeonModal(subject, card);
        });
        
        // Add hover effects
        card.addEventListener('mouseenter', () => {
            playHoverEffect(card);
        });
    });
}

function openDungeonModal(subject, cardElement) {
    const modal = document.getElementById('dungeon-modal');
    const modalCard = modal.querySelector('.dungeon-detail-card');
    
    // Get dungeon data
    const dungeonData = getDungeonData(subject);
    
    // Update modal content
    updateModalContent(dungeonData, cardElement);
    
    // Show modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Animate modal entrance
    modalCard.style.transform = 'scale(0.8)';
    modalCard.style.opacity = '0';
    
    setTimeout(() => {
        modalCard.style.transform = 'scale(1)';
        modalCard.style.opacity = '1';
        modalCard.style.transition = 'all 0.3s ease';
    }, 100);
}

function getDungeonData(subject) {
    const dungeonDatabase = {
        'mathematics': {
            name: 'Mathematics',
            icon: 'calculator',
            rank: 'A',
            description: 'Master the language of numbers and logic',
            tests: [
                { name: 'Calculus Fundamentals', type: 'MCQ', questions: 15, reward: 25 },
                { name: 'Linear Algebra', type: 'Conceptual', questions: 10, reward: 30 },
                { name: 'Statistics Speed Test', type: 'Speed', questions: 20, reward: 20 },
                { name: 'Differential Equations', type: 'MCQ', questions: 12, reward: 35 },
                { name: 'Probability Theory', type: 'Conceptual', questions: 8, reward: 40 }
            ],
            enemies: [
                { name: 'Basic Algebra', status: 'defeated' },
                { name: 'Calculus', status: 'active' },
                { name: 'Advanced Statistics', status: 'locked' },
                { name: 'Complex Analysis', status: 'locked' }
            ]
        },
        'dbms': {
            name: 'Database Management',
            icon: 'database',
            rank: 'S',
            description: 'Command the power of data storage and retrieval',
            tests: [
                { name: 'SQL Fundamentals', type: 'MCQ', questions: 18, reward: 30 },
                { name: 'Normalization Theory', type: 'Conceptual', questions: 12, reward: 45 },
                { name: 'Query Optimization', type: 'Speed', questions: 15, reward: 35 },
                { name: 'Transaction Management', type: 'MCQ', questions: 14, reward: 40 },
                { name: 'Database Design', type: 'Conceptual', questions: 10, reward: 50 }
            ],
            enemies: [
                { name: 'Basic SQL', status: 'defeated' },
                { name: 'Normalization', status: 'active' },
                { name: 'Indexing', status: 'active' },
                { name: 'Advanced Queries', status: 'locked' }
            ]
        },
        'networks': {
            name: 'Computer Networks',
            icon: 'network',
            rank: 'B',
            description: 'Navigate the interconnected world of communication',
            tests: [
                { name: 'OSI Model', type: 'MCQ', questions: 16, reward: 25 },
                { name: 'TCP/IP Protocol Suite', type: 'Conceptual', questions: 12, reward: 35 },
                { name: 'Network Troubleshooting', type: 'Speed', questions: 20, reward: 30 },
                { name: 'Routing Algorithms', type: 'MCQ', questions: 14, reward: 40 }
            ],
            enemies: [
                { name: 'Basic Networking', status: 'defeated' },
                { name: 'TCP/IP', status: 'defeated' },
                { name: 'Routing', status: 'active' },
                { name: 'Network Security', status: 'locked' }
            ]
        },
        'os': {
            name: 'Operating Systems',
            icon: 'cpu',
            rank: 'A',
            description: 'Master the core of computer system management',
            tests: [
                { name: 'Process Management', type: 'MCQ', questions: 15, reward: 30 },
                { name: 'Memory Management', type: 'Conceptual', questions: 10, reward: 40 },
                { name: 'File Systems', type: 'Speed', questions: 18, reward: 25 },
                { name: 'Synchronization', type: 'MCQ', questions: 12, reward: 45 }
            ],
            enemies: [
                { name: 'Basic OS Concepts', status: 'defeated' },
                { name: 'Process Scheduling', status: 'active' },
                { name: 'Memory Management', status: 'active' },
                { name: 'Distributed Systems', status: 'locked' }
            ]
        },
        'dsa': {
            name: 'Data Structures',
            icon: 'git-branch',
            rank: 'S',
            description: 'Architect efficient algorithms and data organization',
            tests: [
                { name: 'Arrays and Strings', type: 'MCQ', questions: 20, reward: 25 },
                { name: 'Trees and Graphs', type: 'Conceptual', questions: 15, reward: 50 },
                { name: 'Sorting Algorithms', type: 'Speed', questions: 25, reward: 30 },
                { name: 'Dynamic Programming', type: 'Conceptual', questions: 12, reward: 60 },
                { name: 'Advanced Algorithms', type: 'MCQ', questions: 18, reward: 55 }
            ],
            enemies: [
                { name: 'Basic Arrays', status: 'defeated' },
                { name: 'Linked Lists', status: 'active' },
                { name: 'Trees', status: 'active' },
                { name: 'Graph Algorithms', status: 'locked' },
                { name: 'Advanced DP', status: 'locked' }
            ]
        },
        'se': {
            name: 'Software Engineering',
            icon: 'code',
            rank: 'C',
            description: 'Build robust and maintainable software systems',
            tests: [
                { name: 'SDLC Models', type: 'MCQ', questions: 12, reward: 20 },
                { name: 'Design Patterns', type: 'Conceptual', questions: 10, reward: 35 },
                { name: 'Testing Strategies', type: 'Speed', questions: 15, reward: 25 },
                { name: 'Project Management', type: 'MCQ', questions: 14, reward: 30 }
            ],
            enemies: [
                { name: 'Requirements Analysis', status: 'defeated' },
                { name: 'System Design', status: 'defeated' },
                { name: 'Testing', status: 'defeated' },
                { name: 'Maintenance', status: 'active' }
            ]
        }
    };
    
    return dungeonDatabase[subject] || dungeonDatabase['mathematics'];
}

function updateModalContent(dungeonData, cardElement) {
    const modal = document.getElementById('dungeon-modal');
    
    // Update header
    const detailIcon = modal.querySelector('.detail-icon');
    const detailName = modal.querySelector('.dungeon-detail-name');
    const detailRank = modal.querySelector('.dungeon-detail-rank .rank-badge');
    
    detailIcon.setAttribute('data-lucide', dungeonData.icon);
    detailName.textContent = dungeonData.name;
    detailRank.className = `rank-badge rank-${dungeonData.rank.toLowerCase()}-badge`;
    detailRank.textContent = dungeonData.rank;
    
    // Update test list
    const testItems = modal.querySelector('.test-items');
    testItems.innerHTML = '';
    
    dungeonData.tests.forEach(test => {
        const testItem = document.createElement('div');
        testItem.className = 'test-item';
        testItem.innerHTML = `
            <div class="test-info">
                <span class="test-name">${test.name}</span>
                <span class="test-type">${test.type}</span>
            </div>
            <div class="test-stats">
                <span class="test-questions">${test.questions} Questions</span>
                <span class="test-reward">+${test.reward} XP</span>
            </div>
            <button class="test-start-btn" onclick="startTest('${test.type.toLowerCase()}', '${test.name}')">Start</button>
        `;
        testItems.appendChild(testItem);
    });
    
    // Update enemy list
    const enemyList = modal.querySelector('.enemy-list');
    enemyList.innerHTML = '';
    
    dungeonData.enemies.forEach(enemy => {
        const enemyItem = document.createElement('div');
        enemyItem.className = `enemy-item ${enemy.status}`;
        enemyItem.innerHTML = `
            <span class="enemy-name">${enemy.name}</span>
            <span class="enemy-status">${enemy.status.charAt(0).toUpperCase() + enemy.status.slice(1)}</span>
        `;
        enemyList.appendChild(enemyItem);
    });
    
    // Reinitialize icons
    lucide.createIcons();
}

function initializeModal() {
    const modal = document.getElementById('dungeon-modal');
    const closeBtn = document.getElementById('close-dungeon-modal');
    
    // Close button
    closeBtn.addEventListener('click', () => {
        closeDungeonModal();
    });
    
    // Click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeDungeonModal();
        }
    });
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeDungeonModal();
        }
    });
}

function closeDungeonModal() {
    const modal = document.getElementById('dungeon-modal');
    const modalCard = modal.querySelector('.dungeon-detail-card');
    
    // Animate modal exit
    modalCard.style.transform = 'scale(0.8)';
    modalCard.style.opacity = '0';
    
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 300);
}

// Global function for starting tests
window.startTest = function(testType, testName) {
    // Show loading notification
    showTestStartNotification(testName);
    
    // Redirect to appropriate test page after delay
    setTimeout(() => {
        let testPage = '';
        switch(testType) {
            case 'mcq':
                testPage = 'test-mcq.html';
                break;
            case 'conceptual':
                testPage = 'test-conceptual.html';
                break;
            case 'speed':
                testPage = 'test-speed.html';
                break;
            default:
                testPage = 'test-mcq.html';
        }
        
        // Store test context
        localStorage.setItem('currentTest', JSON.stringify({
            type: testType,
            name: testName,
            startTime: Date.now()
        }));
        
        window.location.href = testPage;
    }, 1500);
};

function showTestStartNotification(testName) {
    const notification = document.createElement('div');
    notification.className = 'test-start-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <div class="loading-spinner">
                <i data-lucide="loader-2" class="spinner-icon"></i>
            </div>
            <div class="notification-text">
                <h4>Preparing Test</h4>
                <p>${testName}</p>
                <span class="loading-text">Loading questions...</span>
            </div>
        </div>
    `;
    
    // Add test start notification styles
    if (!document.querySelector('style[data-test-start-notification]')) {
        const style = document.createElement('style');
        style.setAttribute('data-test-start-notification', '');
        style.textContent = `
            .test-start-notification {
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
            
            .loading-spinner {
                margin-bottom: 1rem;
            }
            
            .spinner-icon {
                width: 2rem;
                height: 2rem;
                color: #ffffff;
                animation: spin 1s linear infinite;
            }
            
            .test-start-notification h4 {
                color: #ffffff;
                font-weight: 600;
                margin-bottom: 0.5rem;
            }
            
            .test-start-notification p {
                color: rgba(255, 255, 255, 0.9);
                margin-bottom: 0.5rem;
            }
            
            .loading-text {
                color: rgba(255, 255, 255, 0.7);
                font-size: 0.875rem;
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
    }, 2000);
}

function playHoverEffect(card) {
    // Add subtle animation on hover
    const door = card.querySelector('.dungeon-door');
    if (door) {
        door.style.transform = 'scale(1.05)';
        door.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            door.style.transform = 'scale(1)';
        }, 300);
    }
}

function animateElements() {
    const dungeonCards = document.querySelectorAll('.dungeon-card');
    
    dungeonCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
    });
    
    // Animate completion bars
    setTimeout(() => {
        const completionBars = document.querySelectorAll('.completion-fill');
        completionBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }, 1000);
}