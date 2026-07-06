// DOM Elements Selection
const startBtn = document.querySelector('.start-btn');
const popupInfo = document.querySelector('.popup-info');
const exitBtn = document.querySelector('.exit-btn');
const main = document.querySelector('.main');
const continueBtn = document.querySelector('.continue-btn');
const quizSection = document.querySelector('.quiz-section');
const quizBox = document.querySelector('.quiz-box');

const questionText = document.querySelector('.question-text');
const optionList = document.querySelector('.option-list');
const quizTotal = document.querySelector('.quiz-total');
const headerScore = document.querySelector('.header-score');
const nextBtn = document.querySelector('.next-btn');

let questionCount = 0;
let questionNumb = 1;
let userScore = 0;
let selectedOption = null;
let currentQuizAttempt = {
    score: 0,
    totalQuestions: 0,
    date: '',
    percentage: 0
};

// ============ LocalStorage Functions ============

// High Scores को localStorage से get करना
function getHighScores() {
    const scores = localStorage.getItem('quizHighScores');
    return scores ? JSON.parse(scores) : [];
}

// High Scores को localStorage में save करना
function saveHighScores(scores) {
    localStorage.setItem('quizHighScores', JSON.stringify(scores));
}

// नया attempt save करना
function saveQuizAttempt(score, total) {
    const attempt = {
        score: score,
        totalQuestions: total,
        percentage: Math.round((score / total) * 100),
        date: new Date().toLocaleDateString('en-IN') + ' ' + new Date().toLocaleTimeString('en-IN'),
        timestamp: Date.now()
    };

    const highScores = getHighScores();
    highScores.push(attempt);
    
    // सबसे recent 10 attempts ही रखें
    if (highScores.length > 10) {
        highScores.shift();
    }
    
    saveHighScores(highScores);
    return attempt;
}

// सबसे high score get करना
function getHighestScore() {
    const scores = getHighScores();
    if (scores.length === 0) return null;
    return scores.reduce((max, current) => 
        current.percentage > max.percentage ? current : max
    );
}

// Average score calculate करना
function getAverageScore() {
    const scores = getHighScores();
    if (scores.length === 0) return 0;
    const total = scores.reduce((sum, score) => sum + score.percentage, 0);
    return Math.round(total / scores.length);
}

// Total attempts get करना
function getTotalAttempts() {
    return getHighScores().length;
}

// Statistics display करना
function displayStatistics() {
    const highestScore = getHighestScore();
    const averageScore = getAverageScore();
    const totalAttempts = getTotalAttempts();

    let statsHTML = `
        <div class="stats-container">
            <h3>📊 Your Quiz Statistics</h3>
            <div class="stats-grid">
                <div class="stat-card">
                    <p class="stat-label">Total Attempts</p>
                    <p class="stat-value">${totalAttempts}</p>
                </div>
                <div class="stat-card">
                    <p class="stat-label">Highest Score</p>
                    <p class="stat-value">${highestScore ? highestScore.percentage + '%' : 'N/A'}</p>
                </div>
                <div class="stat-card">
                    <p class="stat-label">Average Score</p>
                    <p class="stat-value">${averageScore}%</p>
                </div>
            </div>
        </div>
    `;

    // अगर कम से कम एक attempt है तो history दिखाएं
    if (totalAttempts > 0) {
        const scores = getHighScores();
        statsHTML += `<div class="score-history"><h4>📝 Recent Attempts:</h4>`;
        
        // Reverse order में सबसे recent पहले
        scores.reverse().forEach((score, index) => {
            statsHTML += `
                <div class="history-item">
                    <span>${index + 1}. ${score.date}</span>
                    <span class="score-badge ${score.percentage >= 80 ? 'excellent' : score.percentage >= 60 ? 'good' : 'needswork'}">
                        ${score.score}/${score.totalQuestions} (${score.percentage}%)
                    </span>
                </div>
            `;
        });
        
        statsHTML += `</div>`;
    }

    return statsHTML;
}

// ============ Quiz Functions ============

// Start Quiz Button Click
startBtn.onclick = () => {
    popupInfo.classList.add('active');
    main.classList.add('active');
}

// Exit Button Click
exitBtn.onclick = () => {
    popupInfo.classList.remove('active');
    main.classList.remove('active');
}

// Continue Button Click
continueBtn.onclick = () => {
    quizSection.classList.add('active');
    popupInfo.classList.remove('active');
    main.classList.remove('active');
    quizBox.classList.add('active');

    showQuestions(0);
    questionCounter(1);
    headerScore.textContent = `Score: 0 / ${questions.length}`;
}

// Next Button Click
nextBtn.onclick = () => {
    if (selectedOption === null) {
        alert('कृपया एक विकल्प चुनें! / Please select an option!');
        return;
    }

    if (questionCount < questions.length - 1) {
        questionCount++;
        showQuestions(questionCount);
        questionNumb++;
        questionCounter(questionNumb);
        selectedOption = null;
        
        // Reset next button state
        nextBtn.style.background = 'rgba(255, 255, 255, .1)';
        nextBtn.style.color = 'rgba(255, 255, 255, .3)';
        nextBtn.style.pointerEvents = 'none';
    }
    else {
        showResultBox();
    }
}

// Fetching Questions and Options from array
function showQuestions(index) {
    // Fixed syntax error: questions[index] instead of questions.[index]
    const question = questions[index];
    questionText.textContent = `${question.numb}. ${question.question}`;

    // Clear previous options
    optionList.innerHTML = '';

    // Add new options
    question.options.forEach((option, i) => {
        const optionDiv = document.createElement('div');
        optionDiv.classList.add('option');
        optionDiv.innerHTML = `<span>${option}</span>`;
        optionDiv.onclick = () => optionSelected(optionDiv, option[0]); // Pass A, B, C, D
        optionList.appendChild(optionDiv);
    });
    
    selectedOption = null;
}

