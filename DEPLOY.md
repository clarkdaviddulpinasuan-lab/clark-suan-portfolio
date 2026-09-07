# Deploying to Vercel

This is a static site (HTML/CSS/JS) — no build step. Two ways to ship it.

---

## ⚡ Quick start — make it live in 3 commands

Open **Windows Terminal** (or PowerShell), then run these one at a time:

```powershell
# 1. Go into the project folder
cd c:\Users\User\Downloads\wander-siargao

# 2. Log in to Vercel (opens your browser once — sign in with GitHub/email)
npx vercel login

# 3. Deploy straight to your live production URL
npx vercel --prod
```

**What to expect during step 3** — it asks a few questions the first time.
Just press **Enter** to accept every default, except:

| Prompt                                   | Answer            |
| ---------------------------------------- | ----------------- |
| Set up and deploy "…wander-siargao"?     | **Y** (Enter)     |
| Which scope / account?                   | *your account*    |
| Link to existing project?                | **N** (Enter)     |
| What's your project's name?              | *Enter* (default) |
| In which directory is your code located? | **./** (Enter)    |
| Want to modify these settings?           | **N** (Enter)     |

When it finishes it prints a **Production: https://…vercel.app** link — that's
your live site. Open it. 🎉

Every time you change a file later, just re-run `npx vercel --prod` from the
same folder to publish the update.

---

## Option A — Vercel CLI (fastest)

From the project folder (`wander-siargao`), run:

```bash
npx vercel
```

- First run asks you to log in (browser opens) and a few setup questions —
  accept the defaults. When it asks for **framework preset**, choose **Other**.
- It gives you a preview URL immediately.
- To publish to your production domain:

```bash
npx vercel --prod
```

That's it. Re-run `npx vercel --prod` any time you change files.

---

## Option B — GitHub + Vercel dashboard (auto-deploy on push)

1. Put the project on GitHub:
   ```bash
   git init
   git add .
   git commit -m "Clark Suan portfolio"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
2. Go to https://vercel.com/new → **Import** the repo.
3. Framework preset: **Other**. Build command: *(leave empty)*.
   Output directory: *(leave empty / `.`)*. Click **Deploy**.
4. Every `git push` now redeploys automatically.

---

## After it's live
- `404.html` is served automatically for unknown URLs.
- Social-share previews (Open Graph) will now work — test with
  https://www.opengraph.xyz or by pasting the URL into LinkedIn/Slack.
- Add a custom domain under **Project → Settings → Domains**.

## Before you deploy — checklist
- [ ] Save your headshot as `assets/portrait.jpg`
- [ ] Replace `YOUR_FORM_ID` in `contact.html` with your Formspree ID
- [ ] Swap placeholder case-study metrics for real numbers (optional)
