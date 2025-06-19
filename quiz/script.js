let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let answerSelected = false;


async function fetchQuestions() {
  try {
    const response = await fetch('https://opentdb.com/api.php?amount=5&category=18&type=multiple');
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();

    questions = data.results.map(q => {
      const allAnswers = [...q.incorrect_answers, q.correct_answer];
      return {
        question: decodeHTML(q.question),
        correct: decodeHTML(q.correct_answer),
        answers: shuffle(allAnswers.map(decodeHTML))
      };
    });

    if (questions.length === 0) {
      document.getElementById('question-box').innerHTML = "<p>No questions available.</p>";
      return;
    }

    currentQuestionIndex = 0;
    score = 0;

    document.getElementById('prev-btn').disabled = true;
    document.getElementById('next-btn').disabled = false;
    document.getElementById('next-btn').style.display = 'inline-block';
    document.getElementById('submit-btn').style.display = 'none';
    document.getElementById('submit-btn').disabled = true;


    showQuestion();
    showImageForQuestion(currentQuestionIndex);

  } catch (error) {
    document.getElementById('question-box').innerHTML = `<p>Failed to load quiz. Try again later.</p>`;
    console.error(error);
  }
}

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function shuffle(array) {
  let arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function showQuestion() {
  const q = questions[currentQuestionIndex];

  document.getElementById('question-count').textContent = `Q${currentQuestionIndex + 1} of ${questions.length}`;
  document.getElementById('progress-fill').style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;

  const html = `
    <h2>${q.question}</h2>
    <ul>
  ${q.answers.map((ans, i) => 
    `<li>
      <button class="answer-btn" onclick="selectAnswer(this)">
        <span class="option-label">${String.fromCharCode(65 + i)}.</span> ${ans}
      </button>
    </li>`
  ).join('')}
</ul>
 `;

  document.getElementById('question-box').innerHTML = html;

  // Reset buttons enabled
  document.querySelectorAll('#question-box button').forEach(btn => btn.disabled = false);

  // Always reset button states
  answerSelected = false;
  if (currentQuestionIndex < questions.length - 1) {
  document.getElementById('next-btn').disabled = true;
  document.getElementById('next-btn').style.display = 'inline-block';
  document.getElementById('submit-btn').style.display = 'none';
} else {
  document.getElementById('submit-btn').disabled = true;
  document.getElementById('submit-btn').style.display = 'inline-block';
  document.getElementById('next-btn').style.display = 'none';
}


}

function selectAnswer(button) {
  const selected = button.innerHTML.split('</span>')[1].trim();
  const correct = questions[currentQuestionIndex].correct;
  const allButtons = document.querySelectorAll('#question-box .answer-btn');

  answerSelected = true;

  allButtons.forEach(btn => {
    btn.disabled = true;
    btn.classList.remove("correct", "wrong");
    const icon = btn.querySelector('.icon');
    if (icon) icon.remove();
  });

  if (selected === correct) {
    button.classList.add("correct");
    button.insertAdjacentHTML('beforeend', '<span class="icon">✔️</span>');
    score++;
    updateScoreDisplay();
  } else {
    button.classList.add("wrong");
    button.insertAdjacentHTML('beforeend', '<span class="icon">❌</span>');
    allButtons.forEach(btn => {
      const btnText = btn.innerHTML.split('</span>')[1].trim();
      if (btnText === correct) {
        btn.classList.add("correct");
        btn.insertAdjacentHTML('beforeend', '<span class="icon">✔️</span>');
      }
    });
  }

  // ✅ Enable next or submit
  if (currentQuestionIndex < questions.length - 1) {
    const nextBtn = document.getElementById('next-btn');
    nextBtn.disabled = false;
    nextBtn.style.display = 'inline-block';
  } else {
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = false;
    submitBtn.style.display = 'inline-block';
  }
}

// Previous question button handler
function prevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion();
    showImageForQuestion(currentQuestionIndex);
    document.getElementById('prev-btn').disabled = currentQuestionIndex === 0;

    // Show/hide next and submit buttons appropriately
    if (currentQuestionIndex === questions.length - 1) {
      document.getElementById('next-btn').style.display = 'none';
      document.getElementById('submit-btn').style.display = 'inline-block';
      document.getElementById('submit-btn').disabled = true; // disable until answer selected
    } else {
      document.getElementById('next-btn').style.display = 'inline-block';
      document.getElementById('next-btn').disabled = false;
      document.getElementById('submit-btn').style.display = 'none';
    }
  }
}

