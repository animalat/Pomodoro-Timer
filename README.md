<h3 align="left">Pomodoro Timer</h3>

<p align="left">
  <img src="https://drive.google.com/uc?export=view&id=1pIMeJzLQ5UL9v56cHhkKb-NtagEVshFq" alt="Pomodoro Timer Screenshot" width="480" style="border:10px solid #ddd;" />
</p>

---

**Pomodoro Timer** is a minimalist, cross-platform productivity timer built with Electron. It supports fully customizable work/break intervals to help you stay focused and prevent burnout using time-management strategies like the **Pomodoro Technique** or the **52/17 Rule**.

Features:
- 🕒 Customizable work/break durations
- 🔔 Notification alerts between sessions
- 🧠 Supports fully customizable cycles, including: Pomodoro Technique (25/5) and 52/17 Rule
- 💻 Desktop app for Windows, macOS, and Linux

---

### 🖥️ Try It

- 📦 [**Download for Windows**](https://drive.google.com/file/d/184i1gVFo2V03V5vyP7mNxRMIGwDFCBIB/view?usp=sharing)

> Or build it yourself:

### ⚙️ Build Instructions
**Install dependencies:**

```bash
npm install
npm install electron-builder --save-dev
```

**Build for your platform:**

```bash
npx electron-builder --mac --win --linux
npm run build -- -mwl
```

Replace platform flags based on your OS:
- win / -w for Windows
- mac / -m for macOS
- linux / -l for Linux
