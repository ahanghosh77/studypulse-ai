/**
 * StudyPulse AI - Open-Weight Semester Study & Flashcard Companion
 * Hacktoberfest 2026 Weekend Challenge: "Build for a Friend"
 */

// ==========================================
// Curated 3rd Semester Sample Notes
// ==========================================
const SAMPLE_NOTES = {
  os: `OPERATING SYSTEMS: Deadlocks & Synchronization
A deadlock occurs when a set of processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process.
The Four Coffman Conditions must hold simultaneously for a deadlock to occur:
1. Mutual Exclusion: At least one resource must be held in a non-shareable mode.
2. Hold and Wait: A process must be holding at least one resource and waiting to acquire additional resources.
3. No Preemption: Resources cannot be preempted; a resource can be released only voluntarily by the process holding it.
4. Circular Wait: A closed chain of processes exists such that each process holds at least one resource needed by the next process in the chain.

Prevention & Avoidance:
- Banker's Algorithm (Dijkstra): Tests for safety by simulating the allocation of predetermined maximum possible amounts of all resources, and then makes an "s-state" check to test for possible activities.
- Safe State: A state is safe if the system can allocate resources to each process in some order and still avoid deadlock.
- Semaphores: A synchronization tool provided by Dijkstra. A semaphore S is an integer variable accessed only through wait() (P) and signal() (V) atomic operations. Binary semaphores act like mutex locks. Counting semaphores control access to a resource pool with a finite number of instances.`,

  ds: `DATA STRUCTURES & ALGORITHMS: Balanced Search Trees
Binary Search Tree (BST) worst-case time complexity degrades to O(n) when nodes are inserted in sorted order (skewed tree). Self-balancing binary search trees solve this by maintaining O(log n) height.

1. AVL Trees (Adelson-Velsky and Landis):
- Strictly height-balanced binary search tree.
- Balance Factor (BF) = Height(Left Subtree) - Height(Right Subtree).
- For every node, BF must be in {-1, 0, +1}.
- Rebalancing is achieved using 4 types of rotations:
  * LL (Left-Left) Rotation: Single Right Rotation.
  * RR (Right-Right) Rotation: Single Left Rotation.
  * LR (Left-Right) Rotation: Left rotation on child, then Right rotation on parent.
  * RL (Right-Left) Rotation: Right rotation on child, then Left rotation on parent.
- Search: O(log n), Insertion: O(log n), Deletion: O(log n).

2. Red-Black Trees:
- Approximately balanced BST. Requires 1 bit of color (Red or Black) per node.
- Root and leaves (NIL) are always Black.
- If a node is Red, its children must be Black (no two consecutive red nodes).
- Every path from a node to descendant NIL leaves contains the exact same number of black nodes (Black-Height).
- AVL trees provide faster lookups (more strictly balanced); Red-Black trees provide faster insertions and deletions (fewer rotations).`,

  db: `DATABASE MANAGEMENT SYSTEMS: ACID & Normalization
Transactions & ACID Properties:
A transaction is a logical unit of work in a DBMS. To ensure database integrity, the DBMS must satisfy:
- Atomicity: "All or nothing." If any part fails, the transaction is completely rolled back. Managed by Transaction Recovery component.
- Consistency: The database remains in a valid state before and after execution according to all defined constraints and rules.
- Isolation: Concurrent transactions execute without interfering with one another as if running sequentially. Managed by Concurrency Control.
- Durability: Once a transaction commits, its updates persist permanently, even during system crashes or power failures. Managed by write-ahead logging (WAL).

Relational Database Normalization:
Process of organizing data to minimize data redundancy and eliminate update/insertion/deletion anomalies.
- 1NF (First Normal Form): All column values must be atomic (no multivalued attributes or repeating groups).
- 2NF (Second Normal Form): In 1NF and no partial dependencies (every non-prime attribute is fully functionally dependent on the entire primary key).
- 3NF (Third Normal Form): In 2NF and no transitive dependencies (no non-prime attribute depends on another non-prime attribute).
- BCNF (Boyce-Codd Normal Form): A stricter version of 3NF where for every functional dependency X -> Y, X must be a super key.`
};

