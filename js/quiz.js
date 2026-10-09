/**
 * EcoSort AI - Interactive Waste & Recycling Quiz
 */

const QUIZ_QUESTIONS = [
  {
    question: "Can a greasy cardboard pizza box be recycled in the paper recycling bin?",
    options: [
      "Yes, all cardboard is 100% recyclable",
      "No, food oil and grease contaminate the paper recycling pulp",
      "Only if you wipe it with a wet towel first",
      "Yes, but only if it has cheese remnants"
    ],
    correct: 1,
    explanation: "Food oil and grease cannot be separated from paper fibers during pulping. Tear off clean lid portions for recycling, and compost the greasy base!"
  },
  {
    question: "How many times can an aluminum beverage can be melted down and recycled?",
    options: [
      "Up to 5 times before it weakens",
      "Only 1 time",
      "Infinitely, without any loss in material quality or strength",
      "Up to 20 times"
    ],
    correct: 2,
    explanation: "Aluminum is a permanent material that can be recycled infinitely! Recycling aluminum uses 95% less energy than mining raw bauxite ore."
  },
  {
    question: "Why should rechargeable lithium batteries NEVER be placed in curbside recycling bins?",
    options: [
      "They are too small for the sorting machine",
      "They can puncture and cause dangerous chemical fires in trucks and sorting facilities",
      "They dissolve into plastic",
      "They make too much noise"
    ],
    correct: 1,
    explanation: "Lithium-ion batteries are prone to catastrophic thermal runaway and spark hundreds of waste facility fires each year. Always take them to designated E-Waste drop-offs!"
  },
  {
    question: "Can broken drinking glasses, ceramics, and mirrors be mixed into the bottle recycling bin?",
    options: [
      "No, they melt at different temperatures and contaminate the container glass batch",
      "Yes, glass is glass",
      "Only clear ceramics can be recycled",
      "Yes, as long as pieces are swept into a bag"
    ],
    correct: 0,
    explanation: "Drinkware, Pyrex, ceramics, and mirrors have higher melting points and chemical additives that create defects in new glass bottles."
  },
  {
    question: "What is the best way to prepare plastic drink bottles for curbside recycling?",
    options: [
      "Leave half full of soda to add weight",
      "Rinse thoroughly, flatten to save volume, and crush before sorting",
      "Cut the bottle into tiny shredded pieces",
      "Burn the bottle"
    ],
    correct: 1,
    explanation: "Emptying and crushing bottles conserves space in sorting bins and collection trucks while preventing liquid contamination."
  }
];

class EcoQuiz {
  constructor() {
    this.currentIdx = 0;
    this.score = 0;
    this.quizCompleted = false;

    this.container = document.getElementById('quiz-container');
    this.initUI();
  }

  initUI() {
    if (!this.container) return;
    this.renderQuestion();
  }

  renderQuestion() {
    if (this.currentIdx >= QUIZ_QUESTIONS.length) {
      this.renderCompletion();
      return;
    }

    const q = QUIZ_QUESTIONS[this.currentIdx];
    this.container.innerHTML = `
      <div class="quiz-card">
        <div class="quiz-header">
          <span class="quiz-step-badge">Question ${this.currentIdx + 1} of ${QUIZ_QUESTIONS.length}</span>
          <span class="quiz-score-badge">Score: ${this.score * 20} Pts</span>
        </div>
        <h4 class="quiz-title">${q.question}</h4>
        <div class="quiz-options-list">
          ${q.options.map((opt, i) => `
            <button class="quiz-option-btn" data-index="${i}">
              <span class="opt-letter">${String.fromCharCode(65 + i)}</span>
              <span class="opt-text">${opt}</span>
            </button>
          `).join('')}
        </div>
        <div id="quiz-feedback" class="quiz-feedback hidden"></div>
      </div>
    `;

    const btns = this.container.querySelectorAll('.quiz-option-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedIdx = parseInt(btn.dataset.index, 10);
        this.handleAnswer(selectedIdx, btns);
      });
    });
  }

  handleAnswer(selectedIdx, btns) {
    btns.forEach(b => b.disabled = true);
    const q = QUIZ_QUESTIONS[this.currentIdx];
    const feedback = document.getElementById('quiz-feedback');

    const isCorrect = selectedIdx === q.correct;
    if (isCorrect) {
      this.score++;
      btns[selectedIdx].classList.add('correct');
      feedback.className = 'quiz-feedback feedback-success';
      feedback.innerHTML = `
        <div class="fb-title"><i data-lucide="check-circle-2"></i> Correct! (+20 EcoPoints)</div>
        <div class="fb-desc">${q.explanation}</div>
        <button id="quiz-next-btn" class="btn btn-primary btn-sm mt-3">Next Question <i data-lucide="arrow-right"></i></button>
      `;
    } else {
      btns[selectedIdx].classList.add('wrong');
      btns[q.correct].classList.add('correct');
      feedback.className = 'quiz-feedback feedback-error';
      feedback.innerHTML = `
        <div class="fb-title"><i data-lucide="alert-circle"></i> Not quite!</div>
        <div class="fb-desc">${q.explanation}</div>
        <button id="quiz-next-btn" class="btn btn-primary btn-sm mt-3">Next Question <i data-lucide="arrow-right"></i></button>
      `;
    }

    feedback.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();

    const nextBtn = document.getElementById('quiz-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.currentIdx++;
        this.renderQuestion();
      });
    }
  }

  renderCompletion() {
    const totalEarned = this.score * 20;
    if (window.EcoAnalytics) {
      window.EcoAnalytics.ecoPoints += totalEarned;
      window.EcoAnalytics.save();
      window.EcoAnalytics.updateUserBadge();
    }

    this.container.innerHTML = `
      <div class="quiz-complete-card">
        <div class="complete-icon-box">🏆</div>
        <h3>Quiz Finished!</h3>
        <p class="complete-subtitle">You scored <strong>${this.score} out of ${QUIZ_QUESTIONS.length}</strong> and earned <strong>+${totalEarned} EcoPoints</strong>!</p>
        <div class="complete-badge-awarded">
          <i data-lucide="award"></i> Certified Recycling Specialist
        </div>
        <button id="restart-quiz-btn" class="btn btn-outline mt-4">
          <i data-lucide="rotate-ccw"></i> Retake Eco Quiz
        </button>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    const restartBtn = document.getElementById('restart-quiz-btn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.currentIdx = 0;
        this.score = 0;
        this.renderQuestion();
      });
    }
  }
}

window.EcoQuiz = EcoQuiz;
