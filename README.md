# PSP Portfolio

An interactive portfolio website inspired by the Sony PSP 1000, featuring a 3D PSP model with a functional XMB (XrossMediaBar) interface.

## Features

- 🎮 **3D PSP Model** - Interactive PSP 1000 model with floating animation
- 📱 **XMB Interface** - Authentic PlayStation XrossMediaBar navigation
- 🌊 **Animated Waves** - Dynamic wave background that changes with categories
- 🔊 **Sound Effects** - PSP-style navigation sounds
- ⌨️ **Keyboard Navigation** - Arrow keys + Enter/Escape for full control
- 📱 **Responsive Design** - Adapts to mobile with touch controls

## Tech Stack

- **Next.js 14** - React framework
- **React Three Fiber** - 3D rendering
- **Framer Motion** - Animations
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Howler.js** - Audio

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)

## Navigation

### Desktop
- `←` `→` - Switch categories
- `↑` `↓` - Navigate items
- `Enter` or `X` - Select item
- `Escape` or `O` - Go back

### Mobile
- Use the on-screen D-pad and action buttons
- Tap directly on items to navigate

## Customization

### Portfolio Content
Edit `stores/portfolioStore.ts` to update:
- Case studies
- About section
- Resume information

### Styling
- Wave colors: `components/xmb/WaveBackground.tsx`
- Theme colors: `tailwind.config.ts`
- Global styles: `app/globals.css`

### 3D Model
The PSP model is loaded from `public/models/sony_psp.glb`. Adjust screen overlay position in `components/psp/ScreenOverlay.tsx`.

## Asset Requirements

Place the following in the `public` folder:

- `/models/sony_psp.glb` - PSP 3D model
- `/fonts/FOT-NewRodin Pro *.otf` - PSP system font
- `/images/` - UMD thumbnails, profile photo, backgrounds
- `/audio/` - Navigation sound effects (optional)

## License

This project is for portfolio/educational purposes only. PlayStation and PSP are trademarks of Sony Interactive Entertainment.












