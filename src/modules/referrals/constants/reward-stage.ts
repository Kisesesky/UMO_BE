// src/modules/referrals/constants/reward-stage.ts
export const REWARD_STAGE = {
  NONE: 'none',
  SIGNUP: 'signup',
  ACTION: 'action',
} as const;

export type RewardStage = typeof REWARD_STAGE[keyof typeof REWARD_STAGE];

export const REWARD_STAGE_VALUES = Object.values(REWARD_STAGE);
