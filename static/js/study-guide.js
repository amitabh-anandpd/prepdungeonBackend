// Initialize Lucide icons
lucide.createIcons();

// Study Guide state
let currentSubject = 'mathematics';
let uploadedFiles = {};

// Initialize study guide
document.addEventListener('DOMContentLoaded', () => {
    initializeSubjectTabs();
    initializeUploadZone();
    initializeTopicCards();
    updateSubjectContent();
});

function initializeSubjectTabs() {
    const subjectTabs = document.querySelectorAll('.subject-tab');
    
    subjectTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            subjectTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Update current subject
            currentSubject = tab.getAttribute('data-subject');
            
            // Update content
            updateSubjectContent();
        });
    });
}

function updateSubjectContent() {
    const subjectName = document.querySelector('.subject-name');
    const uploadTitle = document.querySelector('.upload-title');
    
    const subjectData = getSubjectData(currentSubject);
    
    subjectName.textContent = subjectData.name;
    uploadTitle.innerHTML = `
        <i data-lucide="scroll" class="title-icon"></i>
        Upload Study Materials
    `;
    
    // Update topics
    updateTopicsGrid(subjectData.topics);
    
    // Reinitialize icons
    lucide.createIcons();
}

function getSubjectData(subject) {
    const subjects = {
        'mathematics': {
            name: 'Mathematics',
            topics: [
                { name: 'Basic Algebra', rank: 'S', progress: 100, status: 'mastered' },
                { name: 'Calculus', rank: 'A', progress: 75, status: 'active' },
                { name: 'Linear Algebra', rank: 'B', progress: 45, status: 'active' },
                { name: 'Statistics', rank: 'C', progress: 0, status: 'locked' },
                { name: 'Probability', rank: 'B', progress: 0, status: 'locked' },
                { name: 'Discrete Math', rank: 'A', progress: 0, status: 'locked' }
            ]
        },
        'dbms': {
            name: 'Database Management',
            topics: [
                { name: 'SQL Basics', rank: 'A', progress: 90, status: 'mastered' },
                { name: 'Normalization', rank: 'S', progress: 30, status: 'active' },
                { name: 'Indexing', rank: 'A', progress: 60, status: 'active' },
                { name: 'Transactions', rank: 'S', progress: 0, status: 'locked' },
                { name: 'Query Optimization', rank: 'S', progress: 0, status: 'locked' }
            ]
        },
        'networks': {
            name: 'Computer Networks',
            topics: [
                { name: 'OSI Model', rank: 'B', progress: 100, status: 'mastered' },
                { name: 'TCP/IP', rank: 'A', progress: 85, status: 'mastered' },
                { name: 'Routing', rank: 'A', progress: 70, status: 'active' },
                { name: 'Network Security', rank: 'S', progress: 0, status: 'locked' }
            ]
        },
        'os': {
            name: 'Operating Systems',
            topics: [
                { name: 'Process Management', rank: 'A', progress: 55, status: 'active' },
                { name: 'Memory Management', rank: 'S', progress: 25, status: 'active' },
                { name: 'File Systems', rank: 'B', progress: 80, status: 'active' },
                { name: 'Synchronization', rank: 'S', progress: 0, status: 'locked' }
            ]
        },
        'dsa': {
            name: 'Data Structures & Algorithms',
            topics: [
                { name: 'Arrays & Strings', rank: 'B', progress: 90, status: 'mastered' },
                { name: 'Linked Lists', rank: 'A', progress: 65, status: 'active' },
                { name: 'Trees', rank: 'S', progress: 40, status: 'active' },
                { name: 'Graphs', rank: 'S', progress: 0, status: 'locked' },
                { name: 'Dynamic Programming', rank: 'S', progress: 0, status: 'locked' }
            ]
        },
        'se': {
            name: 'Software Engineering',
            topics: [
                { name: 'SDLC Models', rank: 'C', progress: 100, status: 'mastered' },
                { name: 'Design Patterns', rank: 'A', progress: 70, status: 'active' },
                { name: 'Testing', rank: 'B', progress: 85, status: 'mastered' },
                { name: 'Project Management', rank: 'B', progress: 50, status: 'active' }
            ]
        }
    };
    
    return subjects[subject] || subjects['mathematics'];
}

