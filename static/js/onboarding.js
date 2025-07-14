// Initialize Lucide icons
lucide.createIcons();

// Onboarding state
let selectedPath = null;

// Path selection functionality
const pathCards = document.querySelectorAll('.path-card');
const continueBtn = document.getElementById('continue-btn');

pathCards.forEach(card => {
    card.addEventListener('click', () => {
        // Remove selected class from all cards
        pathCards.forEach(c => c.classList.remove('selected'));
        
        // Add selected class to clicked card
        card.classList.add('selected');
        
        // Store selected path
        selectedPath = card.getAttribute('data-path');
        
        // Enable continue button
        continueBtn.disabled = false;
        
        // Update character dialogue based on selection
        updateCharacterDialogue(selectedPath);
    });
});

// Continue button functionality
continueBtn.addEventListener('click', () => {
    if (selectedPath) {
        // Store user preference
        localStorage.setItem('learningPath', selectedPath);
        
        // Show completion animation
        showCompletionAnimation();
        
        // Redirect to dashboard after animation
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    }
});

// Update character dialogue based on path selection
function updateCharacterDialogue(path) {
    const dialogueText = document.querySelector('.dialogue-text');
    
    const dialogues = {
        'guided': "Excellent choice! I'll be your personal mentor, guiding you through each step of your learning journey. Together, we'll unlock your full potential!",
        'solo': "A true explorer's spirit! You prefer to chart your own course through the knowledge realms. I respect that independence - I'll be here when you need guidance.",
        'competitive': "The arena calls to you! You thrive on competition and challenges. Prepare yourself for epic battles against fellow scholars. May the best mind win!"
    };
    
    dialogueText.textContent = dialogues[path];
    
    // Add typing animation effect
    dialogueText.style.opacity = '0';
    setTimeout(() => {
        dialogueText.style.opacity = '1';
        dialogueText.style.transition = 'opacity 0.5s ease';
    }, 100);
}

// Show completion animation
function showCompletionAnimation() {
    const container = document.querySelector('.onboarding-container');
    
    // Create completion overlay
    const overlay = document.createElement('div');
    overlay.className = 'completion-overlay';
    overlay.innerHTML = `
        <div class="completion-content">
            <div class="completion-icon">
                <i data-lucide="check-circle" class="success-icon"></i>
            </div>
            <h2 class="completion-title">Welcome to PrepDungeon!</h2>
            <p class="completion-message">Your adventure begins now...</p>
            <div class="loading-bar">
                <div class="loading-fill"></div>
            </div>
        </div>
    `;
    
    // Add completion styles
    const style = document.createElement('style');
    style.textContent = `
        .completion-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            animation: fadeIn 0.5s ease;
        }
        
        .completion-content {
            text-align: center;
            max-width: 400px;
            padding: 2rem;
        }
        
        .completion-icon {
            margin-bottom: 1.5rem;
        }
        
        .success-icon {
            width: 4rem;
            height: 4rem;
            color: #10b981;
            animation: scaleIn 0.6s ease;
        }
        
        .completion-title {
            font-family: 'Bungee', cursive;
            font-size: 2rem;
            color: #ffffff;
            margin-bottom: 1rem;
            animation: slideUp 0.8s ease;
        }
        
        .completion-message {
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 2rem;
            animation: slideUp 1s ease;
        }
        
        .loading-bar {
            width: 100%;
            height: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            overflow: hidden;
        }
        
        .loading-fill {
            height: 100%;
            background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
            border-radius: 10px;
            width: 0%;
            animation: loadingProgress 2s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes scaleIn {
            from { transform: scale(0); }
            to { transform: scale(1); }
        }
        
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes loadingProgress {
            from { width: 0%; }
            to { width: 100%; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(overlay);
    
    // Reinitialize icons
    lucide.createIcons();
}

// Tutorial card animations
document.addEventListener('DOMContentLoaded', () => {
    const tutorialCards = document.querySelectorAll('.tutorial-card');
    
    // Animate cards on load
    tutorialCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Character animation
    const characterAvatar = document.querySelector('.character-avatar');
    if (characterAvatar) {
        characterAvatar.style.animation = 'float 3s ease-in-out infinite';
    }
    
    // Add floating animation
    const floatStyle = document.createElement('style');
    floatStyle.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
    `;
    document.head.appendChild(floatStyle);
});

// Add hover sound effects (placeholder)
pathCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        // Placeholder for hover sound effect
        console.log('Hover sound effect');
    });
    
    card.addEventListener('click', () => {
        // Placeholder for click sound effect
        console.log('Click sound effect');
    });
});