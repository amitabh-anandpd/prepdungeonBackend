lucide.createIcons();

const testCards = document.querySelectorAll('.test-container');

let currentQuestion = 0;
let userAnswers = Array(testCards.length).fill(null);
let timeRemaining = 300;
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
            displayQuestion();
            updateProgress();
            btn.disabled = true;
        });
    }
});

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
    testCards.forEach(testCard =>{
        testCard.classList.add('hidden');
        const index = parseInt(testCard.dataset.index);
        if(index===currentQuestion){
            testCard.classList.remove('hidden');
            questionCounter.textContent = `Question ${currentQuestion + 1} of ${testCards.length}`;

            const nextBtn = testCard.querySelector('.test-btn.primary');
            const prevBtn = testCard.querySelector('.test-btn.secondary');

            if (nextBtn) nextBtn.disabled = false;
            if (prevBtn) prevBtn.disabled = false;

            const opts = testCard.querySelectorAll('.option-btn');
            opts.forEach((opt, optIdx) => {
                opt.onclick = () => {
                    opts.forEach(o => o.classList.remove('selected'));
                    opt.classList.add('selected');
                    userAnswers[currentQuestion] = optIdx;
                };
            });
        }
    });
    lucide.createIcons();
}

function updateProgress() {
    const progress = ((currentQuestion + 1) / testCards.length) * 100;
    progressFill.style.width = `${progress}%`;
}

function handleBackClick(event) {
    event.preventDefault(); // stop immediate navigation
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
}

function finishTest() {
    clearInterval(timerInterval);

    const payload = {
        test_type: 'mcq',
        userAnswers: userAnswers,
        totalQuestions: testCards.length,
        timeSpent: 300 - timeRemaining,
        timePerQuestion: timePerQuestion,
    };

    fetch('/submit-mcq/', {
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
