# DreamScape - Quick Start Guide

Get DreamScape up and running in minutes!

## ⚡ 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Open your browser to `http://localhost:3000`

### 3. Explore the App

1. **Click "Start Recording a Dream"** from the welcome screen
2. **Describe your dream** using voice or text:
   - Use the microphone button for voice input
   - Or type/paste directly in the text area
   - Example: "I was flying through purple mountains with glowing creatures"
3. **Click "Interpret Dream"** to generate your world
4. **Explore the visualization:**
   - Toggle between 3D and 2D views
   - Move your mouse to rotate the camera (3D)
   - View the dream elements list
5. **Share or Export:**
   - Click "Share" to copy a shareable link
   - Click "Export" to download as JSON

---

## 📁 Project Structure Quick Reference

```
src/
├── App.tsx                    ← Main application component
├── main.tsx                   ← React entry point
├── index.css                  ← Tailwind styles
├── components/
│   ├── GlassUI.tsx           ← Glassmorphism design system
│   ├── VoiceRecorder.tsx     ← Microphone & transcription
│   ├── Dream3DRenderer.tsx   ← 3D visualization
│   └── Dream2DRenderer.tsx   ← 2D canvas visualization
├── store/
│   └── appStore.ts           ← Zustand state management
├── services/
│   ├── dreamInterpreter.ts   ← AI dream parsing
│   └── speechToText.ts       ← Web Speech API
└── types/
    └── index.ts              ← TypeScript interfaces
```

---

## 🎮 Features Quick Tour

### Voice Recording
- Click the microphone icon
- Speak clearly to describe your dream
- See live transcription in real-time
- System auto-stops after 10 seconds of silence

### Dream Interpretation
- Enter description (voice or text)
- Click "Interpret Dream"
- AI analyzes mood, colors, and elements
- Takes ~1.5 seconds

### 3D Exploration
- Mouse movement controls camera
- Zoom with scroll wheel
- Elements float and rotate
- Background stars twinkle

### 2D Alternative
- Top-down perspective
- Grid overlay for reference
- Mouse interaction circles
- Animated dream elements

### Share & Export
- **Share:** Copy link to share dreams with others
- **Export:** Save as JSON file for import/analysis

---

## 🎨 Customization

### Change Color Palette

Edit `src/tailwind.config.js`:
```javascript
'dream-blue': '#4F9FFF',      // Change to any hex
'dream-purple': '#8B7BFF',    // Change to any hex
```

### Adjust Glassmorphism

Edit `src/index.css`:
```css
.glass {
  @apply backdrop-blur-glass;  /* Change blur amount */
}
```

### Modify AI Interpretation

Edit `src/services/dreamInterpreter.ts`:
- `extractMood()` - Add mood keywords
- `extractColors()` - Expand color detection
- `generateDreamElements()` - Add element types

### Customize 3D Elements

Edit `src/components/Dream3DRenderer.tsx`:
- `createGeometryForElement()` - Change shapes
- `animate()` - Modify animation speed
- Three.js materials and lighting

---

## 🐛 Troubleshooting

### Microphone not working?
- Check browser permissions (look for lock icon in address bar)
- Only works on HTTPS or localhost
- Try Firefox if Chrome has issues
- Fallback to text input method

### 3D viewer blank/black?
- Check that Three.js loaded (no console errors)
- Ensure WebGL is supported in your browser
- Try 2D view as fallback
- Check browser console for errors

### Styles not appearing?
- Make sure Tailwind CSS built properly
- Check that `index.css` is imported in `main.tsx`
- Clear browser cache and restart dev server
- Check PostCSS configuration

### Dream not generating?
- Ensure transcription text is not empty
- Check browser console for errors
- Dream interpretation takes ~1.5 seconds
- Try with a longer description

---

## 📚 Learning Resources

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- Used for type safety throughout project

### React Hooks
- [React Hooks Docs](https://react.dev/reference/react/hooks)
- `useState`, `useRef`, `useEffect` used extensively

### Three.js
- [Three.js Documentation](https://threejs.org/docs/)
- 3D rendering, cameras, lighting, geometries

### Tailwind CSS
- [Tailwind CSS Docs](https://tailwindcss.com/docs/)
- Utility-first CSS framework

### Zustand
- [Zustand Docs](https://github.com/pmndrs/zustand)
- Lightweight state management

---

## 🚀 Next Steps

### Add Real AI
1. Sign up for OpenAI/Anthropic API
2. Add API key to environment variables
3. Replace mock in `dreamInterpreter.ts`
4. Parse structured response into DreamMap

### Add User Accounts
1. Set up backend (Node/Express)
2. Add authentication (Firebase/Auth0)
3. Store dreams in database
4. Implement dream history view

### Add VR Support
1. Install `@react-three/xr`
2. Wrap 3D renderer in XR components
3. Add hand controllers
4. Deploy to WebXR device

### Add Sound
1. Use `Tone.js` for ambient music
2. Add React hooks for audio
3. Generate mood-based soundscapes
4. Mix with narration playback

---

## 📝 Common Commands

```bash
# Start development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter (if configured)
npm run lint

# Check types
npx tsc --noEmit
```

---

## 💬 Tips & Tricks

### Better Dream Descriptions
- **Be specific:** Names, colors, emotions
- **Add texture:** "Soft glowing" vs just "glowing"
- **Describe mood:** Happy, scary, peaceful, exciting
- **Include scale:** Tiny, massive, vast
- **Add transitions:** How scenes change

### For Developers
- Use React DevTools to inspect state
- Three.js DevTools for 3D debugging
- Network tab to monitor API calls
- Console to check error messages

### For Designers
- Glassmorphism values in `tailwind.config.js`
- Color scheme in design tokens
- Animations in `index.css`
- Component variations in `GlassUI.tsx`

---

## 🎯 First Dreams to Try

**Test Peaceful Mode:**
> "A serene beach with golden sand. Clear blue sky. Gentle waves. Everything is calm and beautiful."

**Test Ominous Mode:**
> "Dark castle with red lighting. Scary shadows. Strange sounds. Everything is threatening."

**Test Exciting Mode:**
> "Flying through colorful clouds. Mountains below. Wind rushing past. I feel free and alive!"

---

## 📞 Support

### Check Documentation
- `README.md` - Project overview
- `IMPLEMENTATION_GUIDE.md` - Technical details
- `DREAM_EXAMPLES.md` - Example outputs

### Debug Checklist
- [ ] Node.js 16+ installed?
- [ ] npm install succeeded?
- [ ] Port 3000 available?
- [ ] Browser supports Web Speech API?
- [ ] No console errors?

---

## 🌟 Happy Dreaming!

DreamScape is ready to transform your imagination into immersive worlds. 

**Start describing your dreams and watch the magic happen.** ✨

---

**Questions? Check the implementation guide for more details!**
