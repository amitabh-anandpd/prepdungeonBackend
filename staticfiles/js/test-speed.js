// Initialize Lucide icons
lucide.createIcons();

// Speed Test Questions
const questions = [
    {
        question: "What does HTML stand for?",
        options: [
            "Hyper Text Markup Language",
            "High Tech Modern Language",
            "Home Tool Markup Language",
            "Hyperlink Text Management Language"
        ],
        correct: 0,
        explanation: "HTML stands for Hyper Text Markup Language, the standard markup language for web pages."
    },
    {
        question: "Which symbol is used for comments in JavaScript?",
        options: [
            "/* */",
            "//",
            "<!-- -->",
            "Both A and B"
        ],
        correct: 3,
        explanation: "JavaScript supports both // for single-line comments and /* */ for multi-line comments."
    },
    {
        question: "What is 2^8?",
        options: [
            "128",
            "256",
            "64",
            "512"
        ],
        correct: 1,
        explanation: "2^8 = 2 × 2 × 2 × 2 × 2 × 2 × 2 × 2 = 256"
    },
    {
        question: "Which HTTP method is used to retrieve data?",
        options: [
            "POST",
            "GET",
            "PUT",
            "DELETE"
        ],
        correct: 1,
        explanation: "GET method is used to retrieve data from a server."
    },
    {
        question: "What does CSS stand for?",
        options: [
            "Computer Style Sheets",
            "Creative Style Sheets",
            "Cascading Style Sheets",
            "Colorful Style Sheets"
        ],
        correct: 2,
        explanation: "CSS stands for Cascading Style Sheets, used for styling web pages."
    },
    {
        question: "Which data type is NOT primitive in JavaScript?",
        options: [
            "string",
            "number",
            "object",
            "boolean"
        ],
        correct: 2,
        explanation: "Object is a non-primitive data type in JavaScript, while string, number, and boolean are primitive."
    },
    {
        question: "What is the result of 15 % 4?",
        options: [
            "3",
            "4",
            "3.75",
            "1"
        ],
        correct: 0,
        explanation: "15 % 4 = 3 (remainder when 15 is divided by 4)"
    },
    {
        question: "Which tag is used for the largest heading in HTML?",
        options: [
            "<h6>",
            "<h1>",
            "<header>",
            "<title>"
        ],
        correct: 1,
        explanation: "<h1> represents the largest heading in HTML, with <h6> being the smallest."
    }
];

// Test state
let currentQuestion = 0;
let userAnswers = [];
let timeRemaining = 180; // 3 minutes in seconds
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
    if (timeRemaining <= 30) {
        timer.style.color = '#ef4444';
    } else if (timeRemaining <= 60) {
        timer.style.color = '#f59e0b';
    }
}

// Display current question
function displayQuestion() {
    const question = questions[currentQuestion];
    questionText.textContent = question.question;
    questionCounter.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
    
    // Clear previous options
    optionsContainer.innerHTML = '';
    
    // Create option buttons
    question.options.forEach((option, index) => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'option-btn speed';
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
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressFill.style.width = `${progress}%`;
}

// Update navigation buttons
function updateNavigation() {
    prevBtn.disabled = currentQuestion === 0;
    
    if (currentQuestion === questions.length - 1) {
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
    if (currentQuestion === questions.length - 1) {
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
        if (answer === questions[index].correct) {
            correctAnswers++;
        }
    });
    
    const score = Math.round((correctAnswers / questions.length) * 100);
    
    // Store results in localStorage
    const results = {
        testType: 'Speed Test',
        score: score,
        correctAnswers: correctAnswers,
        totalQuestions: questions.length,
        timeSpent: 180 - timeRemaining,
        answers: userAnswers,
        questions: questions
    };
    
    localStorage.setItem('testResults', JSON.stringify(results));
    
    // Redirect to homepage with results
    window.location.href = 'index.html?showResults=true';
}

// Initialize test when page loads
document.addEventListener('DOMContentLoaded', initTest);