import type {
  Game,
  InitApi,
  RenderApi,
  UpdateApi,
} from "@clockwyrks/simple-2d";
import type { DeepReadonly } from "ts-essentials";
import {
  ACTIONS,
  AI_DEADZONE,
  AI_HOME_DEADZONE,
  AI_HOME_Y,
  AI_REACT,
  AI_SPEED,
  BALL_R,
  BINDINGS,
  CAROM_DEBUG_VERSION,
  CUES,
  FIELD_CX,
  FIELD_CY,
  FIELD_H,
  FIELD_W,
  HOLD_TIME,
  MATCHOVER_ITEMS,
  MAX_BOUNCE_ANGLE,
  MAX_SUBSTEP,
  NET_X,
  OBSTACLE_CENTERS,
  OBSTACLE_H,
  OBSTACLE_HH,
  OBSTACLE_HW,
  OBSTACLE_SPIN_RATE,
  OBSTACLE_SWAY_AMP,
  OBSTACLE_SWAY_PERIOD,
  OBSTACLE_W,
  P1_X0,
  P1_X1,
  P2_X0,
  P2_X1,
  PADDLE_HALF,
  PADDLE_H,
  PADDLE_MAX_CY,
  PADDLE_MIN_CY,
  PADDLE_SPEED,
  PADDLE_W,
  PAUSE_ITEMS,
  SERVE_ANGLE,
  SERVE_SPEED,
  SPEED_CAP,
  SPEED_MULT,
  SPIN_CLAMP,
  SPIN_FROM_PADDLE,
  SPIN_HALFLIFE,
  TITLE_ITEMS,
  TITLE_TEXT,
  TRAIL_TIME,
  WIN_LEAD,
  WIN_SCORE,
} from "./constants";

export const BACKGROUND = "#08111f";

export type Screen =
  "title" | "howto" | "countdown" | "playing" | "paused" | "matchover";

export type Mode = "solo" | "versus";

export type Side = "left" | "right";

export interface PaddleState {
  readonly cy: number;
  readonly vy: number;
  readonly driven: boolean;
  readonly drivenVy: number;
}

export interface AiState {
  readonly tracking: boolean;
  readonly movement: boolean;
}

export interface TrailSample {
  readonly x: number;
  readonly y: number;
  readonly t: number;
}

export interface BallState {
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
  readonly spin: number;
  readonly held: boolean;
  readonly holdTimer: number;
  readonly serveSign: 1 | -1;
  readonly trail: readonly TrailSample[];
}

export interface ObstacleState {
  readonly index: number;
  readonly cx: number;
  readonly cy: number;
  readonly theta: number;
}

export interface CaromState {
  readonly screen: Screen;
  readonly mode: Mode;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly resumeScreen: "countdown" | "playing";

  readonly score: { readonly p1: number; readonly p2: number };
  readonly winner: Side | null;

  readonly paddles: { readonly left: PaddleState; readonly right: PaddleState };
  readonly ai: AiState;

  readonly receiver: Side;
  readonly ball: BallState | null;
  readonly obstacles: readonly ObstacleState[];
  readonly obstacleClock: number;
  readonly obstacleClockRunning: boolean;

  readonly simTime: number;
  readonly muted: boolean;
}

