const startBtn = document.querySelector('.start-btn');
const popupInfo = document.querySelector('.popup-info');
const exitBtn = document.querySelector('.exit-btn');
const main = document.querySelector('.main');
const continueBtn = document.querySelector('.continue-btn');
const quizSection = document.querySelector('.quiz-section');
const quizBox = document.querySelector('.quiz-box');
const nextBtn = document.querySelector('.next-btn');
const optionList = document.querySelector('.option-list');
const questionText = document.querySelector('.question-text');
const headerScore = document.querySelector('.header-score');
const quizTotal = document.querySelector('.quiz-total');

let questionCount = 0;
let userScore = 0;
let selectedAnswer = null;

startBtn.onclick = () => {
    popupInfo.classList.add('active');
    main.classList.add('active');
}

exitBtn.onclick = () => {
    popupInfo.classList.remove('active');
    main.classList.remove('active');
}

continueBtn.onclick = () => {
    quizSection.classList.add('active');
    popupInfo.classList.remove('active');
    main.classList.remove('active');
    quizBox.classList.add('active');

    showQuestions(0);
}

//Getting questions and options from array
function showQuestions(index) {
    const question = questions[index];
    questionText.textContent = `${question.numb}. ${question.question}`;
    quizTotal.textContent = `${question.numb} of ${questions.length} Questions`;
    
    // Clear previous options
    optionList.innerHTML = '';
    
    // Add new options
    question.options.forEach((option) => {
        const div = document.createElement('div');
        div.classList.add('option');
        div.innerHTML = `<span>${option}</span>`;
        div.onclick = () => selectOption(div, option[0]); // Get A, B, C, D
        optionList.appendChild(div);
    });
    
    selectedAnswer = null;
    nextBtn.style.background = 'rgba(255, 255, 255, .1)';
    nextBtn.style.color = 'rgba(255, 255, 255, .3)';
    nextBtn.style.pointerEvents = 'none';
}

// Handle option selection
function selectOption(element, answer) {
    // Remove previous selection
    const allOptions = document.querySelectorAll('.option');
    allOptions.forEach(option => {
        option.classList.remove('correct', 'incorrect');
    });
    
    selectedAnswer = answer;
    element.classList.add('selected');
    
    // Enable next button
    nextBtn.style.background = '#c40094';
    nextBtn.style.color = '#fff';
    nextBtn.style.pointerEvents = 'auto';
    nextBtn.style.boxShadow = '0 0 10px #c40094';
    nextBtn.style.cursor = 'pointer';
}

// Next button click
nextBtn.onclick = () => {
    if (selectedAnswer === null) {
        alert('Please select an option!');
        return;
    }
    
    const currentQuestion = questions[questionCount];
    const allOptions = document.querySelectorAll('.option');
    
    // Check if answer is correct
    if (selectedAnswer === currentQuestion.answer) {
        selectedAnswer = currentQuestion.answer;
        userScore++;
        allOptions.forEach(option => {
            if (option.textContent.includes(selectedAnswer)) {
                option.classList.add('correct');
            }
        });
    } else {
        allOptions.forEach(option => {
            if (option.textContent.includes(selectedAnswer)) {
                option.classList.add('incorrect');
            }
            if (option.textContent.includes(currentQuestion.answer)) {
                option.classList.add('correct');
            }
        });
    }
    
    // Update score
    headerScore.textContent = `Score: ${userScore} / ${questions.length}`;
    
    // Disable next button temporarily
    nextBtn.style.pointerEvents = 'none';
    nextBtn.style.color = 'rgba(255, 255, 255, .3)';
    
    // Show next question after 1 second
    setTimeout(() => {
        questionCount++;
        if (questionCount < questions.length) {
            showQuestions(questionCount);
        } else {
            showResultScreen();
        }
    }, 1000);
}

// Show result screen
function showResultScreen() {
    quizBox.innerHTML = `
        <div class="result-box">
            <h1>Quiz Completed!</h1>
            <div class="score-display">
                <h2>Your Score</h2>
                <p class="score-text">${userScore} / ${questions.length}</p>
                <p class="percentage">${Math.round((userScore / questions.length) * 100)}%</p>
            </div>
            <div class="result-buttons">
                <button class="restart-btn">Restart Quiz</button>
                <button class="home-btn">Go Home</button>
            </div>
        </div>
    `;
    
    // Add event listeners to result buttons
    document.querySelector('.restart-btn').onclick = () => {
        location.reload();
    }
    
    document.querySelector('.home-btn').onclick = () => {
        quizSection.classList.remove('active');
        quizBox.classList.remove('active');
        questionCount = 0;
        userScore = 0;
        headerScore.textContent = 'Score: 0 / 5';
    }
}
