import { createCanvas } from "@napi-rs/canvas";
import { ConstantClock, createEngine } from "@clockwyrks/simple-2d";
import { describe, expect, it } from "vitest";
import {
  BALL_R,
  FIELD_CY,
  FIELD_H,
  FIELD_W,
  HOLD_TIME,
  OBSTACLE_SPIN_RATE,
  P1_X1,
  PADDLE_SPEED,
  SERVE_SPEED,
} from "./constants";
import { BACKGROUND, type CaromDebugApi, type CaromState, game } from "./game";

function buildEngine(
  stepMs = 16,
): ReturnType<typeof createEngine<CaromState, CaromDebugApi>> {
  const events = new EventTarget();
  const canvas = createCanvas(FIELD_W, FIELD_H);
  return createEngine({
    canvas: canvas as unknown as HTMLCanvasElement,
    width: FIELD_W,
    height: FIELD_H,
    game,
    background: BACKGROUND,
    clock: new ConstantClock(stepMs),
    surface: {
      cssWidth: () => FIELD_W,
      cssHeight: () => FIELD_H,
      dpr: () => 1,
      events: () => events,
    },
  });
}

describe("Carom", () => {
  it("initializes the title state and debug readings", async () => {
    const engine = buildEngine();
    await engine.initialize();

    const shot = engine.debug.snapshot(engine.state);

    expect(shot.version).toBe(1);
    expect(shot.screen).toBe("title");
    expect(shot.mode).toBe("solo");
    expect(shot.score).toEqual({ p1: 0, p2: 0 });
    expect(shot.ball).toMatchObject({
      x: FIELD_W / 2,
      y: FIELD_H / 2,
      held: true,
      holdTimer: HOLD_TIME,
      speed: 0,
    });
    expect(shot.obstacles).toHaveLength(2);
    expect(engine.debug.menuItemRect(engine.state, 0)).not.toBeNull();
    expect(engine.diagnostics().map((reading) => reading.name)).toContain(
      "ball speed",
    );
  });

  it("serves after the countdown without advancing the ball on the serve frame", async () => {
    const engine = buildEngine(500);
    await engine.initialize();
    engine.apply((state) => engine.debug.setScreen(state, "countdown"));
    engine.apply((state) => engine.debug.setBallServeSign(state, 1));

    await engine.advance(1);
    expect(engine.debug.snapshot(engine.state).ball).toMatchObject({
      held: true,
      holdTimer: 0.5,
      x: FIELD_W / 2,
      y: FIELD_H / 2,
    });

    await engine.advance(1);
    const ball = engine.debug.snapshot(engine.state).ball;
    expect(engine.state.screen).toBe("playing");
    expect(ball?.held).toBe(false);
    expect(ball?.speed).toBeCloseTo(SERVE_SPEED, 5);
    expect(ball?.x).toBe(FIELD_W / 2);
    expect(ball?.y).toBe(FIELD_H / 2);
  });

  it("scores and parks the next serve for the side scored on", async () => {
    const engine = buildEngine();
    await engine.initialize();
    engine.apply((state) => engine.debug.setScreen(state, "playing"));
    engine.apply((state) => engine.debug.setBallHeld(state, false));
    engine.apply((state) =>
      engine.debug.setBallPosition(state, FIELD_W + BALL_R + 2, FIELD_CY),
    );
    engine.apply((state) => engine.debug.setBallVelocity(state, 20, 0));

    await engine.advance(1);
    const shot = engine.debug.snapshot(engine.state);

    expect(shot.score).toEqual({ p1: 1, p2: 0 });
    expect(shot.receiver).toBe("right");
    expect(shot.screen).toBe("countdown");
    expect(shot.ball).toMatchObject({ x: FIELD_W / 2, held: true });
  });

  it("adds spin from a driven paddle at contact", async () => {
    const engine = buildEngine(16);
    await engine.initialize();
    engine.apply((state) => engine.debug.clearWorld(state));
    engine.apply((state) => engine.debug.spawnBall(state));
    engine.apply((state) => engine.debug.setScreen(state, "playing"));
    engine.apply((state) => engine.debug.setBallHeld(state, false));
    engine.apply((state) =>
      engine.debug.setBallPosition(state, P1_X1 + BALL_R + 2, FIELD_CY),
    );
    engine.apply((state) => engine.debug.setBallVelocity(state, -520, 0));
    engine.apply((state) =>
      engine.debug.setPaddleVy(state, "left", PADDLE_SPEED),
    );
    engine.apply((state) => engine.debug.setPaddleDriven(state, "left", true));

    await engine.advance(1);
    const shot = engine.debug.snapshot(engine.state);

    expect(shot.ball?.vx).toBeGreaterThan(0);
    expect(shot.ball?.spin).toBeGreaterThan(0);
    expect(shot.paddles.left.vy).toBeGreaterThan(0);
  });

  it("reconciles obstacle poses from the obstacle clock", async () => {
    const engine = buildEngine();
    await engine.initialize();
    engine.apply((state) => engine.debug.setObstacleClock(state, 1.25));
    const shot = engine.debug.snapshot(engine.state);

    expect(shot.obstacles[0]?.theta).toBeCloseTo(OBSTACLE_SPIN_RATE * 1.25);
    expect(shot.obstacleClock).toBe(1.25);
  });
});
