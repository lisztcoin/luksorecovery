// All the global states required.

import { atom } from "jotai";

export const setupRecoveryAtom = atom({
    step: 0,
    unlockedStep: 3,
});