function updateTopicsGrid(topics) {
    const topicsGrid = document.querySelector('.topics-grid');
    topicsGrid.innerHTML = '';
    
    topics.forEach(topic => {
        const topicCard = document.createElement('div');
        topicCard.className = `topic-card rank-${topic.rank.toLowerCase()} ${topic.status}`;
        
        const statusIcon = getStatusIcon(topic.status);
        const actionButtons = getActionButtons(topic.status);
        
        topicCard.innerHTML = `
            <div class="topic-header">
                <div class="topic-rank">${topic.rank}</div>
                <div class="topic-status">
                    <i data-lucide="${statusIcon}" class="status-icon"></i>
                </div>
            </div>
            <h4 class="topic-name">${topic.name}</h4>
            <div class="topic-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${topic.progress}%"></div>
                </div>
                <span class="progress-text">${topic.status === 'locked' ? 'Locked' : `${topic.progress}% Complete`}</span>
            </div>
            <div class="topic-actions">
                ${actionButtons}
            </div>
        `;
        
        topicsGrid.appendChild(topicCard);
    });
    
    // Add event listeners to topic buttons
    addTopicButtonListeners();
    
    // Update stats
    updateTopicsStats(topics);
    
    lucide.createIcons();
}

function getStatusIcon(status) {
    switch (status) {
        case 'mastered': return 'crown';
        case 'active': return 'zap';
        case 'locked': return 'lock';
        default: return 'play';
    }
}

function getActionButtons(status) {
    switch (status) {
        case 'mastered':
            return `
                <button class="topic-btn review-btn">
                    <i data-lucide="refresh-cw" class="btn-icon"></i>
                    Review
                </button>
                <button class="topic-btn test-btn" disabled>
                    <i data-lucide="sword" class="btn-icon"></i>
                    Test
                </button>
            `;
        case 'active':
            return `
                <button class="topic-btn study-btn">
                    <i data-lucide="book" class="btn-icon"></i>
                    Study
                </button>
                <button class="topic-btn test-btn">
                    <i data-lucide="sword" class="btn-icon"></i>
                    Test
                </button>
            `;
        case 'locked':
            return `
                <button class="topic-btn study-btn" disabled>
                    <i data-lucide="lock" class="btn-icon"></i>
                    Locked
                </button>
                <button class="topic-btn test-btn" disabled>
                    <i data-lucide="lock" class="btn-icon"></i>
                    Locked
                </button>
            `;
        default:
            return '';
    }
}

function addTopicButtonListeners() {
    const studyBtns = document.querySelectorAll('.study-btn:not([disabled])');
    const testBtns = document.querySelectorAll('.test-btn:not([disabled])');
    const reviewBtns = document.querySelectorAll('.review-btn');
    
    studyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const topicName = btn.closest('.topic-card').querySelector('.topic-name').textContent;
            showActionNotification(`Starting study session for ${topicName}`);
        });
    });
    
    testBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const topicName = btn.closest('.topic-card').querySelector('.topic-name').textContent;
            showActionNotification(`Launching test for ${topicName}`);
            // Redirect to test center after delay
            setTimeout(() => {
                window.location.href = 'test-center.html';
            }, 1500);
        });
    });
    
    reviewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const topicName = btn.closest('.topic-card').querySelector('.topic-name').textContent;
            showActionNotification(`Opening review materials for ${topicName}`);
        });
    });
}

function updateTopicsStats(topics) {
    const totalTopics = topics.length;
    const masteredTopics = topics.filter(t => t.status === 'mastered').length;
    
    const statsElements = document.querySelectorAll('.topics-stats .stat span');
    if (statsElements.length >= 4) {
        statsElements[1].textContent = `${totalTopics} Topics`;
        statsElements[3].textContent = `${masteredTopics} Mastered`;
    }
}

function initializeUploadZone() {
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input');
    const urlInput = document.querySelector('.url-input');
    const addUrlBtn = document.querySelector('.add-url-btn');
    const textInput = document.querySelector('.text-input');
    const processBtn = document.querySelector('.process-btn');
    
    // File upload events
    uploadZone.addEventListener('click', () => {
        fileInput.click();
    });
    
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = 'rgba(139, 92, 246, 0.8)';
        uploadZone.style.background = 'rgba(139, 92, 246, 0.1)';
    });
    
    uploadZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = 'rgba(139, 92, 246, 0.5)';
        uploadZone.style.background = 'rgba(255, 255, 255, 0.05)';
    });
    
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = 'rgba(139, 92, 246, 0.5)';
        uploadZone.style.background = 'rgba(255, 255, 255, 0.05)';
        
        const files = Array.from(e.dataTransfer.files);
        handleFileUpload(files);
    });
    
    fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        handleFileUpload(files);
    });
    
    // URL input
    addUrlBtn.addEventListener('click', () => {
        const url = urlInput.value.trim();
        if (url) {
            handleUrlUpload(url);
            urlInput.value = '';
        }
    });
    
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addUrlBtn.click();
        }
    });
    
    // Text processing
    processBtn.addEventListener('click', () => {
        const text = textInput.value.trim();
        if (text) {
            handleTextProcessing(text);
        }
    });
}

