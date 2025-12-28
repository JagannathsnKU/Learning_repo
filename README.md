# DreamScape

A beautiful, immersive dream visualization application. Describe your dreams, and watch as AI transforms your narration into explorable 2D/3D worlds.

## 🌙 Features

### Dream Input
- 🎤 **Voice Recording**: Describe your dreams using natural speech
- 📝 **Live Transcription**: Real-time speech-to-text conversion
- ⌨️ **Manual Input**: Type or paste your dream description

### AI Dream Interpretation
- 🤖 **Advanced Parsing**: Extracts locations, objects, moods, colors, and scale
- 🎨 **Mood Detection**: Analyzes emotional tone and atmosphere
- �� **Structured Output**: Generates detailed dream map schema (JSON)

### World Visualization
- **3D Rendering**: First-person/orbit camera exploration with Three.js
- **2D Alternative**: Top-down canvas-based visualization
- ✨ **Surreal Aesthetics**: Floating elements, non-linear layouts, dreamlike fog
- 🌈 **Dynamic Lighting**: Mood-based color and lighting schemes

### Exploration & Sharing
- 🎮 **Interactive Controls**: WASD/arrow keys + mouse camera control
- 🔗 **Shareable Links**: Generate read-only viewer links
- 📥 **Export**: Save dream scenes as JSON files
- 🎬 **Smooth Transitions**: Fade, morph, and dissolve effects

## 🏗️ Project Structure

```
src/
├── components/
│   ├── GlassUI.tsx           # Glassmorphism UI components
│   ├── VoiceRecorder.tsx     # Microphone input & transcription
│   ├── Dream3DRenderer.tsx   # 3D world visualization
│   └── Dream2DRenderer.tsx   # 2D canvas visualization
├── store/
│   └── appStore.ts           # Zustand state management
├── services/
│   ├── dreamInterpreter.ts   # AI dream parsing (mock)
│   └── speechToText.ts       # Web Speech API wrapper
├── types/
│   └── index.ts              # TypeScript interfaces
├── App.tsx                   # Main application
├── main.tsx                  # React entry point
└── index.css                 # Global styles & Tailwind

tailwind.config.js           # Tailwind configuration
vite.config.ts              # Vite configuration
postcss.config.js           # PostCSS configuration
```

## 🎨 Design System

### Colors
- **Primary Dark**: `#0A0A0A` / `#111111`
- **Glass Panels**: `rgba(255, 255, 255, 0.08–0.15)`
- **Accent Blue**: `#4F9FFF`
- **Accent Purple**: `#8B7BFF`

### Components
- Frosted glass panels with backdrop blur
- Minimalist typography (Inter/system fonts)
- Smooth animations (fade, scale, float)
- Gradient text and glowing effects

### Aesthetic
- Premium, calm, mysterious atmosphere
- Professional Apple liquid glass design
- High contrast for accessibility
- Subtle motion and transitions

## 🛠️ Tech Stack

### Frontend
- **React 18** + TypeScript
- **Tailwind CSS** for styling
- **Zustand** for state management

### 3D/2D Rendering
- **Three.js** for 3D visualization
- **HTML5 Canvas** for 2D rendering
- Responsive WebGL rendering

### APIs
- **Web Speech API** for voice recording
- **Clipboard API** for sharing
- Mock AI services (ready for real LLM integration)

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Starts development server at `http://localhost:3000`

### Build

```bash
npm run build
```

Creates optimized production build in `dist/`

### Preview

```bash
npm run preview
```

## 📝 Usage

1. **Start**: Click "Start Recording a Dream"
2. **Describe**: Use voice or text to describe your dream
3. **Interpret**: Click "Interpret Dream" to generate world
4. **Explore**: Switch between 3D/2D views and navigate
5. **Share**: Generate links or export as JSON

## 🔮 Dream Input Examples

**Ominous Dream:**
> "I was in a dark castle with red lighting. Strange creatures surrounded me, and the sky was black with no stars. Everything felt heavy and threatening."

**Peaceful Dream:**
> "Beautiful ocean with calm blue waters. A white lighthouse stood on a cliff. Golden sunlight reflected off the water. Everything was serene and quiet."

**Adventure Dream:**
> "I was flying over mountains and forests. Colors were vibrant - purple mountains, green forests, blue sky. I felt excited and free, soaring between clouds."

## 🎯 Future Enhancements

- Real LLM integration (OpenAI, Anthropic, Llama)
- Text-to-speech narration playback
- Dream journal and history
- Collaborative dream exploration
- VR/AR support
- Advanced physics and particle effects
- Custom scene editing tools
- Community dream sharing platform
- Dream analysis and insights

## 📄 License

This project is provided as-is for educational and creative purposes.

## 🌟 Design Philosophy

DreamScape prioritizes **atmosphere over realism**. Dreams aren't logical or accurate—they're emotionally correct. Every visual, color choice, and animation is designed to evoke the feeling and mood of the dreamer's narration, creating an experience that feels authentically dreamlike.

---

**Created with ✨ and 🤖**
