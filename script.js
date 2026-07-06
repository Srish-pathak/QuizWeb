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
    quizBox.innerHTML = `
        <div class="result-box">
            <h1>🎉 Quiz Completed!</h1>
            <div class="score-display">
                <h2>आपका स्कोर / Your Score</h2>
                <p class="score-text">${userScore} / ${questions.length}</p>
                <p class="percentage">${Math.round((userScore / questions.length) * 100)}%</p>
                <p class="result-message" id="result-message"></p>
            </div>
            <div class="result-buttons">
                <button class="restart-btn">Restart Quiz</button>
                <button class="home-btn">Go Home</button>
            </div>
        </div>
    `;

    // Set result message based on score
    const percentage = Math.round((userScore / questions.length) * 100);
    let message = '';
    
    if (percentage === 100) {
        message = '🏆 Perfect! आप एक Quiz Master हैं! / You are a Quiz Master!';
    } else if (percentage >= 80) {
        message = '⭐ बहुत अच्छा! / Excellent! Keep it up!';
    } else if (percentage >= 60) {
        message = '👍 अच्छा! / Good! Try again to improve!';
    } else if (percentage >= 40) {
        message = '📚 और ज्यादा मेहनत करें! / Need more practice!';
    } else {
        message = '💪 फिर से कोशिश करो! / Keep learning!';
    }
    
    document.getElementById('result-message').textContent = message;

    // Add event listeners to result buttons
    document.querySelector('.restart-btn').onclick = () => {
        restartQuiz();
    }

    document.querySelector('.home-btn').onclick = () => {
        goHome();
    }
}

// Restart Quiz Function
function restartQuiz() {
    quizBox.classList.remove('active');
    quizSection.classList.remove('active');
    
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
    
    // Re-attach event listeners
    const newNextBtn = document.querySelector('.next-btn');
    newNextBtn.onclick = nextBtn.onclick;
    
    quizSection.classList.add('active');
    quizBox.classList.add('active');
    
    showQuestions(0);
    questionCounter(1);
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