// ==========================================
// Application State
// ==========================================
const state = {
  notes: '',
  cards: [],
  currentCardIndex: 0,
  masteredCards: new Set(),
  mode: 'flashcards', // 'flashcards', 'exam-quiz', 'eli5', 'cheatsheet'
  isFlipped: false,
  aiSettings: {
    provider: 'ollama', // 'ollama', 'custom', 'offline-smart'
    endpoint: 'http://localhost:11434/api/generate',
    model: 'gemma2:2b'
  },
  quiz: {
    questions: [],
    currentIndex: 0,
    score: 0,
    answered: false
  }
};

// ==========================================
// DOM Elements
// ==========================================
const elements = {
  notesInput: document.getElementById('notes-input'),
  charCount: document.getElementById('char-count'),
  clearNotesBtn: document.getElementById('clear-notes-btn'),
  cardCountSlider: document.getElementById('card-count-slider'),
  cardCountVal: document.getElementById('card-count-val'),
  modeSelect: document.getElementById('mode-select'),
  generateBtn: document.getElementById('generate-btn'),
  generateBtnText: document.getElementById('generate-btn-text'),
  
  // Settings
  aiSettingsToggle: document.getElementById('ai-settings-toggle'),
  settingsModal: document.getElementById('settings-modal'),
  closeSettingsBtn: document.getElementById('close-settings-btn'),
  saveSettingsBtn: document.getElementById('save-settings-btn'),
  aiProviderSelect: document.getElementById('ai-provider-select'),
  apiEndpointInput: document.getElementById('api-endpoint-input'),
  modelNameInput: document.getElementById('model-name-input'),
  currentModelLabel: document.getElementById('current-model-label'),

  // Views
  emptyState: document.getElementById('empty-state'),
  loadingState: document.getElementById('loading-state'),
  flashcardsContainer: document.getElementById('flashcards-container'),
  quizContainer: document.getElementById('quiz-container'),
  textViewContainer: document.getElementById('text-view-container'),
  deckActions: document.getElementById('deck-actions'),

  // Flashcard View
  flashcard: document.getElementById('flashcard'),
  cardTag: document.getElementById('card-tag'),
  cardQuestion: document.getElementById('card-question'),
  cardAnswer: document.getElementById('card-answer'),
  cardAnalogyBox: document.getElementById('card-analogy-box'),
  cardAnalogyText: document.getElementById('card-analogy-text'),
  deckCounter: document.getElementById('deck-counter'),
  deckProgressFill: document.getElementById('deck-progress-fill'),
  masteryScore: document.getElementById('mastery-score'),
  btnPrev: document.getElementById('btn-prev'),
  btnNext: document.getElementById('btn-next'),
  btnMastered: document.getElementById('btn-mastered'),
  btnReviewAgain: document.getElementById('btn-review-again'),
  cardsGrid: document.getElementById('cards-grid'),
  overviewCount: document.getElementById('overview-count'),
  toggleOverviewBtn: document.getElementById('toggle-overview-btn'),

  // Exports
  btnExportAnki: document.getElementById('btn-export-anki'),
  btnExportMd: document.getElementById('btn-export-md'),

  // Quiz View
  quizProgressText: document.getElementById('quiz-progress-text'),
  quizScoreBadge: document.getElementById('quiz-score-badge'),
  quizQuestionText: document.getElementById('quiz-question-text'),
  quizOptionsList: document.getElementById('quiz-options-list'),
  quizFeedbackBox: document.getElementById('quiz-feedback-box'),
  quizFeedbackText: document.getElementById('quiz-feedback-text'),
  quizNextBtn: document.getElementById('quiz-next-btn'),

  // Cheatsheet View
  cheatsheetContent: document.getElementById('cheatsheet-content')
};

// ==========================================
// Initialization & Event Listeners
// ==========================================
function init() {
  setupEventListeners();
  loadSample('os'); // Default to OS sample
}

