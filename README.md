
# 🚀 JobTrack — Chrome Extension

JobTrack is a Chrome extension that helps users save, manage, and track job applications directly from their browser.

## ✨ Features

- Add and save job applications
- Capture the current webpage URL and title
- Track application status
- Edit and delete applications
- Search and filter jobs
- Track application statistics
- Interview progress bar
- Add application dates and notes
- Export applications as CSV
- Persistent storage using Chrome Storage API

## 🛠️ Tech Stack

- React
- TypeScript
- Vite
- Chrome Extension Manifest V3
- Chrome Storage API
- CSS

## 📂 Project Structure

```text
jobtrack-chrome-extension/
├── public/
│   └── manifest.json
├── src/
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd jobtrack-chrome-extension
```

### 2. Install dependencies

```bash
npm install
```

### 3. Build the extension

```bash
npm run build
```

### 4. Load into Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `dist` folder
5. Open the JobTrack extension

## 🧠 What I Learned

- Building Chrome extensions using Manifest V3
- Managing React state with TypeScript
- Persisting data using Chrome Storage API
- Implementing CRUD operations
- Creating search and filtering functionality
- Exporting application data as CSV
- Building and testing browser extensions

## 🔮 Future Improvements

- Automatic company name extraction
- Application reminders
- Cloud synchronization
- Authentication
- Analytics dashboard
- Job description parsing
- AI-powered job tracking insights

## 👨‍💻 Author

Sandip Kumar Jha