export interface MenuRect {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

export interface CaromSnapshot {
  readonly version: number;
  readonly screen: Screen;
  readonly mode: Mode;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly resumeScreen: "countdown" | "playing";
  readonly score: { readonly p1: number; readonly p2: number };
  readonly winner: Side | null;
  readonly muted: boolean;
  readonly paddles: {
    readonly left: PaddleState;
    readonly right: PaddleState;
  };
  readonly ai: AiState;
  readonly receiver: Side;
  readonly ball:
    | (BallState & {
        readonly speed: number;
      })
    | null;
  readonly obstacles: readonly ObstacleState[];
  readonly obstacleClock: number;
  readonly obstacleClockRunning: boolean;
  readonly simTime: number;
}

export interface CaromDebugApi {
  readonly version: number;
  clearWorld(state: DeepReadonly<CaromState>): CaromState;
  spawnBall(state: DeepReadonly<CaromState>): CaromState;
  spawnObstacle(state: DeepReadonly<CaromState>, index: number): CaromState;
  reset(state: DeepReadonly<CaromState>): CaromState;
  reconcile(state: DeepReadonly<CaromState>): CaromState;
  setScreen(state: DeepReadonly<CaromState>, screen: Screen): CaromState;
  setMode(state: DeepReadonly<CaromState>, mode: Mode): CaromState;
  setMenuIndex(state: DeepReadonly<CaromState>, index: number): CaromState;
  setTitleIndex(state: DeepReadonly<CaromState>, index: number): CaromState;
  setResumeScreen(
    state: DeepReadonly<CaromState>,
    screen: "countdown" | "playing",
  ): CaromState;
  setScore(state: DeepReadonly<CaromState>, p1: number, p2: number): CaromState;
  setWinner(state: DeepReadonly<CaromState>, side: Side | null): CaromState;
  setReceiver(state: DeepReadonly<CaromState>, side: Side): CaromState;
  setPaddleCy(
    state: DeepReadonly<CaromState>,
    side: Side,
    cy: number,
  ): CaromState;
  setPaddleVy(
    state: DeepReadonly<CaromState>,
    side: Side,
    vy: number,
  ): CaromState;
  setPaddleDriven(
    state: DeepReadonly<CaromState>,
    side: Side,
    driven: boolean,
  ): CaromState;
  setBallPosition(
    state: DeepReadonly<CaromState>,
    x: number,
    y: number,
  ): CaromState;
  setBallVelocity(
    state: DeepReadonly<CaromState>,
    vx: number,
    vy: number,
  ): CaromState;
  setBallSpin(state: DeepReadonly<CaromState>, spin: number): CaromState;
  setBallHeld(state: DeepReadonly<CaromState>, held: boolean): CaromState;
  setBallHoldTimer(
    state: DeepReadonly<CaromState>,
    seconds: number,
  ): CaromState;
  setBallServeSign(state: DeepReadonly<CaromState>, sign: 1 | -1): CaromState;
  drawBallServeSign(state: DeepReadonly<CaromState>): CaromState;
  setAiTracking(state: DeepReadonly<CaromState>, enabled: boolean): CaromState;
  setAiMovement(state: DeepReadonly<CaromState>, enabled: boolean): CaromState;
  setMuted(state: DeepReadonly<CaromState>, muted: boolean): CaromState;
  setObstacleClock(state: DeepReadonly<CaromState>, t: number): CaromState;
  setObstacleClockRunning(
    state: DeepReadonly<CaromState>,
    running: boolean,
  ): CaromState;
  snapshot(state: DeepReadonly<CaromState>): CaromSnapshot;
  menuItemRect(state: DeepReadonly<CaromState>, index: number): MenuRect | null;
}

interface FrameEvents {
  paddleHit: boolean;
  wallBounce: boolean;
  obstacleBounce: boolean;
  score: boolean;
}

type Face = "left" | "right" | "top" | "bottom";

const LEFT_COLOR = "#35d6ff";
const RIGHT_COLOR = "#ff5a91";
const BALL_COLOR = "#fff4a8";
const OBSTACLE_COLOR = "#5cffad";
const PANEL = "rgba(8, 17, 31, 0.74)";
const TEXT = "#f5fbff";
const MUTED_TEXT = "#8fa3b8";
const FONT = "Inter, ui-sans-serif, system-ui, sans-serif";
const MONO_FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const MENU_W = 360;
const MENU_H = 58;
const MENU_GAP = 16;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function signDraw(): 1 | -1 {
  return Math.random() < 0.5 ? -1 : 1;
}

function speed(ball: Pick<BallState, "vx" | "vy">): number {
  return Math.hypot(ball.vx, ball.vy);
}

function obstaclePose(index: number, t: number): ObstacleState {
  const center = OBSTACLE_CENTERS[index];
  if (center === undefined) throw new RangeError(`No obstacle ${index}`);
  const sway =
    OBSTACLE_SWAY_AMP * Math.sin((2 * Math.PI * t) / OBSTACLE_SWAY_PERIOD);
  return {
    index,
    cx: center.x,
    cy: center.y + (index === 0 ? sway : -sway),
    theta: OBSTACLE_SPIN_RATE * t,
  };
}

function allObstacles(t: number): readonly ObstacleState[] {
  return OBSTACLE_CENTERS.map((_, index) => obstaclePose(index, t));
}

function parkedBall(): BallState {
  return {
    x: FIELD_CX,
    y: FIELD_CY,
    vx: 0,
    vy: 0,
    spin: 0,
    held: true,
    holdTimer: HOLD_TIME,
    serveSign: signDraw(),
    trail: [],
  };
}

function titleState(muted: boolean): CaromState {
  const paddle: PaddleState = {
    cy: FIELD_CY,
    vy: 0,
    driven: false,
    drivenVy: 0,
  };
  return {
    screen: "title",
    mode: "solo",
    menuIndex: 0,
    titleIndex: 0,
    resumeScreen: "playing",
    score: { p1: 0, p2: 0 },
    winner: null,
    paddles: { left: paddle, right: paddle },
    ai: { tracking: true, movement: true },
    receiver: "left",
    ball: parkedBall(),
    obstacles: allObstacles(0),
    obstacleClock: 0,
    obstacleClockRunning: true,
    simTime: 0,
    muted,
  };
}

function startMatch(state: DeepReadonly<CaromState>, mode: Mode): CaromState {
  return {
    ...state,
    screen: "countdown",
    mode,
    menuIndex: 0,
    resumeScreen: "playing",
    score: { p1: 0, p2: 0 },
    winner: null,
    receiver: "left",
    ball: parkedBall(),
    paddles: {
      left: { ...state.paddles.left, cy: FIELD_CY, vy: 0 },
      right: { ...state.paddles.right, cy: FIELD_CY, vy: 0 },
    },
    obstacleClock: 0,
    obstacleClockRunning: true,
    obstacles: allObstacles(0),
  };
}

function returnToTitle(state: DeepReadonly<CaromState>): CaromState {
  return {
    ...titleState(state.muted),
    titleIndex: state.titleIndex,
    menuIndex: state.titleIndex,
    simTime: state.simTime,
  };
}

function menuItems(screen: Screen): readonly string[] {
  switch (screen) {
    case "title":
      return TITLE_ITEMS;
    case "howto":
      return ["BACK"];
    case "paused":
      return PAUSE_ITEMS;
    case "matchover":
      return MATCHOVER_ITEMS;
    case "countdown":
    case "playing":
      return [];
  }
}

function menuTop(screen: Screen, count: number): number {
  if (screen === "title") return 392;
  if (screen === "howto") return 570;
  const total = count * MENU_H + Math.max(0, count - 1) * MENU_GAP;
  return FIELD_CY - total / 2 + 78;
}

function menuItemRectFor(
  state: DeepReadonly<CaromState>,
  index: number,
): MenuRect | null {
  const items = menuItems(state.screen);
  if (index < 0 || index >= items.length) return null;
  return {
    x: FIELD_CX - MENU_W / 2,
    y: menuTop(state.screen, items.length) + index * (MENU_H + MENU_GAP),
    w: MENU_W,
    h: MENU_H,
  };
}

function itemAt(state: DeepReadonly<CaromState>, x: number, y: number): number {
  for (let index = 0; index < menuItems(state.screen).length; index += 1) {
    const rect = menuItemRectFor(state, index);
    if (
      rect &&
      x >= rect.x &&
      x <= rect.x + rect.w &&
      y >= rect.y &&
      y <= rect.y + rect.h
    ) {
      return index;
    }
  }
  return -1;
}

function moveMenu(
  state: DeepReadonly<CaromState>,
  direction: -1 | 1,
): CaromState {
  const count = menuItems(state.screen).length;
  if (count === 0) return { ...state };
  return { ...state, menuIndex: (state.menuIndex + direction + count) % count };
}

function confirmMenu(state: DeepReadonly<CaromState>): CaromState {
  switch (state.screen) {
    case "title": {
      const titleIndex = state.menuIndex;
      if (titleIndex === 0) return { ...startMatch(state, "solo"), titleIndex };
      if (titleIndex === 1)
        return { ...startMatch(state, "versus"), titleIndex };
      return { ...state, titleIndex, screen: "howto", menuIndex: 0 };
    }
    case "howto":
      return returnToTitle(state);
    case "paused":
      if (state.menuIndex === 0)
        return { ...state, screen: state.resumeScreen };
      if (state.menuIndex === 1) return startMatch(state, state.mode);
      return returnToTitle(state);
    case "matchover":
      if (state.menuIndex === 0) return startMatch(state, state.mode);
      return returnToTitle(state);
    case "countdown":
    case "playing":
      return { ...state };
  }
}

function applyPointerMenus(
  state: DeepReadonly<CaromState>,
  api: UpdateApi,
  keyboardConfirmed: boolean,
): CaromState {
  if (menuItems(state.screen).length === 0) return { ...state };
  let next: CaromState = { ...state };
  let downIndex = -1;
  let upIndex = -1;
  const samples = api.input.pointerSamples();
  for (const sample of samples) {
    const index = itemAt(next, sample.x, sample.y);
    if (index >= 0) next = { ...next, menuIndex: index };
    if (sample.type === "down" && index >= 0) downIndex = index;
    if (sample.type === "up" && index >= 0) upIndex = index;
  }
  for (const contact of api.input.pointerContacts()) {
    const index = itemAt(next, contact.x, contact.y);
    if (index >= 0) next = { ...next, menuIndex: index };
  }
  const pointer = api.input.pointer();
  const hoverIndex = itemAt(next, pointer.x, pointer.y);
  if (hoverIndex >= 0) next = { ...next, menuIndex: hoverIndex };
  if (!keyboardConfirmed && downIndex >= 0 && downIndex === upIndex) {
    next = confirmMenu({ ...next, menuIndex: downIndex });
  }
  return next;
}

function readMenuInput(
  state: DeepReadonly<CaromState>,
  api: UpdateApi,
): CaromState {
  const up = api.input.pressed("p1-up") || api.input.pressed("p2-up");
  const down = api.input.pressed("p1-down") || api.input.pressed("p2-down");
  const confirm = api.input.pressed("confirm");
  const back = api.input.pressed("back");
  const pause = api.input.pressed("pause");

  let next: CaromState = { ...state };
  let confirmed = false;
  switch (state.screen) {
    case "title":
      if (up) next = moveMenu(next, -1);
      else if (down) next = moveMenu(next, 1);
      else if (confirm) {
        next = confirmMenu(next);
        confirmed = true;
      }
      break;
    case "howto":
      if (confirm || back) {
        next = returnToTitle(next);
        confirmed = true;
      }
      break;
    case "countdown":
    case "playing":
      if (pause) {
        next = {
          ...next,
          resumeScreen: state.screen,
          screen: "paused",
          menuIndex: 0,
        };
      }
      break;
    case "paused":
      if (pause || back) {
        next = { ...next, screen: next.resumeScreen };
      } else if (up) next = moveMenu(next, -1);
      else if (down) next = moveMenu(next, 1);
      else if (confirm) {
        next = confirmMenu(next);
        confirmed = true;
      }
      break;
    case "matchover":
      if (up) next = moveMenu(next, -1);
      else if (down) next = moveMenu(next, 1);
      else if (confirm) {
        next = confirmMenu(next);
        confirmed = true;
      } else if (back) {
        next = returnToTitle(next);
      }
      break;
  }
  return applyPointerMenus(next, api, confirmed);
}

function integratePaddle(
  paddle: DeepReadonly<PaddleState>,
  intendedVy: number,
  dt: number,
): PaddleState {
  const nextCy = clamp(
    paddle.cy + intendedVy * dt,
    PADDLE_MIN_CY,
    PADDLE_MAX_CY,
  );
  const vy = nextCy !== paddle.cy && dt > 0 ? (nextCy - paddle.cy) / dt : 0;
  return { ...paddle, cy: nextCy, vy };
}

function humanAxis(api: UpdateApi, upName: string, downName: string): number {
  return api.input.value(downName) - api.input.value(upName);
}

function movePaddles(
  state: DeepReadonly<CaromState>,
  api: UpdateApi,
  dt: number,
): { left: PaddleState; right: PaddleState } {
  const leftAxis =
    state.mode === "solo"
      ? Math.max(api.input.value("p1-down"), api.input.value("p2-down")) -
        Math.max(api.input.value("p1-up"), api.input.value("p2-up"))
      : humanAxis(api, "p1-up", "p1-down");
  const rightAxis =
    state.mode === "versus" ? humanAxis(api, "p2-up", "p2-down") : 0;
  const leftVy = state.paddles.left.driven
    ? state.paddles.left.drivenVy
    : leftAxis * PADDLE_SPEED;
  let rightVy = state.paddles.right.driven
    ? state.paddles.right.drivenVy
    : rightAxis * PADDLE_SPEED;

  if (state.mode === "solo" && !state.paddles.right.driven) {
    if (!state.ai.movement || dt <= 0) {
      rightVy = 0;
    } else {
      let target = AI_HOME_Y;
      let deadzone = AI_HOME_DEADZONE;
      if (
        state.ai.tracking &&
        state.screen === "playing" &&
        state.ball &&
        state.ball.vx > 0
      ) {
        target = state.ball.y - state.ball.vy * AI_REACT;
        deadzone = AI_DEADZONE;
      }
      const diff = target - state.paddles.right.cy;
      rightVy =
        Math.abs(diff) <= deadzone
          ? 0
          : Math.sign(diff) * Math.min(AI_SPEED, Math.abs(diff) / dt);
    }
  }

  return {
    left: integratePaddle(state.paddles.left, leftVy, dt),
    right: integratePaddle(state.paddles.right, rightVy, dt),
  };
}

function resolveWall(ball: BallState, events: FrameEvents): BallState {
  if (ball.y - BALL_R < 0 && ball.vy < 0) {
    events.wallBounce = true;
    return { ...ball, y: BALL_R, vy: -ball.vy };
  }
  if (ball.y + BALL_R > FIELD_H && ball.vy > 0) {
    events.wallBounce = true;
    return { ...ball, y: FIELD_H - BALL_R, vy: -ball.vy };
  }
  return ball;
}

function rectFace(
  ball: BallState,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
): Face | null {
  if (
    ball.x <= x0 - BALL_R ||
    ball.x >= x1 + BALL_R ||
    ball.y <= y0 - BALL_R ||
    ball.y >= y1 + BALL_R
  ) {
    return null;
  }
  const depths: readonly [Face, number][] = [
    ["left", ball.x - (x0 - BALL_R)],
    ["right", x1 + BALL_R - ball.x],
    ["top", ball.y - (y0 - BALL_R)],
    ["bottom", y1 + BALL_R - ball.y],
  ];
  return depths.reduce((best, test) => (test[1] < best[1] ? test : best))[0];
}

function paddleBounce(
  ball: BallState,
  paddle: DeepReadonly<PaddleState>,
  side: Side,
  events: FrameEvents,
): BallState {
  const x0 = side === "left" ? P1_X0 : P2_X0;
  const x1 = side === "left" ? P1_X1 : P2_X1;
  const y0 = paddle.cy - PADDLE_HALF;
  const y1 = paddle.cy + PADDLE_HALF;
  const face = rectFace(ball, x0, y0, x1, y1);
  if (!face) return ball;
  if (face === "top") {
    events.wallBounce = true;
    return { ...ball, y: y0 - BALL_R, vy: ball.vy > 0 ? -ball.vy : ball.vy };
  }
  if (face === "bottom") {
    events.wallBounce = true;
    return { ...ball, y: y1 + BALL_R, vy: ball.vy < 0 ? -ball.vy : ball.vy };
  }
  events.paddleHit = true;
  const offset = clamp((ball.y - paddle.cy) / PADDLE_HALF, -1, 1);
  const theta = offset * MAX_BOUNCE_ANGLE;
  const nextSpeed = Math.min(speed(ball) * SPEED_MULT, SPEED_CAP);
  const dir = side === "left" ? 1 : -1;
  return {
    ...ball,
    x: side === "left" ? P1_X1 + BALL_R : P2_X0 - BALL_R,
    vx: dir * nextSpeed * Math.cos(theta),
    vy: nextSpeed * Math.sin(theta),
    spin: clamp(
      ball.spin + paddle.vy * SPIN_FROM_PADDLE,
      -SPIN_CLAMP,
      SPIN_CLAMP,
    ),
  };
}

function resolveObstacle(
  ball: BallState,
  obstacle: DeepReadonly<ObstacleState>,
  events: FrameEvents,
): BallState {
  const cos = Math.cos(obstacle.theta);
  const sin = Math.sin(obstacle.theta);
  const dx = ball.x - obstacle.cx;
  const dy = ball.y - obstacle.cy;
  const lx = dx * cos + dy * sin;
  const ly = -dx * sin + dy * cos;
  const qx = clamp(lx, -OBSTACLE_HW, OBSTACLE_HW);
  const qy = clamp(ly, -OBSTACLE_HH, OBSTACLE_HH);
  const ox = lx - qx;
  const oy = ly - qy;
  const dist = Math.hypot(ox, oy);
  if (dist >= BALL_R) return ball;

  let normal: readonly [number, number];
  if (dist > 0) {
    normal = [ox / dist, oy / dist];
  } else {
    const depths: readonly [number, number, number][] = [
      [-1, 0, OBSTACLE_HW + lx],
      [1, 0, OBSTACLE_HW - lx],
      [0, -1, OBSTACLE_HH + ly],
      [0, 1, OBSTACLE_HH - ly],
    ];
    const [x, y] = depths.reduce((best, test) =>
      test[2] < best[2] ? test : best,
    );
    normal = [x, y];
  }
  const [nlx, nly] = normal;
  const nx = nlx * cos - nly * sin;
  const ny = nlx * sin + nly * cos;
  const dot = ball.vx * nx + ball.vy * ny;
  const push = BALL_R - dist + 0.001;
  events.obstacleBounce = true;
  return {
    ...ball,
    x: ball.x + nx * push,
    y: ball.y + ny * push,
    vx: dot < 0 ? ball.vx - 2 * dot * nx : ball.vx,
    vy: dot < 0 ? ball.vy - 2 * dot * ny : ball.vy,
  };
}

function stepBall(
  ball: BallState,
  paddles: { readonly left: PaddleState; readonly right: PaddleState },
  obstacles: readonly DeepReadonly<ObstacleState>[],
  dt: number,
  events: FrameEvents,
): BallState {
  const baseSpeed = speed(ball);
  const steps = Math.max(1, Math.ceil((baseSpeed * dt) / MAX_SUBSTEP));
  const h = dt / steps;
  let next = ball;
  for (let i = 0; i < steps; i += 1) {
    const currentSpeed = speed(next);
    if (currentSpeed > 0) {
      const turn = (next.spin / currentSpeed) * h;
      const cos = Math.cos(turn);
      const sin = Math.sin(turn);
      next = {
        ...next,
        vx: next.vx * cos - next.vy * sin,
        vy: next.vx * sin + next.vy * cos,
      };
    }
    next = {
      ...next,
      spin: next.spin * 0.5 ** (h / SPIN_HALFLIFE),
      x: next.x + next.vx * h,
      y: next.y + next.vy * h,
    };
    next = resolveWall(next, events);
    next = paddleBounce(next, paddles.left, "left", events);
    next = paddleBounce(next, paddles.right, "right", events);
    for (const obstacle of obstacles) {
      next = resolveObstacle(next, obstacle, events);
    }
  }
  return next;
}

function withTrail(ball: BallState, simTime: number): BallState {
  const trail = [...ball.trail, { x: ball.x, y: ball.y, t: simTime }].filter(
    (sample) => simTime - sample.t <= TRAIL_TIME,
  );
  return { ...ball, trail };
}

function serve(ball: BallState, receiver: Side): BallState {
  const dir = receiver === "left" ? -1 : 1;
  return {
    ...ball,
    holdTimer: 0,
    held: false,
    trail: [],
    vx: dir * SERVE_SPEED * Math.cos(SERVE_ANGLE),
    vy: ball.serveSign * SERVE_SPEED * Math.sin(SERVE_ANGLE),
  };
}

function scoreIfNeeded(state: CaromState, events: FrameEvents): CaromState {
  const ball = state.ball;
  if (!ball) return state;
  const scorer =
    ball.x - BALL_R > FIELD_W ? "left" : ball.x + BALL_R < 0 ? "right" : null;
  if (!scorer) return state;
  events.score = true;
  const scoreNext = {
    p1: state.score.p1 + (scorer === "left" ? 1 : 0),
    p2: state.score.p2 + (scorer === "right" ? 1 : 0),
  };
  const leftWins =
    scoreNext.p1 >= WIN_SCORE && scoreNext.p1 - scoreNext.p2 >= WIN_LEAD;
  const rightWins =
    scoreNext.p2 >= WIN_SCORE && scoreNext.p2 - scoreNext.p1 >= WIN_LEAD;
  if (leftWins || rightWins) {
    return {
      ...state,
      score: scoreNext,
      winner: leftWins ? "left" : "right",
      screen: "matchover",
      menuIndex: 0,
    };
  }
  return {
    ...state,
    score: scoreNext,
    receiver: scorer === "left" ? "right" : "left",
    ball: parkedBall(),
    screen: "countdown",
  };
}

function advanceLive(
  state: DeepReadonly<CaromState>,
  api: UpdateApi,
  dt: number,
  simTime: number,
  events: FrameEvents,
): CaromState {
  const paddles = movePaddles(state, api, dt);
  const frameObstacles = state.obstacles.map((obstacle) =>
    obstaclePose(obstacle.index, state.obstacleClock),
  );
  let ball = state.ball ? { ...state.ball } : null;
  let screen = state.screen;
  if (ball && state.screen === "countdown") {
    const holdTimer = Math.max(0, ball.holdTimer - dt);
    ball = { ...ball, x: FIELD_CX, y: FIELD_CY, holdTimer };
    if (holdTimer <= 0) {
      ball = serve(ball, state.receiver);
      screen = "playing";
    }
  } else if (ball && state.screen === "playing" && !ball.held) {
    ball = stepBall(ball, paddles, frameObstacles, dt, events);
  }
  if (ball) ball = withTrail(ball, simTime);
  const obstacleClock =
    state.obstacleClockRunning &&
    (state.screen === "countdown" || state.screen === "playing")
      ? state.obstacleClock + dt
      : state.obstacleClock;
  const obstacles = state.obstacles.map((obstacle) =>
    obstaclePose(obstacle.index, obstacleClock),
  );
  return scoreIfNeeded(
    {
      ...state,
      screen,
      paddles,
      ball,
      obstacleClock,
      obstacles,
    },
    events,
  );
}

function playFrameCues(api: UpdateApi, events: FrameEvents): void {
  if (events.paddleHit) api.audio.play(CUES.paddleHit);
  if (events.wallBounce) api.audio.play(CUES.wallBounce);
  if (events.obstacleBounce) api.audio.play(CUES.obstacleBounce);
  if (events.score) api.audio.play(CUES.score);
}

function ballOrThrow(state: DeepReadonly<CaromState>): BallState {
  if (!state.ball) throw new Error("Carom debug: no ball is present");
  return { ...state.ball };
}

function replaceBall(
  state: DeepReadonly<CaromState>,
  ball: BallState,
): CaromState {
  return { ...state, ball };
}

function setPaddle(
  state: DeepReadonly<CaromState>,
  side: Side,
  paddle: PaddleState,
): CaromState {
  return {
    ...state,
    paddles: {
      ...state.paddles,
      [side]: paddle,
    },
  };
}

function snapshot(state: DeepReadonly<CaromState>): CaromSnapshot {
  return {
    version: CAROM_DEBUG_VERSION,
    screen: state.screen,
    mode: state.mode,
    menuIndex: state.menuIndex,
    titleIndex: state.titleIndex,
    resumeScreen: state.resumeScreen,
    score: { p1: state.score.p1, p2: state.score.p2 },
    winner: state.winner,
    muted: state.muted,
    paddles: {
      left: { ...state.paddles.left },
      right: { ...state.paddles.right },
    },
    ai: { ...state.ai },
    receiver: state.receiver,
    ball: state.ball ? { ...state.ball, speed: speed(state.ball) } : null,
    obstacles: state.obstacles.map((obstacle) => ({ ...obstacle })),
    obstacleClock: state.obstacleClock,
    obstacleClockRunning: state.obstacleClockRunning,
    simTime: state.simTime,
  };
}

function buildDebug(): CaromDebugApi {
  return {
    version: CAROM_DEBUG_VERSION,
    clearWorld: (state) => ({ ...state, ball: null, obstacles: [] }),
    spawnBall: (state) => ({ ...state, ball: parkedBall() }),
    spawnObstacle: (state, index) => {
      if (index < 0 || index >= OBSTACLE_CENTERS.length)
        throw new RangeError(`No obstacle ${index}`);
      return {
        ...state,
        obstacles: [
          ...state.obstacles.filter((obstacle) => obstacle.index !== index),
          obstaclePose(index, state.obstacleClock),
        ].sort((a, b) => a.index - b.index),
      };
    },
    reset: (state) => titleState(state.muted),
    reconcile: (state) => ({
      ...state,
      obstacles: state.obstacles.map((obstacle) =>
        obstaclePose(obstacle.index, state.obstacleClock),
      ),
    }),
    setScreen: (state, screen) => ({ ...state, screen }),
    setMode: (state, mode) => ({ ...state, mode }),
    setMenuIndex: (state, menuIndex) => ({ ...state, menuIndex }),
    setTitleIndex: (state, titleIndex) => ({ ...state, titleIndex }),
    setResumeScreen: (state, resumeScreen) => ({ ...state, resumeScreen }),
    setScore: (state, p1, p2) => ({ ...state, score: { p1, p2 } }),
    setWinner: (state, winner) => ({ ...state, winner }),
    setReceiver: (state, receiver) => ({ ...state, receiver }),
    setPaddleCy: (state, side, cy) =>
      setPaddle(state, side, { ...state.paddles[side], cy }),
    setPaddleVy: (state, side, drivenVy) =>
      setPaddle(state, side, { ...state.paddles[side], drivenVy }),
    setPaddleDriven: (state, side, driven) =>
      setPaddle(state, side, { ...state.paddles[side], driven }),
    setBallPosition: (state, x, y) =>
      replaceBall(state, { ...ballOrThrow(state), x, y }),
    setBallVelocity: (state, vx, vy) =>
      replaceBall(state, { ...ballOrThrow(state), vx, vy }),
    setBallSpin: (state, spin) =>
      replaceBall(state, { ...ballOrThrow(state), spin }),
    setBallHeld: (state, held) =>
      replaceBall(state, { ...ballOrThrow(state), held }),
    setBallHoldTimer: (state, holdTimer) =>
      replaceBall(state, { ...ballOrThrow(state), holdTimer }),
    setBallServeSign: (state, serveSign) =>
      replaceBall(state, { ...ballOrThrow(state), serveSign }),
    drawBallServeSign: (state) =>
      replaceBall(state, { ...ballOrThrow(state), serveSign: signDraw() }),
    setAiTracking: (state, tracking) => ({
      ...state,
      ai: { ...state.ai, tracking },
    }),
    setAiMovement: (state, movement) => ({
      ...state,
      ai: { ...state.ai, movement },
    }),
    setMuted: (state, muted) => ({ ...state, muted }),
    setObstacleClock: (state, obstacleClock) => ({
      ...state,
      obstacleClock,
      obstacles: state.obstacles.map((obstacle) =>
        obstaclePose(obstacle.index, obstacleClock),
      ),
    }),
    setObstacleClockRunning: (state, obstacleClockRunning) => ({
      ...state,
      obstacleClockRunning,
    }),
    snapshot,
    menuItemRect: menuItemRectFor,
  };
}

function registerDiagnostics(api: InitApi<CaromState>): void {
  api.diagnostics.register("screen", (state) => state.screen);
  api.diagnostics.register("mode", (state) => state.mode);
  api.diagnostics.register(
    "score",
    (state) => `${state.score.p1}-${state.score.p2}`,
  );
  api.diagnostics.register("ball pos", (state) =>
    state.ball ? `${state.ball.x.toFixed(1)}, ${state.ball.y.toFixed(1)}` : "-",
  );
  api.diagnostics.register("ball vel", (state) =>
    state.ball
      ? `${state.ball.vx.toFixed(1)}, ${state.ball.vy.toFixed(1)}`
      : "-",
  );
  api.diagnostics.register("ball speed", (state) =>
    state.ball ? speed(state.ball) : 0,
  );
  api.diagnostics.register("ball spin", (state) =>
    state.ball ? state.ball.spin : 0,
  );
  api.diagnostics.register(
    "p1",
    (state) =>
      `${state.paddles.left.cy.toFixed(1)}, ${state.paddles.left.vy.toFixed(1)}`,
  );
  api.diagnostics.register(
    "p2",
    (state) =>
      `${state.paddles.right.cy.toFixed(1)}, ${state.paddles.right.vy.toFixed(1)}`,
  );
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

function drawPaddle(
  ctx: CanvasRenderingContext2D,
  side: Side,
  paddle: DeepReadonly<PaddleState>,
): void {
  const x = side === "left" ? P1_X0 : P2_X0;
  const color = side === "left" ? LEFT_COLOR : RIGHT_COLOR;
  ctx.shadowColor = color;
  ctx.shadowBlur = 20;
  ctx.fillStyle = color;
  drawRoundedRect(ctx, x, paddle.cy - PADDLE_HALF, PADDLE_W, PADDLE_H, 8);
  ctx.shadowBlur = 0;
}

function drawBall(
  ctx: CanvasRenderingContext2D,
  ball: DeepReadonly<BallState>,
): void {
  if (ball.trail.length > 1) {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (let i = 1; i < ball.trail.length; i += 1) {
      const a = ball.trail[i - 1];
      const b = ball.trail[i];
      if (!a || !b) continue;
      const alpha = i / ball.trail.length;
      ctx.strokeStyle = `rgba(255, 244, 168, ${0.08 + alpha * 0.34})`;
      ctx.lineWidth = 4 + alpha * 10;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  }
  ctx.shadowColor = BALL_COLOR;
  ctx.shadowBlur = 18;
  ctx.fillStyle = BALL_COLOR;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawField(
  state: DeepReadonly<CaromState>,
  ctx: CanvasRenderingContext2D,
): void {
  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);
  const glow = ctx.createRadialGradient(
    FIELD_CX,
    FIELD_CY,
    80,
    FIELD_CX,
    FIELD_CY,
    560,
  );
  glow.addColorStop(0, "rgba(56, 214, 255, 0.10)");
  glow.addColorStop(1, "rgba(56, 214, 255, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);
  ctx.strokeStyle = "rgba(245, 251, 255, 0.16)";
  ctx.lineWidth = 2;
  ctx.setLineDash([18, 18]);
  ctx.beginPath();
  ctx.moveTo(NET_X, 36);
  ctx.lineTo(NET_X, FIELD_H - 36);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.strokeStyle = "rgba(245, 251, 255, 0.14)";
  ctx.strokeRect(24, 24, FIELD_W - 48, FIELD_H - 48);
  for (const obstacle of state.obstacles) {
    ctx.save();
    ctx.translate(obstacle.cx, obstacle.cy);
    ctx.rotate(obstacle.theta);
    ctx.shadowColor = OBSTACLE_COLOR;
    ctx.shadowBlur = 18;
    ctx.fillStyle = OBSTACLE_COLOR;
    drawRoundedRect(
      ctx,
      -OBSTACLE_W / 2,
      -OBSTACLE_H / 2,
      OBSTACLE_W,
      OBSTACLE_H,
      10,
    );
    ctx.restore();
  }
  drawPaddle(ctx, "left", state.paddles.left);
  drawPaddle(ctx, "right", state.paddles.right);
  if (state.ball) drawBall(ctx, state.ball);
}

function drawHud(
  state: DeepReadonly<CaromState>,
  ctx: CanvasRenderingContext2D,
): void {
  ctx.font = `700 48px ${MONO_FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = LEFT_COLOR;
  ctx.fillText(String(state.score.p1), FIELD_CX - 104, 34);
  ctx.fillStyle = RIGHT_COLOR;
  ctx.fillText(String(state.score.p2), FIELD_CX + 104, 34);
  ctx.font = `700 17px ${FONT}`;
  ctx.fillStyle = MUTED_TEXT;
  ctx.fillText(
    state.mode === "solo" ? "SOLO DUEL" : "VERSUS DUEL",
    FIELD_CX,
    94,
  );
  if (state.muted) ctx.fillText("MUTED", FIELD_W - 74, 32);
}

function drawMenu(
  state: DeepReadonly<CaromState>,
  ctx: CanvasRenderingContext2D,
  title: string,
  subtitle: string,
): void {
  ctx.fillStyle = PANEL;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (title.length > 0) {
    ctx.font = `900 82px ${FONT}`;
    ctx.fillStyle = TEXT;
    ctx.fillText(title, FIELD_CX, 158);
  }
  if (subtitle.length > 0) {
    ctx.font = `500 22px ${FONT}`;
    ctx.fillStyle = MUTED_TEXT;
    ctx.fillText(subtitle, FIELD_CX, 238);
  }
  const items = menuItems(state.screen);
  items.forEach((item, index) => {
    const rect = menuItemRectFor(state, index);
    if (!rect) return;
    const selected = index === state.menuIndex;
    ctx.shadowColor = selected ? "#ffffff" : "transparent";
    ctx.shadowBlur = selected ? 18 : 0;
    ctx.fillStyle = selected ? "#f5fbff" : "rgba(245, 251, 255, 0.08)";
    drawRoundedRect(ctx, rect.x, rect.y, rect.w, rect.h, 8);
    ctx.shadowBlur = 0;
    ctx.font = `800 24px ${FONT}`;
    ctx.fillStyle = selected ? BACKGROUND : TEXT;
    ctx.fillText(item, rect.x + rect.w / 2, rect.y + rect.h / 2 + 1);
  });
}

function drawHowTo(
  state: DeepReadonly<CaromState>,
  ctx: CanvasRenderingContext2D,
): void {
  ctx.fillStyle = PANEL;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `900 54px ${FONT}`;
  ctx.fillStyle = TEXT;
  ctx.fillText("HOW TO PLAY", FIELD_CX, 94);
  const lines = [
    "W/S moves the left paddle. Arrow keys move the right paddle in Versus.",
    "In Solo, either set of movement keys controls you while the right paddle defends.",
    "Strike while moving to add spin. The faster your paddle moves, the harder the curve.",
    "Bank through the rotating center bars to bend rallies around your opponent.",
    "First to 11 wins by 2. P or Escape pauses. M mutes.",
  ];
  ctx.font = `500 24px ${FONT}`;
  ctx.fillStyle = TEXT;
  lines.forEach((line, index) =>
    ctx.fillText(line, FIELD_CX, 188 + index * 52),
  );
  const itemState: CaromState = { ...state, screen: "howto" };
  menuItems("howto").forEach((item, index) => {
    const rect = menuItemRectFor(itemState, index);
    if (!rect) return;
    ctx.fillStyle = "#f5fbff";
    drawRoundedRect(ctx, rect.x, rect.y, rect.w, rect.h, 8);
    ctx.font = `800 24px ${FONT}`;
    ctx.fillStyle = BACKGROUND;
    ctx.fillText(item, rect.x + rect.w / 2, rect.y + rect.h / 2 + 1);
  });
}

function drawOverlayText(
  state: DeepReadonly<CaromState>,
  ctx: CanvasRenderingContext2D,
): void {
  if (state.screen === "countdown" && state.ball?.held) {
    ctx.font = `900 74px ${FONT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = TEXT;
    ctx.fillText(
      Math.max(1, Math.ceil(state.ball.holdTimer)).toString(),
      FIELD_CX,
      FIELD_CY - 92,
    );
  }
  if (state.screen === "paused") {
    drawMenu(
      state,
      ctx,
      "PAUSED",
      "Catch your breath, then angle the next shot.",
    );
  }
  if (state.screen === "matchover") {
    const winner =
      state.winner === "left" ? "PLAYER ONE WINS" : "PLAYER TWO WINS";
    drawMenu(
      state,
      ctx,
      winner,
      `Final score ${state.score.p1}-${state.score.p2}`,
    );
  }
}

export const game: Game<CaromState, CaromDebugApi> = {
  initialize(api: InitApi<CaromState>): [CaromState, CaromDebugApi] {
    for (const action of ACTIONS) {
      api.input.register(action, { keys: [...BINDINGS[action]] });
    }
    api.audio.define(CUES.paddleHit, {
      wave: "triangle",
      freq: 620,
      freqTo: 920,
      gain: 0.16,
      durationMs: 58,
    });
    api.audio.define(CUES.wallBounce, {
      wave: "sine",
      freq: 360,
      freqTo: 220,
      gain: 0.13,
      durationMs: 64,
    });
    api.audio.define(CUES.obstacleBounce, {
      wave: "square",
      freq: 480,
      freqTo: 160,
      gain: 0.12,
      durationMs: 72,
    });
    api.audio.define(CUES.score, {
      wave: "sawtooth",
      freq: 220,
      freqTo: 760,
      gain: 0.15,
      durationMs: 180,
    });
    registerDiagnostics(api);
    return [titleState(false), buildDebug()];
  },

  update(
    state: DeepReadonly<CaromState>,
    api: UpdateApi,
    dt: number,
  ): CaromState {
    let muted = api.audio.muted();
    if (api.input.pressed("mute")) {
      muted = !muted;
      api.audio.setMuted(muted);
    }
    let next = readMenuInput({ ...state, muted }, api);
    const simTime = state.simTime + dt;
    const events: FrameEvents = {
      paddleHit: false,
      wallBounce: false,
      obstacleBounce: false,
      score: false,
    };
    if (next.screen === "countdown" || next.screen === "playing") {
      next = advanceLive(next, api, dt, simTime, events);
    }
    playFrameCues(api, events);
    return { ...next, simTime, muted: api.audio.muted() };
  },

  render(state: DeepReadonly<CaromState>, api: RenderApi): void {
    const ctx = api.ctx;
    drawField(state, ctx);
    drawHud(state, ctx);
    if (state.screen === "title") {
      drawMenu(
        state,
        ctx,
        TITLE_TEXT,
        "Curved shots. Moving cover. One clean point.",
      );
    } else if (state.screen === "howto") {
      drawHowTo(state, ctx);
    } else {
      drawOverlayText(state, ctx);
    }
  },
};