function setupEventListeners() {
  // Input handling
  elements.notesInput.addEventListener('input', () => {
    elements.charCount.textContent = `${elements.notesInput.value.length} characters`;
  });

  elements.clearNotesBtn.addEventListener('click', () => {
    elements.notesInput.value = '';
    elements.charCount.textContent = '0 characters';
    elements.notesInput.focus();
  });

  // Sample buttons
  document.querySelectorAll('.pill[data-sample]').forEach(btn => {
    btn.addEventListener('click', () => {
      const sampleKey = btn.getAttribute('data-sample');
      loadSample(sampleKey);
    });
  });

  // Slider
  elements.cardCountSlider.addEventListener('input', (e) => {
    elements.cardCountVal.textContent = e.target.value;
  });

  // Mode select
  elements.modeSelect.addEventListener('change', (e) => {
    state.mode = e.target.value;
    const labels = {
      'flashcards': 'Generate Active Recall Deck',
      'exam-quiz': 'Generate Practice Quiz',
      'eli5': 'Generate ELI5 & Analogies',
      'cheatsheet': 'Generate High-Yield Cheatsheet'
    };
    elements.generateBtnText.textContent = labels[state.mode] || 'Generate Study Material';
  });

  // Generate button
  elements.generateBtn.addEventListener('click', handleGenerate);

  // Flashcard Flip & Navigation
  elements.flashcard.addEventListener('click', toggleCardFlip);
  document.addEventListener('keydown', (e) => {
    if (elements.flashcardsContainer.classList.contains('hidden')) return;
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;

    if (e.code === 'Space') {
      e.preventDefault();
      toggleCardFlip();
    } else if (e.code === 'ArrowRight') {
      nextCard();
    } else if (e.code === 'ArrowLeft') {
      prevCard();
    }
  });

  elements.btnNext.addEventListener('click', nextCard);
  elements.btnPrev.addEventListener('click', prevCard);

  elements.btnMastered.addEventListener('click', () => {
    state.masteredCards.add(state.currentCardIndex);
    updateMasteryDisplay();
    nextCard();
  });

  elements.btnReviewAgain.addEventListener('click', () => {
    state.masteredCards.delete(state.currentCardIndex);
    updateMasteryDisplay();
    nextCard();
  });

  elements.toggleOverviewBtn.addEventListener('click', () => {
    elements.cardsGrid.classList.toggle('hidden');
  });

  // Exports
  elements.btnExportAnki.addEventListener('click', exportToAnki);
  elements.btnExportMd.addEventListener('click', exportToMarkdown);

  // Settings Modal
  elements.aiSettingsToggle.addEventListener('click', () => elements.settingsModal.classList.remove('hidden'));
  elements.closeSettingsBtn.addEventListener('click', () => elements.settingsModal.classList.add('hidden'));
  elements.saveSettingsBtn.addEventListener('click', saveAiSettings);
  elements.aiProviderSelect.addEventListener('change', handleProviderChange);

  // Quiz
  elements.quizNextBtn.addEventListener('click', nextQuizQuestion);
}

function loadSample(key) {
  if (SAMPLE_NOTES[key]) {
    elements.notesInput.value = SAMPLE_NOTES[key];
    elements.charCount.textContent = `${SAMPLE_NOTES[key].length} characters`;
  }
}

// ==========================================
// Settings Management
// ==========================================
function handleProviderChange(e) {
  const provider = e.target.value;
  const endpointGroup = document.getElementById('endpoint-group');
  const modelGroup = document.getElementById('model-name-group');

  if (provider === 'offline-smart') {
    endpointGroup.style.opacity = '0.5';
    modelGroup.style.opacity = '0.5';
  } else {
    endpointGroup.style.opacity = '1';
    modelGroup.style.opacity = '1';
  }
}

