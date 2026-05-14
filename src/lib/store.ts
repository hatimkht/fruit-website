"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type BallotDraft = {
  first?: string;
  second?: string;
  third?: string;
};

type Store = {
  ballot: BallotDraft;
  setPreference: (rank: 1 | 2 | 3, partyId: string | undefined) => void;
  reset: () => void;
  isComplete: () => boolean;
};

/**
 * Client-side ballot state. Persisted to localStorage so users can step back
 * without losing their picks. Cleared on `reset()` after successful submit.
 */
export const useBallotStore = create<Store>()(
  persist(
    (set, get) => ({
      ballot: {},
      setPreference: (rank, partyId) =>
        set((s) => ({
          ballot: {
            ...s.ballot,
            ...(rank === 1 ? { first: partyId } : {}),
            ...(rank === 2 ? { second: partyId } : {}),
            ...(rank === 3 ? { third: partyId } : {}),
          },
        })),
      reset: () => set({ ballot: {} }),
      isComplete: () => {
        const { first, second, third } = get().ballot;
        return Boolean(first && second && third) && first !== second && first !== third && second !== third;
      },
    }),
    {
      name: "rcv.ballot.v1",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
