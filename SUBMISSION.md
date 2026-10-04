---
title: "StudyPulse: An Offline-First Open-Weight Study Companion Built for my Classmate"
published: true
tags: devchallenge, weekendchallenge, hf26challenge
---

*This is a submission for the [Hacktoberfest Weekend Challenge: Build for a Friend](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01)*

## What I Built

I built **StudyPulse AI** for my 3rd-semester computer science classmate and friend, **Aarav**. 

Like many engineering students, Aarav is constantly buried under dense lecture notes in subjects like **Operating Systems** (semaphores, Coffman deadlock conditions, CPU scheduling), **Data Structures & Algorithms** (AVL tree rotations, Red-Black balance invariants), and **Database Management Systems** (ACID properties, BCNF normalization). 

Whenever midterms approach, Aarav struggles with:
1. **Passive re-reading:** Highlighting slides over and over without active recall.
2. **Expensive API barriers:** Not wanting to pay $20/month for proprietary AI subscriptions just to summarize homework notes.
3. **Spotty campus internet:** Living in a university dorm where Wi-Fi drops constantly during study sessions.
4. **Data privacy:** Not wanting course material, professor slide drafts, and private notes uploaded to corporate cloud silos.

**StudyPulse AI** is a lightweight, private, offline-first study companion designed to run directly with local **open-weight models** (such as Google’s Gemma 2, Llama 3.2, or Mistral via Ollama/LocalAI). It takes raw lecture notes or textbook snippets and instantly converts them into:
- 🗂️ **Active-Recall 3D Flip Flashcards** with intuitive everyday analogies
- 🎯 **Interactive Exam Practice Quizzes** with instant feedback and grading
- 💡 **ELI5 (Explain Like I'm 5) breakdowns**
- 📥 **One-click Anki TSV and Markdown exports** for long-term spaced repetition

When I handed the early build over to Aarav, his immediate reaction was: *"Wait, this runs on my laptop with zero Wi-Fi and didn't cost a dime? The deadlock traffic analogy finally made Coffman conditions stick!"*

---

## Demo

Here is the clean, dark-mode glassmorphic interface in action:

- **Interactive 3D Flashcards:** Smooth spatial flips, keyboard navigation (Spacebar to flip, Arrow keys to navigate), and progress mastery counters.
- **Exam Quiz Mode:** Interactive multiple-choice questions automatically generated from lecture points.
- **Zero-Setup Fallback:** Comes with built-in 3rd-semester sample notes (OS, DSA, DBMS) and an intelligent offline extraction engine so it works immediately out of the box even before configuring an open-weight endpoint.

*(You can open `index.html` in any web browser to test it live!)*

---

## Code

The complete source code is open source and hosted on GitHub:

🔗 **GitHub Repository:** [https://github.com/ahang1/studypulse-ai](https://github.com/ahang1/studypulse-ai)

### Tech Stack:
- **Frontend:** Semantic HTML5, Vanilla CSS3 with custom design system (glassmorphism, 3D perspective card flip animations, responsive grid), and Vanilla JavaScript.
- **AI Core:** Direct integration with **Ollama** (`gemma2:2b`, `llama3.2:3b`) and any OpenAI-compatible local inference server (`/v1/chat/completions`), backed by an offline heuristic parsing engine.
- **Exports:** Anki (.tsv) spaced repetition exporter and clean Markdown generator.

---

## How I Built It

1. **Prompt Engineering for Open-Weight Models:**  
   Open-weight models like `gemma2:2b` or `llama3.2:3b` are efficient and run smoothly on modest student laptops. I structured strict JSON-schema system prompts requiring the model to extract:
   - A core question testing causal understanding (not simple rote memorization)
   - A concise, high-yield exam answer
   - A relatable, real-world everyday analogy (e.g., explaining Coffman deadlock conditions like a 4-way stop sign intersection, or ACID atomicity like an ATM cash withdrawal).

2. **Resilient Local Architecture:**  
   The application communicates with `http://localhost:11434/api/generate` via browser `fetch` with configurable model and endpoint options. If a student is on the go and hasn't started their local Ollama daemon, StudyPulse seamlessly falls back to its built-in heuristic semantic parser, guaranteeing 100% uptime.

3. **Active Recall & Spaced Repetition Design:**  
   Instead of overwhelming the student with giant walls of text, StudyPulse focuses on atomic cards, self-evaluations ("Mastered" vs "Needs Review"), and Anki export compatibility.

---

## Why Does Open Innovation Matter?

Open innovation is what made StudyPulse possible:

1. **Zero Cost for Students:** College students shouldn't have to budget monthly subscriptions just to generate study flashcards from their own notes. Open-weight models like Gemma and Llama bring state-of-the-art reasoning to everyday personal computers for free.
2. **Complete Privacy:** Course notes, university research, and student drafts never leave the student's device. No telemetry, no cloud training on user notes, and zero data leakage.
3. **True Offline Independence:** Open-source AI isn't dependent on cloud server status pages, rate limits, or campus Wi-Fi connection drops. It runs reliably on an airplane, in a library basement, or in a dorm room.
4. **Customizability:** Because the models are open, students can fine-tune small open-weight models on their own department's curriculum or switch models freely without vendor lock-in.

---

## My Agent Session

This project was developed with the assistance of **Google Antigravity** and configured with **DevRelay** for Hacktoberfest 2026. The agent workflow helped scaffold the semantic extraction prompts, structure the 3D CSS flip animations, and curate high-yield 3rd-semester computer science concepts.

---

*Built with ❤️ for a friend during Hacktoberfest 2026. #AIforEveryone*