function saveAiSettings() {
  state.aiSettings.provider = elements.aiProviderSelect.value;
  state.aiSettings.endpoint = elements.apiEndpointInput.value;
  state.aiSettings.model = elements.modelNameInput.value;

  const labels = {
    'ollama': `Ollama (${state.aiSettings.model})`,
    'custom': `Local API (${state.aiSettings.model})`,
    'offline-smart': 'Built-in Offline Parser'
  };
  elements.currentModelLabel.textContent = labels[state.aiSettings.provider];
  elements.settingsModal.classList.add('hidden');
}

// ==========================================
// Generation Logic (Open-Weight Model & Fallback)
// ==========================================
async function handleGenerate() {
  const text = elements.notesInput.value.trim();
  if (!text) {
    alert('Please enter or paste lecture notes first!');
    elements.notesInput.focus();
    return;
  }

  const cardCount = parseInt(elements.cardCountSlider.value, 10);
  showLoading();

  try {
    let result;
    if (state.aiSettings.provider === 'ollama') {
      result = await generateWithOllama(text, cardCount, state.mode);
    } else if (state.aiSettings.provider === 'custom') {
      result = await generateWithCustomEndpoint(text, cardCount, state.mode);
    } else {
      result = generateWithOfflineSmartEngine(text, cardCount, state.mode);
    }

    renderGeneratedContent(result);
  } catch (err) {
    console.warn('Ollama/Local endpoint error or unreachable. Falling back to built-in Smart Engine:', err);
    // Graceful offline fallback
    const fallbackResult = generateWithOfflineSmartEngine(text, cardCount, state.mode);
    renderGeneratedContent(fallbackResult);
  }
}

function showLoading() {
  elements.emptyState.classList.add('hidden');
  elements.flashcardsContainer.classList.add('hidden');
  elements.quizContainer.classList.add('hidden');
  elements.textViewContainer.classList.add('hidden');
  elements.loadingState.classList.remove('hidden');
}

// Ollama API Caller
async function generateWithOllama(text, count, mode) {
  const prompt = buildStructuredPrompt(text, count, mode);
  
  const response = await fetch(state.aiSettings.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: state.aiSettings.model,
      prompt: prompt,
      stream: false,
      format: 'json'
    }),
    signal: AbortSignal.timeout(12000) // 12 second timeout before fallback
  });

  if (!response.ok) throw new Error(`Ollama HTTP ${response.status}`);
  const data = await response.json();
  return JSON.parse(data.response);
}

// Custom Local Endpoint Caller (OpenAI compatible)
async function generateWithCustomEndpoint(text, count, mode) {
  const prompt = buildStructuredPrompt(text, count, mode);
  
  const response = await fetch(state.aiSettings.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: state.aiSettings.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3
    }),
    signal: AbortSignal.timeout(12000)
  });

  if (!response.ok) throw new Error(`API HTTP ${response.status}`);
  const data = await response.json();
  const rawContent = data.choices[0].message.content;
  return JSON.parse(rawContent.replace(/```json|```/g, '').trim());
}

function buildStructuredPrompt(text, count, mode) {
  return `You are StudyPulse, an expert academic tutor for a 3rd-semester university computer science student.
Given these raw lecture notes:
"""
${text}
"""

Task: Generate ${count} high-yield items in JSON format.
Output ONLY valid JSON with this exact structure:
{
  "type": "${mode}",
  "title": "Topic Title",
  "items": [
    {
      "tag": "Short Topic Tag",
      "question": "Clear, direct active-recall question testing understanding",
      "answer": "Concise, highly structured answer focusing on key exam concepts",
      "analogy": "An intuitive, real-world everyday analogy explaining this concept simply",
      "options": ["Option A", "Option B", "Option C", "Option D"], // Only if quiz mode
      "correctIndex": 0 // 0-3 index of correct option if quiz mode
    }
  ],
  "cheatsheetMarkdown": "Markdown formatted summary if cheatsheet mode"
}`;
}

