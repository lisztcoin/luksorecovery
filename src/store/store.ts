// All the global states required.

import { atom } from "jotai";

export const setupRecoveryAtom = atom({
    step: 0,
    unlockedStep: 3,
});

export const voteAtom = atom({
    step: 0,
    unlockedStep: 2,
    account: "",
});

export const recoverAtom = atom({
    step: 0,
    unlockedStep: 1,
    account: "",
});