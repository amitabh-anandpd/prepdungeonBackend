// Initialize Lucide icons
lucide.createIcons();

// MCQ Test Questions
const questions2 = window.testQuestions;
const questions = [
    {
        question: "What is the primary purpose of a database index?",
        options: [
            "To store data permanently",
            "To speed up data retrieval operations",
            "To encrypt sensitive information",
            "To backup data automatically"
        ],
        correct: 1,
        explanation: "Database indexes are data structures that improve the speed of data retrieval operations on a database table."
    },
    {
        question: "Which of the following is NOT a fundamental principle of Object-Oriented Programming?",
        options: [
            "Encapsulation",
            "Inheritance",
            "Compilation",
            "Polymorphism"
        ],
        correct: 2,
        explanation: "Compilation is a process of converting code to machine language, not a fundamental OOP principle."
    },
    {
        question: "In project management, what does the acronym 'MVP' stand for?",
        options: [
            "Most Valuable Player",
            "Minimum Viable Product",
            "Maximum Value Proposition",
            "Minimum Value Process"
        ],
        correct: 1,
        explanation: "MVP stands for Minimum Viable Product - a product with enough features to attract early-adopter customers."
    },
    {
        question: "What is the time complexity of binary search algorithm?",
        options: [
            "O(n)",
            "O(log n)",
            "O(n²)",
            "O(1)"
        ],
        correct: 1,
        explanation: "Binary search has O(log n) time complexity as it eliminates half of the search space in each iteration."
    },
    {
        question: "Which HTTP status code indicates 'Not Found'?",
        options: [
            "200",
            "301",
            "404",
            "500"
        ],
        correct: 2,
        explanation: "HTTP status code 404 indicates that the requested resource could not be found on the server."
    },
    {
        question: "In statistics, what does 'correlation' measure?",
        options: [
            "The cause-effect relationship between variables",
            "The strength of linear relationship between variables",
            "The average value of a dataset",
            "The spread of data points"
        ],
        correct: 1,
        explanation: "Correlation measures the strength and direction of a linear relationship between two variables."
    },
    {
        question: "What is the main advantage of using version control systems like Git?",
        options: [
            "Faster code execution",
            "Automatic bug fixing",
            "Track changes and collaborate effectively",
            "Reduced memory usage"
        ],
        correct: 2,
        explanation: "Version control systems help track changes, maintain history, and enable effective collaboration among developers."
    }
];

// Test state
let currentQuestion = 0;
let userAnswers = [];
let timeRemaining = 300; // 5 minutes in seconds
let timerInterval;

// DOM elements
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const questionCounter = document.getElementById('question-counter');
const progressFill = document.getElementById('progress-fill');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const timer = document.getElementById('timer');

// Initialize test
function initTest() {
    displayQuestion();
    startTimer();
    updateProgress();
    updateNavigation();
}

// Start timer
function startTimer() {
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        if (timeRemaining <= 0) {
            finishTest();
        }
    }, 1000);
}

// Update timer display
function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Change color when time is running low
    if (timeRemaining <= 60) {
        timer.style.color = '#ef4444';
    } else if (timeRemaining <= 120) {
        timer.style.color = '#f59e0b';
    }
}

// Display current question
function displayQuestion() {
    const question = questions2[currentQuestion];
    questionText.textContent = question.question;
    questionCounter.textContent = `Question ${currentQuestion + 1} of ${questions2.length}`;
    
    // Clear previous options
    optionsContainer.innerHTML = '';
    
    // Create option buttons
    question.options.forEach((option, index) => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'option-btn';
        optionBtn.innerHTML = `
            <span class="option-letter">${String.fromCharCode(65 + index)}</span>
            <span class="option-text">${option}</span>
        `;
        
        // Check if this option was previously selected
        if (userAnswers[currentQuestion] === index) {
            optionBtn.classList.add('selected');
        }
        
        optionBtn.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(optionBtn);
    });
}

// Select an option
function selectOption(optionIndex) {
    // Remove previous selection
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selection to clicked option
    event.target.closest('.option-btn').classList.add('selected');
    
    // Store answer
    userAnswers[currentQuestion] = optionIndex;
    
    // Enable next button
    nextBtn.disabled = false;
}

// Update progress bar
function updateProgress() {
    const progress = ((currentQuestion + 1) / questions2.length) * 100;
    progressFill.style.width = `${progress}%`;
}

// Update navigation buttons
function updateNavigation() {
    prevBtn.disabled = currentQuestion === 0;
    
    if (currentQuestion === questions2.length - 1) {
        nextBtn.innerHTML = `
            Finish Test
            <i data-lucide="check" class="btn-icon"></i>
        `;
    } else {
        nextBtn.innerHTML = `
            Next
            <i data-lucide="arrow-right" class="btn-icon"></i>
        `;
    }
    
    // Enable next button if question is answered
    nextBtn.disabled = userAnswers[currentQuestion] === undefined;
    
    lucide.createIcons();
}

// Previous question
prevBtn.addEventListener('click', () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion();
        updateProgress();
        updateNavigation();
    }
});

// Next question or finish test
nextBtn.addEventListener('click', () => {
    if (currentQuestion === questions2.length - 1) {
        finishTest();
    } else {
        currentQuestion++;
        displayQuestion();
        updateProgress();
        updateNavigation();
    }
});

// Finish test
function finishTest() {
    clearInterval(timerInterval);
    
    // Calculate score
    let correctAnswers = 0;
    userAnswers.forEach((answer, index) => {
        if (answer === questions2[index].correct) {
            correctAnswers++;
        }
    });
    
    const score = Math.round((correctAnswers / questions2.length) * 100);
    
    // Store results in localStorage
    const results = {
        testType: 'MCQ',
        score: score,
        correctAnswers: correctAnswers,
        totalQuestions: questions2.length,
        timeSpent: 300 - timeRemaining,
        answers: userAnswers,
        questions: questions2
    };
    
    localStorage.setItem('testResults', JSON.stringify(results));
    
    // Redirect to homepage with results
    window.location.href = 'index.html?showResults=true';
}

// Initialize test when page loads
document.addEventListener('DOMContentLoaded', initTest);