// ==========================================
// Built-in Offline Smart Engine (100% Reliable Client-Side)
// ==========================================
function generateWithOfflineSmartEngine(text, count, mode) {
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  const items = [];

  // Semantic extraction based on keywords and syntax
  const conceptBlocks = [];
  let currentTitle = 'Core Concept';
  let currentDetails = [];

  lines.forEach(line => {
    if (line.includes(':') || line.startsWith('#') || line.match(/^[0-9]\./) || line.toUpperCase() === line && line.length < 50) {
      if (currentDetails.length > 0) {
        conceptBlocks.push({ title: currentTitle, text: currentDetails.join(' ') });
        currentDetails = [];
      }
      currentTitle = line.replace(/^[0-9]\.\s*|#+\s*/, '').trim();
    } else {
      currentDetails.push(line.trim());
    }
  });

  if (currentDetails.length > 0) {
    conceptBlocks.push({ title: currentTitle, text: currentDetails.join(' ') });
  }

  // Generate specialized cards from blocks
  const targetCount = Math.min(count, Math.max(conceptBlocks.length, 4));

  for (let i = 0; i < targetCount; i++) {
    const block = conceptBlocks[i % conceptBlocks.length];
    const parts = block.title.split(':');
    const conceptName = parts[parts.length - 1].trim();

    if (mode === 'exam-quiz') {
      items.push({
        tag: parts[0] || 'Exam Question',
        question: `Which of the following best characterizes "${conceptName}"?`,
        answer: block.text || `Refers to ${conceptName} as detailed in the course notes.`,
        analogy: `Think of ${conceptName} like a strict traffic intersection protocol where each car must follow predetermined sequencing rules.`,
        options: [
          block.text ? block.text.slice(0, 70) + '...' : `A core protocol guaranteeing valid state preservation in ${conceptName}.`,
          `An unconstrained mechanism that allows arbitrary resource reallocation without state checks.`,
          `A legacy heuristic that is only applicable to single-threaded CPU architectures.`,
          `A hardware-only interrupt signal that ignores operating system concurrency primitives.`
        ],
        correctIndex: 0
      });
    } else {
      items.push({
        tag: parts[0].length > 15 ? 'Key Mechanism' : parts[0],
        question: `What is the significance of "${conceptName}" and how does it function?`,
        answer: block.text.length > 20 ? block.text : `Fundamental mechanism for ${conceptName}, ensuring system constraints and optimal computational guarantees are maintained.`,
        analogy: getSmartAnalogy(conceptName)
      });
    }
  }

  return {
    type: mode,
    title: conceptBlocks[0]?.title || 'Semester Study Deck',
    items: items,
    cheatsheetMarkdown: generateCheatsheetHtml(conceptBlocks)
  };
}

function getSmartAnalogy(concept) {
  const c = concept.toLowerCase();
  if (c.includes('deadlock')) return 'Like four cars arriving simultaneously at a 4-way stop sign, each waiting for the car on their right to move.';
  if (c.includes('coffman') || c.includes('mutual')) return 'Like a single bathroom key in a coffee shop: only one person can hold it, and others have to wait outside.';
  if (c.includes('banker') || c.includes('safe state')) return 'Like a bank teller who checks total cash reserves before issuing loans to ensure at least one borrower can finish and repay.';
  if (c.includes('avl') || c.includes('rotation') || c.includes('tree')) return 'Like balancing a mobile sculpture: whenever one branch gets too heavy, you shift the pivot point to keep it level.';
  if (c.includes('red-black')) return 'Like traffic lights enforcing spacing: you never have two red lights in a row to keep traffic flowing smoothly.';
  if (c.includes('acid') || c.includes('atomicity')) return 'Like an ATM cash withdrawal: you either get the cash and your balance updates, or nothing happens at all (no halfway states).';
  if (c.includes('normalization') || c.includes('1nf') || c.includes('3nf')) return 'Like organizing a messy toolbox so every tool has exactly one designated spot, preventing duplicate or lost parts.';
  return 'Like an automated organizer that maintains strict invariant rules so errors can never cascade.';
}

function generateCheatsheetHtml(blocks) {
  let html = '<h2>📌 High-Yield Exam Cheatsheet</h2><br>';
  blocks.forEach(b => {
    html += `<h3>${b.title}</h3>`;
    html += `<p>${b.text}</p><br>`;
  });
  return html;
}

// ==========================================
// Rendering Generated Views
// ==========================================
function renderGeneratedContent(data) {
  elements.loadingState.classList.add('hidden');

  if (state.mode === 'flashcards' || data.type === 'flashcards') {
    state.cards = data.items;
    state.currentCardIndex = 0;
    state.masteredCards.clear();
    elements.flashcardsContainer.classList.remove('hidden');
    renderCurrentCard();
    renderDeckOverview();
  } else if (state.mode === 'exam-quiz' || data.type === 'exam-quiz') {
    state.quiz.questions = data.items;
    state.quiz.currentIndex = 0;
    state.quiz.score = 0;
    elements.quizContainer.classList.remove('hidden');
    renderCurrentQuiz();
  } else {
    // Cheatsheet or ELI5
    elements.textViewContainer.classList.remove('hidden');
    if (data.cheatsheetMarkdown) {
      elements.cheatsheetContent.innerHTML = data.cheatsheetMarkdown;
    } else {
      let content = `<h2>💡 Intuitive Conceptual Breakdown</h2><br>`;
      data.items.forEach((item, idx) => {
        content += `<h3>${idx + 1}. ${item.question}</h3>`;
        content += `<p><strong>Exam Definition:</strong> ${item.answer}</p>`;
        content += `<p style="color: #fde68a; margin-top: 0.5rem;"><strong>💡 Analogy:</strong> ${item.analogy}</p><br>`;
      });
      elements.cheatsheetContent.innerHTML = content;
    }
  }
}

// ==========================================
// Flashcard Review Interactions
// ==========================================
function renderCurrentCard() {
  if (state.cards.length === 0) return;
  const card = state.cards[state.currentCardIndex];

  // Reset flip
  state.isFlipped = false;
  elements.flashcard.classList.remove('is-flipped');

  // Populate data
  elements.cardTag.textContent = card.tag || 'Concept';
  elements.cardQuestion.textContent = card.question;
  elements.cardAnswer.textContent = card.answer;
  elements.cardAnalogyText.textContent = card.analogy || 'No analogy needed.';

  // Progress
  const total = state.cards.length;
  elements.deckCounter.textContent = `Card ${state.currentCardIndex + 1} of ${total}`;
  const pct = ((state.currentCardIndex + 1) / total) * 100;
  elements.deckProgressFill.style.width = `${pct}%`;

  // Highlight mini-card
  document.querySelectorAll('.mini-card').forEach((mc, idx) => {
    mc.classList.toggle('active', idx === state.currentCardIndex);
  });
}

function toggleCardFlip() {
  state.isFlipped = !state.isFlipped;
  elements.flashcard.classList.toggle('is-flipped', state.isFlipped);
}

function nextCard() {
  if (state.cards.length === 0) return;
  state.currentCardIndex = (state.currentCardIndex + 1) % state.cards.length;
  renderCurrentCard();
}

function prevCard() {
  if (state.cards.length === 0) return;
  state.currentCardIndex = (state.currentCardIndex - 1 + state.cards.length) % state.cards.length;
  renderCurrentCard();
}

function updateMasteryDisplay() {
  elements.masteryScore.textContent = `Mastered: ${state.masteredCards.size} / ${state.cards.length}`;
}

function renderDeckOverview() {
  elements.cardsGrid.innerHTML = '';
  elements.overviewCount.textContent = state.cards.length;

  state.cards.forEach((card, index) => {
    const mini = document.createElement('div');
    mini.className = `mini-card ${index === state.currentCardIndex ? 'active' : ''}`;
    mini.innerHTML = `
      <div class="mini-card-q">${card.question}</div>
      <div class="mini-card-a">${card.answer}</div>
    `;
    mini.addEventListener('click', () => {
      state.currentCardIndex = index;
      renderCurrentCard();
    });
    elements.cardsGrid.appendChild(mini);
  });
}

// ==========================================
// Quiz Mode Logic
// ==========================================
function renderCurrentQuiz() {
  const q = state.quiz.questions[state.quiz.currentIndex];
  state.quiz.answered = false;

  elements.quizProgressText.textContent = `Question ${state.quiz.currentIndex + 1} of ${state.quiz.questions.length}`;
  elements.quizScoreBadge.textContent = `Score: ${state.quiz.score} / ${state.quiz.currentIndex}`;
  elements.quizQuestionText.textContent = q.question;
  elements.quizFeedbackBox.classList.add('hidden');

  elements.quizOptionsList.innerHTML = '';
  q.options.forEach((optText, idx) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.innerHTML = `<strong>${String.fromCharCode(65 + idx)}.</strong> <span>${optText}</span>`;
    btn.addEventListener('click', () => handleQuizAnswer(idx));
    elements.quizOptionsList.appendChild(btn);
  });
}

