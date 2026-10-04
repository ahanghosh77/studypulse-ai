# ⚡ StudyPulse AI

> **Private Open-Weight Note-to-Flashcard & Exam Prep Assistant**  
> *Built for a classmate for the Hacktoberfest 2026 Weekend Challenge: "Build for a Friend"*

![StudyPulse Banner](https://img.shields.io/badge/Hacktoberfest-2026-orange?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![AI](https://img.shields.io/badge/Open--Weight-Gemma%20%7C%20Llama%203-indigo?style=flat-square)

---

## 🌟 Overview

**StudyPulse AI** is an offline-first, privacy-respecting study companion that transforms dense semester lecture notes, textbook passages, and slides into active-recall flashcards, practice quizzes, intuitive everyday analogies, and Anki-ready decks using local open-weight AI models.

Built specifically for engineering and CS students tackling tough 3rd-semester subjects like **Operating Systems, Data Structures & Algorithms, and Database Management Systems**.

---

## ✨ Features

- 🗂️ **3D Active-Recall Flashcards:** Spatial card flips with keyboard shortcuts (`Space` to flip, `Arrow` keys to navigate) and mastery tracking.
- 🎯 **Exam Practice Quiz:** Auto-generated multiple-choice questions with instant rationale and scoring.
- 💡 **ELI5 & Intuitive Analogies:** Translates complex system concepts into relatable mental models.
- 🔒 **100% Offline & Private:** Connects locally to **Ollama** (`gemma2:2b`, `llama3.2:3b`, `mistral`) or any local OpenAI-compatible endpoint. Notes never leave your machine.
- 🛡️ **Zero-Setup Smart Fallback:** Built-in semantic parser ensures the app works immediately out of the box even without local models running.
- 📥 **Export to Anki & Markdown:** One-click downloads for spaced repetition decks.

---

## 🚀 Quick Start

1. Clone or download this repository:
   ```bash
   git clone https://github.com/ahang1/studypulse-ai.git
   cd studypulse-ai
   ```

2. Open `index.html` in any modern web browser:
   * Double click `index.html`, or run a local server:
   ```bash
   npx serve .
   ```

3. *(Optional)* Run with local open-weight models via Ollama:
   ```bash
   ollama run gemma2:2b
   # or
   ollama run llama3.2:3b
   ```
   Open the **Settings (⚙️)** in StudyPulse and verify the endpoint `http://localhost:11434/api/generate`.

---

## 📖 Hacktoberfest 2026

Submitted to the [Hacktoberfest Weekend Challenge: Build for a Friend](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01).

Distributed under the MIT License.