// User Option Selection Logic
function optionSelected(element, answerLetter) {
    selectedOption = answerLetter;
    const correctAnswer = questions[questionCount].answer;
    const allOptions = document.querySelectorAll('.option');

    // Remove previous selections
    allOptions.forEach(opt => {
        opt.classList.remove('selected', 'correct', 'incorrect');
    });

    if (answerLetter === correctAnswer) {
        element.classList.add('correct');
        userScore++;
        headerScore.textContent = `Score: ${userScore} / ${questions.length}`;
    }
    else {
        element.classList.add('incorrect');
        // Show correct answer
        allOptions.forEach(opt => {
            if (opt.textContent.includes(correctAnswer)) {
                opt.classList.add('correct');
            }
        });
    }

    // Disable all options after selection
    allOptions.forEach(opt => {
        opt.style.pointerEvents = 'none';
        opt.style.opacity = '0.7';
    });

    // Enable next button
    nextBtn.style.background = '#c40094';
    nextBtn.style.color = '#fff';
    nextBtn.style.pointerEvents = 'auto';
    nextBtn.style.boxShadow = '0 0 10px #c40094';
    nextBtn.style.cursor = 'pointer';
}

// Total Questions Counter Update
function questionCounter(index) {
    quizTotal.textContent = `${index} of ${questions.length} Questions`;
}

// Show Final Result Box
function showResultBox() {
    // Current attempt को save करें
    const attempt = saveQuizAttempt(userScore, questions.length);

    const percentage = Math.round((userScore / questions.length) * 100);
    let message = '';
    let emoji = '';
    
    if (percentage === 100) {
        message = '🏆 Perfect! आप एक Quiz Master हैं! / You are a Quiz Master!';
        emoji = '🏆';
    } else if (percentage >= 80) {
        message = '⭐ बहुत अच्छा! / Excellent! Keep it up!';
        emoji = '⭐';
    } else if (percentage >= 60) {
        message = '👍 अच्छा! / Good! Try again to improve!';
        emoji = '👍';
    } else if (percentage >= 40) {
        message = '📚 और ज्यादा मेहनत करें! / Need more practice!';
        emoji = '📚';
    } else {
        message = '💪 फिर से कोशिश करो! / Keep learning!';
        emoji = '💪';
    }

    const statisticsHTML = displayStatistics();

    quizBox.innerHTML = `
        <div class="result-box">
            <h1>${emoji} Quiz Completed!</h1>
            <div class="score-display">
                <h2>आपका स्कोर / Your Score</h2>
                <p class="score-text">${userScore} / ${questions.length}</p>
                <p class="percentage">${percentage}%</p>
                <p class="result-message">${message}</p>
            </div>
            ${statisticsHTML}
            <div class="result-buttons">
                <button class="restart-btn">Restart Quiz</button>
                <button class="home-btn">Go Home</button>
                <button class="clear-stats-btn">Clear History</button>
            </div>
        </div>
    `;

    // Add event listeners to result buttons
    document.querySelector('.restart-btn').onclick = () => {
        restartQuiz();
    }

    document.querySelector('.home-btn').onclick = () => {
        goHome();
    }

    document.querySelector('.clear-stats-btn').onclick = () => {
        if (confirm('क्या आप सभी records delete करना चाहते हैं? / Are you sure you want to delete all records?')) {
            localStorage.removeItem('quizHighScores');
            alert('सभी records delete हो गए! / All records deleted!');
            goHome();
        }
    }
}

// Restart Quiz Function
function restartQuiz() {
    quizBox.classList.remove('active');
    
    questionCount = 0;
    questionNumb = 1;
    userScore = 0;
    selectedOption = null;
    
    quizBox.innerHTML = `
        <h1>Codehal Quiz</h1>
        <div class="quiz-header">
            <span>Quiz Website Tutorials</span>
            <span class="header-score">Score: 0 / ${questions.length}</span>
        </div>
        <h2 class="question-text"></h2>
        <div class="option-list"></div>
        <div class="quiz-footer">
            <span class="quiz-total"></span>
            <button class="next-btn">Next</button>
        </div>
    `;
    
    quizBox.classList.add('active');
    
    // Re-attach event listeners by reinitializing
    setTimeout(() => {
        const newNextBtn = document.querySelector('.next-btn');
        newNextBtn.onclick = nextBtn.onclick;
        
        showQuestions(0);
        questionCounter(1);
        headerScore.textContent = `Score: 0 / ${questions.length}`;
    }, 100);
}

// Go To Home Function
function goHome() {
    quizSection.classList.remove('active');
    quizBox.classList.remove('active');
    
    questionCount = 0;
    questionNumb = 1;
    userScore = 0;
    selectedOption = null;
    
    // Reset quizBox content
    quizBox.innerHTML = `
        <h1>Codehal Quiz</h1>
        <div class="quiz-header">
            <span>Quiz Website Tutorials</span>
            <span class="header-score">Score: 0 / ${questions.length}</span>
        </div>
        <h2 class="question-text"></h2>
        <div class="option-list"></div>
        <div class="quiz-footer">
            <span class="quiz-total"></span>
            <button class="next-btn">Next</button>
        </div>
    `;
    
    headerScore.textContent = `Score: 0 / ${questions.length}`;
}
