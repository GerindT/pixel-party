# 🎨 PixelParty

A **real-time collaborative pixel canvas** where multiple users can paint together. Think Reddit's r/place, but simplified and built with modern web technologies.

---

## ✨ Features

### Core
- **Real-time Collaboration** - See other users paint instantly via Supabase Realtime
- **Ghost Cursors** - See where other users are hovering on the canvas
- **5-Second Cooldown** - Prevents spam with a visual countdown timer
- **Optimistic UI** - Instant feedback on paint actions

### Canvas Lifecycle
- **Completion Detection** - Detects when all 400 pixels are painted
- **Auto-Save to Gallery** - 60-second countdown, then saves and resets
- **Duplicate Prevention** - Only one save per canvas (multi-user safe)

### Customization
- **Custom Color Picker** - Click "+" to pick any color
- **Heatmap Mode** - Visualize which pixels are "hotly contested"
- **Theme Toggle** - Switch between dark and light modes

### Export & Gallery
- **PNG/SVG Export** - Save the current canvas in either format
- **Gallery Panel** - Browse saved canvases in slide-out panel
- **Image Viewer** - Click any gallery item to view full-size
- **Download History** - Download old canvases as PNG or SVG

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

In your Supabase dashboard, go to **SQL Editor** and run:

```sql
-- Run both migrations in order:
-- 1. supabase/migrations/001_initial_schema.sql
-- 2. supabase/migrations/002_add_gallery.sql
```

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
│   ├── assets/css/main.css      # Theme variables + styles
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── PixelCell.vue    # Individual pixel
│   │   │   └── PixelGrid.vue    # 20×20 grid + ghost cursors
│   │   └── ui/
│   │       ├── ColorPicker.vue  # Color palette + custom picker
│   │       ├── CooldownTimer.vue # SVG countdown
│   │       ├── ExportButton.vue # PNG/SVG export dropdown
│   │       ├── GalleryPanel.vue # Gallery + viewer modal
│   │       ├── ResetBanner.vue  # Countdown banner
│   │       ├── ThemeToggle.vue  # Dark/light switch
│   │       └── UserStats.vue    # Online count + heatmap
│   ├── composables/
│   │   ├── usePixelCanvas.ts    # Supabase data + realtime
│   │   ├── useCooldown.ts       # Paint timer logic
│   │   ├── usePresence.ts       # Ghost cursor tracking
│   │   ├── useTheme.ts          # Theme management
│   │   └── useCanvasReset.ts    # Canvas lifecycle + gallery
│   └── pages/
│       └── index.vue            # Main app page
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql
│       └── 002_add_gallery.sql
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

### `canvas_history` table
| Column | Type | Description |
|--------|------|-------------|
| `id` | `SERIAL` | Primary key |
| `snapshot` | `JSONB` | Pixel colors as key-value pairs |
| `completed_at` | `TIMESTAMPTZ` | When canvas was saved |

---

## 🎨 Theming

The app supports **dark** and **light** modes:

- Toggle via the sun/moon button in the top bar
- Preference is saved to localStorage
- All colors use CSS custom properties

---

## 🧪 Testing

Click the **"🧪 Fill All"** button to instantly fill all pixels (for testing the gallery save feature).

---

## 📄 License

MIT License - feel free to use this project for learning or as a starting point for your own real-time apps!

---

Built with ❤️ using Nuxt + Supabase
