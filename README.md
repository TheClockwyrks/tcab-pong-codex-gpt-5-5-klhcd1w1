# Carom

Carom is a top-down browser paddle duel about curved shots and bank angles. Two
paddles face off across a dark arena while a bright ball ricochets from the top
and bottom walls, the paddles, and two moving center obstacles. Paddle motion at
impact adds spin, so a clean return can bend after it leaves the paddle.

The game runs entirely in the browser on the Simple 2D engine. It ships no
external art or audio assets; all graphics are drawn on the canvas and all sound
cues are synthesized at runtime.

## Install

```sh
npm ci
```

## Development

```sh
npm run dev
```

Vite prints a local URL for the browser. The game uses a fixed 1280 by 720
logical field that the engine scales and letterboxes to the window.

## Production Build

```sh
npm run build
```

The complete static site is written to `dist/`, with `dist/index.html` as the
entry point.

## Controls

- Player 1: `W` and `S`
- Player 2 in Versus: `ArrowUp` and `ArrowDown`
- Solo: either movement key pair controls the left paddle
- Confirm menu item: `Enter` or `Space`
- Back: `Escape`
- Pause or resume: `P` or `Escape`
- Mute: `M`

## Checks

```sh
npm run typecheck
npm run lint
npm run format
npm test
```
