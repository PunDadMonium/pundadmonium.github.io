// ========================================
// PawMatch — Pet Compatibility Quiz
// ========================================

(function () {
  'use strict';

  // ---- Quiz Questions ----
  const questions = [
    {
      id: 'pet_type',
      text: 'What kind of pet do you have?',
      category: 'profile',
      type: 'choice',
      options: [
        { icon: '🐕', label: 'Dog', value: 'dog' },
        { icon: '🐈', label: 'Cat', value: 'cat' },
        { icon: '🐦', label: 'Bird', value: 'bird' },
        { icon: '🐹', label: 'Small animal (hamster, rabbit, etc.)', value: 'small' },
      ],
    },
    {
      id: 'energy_owner',
      text: 'How would you describe your energy level?',
      category: 'lifestyle',
      type: 'choice',
      options: [
        { icon: '🛋️', label: 'Total couch potato', value: 1 },
        { icon: '🚶', label: 'Casual and chill', value: 2 },
        { icon: '🏃', label: 'Active and on-the-go', value: 3 },
        { icon: '⚡', label: 'Non-stop energy machine', value: 4 },
      ],
    },
    {
      id: 'energy_pet',
      text: "How would you describe your pet's energy level?",
      category: 'lifestyle',
      type: 'choice',
      options: [
        { icon: '😴', label: 'Sleeps most of the day', value: 1 },
        { icon: '🐾', label: 'Relaxed with bursts of play', value: 2 },
        { icon: '🎾', label: 'Always ready for action', value: 3 },
        { icon: '🌪️', label: 'Absolute chaos tornado', value: 4 },
      ],
    },
    {
      id: 'schedule',
      text: 'How much time do you spend at home each day?',
      category: 'lifestyle',
      type: 'choice',
      options: [
        { icon: '🏢', label: 'Mostly away (8+ hours)', value: 1 },
        { icon: '🔀', label: 'Hybrid — some home, some away', value: 2 },
        { icon: '🏠', label: 'Mostly home', value: 3 },
        { icon: '🤗', label: 'Home all day with my pet', value: 4 },
      ],
    },
    {
      id: 'social_owner',
      text: 'How social are you?',
      category: 'personality',
      type: 'choice',
      options: [
        { icon: '📖', label: 'Introverted — I love quiet time', value: 1 },
        { icon: '☕', label: 'Selectively social', value: 2 },
        { icon: '🎉', label: 'Pretty outgoing', value: 3 },
        { icon: '🦋', label: 'Total social butterfly', value: 4 },
      ],
    },
    {
      id: 'social_pet',
      text: 'How does your pet react to new people?',
      category: 'personality',
      type: 'choice',
      options: [
        { icon: '🙈', label: 'Hides immediately', value: 1 },
        { icon: '👀', label: 'Cautious but curious', value: 2 },
        { icon: '🐕', label: 'Warms up quickly', value: 3 },
        { icon: '🥳', label: 'Loves everyone instantly', value: 4 },
      ],
    },
    {
      id: 'routine',
      text: 'How consistent is your daily routine?',
      category: 'lifestyle',
      type: 'choice',
      options: [
        { icon: '🎲', label: 'Every day is different', value: 1 },
        { icon: '📋', label: 'Somewhat consistent', value: 2 },
        { icon: '⏰', label: 'Pretty structured', value: 3 },
        { icon: '🤖', label: 'Like clockwork', value: 4 },
      ],
    },
    {
      id: 'affection',
      text: 'How do you prefer to bond with your pet?',
      category: 'bond',
      type: 'choice',
      options: [
        { icon: '🛋️', label: 'Chill in the same room', value: 'coexist' },
        { icon: '🫶', label: 'Cuddles and physical touch', value: 'physical' },
        { icon: '🎮', label: 'Play and activities together', value: 'active' },
        { icon: '🗣️', label: 'Talking and training', value: 'mental' },
      ],
    },
    {
      id: 'space',
      text: 'How much space does your pet have?',
      category: 'environment',
      type: 'choice',
      options: [
        { icon: '🏙️', label: 'Small apartment', value: 1 },
        { icon: '🏘️', label: 'Medium apartment/home', value: 2 },
        { icon: '🏡', label: 'House with yard', value: 3 },
        { icon: '🌳', label: 'Large property / rural', value: 4 },
      ],
    },
    {
      id: 'understand',
      text: "How well do you understand your pet's moods?",
      category: 'bond',
      type: 'choice',
      options: [
        { icon: '🤷', label: "Honestly, I'm still learning", value: 1 },
        { icon: '🤔', label: 'I get the basics', value: 2 },
        { icon: '😊', label: 'Pretty in tune', value: 3 },
        { icon: '🧠', label: 'We practically read minds', value: 4 },
      ],
    },
    {
      id: 'happiness',
      text: 'How happy does your pet seem on a typical day?',
      sub: 'Drag the slider to rate',
      category: 'bond',
      type: 'slider',
      min: 1,
      max: 10,
      default: 7,
      labelMin: 'Not very happy',
      labelMax: 'Over the moon',
    },
    {
      id: 'commitment',
      text: 'How much effort do you put into your pet\'s wellbeing?',
      sub: 'Think about food, exercise, vet visits, enrichment',
      category: 'bond',
      type: 'slider',
      min: 1,
      max: 10,
      default: 7,
      labelMin: 'Minimal',
      labelMax: 'All-in',
    },
  ];

  // ---- State ----
  let currentQuestion = 0;
  const answers = {};

  // ---- DOM References ----
  const $ = (sel) => document.querySelector(sel);
  const screens = {
    landing: $('#screen-landing'),
    quiz: $('#screen-quiz'),
    loading: $('#screen-loading'),
    results: $('#screen-results'),
  };

  // ---- Navigation Helpers ----
  function showScreen(name) {
    Object.values(screens).forEach((s) => s.classList.remove('active'));
    screens[name].classList.add('active');
  }

  function updateProgress() {
    const pct = ((currentQuestion + 1) / questions.length) * 100;
    $('#progress-fill').style.width = pct + '%';
    $('#progress-text').textContent = `${currentQuestion + 1} / ${questions.length}`;
  }

  function updateNavButtons() {
    $('#btn-back').disabled = currentQuestion === 0;
    const q = questions[currentQuestion];
    const hasAnswer = answers[q.id] !== undefined;
    const isLast = currentQuestion === questions.length - 1;
    const nextBtn = $('#btn-next');
    nextBtn.disabled = !hasAnswer;
    nextBtn.textContent = isLast ? 'See Results' : 'Next';
  }

  // ---- Render Questions ----
  function renderQuestion() {
    const q = questions[currentQuestion];
    const container = $('#question-container');
    let html = `<p class="question-text">${q.text}</p>`;
    if (q.sub) html += `<p class="question-sub">${q.sub}</p>`;

    if (q.type === 'choice') {
      html += '<div class="options">';
      q.options.forEach((opt) => {
        const selected = answers[q.id] === opt.value ? ' selected' : '';
        html += `
          <div class="option${selected}" data-value="${opt.value}">
            <span class="option-icon">${opt.icon}</span>
            <span class="option-label">${opt.label}</span>
          </div>`;
      });
      html += '</div>';
    } else if (q.type === 'slider') {
      const val = answers[q.id] !== undefined ? answers[q.id] : q.default;
      html += `
        <div class="slider-container">
          <input type="range" min="${q.min}" max="${q.max}" value="${val}" id="slider-input">
          <div class="slider-labels">
            <span>${q.labelMin}</span>
            <span>${q.labelMax}</span>
          </div>
          <div class="slider-value" id="slider-display">${val} / ${q.max}</div>
        </div>`;
    }

    container.innerHTML = html;

    // Bind events
    if (q.type === 'choice') {
      container.querySelectorAll('.option').forEach((el) => {
        el.addEventListener('click', () => {
          container.querySelectorAll('.option').forEach((o) => o.classList.remove('selected'));
          el.classList.add('selected');
          let val = el.dataset.value;
          // Parse numeric values
          if (!isNaN(val) && val !== '') val = Number(val);
          answers[q.id] = val;
          updateNavButtons();
        });
      });
    } else if (q.type === 'slider') {
      const slider = container.querySelector('#slider-input');
      const display = container.querySelector('#slider-display');
      // Auto-set default
      if (answers[q.id] === undefined) answers[q.id] = q.default;
      slider.addEventListener('input', () => {
        const v = Number(slider.value);
        answers[q.id] = v;
        display.textContent = `${v} / ${q.max}`;
        updateNavButtons();
      });
    }

    updateProgress();
    updateNavButtons();
  }

  // ---- Scoring Algorithm ----
  function calculateScore() {
    const scores = {
      lifestyle: 0,
      personality: 0,
      bond: 0,
      environment: 0,
    };

    // Lifestyle: Energy match (closer = better)
    if (answers.energy_owner !== undefined && answers.energy_pet !== undefined) {
      const diff = Math.abs(answers.energy_owner - answers.energy_pet);
      scores.lifestyle += [100, 80, 50, 20][diff] || 0;
    }

    // Lifestyle: Schedule — more time at home = better for most pets
    if (answers.schedule !== undefined) {
      scores.lifestyle += [0, 40, 70, 100][answers.schedule - 1] || 0;
    }

    // Lifestyle: Routine consistency
    if (answers.routine !== undefined) {
      // Most pets benefit from routine
      scores.lifestyle += [30, 60, 85, 100][answers.routine - 1] || 0;
    }

    scores.lifestyle = Math.round(scores.lifestyle / 3);

    // Personality: Social match
    if (answers.social_owner !== undefined && answers.social_pet !== undefined) {
      const diff = Math.abs(answers.social_owner - answers.social_pet);
      scores.personality = [100, 80, 55, 30][diff] || 0;
    }

    // Bond: Understanding + Happiness + Commitment + Affection style
    let bondParts = 0;
    let bondSum = 0;

    if (answers.understand !== undefined) {
      bondSum += answers.understand * 25;
      bondParts++;
    }
    if (answers.happiness !== undefined) {
      bondSum += answers.happiness * 10;
      bondParts++;
    }
    if (answers.commitment !== undefined) {
      bondSum += answers.commitment * 10;
      bondParts++;
    }
    if (answers.affection !== undefined) {
      // All affection styles are valid; give a baseline score
      bondSum += 75;
      bondParts++;
    }

    scores.bond = bondParts > 0 ? Math.round(bondSum / bondParts) : 50;

    // Environment: Space relative to pet type
    if (answers.space !== undefined && answers.pet_type !== undefined) {
      const spaceNeeds = { dog: 3, cat: 2, bird: 1, small: 1 };
      const need = spaceNeeds[answers.pet_type] || 2;
      const surplus = answers.space - need;
      if (surplus >= 1) scores.environment = 100;
      else if (surplus === 0) scores.environment = 85;
      else if (surplus === -1) scores.environment = 55;
      else scores.environment = 30;
    }

    // Weighted total
    const weights = { lifestyle: 0.3, personality: 0.2, bond: 0.35, environment: 0.15 };
    let total = 0;
    for (const key in weights) {
      total += scores[key] * weights[key];
    }
    total = Math.round(total);

    // Clamp
    total = Math.max(10, Math.min(99, total));

    return { total, scores };
  }

  function getScoreInfo(score) {
    if (score >= 90) return { label: 'Soulmates!', description: "You and your pet are an extraordinary match. Your lifestyles, personalities, and bond are beautifully aligned. Keep doing what you're doing!" };
    if (score >= 75) return { label: 'Best Friends', description: "You and your pet have a wonderful connection! A few small tweaks could make your bond even stronger, but you're already a great team." };
    if (score >= 60) return { label: 'Good Companions', description: "You and your pet have a solid relationship with room to grow. Spending more quality time together and adjusting routines could deepen your bond." };
    if (score >= 40) return { label: 'Work in Progress', description: "There's a foundation here, but your lifestyles might not be fully in sync yet. Small changes to your routine and environment could make a big difference." };
    return { label: 'Opposites Attract?', description: "You and your pet are quite different, but that doesn't mean you can't build a great bond. Focus on understanding their needs and finding common ground." };
  }

  // ---- Render Results ----
  function renderResults(result) {
    const { total, scores } = result;
    const info = getScoreInfo(total);

    // Add SVG gradient definition
    const svg = screens.results.querySelector('svg');
    if (!svg.querySelector('defs')) {
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      defs.innerHTML = `
        <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#6c5ce7" />
          <stop offset="100%" style="stop-color:#00cec9" />
        </linearGradient>`;
      svg.prepend(defs);
    }

    // Animate score ring
    const circumference = 2 * Math.PI * 88;
    const ring = $('#ring-progress');
    ring.style.strokeDasharray = circumference;
    ring.style.strokeDashoffset = circumference;

    setTimeout(() => {
      ring.style.strokeDashoffset = circumference - (total / 100) * circumference;
    }, 100);

    // Animate number
    animateNumber($('#score-number'), 0, total, 1200);

    $('#score-label').textContent = info.label;
    $('#score-description').textContent = info.description;

    // Breakdown
    const categories = [
      { key: 'bond', label: 'Bond Strength', icon: '💕' },
      { key: 'lifestyle', label: 'Lifestyle Match', icon: '🏡' },
      { key: 'personality', label: 'Personality Fit', icon: '🧩' },
      { key: 'environment', label: 'Environment', icon: '🌿' },
    ];

    let breakdownHTML = '<h3>Score Breakdown</h3>';
    categories.forEach((cat) => {
      const val = scores[cat.key];
      breakdownHTML += `
        <div class="breakdown-item">
          <div class="breakdown-label">
            <span>${cat.icon} ${cat.label}</span>
            <span>${val}%</span>
          </div>
          <div class="breakdown-bar">
            <div class="breakdown-bar-fill" style="width: 0%" data-target="${val}"></div>
          </div>
        </div>`;
    });
    $('#breakdown').innerHTML = breakdownHTML;

    // Animate bars
    setTimeout(() => {
      document.querySelectorAll('.breakdown-bar-fill').forEach((bar) => {
        bar.style.width = bar.dataset.target + '%';
      });
    }, 300);
  }

  function animateNumber(el, from, to, duration) {
    const start = performance.now();
    function step(ts) {
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(from + (to - from) * eased);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ---- Share ----
  function shareScore(score) {
    const text = `🐾 I got ${score}% on PawMatch — the pet compatibility quiz! How well do you match with your pet?`;
    if (navigator.share) {
      navigator.share({ title: 'My PawMatch Score', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => {
        const btn = $('#btn-share');
        btn.textContent = 'Copied to clipboard!';
        setTimeout(() => { btn.textContent = 'Share My Score'; }, 2000);
      }).catch(() => {});
    }
  }

  // ---- Event Listeners ----
  $('#btn-start').addEventListener('click', () => {
    showScreen('quiz');
    renderQuestion();
  });

  $('#btn-next').addEventListener('click', () => {
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      renderQuestion();
    } else {
      // Show loading, then results
      showScreen('loading');
      const result = calculateScore();
      setTimeout(() => {
        showScreen('results');
        renderResults(result);
      }, 2000);
    }
  });

  $('#btn-back').addEventListener('click', () => {
    if (currentQuestion > 0) {
      currentQuestion--;
      renderQuestion();
    }
  });

  $('#btn-retake').addEventListener('click', () => {
    currentQuestion = 0;
    for (const key in answers) delete answers[key];
    showScreen('quiz');
    renderQuestion();
  });

  $('#btn-share').addEventListener('click', () => {
    const scoreText = $('#score-number').textContent;
    shareScore(scoreText);
  });

  // Email capture
  $('#email-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = $('#email-input').value;
    // In production, send to your backend / email service
    console.log('Email captured:', email);
    $('#email-form').classList.add('hidden');
    $('#email-success').classList.remove('hidden');
  });

  // Premium button
  $('#btn-premium').addEventListener('click', () => {
    // In production, integrate Stripe or your payment provider
    alert('Premium checkout coming soon! This will connect to your payment provider.');
  });
})();
