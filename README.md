# aryanp.dev — Personal Portfolio

Your portfolio website. Everything is editable through one file: `src/content.ts`.

---

## What You Need (install these first)

### 1. Node.js
Go to **https://nodejs.org** and download the "LTS" version. Run the installer — it's just like installing any app.

To confirm it worked, open Terminal (Mac) or Command Prompt (Windows) and type:
```
node --version
```
You should see a version number like `v20.11.0`.

### 2. Git (if you don't have it)
Go to **https://git-scm.com/downloads** and install it.

---

## Getting It Live (Step by Step)

### Step 1 — Get the code onto GitHub

1. Go to **https://github.com/new** (you already have a GitHub account ✓)
2. Repository name: `aryanp-dev` (or whatever you like)
3. Keep it **Public**
4. Click **Create repository**
5. GitHub will show you a page with commands. Open your Terminal / Command Prompt and run these:

```bash
# Navigate to the folder where you unzipped this project
cd path/to/aryanp-dev

# Set up git and push to GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/aryanp-dev.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### Step 2 — Deploy on Vercel (free, takes 2 minutes)

1. Go to **https://vercel.com** and sign up with your GitHub account
2. Click **"Add New Project"**
3. Find your `aryanp-dev` repo and click **Import**
4. Don't change any settings — just click **Deploy**
5. In about 60 seconds, your site is live at a URL like `aryanp-dev.vercel.app` 🎉

### Step 3 — Connect your custom domain (optional)

If you own `aryanp.dev` or any other domain:
1. In Vercel, go to your project → **Settings → Domains**
2. Add your domain and follow the DNS instructions Vercel gives you
3. Usually takes 5–30 minutes to go live

---

## How to Update Your Site

**Everything** on the public site comes from `src/content.ts`. Open it in VS Code and you'll see clearly labelled sections for every piece of content.

### Changing your bio, tagline, email, etc.
Open `src/content.ts` and find the `siteConfig` section at the top:
```typescript
export const siteConfig = {
  name: 'Aryan Prabhudesai',        // ← Your name
  tagline: 'Building things that matter.',  // ← Big tagline on homepage
  email: 'placeholderemail@outlook.com',    // ← Your real email
  location: 'Mumbai, India',               // ← Your location
  // ... etc
};
```
Just change the values inside the quotes.

### Adding a project
Find the `projects` array in `src/content.ts` and copy-paste one of the existing entries, then fill in your details:
```typescript
{
  title: 'My New Project',
  slug: 'my-new-project',          // ← URL-friendly version of title (no spaces)
  shortDesc: 'One line description',
  description: 'Longer description',
  techStack: ['React', 'Node.js'],
  category: 'Web App',
  githubUrl: 'https://github.com/you/project',
  demoUrl: '',                     // ← Leave empty if no demo
  featured: false,
  visible: true,
},
```

### Writing a blog post
Find the `blogPosts` array and add a new entry:
```typescript
{
  title: 'My Post Title',
  slug: 'my-post-title',          // ← No spaces, use hyphens
  excerpt: 'Short summary shown in listings',
  tags: ['Tag1', 'Tag2'],
  publishedAt: '2025-01-15',      // ← YYYY-MM-DD format
  readTime: 5,                    // ← Estimated minutes to read
  published: true,                // ← Set to false for drafts
  content: `
# My Post Title

Your content goes here in **Markdown** format.

## A Subheading

Regular paragraph text.

\`\`\`javascript
// Code blocks work too
const hello = "world";
\`\`\`
  `,
},
```

### Hiding a bad grade (👀)
In the `academics` section, find the course and set `visible: false`:
```typescript
{ name: 'That One Course', grade: 'C', credits: 3, visible: false },
```
It will disappear from the public site immediately.

### Adding your photo
1. Put your photo file (e.g. `me.jpg`) in the `/public` folder
2. In `src/content.ts`, find `aboutContent` and update:
```typescript
photo: '/me.jpg',
```

### Uploading your resume PDF
1. Put your resume PDF in the `/public` folder (name it `resume.pdf`)
2. The download button will automatically work — `siteConfig.resumeUrl` already points to `/resume.pdf`

---

## Deploying Updates

After editing `src/content.ts` (or any file), push to GitHub and Vercel will automatically redeploy:

```bash
git add .
git commit -m "Updated projects"
git push
```

Your site updates in about 30 seconds. That's it.

---

## Testing Locally (optional — to preview before pushing)

```bash
# In the project folder:
npm install        # First time only — installs dependencies
npm run dev        # Starts local server
```

Then open **http://localhost:3000** in your browser.

---

## Troubleshooting

**"npm: command not found"**
→ Node.js isn't installed yet. Go to nodejs.org and install it.

**"Cannot find module" errors**
→ Run `npm install` in the project folder first.

**Site looks broken / no styles**
→ Make sure you pushed all files. Run `git add . && git commit -m "fix" && git push`.

**Font not loading**
→ Your browser needs internet access. Fonts load from Google Fonts.

**Contact form not working**
→ The form opens your email client (like Outlook or Gmail). Make sure you have a default email app set. Update `siteConfig.email` in `content.ts` with your real email.

---

## Tech Stack (for reference)

- **Next.js 14** — React framework
- **Tailwind CSS** — Styling
- **Framer Motion** — Animations
- **next-themes** — Dark/light mode
- **react-markdown** — Blog post rendering
- **Deployed on Vercel** — Free hosting

---

Built by Aryan Prabhudesai. Feel free to fork and adapt.