function handleFileUpload(files) {
    if (!uploadedFiles[currentSubject]) {
        uploadedFiles[currentSubject] = [];
    }
    
    files.forEach(file => {
        uploadedFiles[currentSubject].push({
            type: 'file',
            name: file.name,
            size: file.size,
            uploadDate: new Date()
        });
    });
    
    updateUploadDisplay();
    showUploadSuccess(`${files.length} file(s) uploaded successfully!`);
}

function handleUrlUpload(url) {
    if (!uploadedFiles[currentSubject]) {
        uploadedFiles[currentSubject] = [];
    }
    
    uploadedFiles[currentSubject].push({
        type: 'url',
        name: url,
        uploadDate: new Date()
    });
    
    updateUploadDisplay();
    showUploadSuccess('URL added successfully!');
}

function handleTextProcessing(text) {
    showProcessingNotification();
    
    // Simulate AI processing
    setTimeout(() => {
        if (!uploadedFiles[currentSubject]) {
            uploadedFiles[currentSubject] = [];
        }
        
        uploadedFiles[currentSubject].push({
            type: 'text',
            name: 'Pasted Notes',
            content: text.substring(0, 100) + '...',
            uploadDate: new Date()
        });
        
        updateUploadDisplay();
        showUploadSuccess('Text processed and topics generated!');
        
        // Clear text input
        document.querySelector('.text-input').value = '';
    }, 2000);
}

function updateUploadDisplay() {
    const uploadContent = document.querySelector('.upload-content');
    const files = uploadedFiles[currentSubject] || [];
    
    if (files.length > 0) {
        uploadContent.innerHTML = `
            <div class="upload-icon">
                <i data-lucide="check-circle"></i>
            </div>
            <h4 class="upload-text">${files.length} material(s) uploaded</h4>
            <p class="upload-description">Click to add more materials</p>
            <div class="uploaded-files">
                ${files.map(file => `
                    <div class="uploaded-file">
                        <i data-lucide="${getFileIcon(file.type)}" class="file-icon"></i>
                        <span class="file-name">${file.name}</span>
                        <span class="file-date">${formatDate(file.uploadDate)}</span>
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        uploadContent.innerHTML = `
            <div class="upload-icon">
                <i data-lucide="upload-cloud"></i>
            </div>
            <h4 class="upload-text">Drop your knowledge scrolls here</h4>
            <p class="upload-description">Or click to browse your mystical files</p>
            <div class="upload-formats">
                <span class="format-tag">PDF</span>
                <span class="format-tag">DOC</span>
                <span class="format-tag">TXT</span>
                <span class="format-tag">Links</span>
            </div>
        `;
    }
    
    lucide.createIcons();
}

function getFileIcon(type) {
    switch (type) {
        case 'file': return 'file';
        case 'url': return 'link';
        case 'text': return 'file-text';
        default: return 'file';
    }
}

function formatDate(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
}

function initializeTopicCards() {
    // This will be called when the page loads
    // Topic cards are dynamically generated in updateTopicsGrid
}

function showUploadSuccess(message) {
    showNotification(message, 'success');
}

function showProcessingNotification() {
    const notification = document.createElement('div');
    notification.className = 'processing-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <div class="processing-spinner">
                <i data-lucide="loader-2" class="spinner-icon"></i>
            </div>
            <span>AI is analyzing your content...</span>
        </div>
    `;
    
    // Add processing notification styles
    if (!document.querySelector('style[data-processing-notification]')) {
        const style = document.createElement('style');
        style.setAttribute('data-processing-notification', '');
        style.textContent = `
            .processing-notification {
                position: fixed;
                top: 2rem;
                right: 2rem;
                background: rgba(139, 92, 246, 0.9);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(139, 92, 246, 0.3);
                border-radius: 15px;
                padding: 1rem;
                z-index: 9999;
                animation: slideInRight 0.5s ease;
                max-width: 300px;
            }
            
            .processing-notification .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                color: #ffffff;
                font-weight: 500;
            }
            
            .processing-spinner {
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .spinner-icon {
                width: 1.25rem;
                height: 1.25rem;
                color: #ffffff;
                animation: spin 1s linear infinite;
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
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
    
    // Remove notification after processing
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 2500);
}

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
            
            .uploaded-files {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                margin-top: 1rem;
            }
            
            .uploaded-file {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                background: rgba(255, 255, 255, 0.1);
                padding: 0.75rem;
                border-radius: 10px;
                font-size: 0.875rem;
                color: rgba(255, 255, 255, 0.9);
            }
            
            .file-icon {
                width: 1rem;
                height: 1rem;
                color: #8b5cf6;
                flex-shrink: 0;
            }
            
            .file-name {
                flex: 1;
                font-weight: 500;
            }
            
            .file-date {
                color: rgba(255, 255, 255, 0.6);
                font-size: 0.75rem;
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