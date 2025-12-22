# 🎨 PixelParty

A **real-time collaborative pixel canvas** where multiple users can paint together. Think Reddit's r/place, but simplified and built with modern web technologies.

---

## ✨ Features

- **Real-time Collaboration** - See other users paint instantly via Supabase Realtime
- **Ghost Cursors** - See where other users are hovering on the canvas
- **5-Second Cooldown** - Prevents spam with a visual countdown timer
- **Heatmap Mode** - Visualize which pixels are "hotly contested"
- **Theme Toggle** - Switch between dark and light modes
- **Export to PNG** - Save the current canvas state as an image
- **Optimistic UI** - Instant feedback on paint actions

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Nuxt 4](https://nuxt.com) | Vue 3 framework with SSR |
| [Supabase](https://supabase.com) | Database, Realtime, Auth |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first styling |
| TypeScript | Type safety |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 22.12.0 or higher
- A [Supabase](https://supabase.com) account (free tier works)

### 1. Clone and Install

```bash
git clone <your-repo>
cd pixel-supa
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings → API** and copy your:
   - Project URL
   - `anon` public key

3. Create `.env` file:

```bash
cp .env.example .env
```

4. Add your credentials to `.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-public-key
```

### 3. Run Database Migration

In your Supabase dashboard, go to **SQL Editor** and run the contents of:

```
supabase/migrations/001_initial_schema.sql
```

This creates the `pixels` table with 400 rows (20×20 grid).

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📁 Project Structure

```
pixel-supa/
├── app/
│   ├── assets/css/main.css      # Global styles + theme variables
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── PixelCell.vue    # Individual pixel
│   │   │   └── PixelGrid.vue    # 20×20 grid + ghost cursors
│   │   └── ui/
│   │       ├── ColorPicker.vue  # Color palette
│   │       ├── CooldownTimer.vue # SVG countdown
│   │       ├── ExportButton.vue # PNG export
│   │       ├── ThemeToggle.vue  # Dark/light switch
│   │       └── UserStats.vue    # Online count + heatmap
│   ├── composables/
│   │   ├── usePixelCanvas.ts    # Supabase data + realtime
│   │   ├── useCooldown.ts       # Paint timer logic
│   │   ├── usePresence.ts       # Ghost cursor tracking
│   │   └── useTheme.ts          # Theme management
│   └── pages/
│       └── index.vue            # Main app page
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── nuxt.config.ts
└── package.json
```

---

## 🗄️ Database Schema

### `pixels` table

| Column | Type | Description |
|--------|------|-------------|
| `id` | `SERIAL` | Primary key |
| `x` | `INT` | X coordinate (0-19) |
| `y` | `INT` | Y coordinate (0-19) |
| `color` | `TEXT` | Hex color code |
| `change_count` | `INT` | Times painted (for heatmap) |

---

## 🎨 Theming

The app supports **dark** and **light** modes:

- Toggle via the sun/moon button in the top bar
- Preference is saved to localStorage
- All colors use CSS custom properties for easy customization

To add custom themes, edit `app/composables/useTheme.ts`.

---

## 📸 Export

Click the **💾 Save PNG** button to download the current canvas as a PNG image.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License - feel free to use this project for learning or as a starting point for your own real-time apps!

---

Built with ❤️ using Nuxt + Supabase
