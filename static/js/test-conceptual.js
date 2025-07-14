// Initialize Lucide icons
lucide.createIcons();

// Conceptual Test Questions
const questions = [
    {
        question: "Explain the concept of 'Big O notation' and why it's important in algorithm analysis. What does O(n²) complexity mean?",
        options: [
            "It measures the exact runtime of an algorithm in seconds",
            "It describes the worst-case time complexity as input size grows, O(n²) means runtime grows quadratically",
            "It only applies to sorting algorithms and measures memory usage",
            "It represents the best-case scenario for algorithm performance"
        ],
        correct: 1,
        explanation: "Big O notation describes the upper bound of algorithm complexity, helping us understand how performance scales with input size."
    },
    {
        question: "What is the fundamental difference between 'machine learning' and 'traditional programming'? How does the approach to problem-solving differ?",
        options: [
            "Machine learning is faster than traditional programming",
            "Traditional programming uses explicit instructions, ML learns patterns from data to make predictions",
            "Machine learning only works with numerical data",
            "There is no significant difference between the two approaches"
        ],
        correct: 1,
        explanation: "Traditional programming uses explicit rules, while ML discovers patterns in data to make predictions on new, unseen data."
    },
    {
        question: "Describe the concept of 'technical debt' in software development. What are its long-term implications?",
        options: [
            "Money owed to software vendors for licensing",
            "Shortcuts in code that save time now but create maintenance problems later",
            "The cost of hiring technical staff",
            "Bugs that need to be fixed immediately"
        ],
        correct: 1,
        explanation: "Technical debt refers to the implied cost of additional rework caused by choosing quick solutions over better approaches."
    },
    {
        question: "What is the purpose of 'normalization' in database design? How does it improve data integrity?",
        options: [
            "To make all data values positive numbers",
            "To organize data to reduce redundancy and improve data integrity by eliminating update anomalies",
            "To encrypt sensitive database information",
            "To speed up all database queries"
        ],
        correct: 1,
        explanation: "Normalization reduces data redundancy and dependency by organizing fields and table relationships, preventing update anomalies."
    },
    {
        question: "Explain the concept of 'API' and its role in modern software architecture. Why are APIs crucial for system integration?",
        options: [
            "APIs are only used for web development",
            "Application Programming Interfaces define how software components communicate, enabling modular and integrated systems",
            "APIs are a type of database management system",
            "APIs only work with mobile applications"
        ],
        correct: 1,
        explanation: "APIs define contracts for how different software components interact, enabling modularity, reusability, and system integration."
    },
    {
        question: "What is 'cloud computing' and how does it differ from traditional on-premises infrastructure? What are the key benefits?",
        options: [
            "Cloud computing is just another term for the internet",
            "On-demand access to computing resources over the internet, offering scalability, cost-efficiency, and reduced maintenance",
            "Cloud computing only provides data storage services",
            "It's the same as traditional infrastructure but more expensive"
        ],
        correct: 1,
        explanation: "Cloud computing provides on-demand access to shared computing resources, offering scalability, flexibility, and cost benefits over traditional infrastructure."
    }
];

// Test state
let currentQuestion = 0;
let userAnswers = [];
let timeRemaining = 600; // 10 minutes in seconds
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
    if (timeRemaining <= 120) {
        timer.style.color = '#ef4444';
    } else if (timeRemaining <= 240) {
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
        optionBtn.className = 'option-btn conceptual';
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
        testType: 'Conceptual',
        score: score,
        correctAnswers: correctAnswers,
        totalQuestions: questions.length,
        timeSpent: 600 - timeRemaining,
        answers: userAnswers,
        questions: questions
    };
    
    localStorage.setItem('testResults', JSON.stringify(results));
    
    // Redirect to homepage with results
    window.location.href = 'index.html?showResults=true';
}

// Initialize test when page loads
document.addEventListener('DOMContentLoaded', initTest);