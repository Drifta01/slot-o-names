# 🎰 Slot Machine Name Picker

A modern, casino-style slot machine name picker built with **Next.js 14**, **React**, **TypeScript**, and **Tailwind CSS**. Features a beautiful 3x3 grid layout, casino-style animations, sound effects, and two exciting game modes.

## ✨ Features

- **🎮 Two Game Modes:**
  - **Single Mode**: Pick one winner from the center cell
  - **Triple Mode**: Pick three winners from the center row
- **🎰 3x3 Slot Grid**: Classic slot machine layout with spinning animation
- **💰 Jackpot System**: Special effects when center row matches
- **🔊 Sound Effects**: Authentic casino sounds with Web Audio API
- **⚡ Casino Animations**: Glowing effects, pulsing lights, and smooth transitions
- **📱 Responsive Design**: Works on desktop and mobile devices
- **🎨 Modern UI**: Beautiful gradient backgrounds and glass-morphism effects

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone or download the repository**
2. **Install dependencies:**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start the development server:**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser and visit:** `http://localhost:3000`

### Build for Production

```bash
pnpm build
pnpm start
# or
npm run build
npm start
```

## 🎯 How to Play

1. **Add Names**: Enter names in the input field (minimum 2 names required)
2. **Choose Game Mode**: 
   - Single: One winner selected from center cell
   - Triple: Three winners from center row (jackpot if all match!)
3. **Pull the Lever**: Click the handle or use the spin button
4. **Watch the Magic**: Enjoy the spinning animation and sound effects
5. **Celebrate**: See the winner(s) with special effects!

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Library**: React 18
- **Animations**: CSS animations + Tailwind utilities
- **Audio**: Web Audio API
- **Build Tools**: Next.js built-in tooling

## 📁 Project Structure

```
slot-0-names/
├── app/
│   ├── components/           # React components
│   │   ├── SlotMachine.tsx   # Main slot machine component
│   │   ├── SlotGrid.tsx      # 3x3 grid display
│   │   ├── GameModeSelector.tsx
│   │   ├── NameInput.tsx
│   │   ├── ControlButtons.tsx
│   │   └── ResultDisplay.tsx
│   ├── hooks/
│   │   └── useSlotMachine.ts # Game logic and state management
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   └── globals.css           # Global styles and Tailwind
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

## 🎨 Casino Theme

The app features a rich casino color palette:
- **Casino Red** (#c41e3a): Primary accent color
- **Casino Gold** (#ffd700): Highlights and winners
- **Casino Dark** (#1a1a2e): Background and text
- **Casino Purple** (#2c2c54): Secondary elements

## 🔧 Customization

### Adding More Names
The app comes with default names, but you can:
- Add names through the UI
- Remove winners after each spin
- Clear all names to start fresh

### Modifying Game Logic
Edit `app/hooks/useSlotMachine.ts` to:
- Change winning patterns
- Adjust spin duration
- Modify sound effects
- Add new game modes

### Styling Changes
Customize the look in:
- `tailwind.config.js`: Colors and animations
- `app/globals.css`: Custom CSS classes
- Individual component files: Component-specific styles

## 🎵 Sound Effects

The app includes dynamic sound generation:
- **Spinning Sound**: Low frequency hum during spins
- **Winner Sound**: Pleasant ascending tones
- **Jackpot Sound**: Celebratory musical sequence

Sounds are generated using the Web Audio API and will gracefully fail on unsupported browsers.

## 📱 Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet
- **Features**: Requires JavaScript enabled, Web Audio API for sounds

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

**🎰 Good luck and may the odds be ever in your favor! 🍀**
- Modern DOM methods (`replaceChildren()`, `at()`, etc.)
- No external frameworks - pure vanilla JavaScript

## License

MIT License - feel free to use and modify!# slot-o-names
