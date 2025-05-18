# FocusFlow – Pomodoro Timer & Productivity Suite

![FocusFlow Banner](banner.png)

FocusFlow is an all‑in‑one **Pomodoro timer**, daily planner, habit tracker, productivity analytics dashboard, and social accountability hub – built with plain **HTML, CSS, and vanilla JavaScript**.
Turn your browser into a focussed workspace where you can plan your day, track tasks & habits, visualise your progress, and stay on track with calming focus sounds.

---

## ✨ Features

| Module                     | Highlights                                                                                                                                                                 |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Pomodoro Timer**         | Classic Focus / Short Break / Long Break modes, circular SVG progress ring, auto‑start option, custom durations & intervals, desktop notifications, ticking & alarm sounds |
| **Task List**              | Quick‑add, edit & delete tasks, session linking, keyboard shortcuts                                                                                                        |
| **Daily Planner**          | Hourly agenda view, schedule Pomodoro sessions with time & duration, prev / next day navigation                                                                            |
| **Habit Tracker**          | Add unlimited daily habits, streak counter ✔️                                                                                                                              |
| **Productivity Analytics** | Daily / Weekly / Monthly charts (Chart.js), average focus time, best day, completion rate, smart insights                                                                  |
| **Achievements**           | Dynamic trophy board with confetti celebration on milestones 🏆                                                                                                            |
| **Focus Sounds**           | Built‑in rain, forest, café, and waves ambience with volume slider                                                                                                         |
| **Social Accountability**  | Share progress message and manage accountability partners                                                                                                                  |
| **Theme Switcher**         | One‑click light / dark mode toggle                                                                                                                                         |

---

## 🚀 Demo

> **Live Preview:** [FocusFlow on GitHub Pages](https://your‑username.github.io/focusflow/)
> *(Replace the link with your deployed URL)*

![FocusFlow Screenshot](screenshot.png)

---

## 🛠️ Built With

* **HTML5** – semantic markup
* **CSS3** – Flexbox & Grid layout, custom properties, dark‑mode with `data‑theme`, animations via Animate.css
* **JavaScript (ES6)** – modular code, localStorage persistence, Chart.js for graphs, Canvas‑Confetti for celebrations
* **Font Awesome 6** – icons

---

## 📂 Project Structure

```text
focusflow/
├── index.html        # main application UI
├── style.css         # core styles
├── script.js         # functionality – timer, planner, analytics, ...
├── assets/           # images, sounds, fonts, etc.
└── README.md         # you are here
```

---

## ⚙️ Setup & Usage

1. **Clone the repo**

   ```bash
   git clone https://github.com/your‑username/focusflow.git
   cd focusflow
   ```
2. **Open `index.html`** in your browser – no build step required.
3. (Optional) Host with GitHub Pages or any static hosting provider.

### Customising Durations

Edit default values in **`index.html` → Settings Container**:

```html
<input id="focus‑minutes" value="25" />
<input id="short‑break‑minutes" value="5" />
<input id="long‑break‑minutes" value="15" />
```

## 🙌 Contributing

Pull requests are welcome!  For major changes please open an issue first to discuss what you would like to change.

1. Fork the project
2. Create your feature branch (`git checkout -b feat/awesome‑feature`)
3. Commit your changes (`git commit -m 'feat: add awesome feature'`)
4. Push to the branch (`git push origin feat/awesome‑feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## ✍️ Author

**Samir Alam** – [@samiralam04](https://github.com/samiralam04)
Made with ❤️ in 2025.
