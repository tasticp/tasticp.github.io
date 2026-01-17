# Interactive Portfolio Walkthrough

An interactive portfolio showcasing tasticp's journey from ITE to Ngee Ann Polytechnic, with skills in coding, PLC programming, and networking.

---

## Features

### 🎨 Design
- **Dark theme** with teal gradient palette (#70FFDB → #9A91DE)
- **Glassmorphism** cards and panels
- **Floating code snippets** background animation
- **Smooth scroll animations** on all sections

### ⌨️ Interactive Terminal (About Section)
Type commands like a real terminal! Try:
- `whoami` - About me
- `ls` - List files
- `cat skills.json` - View skills
- `neofetch` - System info
- `sudo make me a sandwich` - Easter egg! 🥪

### 🖥️ Cisco CLI Simulator (Skills → Networking)
Click any network device to open its CLI! Supports:
- `enable` - Enter privileged mode
- `show running-config` - View configuration
- `show ip interface brief` - Interface status
- `show vlan brief` - VLAN info (switch)
- `ping [ip]` - Ping test

### 🔄 GitHub API Integration
Projects automatically update when you add new repos or make repos public!

### 📊 WakaTime Stats
Replace the placeholder with your WakaTime embed from [wakatime.com/share](https://wakatime.com/share)

---

## Files

| File | Purpose |
|------|---------|
| `index.html` | Main structure |
| `styles.css` | All styling |
| `script.js` | Interactive features |

---

## Free Hosting Options

Since you already have GitHub Pages and Netlify sites and don't want to take them down:

1. **GitHub Pages (New Repo)** - Create a repo like `portfolio-2026` and enable GitHub Pages
2. **Vercel** - Free tier, auto-deploys from GitHub: [vercel.com](https://vercel.com)
3. **Cloudflare Pages** - Free tier: [pages.cloudflare.com](https://pages.cloudflare.com)
4. **Surge.sh** - Simple CLI deploy: `npx surge ./portfolio`
5. **Render** - Static site hosting: [render.com](https://render.com)

All of these are **100% free** for static sites!

---

## How to Deploy

1. Push this folder to a new GitHub repo
2. Connect to Vercel/Cloudflare/Render
3. Your portfolio is live!

Or use Surge for instant deploy:
```bash
npx surge ./portfolio your-name.surge.sh
```
