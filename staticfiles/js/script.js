// Initialize Lucide icons
lucide.createIcons();

// Global state
let currentStep = 'material-input';
let uploadedFiles = [];
let selectedTestType = null;

// Mobile menu functionality
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
        
        if (navMenu.classList.contains('active')) {
            menuIcon.setAttribute('data-lucide', 'x');
        } else {
            menuIcon.setAttribute('data-lucide', 'menu');
        }
        
        lucide.createIcons();
    });
}

// Smooth scrolling function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 15, 0.95)';
    } else {
        navbar.style.background = 'rgba(10, 10, 15, 0.8)';
    }
});

// File upload functionality
const uploadBox = document.getElementById('upload-box');
const fileInput = document.getElementById('file-input');
const contentTextarea = document.querySelector('.content-textarea');
const continueBtn = document.getElementById('continue-to-screening');

// File upload events
if (uploadBox && fileInput) {
    uploadBox.addEventListener('click', () => {
        fileInput.click();
    });

    uploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadBox.style.borderColor = 'rgba(139, 92, 246, 0.8)';
        uploadBox.style.background = 'rgba(139, 92, 246, 0.1)';
    });

    uploadBox.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadBox.style.borderColor = 'rgba(139, 92, 246, 0.5)';
        uploadBox.style.background = 'rgba(255, 255, 255, 0.05)';
    });

    uploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadBox.style.borderColor = 'rgba(139, 92, 246, 0.5)';
        uploadBox.style.background = 'rgba(255, 255, 255, 0.05)';
        
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    });

    fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        handleFiles(files);
    });
}

if (contentTextarea) {
    contentTextarea.addEventListener('input', (e) => {
        checkContinueButton();
    });
}

function handleFiles(files) {
    uploadedFiles = files;
    updateUploadDisplay();
    checkContinueButton();
}

function updateUploadDisplay() {
    if (uploadedFiles.length > 0 && uploadBox) {
        const uploadContent = uploadBox.querySelector('.upload-content');
        uploadContent.innerHTML = `
            <div class="upload-icon">
                <i data-lucide="check-circle"></i>
            </div>
            <h3 class="upload-title">${uploadedFiles.length} file(s) uploaded</h3>
            <p class="upload-description">Click to upload more files</p>
            <div class="uploaded-files">
                ${uploadedFiles.map(file => `
                    <div class="uploaded-file">
                        <i data-lucide="file"></i>
                        <span>${file.name}</span>
                    </div>
                `).join('')}
            </div>
        `;
        lucide.createIcons();
    }
}

function checkContinueButton() {
    if (!continueBtn) return;
    
    const hasFiles = uploadedFiles.length > 0;
    const hasText = contentTextarea && contentTextarea.value.trim().length > 0;
    
    if (hasFiles || hasText) {
        continueBtn.disabled = false;
        continueBtn.style.opacity = '1';
        continueBtn.style.pointerEvents = 'auto';
    } else {
        continueBtn.disabled = true;
        continueBtn.style.opacity = '0.5';
        continueBtn.style.pointerEvents = 'none';
    }
}

// Continue to screening
if (continueBtn) {
    continueBtn.addEventListener('click', () => {
        showSection('screening');
        scrollToSection('screening');
        showNotification('Great! Now choose your preferred test type.', 'success');
    });
}

// Screening card selection
const screeningCards = document.querySelectorAll('.screening-card');

screeningCards.forEach(card => {
    card.addEventListener('click', () => {
        // Remove selected class from all cards
        screeningCards.forEach(c => c.classList.remove('selected'));
        
        // Add selected class to clicked card
        card.classList.add('selected');
        
        const selectedTestType = card.getAttribute('data-type');

        document.getElementById('selected-test-type').value = selectedTestType;

        showNotification('Starting your test...', 'info');
        
        setTimeout(() => {
            document.querySelector('form').submit();
        }, 1000);
        
    });
});

// Show section function
function showSection(sectionId) {
    // Hide all sections
    const sections = ['material-input', 'screening', 'results-teaser'];
    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            section.classList.add('hidden');
        }
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
    
    currentStep = sectionId;
}

