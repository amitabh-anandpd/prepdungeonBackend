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
    const dataTransfer = new DataTransfer();
    files.forEach(file => dataTransfer.items.add(file));
    fileInput.files = dataTransfer.files;

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
            <p class="upload-description">Click to change file</p>
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
if (continueBtn) {
    continueBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('screening');
        scrollToSection('screening');
        showNotification('Great! Now choose your preferred test type.', 'success');
    });
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
            const form = document.getElementById('study-material-form');
            const formData = new FormData(form);
        
            // Append uploaded files
            uploadedFiles.forEach(file => {
                formData.append('file_input', file);
            });
        
            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')  // required if using Django CSRF
                }
            })
            .then(response => {
                if (response.redirected) {
                    window.location.href = response.url;
                } else {
                    return response.text(); // or JSON
                }
            })
            .catch(err => {
                showNotification("Upload failed. Please try again.", "error");
                console.error(err);
            });
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

function checkForTestResults() {
    const testData = window.score;
    displayTestResults({
            testType: testData.test_type,
            score: testData.score,
            correctAnswers: testData.correct,
            totalQuestions: testData.total,
            timeSpent: testData.time
    });

    showSection('results-teaser');
    scrollToSection('results-teaser');
}

// Display test results
function displayTestResults(testData) {
    const resultsSection = document.getElementById('results-teaser');
    if (!resultsSection) return;
    
    // Update results display with actual test data
    const Totlascore = resultsSection.querySelector('.score');
    const strengthBars = resultsSection.querySelectorAll('.strength-section .skill-bar');
    const weaknessBars = resultsSection.querySelectorAll('.weakness-section .skill-bar');
    
    if (Totlascore) {
        Totlascore.textContent = `${testData.score}%`;
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
    const data = window.score;
    const baseStrengths = {
        'mcq': [
            { name: 'Quick Recall', score: data.quickRecall ? Number(data.quickRecall) : 0 },
            { name: 'Pattern Recognition', score: data.patternRecognition ? Number(data.patternRecognition): 0 }
        ],
        'conceptual': [
            { name: 'Deep Understanding', score: data.deepUnderstanding ? Number(data.deepUnderstanding) : 0  },
            { name: 'Critical Thinking', score: data.criticalThinking ? Number(data.criticalThinking) : 0  }
        ],
        'speed-test': [
            { name: 'Quick Processing', score: data.quickProcessing ? Number(data.quickProcessing) : 0  },
            { name: 'Time Management', score: data.timeManagement ? Number(data.timeManagement) : 0  }
        ]
    };
    
    return baseStrengths[data.test_type] || baseStrengths['mcq'];
}

// Generate weaknesses based on test performance
function generateWeaknesses(testData) {
    const data = window.score;
    const baseWeaknesses = {
        'mcq': [
            { name: 'Detail Attention', score: data.detailAttention ? Number(data.detailAttention) : 0},
            { name: 'Concept Application', score: data.conceptApplication ? Number(data.conceptApplication) : 0 }
        ],
        'conceptual': [
            { name: 'Complex Problem Solving', score: data.problemSolving ? Number(data.problemSolving) : 0  },
            { name: 'Memory Retention', score: data.memoryRetention ? Number(data.memoryRetention) : 0}
        ],
        'speed-test': [
            { name: 'Accuracy Focus', score: data.accuracyFocus ? Number(data.accuracyFocus) : 0 },
            { name: 'Speed', score: data.speed ? Number(data.speed) : 0 }
        ]
    };
    
    return baseWeaknesses[data.test_type] || baseWeaknesses['mcq'];
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
        if (submitButton) {
            const originalText = submitButton.innerHTML;
        
            submitButton.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Creating your analysis...';
            submitButton.disabled = true;
        }
        
        lucide.createIcons();
        if(submitButton){
            setTimeout(() => {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                lucide.createIcons();
                
                showNotification('Welcome to PrepDungeon! Check your email for your full analysis.', 'success');
                
                // Close modal and redirect
                signupModal.classList.add('hidden');
                document.body.style.overflow = 'auto';
                
                setTimeout(() => {
                    window.location.href = '/auth/';
                }, 2000);
            }, 3000);
        }
    });
}
// Modal functionality
const showWaitlistModalBtn = document.getElementById('show-Waitlist-modal');
const WaitlistModal = document.getElementById('Waitlist-modal');
const closeWaitlistModalBtn = document.getElementById('close-Waitlist-modal');
const modalWaitlistForm = document.getElementById('modal-Waitlist-form');

if (showWaitlistModalBtn) {
    showWaitlistModalBtn.addEventListener('click', () => {
        WaitlistModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    });
}

if (closeWaitlistModalBtn) {
    closeWaitlistModalBtn.addEventListener('click', () => {
        WaitlistModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    });
}

// Close modal when clicking outside
if (WaitlistModal) {
    WaitlistModal.addEventListener('click', (e) => {
        if (e.target === WaitlistModal) {
            WaitlistModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });
}

// Modal Waitlist form handling
if (modalWaitlistForm) {
    modalWaitlistForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(modalWaitlistForm);
        const name = modalWaitlistForm.querySelector('input[type="text"]').value;
        const email = modalWaitlistForm.querySelector('input[type="email"]').value;
        const score = window.score;

        const submitButton = modalWaitlistForm.querySelector('.signup-btn');
        const originalText = submitButton.innerHTML;
        
        submitButton.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Joining Waitlist...';
        submitButton.disabled = true;
        lucide.createIcons();

        try {
            const res = await fetch('/join-waitlist/', {
              method : 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken' : getCookie('csrftoken')
              },
              body: JSON.stringify({ name, email, score })
            });
      
            const data = await res.json();
            if (!res.ok || !data.success) {
              showNotification("Error: "+data.message, "error")
              return;
            }
      
            showNotification('Welcome to PrepDungeon! We’ve e‑mailed your full analysis.', 'success');
            WaitlistModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
      
            // optional redirect
            setTimeout(() => window.location.href = '/', 2000);
      
          } catch (err) {
            console.error(err);
            showNotification(err.message, 'error');
          } finally {
            submitButton.innerHTML = originalText;
            submitButton.disabled  = false;
            lucide.createIcons();
          }
    });
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
    const mcqSc = window.score;

    if (mcqSc){
        checkForTestResults();
    }
    else{
        showSection('material-input');
    }
    
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