function handleQuizAnswer(selectedIndex) {
  if (state.quiz.answered) return;
  state.quiz.answered = true;

  const q = state.quiz.questions[state.quiz.currentIndex];
  const isCorrect = selectedIndex === q.correctIndex;
  const optionButtons = elements.quizOptionsList.querySelectorAll('.quiz-option');

  optionButtons.forEach((btn, idx) => {
    btn.classList.add('disabled');
    if (idx === q.correctIndex) {
      btn.classList.add('correct');
    } else if (idx === selectedIndex && !isCorrect) {
      btn.classList.add('wrong');
    }
  });

  if (isCorrect) {
    state.quiz.score++;
    elements.quizFeedbackText.innerHTML = `🎉 <strong>Correct!</strong> ${q.answer}`;
  } else {
    elements.quizFeedbackText.innerHTML = `❌ <strong>Review:</strong> ${q.answer}`;
  }

  elements.quizScoreBadge.textContent = `Score: ${state.quiz.score} / ${state.quiz.currentIndex + 1}`;
  elements.quizFeedbackBox.classList.remove('hidden');
}

function nextQuizQuestion() {
  state.quiz.currentIndex++;
  if (state.quiz.currentIndex < state.quiz.questions.length) {
    renderCurrentQuiz();
  } else {
    // Quiz completed
    elements.quizQuestionText.textContent = `🏆 Quiz Completed!`;
    elements.quizOptionsList.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <h4>You scored ${state.quiz.score} out of ${state.quiz.questions.length}</h4>
        <p class="text-muted" style="margin-top: 0.5rem;">Great job! Review any questions you missed to lock in long-term retention.</p>
        <button class="btn btn-primary" style="margin-top: 1.5rem;" onclick="location.reload()">Review Another Topic</button>
      </div>
    `;
    elements.quizFeedbackBox.classList.add('hidden');
  }
}

// ==========================================
// Exports (Anki & Markdown)
// ==========================================
function exportToAnki() {
  if (state.cards.length === 0) return alert('No cards to export!');
  
  // Tab-separated format: Front \t Back \t Tag
  let tsvContent = '';
  state.cards.forEach(card => {
    const front = card.question.replace(/\t/g, ' ').replace(/\n/g, '<br>');
    const back = `${card.answer}<br><br><i>Analogy:</i> ${card.analogy}`.replace(/\t/g, ' ').replace(/\n/g, '<br>');
    const tag = (card.tag || 'StudyPulse').replace(/\s+/g, '_');
    tsvContent += `${front}\t${back}\t${tag}\n`;
  });

  downloadFile('studypulse-anki-deck.txt', tsvContent, 'text/tab-separated-values');
}

function exportToMarkdown() {
  if (state.cards.length === 0) return alert('No cards to export!');

  let md = `# StudyPulse AI - Active Recall Deck\n\n`;
  md += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
  md += `## Flashcards\n\n`;

  state.cards.forEach((card, idx) => {
    md += `### ${idx + 1}. [${card.tag || 'Concept'}] ${card.question}\n\n`;
    md += `**Answer:** ${card.answer}\n\n`;
    md += `> 💡 **Analogy:** ${card.analogy}\n\n---\n\n`;
  });

  downloadFile('studypulse-study-notes.md', md, 'text/markdown');
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type: type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Kick off
init();