// Check for test results on page load
function checkForTestResults() {
    const urlParams = new URLSearchParams(window.location.search);
    const showResults = urlParams.get('showResults');
    
    if (showResults === 'true') {
        const results = localStorage.getItem('testResults');
        if (results) {
            const testData = JSON.parse(results);
            displayTestResults(testData);
            showSection('results-teaser');
            scrollToSection('results-teaser');
            
            // Clear the URL parameter
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
}

// Display test results
function displayTestResults(testData) {
    const resultsSection = document.getElementById('results-teaser');
    if (!resultsSection) return;
    
    // Update results display with actual test data
    const scoreElement = resultsSection.querySelector('.score');
    const strengthBars = resultsSection.querySelectorAll('.strength-section .skill-bar');
    const weaknessBars = resultsSection.querySelectorAll('.weakness-section .skill-bar');
    
    if (scoreElement) {
        scoreElement.textContent = `${testData.score}%`;
    }
    
    // Generate dynamic strengths and weaknesses based on score
    const strengths = generateStrengths(testData);
    const weaknesses = generateWeaknesses(testData);
    
    // Update strength bars
    strengthBars.forEach((bar, index) => {
        if (strengths[index]) {
            const nameElement = bar.querySelector('.skill-name');
            const fillElement = bar.querySelector('.progress-fill');
            const scoreElement = bar.querySelector('.skill-score');
            
            if (nameElement) nameElement.textContent = strengths[index].name;
            if (fillElement) fillElement.style.width = `${strengths[index].score}%`;
            if (scoreElement) scoreElement.textContent = `${strengths[index].score}%`;
        }
    });
    
    // Update weakness bars
    weaknessBars.forEach((bar, index) => {
        if (weaknesses[index]) {
            const nameElement = bar.querySelector('.skill-name');
            const fillElement = bar.querySelector('.progress-fill');
            const scoreElement = bar.querySelector('.skill-score');
            
            if (nameElement) nameElement.textContent = weaknesses[index].name;
            if (fillElement) fillElement.style.width = `${weaknesses[index].score}%`;
            if (scoreElement) scoreElement.textContent = `${weaknesses[index].score}%`;
        }
    });
    
    // Update study guide based on test type
    updateStudyGuide(testData);
    
    // Animate results
    setTimeout(() => {
        animateResults();
    }, 500);
}

// Generate strengths based on test performance
function generateStrengths(testData) {
    const baseStrengths = {
        'MCQ': [
            { name: 'Quick Recall', score: Math.min(95, testData.score + 10) },
            { name: 'Pattern Recognition', score: Math.min(90, testData.score + 5) }
        ],
        'Conceptual': [
            { name: 'Deep Understanding', score: Math.min(95, testData.score + 8) },
            { name: 'Critical Thinking', score: Math.min(90, testData.score + 3) }
        ],
        'Speed Test': [
            { name: 'Quick Processing', score: Math.min(95, testData.score + 12) },
            { name: 'Time Management', score: Math.min(90, testData.score + 7) }
        ]
    };
    
    return baseStrengths[testData.testType] || baseStrengths['MCQ'];
}

// Generate weaknesses based on test performance
function generateWeaknesses(testData) {
    const baseWeaknesses = {
        'MCQ': [
            { name: 'Detail Attention', score: Math.max(30, testData.score - 20) },
            { name: 'Concept Application', score: Math.max(25, testData.score - 25) }
        ],
        'Conceptual': [
            { name: 'Speed Under Pressure', score: Math.max(35, testData.score - 15) },
            { name: 'Memory Retention', score: Math.max(30, testData.score - 20) }
        ],
        'Speed Test': [
            { name: 'Accuracy Focus', score: Math.max(40, testData.score - 10) },
            { name: 'Complex Problem Solving', score: Math.max(35, testData.score - 15) }
        ]
    };
    
    return baseWeaknesses[testData.testType] || baseWeaknesses['MCQ'];
}

// Update study guide based on test type
function updateStudyGuide(testData) {
    const guideItems = document.querySelectorAll('.guide-item span');
    
    const guides = {
        'MCQ': [
            'Practice with timed multiple choice questions daily',
            'Focus on eliminating wrong answers systematically',
            'Review fundamental concepts regularly'
        ],
        'Conceptual': [
            'Engage in deep reading and analysis exercises',
            'Practice explaining concepts in your own words',
            'Connect new learning to existing knowledge'
        ],
        'Speed Test': [
            'Use flashcards for quick recall practice',
            'Set time limits for problem-solving sessions',
            'Practice mental math and quick calculations'
        ]
    };
    
    const testGuides = guides[testData.testType] || guides['MCQ'];
    
    guideItems.forEach((item, index) => {
        if (testGuides[index]) {
            item.textContent = testGuides[index];
        }
    });
}

// Animate results
function animateResults() {
    const progressBars = document.querySelectorAll('.results-teaser .progress-fill');
    
    progressBars.forEach((bar, index) => {
        setTimeout(() => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        }, index * 200);
    });
}

// Modal functionality
const showSignupModalBtn = document.getElementById('show-signup-modal');
const signupModal = document.getElementById('signup-modal');
const closeSignupModalBtn = document.getElementById('close-signup-modal');
const modalSignupForm = document.getElementById('modal-signup-form');

if (showSignupModalBtn) {
    showSignupModalBtn.addEventListener('click', () => {
        signupModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    });
}

if (closeSignupModalBtn) {
    closeSignupModalBtn.addEventListener('click', () => {
        signupModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    });
}

// Close modal when clicking outside
if (signupModal) {
    signupModal.addEventListener('click', (e) => {
        if (e.target === signupModal) {
            signupModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });
}

// Modal signup form handling
if (modalSignupForm) {
    modalSignupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(modalSignupForm);
        const name = modalSignupForm.querySelector('input[type="text"]').value;
        const email = modalSignupForm.querySelector('input[type="email"]').value;
        const level = modalSignupForm.querySelector('select').value;
        
        // Validate form
        if (!name || !email || !level) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate signup process
        const submitButton = modalSignupForm.querySelector('.signup-btn');
        const originalText = submitButton.innerHTML;
        
        submitButton.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Creating your analysis...';
        submitButton.disabled = true;
        
        lucide.createIcons();
        
        setTimeout(() => {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            lucide.createIcons();
            
            showNotification('Welcome to PrepDungeon! Check your email for your full analysis.', 'success');
            
            // Close modal and redirect
            signupModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
            
            setTimeout(() => {
                window.location.href = 'auth.html';
            }, 2000);
        }, 3000);
    });
}

// Notification system
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
            
            @keyframes slideOutRight {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100%);
                }
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
                gap: 0.5rem;
                background: rgba(255, 255, 255, 0.1);
                padding: 0.5rem;
                border-radius: 8px;
                font-size: 0.875rem;
                color: rgba(255, 255, 255, 0.8);
            }
            
            .uploaded-file i {
                width: 1rem;
                height: 1rem;
                color: #8b5cf6;
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

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature-card, .trust-badge, .section-header');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Initialize first step
    showSection('material-input');
    
    // Check for test results
    checkForTestResults();
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});