// Next question button handler
function nextQuestion() {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    showQuestion();
    showImageForQuestion(currentQuestionIndex);
    document.getElementById('prev-btn').disabled = false;

    if (currentQuestionIndex === questions.length - 1) {
      // Last question: hide Next, show Submit
      document.getElementById('next-btn').style.display = 'none';
      document.getElementById('submit-btn').style.display = 'inline-block';
      document.getElementById('submit-btn').disabled = true; // disable until answer selected
    } else {
      document.getElementById('next-btn').style.display = 'inline-block';
      document.getElementById('next-btn').disabled = true;
      document.getElementById('submit-btn').style.display = 'none';
    }
  }
}

// Submit button handler
function submitQuiz() {
  showScore();
}


function confirmRestart() {
  if (confirm("Are you sure you want to restart the quiz?")) {
    restartQuiz();
  }
}


function showScore() {
  document.getElementById('question-count').textContent = "";
  document.getElementById('progress-fill').style.width = `100%`;
  document.getElementById('question-box').innerHTML = `
  <h2>Quiz Completed!</h2>
  <div id="final-score" class="score-display">${score}</div>
  <button id="restart-btn">Restart Quiz</button>
  `;
  document.getElementById('prev-btn').disabled = true;
  document.getElementById('next-btn').disabled = true;
  document.getElementById('submit-btn').disabled = true;
  document.getElementById('submit-btn').style.display = 'none';

  document.getElementById('restart-btn').addEventListener('click', () => {
    restartQuiz();
  });
}

function showResult() {
  document.querySelector('.quiz-box').classList.add('hide');
  document.querySelector('.result-container').classList.remove('hide');

  const correct = score; // 'score' must be your actual correct answers count
  const total = questions.length;
  const wrong = total - correct;
  const percent = Math.round((correct / total) * 100);

  // update text values
  document.getElementById('correct-count').textContent = correct;
  document.getElementById('wrong-count').textContent = wrong;
  document.getElementById('final-score').textContent = correct;
  document.getElementById('total-score').textContent = total;

  // update circle score
  const progress = document.querySelector('.progress');
  const scoreText = document.querySelector('.score-text');

  let currentPercent = 0;
  const interval = setInterval(() => {
    const angle = currentPercent * 3.6;
    progress.style.background = `conic-gradient(#4caf50 ${angle}deg, #ddd ${angle}deg)`;
    scoreText.textContent = `${currentPercent}%`;

    if (currentPercent >= percent) {
      clearInterval(interval);
    } else {
      currentPercent++;
    }
  }, 15);
}



function updateScoreDisplay() {
  document.getElementById('score-display').textContent = `Score: ${score}`;
}

function restartQuiz() {
  fetchQuestions();
  score = 0;
  updateScoreDisplay();
  score = 0;
  currentQuestionIndex = 0;
  document.querySelector('.result-container').classList.add('hide');
  document.querySelector('.quiz-box').classList.remove('hide');
  showQuestion(currentQuestionIndex);
}



// Optional: show different CS related images per question index (can use any URLs or local images)
const images = [
  "https://cdn-icons-png.flaticon.com/512/1055/1055646.png",  // computer icon
  "https://cdn-icons-png.flaticon.com/512/3097/3097947.png",  // coding icon
  "https://cdn-icons-png.flaticon.com/512/2917/2917990.png",  // study/reading icon
  "https://cdn-icons-png.flaticon.com/512/1995/1995523.png",  // light bulb idea icon
  "https://cdn-icons-png.flaticon.com/512/1086/1086933.png"   // brain icon
];

function showImageForQuestion(index) {
  const img = document.getElementById('quiz-image');
  img.src = images[index] || "";
  img.style.display = img.src ? "inline-block" : "none";
}

// Event listeners for buttons
window.onload = () => {
  fetchQuestions();

  document.getElementById('prev-btn').addEventListener('click', prevQuestion);
  document.getElementById('next-btn').addEventListener('click', nextQuestion);
  document.getElementById('submit-btn').addEventListener('click', submitQuiz);
  document.getElementById('start-timer-btn').addEventListener('click', startTimer);
};