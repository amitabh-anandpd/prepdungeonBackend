lucide.createIcons();

const testCards = document.querySelectorAll('.test-container');

let currentQuestion = 0;
let userAnswers = Array(testCards.length).fill(null);
let timeRemaining = 900;
let timerInterval;
let questionStartTime = Date.now();
let timePerQuestion = Array(testCards.length).fill(0);

const nextButtons = document.querySelectorAll('.test-btn.primary');
const prevButtons = document.querySelectorAll('.test-btn.secondary');
const questionCounter = document.getElementById('question-counter');
const progressFill = document.getElementById('progress-fill');
const timer = document.getElementById('timer');

nextButtons.forEach(btn => {
    const index = parseInt(btn.dataset.index);
    if(index!==(testCards.length-1)){
        btn.addEventListener('click', () => {
            const now = Date.now();
            if (currentQuestion >= 0 && currentQuestion < testCards.length) {
                timePerQuestion[currentQuestion] += Math.floor((now - questionStartTime) / 1000);
                questionStartTime = now;
            }
            currentQuestion = index + 1; 
            saveAnswer(index);
            displayQuestion();
            updateProgress();
            btn.disabled = true;
        });
    }
    else{
        btn.innerHTML = `
        Finish Test
        <i data-lucide="check" class="btn-icon"></i>
        `;
        btn.addEventListener('click', () => {
            const now = Date.now();
            if (currentQuestion >= 0 && currentQuestion < testCards.length) {
                timePerQuestion[currentQuestion] += Math.floor((now - questionStartTime) / 1000);
                questionStartTime = now;
            }
            saveAnswer(index);
            finishTest();
        });
    }
});

prevButtons.forEach(btn => {
    const index = parseInt(btn.dataset.index);
    if(index!==0){
        btn.addEventListener('click', () => {
            const now = Date.now();
            if (currentQuestion >= 0 && currentQuestion < testCards.length) {
                timePerQuestion[currentQuestion] += Math.floor((now - questionStartTime) / 1000);
                questionStartTime = now;
            }
            currentQuestion = index-1;
            saveAnswer(index);
            displayQuestion();
            updateProgress();
            btn.disabled = true;
        });
    }
});
function saveAnswer(index) {
    const textarea = testCards[index].querySelector('.content-textarea');
    if (textarea) {
        userAnswers[index] = textarea.value.trim();
    }
}
function initTest() {
    displayQuestion();
    startTimer();
    updateProgress();
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeRemaining--;
        const m = String(Math.floor(timeRemaining / 60)).padStart(2, '0');
        const s = String(timeRemaining % 60).padStart(2, '0');
        timer.textContent = `${m}:${s}`;

        if (timeRemaining <= 0) finishTest();
        else if (timeRemaining <= 60) timer.style.color = '#ef4444';
        else if (timeRemaining <= 120) timer.style.color = '#f59e0b';
    }, 1000);
}

function displayQuestion() {
    testCards.forEach((testCard, index) => {
        testCard.classList.add('hidden');
        if (index === currentQuestion) {
            testCard.classList.remove('hidden');
            questionCounter.textContent = `Question ${currentQuestion + 1} of ${testCards.length}`;

            const nextBtn = testCard.querySelector('.test-btn.primary');
            const prevBtn = testCard.querySelector('.test-btn.secondary');
            if (nextBtn) nextBtn.disabled = false;
            if (prevBtn) prevBtn.disabled = false;

            // Load saved answer if user goes back
            const textarea = testCard.querySelector('.content-textarea');
            if (textarea) {
                textarea.value = userAnswers[index] || '';
            }
        }
    });
    lucide.createIcons();
}

function updateProgress() {
    const progress = ((currentQuestion + 1) / testCards.length) * 100;
    progressFill.style.width = `${progress}%`;
}

function finishTest() {
    clearInterval(timerInterval);
    
    const questionIds = Array.from(testCards).map(card => card.dataset.questionId);

    const payload = {
        test_type: 'speed-test',
        userAnswers: userAnswers,
        questionIds: questionIds,
        totalQuestions: testCards.length,
        timeSpent: 300 - timeRemaining,
        timePerQuestion: timePerQuestion,
    };

    fetch('/submit-conceptual/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', "X-CSRFToken": getCookie('csrftoken')},
        body: JSON.stringify(payload)
    }).then(r => {
        if (r.ok) window.location.href = '/';
        else alert('Failed to submit score');
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initTest();
    window.handleBackClick = function(event) {
        event.preventDefault();
        finishTest(() => {
            Promise.all([
                fetch("/clear-notification/", {
                    method: "POST",
                    headers: {
                        "X-CSRFToken": getCookie("csrftoken"),
                        "Content-Type": "application/json"
                    }
                }),
                fetch("/clear-question-ids/", {
                    method: "POST",
                    headers: {
                        "X-CSRFToken": getCookie("csrftoken"),
                        "Content-Type": "application/json"
                    }
                })
            ]).finally(() => {
                window.location.href = "/";
            });
        });
    };
});