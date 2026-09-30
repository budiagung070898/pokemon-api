"use client";

import {
  BattlePokemon,
  BattleState,
  chooseAiMove,
  createBattle,
  resolveTurn,
  Side,
  TypeChart,
} from "@/lib/battle-engine";
import { useRef, useState } from "react";
import { deriveView, getEventDuration } from "../lib/battle-view";

export type BattlePhase = "choosing" | "animating" | "finished" | "replaying";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Battle controller: the engine state holds the truth, `shownCount` says how
 * many of its events the player has seen. Animating = revealing events one by
 * one; replay = revealing them again from zero; skip = revealing all at once.
 */
interface UseBattleOptions {
  /** Called once when a battle ends (not on replays). */
  onBattleEnd?: (winner: Side) => void;
}

export function useBattle(
  player: BattlePokemon,
  opponent: BattlePokemon,
  chart: TypeChart,
  { onBattleEnd }: UseBattleOptions = {},
) {
  const [state, setState] = useState<BattleState>(() => createBattle(player, opponent));
  const [shownCount, setShownCount] = useState(0);
  const [phase, setPhase] = useState<BattlePhase>("choosing");
  const [speed, setSpeedState] = useState(1);
  // Read inside the playback loop so speed changes apply mid-animation.
  const speedRef = useRef(1);
  // Incremented to cancel an in-flight playback (skip, replay, unmount-safe).
  const playbackId = useRef(0);

  const play = async (next: BattleState, from: number, endPhase: BattlePhase) => {
    const id = ++playbackId.current;

    for (let index = from; index < next.log.length; index++) {
      if (playbackId.current !== id) return;
      setShownCount(index + 1);
      await wait(getEventDuration(next.log[index], speedRef.current));
    }

    if (playbackId.current === id) setPhase(endPhase);
  };

  const chooseMove = (moveIndex: number) => {
    if (phase !== "choosing") return;

    const opponentMove = chooseAiMove(state.opponent, state.player, chart, Math.random);
    const { state: next } = resolveTurn(state, moveIndex, opponentMove, chart, Math.random);

    setState(next);
    setPhase("animating");
    if (next.winner) onBattleEnd?.(next.winner);
    void play(next, state.log.length, next.winner ? "finished" : "choosing");
  };

  const setSpeed = (value: number) => {
    speedRef.current = value;
    setSpeedState(value);
  };

  const skip = () => {
    playbackId.current++;
    setShownCount(state.log.length);
    setPhase(state.winner ? "finished" : "choosing");
  };

  const replay = () => {
    setShownCount(0);
    setPhase("replaying");
    void play(state, 0, "finished");
  };

  const rematch = () => {
    playbackId.current++;
    setState(createBattle(player, opponent));
    setShownCount(0);
    setPhase("choosing");
  };

  return {
    state,
    view: deriveView(state, shownCount),
    shownEvents: state.log.slice(0, shownCount),
    phase,
    speed,
    setSpeed,
    chooseMove,
    skip,
    replay,
    rematch,
  };
}
