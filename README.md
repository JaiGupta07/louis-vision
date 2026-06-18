# Louis Vision

**A voice-first navigation aid for blind and low-vision users.** Open it on your phone, tap the screen, and it describes what's in front of you, out loud.

🔗 **Live demo:** https://louis-vision.vercel.app

---

## What it does

Louis Vision uses your phone's camera and a vision-language model to describe a user's surroundings in real time. Tap anywhere on the screen → it captures the scene → it speaks a short, useful description aloud ("A doorway about two meters ahead, a chair to your left"). The interface is built to be used without looking at it: the entire screen is one large tap target, every action gives audio and haptic feedback, and spoken output is kept short for real-time navigation.

## Why

Louis Vision is the software successor to [Project Louis](http://wiredindia.in/louis.html), an assistive navigation cane I co-founded — which raised ~$15,000 and put 26+ donated units in the hands of blind users at an institute for the blind in Delhi. That project taught me the problem firsthand through user research. This one rebuilds the idea for 2026: instead of sensors on a cane, it puts a vision model in the user's pocket.

## How it works

- **Frontend:** React + Vite. Camera access via `getUserMedia`; speech via the browser's Web Speech API.
- **Backend:** a serverless function holds the API key and calls the vision-language model — the key never touches the frontend.
- **Hosting:** Vercel.

## Run it locally

```bash
npm install
# add your Anthropic API key to a .env file:
# ANTHROPIC_API_KEY=your_key_here
npm run dev
```

Then open the local URL on your phone (or a laptop with a camera) and allow camera access.

## Roadmap

- [x] MVP: tap to describe the scene aloud
- [ ] Read mode — read signs, labels, and text on demand
- [ ] Find mode — "where is my water bottle?"
- [ ] Hazard mode — continuous capture with obstacle/step warnings
- [ ] Bilingual output (English + Hindi)

## Status

Built as a working MVP. Actively improving. Feedback welcome.
