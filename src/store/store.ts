// All the global states required.

import { atom } from "jotai";

export const setupRecoveryAtom = atom({
    step: 0,
    unlockedStep: 0,
});

export const voteAtom = atom({
    step: 0,
    unlockedStep: 0,
    account: "",
    processName: "",
});

export const recoverAtom = atom({
    step: 0,
    unlockedStep: 0,
    account: "",
});

export const profileLSP11ContractAtom = atom({
    address: ""
})