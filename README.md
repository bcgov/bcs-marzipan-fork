## 🧭 Project Structure

You should now have something like this:

```
bcs-marzipan/
├── calendar-ui/          # React (Frontend)
│   ├── package.json
│   └── src/
└── calendar-service/     # NestJS or Node backend
    ├── package.json
    └── src/
```

---

## ⚙️ PHASE 1 — Setup Node.js and npm

### 1️⃣ Check Node.js installation

Make sure Node.js (and npm) is installed and up to date:

```bash
node -v
npm -v
```

If you don’t have it installed:

- Download from [https://nodejs.org/](https://nodejs.org/)
- Use **Node 18+** (LTS) — ideal for React + NestJS projects.

---

## 📦 PHASE 2 — Install dependencies

### 🔹 On root level:

```bash
npm install
```

✅ This installs all Node module packages for the whole project.

---

## 🚀 PHASE 3 — Run the apps locally

### 🔹 Run the backend (NestJS / Node)

From inside `calendar-service`:

```bash
npm run start:dev
```

or (depending on your scripts):

```bash
npm run start
```

Check your `package.json` to see what the correct start command is — for NestJS it’s usually:

```json
"scripts": {
  "start": "nest start",
  "start:dev": "nest start --watch"
}
```

💡 Default backend runs at `http://localhost:3001` (or `3000` if configured).

---

### 🔹 Run the frontend (React)

Open a new terminal window, then:

```bash
cd calendar-ui
npm start
```

✅ This should start your React app at:

```
http://localhost:3000
```

By default, the UI will likely call your API at `http://localhost:3001` (or whatever you configured).

---

## 🔍 PHASE 4 — Common Checks

| Check                  | Command / Action                                | Expected                           |
| ---------------------- | ----------------------------------------------- | ---------------------------------- |
| Backend working        | Open `http://localhost:3001/health` (or `/api`) | JSON or status OK                  |
| Frontend working       | Open `http://localhost:3000/`                   | React UI loads                     |
| API connection         | Check browser console / Network tab             | No 404 or CORS errors              |
| Node modules installed | Check `node_modules/` folders                   | Both UI + Service should have them |

---

### ✅ If you want to run both apps together:

In your root folder (`bcs-marzipan/`), you can then run:

```bash
npm install
npm run dev
```

💥 Both backend and frontend start in parallel!

---

### ✅ If install fails

Try:

```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

## 🤝 Contributing & Commit Guidelines

### Code Formatting

This project uses **Prettier** for code formatting and **ESLint** for code quality checks.

#### VS Code Users

The project includes workspace settings (`.vscode/settings.json`) that automatically format code on save. Make sure you have the [Prettier VS Code extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) installed.

#### Manual Formatting

You can manually format and lint code using these scripts:

```bash
# Format all code
npm run format

# Check formatting without modifying files
npm run format:check

# Lint and auto-fix issues
npm run lint

# Check linting without auto-fixing
npm run lint:check
```

### Pre-commit Hooks

This project uses **Husky** to run pre-commit checks. When you commit code, the hook will:

1. **Auto-fix** linting issues where possible
2. **Check** for remaining linting issues (non-blocking)
3. **Check** code formatting (non-blocking)

The hooks are currently **non-blocking**, meaning they will show warnings but won't prevent commits. This allows you to see issues and fix them while still being able to commit during active development.

#### Skipping Hooks

If you need to skip pre-commit checks (e.g., for WIP commits), use:

```bash
git commit --no-verify -m "your message"
```

**Note:** It's generally recommended to let the hooks run since they auto-fix many issues and provide useful feedback.
