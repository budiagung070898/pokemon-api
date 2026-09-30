"use client";

import {
  BattlePokemon,
  BattleState,
  chooseAiMove,
  createBattle,
  PlayerAction,
  resolveTurn,
  Side,
  TypeChart,
} from "@/lib/battle-engine";
import { useRef, useState } from "react";
import { deriveView, getEventDuration } from "../lib/battle-view";

export type BattlePhase = "choosing" | "animating" | "finished" | "replaying";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface UseBattleOptions {
  /** Player's starting HP; defaults to full. */
  playerHp?: number;
  /** Called once when a battle ends (not on replays), with the final state. */
  onBattleEnd?: (winner: Side, state: BattleState) => void;
}

/**
 * Battle controller: the engine state holds the truth, `shownCount` says how
 * many of its events the player has seen. Animating = revealing events one by
 * one; replay = revealing them again from zero; skip = revealing all at once.
 */
export function useBattle(
  player: BattlePokemon,
  opponent: BattlePokemon,
  chart: TypeChart,
  { playerHp, onBattleEnd }: UseBattleOptions = {},
) {
  const newBattle = () => createBattle(player, opponent, { playerHp });
  const [state, setState] = useState<BattleState>(newBattle);
  const [shownCount, setShownCount] = useState(0);
  const [phase, setPhase] = useState<BattlePhase>("choosing");
  const [speed, setSpeedState] = useState(1);
  // Read inside the playback loop so speed changes apply mid-animation.
  const speedRef = useRef(1);
  // Incremented to cancel an in-flight playback (skip, replay, rematch).
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

  const act = (action: PlayerAction) => {
    if (phase !== "choosing") return;

    const opponentMove = chooseAiMove(state.opponent, state.player, chart, Math.random);
    const { state: next } = resolveTurn(state, action, opponentMove, chart, Math.random);

    setState(next);
    setPhase("animating");
    if (next.winner) onBattleEnd?.(next.winner, next);
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
    setState(newBattle());
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
    chooseMove: (index: number) => act({ type: "move", index }),
    healWithItem: (item: string, heal: number) => act({ type: "item", item, heal }),
    skip,
    replay,
    rematch,
  };
}
