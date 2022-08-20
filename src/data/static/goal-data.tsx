import { utils } from "ethers";

// 0: active, 1: achieved, 2: abandoned
export function getGoalsByStatus(goals: any[], status: number): any[] {
  return goals.filter((goal) => utils.formatUnits(goal.status, 0) === status.toString());
}

export function getGoalsByAddress(goals: any[], address: string) {
  return goals.filter((goal) => goal.creator === address);
}

export function getGoalsOtherThanAddress(goals: any[], address: string) {
  return goals.filter((goal) => goal.creator != address);
}