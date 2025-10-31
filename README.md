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

* Download from [https://nodejs.org/](https://nodejs.org/)
* Use **Node 18+** (LTS) — ideal for React + NestJS projects.

---

## 📦 PHASE 2 — Install dependencies

We’ll install dependencies **separately** in each folder.

### 🔹 For the UI:

```bash
cd calendar-ui
npm install
```

✅ This installs React, Fluent UI, and other frontend dependencies.

---

### 🔹 For the backend service:

Go back up one level, then:

```bash
cd ../calendar-service
npm install
```

✅ This installs NestJS / TypeORM / other backend packages.

---
### 🔹 On root level:

Go back up one level, then:

```bash
cd ..
npm install
```

✅ This installs common Node module packages for the whole project.

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
npm run start
```

💥 Both backend and frontend start in parallel!

---

### ✅ If you get CORS issues

Add this to your NestJS main file (`main.ts`):

```ts
app.enableCors({
  origin: 'http://localhost:3000',
});
```

---

### ✅ If install fails

Try:

```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```
